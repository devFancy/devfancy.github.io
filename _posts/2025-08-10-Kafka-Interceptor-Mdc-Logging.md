---
layout: post
title:  " Kafka Interceptor로 MDC 로깅 분리하기 "
categories: [Kafka]
author: devFancy
---
* content
{:toc}

## Prologue

이번 글에서는 비즈니스 로직과 MDC 같은 로깅 기술을 분리하고자 

Kafka Interceptor를 도입했고, 어떻게 적용했는지 정리하고자 한다.


> 이 글에서 다루는 모든 코드는 [깃허브](https://github.com/devFancy/springboot-coupon-system)에서 확인하실 수 있습니다.
>
> `참고`: 본 글에서 소개되는 코드 예시는 현재 시점의 구현을 바탕으로 작성되었으며, 프로젝트가 발전함에 따라 내용이 변경되거나 개선될 수 있음을 미리 알려드립니다.


---

## 왜 인터셉터를 도입했을까?

이전 글인 [MDC와 GlobalTraceId를 활용한 분산 추적](https://devfancy.github.io/SpringBoot-Distributed-Tracing-With-MDC/)에서 한 가지 아쉬운 점이 있었다.

바로 비즈니스 로직에 MDC를 설정하고 제거하는 코드가 섞여 있어, 코드의 순수성을 해친다는 점이다.

만약 현재 비즈니스 로직이 변하지 않고 계속 유지된다면 상관이 없지만,

쿠폰 시스템이 확장되어 다양한 종류의 메시지를 보내게 되는 프로듀서가 10개, 20개 이상으로 늘어나게 된다면,

모든 프로듀서마다 개발자가 직접 MDC 코드를 추가해야 하는 부분이 있다.

이 과정에서 코드가 중복되고, 누군가 실수를 하거나 특정 프로듀서에 해당 MDC 관련 부분을 누락할 위험이 있다.

그리고 만약 Trace ID를 담는 헤더의 키 이름(`globalTraceId`)를 변경해야 하거나 로직을 수정해야 할 경우,

관련된 모든 프로듀서와 컨슈머 코드를 일일이 찾아서 수정해야 하는 번거로움이 있다. 이는 유지보수 비용을 크게 증가시킨다.

이런 문제를 해결하기 위해 Kafka Interceptor를 도입했다. 인터셉터를 쓰면 이런 장점이 있다.

* MDC 로깅 관련 코드를 한곳에서 중앙 관리할 수 있다.

* 비즈니스 로직은 순수하게 자신의 역할에만 집중할 수 있다.

* 로깅 정책이 바뀌어도 인터셉터 코드만 수정하면 되므로 관리가 편하다.

결론적으로, 인터셉터는 앞으로 서비스가 커지더라도 더 빠르고 안전하게 새로운 기능을 추가할 수 있다.

## Kafka Interceptor란

Kafka Interceptor는 프로듀서나 컨슈머의 핵심 로직을 건드리지 않고, 메시지를 가로채서 특정 부가 기능을 추가할 수 있게 해주는 AOP(관점 지향 프로그래밍)와 비슷한 개념이다.

### 프로듀서 인터셉터

`ProducerInterceptor` 인터페이스를 구현하면, 프로듀서가 받은 레코드(record)가 카프카 클러스터로 발행되기 전에 해당 레코드를 **가로채거나 변경**할 수 있다.

(기본적으로 설정된 인터셉터는 없다)

* 타입: list (리스트)

* 기본값: "" (빈 문자열)

* 유효한 값: null이 아닌 문자열

* 중요도: low (낮음)

### 컨슈머 인터셉터

`ConsumerInterceptor` 인터페이스를 구현하면, 컨슈머가 받은 레코드를 가로채거나 변경할 수 있다.

타입, 기본값, 유효한 값, 중요도는 프로듀서와 동일하다.

## 기존 코드의 문제점

인터셉터를 적용하기 전 코드는 아래와 같았다. 비즈니스 로직 곳곳에 MDC 코드가 섞여 있는 것을 볼 수 있다.

> CouponIssueProducer.java (Before)

```java
@Component
public class CouponIssueProducer {
    // ...
    public void issue(final UUID userId, final UUID couponId) {
        CouponIssueMessage payload = new CouponIssueMessage(userId, couponId);
        // 비즈니스 로직에 섞여 있는 MDC 코드
        String globalTraceId = MDC.get("globalTraceId");

        ProducerRecord<String, Object> record = new ProducerRecord<>(KafkaTopic.COUPON_ISSUE.getTopicName(), payload);

        // 헤더를 직접 추가하는 로직
        if (globalTraceId != null) {
            record.headers().add(GLOBAL_TRACE_ID_HEADER, globalTraceId.getBytes(StandardCharsets.UTF_8));
        }

        kafkaTemplate.send(record).whenComplete((result, ex) -> {
            //...
        }).join();
    }
}
```

> CouponIssueConsumer.java (Before)

```java
@Component
public class CouponIssueConsumer {
    
    // ...
    @KafkaListener(topics = "...", groupId = "...")
    public void listener(final CouponIssueMessage message,
                         @Header(name = GLOBAL_TRACE_ID_KEY, required = false) final String globalTraceId,
                         final Acknowledgment ack) {
        
        // 비즈니스 로직에 섞여 있는 MDC 설정 코드
        if (!Objects.isNull(globalTraceId)) {
            MDC.put(GLOBAL_TRACE_ID_KEY, globalTraceId);
        }
        log.info("발급 처리 메시지 수신: {}", message);

        try {
            couponIssuanceService.process(message);
            ack.acknowledge();
        } catch (Exception e) {
            // ...
        } finally {
            // try-finally로 직접 MDC를 제거해야 하는 번거로움
            MDC.remove(GLOBAL_TRACE_ID_KEY);
        }
    }
}
```


## 인터셉터로 개선하기

이제 인터셉터를 적용해서 이 문제들을 해결해 보자.

### 1. 프로듀서 인터셉터 적용

프로듀서에서는 Kafka가 기본으로 제공하는 `ProducerInterceptor` 를 사용한다.

> KafkaProducerConfig.java

```java
@Configuration
public class KafkaProducerConfig {
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        // ... (부트스트랩 서버, 직렬화 등 필수 설정)
        // 여기에 인터셉터 클래스를 지정해준다.
        config.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG, MdcProducerInterceptor.class.getName());
        return new DefaultKafkaProducerFactory<>(config);
    }
    // ...
}
```

> MdcProducerInterceptor.java

```java
// Spring Bean이 아니므로 @Component를 붙이지 않는다.
public class MdcProducerInterceptor implements ProducerInterceptor<String, Object> {

    private static final String GLOBAL_TRACE_ID_KEY = "globalTraceId";

    /**
     * Kafka 브로커로 메시지를 보내기 전에 호출합니다.
     */
    @Override
    public ProducerRecord<String, Object> onSend(ProducerRecord<String, Object> record) {
        String globalTraceId = MDC.get(GLOBAL_TRACE_ID_KEY);
        // MDC에서 Trace ID를 꺼내 헤더에 추가한다.
        if (globalTraceId != null) {
            record.headers().add(GLOBAL_TRACE_ID_KEY, globalTraceId.getBytes(StandardCharsets.UTF_8));
        }
        return record;
    }

    // 나머지 onAcknowledgement, close, configure 메서드는 비워둔다.
    // ...
}
```

### 2. 컨슈머 인터셉터 적용 (Spring-Kafka 방식)

컨슈머에서는 Kafka 네이티브 인터셉터 대신, Spring-Kafka가 제공하는 `RecordInterceptor`를 사용했다.

#### 왜 Spring-Kafka의 RecordInterceptor를 썼을까?

프로듀서처럼 똑같이 하면 될 텐데 왜 다른 방식을 썼을까? 가장 큰 이유는 바로 "Spring 생태계와의 통합성", 특히 "의존성 주입(DI)" 때문이다.

* Kafka 네이티브 인터셉터

  * 이 인터셉터는 Kafka 클라이언트 라이브러리가 직접 만들고 관리한다. 즉, Spring 컨테이너의 관리 밖에 있다.

  * 그래서 Spring의 @Autowired 같은 의존성 주입 기능을 쓸 수 없다.

* Spring-Kafka

  * 이 인터셉터는 그 자체가 Spring Bean이다.

  * 따라서 다른 서비스(Service)나 컴포넌트(Component) 같은 Spring Bean들을 아주 쉽게 주입받아 사용할 수 있다.

MDC 로깅처럼 간단한 작업은 큰 차이가 없다고 느낄 수 있지만, 

인터셉터 안에서 DB를 조회하거나 다른 비즈니스 로직이 필요한 복잡한 상황이 온다면

Spring-Kafka 방식이 더 깔끔하고 쉬운 방법이라 생각한다.

#### 어떻게 동작할까?

먼저 인터셉터 구현체에 `@Component`를 붙여 Spring Bean으로 만든다.

> MdcConsumerRecordInterceptor.java

```java
@Component // Spring Bean으로 등록해서 의존성 주입이 가능하게 한다.
public class MdcConsumerRecordInterceptor implements RecordInterceptor<String, CouponIssueMessage> {
    // ... (내용은 아래에서 설명)
}
```

그다음, `@KafkaListener`가 사용할 `ListenerContainerFactory`를 @Bean으로 등록할 때, 파라미터로 위에서 만든 인터셉터 Bean을 주입받는다.

> KafkaConsumerConfig.java

```java
@Configuration
public class KafkaConsumerConfig {
    // ... (ConsumerFactory 설정 생략)

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, CouponIssueMessage> kafkaListenerContainerFactory(
            ConsumerFactory<String, CouponIssueMessage> consumerFactory,
            // RecordInterceptor를 Spring Bean으로 주입받는다.
            RecordInterceptor<String, CouponIssueMessage> mdcRecordInterceptor
    ) {
        ConcurrentKafkaListenerContainerFactory<String, CouponIssueMessage> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        // ... (AckMode, Concurrency 등 기타 설정)

        // (중요) ListenerContainerFactory에 인터셉터를 등록한다.
        factory.setRecordInterceptor(mdcRecordInterceptor);
        return factory;
    }
}
```

이렇게 객체(Bean)를 직접 주입해서 설정하는 방식은, 단순히 클래스 이름(문자열)을 적는 네이티브 방식보다 더 유연하고 Spring다운 방식이다.

#### 실행 시점과 제어 범위

`RecordInterceptor`는 `@KafkaListener`가 붙은 내 비즈니스 로직이 **호출되기 바로 직전**에 동작한다. 

덕분에 MDC를 설정하고 제거하는 로직을 비즈니스 코드에서 완벽하게 분리할 수 있다.

> MdcConsumerRecordInterceptor.java

```java
@Component // Spring Bean으로 등록해서 의존성 주입이 가능하게 한다.
public class MdcConsumerRecordInterceptor implements RecordInterceptor<String, CouponIssueMessage> {

    private static final String GLOBAL_TRACE_ID_KEY = "globalTraceId";

    // @KafkaListener 메서드가 실행되기 직전에 호출된다.
    @Override
    public ConsumerRecord<String, CouponIssueMessage> intercept(
            @NonNull ConsumerRecord<String, CouponIssueMessage> record,
            @NonNull Consumer<String, CouponIssueMessage> consumer) {
        // 메시지 헤더에서 Trace ID를 꺼내 MDC에 설정한다.
        Header header = record.headers().lastHeader(GLOBAL_TRACE_ID_KEY);
        if (Objects.nonNull(header)) {
            String globalTraceId = new String(header.value(), StandardCharsets.UTF_8);
            MDC.put(GLOBAL_TRACE_ID_KEY, globalTraceId);
        }
        return record;
    }

    // @KafkaListener 메서드가 성공적으로 완료된 후 호출된다. (예외 없을 때)
    @Override
    public void success(
            @NonNull ConsumerRecord<String, CouponIssueMessage> record,
            @NonNull Consumer<String, CouponIssueMessage> consumer) {
        // 여기서 MDC를 정리한다.
        MDC.remove(GLOBAL_TRACE_ID_KEY);
    }

    // @KafkaListener 메서드에서 예외가 발생했을 때 호출된다.
    @Override
    public void failure(
            @NonNull ConsumerRecord<String, CouponIssueMessage> record,
            @NonNull Exception exception,
            @NonNull Consumer<String, CouponIssueMessage> consumer) {
        // 여기서도 마찬가지로 MDC를 정리한다.
        MDC.remove(GLOBAL_TRACE_ID_KEY);
    }
}
```

`success` 와 `failure` 메서드 덕분에, `try-finally` 블록 없이도 어떤 경우에든 MDC 리소스를 안전하게 정리할 수 있다.

### 적용 후 비즈니스 코드

인터셉터를 적용한 후, 프로듀서와 컨슈머 코드는 아래처럼 MDC 관련 코드가 완전히 사라져 간결해졌다.

> CouponIssueProducer.java (After)

```java
@Component
public class CouponIssueProducer {
    // ...
    public void issue(final UUID userId, final UUID couponId) {
        CouponIssueMessage payload = new CouponIssueMessage(userId, couponId);
        ProducerRecord<String, Object> record = new ProducerRecord<>(KafkaTopic.COUPON_ISSUE.getTopicName(), payload);
        // MDC 관련 코드가 완전히 사라졌다!
        kafkaTemplate.send(record).whenComplete((result, ex) -> {
            // ...
        }).join();
    }
}
```

> CouponIssueConsumer.java (After)

```java
@Component
public class CouponIssueConsumer {
    // ...
    @KafkaListener(topics = "...", groupId = "...")
    public void listener(final CouponIssueMessage message, final Acknowledgment ack) {
        // MDC 설정, 헤더 파라미터, try-finally 구문이 모두 사라졌다!
        log.info("발급 처리 메시지 수신: {}", message);
        try {
            couponIssuanceService.process(message);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("메시지 처리 실패, 재처리를 위해 커밋하지 않음: {}", message, e);
        }
    }
}
```

### 실행 결과 확인

이제 실제로 인터셉터가 잘 동작하는지 로그를 통해 확인해 보자.

#### 1. API 서버: 요청 시작 및 Trace ID 생성

가장 먼저 API 서버에서 HTTP 요청을 받고, `HttpRequestAndResponseLoggingFilter` 또는 유사한 메커니즘을 통해 globalTraceId (2d45fa...)가 생성되어 MDC에 설정된다.

```bash
20:14:21.258| INFO| 2d45fa75-31f3-42e3-a730-f1d195a2|...| d.b.c.a.c.application.CouponServiceImpl |쿠폰 발급 요청이 성공적으로 접수되었습니다. 잠시 후 '내 쿠폰함'에서 확인해 주세요
```

#### 2. API 서버: 프로듀서 인터셉터 동작

`CouponIssueProducer`가 메시지 전송을 시도하자, `KafkaProducerConfig`에 설정된 `MdcProducerInterceptor`가 호출되며 아래 로그를 남긴다.

여기서 새로 추가한 `DEBUG` 로그가 찍힌다.

```bash
20:14:21.317|DEBUG| 2d45fa75-31f3-42e3-a730-f1d195a2|...| d.b.c.i.k.i.MdcProducerInterceptor | [MdcProducerInterceptor] MDC 헤더 추가 [globalTraceId]: 2d45fa75-31f3-42e3-a730-f1d195a2
```

* 확인: MDC에서 Trace ID를 읽어 Kafka 메시지 헤더에 성공적으로 추가했다.


#### 3. Consumer 서버: 컨슈머 인터셉터 동작 확인

Consumer 서버가 메시지를 수신하자마자, `KafkaConsumerConfig`에 설정된 `MdcConsumerRecordInterceptor`가 동작하며 여기서 두 번째 `DEBUG` 로그가 찍힌다.

```bash
20:14:21.769|DEBUG| 2d45fa75-31f3-42e3-a730-f1d195a2|...| d.b.c.k.c.i.MdcConsumerRecordInterceptor | [MdcConsumerRecordInterceptor] MDC 컨텍스트 설정 [globalTraceId]: 2d45fa75-31f3-42e3-a730-f1d195a2
```

* 확인: 메시지 헤더에서 Trace ID를 꺼내 Consumer 스레드의 MDC에 성공적으로 설정했다.


#### 4. Consumer 서버: 비즈니스 로직 실행

MDC가 설정된 상태로 `CouponIssueConsumer`의 `listener` 메서드가 실행된다.

그 결과, 이후의 모든 비즈니스 로그에 동일한 Trace ID가 남는 것을 볼 수 있다.

```bash
20:14:21.769| INFO| 2d45fa75-31f3-42e3-a730-f1d195a2|...| d.b.c.k.c.a.CouponIssueConsumer      | 발급 처리 메시지 수신: ...
20:14:21.772| INFO| 2d45fa75-31f3-42e3-a730-f1d195a2|...| d.b.c.k.c.a.CouponIssuanceServiceImpl  | 쿠폰 발급 처리 시작 - ...
```

이렇게 인터셉터를 활용하여 비즈니스 로직의 순수성을 지키면서도, 분산 환경에서 로그를 효과적으로 추적할 수 있게 됐다.

## References

* [[공식문서] Wiring Spring Beans into Producer/Consumer Interceptors](https://docs.spring.io/spring-kafka/reference/kafka/interceptors.html)
