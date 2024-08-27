---
layout: post
title:  " Practical Testing: 테스트 코드 작성 방법 - Mock, 더 나은 테스트를 위한 구체적 조언 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

> 이 글은 [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard) 강의를 듣고 내용을 정리한 글입니다.

> [지난 글](https://devfancy.github.io/Practical-Testing/)에 이어서 정리해보려고 합니다.

## Mock을 마주하는 자세

### Mockito로 Stubbing 하기

> 새로운 요구사항

* 관리자 페이지에서 주문관리탭 - 오늘 하루동안 발생한 매출 통계를 메일로 전송받는 기능을 구현한다. → 날짜와 결제금액

* 주문 데이터를 기반으로 총 결제가 이뤄진 금액을 알고 싶다.

* 주문통계에 대한 서비스 - `OrderStatisticsService`

(실무에서는 주문완료 시간과 별도로 결제완료 시간에 대한 필드가 있어야 하는데, 이 토이 프로젝트에서는 모의로 구현하는 것이기때문에 일단 주문완료 시간을 가지고 구현한다)

![](/assets/img/testcode/Practical-Testing2-1.png)

---

> 해당 요구사항에 대한 구현 코드 - [Mockito로 Stubbing하기](https://github.com/devFancy/cafekiosk/commit/2e42108d2fb4db096c6bc032d23f533f08cbcfc7)입니다.
> 
> 해당 코드에서 `OrderStatisticsServiceTest.java`을 참고해주시면 되겠습니다.

`Stubbing`이란 테스트를 진행할 때 가짜 객체(Mock)에 대해 어떤 행동을 하도록 지정하는 작업을 말한다.

여기서 `Stubbing`을 하기 위해 MailSendClient 클래스를 `@MockBean`을 통해 Mockito에서 만든 Mock 객체를 주입한 다음, 원하는 행위를 정의해준다.

![](/assets/img/testcode/Practical-Testing2-2.png)

`MockBean`은 **기존에 사용되던 Bean의 껍데기만 가져오고 내부의 구현 부분은 모두 사용자에게 위임한 형태**이다. 실제 빈의 동작과는 별개로 사용자(개발자)가 원하는 행동을 정의할 수 있다.

(`@MockBean`은 `@SpringBootTest`에서 사용되며, 테스트에서 사용할 Mock 객체를 주입하는 데에 쓰인다)

![](/assets/img/testcode/Practical-Testing2-3.png)

이렇게 `@MockBean`을 이용하여 Stubbing 하는 행위는 `given` 절에서 작성한다.

* `when(mailSendClient.sendEmail(any(String.class), any(String.class), any(String.class), any(String.class))).thenReturn(true);`를 예로 들면, 

* `when` 메서드는 특정 메서드 호출이 발생할 때 어떤 값으로 리턴해야 하는지 정의하는데, 여기서는 `mailSendClient.sendEmail` 메서드가 아무 문자열(any(String.class)) 인자로 호출될 때,

*  모의 객체(Mock)인 `mailSendClient`는 항상 true를 반환한다는 의미이다.

* 이처럼 테스트 환경에서는 실제로 이메일을 보내지 않고도, 메일 전송 메서드의 성공적인 호출을 시뮬레이션하기 위해 `Mockito로 Stubbing 하는 방식`을 사용한다.

> [참고] 메일 전송과 같은 로직에서는 `Transactional` 어노테테이션을 붙일 필요가 없다.

* `OrderStatisticsService`에는 DB 조회를 하는 `findOrdersBy`와 같은 로직이 존재하는데 왜 트랜잭션이 필요가 없을까?

* DB 조회를 할 때 커넥션을 가지고 메일이 전송 완료될 때까지 커넥션을 유지하고 있을 것이다. 메일 전송 등과 같은 오랜 시간이 걸리는 작업에서는 트랜잭션을 걸지 않는 것이 좋다.

### Test Double

> Test Double에 대한 정의와 종류에 대해 자세히 알고 싶다면, [이 글](https://martinfowler.com/articles/mocksArentStubs.html)을 참고하자.

* `Dummy` : 아무것도 하지 않는 깡통 객체

* `Fake` : 단순한 형태로 동일한 기능은 수행하나, 프로덕션에서 쓰기에는 부족한 객체(FakeRepository)

* **`Stub`** : 테스트에서 요청한 것에 대해 미리 준비한 결과를 제공하는 객체. 그 외에는 응답하지 않는다.

* `Spy` : Stub이면서 호출된 내용을 기록하여 보여줄 수 있는 객체. 일부는 실제 객체처럼 동작시키고 일부만 Stubbing만 할 수 있다. → 실제 객체와 유사하게 동작

* **`Mock`** : `행위`에 대한 기대를 명세하고, 그에 따라 동작하도록 만들어진 객체

#### Stub vs Mock

* 공통점: 둘다 가짜 객체, 요청한 것에 대해 미리 준비한 결과를 제공한다.

* 차이점: **검증하는 목적이 다르다**. (There is a difference in that the stub uses state verification while the mock uses behavior verification. - Martin Fowler -)

    * `Stub`: 상태 검증(State Verification)

    * `Mock`: 행위 검증(Behavior Verification)

### @Mock, @Spy, @InjectMocks

#### 모든 객체에 대해 Stubbing을 해주지 않았는데도 테스트가 통과되는 이유

아래 코드는 `MailService`의 sendMail 메서드에 대한 테스트 코드이다.

```java
// MailService 클래스
// 클라이언트(MailSendClient)를 통해 메일을 보낸 후, 이를 성공적으로 전송했을 때 해당 이력을 mailSendHistoryRepository 을 통해 기록하는 역할을 수행
@RequiredArgsConstructor
@Service
public class MailService {
    private final MailSendClient mailSendClient;
    private final MailSendHistoryRepository mailSendHistoryRepository;
    public boolean sendMail(String fromEmail, String toEmail, String subject, String content) {
        boolean result = mailSendClient.sendEmail(fromEmail, toEmail, subject, content);
        if(result) {
            mailSendHistoryRepository.save(MailSendHistory.builder()
                    .fromEmail(fromEmail)
                    .toEmail(toEmail)
                    .subject(subject)
                    .content(content)
                    .build()
            );
            return true;
        }
        return false;
    }
}
// MailServiceTest
class MailServiceTest {

  @DisplayName("메일 전송 테스트")
  @Test
  void sendMail() {
    // given
    MailSendClient mailSendClient = Mockito.mock(MailSendClient.class);
    MailSendHistoryRepository mailSendHistoryRepository = Mockito.mock(MailSendHistoryRepository.class);

    MailService mailService = new MailService(mailSendClient, mailSendHistoryRepository);

    // Stubbing - Mock 객체에 원하는 행위를 정의하는 것
    when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
            .thenReturn(true);

    // when
    boolean result = mailService.sendMail("", "", "", "");

    // then
    Assertions.assertThat(result).isTrue();
  }

}
```

자세히 보면, `MailService`의 sendMail 메서드에서 `mailSendHistoryRepository.save()`에 대한 Stubbing 없이 sendMail 메서드를 테스트하면 정상적으로 통과가 되는데 왜 그런걸까?

Mockito의 mock 메서드에 가보면 아래와 같이 withSettings() 메서드를 볼 수 있다.

여기서 withSettings() 메서드에서 리턴하는 부분에서 `RETURNS_DEFAULTS`에 가보면

![](/assets/img/testcode/Practical-Testing2-4.png)

![](/assets/img/testcode/Practical-Testing2-5.png)

![](/assets/img/testcode/Practical-Testing2-6.png)

Integer인 경우 zero을 리턴하고, null이 반환되는 값들은 null을 반환하고, Collection의 경우 empty 를 반환하도록 기본 정책이 걸려있는 걸 확인할 수 있다.

그래서 save 메서드를 호출했을 때 기본으로 null을 반환하도록 하여 테스트가 통과된 것을 알 수 있다.

이를 조금 더 명시적으로 검증하기 위해 아래와 같이 `verify` 메서드를 통해 작성해볼 수 있다.

```
// mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
```

위의 `MailServiceTest`을 다음과 같이 리팩터링 작업을 진행한다.

* `MailSendClient`, `MailSendHistoryRepository` 클래스를 `Mock` 어노테이션을 이용하여 생성자를 주입한다.

* 그리고 MailServiceTest 위에 `@ExtendWith(MockitoExtension.class)` 걸어준다 -> “테스트가 시작될때, Mockito를 통해 mock 만들거야”를 알려줘야 한다. → 그리고 mock 객체를 만들어주고 `mailService`에 넣어주게 된다.

```java
@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @Mock
    private MailSendClient mailSendClient;
    @Mock
    private MailSendHistoryRepository mailSendHistoryRepository;

    @DisplayName("메일 전송 테스트")
    @Test
    void sendMail() {
        // given
        MailService mailService = new MailService(mailSendClient, mailSendHistoryRepository);

        // Stubbing - Mock 객체에 원하는 행위를 정의하는 것
        when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(true);

        // when
        boolean result = mailService.sendMail("", "", "", "");

        // then
        Assertions.assertThat(result).isTrue();
        // mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
        Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
    }

}
```

여기서 `MailService`도 `@InjectMocks` 어노테이션으로 만들어줄 수 있다.

* `MailService`에 생성자를 보고 Mockito의 mock으로 선언된 `MailSendClient`, `MailSendHistoryRepository` 애들을 inject 해준다.

* 즉, `@InjectMocks` 어노테이션은 DI와 똑같은 일을 하게 된다. 

    * `MailService` 클래스 내에서 사용하는 Mock 객체들을 자동으로 주입해주는 역할이다.  => `MailService mailService = new MailService(mailSendClient, mailSendHistoryRepository);`

    * 이는 Mockito가 관리하는 Mock 객체들을 테스트 대상 클래스에 주입하여 테스트를 수행할 수 있도록 도와주는 기능이다.

InjectMocks 어노테이션 사용하면 아래와 같이 된다.

```java
@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @Mock
    private MailSendClient mailSendClient;
    @Mock
    private MailSendHistoryRepository mailSendHistoryRepository;

    @InjectMocks
    private MailService mailService;
    @DisplayName("메일 전송 테스트")
    @Test
    void sendMail() {
        // given

        // Stubbing - Mock 객체에 원하는 행위를 정의하는 것
        when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(true);

        // when
        boolean result = mailService.sendMail("", "", "", "");

        // then
        Assertions.assertThat(result).isTrue();
        // mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
        Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
    }

}
```

#### @Spy는 기록을 하는 객체

`@Spy` 어노테이션은 **객체의 일부 메소드만을 Mock으로 대체**할 수 있기 때문에, 나머지 메소드는 실제 객체의 동작을 그대로 따르게 된다.

이는 특히 특정 메소드의 동작을 유지하면서 일부 동작을 변경하거나 감시할 때 유용하다. -> 일부만 Stubbing만 하여 테스트를 할 수 있다.

예를 들어, `MailSendClient` 클래스에 여러 메서드 기능들이 있고, `MailService`에서 a,b,c 기능을 그대로 사용하고 있다고 가정해보자.

```java
// MailSendClient - sendMail, a, b, c 메서드가 구현되어 있음.
@Slf4j
@Component
public class MailSendClient {
  public boolean sendEmail(String fromEmail, String toEmail, String subject, String content) {
    log.info("메일 전송");
    throw new IllegalArgumentException("메일 전송");
  }

  public void a() {
    log.info("a");
  }
  public void b() {
    log.info("b");
  }

  public void c() {
    log.info("c");
  }
}

// MailService - a, b, c 기능을 그대로 사용하고 있음.
@RequiredArgsConstructor
@Service
public class MailService {

  private final MailSendClient mailSendClient;
  private final MailSendHistoryRepository mailSendHistoryRepository;
  public boolean sendMail(String fromEmail, String toEmail, String subject, String content) {
    boolean result = mailSendClient.sendEmail(fromEmail, toEmail, subject, content);
    if(result) {
      mailSendHistoryRepository.save(MailSendHistory.builder()
              .fromEmail(fromEmail)
              .toEmail(toEmail)
              .subject(subject)
              .content(content)
              .build()
      );
      mailSendClient.a();
      mailSendClient.b();
      mailSendClient.c();

      return true;
    }

    return false;
  }
}

// 
```

여기서 `MailServiceTest` 에서 `MailSendClient` 의 sendEmail()만 Stubbing 하고 싶고, 나머지 a,b,c는 원본 객체의 기능이 동일하게 동작하고 싶은 경우 `@Spy` 어노테이션을 활용한다.

* `@Spy`는 실제 객체를 기반으로 만들어지기 때문에, `MailServiceTest`에서 아래와 같은 when 부분을 지워야(주석 처리해야) 한다. → Stubbing이 되지 않는다.

* 대신 doReturn으로 아래와 같이 작성해준다.

```java
@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @Spy
    private MailSendClient mailSendClient;
    @Mock
    private MailSendHistoryRepository mailSendHistoryRepository;

    @InjectMocks
    private MailService mailService;
    @DisplayName("메일 전송 테스트")
    @Test
    void sendMail() {
        // given

//        // Stubbing - Mock 객체에 원하는 행위를 정의하는 것
//        when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
//                .thenReturn(true);
        doReturn(true)
                .when(mailSendClient)
                .sendEmail(anyString(), anyString(), anyString(), anyString());

        // when
        boolean result = mailService.sendMail("", "", "", "");

        // then
        Assertions.assertThat(result).isTrue();
        // mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
        Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
    }

}
```

![](/assets/img/testcode/Practical-Testing2-7.png)

sendEmail()만 원하는 Stubbing이 된거고, 나머지 a,b,c 라는 실제 객체는 그대로 동작이 되었다. 

이처럼 일부는 Stubbing, 나머지 실제처럼 사용할 때 `@Spy` 어노테이션을 사용한다.

(사실 `@Spy`를 사용하면 특정 서비스의 일부 기능만 테스트하는데, 빈도수가 그렇게 많지는 않아서 실무에서는 `@Spy` 보다는 `@Mock`을 더 자주 사용한다)

### BDDMockito

아래 코드에서 given 절을 보면, 어색한 부분을 확인할 수 있다. 

```java
@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @Mock
    private MailSendClient mailSendClient;
    @Mock
    private MailSendHistoryRepository mailSendHistoryRepository;

    @InjectMocks
    private MailService mailService;
    
    @DisplayName("메일 전송 테스트")
    @Test
    void sendMail() {
        // given - Stubbing
        Mockito.when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(true);

        // when
        boolean result = mailService.sendMail("", "", "", "");

        // then
        Assertions.assertThat(result).isTrue();
        // mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
        Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
    }

}
```

given 절에 사용된 `Mockito.when()` 메서드는 Stubbing을 위해 given 영역에 사용하는 것이 맞지만 when() 이라는 문법이 가독성을 저하시키고 혼란을 야기할 수 있다.

그래서 이를 해결하기 위해 BDDMockito의 문법인 `BDDMockito.given()` 메서드를 사용하면, given 절과 유사해진다.

```java
@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @DisplayName("메일 전송 테스트")
    @Test
    void sendMail() {
        // given
        // BDDMockito의 문법인 BDDMockito.given을 사용하면 BDD 스타일을 지킬 수 있다.
        BDDMockito.given(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .willReturn(true);

        // when
        boolean result = mailService.sendMail("", "", "", "");

        // then
        Assertions.assertThat(result).isTrue();
        // mailSendHistoryRepository.save()가 1 번 호출되었는지를 검증
        Mockito.verify(mailSendHistoryRepository, times(1)).save(any(MailSendHistory.class));
    }

}
```

![](/assets/img/testcode/Practical-Testing2-8.png)

`BDDMockito` 를 가보면 Mockito를 감싸고 있다. (상속받고 있다)

모든 동작이 같은데, BDD 스타일로만 바뀐 것이다. -> 이름만 바꿨고, 기능은 동일하다.

결론은 앞으로 테스트 코드를 **BDD 스타일로 작성할 때는 `BDDMockito` 문법을 사용**하자!

### Classicist vs Mockist

* Classicist - 진짜 객체로 테스트를 하자. -> **상태 검증**을 통한 의존 객체의 구현보다는 실제 입/출력 값을 통해 검증하는 테스트이다.

* Mockist - 모든 걸 mocking 위주(가짜 객체)로 테스트를 하자. -> **행위 검증**을 통해 의존 객체의 특정 행동이 이루어졌는지를 검증하는 테스트이다.

이번 강의에서는 Controller 테스트할 때는 Service와 Repository를 Mocking하여 단위 테스트를 진행했고, Service 테스트 할 때는 Repository의 실제 객체를 사용한 통합 테스트를 진행했다.

![](/assets/img/testcode/Practical-Testing2-9.png)

Mockist 입장에서 바라보면 Service 테스트 할 때에도 Repository에도 실제 객체가 아닌 Mocking을 하여 단위 테스트로 신속히 테스트를 해야 한다. -> 어느 것이 더 좋은 방법일까?

> 이 강의를 만드신 우빈님의 생각

![](/assets/img/testcode/Practical-Testing2-10.png)

* 메일 전송같은 외부 시스템을 요청하거나 연결할 때 Mocking을 쓴다. -> 외부 시스템은 우리가 개발한 게 아니기 때문이다.

* Mocking 위주로 테스트를 작성한다면, **"실제 프로덕션 코드에서 런타임 시점에 일어날 일을 정확하게 `Stubbing(Mocking)` 했다고 단언할 수 있는가?"**

* 테스트를 했다고 100% 재현할 수 있나? → 그런 리스크를 안고 갈 바에는 비용을 조금 더 들여서 실제 객체를 가져와서 테스트를 하는게 낫다는게 Classicist 입장이신 우빈님의 생각이다.

-> 내 생각: **AWS S3나 소셜 로그인(OAuth 2.0)과 같은 외부 시스템과 연동하는 비즈니스 로직을 테스트할 경우에는 Mock을 사용하는 것이 효과적**이라는 생각이 들었다.

## 더 나은 테스트를 작성하기 위한 구체적 조언

### 한 문단에 한 주제!

테스트 코드를 글쓰기 관점에서 봤을 때, 하나의 테스트는 하나의 주제만을 가져야 한다.

논리구조에는 분기문(if), 반복문(while, for)이 있다.

* 분기문이 존재한다는 것 자체가 2가지 이상 내용이 들어가있다는 걸 반증한다.

* 반복문 역시 테스트 코드를 읽는 사람이 한번 더 생각해야 한다.

* 결론은, 케이스가 두 가지 이상 생기면 → 테스트 코드를 2개로 나눠서 코드를 작성한다. -> 논리구조는 방해 요소가 될 수 있기 때문에 되도록 지양하자.

### 완벽하게 제어하기

테스트 환경에서 제어할 수 없는 것들은 완벽하게 제어할 수 있도록 한다.

`LocalDateTime.now()`와 같은 제어할 수 없는 코드의 경우 -> 현재 시간을 분리해서 상위 레벨로 올리고, 테스트할 때는 원하는 시간을 주입해서 상황을 재연한다.

현재 시간이라는 데이터를 기준으로 테스트하는 것 보다, 고정된 날짜 또는 시간 등을 가지고 테스트하는 것이 좋다.

```java
// CafeKiosk
@Getter
public class CafeKiosk {
    public Order createOrder() {
            LocalDateTime currentDateTime = LocalDateTime.now();
            LocalTime currentTime = currentDateTime.toLocalTime();
            if(currentTime.isBefore(SHOP_OPEN_TIME) || currentTime.isAfter(SHOP_CLOSE_TIME)) {
                throw new IllegalArgumentException("주문 시간이 아닙니다. 관리자에게 문의하세요.");
            }
    
            return new Order(currentDateTime, beverages);
        }
		
    public Order createOrder(LocalDateTime currentDateTime) {
        LocalTime currentTime = currentDateTime.toLocalTime();
        if(currentTime.isBefore(SHOP_OPEN_TIME) || currentTime.isAfter(SHOP_CLOSE_TIME)) {
            throw new IllegalArgumentException("주문 시간이 아닙니다. 관리자에게 문의하세요.");
        }

        return new Order(currentDateTime, beverages);
    }
}

// CafeKioskTest
class CafeKioskTest {
    @Test
    void createOrder() {
      CafeKiosk cafeKiosk = new CafeKiosk();
      Americano americano = new Americano();
  
      cafeKiosk.add(americano);
  
      Order order = cafeKiosk.createOrder();
  
      assertThat(order.getBeverages()).hasSize(1);
      assertThat(order.getBeverages().get(0).getName()).isEqualTo("아메리카노");
    }
  
    @Test
    void createOrderWithCurrentTime() {
      CafeKiosk cafeKiosk = new CafeKiosk();
      Americano americano = new Americano();
  
      cafeKiosk.add(americano);
  
      Order order = cafeKiosk.createOrder(LocalDateTime.of(2023, 11, 30, 10, 0));
  
      assertThat(order.getBeverages()).hasSize(1);
      assertThat(order.getBeverages().get(0).getName()).isEqualTo("아메리카노");
    }
    
    @Test
    void createOrderOutsideOpenTime() {
      CafeKiosk cafeKiosk = new CafeKiosk();
      Americano americano = new Americano();
  
      cafeKiosk.add(americano);
  
      assertThatThrownBy(() -> cafeKiosk.createOrder(LocalDateTime.of(2023, 11, 30, 9, 59)))
              .isInstanceOf(IllegalArgumentException.class)
              .hasMessage("주문 시간이 아닙니다. 관리자에게 문의하세요.");
    }
}
```

`createOrder()`는 현재 시간을 기준으로 성공할 수도, 실패할 수도 있다.

반면에, `createOrderWithCurrentTime()`, `createOrderOutsideOpenTime()` 는 임의의 시간을 정해서 원하는 상황을 완벽하게 연출할 수 있게 되었다.

외부 시스템일 경우, Mocking 처리하고 테스트를 구성한다.

### 테스트 환경의 독립성을 보장하자

```java
// OrderServiceTest
class OrderServiceTest {
    @DisplayName("재고가 부족한 상품으로 주문을 생성하려는 경우 예외가 발생한다.")
    @Test
    void createOrderWithNoStock() {
        LocalDateTime registeredDateTime = LocalDateTime.now();
        // given
        Product product1 = createProduct(BOTTLE, "001", 1000);
        Product product2 = createProduct(BAKERY, "002", 3000);
        Product product3 = createProduct(HANDMADE, "003", 5000);
        productRepository.saveAll(List.of(product1, product2, product3));

        Stock stock1 = Stock.create("001", 2);
        Stock stock2 = Stock.create("002", 2);
        stock1.deductQuantity(1); // todo
        stockRepository.saveAll(List.of(stock1, stock2));


        OrderCreateServiceRequest request = OrderCreateServiceRequest.builder()
                .productNumbers(List.of("001", "001", "002", "003"))
                .build();

        // when & then
        assertThatThrownBy(() -> orderService.createOrder(request, registeredDateTime))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("재고가 부족한 상품이 있습니다.");
    }
}
```

여기서 `stock1.deductQuantity(3);` 으로 하고 createOrderWithNoStock 메서드에 대한 테스트를 실행하면 실패가 뜨는데, 왜그럴까?

* 재 001에 대한 재고는 2개인데, 3개를 차감한다고 설정했기 때문에 `차감할 재고 수량이 없습니다.`와 같은 예외 메시지가 보여지게 된다.

* 이러면 2가지 문제가 있다.

    * given 환경에서 `stock1.deductQuantity(1);`에 대한 맥락을 이해해야 한다. → 논리적인 사고과정 1번 더 이해해야함 → 해당 기능이 `stock1.deductQuantity(3);` 와 같이 문제가 될 수도 있다.

    * 테스트가 실패하는 부분은 when 혹은 then이어야 하는데, given에서 실패할 수도 있다는 생각을 고려해야함 → 테스트 주제와 맞지 않은 부분(given)에서 테스트가 실패한 것이다.

* 이런 테스트 환경을 구성할 때, **생성자 기반으로 구성하는 것이 좋다.**

* create 메서드 보다는 createProduct 메서드와 같이 **순수한 빌더 패턴이나 생성자 기반으로 객체를 생성하고, given절에 구성하는게 좋다.**

### 한 눈에 들어오는 Test Fixture 구성하기

`Test Fixture`란 Given절을 구성할 때, 테스트를 위해 원하는 상태로 고정시킨 일련의 객체를 의미한다.

> Fixture: 고정물, 고정되어 있는 물체

* `@BeforeAll` - 매 **테스트 클래스**를 실행하기 전에 무언가 작업을 하는 어노테이션

* `@BeforeEach` - 매 **테스트 메서드**를 실행하기 전에 무언가 작업을 하는 어노테이션

```java
@BeforeAll
static void beforeAll() {

}

@BeforeEach
void setUp() {
    
}
```

`@BeforeEach`의 단점 - setUp을 지양하는 이유

* setUp() 에 위치한 공동의 fixture들은 **테스트간 결합도가 생기게 만듬 → 모든 테스트에 영향을 주기 때문에** 지양, 사용하지 않는 것이 좋다.

* setUp() 에 fixture들을 구성했다. -> 그런데 만약 테스트 길이가 긴 경우, setUp()과 연관지어서 생각을 해야해서 문서로의 역할을 기대하기 어렵다.

그렇다면 `@BeforeEach`을 언제 사용해야 할까?

* 각 테스트 입장에서 봤을 때, 아예 몰라도 테스트 내용을 이해하는 데에 문제가 없는가?

* setUp() 메서드를 수정해도 모든 테스트에 영향을 주지 않는가?

위 2가지 질문을 만족한다면 `@BeforeEach`의 setUp() 메서드를 사용해도 괜찮을 것이다.

#### Fixture 구성할 때 유의해야 할 점들

[1] 미리 셋업하는 data.sql과 같은 파일은 되도록 지양하자! (권장하지 않음)

* 애플리케이션이 점점 고도화될 수록 해당 파일에 들어가는 데이터양이 증가하면-> 하나의 테스트 클래스 혹은 문서를 볼 때, 테스트의 목적을 파악하기 힘들고, sql의 파일의 수가 늘어나 관리하기가 힘들어 질 수 있다.

[2] given 절을 구성할 때 필요한 파라미터만 구성하자! 아래와 같이 테스트에 딱 필요한 메서드만 명시하는게 좋다.

* **테스트 클래스마다 필요한 파라미터를 넣어서 구분**하는게 관리면에서 중요하다.

* 아래 클래스에서 `name`과 같은 필드가 없어도 상관없는 테스트라면 2번처럼 사용하면 된다.

```java
class ProductServiceTest {
    // 모든 필드 파라미터로 받는 Builder 메서드
    private Product createProduct(String productNumber, ProductType type, ProductSellingStatus sellingStatus, String name, int price) {
        Product product1 = Product.builder()
                .productNumber(productNumber)
                .type(type)
                .sellingStatus(sellingStatus)
                .name(name)
                .price(price)
                .build();
        return product1;
    }
    // 2. 불필요한 파라미터(name)를 제거한 Builder 메서드
    private Product createProduct(String productNumber, ProductType type, ProductSellingStatus sellingStatus, int price) {
        Product product1 = Product.builder()
                .productNumber(productNumber)
                .type(type)
                .sellingStatus(sellingStatus)
                .name("아메리카노")
                .price(price)
                .build();
        return product1;
    }
}
```

[3] **fixture를 만들기 위한 builder를 한 곳에 모으는 것은 지양**하자! → 수십개가 생겨서 복잡도가 올라간다.

  * 실무에서 사용하는 객체들은 필드가 수십개가 넘는 경우가 대부분이다. -> 각기 다른 builder를 만들어서 다른 패키지(fixture)에 넣으면 관리가 안된다. → 이유: builder만 수십개만 만들어져서 갈수록 사용하기 힘들어진다.

  * **테스트 클래스마다 필요한 파라미터만 뽑는 builder를 만드는게 낫다.**

  * (코틀린을 사용하면 어느정도 해소가 된다.(lombok, builder 필요 없음) → 코틀린에서는 default 값을 명시할 수 있어서 편하게 사용할 수가 있다)

### Test Fixture 클렌징

> deleteAll() 과 deleteAllBatch()의 차이점

* `OrderProduct`는 Order, Product의 외래키를 가지고 있음, 주문과 상품의 중간테이블 역할이다.

* `OrderProduct`는 `Order`와 양방향 매핑 처리를 했고, `Product`에는 단방향 매핑 처리를 했다.

```java
class OrderServiceTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private OrderService orderService;	
		@AfterEach
    void tearDown() {
        orderProductRepository.deleteAllInBatch();
        productRepository.deleteAllInBatch();
        orderRepository.deleteAllInBatch();
        stockRepository.deleteAllInBatch();
    }
}
```

createOrder() 메서드에 대해 테스트를 실행하면, **연관된 테이블을 한번에 삭제하게 해준다.**

![](/assets/img/testcode/Practical-Testing2-11.png)

```sql
// 시스템 로그
Hibernate: 
    delete 
    from
        order_product
Hibernate: 
    delete 
    from
        product
Hibernate: 
    delete 
    from
        orders
Hibernate: 
    delete 
    from
        stock
```

여기서 orderProductRepository와 productRepository 순서를 바꾸고 다시 실행해보면, 실패가 된다.

```
org.springframework.dao.DataIntegrityViolationException: could not execute statement; SQL [n/a]; constraint ["FKHNFGQYJX3I80QOYMRSSLS3KNO: PUBLIC.ORDER_PRODUCT FOREIGN KEY(PRODUCT_ID) REFERENCES PUBLIC.PRODUCT(ID) (CAST(1 AS BIGINT))"; SQL statement:
delete from product [23503-214]]; nested exception is org.hibernate.exception.ConstraintViolationException: could not execute statement
```

`productRepository`을 먼저 지우려고 하다보니까, **`Product`의 PK가 `OrderProduct`에 참조키로 제약조건이 걸려있어서 지울 수 없다는 예외가 발생한 것**이다.

-> 매핑 테이블에서 외래키를 가지고 있는 테이블(`OrderProduct`)을 먼저 지워야 테스트가 성공적으로 된다.

즉, **상품과 주문의 외래키를 가지고 있는 `OrderProduct` 테이블을 먼저 지워야 한다.** -> 테스트 성공

이처럼 `deleteAllBatch()`는 순서를 고려해야 한다. (외래키 조건)

`deleteAllBatch()` 대신 `deleteAll()`로 바꾸고 실행하면 **테스트는 성공해도, 조회하는 쿼리가 많아졌다.**

![](/assets/img/testcode/Practical-Testing2-12.png)

```sql
// 시스템 로그
Hibernate: 
    select
        order0_.id as id1_2_,
        order0_.created_date_time as created_2_2_,
        order0_.modified_date_time as modified3_2_,
        order0_.order_status as order_st4_2_,
        order0_.registered_date_time as register5_2_,
        order0_.total_price as total_pr6_2_ 
    from
        orders order0_
Hibernate: 
    select
        orderprodu0_.order_id as order_id4_1_0_,
        orderprodu0_.id as id1_1_0_,
        orderprodu0_.id as id1_1_1_,
        orderprodu0_.created_date_time as created_2_1_1_,
        orderprodu0_.modified_date_time as modified3_1_1_,
        orderprodu0_.order_id as order_id4_1_1_,
        orderprodu0_.product_id as product_5_1_1_ 
    from
        order_product orderprodu0_ 
    where
        orderprodu0_.order_id=?
Hibernate: 
    delete 
    from
        order_product 
    where
        id=?
Hibernate: 
    delete 
    from
        order_product 
    where
        id=?
Hibernate: 
    delete 
    from
        orders 
    where
        id=?
Hibernate: 
    select
        product0_.id as id1_3_,
        product0_.created_date_time as created_2_3_,
        product0_.modified_date_time as modified3_3_,
        product0_.name as name4_3_,
        product0_.price as price5_3_,
        product0_.product_number as product_6_3_,
        product0_.selling_status as selling_7_3_,
        product0_.type as type8_3_ 
    from
        product product0_
Hibernate: 
    delete 
    from
        product 
    where
        id=?
Hibernate: 
    delete 
    from
        product 
    where
        id=?
Hibernate: 
    delete 
    from
        product 
    where
        id=?
Hibernate: 
    select
        stock0_.id as id1_4_,
        stock0_.created_date_time as created_2_4_,
        stock0_.modified_date_time as modified3_4_,
        stock0_.product_number as product_4_4_,
        stock0_.quantity as quantity5_4_ 
    from
        stock stock0_
```

위 로그만 봐도 알 수 있듯이 테스트 코드의 given 절이 많아질 수록 클렌징 시 deleteAll()과 deleteAllInBatch()의 성능 차이가 발생한다.

deleteAll()을 자세히 들어가보면(단축키: option + command + b)

![](/assets/img/testcode/Practical-Testing2-13.png)

전체 테이블을 읽어온다음에, 반복문을 돌면서 건 by 건으로 delete하고 있다.

-> 결론적으로 말하면 deleteAll()을 사용하면 deleteAllBatch()보다 성능이 더 안좋을 수 있다.

* 예를 들어, Test given절이 많아서 해당 테이블의 연관관계를 모두 찾아서 하나씩 다 지워야 하기 때문에, 성능적으로 더 안좋을 수 있다.

* 테스트도 비용이다. 전체 테스트를 돌리거나 빠른 테스트를 돌릴 때 시간 자체도 비용이 발생한다.

또한, deleteAll()도 deleteAllBatch()와 마찬가지로 순서를 고려해야 한다.

정리하면, **테이블의 연관관계를 잘 고려해서 메서드 순서를 잘 지정해주면, 테스트 속도와 성능 면에서 `deleteAllInBatch()`를 사용하는 것이 더 효과적**이라는 것이다.

### @Parameterized Test

`@ParameterizedTest`는 값을 여러개 바꾸면서 테스트를 하고 싶을 경우 사용하는 Junit 어노테이션이다.

(아래 예시 외에 다른 예시들은 [공식문서](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests)를 참고하자)

> containsStockType3 -  모든 타입에 대해서 테스트를 한다.

```java
class ProductTypeTest {
    @DisplayName("상품 타입이 재고 관련 타입인지를 체크한다.")
    @CsvSource({"HANDMADE,false", "BOTTLE,true", "BAKERY,true"})
    @ParameterizedTest
    void containsStockType3(ProductType productType, boolean expected) {
        // when
        boolean result = ProductType.containsStockType(productType);

        // then
        assertThat(result).isEqualTo(expected);
    }
}
```

> containsStockType4 - 별도의 메서드로 빼서 어떤 타입을 테스트할지 값을 명시해서 테스트를 한다.

* `@MethodSource` 안에는 사용할 메서드 이름을 써주면 된다.

```java
class ProductTypeTest {
    private static Stream<Arguments> provideProductTypesForCheckingStockType() {
      return Stream.of(
              Arguments.of(ProductType.HANDMADE, false),
              Arguments.of(ProductType.BOTTLE, true),
              Arguments.of(ProductType.BAKERY, true)
      );
    }
  
    @DisplayName("상품 타입이 재고 관련 타입인지를 체크한다.")
    @MethodSource("provideProductTypesForCheckingStockType")
    @ParameterizedTest
    void containsStockType4(ProductType productType, boolean expected) {
      // when
      boolean result = ProductType.containsStockType(productType);
  
      // then
      assertThat(result).isEqualTo(expected);
    }
}
```

### @DynamicTest

`@DynamicTest`는 단계별로 테스트를 수행하고 싶을 경우 사용한다. -> 시나리오를 기반으로 상태(given절)를 공유하면서 테스트를 작성해 볼 수 있다.

>  **Dynamic Test**는 런타임 동안에 테스트가 생성되고 수행된다. 그래서 프로그램이 수행되는 도중에도 동작을 변경할 수 있는 특징이 있다. 이 다이나믹 테스트는 `@Test` 어노테이션을 사용하지 않고, `@TestFactory 어노테이션`을 통해 팩토리 메서드로 생성된다.

DynamicTest의 경우 아래와 같은 형식으로 작성한다.

```java
class DynamicTestEx {
      @DisplayName("")
      @TestFactory
      Collection<DynamicTest> dynamicTest() {
  
          return List.of(
                  DynamicTest.dynamicTest("", () -> {
  
                  }),
                  DynamicTest.dynamicTest("", () -> {
  
                  })
          );
      }
}
```
재고 차감에 대한 시나리오를 DynamicTest으로 작성하면 아래와 같다.

```java
class StockTest {
      @DisplayName("재고 차감 시나리오")
      @TestFactory
      Collection<DynamicTest> stockDeductionDynamicTest() {
      // given
      Stock stock = Stock.create("001", 1);
  
      return List.of(
              DynamicTest.dynamicTest("재고를 주어진 개수만큼 차감할 수 있다.", () -> {
                // given
                int quantity = 1;
  
                // when
                stock.deductQuantity(quantity);
  
                // then
                assertThat(stock.getQuantity()).isZero();
  
              }),
              DynamicTest.dynamicTest("재고보다 많은 수의 수량으로 차감 시도하는 경우 예외가 발생한다.", () -> {
                // given
                int quantity = 1;
  
                // when & then
                assertThatThrownBy(() -> stock.deductQuantity(quantity))
                        .isInstanceOf(IllegalArgumentException.class)
                        .hasMessage("차감할 재고 수량이 없습니다.");
              })
      );
    }
}
```

### 테스트 수행도 비용이다. 환경 통합하기

테스트를 작성하는 이유는 기계의 도움을 받아서 수시로 피드백을 받고 프로덕션 코드를 발전시켜 나갈 수 있는 도구이다.

테스트를 수행되는 시간이 비용이기 때문에 이런한 것들도 관리가 필요하다.

#### 전체 테스트 수행하기 

> 전체 테스트 수행: Gredle -> Tasks -> verification -> test를 통해 수행할 수 있다.

`test`를 더블 클릭해서 전체 테스트 갯수 및 서버가 몇번 실행되는지 확인할 수 있다.

![](/assets/img/testcode/Practical-Testing2-14.png)

여기서 “Spring Boot” 라는 키워드를 검색했을 때 총 6번이 나온다. → 서버가 뜨는 횟수

  * @SpringBootTest 를 사용하면 서버가 띄우게 된다.

  * 서버가 뜨는 횟수가 많아지면 테스트 수행시간이 길어지게 된다.

  * 테스트 환경이 바뀔수록, 서버 뜨는 횟수가 전체 테스트에서 많아지는데, 이는 곧 비용이 많아지게 되고, 테스트를 덜 자주 수행하게 된다.

  * 이런 비용들도 계속 관리하면서 어떻게 하면 더 빠른 시간안에 효율적으로 테스트를 수행할지 고민봐야 한다.

> Q. 서버 횟수를 줄이려면 어떻게 해야할까?

A. 통합 테스트의 어노테이션이 붙어있는(SpringBootTest)걸 기반으로 `IntegrationTestSupport` 추상 클래스를 만들고, 

아래와 같이 `OrderServiceTest`, `OrderStatisticsServiceTest`, `ProductServiceTest` 클래스가 `IntegrationTestSupport`으로부터 상속받게 한다.
 
그리고 `@MockBean` 처리한 걸 상위 클래스인 `IntegrationTestSupport`에 옮긴다.

```java
// IntegrationTestSupport - 추상 클래스
package sample.cafekiosk.spring;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
public abstract class IntegrationTestSupport {

    @MockBean
    protected MailSendClient mailSendClient; // 대신 다른 클래스에 적용할 수 있도록 private -> protected 로 바꿔준다. 
}

// ProductServiceTest, OrderServiceTest, OrderStatisticsServiceTest -> IntegrationTestSupport 로부터 상속받음
class ProductServiceTest extends IntegrationTestSupport {
}
class OrderServiceTest extends IntegrationTestSupport {
}
class OrderStatisticsServiceTest extends IntegrationTestSupport {
}
```

`OrderStatisticsServiceTest`의 경우 MockBean으로 Mock 객체를 생성했기 때문에 스프링 서버가 실행될 때, Mock이 사용된 환경으로 인식하기 때문에 서버가 다시 실행하게 되는 것이다.

-> MockBean 처리된 필드를 상위 클래스(IntegrationTestSupport)에 두게 된다면 동일한 테스트 환경에서 실행할 수 있다.

다만, 테스트 환경을 고려해서 다른 서비스 테스트에도 `Mock`이 필요한지 고려해봐야 한다.

-> **`Mock` 처리가 필요없는 테스트 환경을 위한 `TestSupport` 상위 클래스를 구축하고, `Mock` 처리가 필요한 테스트 환경을 위한 `MockTestSupport` 상위 클래스를 구축하여 `Mock`을 기준으로 테스트 환경을 구분**해주면 된다.

#### Repository Test의 경우 @DataJpaTest vs @SpringBootTest, 둘 중 어느 것을 사용해야 할까?

현재 시스템 로그상으로 확인하면, `StockRepositoryTest`, `ProductRepositoryTest` 모두 서버가 각각 실행되고 있다.

Service 테스트 하면서 Repository도 같이 Test 하면 어떨까?

꼭 `@DataJpaTest`를 사용하는 것이 아니라면 **시간 절약을 위해 `@SpringBootTest`를 사용한다.**

`@SpringBootTest`를 사용한다면, **`@DataJpaTest`에서 자동으로 제공해주는 `@Transactional`이 적용되지 않기에 다시 RepositoryTest 클래스에 `@Transactional` 어노테이션을 붙여줘야 한다.**

-> 이렇게 해서 Repository Test도 Service Test 환경과 동일하게 상위 클래스인 `IntegrationTestSupport` 클래스를 상속받도록 하면, Service와 Repository를 하나의 서버에 수행할 수 있게 되었다.

#### Controller Test의 테스트 환경 통합하기

Controller의 경우, `@WebMvcTest(controllers = OrderController.class)` 을 사용했는데, 사실 통합하기가 어렵다. → WebMvcTest를 위한 환경을 구축한다.

spring 패키지 하위에 ControllerTestSupport 추상 클래스를 만들어준다.

* `OrderController`, `ProductController`에 사용했던 `@MockBean`과 `@Authowired`를 가져와주고 protected로 바꿔준다. (다른 클래스에 사용하기 위해 private → protected로 바꿔준 것이다)

```java
// ControllerTestSupport - 추상 클래스
@WebMvcTest(controllers = {
        OrderController.class,
        ProductController.class
})
public abstract class ControllerTestSupport {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @MockBean
    protected OrderService orderService;

    @MockBean
    protected ProductService productService;
}
// OrderControllerTest, ProductControllerTest
class OrderControllerTest extends ControllerTestSupport {
}

class ProductControllerTest extends ControllerTestSupport {
}
```

이제 전체 테스트를 수행해주면 Spring Boot, **서버가 총 2번** 나오는 걸 확인할 수 있다. (OrderControllerTest, OrderServiceTest)

* 서버 갯수를 줄일수록 테스트 시간을 줄일 수 있게 된다.

![](/assets/img/testcode/Practical-Testing2-15.png)

## Reference

* [Practical Testing: 테스트 코드 작성 방법](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard)