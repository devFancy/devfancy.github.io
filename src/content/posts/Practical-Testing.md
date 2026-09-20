---
title: "Practical Testing: 테스트 코드 작성 방법"
date: 2023-12-09
categories: ["서버"]
tags: ["Spring Boot"]
---

> 이 글은 [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard) 강의를 듣고 내용을 정리한 글입니다.

## 학습 목표

1. 테스트 코드의 필요성을 이해하고 숙지한다.

2. 좋은 테스트 코드가 무엇이고 깔끔하고 명확한 테스트 코드를 작성하는 방법을 학습하고 정리한다.

3. Spring 및 JPA 기반의 API를 설계하고 개발하는 과정에서 실무 수준의 테스트 코드를 작성하고 이를 정리한다.

## 테스트를 하는 이유

* `테스트`는 기본적으로 **귀찮은 작업**이다. 실무에서는 짧은 시간안에 기능 구현만 만들기도 벅찬데, 테스트 코드를 작성하기가 쉽지 않다.

  테스트의 필요성을 명확히 이해하지 못하면, 이 작업을 소홀히하고 무시하는 경향이 생길 수 있다.

* 테스트 코드가 없는 환경에서는 새로운 기능을 추가하거나 코드를 수정할 때 기존 코드가 여전히 정상 작동하는지 확인하기 위해 사람이 직접 수동으로 테스트해야 한다.

    프로덕션 코드는 시간이 지날수록 점점 더 확장하게 되는데, 그때마다 **테스트 인력을 무한정 늘릴 수 있을 까에 대한 고민**이 있을 수 있다.

    그리고 사람이 수동으로 테스트를 하다 보면 누락되는 케이스가 발생할 수도 있고, 그게 곧 치명적인 결함이 돼서 실제 상용 소프트웨어에 큰 문제가 발생할 수도 있다.

    소프트웨어가 커지는 속도를 따라잡지 못하게 되고, 기능들도 서로 겹치면서 기존에 테스트 했던 영역을 또 테스트하게 되면서 **커버할 수 없는 영역이 발생**하게 된다.

    또한 프로덕션 코드가 확장됨에 따라 이 프로젝트를 오래 했던 사람들 또는 개발(or 테스트)을 오래 했던 사람들의 **경험과 감에 의존할 수 밖에 없게 된다.**

    사람이 테스트를 하다 보니까 시간이 오래 걸려서 **피드백이 늦어지게 되고**, 테스트 도중 버그가 생기면 다시 수정 개발을 하면서 이런 사이클이 되게 느리게 돌아가게 된다. 이로 인해 **유지보수가 어려워지고, 이는 결국 소프트웨어의 신뢰도를 낮추는 일이 된다.**

![](/assets/img/testcode/Practical_Testing_1.png)

* 그래서 우리는 테스트 코드를 통해서 내가 개발한 기능에 대해서 내가 의도한 대로 동작하는지 **빠른 피드백**을 받을 수 있어야 하고, 기계가 검증할 수 있도록 **자동화**를 해서 내가 만든 소프트웨어에 대한 **안정감과 신뢰감**을 얻을 수 있어야 한다.

    빠뜨리지 않고 테스트 코드를 잘 추가했다면, 커지는 소프트웨어를 프로덕션 코드를 테스트 코드가 계속 커버할 수 있게 된다.

* 그런데 테스트 코드가 엉망으로 작성되어 있다면,

    프로덕션 코드의 안정성을 제공하기 힘들며, 유지보수하기 어려운 상황이 발생하여, 이는 곧 테스트의 검증이 잘못될 가능성이 높아진다.

* 그래서 올바른 테스트 코드를 작성해야 한다. 

    올바른 테스트 코드를 통해 **자동화가 되어 빠른 시간안에 버그를 발견**할 수 있고, 수동 테스트에 드는 비용을 크게 절약할 수 있다.

    그리고 **소프트웨어의 빠른 변화를 지원**할 수 있게 해준다.

    또한 내가 고민했던 것들을 코드로 녹여내면, 팀내 공유 지식이 되면서 **팀원들의 집단 지성을 팀 차원의 이익으로 승격시켜주는 이점**이 있다.

    이는 **'가까이 보면 느리지만, 멀리 보면 가장 빠르다'** 라고 표현될 수 있다.

* `테스트`는 확실한 귀찮은 작업이지만, 이를 극복하고 왜 해야 하는지 명확히 이해하고, 실무에서 테스트 작성 시 **귀찮음을 인정하면서도 꾸준한 노력으로 해내야 한다**는 마음가짐을 갖춰야 한다.

## 단위 테스트

### 개발 환경

프로젝트 주제인 '초간단 카페 키오스크 시스템'을 개발하면서 테스트 코드를 작성하는 방법을 배워보자.

