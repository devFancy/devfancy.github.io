---
layout: post
title: " Spring 핵심원리 - 기본편 : 스프링으로 전환하기 "
categories: Spring
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [Spring 핵심원리 - 기본편 : 객체 지향 설계와 스프링](https://devfancy.github.io/Spring-Core-Principle-1/)

2. [Spring 핵심원리 - 기본편 : 스프링으로 전환하기](https://devfancy.github.io/Spring-Core-Principle-2/)

3. [Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈](https://devfancy.github.io/Spring-Core-Principle-4/)

4. [Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회](https://devfancy.github.io/Spring-Core-Principle-4-2/)

5. [Spring 핵심원리 - 기본편 : 싱글톤 컨테이너](https://devfancy.github.io/Spring-Core-Principle-5/)

6. [Spring 핵심원리 - 기본편 : 컴포넌트 스캔](https://devfancy.github.io/Spring-Core-Principle-6/)

7. [Spring 핵심원리 - 기본편 : 의존관계 자동 주입](https://devfancy.github.io/Spring-Core-Principle-7/)

8. [Spring 핵심원리 - 기본편 : 빈 생명주기 콜백](https://devfancy.github.io/Spring-Core-Principle-8/)

9. [Spring 핵심원리 - 기본편 : 빈 스코프](https://devfancy.github.io/Spring-Core-Principle-9/)


## 스프링 컨테이너

### @Configuration

* @Configuration 어노테이션을 명시한 메소드는 설정 정보(어플리케이션이 어떻게 구성되어있는지)를 나타낸다.

### @Bean

* 이 클래스를 빈으로 등록하기 위해서는 명시적으로 설정 클래스에서 @Bean 어노테이션을 사용해 수동으로 스프링 컨테이너에 빈을 등록하는 방법이 있다.

* 설정 클래스는 다음과 같이 @Configuration 어노테이션을 클래스에 붙여주면 되는데, @Bean을 사용해 수동으로 빈을 등록해줄 때에는 메소드 이름으로 빈 이름이 결정된다.

* 그러므로 중복된 빈 이름이 존재하지 않도록 주의해야 한다.

### AppConfig 스프링 기반으로 변경

```java
package hello.core;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.MemberRepository;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImp;

@Configuration
public class AppConfig {

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }
    @Bean
    public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImp(memberRepository(), discountPolicy());
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        //return new FixDiscountPolicy();
        return new RateDiscountPolicy();
    }
}
```

* AppConfig에 설정을 구성한다는 뜻의 @Configuration 을 붙여준다.

* 각 메서드에 @Bean 을 붙여준다. 이렇게 하면 스프링 컨테이너에 스프링 빈으로 등록한다.

### MemberApp에 스프링 컨테이너 적용

```java
package hello.core;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;

public class MemberApp {

    public static void main(String[] args) {
        // AppConfig appConfig = new AppConfig();
        // MemberService memberService = appConfig.memberService();

        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberService memberService = applicationContext.getBean("memberService", MemberService.class);

        Member member = new Member(1L, "memberA", Grade.VIP);
        memberService.join(member);

        Member findMember = memberService.findMember(1L);
        System.out.println("new member = " + member.getName());
        System.out.println("findMember = " + findMember.getName());
    }
}
```

* `ApplicationContext` 를 **스프링 컨테이너**라고 하고  모든 객체들을 관리해주면 된다고 생각하면 된다.

* 생성할 때는 new `AnnotationConfigApplicationContext` 만들고 파라미터로 `AppConfig.class`를 넣어주면 된다.

* 이 의미는 AppConfig에 있는 환경설정 정보들을 가지고 스프링이 @Bean에 등록한 메소드들을 모두 호출해서 스프링 컨테이너에 등록한다.

* 이렇게 스프링 컨테이너에 등록된 객체를 **스프링 빈**이라 한다.

* 스프링 빈은 `applicationContext.getBean()` 메소드를 사용해서 찾을 수 있다.

* applicationContext.getBean() 에서 첫번째 name은 @Bean에 등록한 메소드 이름인 `memberService`를, 두번째 반환 type인 `MemberService.class`를 넣어주면 된다.

* 기존에는 개발자가 직접 자바 코드로 모든 것을 했다면 이제부터는 스프링 컨테이너에 객체를 스프링 빈으로 등록하고, 스프링 컨테이너에 스프링 빈을 찾아서 사용하도록 변경되었다.

### OrderApp에 스프링 컨테이너 적용

```java
package hello.core;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemberService;
import hello.core.order.Order;
import hello.core.order.OrderService;

public class OrderApp {
    public static void main(String[] args) {

        // AppConfig appConfig = new AppConfig();
        // MemberService memberService = appConfig.memberService();
        // OrderService orderService = appConfig.orderService();

        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberService memberService = applicationContext.getBean("memberService", MemberService.class);
        OrderService orderService = applicationContext.getBean("orderService", OrderService.class);

        Long memberId = 1L;
        Member member = new Member(memberId, "MemberA", Grade.VIP);
        memberService.join(member);

        Order order = orderService.createOrder(memberId, "itemA", 20000);

        System.out.println("order = " + order);
    }
}
```

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)

