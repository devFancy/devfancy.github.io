---
layout: post
title: "외부 시스템과의 연동 시 발생하는 장애를 격리하기 위해 서킷 브레이커 적용하기"
categories: [ Tech ]
author: devFancy
---

* content
{:toc}

## Prologue

> 이 글에서 다루는 예시 코드는 해당 [Github](https://github.com/devFancy/kotlin-java-playground/tree/main/kotlin-springboot-practice-commerce)이며, 시간에 따라 코드가 변경될 수 있습니다.

[저번 글](https://devfancy.github.io/spring-boot-kotlin-circuit-breaker/)에서는 왜 서킷 브레이커를 사용하는지, 개념과 사용 방식에 대해 알아봤습니다.

이번 글에서는 외부 시스템으로부터 장애가 전파되는 것을 막기 위해 서킷 브레이커를 적용한 과정을 공유하고자 합니다.

이전 회사에서 프로젝트를 진행하던 중, 외부 시스템 연동 과정에서 장애를 겪은 경험이 있습니다.
기능의 요구사항에 따라 동기 혹은 비동기 방식을 통해 연동이 되는데, 그 당시에는 서비스의 기능과 요구사항을 봤을 때 동기 방식으로 진행해야 했습니다.

그래서 동기 방식으로 진행하고 테스트를 진행했을 때, 성공 케이스에 대해서는 성공적으로 잘 이뤄졌습니다.
하지만, 서비스를 운영하다보면 해피 케이스 보다는 예외 케이스에 대해 많이 고려해야 한다는 점을 알 수 있었습니다.

해피 케이스는 비즈니스 요구사항에 맞춰 로직이 정상적으로 수행된 경우를 말합니다.

예외 케이스는 크게 비즈니스 로직에 의한 예외와 시스템 장애 두 가지로 구분하여 접근해야 합니다.

첫 번째는 비즈니스 로직상 발생하는 예외입니다. 이는 서비스의 흐름상 충분히 예상 가능한 상황입니다.
예를 들어, 사용자의 잔액이 부족하거나, 유효하지 않은 카드 번호를 입력하여 PG사로부터 거절 응답(4xx)을 받는 경우가 이에 해당합니다.

두 번째는 예상치 못한 시스템 장애입니다. 
네트워크 지연으로 인한 타임아웃(Timeout)이나, 외부 PG 서버의 내부 오류(5xx) 등으로 인해 정상적인 통신이 불가능한 경우를 말합니다.

이번 글에서 저는 "**외부 시스템 장애 발생 시 어떻게 시스템을 격리할 것인가?**"에 대해 초점을 맞췄습니다.

이를 구체적으로 설명하기 위해 외부 의존성이 높은 '결제' 도메인과 외부 시스템인 PG사 연동을 예시로 활용했습니다.
(단, 결제 도메인에 대한 실무 경험을 기반으로 작성한 내용은 아니므로, 실제 서비스의 비즈니스 로직과는 차이가 있을 수 있는 점 참고 부탁드립니다.)

> 예상 독자

- 외부 시스템과의 장애 격리를 위해 Spring Boot, Kotlin 기반 환경에서 서킷 브레이커를 적용한 과정이 궁금한 분

- 서킷 브레이커에서 정확한 집계 처리를 위해 비즈니스 로직상 발생하는 예외와 예상치 못한 시스템 장애를 구분하는 방법이 궁금한 분

- Beeceptor 를 이용한 Mock 테스트하는 방법이 궁금한 분


---

## 결제 중 장애가 발생하면 어떤 일이 벌어질까?

일상 생활에서 쇼핑을 하다보면, 어떠한 제품을 구매하고 싶을 때 주문 페이지 혹은 장바구니에서 '결제하기'와 같은 버튼을 클릭하면서 결제가 이뤄집니다.

아래는 네이버 쇼핑을 통해서 화장품 제품인 '제로이드 수딩 크림 100ml'를 결제할 때의 사진입니다.

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-naverpay-order.png)

이때, '결제하기' 버튼을 클릭했을 때 외부 시스템 PG사로부터 장애가 발생한다면 어떤 일이 발생할까요?

기존에 타임아웃과 같은 시간을 설정하지 않았다면, 사용자는 대기 상태에 있다가,
나중에 `"@@사에서 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."`와 같은 메시지 창이 나갈 것입니다.
그러면 사용자 입장에서 보면 불편한 경험을 느낄 수 있습니다. 구글 리서치 자료에 따르면, 로딩 시간이 **3초 이상 소요되면 53%가 이탈**한다고 합니다.

또한, 해당 서비스를 운영하고 있는 개발자에게는 Slack을 통해 장애 관련 알림을 받게 될 것입니다.
여기서 외부 시스템이 계속 장애가 발생한다면, 알림이 지속적으로 발송될 것이며, 이는 개발자의 피로도를 가중시킬 수 있습니다.

이처럼 '결제' 도메인은 외부 시스템과 연동하는 과정이 있고, 그 속에서 장애에 대한 대처가 필요합니다.

아 글에서는 이러한 문제를 해결하기 위해 사용자에게는 빠른 응답을 제공하고, 개발자에게는 불필요한 장애 알림이 반복되지 않도록 개선하고자 했습니다.

## 결제와 외부 시스템(PG)와의 관계

코드로 넘어가기 전에, 간단하게 내부 서비스인 '결제'와 외부 서비스인 'PG'사와의 관계를 먼저 살펴보겠습니다.

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-payment-pg.png)