> 해당 프로젝트에 대한 실습을 [깃허브](https://github.com/devFancy/cafekiosk)에 기록했습니다.

개발 환경은 다음과 같다.

  * IntelliJ Ultimate 
    
  * Java 11

  * Spring Boot 2.7.7

  * Gradle & Groovy

  * Dependency - Spring Web, Thymeleaf, Spring Data JPA, H2 Database, Lombok, Validation

### Junit5, AssertJ

* `단위 테스트`란 작은 코드 단위를 독립적으로 검증하는 테스트이다. 여기서 작은 코드는 클래스 혹은 메서드를 의미한다.

    * `단위 테스트`는 검증 속도가 빠르고 안정적인 특징을 가진다.

* `Junit5`란 단위 테스트를 위한 테스트 프레임워크이다. (참고 - [공식문서](https://junit.org/junit5/docs/current/user-guide/))

* `AssertJ`란 테스트 코드 작성을 원활하게 돕는 테스트 라이브러리이다. 풍부한 API, 메서드 체이닝을 지원한다. (참고 - [공식문서](https://joel-costigliola.github.io/assertj/))

### 테스트 케이스 세분화하기

> 요구 사항: 한 종류의 음료 여러 잔을 한 번에 담는 기능

이러한 요구 사항이 들어왔을 때, 자신에게 혹은 요구 사항을 들고온 기획자, 타직군에게 다시 질문을 해 볼 수 있어야 한다.

질문하기: **암묵적이거나 아직 드러나지 않은 요구 사항이 있는지** 항상 염두하고 고민을 해봐야 한다.

`해피 케이스`와 `예외 케이스`, 이 두가지 케이스를 가지고 **경계값 테스트**를 도출 할 수 있어야 한다.

  * 여기서 `경계값 테스트`는 범위(이상, 이하, 미만, 초과), 구간, 날짜 등을 말한다.

  * 예를 들어, 어떤 정수 값이 있고 이 정수가 3이상일 때, A라는 조건을 만족한다고 가정한다면,

  * 3 이상에 대한 해피 케이스와 3 미만에 대한 예외 케이스를 작성해야 한다.

해당 요구 사항(한 종류의 음료 여러 잔을 한 번에 담는 기능)에 대해 해피 케이스와 예외 케이스를 작성해보면 아래와 같다.

![](/assets/img/testcode/Practical_Testing_2.png)

`addSeveralBeverages` 메서드는 하나의 종류인 아메리카노에 2개를 담는 테스트로 해피 케이스이고, `addZeroBeverages` 메서드는 하나의 종류인 아메리카노에 0개를 담았을 때 예외가 발생하는 예외 케이스인 것을 확인할 수 있다.

### 테스트하기 어려운 영역

> 요구사항: 가게 운영 시간(10:00 ~ 22:00) 외에는 주문을 생성할 수 없다.

영업 시간 내에 주문이 생성되려면 시간과 관련된 부분도 고려하기 때문에 테스트하기 어려울 수 있다.

주문을 생성하는 로직에 시간과 관련된 부분을 추가하게 되면, 기존 프로덕션 코드가 전부 수정되어야 하기 때문에 좋지 않다.

이를 위해 주문을 생성할 때 **외부에서 시간 데이터를 받아올 수 있도록 변경**한다면 테스트 시에는 원하는 시간을 통해 검증할 수 있고, 프로덕션 코드에서도 현재 시간을 인자로 주어 동작할 수 있다.

```java
@Getter
public class CafeKiosk {

    public static final LocalTime SHOP_OPEN_TIME = LocalTime.of(10, 0);
    public static final LocalTime SHOP_CLOSE_TIME = LocalTime.of(22, 0);


    // 변경 전
    public Order createOrder() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalTime currentTime = currentDateTime.toLocalTime();
        if (currentTime.isBefore(SHOP_OPEN_TIME) || currentTime.isAfter(SHOP_CLOSE_TIME)) {
            throw new IllegalArgumentException("주문 시간이 아닙니다. 관리자에게 문의하세요.");
        }

        return new Order(currentDateTime, beverages);
    }

    // 변경 후: 외부에서 시간 데이터를 받아올 수 있도록 변경
    public Order createOrder(LocalDateTime currentDateTime) {
        LocalTime currentTime = currentDateTime.toLocalTime();
        if (currentTime.isBefore(SHOP_OPEN_TIME) || currentTime.isAfter(SHOP_CLOSE_TIME)) {
            throw new IllegalArgumentException("주문 시간이 아닙니다. 관리자에게 문의하세요.");
        }

        return new Order(currentDateTime, beverages);
    }
}
```

그리고 `createOrder` 메서드를 기반으로 테스트 코드를 짜면 다음과 같다.

```java
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

이처럼 테스트하기 어려운 영역을 외부로 분리할수록 테스트 가능한 코드는 많아진다. 무조건 최상위 계층까지 분리해야 하는 것은 아니다. 적당한 선을 가지고 분리를 멈추는게 좋다.

테스트하기 어려운 영역은 크게 두 가지이다.

  * IN: 관측할 때마다 다른 값에 의존하는 코드 - 현재 날짜/시간, 랜덤 값, 전역변수/함수, 사용자 입력

  * OUT: 외부 세게에 영향을 주는 코드 - 표준 출력, 메시지 발송, 데이터베이스에 기록하기

반대로 테스트 하기 쉬운 영역은 외부 세계와 단절된, 함수형 프로그래밍에서는 `순수 함수`(pure functions)라고 한다.

  * 같은 입력에는 항상 같은 결과

  * 외부 세상과 단절된 형태

  * 테스트하기 쉬운 코드

## TDD: Test Driven Development

`TDD`(Test Driven Developement)란 프로덕션 코드보다 테스트 코드를 먼저 작성하여 **테스트가 구현 과정을 주도하는 방법론**이다.

![](/assets/img/testcode/Practical_Testing_3.png)

TDD는 RED -> GREEN -> REFACTOR 세가지 사이클을 반복하는 일정한 리듬 속에서 진행된다.

![](/assets/img/testcode/Practical_Testing_4.png)

* `RED`: 프로덕션 코드가 없는 상황에서 실패하는 테스트 코드를 먼저 작성한다.

* `GREEN`: 실패하는 테스트 코드를 통과하기 위해 프로덕션 코드에서 최소한의 코드를 작성한다.

* `REFACTOR`: 프로덕션 코드를 좋은 코드로 개선한다.

TDD의 가장 큰 핵심 가치는 **피드백**이다. 내가 작성한 코드, 프로덕션 코드에 대해 **자주, 빠르게 피드백을 받을 수 있다는 것**이다.

* '선 기능 구현, 후 테스트를 작성'하게 되면 아래와 같은 문제가 발생할 수 있다.

  * 테스트 자체의 누락 가능성

  * 특정 테스트 케이스(해피 케이스)만 검증할 가능성

  * 잘못된 구현을 다소 늦게 발견할 가능성

* '선 테스트 작성, 후 기능을 구현'하게 되면 아래와 같은 장점을 마주하게 된다.

  * 복잡도가 낮은(유연하며 유지보수가 쉬운), 테스트 가능한 코드로 구현할 수 있다.

  * 쉽게 발견하기 어려운 엣지(Edge) 케이스를 놓치지 않게 해준다.

  * 구현에 대한 빠른 피드백을 받을 수 있다.

  * 과감한 리팩토링이 가능해진다.

TDD 자체가 우리의 사고, 관점의 변화를 일으키는 도구라고 생각한다.

* TDD 도입 전의 테스트는 단순히 구현부 검증을 위한 보조 수단이였다면, TDD 도입 후에는 **구현부 코드와 테스트 코드가 와 상호 작용하면서 기능 구현을 하는 형태**로 견고한 프로덕션 코드를 작성할 수 있게 해준다.

* 한마디로 정리하면 **클라이언트 관점**에서의 **피드백**을 주는 Test Driven이 TDD 이다.

  (TDD가 익숙하지 않았으면, 익숙할 때까지 시도해보자!)

## 테스트는 []다.

이 강의를 만드신 박우빈님은 '테스트는 **`문서`** 다.'라고 말씀하셨다.

테스트를 `문서`라고 한 이유를 정리하면 아래와 같다.

  * 프로덕션 기능을 설명하는 테스트 코드는 문서가 될 수 있다.

  * 다양한 테스트 케이스를 통해 프로덕션 코드를 이해하는 시각과 관점을 보완할 수 있다.

  * 어느 한 사람이 과거에 경험했던 고민의 결과물을 팀 차원으로 승격시켜서, 모두의 자산을 공유할 수 있다.

이를 통해 테스트를 작성한 이유는 **실무에서는 항상 팀으로 일하기 때문에** 나 또는 다른 누군가가 작성한 문서가 팀 전체에 큰 도움을 줄 수 있기 때문이다.

### DisplayName을 섬세하게

테스트 코드를 작성하다 보면 "테스트의 이름을 어떻게 짓는게 좋은걸까?"라는 고민을 할 수 있다.

이를 위해 Junit5에서 추가된 `@DisplayName`이라는 어노테이션을 활용하면 테스트에 대한 설명을 한글로 작성해서 어떤 테스트를 의미하는지 쉽게 알 수 있게 된다.

Junit4 이하라면 메서드명을 테스트 이름으로 명명하는 방법을 사용했다.

![](/assets/img/testcode/Practical_Testing_5.png)

> 참고: Run(실행)할 때 해당 @DisplayName에 대한 이름을 확인하기 위해서는 
>
> IntelliJ IDEA - Preferences - Build Tools - Gradle에서 `Run tests using` 부분에 `IntelliJ IDEA` 로 선택하고 Apply 후 Ok 버튼을 클릭하면 아래와 같이 잘 나오는 것을 확인할 수 있다. 

![](/assets/img/testcode/Practical_Testing_6.png)

어떻게 DisplayName을 섬세하게 작성해야 할까?

* "~테스트"라고 작성하는 것을 지양하고 **문장**으로 작성한다. -> A이면 B이다 / A이면 B가 아니고 C다.

    * (X) 음료를 1개 추가 테스트

    * (O) 음료를 1개 추가할 수 있다.

* 조금 더 나아가서 테스트 행위에 대한 **결과**까지 기술한다.

  * (X) 음료를 1개 추가할 수 있다.

  * (O) 음료를 1개 추가하면 주문 목록에 담긴다. 

* **도메인 용어를 사용**(메서드 자체의 관점보다는 도메인 **정책** 관점으로)해서 한층 추상화된 내용을 담는다. "~실패한다"와 같은 테스트의 현상을 중점으로 기술하지 않는다.

  * (X) 특정 시간 이전에는 주문을 생성하면 실패한다.

  * (O) **영업 시작 이전**에는 주문을 생성할 수 없다.

### BDD 스타일로 작성하기

`BDD`(Behavior Driven Development)란 

  * TDD에서 파생된 개발 방법으로 함수 단위의 테스트에 집중하기 보다, 시나리오에 기반한 **테스트케이스(TC)** 자체에 집중하여 테스트를 한다.

  * 개발자가 아닌 사람이 봐도 이해할 수 있을 정도의 추상화 수준(레벨)을 권장한다.

Given / When / Then

  * Given: 시나리오 진행에 필요한 모든 준비 과정(객체, 값, 상태)

  * When: 시나리오 행동 진행

  * Then: 시나리오 진행에 대한 결과 명시, 검증(AssertJ)

어떤 환경에서(Given) 어떤 행동을 진행했을 때(When), 어떤 상태 변화가 일어난다(Then)와 같이 3단계를 기반으로 작성하면 `DisplayName`에 문장을 명확하게 작성할 수 있다.

```java
class CafeKioskTest {
    @DisplayName("주문 목록에 담긴 상품들의 총 금액을 계산할 수 있다.")
    @Test
    void calculateTotalPrice() {
        // given
        CafeKiosk cafeKiosk = new CafeKiosk();
        Americano americano = new Americano();
        Latte latte = new Latte();

        cafeKiosk.add(americano);
        cafeKiosk.add(latte);

        // when
        int totalPrice = cafeKiosk.calculateTotalPrice();

        // then
        assertThat(totalPrice).isEqualTo(8500);
    }
}
```

> [Tip] 인텔리제이에서 제공하는 Live Template 설정하는 방법

IntelliJ IDEA - Preferences - Live Templates - Java - test에서 아래 Template text 부분에 아래와 같이 입력하고 Apply 후 Ok 버튼을 클릭한다.

![](/assets/img/testcode/Practical_Testing_7.png)

그러면 다음부터 `test` 만 입력하면 내가 설정한 템플릿이 자동으로 입력된다.

## Spring & JPA 기반 테스트

### 레이어드 아키텍처와 통합 테스트

#### 레이어드 아키텍처

![](/assets/img/testcode/Practical_Testing_Layered_Architecture.png)

사용자의 요청을 Layer 별로 구분하여 처리하는 구조인데, 이는 Presentation Layer, Business Layer, Persistence Layer 라는 3가지 Layer로 구분된다.

  * (Persistence Layer 하위에 Infrastructure Layer를 두고 4 티어라고 부르기도 한다)

이러한 레이어드 아키텍처 구조는 **관심사를 분리해서 책임을 나누고, 유지보수하기 용이하게 만드는 목적**이 크다.

이렇게 관심사를 분리하면 테스트 하기 복잡해 보일 수 있지만, 레이어별로 뜯어서 접근을 해볼 수 있다.

왜냐하면 관심사가 분리되어 있으니까, 사실 복잡해 보이지만, 앞서 배웠던 것들과 기조는 동일하다.

  * 여기서 `기조`는 테스트하기 어려운 영역을 외부로 분리하고 테스트 하고자 하는 영역에 집중하고, 명시적이고 이해할 수 있는 문서 형태로 테스트를 깔끔하게 작성한다는 것을 말한다.

그래서 Spring & JPA 기반 테스트 보다는, **우리가 무엇을 테스트할지, 어떻게 테스트할지 집중**해서 보면 좋을 것 같다.

#### 통합 테스트

`통합 테스트`란 여러 모듈이 협력하는 기능을 통합적으로 검증하는 테스트이다.

일반적으로 작은 범위의 단위 테스트만으로는 기능 전체의 신뢰성을 보장할 수 없다.

그래서 풍부한 단위 테스트와 큰 기능 단위를 검증하는 통합 테스트, 두 가지 관점으로 접근하면 좋을 것 같다.

아래부터는 각 레이어별로 통합 테스트를 어떻게 진행하면 좋을지에 대해서 알아가보자.

### Spring / JPA & 기본 엔티티 설계

> Library vs Framework 

![](/assets/img/testcode/Practical_Testing_8.png)

Spring에 대해서 이야기 할 때 Library와 Framework의 차이점에 대해 고민해볼 수 있다.

* Library의 경우  **내 코드가 주체**가 되어서 필요한 기능만 있다면, 외부에서 끌어와서 사용을 하게 된다.

* Framework의 경우 이미 갖춰진 동작할 수 있는 그런 환경들이 구성이 되어있고, **내 코드가 수동적으로 이 프레임안에 들어가서 역할**을 하게 된다.

Spring 같은 경우는 프레임워크로써 이미 갖춰진 것들, 제공하고 있는 환경들이 있고, 그걸 맞춰서 우리가 우리의 코드를 작성해서 끼워 넣으면 원하는 대로 동작을 하게 되는 구조인 것이다.

> Spring 3대 개념

* IoC(Inversion of Control)

* DI(Dependency Injection)

* AOP (Aspect Oriented Programming)

(Spring 3대 개념에 대한 자세한 내용은 해당 포스팅의 주요 내용이 아니여서, 다른 포스팅에서 정리해보려고 합니다)

> ORM과 JPA

`ORM`(Object-Relational Mapping)이란 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑해주는 일을 한다. 

* 객체지향 프로그래밍은 클래스를 사용하고 관계형 데이터베이스는 테이블을 사용하여 두 모델간에 불일치가 발생하게 된다. 이러한 문제는 `ORM`이 **중간에서 객체간의 관계를 바탕으로 RDB와 매핑하여 불일치를 해결**해줄 수 있다.

* ORM을 사용함으로써 객체 지향적인 코드로 인해 더 직관적이고 비즈니스 로직에 더 집중할 수 있게 도와주고, DBMS에 대한 종속성이 줄어들게 된다.

`JPA`(Java Persistence API)란 **자바에서 사용하고 있는 ORM의 표준**이다.

  * JPA는 구현체가 아닌 `인터페이스의 모음`으로, JPA의 인터페이스를 구현한 대표적인 오픈소스로는 Hibernate, EclipseLink, DataNucleus가 있다. 보통 `Hibernate` 를 주로 사용한다.

  * 기본적인 CRUD SQL 쿼리문을 생성하고 실행해주며, 여러 부가 기능을 제공한다. 편리하지만 쿼리를 직접 작성하지 않기 때문에, 어떤 식으로 쿼리가 만들어지고 실행되는지 명확하게 이해하고 있어야 한다.

  * Spring 진영에서는 JPA를 한번 더 추상화한 `Spring Data JPA` 을 제공한다.

  * JPA는 주로 `QueryDSL`와 많이 조합하여 사용하게 되는데, `QueryDSL`은 **타입체크나 동적쿼리에 대한 이점 때문에 실무에서는 거의 필수로 사용**되고 있다.

  * JPA에서 주로 사용하는 어노테이션으로 @Entity, @Id, @Column, @ManyToOne, @OneToMany, @OneToOne, @ManyToMany가 있다. @ManyToMany의 경우에는 일대다 - 다대일 관계로 풀어서 사용하는 것을 권장한다.

> Entity 설계

이번 프로젝트 주제인 '초간단 카페 키오스크 시스템'에서 사용할 엔티티 중에서 Order(주문)과 Product(상품)이라는 엔티티가 있다.

여기서 Order와 Product의 관계가 다대다 관계를 지니고 있다. 하나의 주문에는 여러 개의 상품이 존재할 수 있고, 하나의 상품에도 여러 개의 주문이 존재할 수 있다.

![](/assets/img/testcode/Practical_Testing_9.png)

그래서 다대다 관계를 일대다, 다대일 관계로 풀어서 접근하기 위해 **중간 매핑 테이블(OrderProduct)을 만들어서 연관관계를 매핑**해준다.

보통은 주문에서 상품을 조회하는 경우는 있지만, 상품에서 주문을 조회하는 경우는 없기 때문에, 주문(Order)에서만 양방향 매핑을 하고 상품(Product)에는 단방향 매핑을 했다.

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "orders")
@Entity
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private int totalPrice;

    private LocalDateTime registeredDateTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderProduct> orderProducts = new ArrayList<>();

    public Order(List<Product> products, LocalDateTime registeredDateTime) {
        this.orderStatus = OrderStatus.INIT;
        this.totalPrice = calculateTotalPrice(products);
        this.registeredDateTime = registeredDateTime;
        this.orderProducts = products.stream()
                .map(product -> new OrderProduct(this, product))
                .collect(Collectors.toList());
    }
}
```

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class OrderProduct extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    public OrderProduct(Order order, Product product) {
        this.order = order;
        this.product = product;
    }
}
```

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productNumber;

    @Enumerated(EnumType.STRING)
    private ProductType type;

    @Enumerated(EnumType.STRING)
    private ProductSellingStatus sellingStatus;

    private String name;

    private int price;

    @Builder
    public Product(String productNumber, ProductType type, ProductSellingStatus sellingStatus, String name, int price) {
        this.productNumber = productNumber;
        this.type = type;
        this.sellingStatus = sellingStatus;
        this.name = name;
        this.price = price;
    }
}
```

### Persistence Layer

`Persistence Layer`는 **Data Access의 역할**로 비즈니스 가공 로직이 포함되어서는 안된다. **Data에 대한 CRUD 작업**에만 집중한 레이어이다.

![](/assets/img/testcode/Practical_Testing_Persistence_Layer_1.png)

> 새로운 요구사항

![](/assets/img/testcode/Practical_Testing_Persistence_Layer_2.png)

* 키오스크 주문을 위한 상품 후보 리스트 조회하기

* 상품의 판매상태를 화면에 보여주기(판매중, 판매보류, 판매중지)

* 상품(Prduct)에 필요한 정보는 상품id, 상품번호, 상품타입, 판매상태, 상품이름, 상품가격이 있다.

---

해당 요구사항에 대한 API 구현 - [Commit](https://github.com/devFancy/cafekiosk/commit/f7d95b7afd2df6baaefd463f378261313122db1d) 

> ProductRepository 클래스

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * select *
     * from product
     * where selling_type in ('SELLING', 'HOLD')
     */
    List<Product> findAllBySellingStatusIn(List<ProductSellingStatus> sellingStatuses);
}
```

> 🙋🏻 질문. '쿼리 메서드를 사용해서 `findAllBySellingStatusIn`와 같이 이름을 잘 지으면 쿼리가 잘 작동하는데, 왜 테스트를 작성해야 하는가' 이다.

-> 지금은 되게 간단한 쿼리라서 예측이 쉽지만, [1] Where 절의 조건이 많아진다면 쿼리 메서드가 엄청 길어진다거나 [2] 쿼리 메서드가 아닌 JPQL과 같은 날것의 쿼리를 작성한다거나 [3] QueryDSL을 적용해서 사용한다거나 [4] JPA가 아닌 MyBatis같은 다른 기술을 사용하는 등 
구현하는 기술이 변경될 수 있기 때문에, **내가 작성한 코드가 제대로된 쿼리가 날라가는지 보장하기 위해서 테스트를 작성**해야한다. 그리고 **기존에 내가 작성한 쿼리메서드가 미래에 어떤 형태로 변할지 모르기 때문에, 이에 대한 보장도 해줘야 한다.**
그래서 이를 위해서 테스트를 작성하는 것이 좋다.

#### Persistence Layer는 단위 테스트에 가깝다

Repository 테스트는 `Data Access`하는 로직만 갖고 있기 때문에 `단위 테스트`의 성격에 가깝다.

```java
@ActiveProfiles("test")
//@SpringBootTest
@DataJpaTest
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @DisplayName("원하는 판매상태를 가진 상품들을 조회한다.")
    @Test
    void findAllBySellingStatusIn() {
        // given
        Product product1 = createProduct("001", HANDMADE, SELLING, "아메리카노", 4000);
        Product product2 = createProduct("002", HANDMADE, HOLD, "카페라떼", 4500);
        Product product3 = createProduct("003", HANDMADE, STOP_SELLING, "팥빙수", 7000);
        productRepository.saveAll(List.of(product1, product2, product3));

        // when
        List<Product> products = productRepository.findAllBySellingStatusIn(List.of(SELLING, HOLD));

        // then
        assertThat(products).hasSize(2)
                .extracting("productNumber", "name", "sellingStatus")
                .containsExactlyInAnyOrder(
                        tuple("001", "아메리카노", SELLING),
                        tuple("002", "카페라떼", HOLD)
                );
    }

    @DisplayName("상품번호 리스트로 상품들을 조회한다.")
    @Test
    void findAllByProductNumberIn() {
        // given
        Product product1 = createProduct("001", HANDMADE, SELLING, "아메리카노", 4000);
        Product product2 = createProduct("002", HANDMADE, HOLD, "카페라떼", 4500);
        Product product3 = createProduct("003", HANDMADE, STOP_SELLING, "팥빙수", 7000);

        productRepository.saveAll(List.of(product1, product2, product3));

        // when
        List<Product> products = productRepository.findAllByProductNumberIn(List.of("001", "002"));

        // then
        assertThat(products).hasSize(2)
                .extracting("productNumber", "name", "sellingStatus")
                .containsExactlyInAnyOrder(
                        tuple("001", "아메리카노", SELLING),
                        tuple("002", "카페라떼", HOLD)
                );
    }

    @DisplayName("가장 마지막으로 저장한 상품의 상품 번호를 읽어온다.")
    @Test
    void findLatestProductNumber() {
        // given
        String targetProductNumber = "003";

        Product product1 = createProduct("001", HANDMADE, SELLING, "아메리카노", 4000);
        Product product2 = createProduct("002", HANDMADE, HOLD, "카페라떼", 4500);
        Product product3 = createProduct(targetProductNumber, HANDMADE, STOP_SELLING, "팥빙수", 7000);

        productRepository.saveAll(List.of(product1, product2, product3));

        // when
        String latestProductNumber = productRepository.findLatestProductNumber();

        // then
        assertThat(latestProductNumber).isEqualTo(targetProductNumber);
    }

    @DisplayName("가장 마지막으로 저장한 상품의 상품 번호를 읽어올 때, 상품이 하나도 없는 경우에는 null을 반환한다.")
    @Test
    void findLatestProductNumberWhenProductIsEmpty() {
        // when
        String latestProductNumber = productRepository.findLatestProductNumber();

        // then
        assertThat(latestProductNumber).isNull();
    }

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
}
```

`@DataJpaTest` 는 스프링 서버를 띄어서 테스트를 하는데, `@SpringBootTest`보다 가볍다(속도가 빠르다). JPA 관련된 Bean 들만 주입을 해줘서 서버를 띄어준다.

`@ActiveProfiles("test")`는 통합 테스트를 위해 ApplicationContext를 로드할 때 활성화해야 할 빈 정의 프로파일을 선언하는 데 사용되는 클래스 수준의 어노테이션이다.

  * 테스트 수행 시에 application.yml 파일에서 `spring.config.activate.on-profile: test`이라고 적힌 부분이 활성화하게 된다.

```yaml
spring:
  config:
    activate:
      on-profile: test
```

### Business Layer

`Business Layer`는 **비즈니스 로직을 구현하는 역할**로 Persistence Layer와의 상호작용(Data를 읽고 쓰는 행위)을 통해 비즈니스 로직을 전개시키는 레이어이다.

그리고 `Business Layer` 레이어는 **트랜잭션**을 보장해야 한다. (이 부분에 대해서는 밑에 설명하겠다)

![](/assets/img/testcode/Practical_Testing_Business_Layer_1.png)

> 새로운 요구사항

![](/assets/img/testcode/Practical_Testing_Business_Layer_2.png)

메뉴를 여러개 선택해서 가격을 보고, 주문하기 버튼을 클릭하면 주문(Order)이라는 엔티티가 생성되는 것을 구현한다.

* 상품 번호 리스트를 받아 주문 생성하기

* 주문은 주문 상태, 주문 등록 시간을 가진다.

* 주문의 총 금액을 계산할 수 있어야 한다.

---

해당 요구사항에 대한 API 구현 - [Commit](https://github.com/devFancy/cafekiosk/commit/f088e600501b031adaf70dce7c5dcbd38e95a74f)

> 🙋🏻 질문1. 주문을 생성하기 위해 주문 객체를 Order로 만들어야 하는데, 테이블 이름을 `orders`로 하는 이유는?

-> 데이터베이스에서 `Order` 이라는 이름은 SQL에서 정렬과 관련된 예약어이기 때문에 @Entity 위에 `@Table(name = "orders")` 라고 변경해서 사용해야 한다.

> 🙋🏻 질문2. OrderServiceTest에서 2번 테스트가 1번 테스트에 영향을 주고 있음 → 전체 테스트에서는 실패가 뜨는데, 어떻게 해결해야 할까?

-> 이런 경우, 하나의 테스트가 끝날 때마다 기존에 저장해둔 값을 지우기 위해 `@AfterEach` 어노테이션이 적용된 tearDown() 메서드를 추가한다.

  * `@AfterEach`는 JUnit 프레임워크에서 제공하는 어노테이션 중 하나로, **각각의 테스트 메소드가 실행된 후에 어떤 동작을 수행할지 정의할 때 사용**된다.

  * `@AfterEach` 어노테이션이 적용된 메소드는 각각의 테스트 메소드가 실행된 후에 호출되므로, 테스트 간에 영향을 최소화하고 안정적인 테스트 환경을 유지하는 데 도움이 된다.

아래의 createOrder() 테스트 메서드가 실행된 후에 `@AfterEach` 어노테이션이 적용된 tearDown() 메서드가 호출되면서, 기존에 저장해둔 값을 지우기 때문에, 그 다음에 실행하는 createOrderWithDuplicateProductNumbers() 테스트 메서드도 정상적으로 성공된다.

```java

@ActiveProfiles("test")
@SpringBootTest
//@DataJpaTest // SpringBootTest보다 더 가벼움
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

    @DisplayName("주문번호 리스트를 받아 주문을 생성한다.")
    @Test
    void createOrder() {
        LocalDateTime registeredDateTime = LocalDateTime.now();
        // given
        Product product1 = createProduct(HANDMADE, "001", 1000);
        Product product2 = createProduct(HANDMADE, "002", 3000);
        Product product3 = createProduct(HANDMADE, "003", 5000);
        productRepository.saveAll(List.of(product1, product2, product3));

        OrderCreateServiceRequest request = OrderCreateServiceRequest.builder()
                .productNumbers(List.of("001", "002"))
                .build();
        // when
        OrderResponse orderResponse = orderService.createOrder(request, registeredDateTime);

        // then
        assertThat(orderResponse.getId()).isNotNull();
        assertThat(orderResponse)
                .extracting("registeredDateTime", "totalPrice")
                .contains(registeredDateTime, 4000);
        assertThat(orderResponse.getProducts()).hasSize(2)
                .extracting("productNumber", "price")
                .containsExactlyInAnyOrder(
                        tuple("001", 1000),
                        tuple("002", 3000)
                );
    }

    @DisplayName("중복되는 상품번호 리스트로 주문을 생성할 수 있다.")
    @Test
    void createOrderWithDuplicateProductNumbers() {
        // given
        LocalDateTime registeredDateTime = LocalDateTime.now();
        // given
        Product product1 = createProduct(HANDMADE, "001", 1000);
        Product product2 = createProduct(HANDMADE, "002", 3000);
        Product product3 = createProduct(HANDMADE, "003", 5000);
        productRepository.saveAll(List.of(product1, product2, product3));

        OrderCreateServiceRequest request = OrderCreateServiceRequest.builder()
                .productNumbers(List.of("001", "001"))
                .build();
        // when
        OrderResponse orderResponse = orderService.createOrder(request, registeredDateTime);

        // then
        assertThat(orderResponse.getId()).isNotNull();
        assertThat(orderResponse)
                .extracting("registeredDateTime", "totalPrice")
                .contains(registeredDateTime, 2000);
        assertThat(orderResponse.getProducts()).hasSize(2)
                .extracting("productNumber", "price")
                .containsExactlyInAnyOrder(
                        tuple("001", 1000),
                        tuple("001", 1000)
                );
    }
    // 밑부분 생략
}
```

> 🙋🏻 질문2-2. ProductRepositoryTest의 경우에는 AfterEach 어노테이션을 적용하지 않았음에도 전체 테스트가 정상적으로 작동한다. 왜일까?
다시 말하면, OrderServiceTest와 ProductRepositoryTest의 차이점은 무엇인가?

-> ProductRepositoryTest의 경우에는 성공할 때, 자세히 확인해보면 아래와 같은 문장을 확인할 수 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_3.png)

`transaction.TransactionContext : Rolled back transaction for test`

쉽게 말해, **테스트 하나가 끝나고 실행된 트랜잭션이 롤백을 했다.** 즉, 저장했던 데이터들이 DB에 저장되지 않고 이전 상태로 되돌아갔다는 것이다. -> 롤백으로 인한 클렌징이 된 것이다.

반면에 OrderServiceTest는 롤백 처리가 되지 않았다. ProductRepositoryTest가 롤백 처리가 된 이유는 **`@DataJpaTest` 어노테이션** 때문이다.

`@DataJpaTest`의 경우 내부에 들어가서 확인해보면, **`@Transactional`** 이 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_4.png)

`@Transactional`이 있기 때문에 자동적으로 롤백이 되는 것이다.

반면, OrderServiceTest의 경우 `@SpringBootTest` 어노테이션이 있는에, 여기에서는 @Trasactional이 없다. 그래서 롤백이 되지 않는 것이다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_5.png)

한마디로 정리하면, 롤백 처리유무가 `@DataJpaTest` 와 `@SpringBootTest` 의 가장 큰 차이점중 하나이다.

> ProductRepositoryTest와 OrderServiceTest 차이점 정리

* ProductRepositoryTest에서는 `@DataJpaTest`로 인해 트랜잭션 롤백이 자동으로 이루어지므로 테스트가 데이터베이스에 영향을 미치지 않는다.

* OrderServiceTest에서는 `@SpringBootTest`로 전체 애플리케이션 컨텍스트를 로드하며, 트랜잭션 롤백이 자동으로 이루어지지 않아 테스트가 실제 데이터베이스에 영향을 줄 수 있다.

> 🙋🏻 질문2-3. 여기서 또 한 가지 궁금한 질문! 그러면 OrderServiceTest 에서 `@AfterEach` 어노테이션을 사용하지않고 위에 `@Transactional` 어노테이션을 사용하면 되지 않나?

-> OrderServiceTest에서 `@AfterEach` 어노테이션을 사용하지 않고 위에 `@Transactional` 어노테이션을 사용해서 테스트를 수행하면, 롤백이 되어서 성공이 된다.

하지만 이렇게 작성하면 생길 수 있는 문제가 있다. -> 이 부분에 대해서는 밑에서 설명하겠다.

#### api 테스트 하는 방법

최상단에 `http` 라는 폴더를 만들고 그 안에 `order.http`, `product.http`를 만든다.

```
POST localhost:8080/api/v1/orders/new
Content-Type: application/json

{
  "productNumbers": [
    "001",
    "002"
  ]
}
```

```
GET localhost:8080/api/v1/products/selling
```

로컬을 실행하고 테스트해보면, 아래와 같이 잘 동작하는 걸 확인할 수 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_6.png)

> 새로운 요구 사항

* 주문 생성 시 재고 확인 및 개수 차감 후 생성하기

* 재고는 상품번호를 가진다.

* 재고와 관련 있는 상품 타입은 병 음료, 베이커리이다.

---

> 🙋🏻 질문3-1. Service 로직에서 "재고 차감 시도" 부분에서 예외 처리를 해주는데, Entity 클래스에 있는 메서드에도 똑같은 예외 처리를 왜 작성할까?

```java
// OrderService - Service 클래스
@RequiredArgsConstructor
@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StockRepository stockRepository;

    private void deductStockQuantities(List<Product> products) {
      // 재고 차감 체크가 필요한 상품들 filter : Product에서 Stock에 관련된 것들을 추출한 것임
      List<String> stockProductNumbers = extractStockProductNumbers(products);
  
      // 재고 엔티티 조회 : ProductNumber에 대한 StockMap임.
      Map<String, Stock> stockMap = createStockMap(stockProductNumbers);
  
      // 상품별 counting
      Map<String, Long> productCountingMap = createCountingMapBy(stockProductNumbers);
  
      // 재고 차감 시도
      for (String stockProductNumber : new HashSet<>(stockProductNumbers)) {
        Stock stock = stockMap.get(stockProductNumber);
        int quantity = productCountingMap.get(stockProductNumber).intValue();
  
        if(stock.isQuantityLessThan(quantity)) {
          throw new IllegalArgumentException("재고가 부족한 상품이 있습니다.");
        }
        stock.deductQuantity(quantity);
      }
    }
}

// Stock - Entity 클래스
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Stock extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productNumber;

    private int quantity;

    public void deductQuantity(int quantity) {
        if (isQuantityLessThan(quantity)) {
            throw new IllegalArgumentException("차감할 재고 수량이 없습니다.");
        }
        this.quantity -= quantity;
    }
}
```

-> OrderService에서 체크한 재고 수량에 대한 검증과 Stock에서 체크한 재고 수량 검증은 별개의 문제라는 관점으로 봐야 한다.

  * OrderService에서 `deductStockQuantities` 메서드의 해당 부분은 **주문 생성 로직**을 수행하다가 재고 차감에 대한 시도를 확인하는 로직이고, Stock 엔티티 클래스에서 `deductQuantity` 메서드의 경우에는 수량을 차감한다고 했을 때, 올바른 수량이 차감되어야 하는 로직이다.

  * Stock은 OrderService의 존재를 모르기 때문에 `deductQuantity` 이 메서드 자체만으로도 올바른 수량이 차감된다는 로직이 보장되어야 한다.

  * 그리고 Stock에서 `deductQuantity` 메서드는 다른 서비스(다른 상황)에서 사용할 수도 있다.

  * OrderService와ㅏ Stock에서의 `isQuantityLessThan` 메서드는 예외 메시지를 다르게 주고 있기 때문에(혹은 다르게 주고 싶을 경우도 있기 때문에), 2번 체크하는 로직이 나오게 된 것이다.

#### @Transactional 처리 유무 - 프로덕션, 테스트

> 🙋🏻질문 3-2. [OrderServiceTest](https://github.com/devFancy/cafekiosk/blob/main/src/test/java/sample/cafekiosk/spring/api/service/order/OrderServiceTest.java)에서 `@Transactional`을 제거하고 `@AfterEach`을 사용하고 `createOrderWithStock` 테스트하면 어떻게 될까?

-> 테스트가 실패한다. 그 이유는 **`@Transactional` 사용하지 않아서 update 쿼리가 나가지 않았기 때문**이다. 롤백 처리도 안된다.

여기서 `@Transactional`을 달고 다시 수행하면 테스트는 통과하게 된다.

  * Transaction 경계가 설정되어야 작동이 된다. 최초 조회할 때 스냅샷을 갖게 되며 트랜잭션 종료 시점에 인스턴스를 비교해서 달라진 부분이 있다면, update 쿼리가 날라간다.

  * 즉, Transaction 경계가 설정되지 않았기 때문에, 테스트가 실패하게 되는 것이다.

(질문 2-3 이어서) **테스트 클래스에 `@Transactional` 어노테이션을 사용하면 문제가 되는 이유는 서비스 클래스(OrderService)에 트랜잭션이 설정되어 있는지 뒤늦게 파악**할 수 있다.

  * `@Transactional` 어노테이션을 사용한 테스트 클래스에서 잘 작동하는데, 실제 서비스 클래스에서는 `@Transactional` 어노테이션을 사용하지 않아, 제대로 동작하지 못하는 문제를 일으킨다.

  * 정리하면, 실제 서비스(프로덕션) 클래스에는 `@Transactional` 어노테이션을 사용하고, 테스트 클래스에는 수동으로 삭제하는 `tearDown` 메서드를 적극 활용해서, 서비스와 테스트 코드 범위를 유사하게 맞춰서 개발하도록 하자.

`@Transactional` 어노테이션을 사용하면 tearDown() 메서드가 필요가 없어지게 되고, 롤백 처리를 해주는 편리함을 알고 써야 한다.

> 🙋🏻질문 3-3. update 쿼리는 안나가는데, insert 쿼리는 왜 수행되는가?

-> Transactional 이 Service에 걸려있지 않아도, ProductRepository의 JpaRepository → PagingAndSortingRepository → CrudRepository 가보면 주로 사용하는 save(), findAll() 등 메서드가 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_7.png)

이 메서드의 기본 구현체를 따라가면, SimpleJpaRepository에 `@Transactional` 이 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_8.png)

그래서 insert, delete가 잘 나간 것이다.(=잘 수행된 것)

그래서 결론은, OrderService에 `@Transactional` 을 설정하고, OrderServiceTest에는 `@Transactional` 을 제거하고 수동으로 삭제하는 메서드(tearDown)를 구현하면, 정상적으로 테스트가 성공하는 것을 확인할 수 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_9.png)

### Presentation Layer

`Presentation Layer`란 **외부 세계의 요청을 가장 먼저 받는 계층**으로 파라미터에 대한 최소한의 검증을 수행한다.

사실상 비즈니스 로직보다는 넘겨온 값이 중요하다. → 유효한지 검증하는게 최우선!

![](/assets/img/testcode/Practical_Testing_Presentation_Layer_1.png)

하위 2개의 Layer를 `Mocking`(가짜 객체로 대신)하고 `Presentation Layer`를 테스트한다.

✨ `Mock`을 사용하는 이유

  * 하나의 객체 또는 하나의 레이어를 테스트할 때, 의존관계가 있는 것들이 방해가 된다. -> 준비해야 할 것들이 많다. -> 그래서 이러한 것들을 가짜로 대체하여 처리하고 싶다. → `Mock`을 사용한다.

✨ `MockMvc`이란 Mock(가짜) 객체를 사용해 스프링 MVC 동작을 재현할 수 있는 테스트 프레임워크이다.

> 새로운 요구 사항

![](/assets/img/testcode/Practical_Testing_Presentation_Layer_2.png)

* 관리자 페이지에서 신규 상품을 등록할 수 있다.

* 상품명, 상품 타입, 판매 상태, 가격 등을 입력받는다.

---

> 동시성 이슈 - ProductService

```java
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    // 동시성 이슈
    @Transactional
    public ProductResponse createProduct(ProductCreateServiceRequest request) {
        String nextProductNumber = createNextProductNumber();

        Product product = request.toEntity(nextProductNumber);
        Product savedProduct = productRepository.save(product);

        return ProductResponse.of(savedProduct);
    }
}
```

ProductService의 createProduct() 메서드에서 **동시에 상품을 생성**할 때 `동시성 문제`가 발생할 수 있다.

  * ProductNumber(상품번호) 필드에 유니크(UNIQUE) 제액조건을 걸고, 재시도하는 로직을 추가할 수 있다. 빈도수가 낮은 경우에는 시스템에서 재시도하는 로직을 만들어 해결할 수 있다.

  * 반대로 빈도수가 높은 경우, 동시 접속자가 너무 많은 경우에는 ProductNumber(상품번호)를 UUID로 만들면, 상품번호가 유니크한 값이 나오므로 동시성 문제를 정책적으로 해결할 수 있다.

#### @Transactional(readOnly = true)

`@Transactional`은 기본이 false(Transactional(readOnly = false)) 값이다.

(readOnly = true)`을 하면 CRUD에서 CUD 동작이 없고, 오로지 READ만 된다.

