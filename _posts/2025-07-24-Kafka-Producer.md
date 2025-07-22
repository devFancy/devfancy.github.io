---
layout: post
title:  " [카프카 핵심 가이드] CHAPTER 3. 카프카 프로듀서: 카프카에 메시지 쓰기 "
categories: Kafka
author: devFancy
---
* content
{:toc}


> 이 글은 [카프카 핵심 가이드](https://product.kyobobook.co.kr/detail/S000201464167?utm_source=google&utm_medium=cpc&utm_campaign=googleSearch&gad_source=1) 책을 읽고 정리한 글입니다.
>
> 이 글에서 다루는 모든 코드는 [깃허브](https://github.com/devFancy/springboot-coupon-system)에서 확인하실 수 있습니다.
>
> `참고`: 본 글에서 소개되는 코드 예시는 현재 시점의 구현을 바탕으로 작성되었으며, 프로젝트가 발전함에 따라 내용이 변경되거나 개선될 수 있음을 미리 알려드립니다.

## Prologue

"카프카 핵심 가이드" 책을 현재 두 번째 읽고 있지만, 생각보다 책의 난이도가 있고, 이해하기 어려운 점이 있어서 책에 있는 내용 중에 중요한 내용 위주로 정리하기 위해 + 간단한 실습 정리를 위해 이 글을 작성하게 되었다.

이 글은 책의 내용을 기반으로 하되, 앞으로 프로듀서와 관련하여 실무에서 중요하다고 생각되는 개념이 있다면 지속적으로 내용을 보완하고 업데이트할 예정이다.

자세한 내용은 책의 3장을 참고하자.


---

## 카프카 프로듀서(Producer)란? 

카프카 프로듀서(Producer) 는 카프카 클러스터의 토픽(Topic)으로 메시지(데이터)를 전송하는 역할을 담당하는 애플리케이션이다.

프로듀서는 다양한 목적으로 사용될 수 있다.

* 사용자 행동 로그 기록

* 서버 성능 메트릭 수집

* 다른 애플리케이션과의 비동기 통신

* 데이터베이스에 저장하기 전 데이터 버퍼링

이처럼 다양한 요구조건(메시지 유실 허용 여부, 지연 시간, 처리율 등)에 맞춰 프로듀서의 동작 방식과 설정을 다르게 구성할 수 있다.


## 프로듀서의 메시지 전송 과정

프로듀서는 단순히 메시지를 보내는 것처럼 보이지만, 내부적으로는 아래 그림과 같이 여러 단계를 거쳐 동작한다.

![](/assets/img/kafka/Kafka-Producer-3-1.png)

* [1] ProducerRecord 생성: 

  * 전송할 메시지를 담은 ProducerRecord 객체를 생성하는 것으로 모든 과정이 시작된다. 
  
  * 이 객체에는 메시지를 보낼 토픽과 **값(value)** 이 필수로 포함되며, 필요에 따라 **키(key)** 와 **파티션(partition)** 을 지정할 수 있다.

* [2] 직렬화(Serialization): 

  * 프로듀서는 ProducerRecord의 키와 값을 네트워크로 전송할 수 있도록 바이트 배열(byte array)로 변환하는 직렬화 과정을 수행한다.

* [3] 파티셔너(Partitioner): 

  * 레코드에 파티션이 명시적으로 지정되지 않았다면, 파티셔너가 어떤 파티션으로 메시지를 보낼지 결정한다. 일반적으로 메시지의 키 값을 기준으로 파티션을 선택한다.

* [4] 레코드 배치(Record Batch): 

  * 파티션이 결정되면, 프로듀서는 해당 레코드를 같은 토픽-파티션으로 전송될 다른 레코드들과 함께 레코드 배치에 추가한다. 별도의 스레드가 이 배치들을 모아 브로커로 전송함으로써 전송 효율을 높인다.

* [5] 브로커 응답 및 재시도: 

  * 브로커는 메시지를 성공적으로 받으면 토픽, 파티션, 오프셋 정보가 담긴 메타데이터(Metadata)를 반환한다. 

  * 만약 실패하면 에러를 반환하며, 프로듀서는 설정에 따라 몇 번 더 재전송을 시도할 수 있다.


## 프로듀서를 생성하기 위한 필수 옵션

카프카 프로듀서를 생성하기 위해서는 최소한 다음 3가지 필수 속성을 설정해야 한다.

* `bootstrap.servers`

  * 프로듀서가 카프카 클러스터에 처음 연결하기 위해 사용하는 '호스트:포트' 목록이다. 모든 브로커 정보를 다 적을 필요는 없으며, 일부 브로커가 다운되더라도 접속할 수 있도록 **최소 2개 이상을 설정하는 것이 권장**된다.

* `key.serializer`

  * 메시지의 **키(key)** 를 네트워크를 통해 전송 가능한 **바이트 배열**로 변환(직렬화)하는 클래스를 지정한다.

* `value.serializer`

  * 레코드의 **값** 을 직렬화하는 데 사용할 클래스이다.


이러한 설정을 아래와 같이 쿠폰 발급 기능을 비동기적으로 처리하기 위해 Spring Boot 환경에서 카프카 프로듀서를 설정한 실제 코드 예시를 가져왔다.

> KafkaProducerConfig.java

```java
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();

        // 1. bootstrap.servers 설정
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

        // 2. key.serializer 설정
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        // 3. value.serializer 설정
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        return new DefaultKafkaProducerFactory<>(config);
    }

    // 카프카 메시지 전송을 위한 KafkaTemplate 빈 등록
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

위 코드는 앞서 설명한 세 가지 필수 속성을 그대로 구현하고 있다.

* `ProducerConfig.BOOTSTRAP_SERVERS_CONFIG`는 `bootstrap.servers`에 해당한다.

* `KEY_SERIALIZER_CLASS_CONFIG`는 `key.serializer`에 해당하며, 키로 문자열을 사용하기 위해 `StringSerializer`를 지정했다.

* `VALUE_SERIALIZER_CLASS_CONFIG`는 `value.serializer`에 해당하며, 쿠폰 객체와 같은 복잡한 데이터를 보내기 위해 `JsonSerializer`를 사용했다.

이렇게 설정된 `ProducerFactory`를 기반으로 `KafkaTemplate`을 생성(Bean으로 등록)하면, 이제 애플리케이션 어디서든 `KafkaTemplate`을 주입받아 간편하게 메시지를 전송할 수 있다.


## 메시지 전송 방법

프로듀서는 메시지를 보내는 세 가지 주요 방식을 제공한다.

* 파이어 앤 포겟 (Fire-and-forget): 전송만 하고 성공 여부는 확인하지 않는 방식이다. 빠르지만 메시지가 유실될 수 있다.

* 동기 전송 (Synchronous send)

  * `send()` 메서드가 반환하는 `Future` 객체의 `get()`을 호출하여 전송이 완료되고 성공할 때까지 기다리는 방식이다. 전송을 보장하지만, 응답을 기다리는 동안 애플리케이션이 멈추므로 성능이 저하된다.

* 비동기 전송 (Asynchronous send)
  
  * `send()` 메서드에 **콜백(Callback) 함수**를 함께 전달하는 방식이다. 브로커로부터 응답이 오면 미리 지정한 콜백 함수가 실행된다. **애플리케이션을 차단하지 않으면서도 전송 결과를 확실하게 처리**할 수 있어 가장 널리 사용된다.

쿠폰 시스템의 경우, 사용자가 쿠폰 발급 버튼을 눌렀을 때 즉시 "요청이 처리 중입니다"라고 응답하고 실제 발급 처리는 백그라운드에서 수행하는 것이 좋다. 이는 비동기 전송 방식에 가장 적합한 시나리오다.

### KafkaTemplate을 이용한 메시지 전송 예시

Spring Boot 환경에서는 앞서 설정한 `KafkaTemplate`을 이용하여 매우 편리하게 비동기 메시지를 전송할 수 있다.

실제 애플리케이션에서는 특정 도메인의 메시지를 전송하는 역할을 담당하는 전용 프로듀서 클래스를 만들어 사용하는 것이 일반적이다.

아래는 '쿠폰 발급' 메시지를 발행하는 `CouponIssueProducer` 클래스의 코드 예시다.

> CouponIssueProducer.java

```java
@Component
public class CouponIssueProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public CouponIssueProducer(final KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void issue(final UUID userId, final UUID couponId) {
        // 1. 카프카로 보낼 데이터를 담은 객체(Payload) 생성
        CouponIssueMessage payload = new CouponIssueMessage(userId, couponId);
        
        // 2. 토픽, 헤더 정보 등을 포함한 Message 객체 생성
        Message<CouponIssueMessage> message = MessageBuilder
                .withPayload(payload)
                .setHeader(KafkaHeaders.TOPIC, "coupon_issue")
                .setHeader("globalTraceId", MDC.get("globalTraceId")) // 추적 ID
                .build();

        // 3. KafkaTemplate을 이용해 메시지 비동기 전송
        kafkaTemplate.send(message);
    }
}
```

이 클래스는 `KafkaProducerConfig`에서 Bean으로 등록한 `KafkaTemplate`을 의존성 주입 받는다.

`issue` 메서드의 동작은 코드의 주석과 같이 세 단계로 나뉜다.

1. 페이로드 생성: 카프카로 보낼 실제 데이터(`CouponIssueMessage`)를 만든다.

2. `Message` 객체 빌드: `MessageBuilder`를 이용해 페이로드와 함께 전송할 토픽, 추적 ID 등 메타데이터를 담은 `Message` 객체를 생성한다.

3. 비동기 전송: `kafkaTemplate.send()`를 호출하여 카프카로 메시지를 최종 발행한다.


---

그렇다면 이 `CouponIssueProducer` 는 언제 호출될까?

아래는 주기적으로 쿠폰 발급 대기열을 확인하여 메시지를 발행하는 `CouponIssueScheduler` 의 코드다.


> CouponIssueScheduler.java

```java
@Component
public class CouponIssueScheduler {
    private final CouponWaitingQueueRepository waitingQueueRepository;
    private final CouponIssueProducer couponIssueProducer;
    // ...

    @Scheduled(fixedRate = 3000)
    public void issueCoupons() {
        // ... (생략) ...
        for (Coupon coupon : activeCoupons) {
            // ... (생략) ...
            processQueueForCoupon(coupon.getId());
        }
    }

    private void processQueueForCoupon(final UUID couponId) {
        // 1. 대기열에서 처리할 사용자 조회
        Set<String> userIds = waitingQueueRepository.getWaitingUsers(couponId, batchSize);

        // ... (생략) ...

        // 2. Kafka 토픽으로 메시지 발행 위임
        for (String userIdStr : userIds) {
            UUID userId = UUID.fromString(userIdStr);
            couponIssueProducer.issue(userId, couponId); // Producer 호출
        }

        // 3. 처리 시작한 사용자들을 대기열에서 제거
        waitingQueueRepository.remove(couponId, userIds);
    }
}
```

이 스케줄러는 3초마다 실행되어, Redis와 같은 대기열에서 쿠폰을 발급받을 사용자 목록을 가져온다. 그리고 각 사용자에 대해 앞서 살펴본 `couponIssueProducer.issue()`를 호출하여 실제 메시지 발행을 위임한다.

이처럼 **스케줄러(비즈니스 로직) -> 전용 프로듀서(발행 로직) -> `KafkaTemplate`(실제 전송)** 의 흐름으로 역할을 분리하면, 코드가 깔끔해지고 테스트와 유지보수가 쉬워지는 장점이 있다.


## 프로듀서 설정하기

카프카 프로듀서는 수많은 설정값을 가지고 있지만, 대부분은 합리적인 기본값을 가지고 있다. 

하지만 몇몇 설정은 프로듀서의 **신뢰성, 성능, 메모리 사용량**에 큰 영향을 미치므로, 실무에서 자주 사용되는 중요한 옵션들 위주로 정리해두자.

### 1. 데이터 전송 신뢰도 관련 설정

메시지를 유실 없이, 중복 없이 보내는 것은 매우 중요하다. 이때 `acks` 와 `enable.idempotence` 설정이 핵심적인 역할을 한다.

#### acks

`acks`는 프로듀서가 보낸 메시지에 대해 브로커로부터 '전송 성공'으로 간주하기 위해 필요한 응답(acknowledgment)의 수를 결정한다.

* `acks=0`: 프로듀서는 응답을 기다리지 않고 즉시 다음 메시지를 전송한다. 속도는 가장 빠르지만, 브로커가 메시지를 받지 못해도 프로듀서는 알지 못해 **메시지가 유실될 위험이 가장 크다.**

* `acks=1`: 리더 파티션에 메시지가 저장되면 '성공' 응답을 받는다. 리더에 장애가 발생하고 아직 복제가 완료되지 않았다면 **메시지가 유실될 수 있다.**

* `acks=all` (또는 `-1`): **가장 안전한 옵션.** 리더 파티션뿐만 아니라, 모든 팔로워(ISR, In-Sync Replica) 파티션에 메시지가 복제되었을 때 '성공' 응답을 받는다. 브로커 하나에 장애가 생겨도 메시지 유실이 발생하지 않는다. (최신) 카프카 버전 3.0.0부터 프로듀서의 `acks` 기본값이 `1` 에서 `all` 로 변경되었다.


#### enable.idempotence (멱등성 프로듀서)

`acks=all` 로 설정하면 메시지 유실은 막을 수 있지만, 메시지 중복이 발생할 수 있다. 

예를 들어, 브로커가 메시지를 받고 복제까지 완료했지만, 프로듀서에게 성공 응답을 보내기 전에 장애가 발생했다고 가정하자. 

프로듀서는 응답을 받지 못했으므로 타임아웃 후 메시지를 재전송하게 되고, 이로 인해 동일한 메시지가 두 번 저장된다.

`enable.idempotence=true` 로 설정하면 이러한 중복을 방지할 수 있다.

* 프로듀서는 각 메시지에 고유한 시퀀스 번호를 붙여 전송한다.

* 브로커는 이미 받은 시퀀스 번호의 메시지가 다시 오면 중복으로 간주하여 저장하지 않는다.

* 이를 통해 '최소 한 번 전송(At-Least-Once)'에서 **'정확히 한 번 전송(Exactly-Once)'에 가까운 효과**를 낼 수 있다.

* 참고: `enable.idempotence=true`로 설정하면, 카프카는 신뢰도를 보장하기 위해 내부적으로 다른 주요 설정값들을 안전한 값으로 강제한다.

  * (`retries`는 Integer.MAX_VALUE로, `acks`는 all로, `max.in.flight.requests.per.connection`은 5 이하로 유지). 

  * 따라서 신뢰성이 중요한 대부분의 실무 환경에서는 이 옵션을 `true`로 설정하는 것이 좋다. 

### 2. 성능 및 처리량 관련 설정

`batch.size`, `linger.ms`, `compression.type`은 프로듀서의 처리량(throughput)을 높이기 위한 핵심 설정이다.

* `batch.size`: 프로듀서가 메시지를 보낼 때, 여러 메시지를 묶어서 하나의 배치(batch)로 만들어 전송한다. 이 설정은 하나의 배치에 담을 수 있는 **메모리(바이트) 크기**를 의미한다.

* `linger.ms`: 배치가 `batch.size`에 도달하지 않더라도, 메시지를 보내기 전까지 대기하는 시간(ms)을 의미한다. 프로듀서는 `batch.size`가 차거나 `linger.ms` 시간이 지나면 배치를 전송한다.

* `compression.type`: 메시지를 브로커로 전송하기 전에 압축하는 방식을 지정한다. (snappy, gzip, lz4, zstd 등)

  * 압축을 사용하면 네트워크 대역폭과 브로커의 저장 공간을 크게 절약할 수 있다. 특히 `batch.size`를 늘려 여러 메시지를 함께 압축할수록 효율이 좋아진다.

    * `snappy`: 적절한 압축률과 낮은 CPU 사용량으로 균형이 좋다. 대부분의 경우 무난한 선택이다.
    
    * `gzip`: 압축률은 더 높지만 CPU 사용량도 더 많다. 네트워크 대역폭이 매우 제한적인 환경에서 유리하다.


### 3. 타임아웃 및 전송 시간 관련 설정

![](/assets/img/kafka/Kafka-Producer-3-2.png)

위 그림은 `send()` 호출부터 최종 응답까지의 과정을 보여준다. 이 과정에서 중요한 타임아웃 설정은 다음과 같다.

* [1] `send()` 호출과 블로킹 (`max.block.ms`): 메시지 전송은 `send()` 호출로 시작된다. 만약 프로듀서 내부 버퍼가 가득 차 있다면, 버퍼에 공간이 생길 때까지 `send()` 호출이 **블록(block)**되는데, 이때의 최대 대기 시간이 `max.block.ms`다.

* [2] 배치 대기 (`linger.ms`): 버퍼에 들어간 메시지는 전송될 배치를 이루기 위해 잠시 대기한다. 이 대기 시간이 바로 `linger.ms`다.

* [3] 전송과 응답 대기 (`request.timeout.ms`): 배치가 브로커로 전송(Inflight)되면, 프로듀서는 응답을 기다린다. 이 개별 요청에 대한 타임아웃이 `request.timeout.ms`다.

* [4] 재시도 (`retry.backoff.ms`): `request.timeout.ms`가 초과되거나 일시적인 오류를 받으면, 프로듀서는 재시도를 수행한다. 재시도와 재시도 사이의 대기 시간이 `retry.backoff.ms`다.

* [5] 최종 마감 (`delivery.timeout.ms`): 가장 중요한 마스터 타임아웃이다. 위 모든 과정(배치 대기, 전송, 재시도)은 `delivery.timeout.ms`라는 최종 마감 시간 내에 완료되어야 한다. 이 시간을 초과하면 프로듀서는 최종적으로 메시지 전송 실패를 반환한다. 그림에 나온 공식(`delivery.timeout.ms >= linger.ms + request.timeout.ms`)이 이 관계를 잘 보여준다.

(책에서는 `retries`나 `retry.backoff.ms`를 직접 세세하게 조정하기보다, **클러스터가 장애로부터 복구되는 데 걸리는 시간을 고려하여 `delivery.timeout.ms`를 충분히 길게 설정하는 것을 권장한다.** `delivery.timeout.ms`만 잘 설정해두면, 그 시간 안에서 프로듀서가 알아서 최적의 재시도를 수행하기 때문이다.)

### 4. 데이터 포맷 설정 (Serializer)

프로듀서는 자바 객체를 카프카로 보내기 위해 바이트 배열로 변환하는 직렬화(Serialization) 과정이 필수적이다.

> 커스텀 시리얼라이저의 문제점

직접 객체를 위한 시리얼라이저를 구현할 수도 있지만, 실무에서는 다음과 같은 심각한 문제가 발생할 수 있다.

* 스키마 변경의 어려움: 객체에 필드 하나를 추가하거나 타입을 변경하면, 기존 데이터를 읽지 못하는 호환성 문제가 발생한다.

* 유지보수의 어려움: 서로 다른 팀이나 애플리케이션이 같은 데이터를 사용할 경우, 모두가 동일한 직렬화/역직렬화 로직을 유지해야 해서 변경이 매우 복잡해진다.

> 아파치 에이브로(Avro)와 스키마 레지스트리

이러한 문제를 해결하기 위해 아파치 에이브로(Avro)와 같은 범용 직렬화 라이브러리를 사용하는 것이 강력히 권장된다.

* 스키마 기반: Avro는 데이터를 스키마(데이터의 구조 정의)에 따라 직렬화한다.

* 호환성 보장: 스키마가 변경되더라도 정해진 규칙(필드 추가/삭제 등)을 지키면, 구버전의 스키마를 사용하는 애플리케이션도 문제없이 데이터를 처리할 수 있다.

* 스키마 레지스트리: 보통 스키마를 중앙에서 관리하는 **스키마 레지스트리(Schema Registry)** 와 함께 사용하여, 모든 프로듀서와 컨슈머가 스키마 정보를 공유하고 데이터 호환성을 보장받는다.

결론적으로, 안정적인 데이터 파이프라인을 구축하기 위해서는 직접 시리얼라이저를 구현하기보다 Avro와 스키마 레지스트리를 도입하는 것이 훨씬 좋은 선택이다