위 그림은 내부 결제 서비스와 외부 PG사 간의 상호작용을 나타냅니다. 
구조적으로 보면, PG사로부터 결제 결과(성공/실패)를 콜백(Callback) 형태로 전달받고, 
이를 바탕으로 우리 서버가 다시 PG사에 최종 결제 승인을 요청하는 형태입니다.

이를 코드로 구현하면 다음과 같습니다. (아래는 토스페이먼츠 PG사 연동 스펙을 참고하여 구성했습니다.)

```kotlin
@RestController
class PaymentController(
    private val paymentConfirmFacade: PaymentConfirmFacade,
    private val paymentService: PaymentService,
    private val orderService: OrderService,
    private val ownedCouponService: OwnedCouponService,
    private val pointService: PointService,
) {

    // NOTE: [결제 요청] 결제를 하기 위한 개념적인 틀을 만들고 DB에 저장해놓은 역할.
    @PostMapping("/v1/payments")
    fun create(
        user: User,
        @RequestBody request: CreatePaymentRequest,
    ): ApiResponse<CreatePaymentResponse> {
        val order = orderService.getOrder(user, request.orderKey, OrderState.CREATED)
        val ownedCoupons = ownedCouponService.getOwnedCouponsForCheckout(user, order.items.map { it.productId })
        val pointBalance = pointService.balance(user)
        val id = paymentService.createPayment(
            order = order,
            paymentDiscount = request.toPaymentDiscount(ownedCoupons, pointBalance),
        )
        return ApiResponse.success(CreatePaymentResponse(id))
    }

    // NOTE: [결제 승인] PG사 인증 성공 시 처리
    @PostMapping("/v1/payments/callback/success")
    fun callbackForSuccess(
        @RequestParam orderId: String,
        @RequestParam paymentKey: String,
        @RequestParam amount: BigDecimal,
    ): ApiResponse<Any> {
        paymentConfirmFacade.success(
            orderKey = orderId,
            externalPaymentKey = paymentKey,
            amount = amount,
        )
        return ApiResponse.success()
    }

    // NOTE: [결제 실패] PG사 인증 실패 시 처리
    @PostMapping("/v1/payments/callback/fail")
    fun callbackForFail(
        @RequestParam orderId: String,
        @RequestParam code: String,
        @RequestParam message: String,
    ): ApiResponse<Any> {
        paymentConfirmFacade.fail(
            orderKey = orderId,
            code = code,
            message = message,
        )
        return ApiResponse.success()
    }
}
```

이번 시간에는 서킷 브레이커를 도입한 부분을 위주로 설명드리는 것이므로, 외부 PG사와 통신이 일어나는 `callbackForSuccess` 메서드를 중점으로 보겠습니다.

`callbackForSuccess`가 호출되면 내부적으로 `PaymentConfirmFacade`를 통해 최종 승인 로직을 수행하게 됩니다.

이때 `paymentConfirmFacade.success` 메서드의 처리 순서는 다음과 같으며, 2번 단계(외부 API 호출)가 서킷 브레이커를 적용할 부분입니다.

- 처리 순서: 1. 결제 검증 -> 2. 외부 API 호출 (PG 승인 요청) -> 3. 결제 완료