JPA에서는 CUD 스냅샷 저장과 변경감지를 안하기 때문에 성능 향상 효과가 있다.

가장 중요한 건 `CQRS`를 생각해볼 수 있다.

`CQRS`는 **'Command와 Query에 대한 Responsibility,즉 책임을 분리(Seperate)하자'** 는 의미로, 여기서 `Command`는 CUD를 의미하고, `Query`는 R인 Read를 의미한다.

  * 통상적인 서비스에서 보통은 `Command`(데이터를 생성, 변경, 삭제)보다 Read의 빈도수가 훨씬 높다. → 거의 2:8(8이 Read에 속한다)

  * 보통의 서비스(프로덕션)의 경우 **Read 작업이 많다**. Command는 그에 비해 적은편이다.

  * `@Transactional` 어노테이션과 readOnly 설정을 통해 **Command와 Query를 의도적으로 분리를 해서 연관이 없도록 한다.**

  * Transactional(readOnly = true) 주면 서비스를  Command용 서비스와 Query용 서비스를 분리할 수 있다.

가장 좋은 포인트라고 보는게 **DB에 대한 `Endpoint`를 구분할 수 있다.**

  * 최근에는 AWS에 오로라 DB 또는 MySQL를 쓰면 Read용 DB, Write용 DB를 보통 나눠서 쓰는 편이다.

  * 예를 들어, Master와 Slave라고 많이 얘기를 한다.

  * Master DB 는 Write 권한 위주, Slave DB는 Read 권한 위주이다.

  * Master DB에 접근하는 endpoint와 Slave DB에 접근하는 endpoint를 분리를 해서 readonly 값을 true인지 false인지 보고, 나눠줄 수 있다.

  * `@Transactional(readOnly = true)` -> '읽기 전용 행위이므로 Slave DB에 보내자!' 라는 설정을 할 수 있다. -> Read 작업

  * 그게 아니라면, 기본 값인 `@Transactional`(기본값 false)이면, Master DB에 보내자!라는 설정을 할 수 있다. -> Command 작업

  * **DB Endpoint를 구분하면서 장애 격리를 할 수 있는 좋은 포인트다.**

