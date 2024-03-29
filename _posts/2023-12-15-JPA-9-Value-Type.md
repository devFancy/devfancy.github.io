---
layout: post
title:  " [JPA] 값 타입 "
categories: JPA
author: devFancy
---
* content
{:toc}

> 이 글은 [자바 ORM 표준 JPA 프로그래밍 - 기본편] 강의를 듣고 정리한 내용입니다.

## 기본값 타입

* 엔티티 타입

    * `@Entity` 로 정의하는 객체이다.

    * 데이터가 변해도 식별자로 지속해서 추적이 가능하다.

    * ex) 회원 엔티티의 키나 나이 값을 변경해도 식별자로 인식이 가능하다.

* 값 타입

    * int, Integer, String 처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체이다.

    * 식별자가 없고 값만 있으므로 **변경시 추적 불가능하다**

    * ex) 게시판의 내용(content)

> 값 타입 분류

* 기본 값

    * 자바 기본 타입(int, double)

    * 래퍼 클래스(Integer, Long)

    * String

```java
// 기본 값 타입 - 예시) - id, userName
@Entity
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String userName;
}
```

* 임베디드 타입(**Embedded type**, 복합 값 타입) - ex) 우편번호

* 컬렉션 값 타입(Collection value type)

## 임베디드 타입

* `임베디드 타입`는 복합 값 타입으로 새로운 값 타입을 직접 정의할 수 있다.

* 주로 기본 값 타입을 모아서 만들어 복합 값 타입이라고도 한다.

* 임베디드 타입 역시 직접 정의를 할 뿐, int, String과 같은 타입으로 이루어진다.

* 예를 들어, 회원 엔티티에 이름, 근무기간, 집 주소를 가질 때 -> 아래와 같이 `Address` 클래스 임베디드 타입으로 바꿀 수 있다.

* 임베디드 타입을 사용하려면 **값 타입을 정의하는 곳(Address)에 기본 생성자를 필수로 생성해야 한다.**

![](/assets/img/jpa/JPA-Value-Type-1.png)

![](/assets/img/jpa/JPA-Value-Type-2.png)

### 임베디드 타입 사용법

* `@Embeddable` : 값 타입을 정의하는 곳에 표시한다. -> Address 클래스

* `@Eembedded` : 값 타입을 사용하는 곳에 표시한다. -> Member 클래스 안에 Address 객체를 필드로 선언한 뒤, 그 위에 표시해준다.

### 임베디드 타입의 장점

* 재사용성과 높은 응집도

* 임베디드 타입을 포함한 모든 값 타입은, 값 타임을 소유한 엔티티에 생명주기를 의존한다.

### 임베디드 타입과 테이블 매핑

![](/assets/img/jpa/JPA-Value-Type-3.png)

* 임베디드 타입은 엔티티의 값일 뿐이다. 그래서 임베디드 타입을 사용하기 전과 후에 **매핑하는 테이블은 같다.**

* 객체와 테이블을 아주 세밀하게 매핑하는 것이 가능하다.

* **잘 설계한 ORM 애플리케이션은** 매핑한 테이블의 수보다 **클래스의 수가 더 많다.**

![](/assets/img/jpa/JPA-Value-Type-4.png)

### @AttributeOverride: 속성 재정의

* 한 엔티티에서 같은 값 타입을 사용하면 컬럼명이 중복될때, `@AttributeOverrides`, `@AttributeOverride`를 사용해서 컬러명 속성을 재정의한다.

* 아래 그림과 같이 주소라는 컬럼명을 재정의하기 위해 `workAddress` 변수를 만들고, 그 위에 `@AttributeOverrides`, `@AttributeOverride`을 사용했다.

![](/assets/img/jpa/JPA-Value-Type-5.png)

## 값 타입과 불변 객체

* 값 타입 공유 참조 - 임베디드 타입 같은 값 타입을 여러 엔티티에서 공유하면 위험함 → 부작용이 발생할 수 있다.

* 따라서 부작용을 피하기 위해서는 값 타입을 복사해준다.

    * 값 타입의 실제 인스턴스인 값을 공유하는 것은 위험하다.

    * 대신 값(인스턴스)를 복사해서 사용한다.

![](/assets/img/jpa/JPA-Value-Type-6.png)

> 값 타입의 한계

* 항상 값을 복사해서 사용하면 공유 참조로 인해 발생하는 부작용을 피할 수 있지만, 문제는 임베디드 타입처럼 **직접 정의한 값 타입은 자바의 기본 타입이 아니라 `객체 타입`이다.**