```kotlin
@Component
class PaymentConfirmFacade(
    private val paymentService: PaymentService,
    private val paymentClient: PaymentClient,
) {
    fun success(orderKey: String, externalPaymentKey: String, amount: BigDecimal): Long {
        // 1. [DB Transaction] 결제 검증
        val command = paymentService.preparePayment(orderKey, externalPaymentKey, amount)

        // 2. [No Transaction] 외부 API 호출
        val paymentResult = paymentClient.requestPayment(command)

        // 3. [DB Transaction] 결제 완료 처리
        return paymentService.completePayment(orderKey, paymentResult)
    }
    //...
}
```

여기서 저는 외부 API 호출(PaymentClient)과 내부 DB 트랜잭션(PaymentService)을 분리했습니다.

데이터베이스의 커넥션 풀(Connection Pool)은 한정된 자원입니다. 
만약 트랜잭션 내부에 응답 시간이 불확실한 외부 API 호출을 포함시킨다면, 외부 시스템 지연 시 DB 커넥션의 점유 시간이 불필요하게 길어지게 됩니다.
이는 결국 전체 서비스의 성능 저하로 이어질 수 있습니다.

따라서 Facade 패턴을 활용해 트랜잭션 범위를 최소화하고, 외부 PG사 로직 변경이 내부 도메인 로직에 영향을 주지 않도록 설계했습니다.

- `PaymentService`: 내부 비즈니스와 관련된 로직

- `PaymentClient`: 외부 API 호출과 관련된 로직

(참고로, 실제 운영 환경에서는 외부 결제가 성공하고 내부 DB 반영이 실패하는 경우를 대비해서 별도의 배치나 보상 트랜잭션과 같은 로직을 처리해줘야 합니다.)

## 해결: 서킷 브레이커 적용하기

서킷 브레이커를 적용하기 전에 `application.yml` 에 서킷 브레이커와 관련된 설정값을 아래와 같이 설정했습니다.

(아래는 예시로 설정해둔 값이며, 실제 운영 환경에서는 서비스의 트래픽 패턴과 요구사항, 내부 정책을 고려해서 설정해야 합니다.)

```yaml
spring.config.activate.on-profile: local

# @CircuitBreaker name에 지정된 서킷브레이커가 없으면 default 설정을 가져온 해당 이름의 서킷브레이커를 만듭니다.
resilience4j:
  circuitbreaker:
    configs:
      default:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10000
    instances:
      beeceptor-payment: # 코드에서 circuitBreaker.run("beeceptor-payment")로 호출한 이름과 일치해야 합니다.
        base-config: default

        sliding-window-type: COUNT_BASED    # 집계 슬라이딩 윈도우 크기 (횟수 기반)
        sliding-window-size: 10             # CLOSED 상태에서 최근 10회 호출을 기준으로 실패율(failureRateThreshold) 계산
        minimum-number-of-calls: 10         # 집계에 필요한 최소 호출 수
        failure-rate-threshold: 50          # 실패율 임계값: 실패 50% 이상 시 OPEN 상태로 전환
        slow-call-duration-threshold: 5000  # 5000ms 이상 소요 시 실패로 간주
        slow-call-rate-threshold: 50        # slowCallDurationThreshold 초과 비율이 50% 이상 시 OPEN 상태로 전환
        wait-duration-in-open-state: 30000  # OPEN -> HALF_OPEN 전환 전 대기 시간 (ms)
        permitted-number-of-calls-in-half-open-state: 5   # HALF_OPEN -> CLOSE or OPEN 으로 판단하기 위해 허용할 호출 횟수
        registerHealthIndicator: true       # actuator 에서 상태 확인 가능

        ignoreExceptions:
          - org.springframework.web.client.HttpClientErrorException
```