ProductService 클래스 경우, createProduct() 메서드는 Command 작업으로 C에 속해서, `@Transactional` 어노테이션을 사용하고, getSellingProducts()는 Read 작업으로 조회만 하기 때문에, `@Transactional(readOnly = true)` 어노테이션을 사용하면 된다.

추천하는 방법은 Service 클래스 상단에 `@Transactional(readOnly = true)` 을 걸고, Command 작업이 있다면 해당 메서드 위에 `@Transactional` 어노테이션을 사용한다.

> ProductService 클래스

```java
/**
 * readOnly = true : 읽기전용
 * CRUD 에서 CUD 동작 X / only Read
 * JPA : CUD 스냅샷 저장 변경감지 X (성능 향상)
 *
 * CQRS - Command / Query -> 분리
 */
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    // 동시성 이슈
    @Transactional
    public ProductResponse createProduct(ProductCreateServiceRequest request) {
        String nextProductNumber =  createNextProductNumber();

        Product product = request.toEntity(nextProductNumber);
        Product savedProduct = productRepository.save(product);

        return ProductResponse.of(savedProduct);
    }

    @Transactional
    private String createNextProductNumber() {
        String latestProductNumber =  productRepository.findLatestProductNumber();
        // 유효성 검사 추가
        if(latestProductNumber == null) {
            return "001";
        }

        int latestProductNumberInt = Integer.parseInt(latestProductNumber);
        int nextProductNumberInt = latestProductNumberInt + 1;

        // 9 -> 009, 10 -> 010
        return String.format("%03d", nextProductNumberInt);
    }

    public List<ProductResponse> getSellingProducts() {
        List<Product> products = productRepository.findAllBySellingStatusIn(ProductSellingStatus.forDisplay());

        return products.stream()
                .map(product -> ProductResponse.of(product))
                .collect(Collectors.toList());
    }

}
```