* 객체 타입을 수정할 수 없게 만들기 위해서는 값 타입을 `불변 객체`로 설계해야 한다.

    * `불변 객체`: 생성 시점 이후에 절대 값을 변경할 수 없는 객체를 말한다.

* 불변 객체로 설계하기 위해서는 **생성자로만 값을 설정하고, 수정자(Setter)를 만들지 않으면 된다.**

* 참고로, Integer, String은 자바가 제공하는 대표적인 불변 객체이다.

* **`불변`이라는 작은 제약으로 부작용이라는 큰 재양을 막을 수 있다.**

## 값 타입의 비교

* 값 타입을 비교할 때 동일성 비교(==) 보다는 동등성 비교(equals)을 이용하여 비교한다.

* `동일성(identity) 비교`: 인스턴스의 참조 값을 비교해서, `==`을 사용한다.

* `동등성(equivalence) 비교`: 인스턴스의 값을 비교해서, `equals()`을 사용한다.

* 동등성 비교(equals())을 사용하기 위해서는 해당 메서드를 **적절하게 재정의 해줘야 한다.**

* 해당 체크를 통해 필드에 직접 접근이 아닌 **getter**를 통해서 동등성을 비교하도록 한다. 그래야 **프록시 객체에 접근할 수 있도록 하여 비교가 가능해진다.**

![](/assets/img/jpa/JPA-Value-Type-7.png)

![](/assets/img/jpa/JPA-Value-Type-8.png)

![](/assets/img/jpa/JPA-Value-Type-9.png)

## 값 타입 컬렉션

* 값 타입을 하나 이상 저장할 때에는 `값 타입 컬렉션`을 사용한다. 그래서 컬렉션의 경우 1대다 관계로 되어있다.

* 테이블로 보면 아래와 같이 favoriteFoods, addressHistory와 같이 되어있다.

![](/assets/img/jpa/JPA-Value-Type-10.png)

* 값 타입을 하나 이상 저장할 때, `@ElementCollection`, `@CollectionTable` 을 사용한다.

* `@ElementCollection` 어노테이션을 사용하여 값 타입 컬렉션을 지정하고(fetch 전략 기본이 지연 로딩(LAZY)임), `@CollectionTable` 어노테이션을 통해 값 타입 컬렉션이 사용할 테이블을 지정해준다.

![](/assets/img/jpa/JPA-Value-Type-11.png)

### 값 타입 컬렉션의 제약사항

* 하지만 값 타입 컬렉션은 다음과 같은 **제약사항**이 있다.

    * 값 타입은 엔티티와 다르게 **식별자 개념이 없고, 값을 변경하면 추적이 어렵다.**

    * 값 타입 컬렉션에 변경 사항이 발생하면 주인 엔티티와 연관된 모든 데이터를 삭제하고, 값 타입 컬렉션에 있는 현재 값을 모두 저장하게 된다.

    * 그리고 값 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본 키를 구성해야 한다. -> null 입력X, 중복 저장X

* 따라서 값 타입 컬렉션을 사용하는 걸 추천하지는 않는다.

### 값 타입 컬렉션의 대안

* 대신, 값 타입 컬렉션의 대안으로 실무에서는 상황에 따라 **값 타입 컬렉션 대신에 일대다 관계를 고려한다.**

* 일대다 관계를 위한 엔티티를 만들고 여기에서 값 타입을 사용한다.

* **영속성 전이(Cascade) + 고아 객체 제거(orphan remove)** 를 사용해서 값 타입 컬렉션 처럼 사용하는 방법이 있다. ⇒ ex) `AddressEntity`

* 아래와 같이 AddressEntity 라는 엔티티 테이블을 만들고, Member 테이블과 연관관계를 맺어준다.

![](/assets/img/jpa/JPA-Value-Type-12.png)

![](/assets/img/jpa/JPA-Value-Type-13.png)

* 값 타입 컬렉션은 select box 처럼 멀티로 체크하는 등 단순한 경우에만 사용하는 것을 권장한다.

> 엔티티 타입과 값 타입의 특징

* 엔티티 타입의 경우 식별자가 있고, 생명 주기를 관리하며, 공유가 된다.

* 값 타입의 경우 식별자가 없고, 생명 주기를 엔티티에 의존하고 공유하지 않는 것이 안전하다. -> 복사해서 사용하거나 불변 객체로 만드는 것이 안전하다.

=> 정리하면, **식별자가 필요하고, 지속해서 값을 추적, 변경해야 한다면 그것은 값 타입이 아닌 `엔티티`를 사용하는 걸 권장한다.**

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)