기본값으로 설정한 값이 있고, 외부 API 호출에 대해 테스트하기 위해서 모의 API 테스트를 무료로 제공하는 [Beeceptor](https://app.beeceptor.com/)를 사용했습니다.
그래서 위와 같이 instances 부분에 `beeceptor-payment` 이라는 이름으로 지었습니다.

위에서 말한 것처럼, 외부 시스템으로부터 장애 격리를 위해 서킷 브레이커를 도입했습니다.

yml 파일에서 설정한 `beeceptor-payment` 이름으로 서킷 브레이커의 run 부분에 추가해두었습니다.
왜냐하면 run 내부에는 아래와 같이 서킷 브레이커 설정 이름과 실행한 로직을 구현했기 때문입니다.

```kotlin
interface CircuitBreaker {
    /**
     * @param name 서킷 브레이커 설정 이름 (기본값: "default")
     * @param block 서킷 브레이커로 보호하며 실행할 로직
     */
    fun <T> run(name: String = "default", block: () -> T): Result<T>
}
```

`PaymentClient`의 구현체인 `BeeceptorPaymentClient` 클래스에서 외부 API 호출하는 로직을 아래와 같이 구현했습니다.

```kotlin
@Component
class BeeceptorPaymentClient(
    private val restClient: RestClient,
    private val circuitBreaker: CircuitBreaker,
) : PaymentClient {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun requestPayment(command: PaymentCommand): PaymentResult {
        return circuitBreaker.run("beeceptor-payment") {
            executePayment(command)
        }
            .fallbackIfOpen {
                log.warn("[Circuit Open] Beeceptor 결제 서비스 차단됨. 잠시 후 재시도 필요.")
                throw CoreException(ErrorType.PAYMENT_EXTERNAL_API_UNAVAILABLE)
            }
            .getOrElse { e ->
                when (e) {
                    is HttpClientErrorException -> {
                        log.warn("[PAYMENT_REJECTED] 결제 거절: ${e.responseBodyAsString}")
                        throw CoreException(ErrorType.PAYMENT_REJECTED)
                    }

                    is CoreException -> throw e
                    else -> {
                        log.error("[PAYMENT_FAILED] Beeceptor 결제 호출 실패", e)
                        throw CoreException(ErrorType.PAYMENT_EXTERNAL_API_FAIL)
                    }
                }
            }
    }
    // ... (executePayment 메서드 생략)
}
```

### Fallback 처리하기

서킷 브레이커가 열렸을 때(Open), 사용자에게 어떤 경험을 제공할지는 도메인의 성격에 따라 다릅니다.

일반적으로 상품 목록 조회나 검색같은 조회 관련해서는 서킷이 열렸을 때, 빈 리스트를 반환하거나 캐시된 데이터를 보여주는 방식을 사용해서 사용자가 장애를 인지하지 못하게 합니다.

하지만 결제 도메인은 다릅니다. 금전적인 트랜잭션이 걸려 있는 만큼, 어설픈 성공 처리보다는 명확하게 실패를 알리는 것이 안전합니다.

그래서 저는 `fallbackIfOpen` 메서드에서 바로 예외(`PAYMENT_EXTERNAL_API_UNAVAILABLE`)를 던지도록 했습니다.
이를 통해 불필요한 스레드 점유를 막고, 사용자에게는 "외부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요." 같은 메시지를 전달했습니다.

### 예상 가능한 에러와 예상치 못한 에러 구분하기

Fallback 전략을 세웠다면, 다음으로 고민할 점은 "무엇을 장애로 판단하여 서킷을 열 것인가?"입니다.

만약 사용자의 잔액 부족이나 결제 비밀번호 오류 같은 비즈니스 예외(4xx 에러)까지 장애로 카운팅된다면 어떻게 될까요?
실제 외부 서버는 멀쩡한데, 사용자의 실수로 인해 실패율이 높아져 서킷이 열려버리는 문제가 발생할 수 있습니다.

앞서 Prologue에서 정의한 기준에 따라, 서킷 브레이커가 '시스템 장애'만 감지하고 '비즈니스 예외'는 무시하도록 설정해야 합니다.

이를 구현하기 위해 `application.yml` 파일의 `ignoreExceptions` 설정에 4xx 에러를 추가해서 비즈니스 예외가 발생하더라도 서킷의 실패율에는 영향을 주지 않도록 격리했습니다.

아래 코드는 앞서 설명한 Fallback 전략과 예외 구분 로직이 모두 포함된 로직입니다.
`circuitBreaker.run`을 통해 실행하다가, 서킷이 닫혀있음에도 예외가 발생하면 `getOrElse` 블록으로 진입하게 되는데, 이때 예외 종류에 따라 처리를 다르게 가져갔습니다.

``` kotlin
// ... (생략)
        .getOrElse { e ->
            when (e) {
                is HttpClientErrorException -> {
                    // 비즈니스 예외 (4xx): WARN 로그 기록 & 서킷 집계 제외
                    log.warn("[PAYMENT_REJECTED] 결제 거절: ${e.responseBodyAsString}")
                    throw CoreException(ErrorType.PAYMENT_REJECTED)
                }
        
                is CoreException -> throw e
                else -> {
                    // 시스템 장애 (5xx, Timeout): ERROR 로그 기록 & 서킷 집계 포함
                    log.error("[PAYMENT_FAILED] Beeceptor 결제 호출 실패", e)
                    throw CoreException(ErrorType.PAYMENT_EXTERNAL_API_FAIL)
                }
            }
        }
// ...
```

위의 `getOrElse` 내부 로직을 자세히 살펴보면 다음과 같은 차이를 두었습니다.

- `HttpClientErrorException` (비즈니스 예외)
    - PG사로부터 "잔액 부족" 등과 같은 4xx 응답을 받은 경우입니다.
    - 이는 장애가 아니므로 `ignoreExceptions`설정에 의해 서킷 집계에서 제외됩니다.
    - 로그 또한 운영자에게 알림이 가지 않도록 `WARN` 레벨로 기록해서 알림 피로도를 낮추는 전략을 가져갔습니다.

- 그 외 예외 (시스템 장애)
    - 타임아웃이나 500 에러 등 실제 장애를 받은 경우입니다.
    - 이 경우에는 반드시 운영자가 인지해야 하므로 `ERROR` 레벨로 기록하고, 서킷 브레이커가 실패 횟수를 카운트하도록 했습니다.

이처럼 예상 가능한 에러와 예상치 못한 에러를 명확히 구분함으로써, 서킷 브레이커가 실제 장애 상황에서만 정확하게 동작하도록 구현했습니다.

운영 환경에서는 다양한 장애가 발생할 수 있기 때문에, 사용자에게는 불편함을 주지 않고, 운영자에게는 불필요한 알림으로 인한 피로도를 줄여, 장애 대응에 집중할 수 있도록 내부 정책을 잘 세우는 것이 중요하다는 걸 알게되었습니다.

### 타임아웃 설정하기

마지막으로, 서킷 브레이커와 함께 반드시 고려해야할 점이 타임아웃(Timeout)입니다.

> 타임아웃에 대해 개념과 유형이 궁금하시다면, 이전에 제가 작성한 [서버 개발자가 알아야 할 타임아웃과 유형 알아보기](https://github.com/devFancy/WIL/blob/main/tech/server-developer-timeout.md) 글을 참고해 주시기 바랍니다.

타임아웃은 단순히 "짧게 설정하면 좋다"가 아니라, 외부 시스템(PG사)의 서비스 수준 협약(SLA)과 데이터 정합성을 고려해야 합니다.

예를 들어, PG사가 "최대 60초 이내 응답을 보장한다"고 하는데, 내 서버의 `Read Timeout`을 3초로 설정해버리면 어떻게 될까요?

PG사는 4초 만에 정상적으로 결제를 처리했지만, 내 서버는 3초 만에 연결을 끊고 "실패"로 처리해버리는 데이터 불일치 문제가 발생할 수 있습니다.
(예시. 돈은 나갔는데 주문은 실패한 상황)

따라서 타임아웃과 같은 기준을 고려하여 설정하는 것이 안전합니다.

- `Connection Timeout`: 네트워크 연결 자체의 문제이므로 짧게 설정 (1~3초)
- `Read Timeout`: PG사의 권장 가이드 시간 + 네트워크 지연 버퍼

> 실제로 토스페이먼츠 개발자 센터에서는 결제 승인 API의 `Read Timeout`을 60초로 설정할 것을 권장하고 있습니다.
>
> 토스페이먼츠 결제 처리와 관련된 API Read Timeout 설정이 중요해요. 결제 처리와 관련된 API 의 Read Timeout 은 60초로 설정하면 돼요. - [토스페이먼츠 용어집: 타임아웃](https://docs.tosspayments.com/resources/glossary/timeout)

외부 시스템에서는 우리가 통제할 수 없는 영역이기 때문에, 내부 서비스같은 통제 가능한 영역에 대해서는 가능한 짧게 가져가는 것이 좋습니다.

이번 포스팅의 예제 코드에서는 테스트 편의상 짧게 설정했지만, 실제 운영 환경이라면 외부 PG사의 가이드라인을 반드시 준수해야 합니다.

(아래는 예시로 설정해둔 값입니다.)

```kotlin
@Configuration
class RestClientConfig {
    @Bean
    fun restClient(): RestClient {
        val requestFactory = JdkClientHttpRequestFactory(
            HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build(),
        )
        // 실제 운영 시에는 PG사 권장 시간을 고려해야 합니다.
        requestFactory.setReadTimeout(Duration.ofSeconds(3))

        return RestClient.builder()
            .requestFactory(requestFactory)
            .baseUrl("https://...free.beeceptor.com/api")
            .build()
    }
}
```

위와 같이 서버(API) 타임아웃뿐만 아니라, 데이터베이스 연결에 대한 타임아웃도 함께 점검하는 것이 좋습니다.

(아래는 예시로 설정해둔 값입니다.)

```yaml
spring.config.activate.on-profile: local
# ...
storage:
  datasource:
    core:
      maximum-pool-size: 10
      connection-timeout: 1100
      data-source-properties:
        socketTimeout: 3000
```

## 직접 테스트해보기

로컬 개발 환경에서 실제 결제 승인 대신 Beeceptor를 호출하여 테스트하기 위해 해당 사이트에 들어가서 Mock 서버를 구축했습니다.

그런 다음, 아래와 같은 순서로 모킹 Rule을 설정하고, 테스트를 위해 테스트용 데이터를 `data.sql`에 작성했습니다.

### 1. Mocking Rule 설정하기

Beeceptor Console > Mocking Rules 메뉴에서 아래 규칙을 등록해야 합니다.

- Base URL: `https://{본인의 도메인}.free.beeceptor.com`
- Target URL Path: `/api/v1/payments`
- Method: `POST`

테스트를 위해 적용할 API 부분만 아래 그림과 같이 체크 표시를 하면 됩니다.

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-payment-mocking-rule.png)

> Case 1: 결제 승인 성공 (Success)

정상적으로 결제가 승인되었을 때 PG사로부터 받는 응답 예시입니다.

- Status Code: `200 OK`
- Response Body (JSON):

```json
{
  "externalPaymentKey": "payment_key_test",
  "method": "CARD",
  "approveNo": "12345678",
  "message": "결제 성공"
}
```

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-payment-mocking-200-success.png)

> Case 2: 결제 승인 실패 (Failure)

잔액 부족, 한도 초과, 네트워크 오류 등의 상황을 시뮬레이션합니다.

- Status Code: 400 Bad Request (또는 500)
- Response Body (JSON):

```json
{
  "code": "PAYMENT_REJECTED",
  "message": "잔액이 부족합니다."
}
```

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-payment-mocking-400-fail.png)