#### ControllerTest - @WebMvcTest

서비스 레이어 하위로 Mocking 처리를 하고, Mocking 처리를 도와주는 테스트 프레임워크로 `MockMvc`가 있다.

컨트롤러 관련 테스트를 위한 `MockMvc`를 사용하려면 **`@WebMvcTest`** 어노테이션을 사용해야 한다.

`@WebMvcTest` 사용 방법은 controllers 오른쪽에는 테스트하고자 하는 컨트롤러 클래스(ProductController.class)를 명시해주면 된다. -> `@WebMvcTest(controllers = ProductController.class)` 

그리고 한 가지 더 해야할 게 가짜로 사용할 서비스 계층의 객체를 `@MockBean` 이라는 어노테이션을 붙텨서 주입받는다.

  * `@MockBean` 어노테이션을 사용하면 컨테이너에 mockito에서 만든 mock 객체를 넣어주는 역할을 한다. → ProductService mock 객체를 컨테이너에 대신 넣어준다.

  (참고로 `@MockBean`은 mockito 라이브러리이다. - import org.springframework.boot.test.mock.mockito)

  * 만약 `@MockBean`이 없다면 WebMvcTest에서 에러가 발생한다. -> 왜냐하면 ProductController를 테스트하면서 ProductService라는 bean이 있어야 만들어지는 bean이기 때문이다.

