---
layout: post
title:  " Practical Testing: 테스트 코드 작성 방법 "
categories: TestCode
author: devFancy
---
* content
{:toc}

> 이 글은 [Practical Testing: 테스트 코드 작성 방법](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard) 강의를 듣고 내용을 정리한 글입니다.

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

개발 환경은 다음과 같다.

  * IntelliJ Ultimate 
    
  * Java 11

  * Spring Boot 2.7.12

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

### 레이어드 아키텍처와 테스트

### Spring / JPA & 기본 엔티티 설계

### Persistence Layer

### Business Layer

### Presentation Layer