### 2. 테스트용 데이터 작성하기

해당 프로젝트에서 결제 승인 API를 테스트하기 위해서는 사전에 상품과 주문, 결제, 포인트에 대한 더미 데이터가 필요했습니다.

그래서 저는 `data.sql`를 이용해서 더미 데이터를 만들었습니다.

```sql
-- 1. 상품 (Product)
INSERT INTO product (id, name, thumbnail_url, description, short_description, cost_price, sales_price, discounted_price,
                     status, created_at, updated_at)
VALUES (1, '기모 후드티', 'https://static.toss.im/illusts/hoodie-gray.png', '따뜻한 기모 후드티입니다.', '기모 후드티', 20000, 30000, 25000,
        'ACTIVE', NOW(), NOW());

-- 2. 주문 (Order) - 결제 대기 상태 (CREATED)
INSERT INTO "order" (id, user_id, order_key, name, total_price, state, status, created_at, updated_at)
VALUES (1, 1, 'ORDER_TEST_HOODIE', '기모 후드티 외 0건', 25000, 'CREATED', 'ACTIVE', NOW(), NOW());

-- 3. 결제 (Payment) - 승인 대기 상태 (READY)
INSERT INTO payment (id, user_id, order_id, origin_amount, owned_coupon_id, coupon_discount, used_point, paid_amount,
                     state, external_payment_key, method, approve_code, paid_at, status, created_at, updated_at)
VALUES (1, 1, 1, 25000, 0, 0, 0, 25000, 'READY', NULL, NULL, NULL, NULL, 'ACTIVE', NOW(), NOW());

-- 4. 포인트 잔액 (PointBalance)
INSERT INTO point_balance (id, user_id, balance, version, status, created_at, updated_at)
VALUES (1, 1, 1000, 0, 'ACTIVE', NOW(), NOW());
```

