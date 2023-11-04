---
layout: post
title:  " [내 코드가 그렇게 이상한가요?] 3장. 클래스 설계: 모든 것과 연결되는 설계 기반 "
categories: GoodCode
author: devFancy
---
* content
{:toc}

> 이 글은 [내 코드가 그렇게 이상한가요?](https://product.kyobobook.co.kr/detail/S000202521361) 책을 읽고 정리한 내용을 바탕으로 작성하였습니다.

## 클래스 단위로 잘 동작하도록 설계하기

* **잘 만들어진 클래스**는 다음 두 가지로 구성된다.

    * 인스턴스 변수

    * 인스턴스 변수에 잘못된 값이 할당되지 않게 막고, 정상적으로 조작하는 메서드

* 자신의 몸은 자신이 지켜야 하듯이, 클래스 스스로 **자기 방어 임무**를 수행할 수 있어야 소프트웨어의 품질을 높이는 데 도움이 된다.

## 성숙한 클래스로 성장시키는 설계 기법

* 데이터 클래스를 성숙한 클래스로 가는 과정을 알아가보자.

* 금액을 나타내는 클래스인 Money를 예시로 들면,

> 금액을 나타내는 클래스

```java
import java.util.Currency;

class Money {
    int amount; // 금액
    Currency currency; // 통화 단위
}
```

* 위의 Money 클래스는 인스턴스 변수만 갖고 있는 전형적인 데이터 클래스이다.

* 일단 인스턴스 변수를 모두 초기화하는 데 필요한 매개변수들을 받는 생성자를 만든다.

* 그리고 **잘못된 값이 유입되지 못하게 `유효성 검사`(validation)를 생성자 내부에 정의**한다.

  * 금액 amount: 0 이상의 정수

  * 통화 currency: null 이외의 것

> 생성자에서 유효성 검사하기
  
```java
import java.util.Currency;

class Money {
    int amount; // 금액
    Currency currency; // 통화 단위
  
  Money(int amount, Currency currency) {
      if (amount < 0) {
          throw new IllegalArgumentException("금액은 0 이상의 값을 지정해 주세요.");
      }
      if (currency == null) {
          throw new NullPointerException("통화 단위를 지정해 주세요. ");
      }
      
      this.amount = amount;
      this.currency =currency;
  }
}
```

* 이렇게 하면 올바른 값만 인스턴스 변수에 저장할 수 있을 것이다.

* 위의 클래스 처럼 **처리 범위를 벗어나는 조건을 메서드 가장 앞 부분에서 확인하는 코드를 `가드`** 라고 부른다.

* 생성자에 가드를 배치함으로써, 잘못된 값이 전달되면 생성자에서 예외가 발생할 것이다.

### 계산 로직도 데이터를 가진 쪽에 구현하기

* `데이터`와 `데이터를 조작하는 로직`이 분리되어 있는 구조를 **응집도가 낮은 구조**라고 한다.

* 이런 문제를 막기 위해서는 계산 로직도 Money 클래스 내부에 구현하면 된다.

### 불변 변수로 만들어서 예상하지 못한 동작 막기

* 변수의 값이 계속해서 바뀌면, 나중에 비즈니스 요구 사항이 바뀔때마다 코드를 수정하다가 의도하지 않는 값을 할당하는 **예상치 못한 부수 효과**가 쉽게 발생할 수도 있다.

* 이를 막으려면, 인스턴스 변수를 **불변**으로 만든다. 

* 값을 한 번 할당하면 다시는 바꿀 수 없는 변수를 `불변 변수`라고 한다.

* 불변 변수로 만들려면 `final` 수식자를 사용한다.

> final을 붙여 불변 변수로 만들기

```java
import java.util.Currency;

class Money {
    final int amount; // 금액
    final Currency currency; // 통화 단위
  
    Money(int amount, Currency currency) {
      if (amount < 0) {
          throw new IllegalArgumentException("금액은 0 이상의 값을 지정해 주세요.");
      }
      if (currency == null) {
          throw new NullPointerException("통화 단위를 지정해 주세요. ");
      }
      
      this.amount = amount;
      this.currency =currency;
    }
}
```

* 인스턴스 변수에 `final` 수식자를 붙이면, **한 번만 할당할 수 있고 이후에는 재할당할 수 없다.**

### 변경하고 싶다면 새로운 인스턴스 만들기

* 만약 인스턴스의 값을 변경하고 싶은 경우, **변경된 값을 가진 새로운 인스턴스를 만들어서 사용**하면 된다.

```java
import java.util.Currency;

class Money {
    final int amount; // 금액
    final Currency currency; // 통화 단위

    Money add(int other) {
        int added = amount + other;
        return new Money(added, currency);
    }
}
```

* 이렇게 하면 불변을 유지하면서도 값을 변경할 수 있다.

### 메서드 매개변수와 지역 변수도 불변으로 만들기

* 값이 중간에 바뀌는 것을 방지하기 위해 **기본적으로 매개변수는 변경하지 않는 것이 좋다.**

  (값이 중간에 바뀌면, 값의 변화를 추적하기 힘들기 때문에 버그를 발생하기도 한다)

* 매개변수에 `final`을 붙이면 값을 변경할 수 없게 된다.

* 지역 변수도 마찬가지로 중간에 값이 변경될 수 있으므로 `final`을 붙여 불변으로 만든다.

```java
import java.util.Currency;

class Money {
    // 생략
    Money add(final int other) { // 매개변수에 final 붙임
        final int added = amount + other; // 지역 변수에 final 붙임
        return new Money(added, currency);
    }
}
```

### 엉뚱한 값을 전달하지 않도록 하기

* 엉뚱한 값이 전달되지 않도록 하려면, Money 자료형만 매개변수로 받을 수 있게 메서드를 변경하면 된다.

```java
import java.util.Currency;

class Money {
    // 생략
    Money add(final Money other) { // Money 자료형을 매개변수로 받음
        final int added = amount + other.amount;
        return new Money(added, currency);
    }
}
```

* 기본 자료형 위주로 사용하면, 나중에 실수로 의미가 다른 값을 전달하기 쉽다.

* 반면 Money처럼 독자적인 자료형을 사용하면, 의미가 다른 값을 전달할 경우 **컴파일 오류**가 발생할 수 있다.

## 악마 퇴치 효과 검토하기

* 지금까지 악마 퇴치를 위한 객체 지향 설계의 기본을 살펴보았다.

* Money 클래스의 소스 코드와 클래스 다이어그램을 살펴보면 아래와 같다.

> 관련 로직을 응집해서 코드 수정 시 버그 발생이 어려워진 Money 클래스

```java
import java.util.Currency;

class Money {
    final int amount; // 금액
    final Currency currency; // 통화 단위

    Money(int amount, Currency currency) {
      if (amount < 0) {
        throw new IllegalArgumentException("금액은 0 이상의 값을 지정해 주세요.");
      }
      if (currency == null) {
        throw new NullPointerException("통화 단위를 지정해 주세요. ");
      }
  
      this.amount = amount;
      this.currency =currency;
    }
    
    Money add(final Money other) {
      if(!currency.equals(other.currency)) {
          throw new IllegalArgumentException("통화 단위가 다릅니다.");
      }
      
      final int added = amount + other.amount;
      return new Money(added, currency);
    }
}
```

> 퇴치된 악마 - 이유

1. 중복 코드 최소화 - 필요한 로직이 Money 내부 클래스에 모여있어, 다른 코드에 중복 코드를 작성할 일이 줄어듦.

2. 수정 누락 최소화 - 중복 코드가 발생하지 않으므로, 수정 시 누락이 발생할 일이 줄어듦.

3. 가독성 개선 - 필요한 로직이 Money 내부 클래스에 모여있어, 디버깅 또는 기능 변경시 관련 로직이 모여있어서 가독성이 높아짐.

4. 쓰레기 객체 발생 X - 생성자에서 인스턴스 변수의 값을 확정함.

5. 잘못된 값 X - 잘못된 값이 나오지 않도록 유효성 검사를 앞 부분에 처리하고, 인스턴스 변수에 final 수식자를 붙여 불변으로 만듦.

6. 생각하지 못한 부수 효과 - final 수식자를 붙여 불변 변수로 만들었으므로, 부수 효과로부터 안전함.

7. 값 전달 실수 - 매개변수를 Money 자료형으로 바꿨으므로, 다른 자료형의 값을 실수로 넣으면 컴파일 오류가 발생하도록 함.

* 이처럼 `클래스 설계`란 **인스턴스 변수가 잘못된 상태에 빠지지 않게 하기 위한 구조를 만드는 것**이라고 해도 과언이 아니다.

* Money 클래스처럼 로직이 한곳에 모여 있는 구조는 **응집도가 높은 구조**라고 한다.

* 또한 `데이터`와 `그 데이터를 조작하는 로직`을 하나의 클래스로 묶고, 필요한 절차(메서드)만 외부에 공개하는 것을 `캠슐화`라고 한다.

## 프로그램 구조의 문제 해결에 도움을 주는 디자인 패턴

* `디자인 패턴`은, 응집도가 높은 구조를 만드는 등 프로그램의 구조를 개선하는 설계 방법이라고 한다.

* 몇 가지 디자인 패턴을 소개하면 표 3.2와 같다.

![](/assets/img/goodcode/Is-My-Code-That-Weird-3-1.png)

* 이 장의 Money 클래스는 완전 생성자와 값 객체라는 두 가지 디자인 패턴을 적용한 것이다.

### 완전 생성자

* `완전 생성자`는 잘못된 상태로부터 클래스를 보호하기 위한 디자인 패턴이다.

* 다음 2가지로 설계하면 값이 모두 정상인 완전한 객체로 만들어질 것이다.

  * 인스턴스 변수를 모두 초기화해야지만 객체를 생성할 수 있게, 매개변수를 가진 생성자를 만든다.

  * 생성자 내부에 가드를 사용해서 잘못된 값이 들어오지 않게 만든다.

### 값 객체

* `값 객체`란 값을 클래스(자료형)을 나타내는 디자인 패턴이다.

* 예를 들어 금액을 단순한 int 자료형의 지역 변수 또는 매개변수로 사용하면, 금액 계산 로직이 이곳저곳에 분산될 것이다.

* 추가로 주문 수, 할인 포인트까지 int 자료형으로 사용한다면, 실수로 의미가 다른 값들이 섞일 수도 있다.

* 이러한 상황을 막으려면, **값을 클래스로 정의**하면 된다.

* 금액을 더하는 경우, Money.add 메서드와 같이 매개변수로 Money 자료형만 받을 수 있도록 하면, 의도하지 않게 다른 값이 섞이는 상황을 원천적으로 차단할 수 있다.

* `값 객체 + 완전 생성자`는 객체 지향 설계에서 폭넓게 사용되는 기법이라고 할 수 있다.

## Reference

* [내 코드가 그렇게 이상한가요?: 좋은코드 나쁜코드로 배우는 설계 입문](https://product.kyobobook.co.kr/detail/S000202521361)
