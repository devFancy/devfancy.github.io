---
layout: post
title: " MDC와 GlobalTraceId를 활용한 분산 추적 "
categories: SpringBoot
author: devFancy
---

* content
{:toc}

## Prologue

이번 글에서는 분산 시스템 환경에서 서로 다른 서버의 로그에 동일한 TraceId를 적용한 과정을 간단하게 정리해보고자 한다.

* 분산 아키텍처에서는 하나의 요청이 여러 서비스(예: API 서버, 메시지 큐 컨슈머)를 거쳐 처리되는 경우가 많다.

  이때 각 시스템에 분산된 로그를 하나의 흐름으로 묶어 추적할 수 없다면, 장애 발생 시 원인을 파악하기 매우 어려워진다.

* 현재 진행 중인 개인 프로젝트(쿠폰 시스템)에서 쿠폰 발급 요청이

  API 서버에서 시작되어 카프카(Kafka)를 통해 컨슈머 서버로 전달되는 과정이 있다.

  이 두 서버의 로그에 동일한 식별자를 부여하여 요청 흐름을 쉽게 추적할 수 있도록 `GlobalTraceId`를 적용한 경험을 공유한다.

> `참고`: 본 글에서 소개되는 코드 예시는 현재 시점의 구현을 바탕으로 작성되었으며, 프로젝트가 발전함에 따라 내용이 변경되거나 개선될 수 있음을 미리 알려드립니다.
>
> 이 글에서 다루는 모든 코드는 [깃허브](https://github.com/devFancy/springboot-coupon-system)에서 확인하실 수 있습니다.


---

## 현재 상황: 분리된 로그의 파편

현재 쿠폰 발급 API는 요청을 받으면 내부 로직을 처리한 후, 최종 데이터 저장을 위해 카프카에 메시지를 발행(produce)한다.

그리고 별도의 컨슈머 애플리케이션이 이 메시지를 구독(consume)하여 데이터베이스에 저장하는 구조를 가진다.

핵심 흐름은 다음과 같다.

* HTTP Request -> `쿠폰 API 서버` -> Kafka Producer -> Kafka Consumer -> `컨슈머 서버` -> DB 저장

이 구조에서 Spring Boot Actuator와 Micrometer Tracing 같은 라이브러리를 사용하면 각 애플리케이션 내에서는 `traceId`와 `spanId`가 자동으로 생성되어 로그에 포함된다.

문제는 **API 서버에서 생성된 `traceId`가 카프카를 거쳐 컨슈머 서버로 전파되지 않는다는 점**이다.

카프카는 메시지를 전달할 뿐, 생산자(Producer)의 실행 컨텍스트(MDC 정보 포함)를 소비자(Consumer)에게 자동으로 넘겨주지 않는다.

결과적으로 컨슈머는 새로운 요청으로 인지하고, 완전히 새로운 `traceId`를 생성하게 된다.

> MDC 컨텍스트가 전파되지 않는 이유

* `MDC`(Mapped Diagnostic Context)는 스레드 로컬(thread-local)에 데이터를 저장하여 로깅 프레임워크(Logback 등)가 참조할 수 있도록 하는 SLF4J의 기능이다.

* Micrometer Tracing은 이 MDC에 `traceId`와 `spanId`를 저장하여 로그에 컨텍스트 정보가 남도록 한다.

* 그러나 API 서버의 요청 처리 스레드와 컨슈머의 메시지 처리 스레드는 완전히 분리되어 있다.

* 따라서 API 서버의 MDC 정보는 카프카 메시지와 함께 자동으로 전송되지 않아 컨슈머의 MDC에서 조회할 수 없다. 이로 인해 두 서버의 로그가 단절되는 것이다.

아래 로그를 보면, 두 서버의 `traceId`가 서로 다른 것을 명확히 확인할 수 있다.


> API 서버 로그 (traceId: `6852b11d...`)

```bash
21:29:03.238| INFO|6852b11d60ddb3445244ba6270080315,5244ba6270080315|d.b.c.a.c.i.r.aop.DistributedLockAop    |락 획득 성공...
21:29:03.268| INFO|6852b11d60ddb3445244ba6270080315,5244ba6270080315|d.b.c.a.c.application.CouponService     |중복 발급 요청 감지...
```

> 컨슈머 서버 로그 (traceId: `6852b10f...`)

```bash
21:29:03.404| INFO|6852b10febe4df79b383d66d36df8483,b383d66d36df8483|d.b.c.k.c.a.CouponIssueConsumer         |발급 처리 메시지 수신...
21:29:03.488| INFO|6852b10febe4df79b383d66d36df8483,b383d66d36df8483|d.b.c.k.c.a.CouponIssueConsumer         |쿠폰 발급 완료...
```

## 해결 방안: GlobalTraceId를 이용한 수동 전파

> GlobalTraceId를 개인 프로젝트에 적용한 부분과 관련된 코드는 깃허브 [PR](https://github.com/devFancy/springboot-coupon-system/pull/33) 에서 확인할 수 있다.

이 문제를 해결하기 위해 전체 요청 흐름을 관통하는 단일 식별자인 `GlobalTraceId`를 도입한다.

이 ID를 HTTP 요청의 시작점에서 생성하고, 카프카 메시지 헤더를 통해 컨슈머까지 명시적으로 전달하는 것이다.

* 참고) Micrometer의 자동 전파 기능과 `GlobalTraceId`의 차이점

    * Spring Boot 3.x 환경에서 `micrometer-tracing-bridge-brave`나 `micrometer-tracing-bridge-otel` 의존성을 추가하면,
      Micrometer가 자동으로 Kafka Producer와 Consumer를 계측하여 트레이스 컨텍스트(traceId, spanId)를 전파해 준다.
      Spring Boot 2.x에서는 Spring Cloud Sleuth가 이 역할을 했다.

    * 하지만 이 글에서 다루는 `GlobalTraceId`는 필자가 **직접 만든 커스텀 필드**이므로 이러한 자동 전파의 대상이 아니다.
      이처럼 라이브러리가 모르는 커스텀 식별자를 서비스 간에 전달해야 할 때는,
      이 글에서 소개한 것처럼 **직접 헤더에 담아 전달하는 수동 전파 방식**이 필요하다.

    * 이는 분산 추적의 핵심 원리를 이해하고 우리가 원하는 식별자를 직접 제어할 수 있다는 장점이 있다.

### 1. Logback 설정: GlobalTraceId 출력 필드 추가

먼저, 로그 패턴에 `GlobalTraceId`를 출력할 수 있도록 `logback-spring.xml` 설정에 globalTraceId 필드를 추가한다.

이 필드는 MDC에 해당 키가 존재할 경우 그 값을 출력한다.

> logback-local.xml

```xml

<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>
                %clr(%d{HH:mm:ss.SSS}){faint}|%clr(${level:-%5p})|%32X{globalTraceId:-}|%32X{traceId:-},%16X{spanId:-}|%clr(%-40.40logger{39}){cyan}%clr(|){faint}%m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}
            </pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>
</configuration>
```

### 2. Filter: GlobalTraceId 생성 및 MDC 적용

HTTP 요청이 들어오는 가장 앞단에서 `GlobalTraceId`를 생성하거나,

외부 시스템으로부터 이미 전달받았다면 해당 값을 사용하도록 필터를 구현한다.

* 요청 헤더에 `X-Global-Trace-Id`가 있으면 그 값을 사용한다.

* 없으면 `UUID`를 이용해 새로운 ID를 생성한다.

* 생성된 ID를 MDC에 `globalTraceId`라는 키로 저장하여 이후의 모든 로그에 기록될 수 있도록 한다.

* 요청 처리가 끝나면 반드시 `MDC.remove()`를 호출하여 메모리 누수를 방지한다.

> HttpRequestAndResponseLoggingFilter.java

```java
public class HttpRequestAndResponseLoggingFilter extends OncePerRequestFilter {

    private static final String GLOBAL_TRACE_ID_HEADER = "X-Global-Trace-Id";
    private static final String GLOBAL_TRACE_ID_KEY = "globalTraceId";

    @Override
    protected void doFilterInternal(@NonNull final HttpServletRequest request,
                                    @NonNull final HttpServletResponse response,
                                    @NonNull final FilterChain filterChain) {
        // 중간 생략 (request/response wrapper)

        String globalTraceId = request.getHeader(GLOBAL_TRACE_ID_HEADER);
        if (!StringUtils.hasText(globalTraceId)) {
            globalTraceId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 32);
        }
        MDC.put(GLOBAL_TRACE_ID_KEY, globalTraceId);

        try {
            filterChain.doFilter(request, response);
            // 중간 생략 (로깅 처리)
        } catch (Exception e) {
            // 중간 생략 (예외 처리)
        } finally {
            // 요청 처리가 끝나면 반드시 MDC에서 제거해야 한다.
            MDC.remove(GLOBAL_TRACE_ID_KEY);
        }
    }
    // 뒷부분 생략
}
```

### 3.Kafka Producer: 메시지 헤더에 GlobalTraceId 주입

API 서버에서 카프카로 메시지를 보낼 때, 현재 스레드의 MDC에서 `globalTraceId`를 꺼내 카프카 메시지 헤더에 추가한다.

이 헤더가 바로 서버 간 컨텍스트를 이어주는 **다리 역할**을 한다.

> CouponIssueProducer.java

```java

@Component
public class CouponIssueProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String GLOBAL_TRACE_ID_HEADER = "globalTraceId";
    private static final Logger log = LoggerFactory.getLogger(CouponIssueProducer.class);

    // 중간 생략 (생성자)

    /**
     * 쿠폰 발급 요청 메시지를 동기적으로 Kafka에 발행한다.
     * .join()을 호출하여 메시지 전송이 완료될 때까지 현재 스레드를 블로킹한다.
     */
    public void issue(final UUID userId, final UUID couponId) {
        CouponIssueMessage payload = new CouponIssueMessage(userId, couponId);
        String globalTraceId = MDC.get("globalTraceId");

        ProducerRecord<String, Object> record = new ProducerRecord<>(KafkaTopic.COUPON_ISSUE.getTopicName(), payload);

        if (globalTraceId != null) {
            record.headers().add(GLOBAL_TRACE_ID_HEADER, globalTraceId.getBytes(StandardCharsets.UTF_8));
        }

        kafkaTemplate.send(record).whenComplete((result, ex) -> {
            // ...
        }).join();
    }
}
```

### 4. Kafka Consumer: 헤더에서 GlobalTraceId 추출 및 MDC 탑재

마지막으로, 컨슈머는 메시지를 수신할 때 헤더에 포함된 `globalTraceId`를 추출하여 자신의 MDC에 설정한다.

이로써 컨슈머에서 발생하는 모든 로그에도 API 서버와 동일한 `GlobalTraceId`가 남게 된다.

> CouponIssueConsumer.java

```java

@Component
public class CouponIssueConsumer {

    private final CouponIssuanceService couponIssuanceService;
    private final Logger log = LoggerFactory.getLogger(CouponIssueConsumer.class);
    private static final String GLOBAL_TRACE_ID_KEY = "globalTraceId";

    // 중간 생략 (생성자)

    /**
     * Kafka 토픽으로부터 메시지를 수신하여 쿠폰을 발급한다.
     */
    @KafkaListener(topics = "...", groupId = "...")
    public void listener(final CouponIssueMessage message,
                         @Header(name = GLOBAL_TRACE_ID_KEY, required = false) final String globalTraceId,
                         final Acknowledgment ack) {

        if (!Objects.isNull(globalTraceId)) {
            MDC.put(GLOBAL_TRACE_ID_KEY, globalTraceId);
        }
        log.info("발급 처리 메시지 수신: {}", message);

        try {
            couponIssuanceService.process(message);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("메시지 처리 실패, 재처리를 위해 커밋하지 않음: {}", message, e);
        } finally {
            // 메시지 처리가 끝나면 반드시 MDC에서 제거한다.
            MDC.remove(GLOBAL_TRACE_ID_KEY);
        }
    }
}
```

## 결과: 통합된 로그

이제 다시 애플리케이션 2대를 실행하고, API 테스트 도구(예. Postman)를 사용하여 쿠폰 발급 요청을 보낼 때, 헤더에 `X-Global-Trace-Id`를 담아 보내보자

* (예: X-Global-Trace-Id: gtxid-coupon-issue-test)

> API 서버 로그 (GlobalTraceId가 gtxid-coupon-issue-test로 동일)

```bash
21:49:30.685| INFO|         gtxid-coupon-issue-test|...|d.b.c.a.c.i.r.aop.DistributedLockAop    |락 획득 성공...
21:49:30.704| INFO|         gtxid-coupon-issue-test|...|d.b.c.a.c.application.CouponService     |쿠폰 발급 요청 Kafka 전송 성공...
21:49:30.711| INFO|         gtxid-coupon-issue-test|...|.f.v.HttpRequestAndResponseLoggingFilter|[REQUEST] POST /api/coupon/...
```

> 컨슈머 서버 로그 (GlobalTraceId가 gtxid-coupon-issue-test로 동일)

```bash
21:49:30.821| INFO|         gtxid-coupon-issue-test|...|d.b.c.k.c.a.CouponIssueConsumer         |발급 처리 메시지 수신...
21:49:30.825| INFO|         gtxid-coupon-issue-test|...|d.b.c.k.c.a.CouponIssueConsumer         |쿠폰 발급 완료...
```

---

만약 헤더에 `X-Global-Trace-Id`를 보내지 않더라도 필터에서 랜덤 ID(98ac71d9...)가 생성되어 API 서버와 컨슈머 서버에서 동일하게 사용되는 것을 확인할 수 있다.

> API 서버 로그 (랜덤 생성된 GlobalTraceId)

```bash
21:46:15.394| INFO|98ac71d934194fd59a2fb04b94021234|...|d.b.c.a.c.i.r.aop.DistributedLockAop    |락 획득 성공...
21:46:15.685| INFO|98ac71d934194fd59a2fb04b94021234|...|d.b.c.a.c.application.CouponService     |쿠폰 발급 요청 Kafka 전송 성공...
```

> 컨슈머 서버 로그 (API 서버와 동일한 GlobalTraceId)

```bash
21:46:15.779| INFO|98ac71d934194fd59a2fb04b94021234|...|d.b.c.k.c.a.CouponIssueConsumer         |발급 처리 메시지 수신...
21:46:15.846| INFO|98ac71d934194fd59a2fb04b94021234|...|d.b.c.k.c.a.CouponIssueConsumer         |쿠폰 발급 완료...
```

두 서버의 로그에 동일한 `GlobalTraceId`가 남음으로써, 특정 요청의 전체 처리 과정을 한눈에 추적할 수 있게 되었다.

이제 로그 분석 시스템에서 `globalTraceId`로 필터링하기만 하면 분산된 로그를 손쉽게 모아볼 수 있다.

## Summary

위의 내용을 간단히 정리하면 아래와 같다.

* `문제점`: 분산 시스템(MSA) 환경에서 서비스 간 호출(예. 메시지 큐) 시, 각 시스템의 로그가 별도의 `traceId`를 가져 추적이 어렵다.

* `원인`: 스레드 기반의 `MDC` 컨텍스트는 비동기/프로세스 경계를 넘어서 자동으로 전파되지 않는다.

* `해결책`: 전체 트랜잭션을 대표하는 `GlobalTraceId`를 정의하고, 이를 서비스 간 통신(HTTP 헤더, Kafka 메시지 헤더 등)을 통해 명시적으로 전달한다.

* `구현`

    * 최초 진입점(Filter)에서 GlobalTraceId를 생성하여 MDC에 저장한다.

    * 프로듀서에서 메시지 발행 시 MDC의 GlobalTraceId를 메시지 헤더에 포함시킨다.

    * 컨슈머에서 메시지 수신 시 헤더의 GlobalTraceId를 추출하여 MDC에 다시 저장한다.

* `결과`: 모든 분산 로그에 동일한 식별자가 기록되어, **Observability가 향상**되고 장애 추적이 용이해진다.

## References

* [[Github] micrometer](https://github.com/micrometer-metrics/micrometer)

* [Micrometer Tracing Documentation](https://micrometer.io/)

* [Spring Cloud Sleuth in a Monolith Application](https://www.baeldung.com/spring-cloud-sleuth-single-application)

* [토스ㅣSLASH 23 - 분산 추적 체계 & 로그 중심으로 Observability 확보하기](https://www.youtube.com/watch?v=Ifz0LsfAG94&ab_channel=%ED%86%A0%EC%8A%A4)