### 3. API 테스트

위의 두 단계를 진행한 뒤에, 아래와 같이 API 요청을 통해 결제 승인에 대한 성공/실패 케이스를 검증할 수 있습니다.

```
### 1. 결제 승인 (성공 케이스) - Case 1 활성화 (200 OK)
POST http://localhost:8080/v1/payments/callback/success?orderId=ORDER_TEST_HOODIE&paymentKey=payment_key_test&amount=25000
Content-Type: application/json

### 2. 결제 승인 (실패 케이스 - 잔액 부족 등) - Case 2 활성화 (400 Error)
POST http://localhost:8080/v1/payments/callback/fail?orderId=ORDER_TEST_HOODIE&code=PAYMENT_REJECTED&message=잔액부족
Content-Type: application/json
```

만약 결제 승인에 대한 성공 케이스를 확인하고 싶다면, Beeceptor의 Mock 서버에서 200 응답에 대한 부분만 활성화해야 합니다.
반대로, 실패 케이스를 확인하고 싶다면, 400 응답에 대한 부분만 활성화해야 합니다.
그리고 서킷 브레이커의 활성화 여부(Open)도 확인한다면, 500 응답에 대한 부분을 활성화해주면 됩니다.

아래는 결제에 대한 성공/실패 케이스에 대해 응답값에 대한 로그로 찍힌 부분입니다.