POST의 경우 http body에 값을 넣다보니까 직렬화와 역직렬화 과정을 거치게 된다. 우리가 만든 객체(ProductCreateRequest)를 JSON 형태로 직렬화 과정을 거치고, 직렬화하기 위해서는 `ObejctMapper`이 필요하다.

> 결과: ProductControllerTest - 해당 클래스를 자세하게 확인하고 싶다면 [여기](https://github.com/devFancy/cafekiosk/blob/main/src/test/java/sample/cafekiosk/spring/api/controller/product/ProductControllerTest.java)를 참고한다.

```java
// ProductControllerTest
@WebMvcTest(controllers = ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @DisplayName("신규 상품을 등록한다.")
    @Test
    void createProduct() throws Exception {
        // given
        ProductCreateRequest request = ProductCreateRequest.builder()
                .type(ProductType.HANDMADE)
                .sellingStatus(ProductSellingStatus.SELLING)
                .name("아메리카노")
                .price(4000)
                .build();

        // when & then
        mockMvc.perform(post("/api/v1/products/new")
                    .content(objectMapper.writeValueAsString(request))
                    .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print()) // log 확인
                .andExpect(status().isOk());
    }
}
// ProductController
@RequiredArgsConstructor
@RestController
public class ProductController {

  private final ProductService productService;

  @PostMapping("/api/v1/products/new") // RequestBody 추가
  public ProductResponse createProduct(@RequestBody ProductCreateRequest request) {
    return productService.createProduct(request);

  }
}
```

추가적으로 **로그 확인**을 위해 ProductControllerTestd의 createProduct() 메서드에서 mockMvc 하위에 `andDo(MockMvcResultHandlers.print())` 부분을 추가했다.

#### Controller에서 유효성 처리

스프링 빈 유효성 검사를 위해 아래와 같은 의존성을 추가해준다.

* 컨트롤러 역할 중 하나인 파라미터가 잘 들어왔는지 기본적인 유효성 검사를 하기 위해서이다.

```groovy
dependencies {
    // 스프링 빈 유효성 검사를 위한 의존성 추가
    implementation 'org.springframework.boot:spring-boot-starter-validation' implementation("com.google.guava:guava:32.1.3-jre")
}
```

> ProductCreateRequest 클래스에 `@NotNull`, `@NotBlank`, `@Positive` 추가

```java
@Getter
@NoArgsConstructor
public class ProductCreateRequest {

    @NotNull
    private ProductType type;

    @NotNull
    private ProductSellingStatus sellingStatus;

    @NotBlank
    private String name;

    @Positive
    private int price;
}
```

String 타입의 필드를 검증할 때 @NotBlank, @NotNull, @NotEmpty 어노테이션을 사용한다.

  * `@NotNull` : 빈문자열, 공백이 있는 문자열은 통과된다. `“”`, `“    “`

  * `@NotEmpty` : 공백만 통과한다. - `“  “`

  * `@NotBlank` : 빈 문자열, 공백 둘다 통과하지 못한다.

String 같은 경우는 NotBlank를 주로 쓰고, Enum 타입인 경우는 `@NotNull`만 사용할 수 있다. 가격같은 int형인 경우 `@Positive` 사용한다.

> ProductController 클래스에 `@Valid` 추가

```java
@RequiredArgsConstructor
@RestController
public class ProductController {

    private final ProductService productService;

    @PostMapping("/api/v1/products/new")
    public ProductResponse createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return productService.createProduct(request);

    }
}
```

#### DTO를 통한 계층적 구조에서 의존성 관계

하위 계층인 Service 에서는 상위 계층인 Controller 존재를 모르도록 구현하는 것이 좋은 레이어드 아키텍처이다.

이를 위해, **Controller의 DTO와 Service의 DTO를 분리하는 것이 좋다.**

  * Controller의 DTO - OrderCreateRequest

  * Service의 DTO - OrderCreateServiceRequest

```java
// OrderController
@RequiredArgsConstructor
@RestController
public class OrderController {

  private final OrderService orderService;

  @PostMapping("/api/v1/orders/new")
  public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderCreateRequest request) {
    LocalDateTime registeredDateTime = LocalDateTime.now();
    return ApiResponse.ok(orderService.createOrder(request.toServiceRequest(), registeredDateTime));
  }
}
// OrderCreateRequest - Controller의 DTO
@Getter
@NoArgsConstructor
public class OrderCreateRequest {

  @NotEmpty(message = "상품 번호 리스트는 필수입니다.")
  private List<String> productNumbers;

  @Builder
  public OrderCreateRequest(List<String> productNumbers) {
    this.productNumbers = productNumbers;
  }

  public OrderCreateServiceRequest toServiceRequest() {
    return OrderCreateServiceRequest.builder()
            .productNumbers(productNumbers)
            .build();
  }
}
// OrderCreateServiceRequest - Service의 DTO
@Getter
@NoArgsConstructor
public class OrderCreateServiceRequest {
  private List<String> productNumbers;

  @Builder
  public OrderCreateServiceRequest(List<String> productNumbers) {
    this.productNumbers = productNumbers;
  }
}
```

이런 식으로 하면 Service의 DTO인 `OrderCreateServiceRequest` 클래스는 Controoler에서 `@NotEmpty` 어노테이션 같은 **유효성 검사를 위한 처리할 필요가 없어진다.**

Controller 계층에서만 유효성 검사 처리를 하게 되고, Service 계층은 클린한 POJO 형태를 띄게 된다. -> 책임 분리

실무에서는 두 가지 Dto를 만들어서 변환을 해서 보통 이렇게 해서 관리를 하는 편이다.

서비스가 커지면 커질수록 의존성에 대한 부담이 커질 수 있기 때문에, 이런 관리가 더욱 더 필요하고 중요하다.

결론은 **각 Layer마다 DTO를 구분하는게 의존성과 책임분리 측면에서 좋다.**

### Spring & JPA 기반 테스트 리뷰

* 레이어드 아키텍처의 각 계층별로 통합/단위 테스트를 어떻게 작성해야 할까?

    * Presentation Layer(Controller): Business Layer, Persistence Layer를 Mocking 처리하여 단위 테스트를 진행한다.

    * Business Layer(Service): Persistence Layer를 주입받는 통합 테스트를 진행한다. @SpringBootTest를 기준으로 작성하며 수동으로 삭제하는 tearDown 메서드를 적극 활용한다.

    * Persistence Layer(Repository): Data Access하는 로직만 갖고 있기 때문에 단위 테스트를 진행한다. @DataJpaTest를 기준으로 작성해도 상관없다.

* API별로 응답에 대한 응답 DTO를 분리해야 하는 것이 좋은가?

    * 응답 형태가 비슷하더라도 서비스가 커지면 커질수록 의존성에 대한 부담이 커질 수 있기 때문에, 각 Layer마다 DTO를 구분하는게 의존성과 책임분리 측면에서 좋다.

* 유효성 검사에 대해 계층별로 어떻게 책임을 분리해야 할까?

    * Presentation Layer에는 기본적인 유효성 검사만 진행하고 도메인에 대한 유효성 검증이 필요한 경우, 해당 도메인 객체에서 진행한다.

## Review

해당 강의를 들으면서 중요한 부분 or 처음 배우는 개념에 대해서 학습했다. 그리고 강의에서 깊게 다루지 않는 개념들에 대해서는 추가적으로 공부해가면서, 정리해 보니 내 기준에서 생각보다 어마어마한 양의 내용을 배우게 되었다.

이전에 테스트 코드를 작성한 경험은 있지만, 깊이 있게 공부하지 않았고 체계적으로 공부하지 않아서(야생형같이 공부했음..), 이번 강의를 통해 깊이 있게 공부하려고 노력했다.

배운 내용들을 블로그에 정리하면서, 내 것으로 만드는 과정(알게 모르게 복습도 되고..)에서 시간이 많이 걸렸지만, 이제는 누군가에게 테스트 코드가 왜 필요하고, 테스트를 어떻게 해야 하는지 주니어(?) 수준의 말 할 정도가 되어서 스스로 뿌듯했다.

강의에서 남은 섹션에 대해서도 깊이 있게 학습하고, 스스로 실습하고 정리하면서 인풋뿐 아니라 아웃풋까지 할 수 있도록 하자.

(Spring & JPA기준 테스트 코드를 작성하는 방법을 배우고 싶다면, 해당 강의를 적극적으로 추천한다!)

## Reference

* [Practical Testing: 테스트 코드 작성 방법](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard)