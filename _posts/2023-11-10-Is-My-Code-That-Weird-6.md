---
layout: post
title:  " [내 코드가 그렇게 이상한가요?] 6장. 조건 분기: 미궁처럼 복잡한 분기 처리를 무너뜨리는 방법 "
categories: GoodCode
author: devFancy
---
* content
{:toc}

> 이 글은 [내 코드가 그렇게 이상한가요?](https://product.kyobobook.co.kr/detail/S000202521361) 책을 읽고 중요하다고 생각한 부분들을 중점으로 정리했습니다.

* 결론부터 말하면 조건 분기 중첩을 해결하기 위해서는 인터페이스, 전략 패턴, 정책 패턴을 사용한다.

* 세 가지에 대해서 하나씩 정리해 가보자.

## 조기 리턴

* if문을 중첩으로 하면 코드의 가독성이 크게 떨어지는 문제가 있다.

* 이런 중첩 악마를 퇴치하는 방법 중 하나로 **`조기 리턴`**(early return)이 있다.

    * `조기 리턴`은 조건을 만족하지 않는 경우 곧바로 리턴하는 방법이다.

* 가독성을 낮추는 `else 구문`도 조기 리턴으로 해결이 가능하다.

    * **바로 리턴하면, 사실 else 절 자체를 사용할 필요가 없다.** -> else if, else문을 if문으로 바꿔서 로직을 개선할 수 있다.

## switch 조건문 중복

* switch 조건문에서 중복을 해소하려면, **단일 책임 선택의 원칙** 생각해봐야 한다.

> 단일 책임 선택의 원칙이란 소프트웨어 시스템이 선택지를 제공해야 한다면, **그 시스템 내부의 어떤 한 모듈만으로 모든 선택지를 파악할 수 있어야 한다.** - 객체 지향 소프트웨어 설계 2판 원칙과 개념 -

* 따라서 조건식이 같은 조건 분기가 있으면, 여러 클래스로 작성하지 말고 **하나의 클래스에 작성**하자.

* 그리고 클래스가 거대해지면 **관심사에 따라 작은 클래스로 분할하는 것**이 중요한데, 이러한 문제를 해결할 때는 `인터페이스`를 사용한다.

* `인터페이스`는 기능 변경을 편리하게 할 수 있는 개념으로, 분기 로직을 작성하지 않고도 분기와 같은 기능을 구현할 수 있다.

    * 잘 활용하면 조거 분기가 많이 줄어들어 로직이 간단해진다.

* `인터페이스`에는 다음과 같은 장점들이 있다.

    * 같은 자료형으로 사용할 수 있으므로, 굳이 자료형을 판정하지 않아도 된다.

    * 조건 분기를 따로 작성하지 않고도 각각의 코드를 적절하게 실행할 수 있다.

    * 자료형 판정 분기를 따로 작성하지 않아도 된다.

* 예를 들어 사각형과 원을 프로그램상에서 같은 도형을 다룰 수 있게 가정한다.

    여기서 도형을 나타내는 **Shape**라는 이름의 인터페이스를 만든다.

    그리고 **공통 메서드**도 정의한다. 도형의 면적을 나타내는 area 메서드를 정의한다.

    삼각형을 나타내는 Triangle 클래스, 타원을 나타내는 Ellipse 클래스 등 새로운 도형을 추가할 수도 있다.

![](/assets/img/goodcode/Is-My-Code-That-Weird-6-1.png)

* 이처럼 **인터페이스를 사용해서 처리를 한꺼번에 전환하는 설계를 `전략 패턴`(strategy pattern)** 이라고 한다.

## 조건 분기 중첩

* 인터페이스는 switch 조건문의 중복을 제거할 수 있을 뿐만 아니라, **다중 중첩된 복잡한 분기를 제거**하는 데 활용할 수 있다.

* 이러한 상황에서 유용하게 활용할 수 있는 패턴으로 `정책 패턴`(policy pattern)이 있다.

    * `정책 패턴`은 **조건을 부품처럼 만들고, 부품으로 만든 조건을 조합해서 사용하는 패턴**이다.

* 예를 들어 다음의 상황을 가정해보자.

* 온라인 쇼핑몰에서 우수 고객인지 판정하는 로직이 있다.

* 고객의 구매 이력을 확인하고 다음 조건을 모두 만족하는 경우, 골드 회원으로 판정한다.

    * 골드 회원의 구매 금액 규칙: 지금까지 구매한 금액이 100만원 이상

    * 구매 빈도 규칙: 한 달에 구매하는 횟수가 10회 이상

    * 반품률 규칙: 반품률이 0.1% 이하

* 아래의 코드처럼 하나하나의 규칙(판정 조건)을 나타내는 인터페이스를 만든다.

```java
// 우수 고객 규칙을 나타내는 인터페이스
interface ExcellentCustomerRule {
    /**
     * @param history 구매 이력
     * @return 조건을 만족하는 경우 true
     */
    boolean ok(final PurchaseHistory history);
}
```

* 골드 회원이 되려면 3개의 조건을 만족해야 한다. 이러한 조건을 각각 아래의 코드처럼 `ExcellentCustormerRule`을 구현해서 만든다.

```java
// 골드 회원의 구매 금액 규칙
class GoldCustomerPurchaseAmountRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
        return 1000000 <= history.totalAmount;
    }
}

// 구매 빈도 규칙
class PurchaseFrequencyRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
        return 10 <= history.purchaseFrequencyPerMonth;
    }
}

// 반품률 규칙
class ReturnRateRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
      return history.returnRate <= 0.001;
    }
}
```

* 이어서 정책 클래스를 만든다. add 메서드로 규칙을 집약하고, complyWith All 메서드 내부에서 규칙을 모두 만족하는지 판정한다.

```java
// 우수 고객 정책을 나타내는 클래스
class ExcellentCustomerPolicy {
    private final Set<ExcellentCustomerRule> rules;

  ExcellentCustomerPolicy() {
      rules = new HashSet();
  }

  /**
   * 규칙 추가
   * 
   * @param rule 규칙
   */
  void add(final ExcellentCustomerPolicy rule) {
      rules.add(rule);
  }

  /**
   * @param history 구매 이력
   * @return 규칙을 모두 만족하는 경우 true
   */
  boolean complyWithAll(final PurchaseHistory history) {
      for(ExcellentCustomerRule each : rules) {
          if(!each.ok(history)) return false;
      }
      return true;
  }
}
```

* Rule(`ExcellentCustomerRule`)과 Policy(`ExcellentCustomerPolicy)`을 사용해서 골드 회원 판정 로직을 개선했다.

* 그러면 골드 회원에 대한 정책을 아래와 같이 작성할 수 있다.

```java
class GoldCustomerPolicy {
    private final ExcellentCustomerPolicy policy;
    
    GoldCustomerPolicy() {
        policy = new ExcellentCustomerPolicy();
        policy.add(new GoldCustomerPurchaseAmountRule());
        policy.add(new PurchaseFrequencyRule());
        policy.add(new ReturnRateRule());
    }

  /**
   * @param history 구매이력
   * @return 규칙을 모두 만족하는 경우 true
   */
  boolean complyWithAll(final PurchaseHistory history) {
      return policy.complyWithAll(history);
  }
}
```

* 여기서 골드 회원 뿐만 아니라, 실버 회원을 추가해도 구조를 크게 바꾸지 않은 채로 필요한 클래스만 추가해주면 된다.

![](/assets/img/goodcode/Is-My-Code-That-Weird-6-2.png)

* 이처럼 조건 분기 중복과 중첩을 제거하기 위해 정책 패턴으로 규칙을 구조화한 상태로 만들면 된다.