> 결제 승인에 성공한 경우 로그 결과

```
13:20:28.854| INFO|{{traceId}},{{spanId}}|i.d.c.c.a.client.BeeceptorPaymentClient |[PAYMENT_CLIENT] Beeceptor 외부 결제 API 호출. Request: BeeceptorPaymentRequest(paymentKey=payment_key_test, orderId=1, amount=25000)
13:20:29.626| INFO|{{traceId}},{{spanId}}|i.d.c.c.a.client.BeeceptorPaymentClient |[PAYMENT_CLIENT] 응답 성공 - Result: PaymentResult(externalPaymentKey=payment_key_test, method=CARD, approveNo=12345678, message=결제 성공)
```

## 테스트 코드로 확인해보기

마지막으로, 앞서 Beeceptor에 설정해둔 500 에러 응답 규칙을 기반으로, 실제 코드에서 서킷 브레이커가 정상적으로 동작하는지 테스트 코드로 검증해보겠습니다.

이번 테스트는 Mocking(가짜 객체)을 사용하지 않고, 실제 외부 서버(Beeceptor)와 통신하여 서킷 브레이커의 상태 변화를 확인하는 통합 테스트 방식입니다.
- `given`(준비): Beeceptor 설정이 500 에러를 반환하도록 되어 있어야 합니다.
- `when`(실행): 실제 API를 10번 호출하여 실패 횟수를 누적시킵니다. (최소 호출 수 10회, 실패율 50% 달성)
- `then`(검증): 서킷이 `OPEN` 상태로 변했는지 확인하고, 11번째 요청 시 `Fallback` 예외가 발생하는지 확인합니다.

```kotlin
@Import(TestRestClientConfig::class)
class BeeceptorPaymentClientTest(
  private val beeceptorPaymentClient: BeeceptorPaymentClient,
  private val circuitBreakerRegistry: CircuitBreakerRegistry,
) : ContextTest() {

  @Test
  fun `외부 API가 반복적으로 실패하면 서킷 브레이커가 OPEN 되고 Fallback 예외가 발생한다`() {
    // given
    val command = PaymentCommand(
      externalPaymentKey = "payment_key_test",
      orderId = 1L,
      amount = 10000L,
    )

    val circuitBreaker = circuitBreakerRegistry.circuitBreaker("beeceptor-payment")

    // 초기 상태는 CLOSED 인지 확인
    assertThat(circuitBreaker.state).isEqualTo(CircuitBreaker.State.CLOSED)

    // when (최소 호출 수 10회, 실패율 50%)
    // 실제 Beeceptor 서버로 10번의 요청을 보냅니다. (현재 500 에러 응답 설정됨)
    for (i in 1..10) {
      try {
        beeceptorPaymentClient.requestPayment(command)
      } catch (e: Exception) {
        // 서킷 브레이커 카운팅을 위해 발생한 예외는 무시하고 반복문을 진행합니다.
      }
    }

    // then
    // 1. 10번의 실패 후 서킷 브레이커가 열렸는지(OPEN) 확인
    assertThat(circuitBreaker.state).isEqualTo(CircuitBreaker.State.OPEN)

    // 2. 서킷이 열린 상태에서 추가 요청 시, Fallback 예외(UNAVAILABLE)가 발생하는지 확인
    val exception = assertThrows(CoreException::class.java) {
      beeceptorPaymentClient.requestPayment(command)
    }
    assertThat(exception.errorType).isEqualTo(ErrorType.PAYMENT_EXTERNAL_API_UNAVAILABLE)
  }
}
```

