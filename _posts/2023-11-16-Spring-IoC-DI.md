---
layout: post
title:  " Spring 핵심원리 - 기본편: 객체 지향 원리 적용 "
categories: Spring
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [스프링 핵심원리 기본편] 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## 객체 지향 원리 적용

객체의 생성과 연결은 `AppConfig`가 담당한다.

**새로운 구조와 할인 정책이 적용**된다고 가정해보자.

* 할인 정책을 정률% 할인 정책으로 변경해보자

* `FixDiscountPolicy` -> `RateDiscountPolicy`

`AppConfig`의 등장으로 애플리케이션이 크게 사용 영역과, 객체를 생성하고 구성(Configuration)하는 영역으로 분리되었다.

> 그림 - 사용, 구성의 분리

![]()

> 그림 - 할인 정책의 변경

![]()

* `FixDiscountPolicy` -> `RateDiscountPolicy` 로 변경해도 구성 영역만 영향을 받고, **사용 영역은 전혀 영향을 받지 않는다.**

> 할인 정책 변경 구성 코드 - AppConfig.class

```java
package hello.core;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.MemberRepository;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;

public class AppConfig {
    
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }
    
    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    public DiscountPolicy discountPolicy() {
        //return new FixDiscountPolicy();
        return new RateDiscountPolicy();
    }
}
```

> OrderServiceImpl.class

```java
package hello.core.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hello.core.annotation.MainDiscountPolicy;
import hello.core.discount.DiscountPolicy;
import hello.core.member.Member;
import hello.core.member.MemberRepository;

public class OrderServiceImpl implements OrderService{

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, @MainDiscountPolicy DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId); // 회원정보 조회
        int discountPrice = discountPolicy.discount(member, itemPrice); // 할인정책에 넘겨서 할인된 가격을 받음

        return new Order(memberId, itemName, itemPrice, discountPrice); // 최종 생성된 주문을 반환
    }
}
```

* `AppConfig` 에서 할인 정책 역할을 담당하는 구현을 `FixDiscountPolicy` -> `RateDiscountPolicy` 객 체로 변경했다.

* 이제 할인 정책을 변경해도, **애플리케이션의 구성 역할을 담당하는 `AppConfig`만 변경**하면 된다. 클라이언트 코드인 `OrderServiceImpl` 를 포함해서 **사용 영역**의 어떤 코드도 변경할 필요가 없다.

* **구성 영역**은 당연히 변경된다. 성 역할을 담당하는 AppConfig를 애플리케이션이라는 공연의 기획자로 생각하 자. 공연 기획자는 공연 참여자인 구현 객체들을 모두 알아야 한다.

### 좋은 객체 지향 설계의 5가지 원칙 중 3가지 적용

> SRP 단일 책임 원칙: 한 클래스는 하나의 책임만 가져야 한다.

* 클라이언트 객체는 직접 구현 객체를 생성하고, 연결하고, 실행하는 다양한 책임을 가지면 안된다.

* `SRP 단일 책임 원칙`을 따르기 위해 **구현 객체를 생성하고 연결하는 책임은 `AppConfig`가 담당**하도록 관심사를 분리했다.

* 그래서 클라이언트 객체는 **실행하는 책임만 담당**하도록 리팩터링했다.

> DIP 의존관계 역전 원칙: 프로그래머는 "추상화에 의존해야지, 구체화에 의존하면 안된다".

* 클라이언트 코드인 `OrderServiceImpl`이 `DiscountPolicy` 추상화 인터페이스에만 의존하도록 **생성자를 통해서 주입(연결)**하도록 코드를 변경했다.

* 그리고 AppConfig가 `RateDiscountPolicy` 객체 인스턴스를 클라이언트 코드(`OrderServiceImpl`)대신 생성해서 클라이언트 코드에 의해 의존관계를 주입했다.

* 이렇게 해서 DIP 원칙을 따르면서 문제를 해결했다.

> OCP 개방-폐쇄 원칙: 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.

* 애플리케이션을 사용 영역과 구성 영역으로 나눴다.

* `AppConfig`가 의존관계를 `FixDiscountPolicy` -> `RateDiscountPolicy` 로 변경해서 클라이언트 코드에 주입하므로 클라이언트 코드(`OrderServiceImpl`)는 변경하지 않아도 된다.

## 제어의 역전 IoC(Inversion of Control)

## 의존관계 주입 DI(Dependency Injection)
