---
layout: post
title: " Spring 핵심원리 - 기본편 : 객체 지향 원리 적용 "
categories: Spring
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [스프링 핵심원리 기본편] 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [Spring 핵심원리 - 기본편 : 객체 지향 설계와 스프링](https://devfancy.github.io/Spring-Core-Principle-1/)

2. [Spring 핵심원리 - 기본편 : 객체 지향 원리 적용](https://devfancy.github.io/Spring-Core-Principle-2/)

3. [Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈](https://devfancy.github.io/Spring-Core-Principle-4/)

4. [Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회](https://devfancy.github.io/Spring-Core-Principle-4-2/)

5. [Spring 핵심원리 - 기본편 : 싱글톤 컨테이너](https://devfancy.github.io/Spring-Core-Principle-5/)

6. [Spring 핵심원리 - 기본편 : 컴포넌트 스캔](https://devfancy.github.io/Spring-Core-Principle-6/)

7. [Spring 핵심원리 - 기본편 : 의존관계 자동 주입](https://devfancy.github.io/Spring-Core-Principle-7/)

8. [Spring 핵심원리 - 기본편 : 빈 생명주기 콜백](https://devfancy.github.io/Spring-Core-Principle-8/)

9. [Spring 핵심원리 - 기본편 : 빈 스코프](https://devfancy.github.io/Spring-Core-Principle-9/)


## 객체 지향 원리 적용

객체의 생성과 연결은 `AppConfig`가 담당한다.

**새로운 구조와 할인 정책이 적용**된다고 가정해보자.

* 할인 정책을 정률% 할인 정책으로 변경해보자

* `FixDiscountPolicy` -> `RateDiscountPolicy`

`AppConfig`의 등장으로 애플리케이션이 크게 사용 영역과, 객체를 생성하고 구성(Configuration)하는 영역으로 분리되었다.

> 그림 - 사용, 구성의 분리

![](/assets/img/spring/spring-core-principle-section3-1.png)

> 그림 - 할인 정책의 변경

![](/assets/img/spring/spring-core-principle-section3-2.png)

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

* 그리고 `AppConfig`가 `RateDiscountPolicy` 객체 인스턴스를 클라이언트 코드(`OrderServiceImpl`)대신 생성해서 클라이언트 코드에 의해 의존관계를 주입했다.

* 이렇게 해서 DIP 원칙을 따르면서 문제를 해결했다.

> OCP 개방-폐쇄 원칙: 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.

* 애플리케이션을 사용 영역과 구성 영역으로 나눴다.

* `AppConfig`가 의존관계를 `FixDiscountPolicy` -> `RateDiscountPolicy` 로 변경해서 클라이언트 코드에 주입하므로 클라이언트 코드(`OrderServiceImpl`)는 변경하지 않아도 된다.

## IoC, DI, 그리고 컨테이너

### 제어의 역전 IoC(Inversion of Control)

* 구현 객체를 생성해주고 연결해주는 역할인 `AppConfig`가 등장하면서, `구현 객체`는 **자신의 로직을 실행하는 역할만 담당**한다.

* 프로젝트 제어 흐름에 대한 권한은 모두 `AppConfig`가 가져간다. 

    * 예를 들어 `OrderServiceImpl`은 필요한 인터페이스들을 호출하지만 어떤 구현 객체들을 실행할 지 모른다.

    * 심지어 `OrderServiceImpl`도 `AppConfig`가 생성한다.

    * 그리고 `AppConfig`는 `OrderServiceImpl`이 아닌 **OrderService 인터페이스의 다른 구현 객체를 생성하고 실행**할 수도 있다.

    * 그런 사실도 모른채 `OrderServiceImpl`는 묵묵히 자신의 로직을 실행할 뿐이다.

* 이렇듯 프로그램의 제어 흐름을 직접 제어하는 것이 아니라 `AppConfig` 처럼 **외부에서 관리하는 것을 `제어의 역전(IoC)`** 이라 한다.

### 의존관계 주입 DI(Dependency Injection)

* 위에 작성한 `OrderServiceImpl` 클래스는 `DiscountPolicy` 인터페이스에 의존하고, 실제 어떤 구현 객체가 사용될지 모른다.

* 의존관계는 **정적 클래스 의존 관계**와, **실행 시점에 결정되는 동적인 객체(인스턴스) 의존 관계** 둘을 분리해서 생각해야 한다.

#### 정적인 클래스 의존 관계

* 클래스가 사용하는 import 코드만 보고 의존관계를 쉽게 판단할 수 있듯이, `정적인 의존관계`는 애플리케이션을 실행하지 않아도 분석할 수 있다.

* 아래의 클래스 다이어그램을 보면

![](/assets/img/spring/spring-core-principle-section3-3.png)

* 화살표를 통해 알 수 있듯이 `OrderServiceImpl`은 `MemberRepository` , `DiscountPolicy` 에 의존한다는 것을 알 수 있다.

    * 그리고 자식 클래스인 `FixDiscountPolicy`와 `RateDisCountPolicy`가 `DiscountPolicy`를 의존(참조)하고 있다.

    * 인터페이스인 `DiscountPolicy`는 어디에도 의존하지 않고 있다. (Member 클래스 정도만 의존하고 있다)

    * 이렇듯 화살표 방향을 통해 의존 관계를 확인할 수 있다.

* 아래 `DiscountPolicy`인터페이스와 자식 클래스를 통해 확인할 수 있다.

> DiscountPolicy.class

```java
package hello.core.discount;

import hello.core.member.Member;

public interface DiscountPolicy {

    /**
     * @return 할인 대상 금액
     */

    int discount(Member member, int price);

}
```

> FixDiscountPolicy.class

```java
package hello.core.discount;

import hello.core.member.Grade;
import hello.core.member.Member;

public class FixDiscountPolicy implements DiscountPolicy{

    private int discountFixAmount = 1000; // 1000원 할인

    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP) {
            return discountFixAmount;
        } else {
            return 0;
        }
    }
}
```

> RateDiscountPolicy.class

```java
package hello.core.discount;

import hello.core.member.Grade;
import hello.core.member.Member;

public class RateDiscountPolicy implements DiscountPolicy{

    private int discountPercent = 10;
    
    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP) {
            return price * discountPercent / 100;
        } else {
            return 0;
        }
    }
}
```

* 그런데 여기서 이러한 클래스 의존관계 만으로는 **실제 어떤 객체가 `OrderServiceImpl`에 주입 될지 알 수 없다.**

#### 동적인 객체 인스턴스 의존 관계

* `동적인 객체 인스턴스 의존 관계`는 **애플리케이션 실행 시점**에 실제 생성된 객체 인스턴스의 참조가 연결된 의존 관계다.

* 아래 객체 다이어그램을 보면

![](/assets/img/spring/spring-core-principle-section3-4.png)

* 애플리케이션 **실행 시점(런타임)** 에 외부에서 실제 구현 객체를 생성하고 클라이언트에 전달해서 클라이언트와 서버의 실제 의존관계가 연결 되는 것을 `의존관계 주입`이라 한다.

* 객체 인스턴스를 생성하고, 그 참조값을 전달해서 연결된다.

* 의존관계 주입을 사용하면 클라이언트 코드를 변경하지 않고, **클라이언트가 호출하는 대상의 `타입 인스턴스`를 변경할 수 있다.**

    * 즉, `AppConfig` 클래스에서 정액 할인 정책인 `FixDiscountPolicy` 클래스를 정률 할인 정책인 `RateDiscountPolicy` 클래스로 바꿀 수 있다는 의미이다.

* 의존관계 주입을 사용하면 정적인 클래스 의존관계를 변경하지 않고, **동적인 객체 인스턴스 의존관계를 쉽게 변경 할 수 있다.**

    * 정적인 클래스 의존 관계를 손대지 않고, 구현체 클래스인 정액 할인 정책를 할지, 정률 할인 정책을 할지에 대해 `주문 서비스 구현체`(OrderServiceImpl)에서 의존관계를 변경할 수 있다는 의미이다.

### IoC 컨테이너, DI 컨테이너

* `AppConfig` 처럼 객체를 생성하고 관리하면서 의존관계를 연결해 주는 것을 `IoC 컨테이너` 또는 **`DI 컨테이너`** 라 한다.

* 의존관계 주입에 초점을 맞추어 최근에는 주로 **DI 컨테이너**라 부르고, 다른 말로는 어셈블러, 오브젝트 팩토리 등으로 불리기도 한다.

## 스프링 컨테이너

* 지금까지 순수한 자바 코드로만 DI를 적용했으니 이제 스프링을 사용해보자.

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