테스트 실행 결과, 아래 그림과 같이 모든 검증 과정을 통과한 것을 확인할 수 있습니다.

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-testcode-success.png)

Beeceptor Mock 서버의 로그를 확인해보면, 의도한 대로 10번의 500 에러 요청이 발생했음을 알 수 있습니다.

![](/assets/img/technology/springboot-kotlin-external-api-circuit-breaker-payment-500-error.png)

마지막으로 애플리케이션 로그를 통해 서킷 브레이커의 상태 변화를 확인할 수 있습니다.
로그를 자세히 보시면 10번째 실패 이후 `CallNotPermittedException`이 발생하며, 이후
**"CircuitBreaker is OPEN"** 이라는 메시지와 함께 결제 요청이 차단되는 것을 볼 수 있습니다.

```
// 10번째 실패 로그 (500 Error - 실제 네트워크 통신 발생)
13:53:43.095| WARN|{traceId}, {spanId}|i.d.c.c.s.c.DefaultCircuitBreaker       |[CircuitBreaker: beeceptor-payment] 실행 중 예외 발생: org.springframework.web.client.HttpServerErrorException$InternalServerError: 500 Internal Server Error: [no body]
...
// 11번째 요청 차단 로그 (Circuit Open - 통신 차단)
io.github.resilience4j.circuitbreaker.CallNotPermittedException: CircuitBreaker 'beeceptor-payment' is OPEN and does not permit further calls
13:53:43.099| WARN|{traceId}, {spanId}|i.d.c.c.a.client.BeeceptorPaymentClient |[Circuit Open] Beeceptor 결제 서비스 차단됨. 잠시 후 재시도 필요.
```

## 마무리하기

외부 시스템 연동 시 장애 전파를 방지하고 시스템을 격리하기 위해 서킷 브레이커를 적용할 수 있습니다.

현 포스팅에서는 '결제' 도메인을 기준으로 서킷 브레이커를 적용한 부분에 대해 다뤄봤습니다. 
결제 시스템은 '안정성'이 중요하고 도메인과 비즈니스 특성상 외부 요인이 많아서 장애에 대한 처리가 중요합니다.

하지만, 결제 외에도 다른 도메인에서 외부 연동하는 부분이 있고, 장애 격리가 필요한 상황이라면 서킷 브레이커 도입을 고려해 보시기를 추천합니다.

서비스와 비즈니스에 따라 서킷 브레이커의 설정값과 타임아웃에 대한 전략이 다르기 때문에, 이러한 부분을 서비스의 기능과 요구사항, 내부 정책을 팀원분들과 협의하는 것이 중요하다고 봅니다.

결국 운영 환경에서는 다양한 장애가 발생할 수 있기 때문에, 사용자에게는 불편함을 주지 않고, 
운영자는 장애 대응에 집중할 수 있도록 명확한 내부 정책을 수립하는 것이 중요하다는 점을 배웠습니다.

지금까지 읽어주셔서 감사합니다.

## Reference

- [Beeceptor - Mock 테스트](https://app.beeceptor.com/)

- [[인프런] 제미니의 개발실무 - 커머스 백엔드 기본편](https://www.inflearn.com/course/제미니의-개발실무-커머스-백엔드-기본)

- [[토스페이먼츠] 개발자센터](https://docs.tosspayments.com/reference)

- [[우아한형제들] 기술블로그 - 결제는 계속된다. 결제 담당자가 장애에 대응하는 방법](https://techblog.woowahan.com/15236/)

- [[Google] 모바일 페이지 로드 속도 높이기](https://support.google.com/adsense/answer/7450973?hl=ko)