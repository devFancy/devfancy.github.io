---
layout: post
title: " Spring 핵심원리 - 기본편 : 싱글톤 컨테이너 "
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


## 웹 어플리케이션과 싱글톤

* 스프링이 없던 순수한 DI컨테이너인 AppConfig은 요청을 할 때마다 객체를 새로 생성해서 메모리 낭비가 심했다.

* 따라서 그에 대한 해결방안으로 싱글톤 패턴이 나오게 되었다.

## 싱글톤 패턴

* 싱글톤 패턴은 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴이다.

* 싱글톤 패턴을 적용하면, **이미 만들어진 객체를 공유**해서 효율적으로 사용할 수 있다.

* 하지만 싱글톤 패턴은 다음과 같은 수 많은 문제점들을 가지고 있다.

* **싱글톤 패턴 문제점**

```text
싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다.
의존관계상 클라이언트가 구체 클래스에 의존한다. DIP를 위반한다.
클라이언트가 구체 클래스에 의존해서 OCP 원칙을 위반할 가능성이 높다.
유연성이 떨어져 테스트하기 어렵다.
내부 속성을 변경하거나 초기화 하기 어렵다.
private 생성자로 자식 클래스를 만들기 어렵다.
```

## 싱글톤 컨테이너

* **스프링 컨테이너**는 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다.

* 즉, **스프링 빈이 바로 싱글톤으로 관리되는 빈이다**.

### 싱글톤 컨테이너 개념

* 싱글톤 패턴을 적용하지 않아도 스프링 컨테이너는 객체 인스턴스를 싱글톤으로 관리한다.

* 스프링 컨테이너는 싱글톤 컨테이너 역할을 한다. 이렇게 싱글톤 객체를 생성하고 관리하는 기능을 **싱글톤 레지스트리**리라 한다.

* 스프링 컨테이너의 이런 기능 덕분에 앞서 싱글톤 패턴의 문제점을 모두 해결하면서 객체를 싱글톤으로 유지할 수 있다.

    * 싱글톤 패턴을 위한 지저분한 코드가 들어가지 않아도 된다.

    * DIP, OCP, 테스트, private 생성자로부터 자유롭게 싱글톤을 사용할 수 있다.

### 스프링 컨테이너를 사용한 테스트 코드 - SingletonTest.java

```java
package hello.core.singleton;

import static org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.AppConfig;
import hello.core.member.MemberService;
public class SingletonTest {
    @Test
    @DisplayName("스프링 컨테이너와 싱글톤")
    
    void springContainer() {
        
        //AppConfig appConfig = new AppConfig();
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
    
        //1. 조회: 호출할 때마다 객체를 생성
        MemberService memberService1 = ac.getBean("memberService", MemberService.class);
        //2. 조회: 호출할 때마다 객체를 생성
        MemberService memberService2 = ac.getBean("memberService", MemberService.class);
    
        //참조값이 다른 것을 확인
        System.out.println("memberService1 = " + memberService1);
        System.out.println("memberService2 = " + memberService2);
    
        // memberService1 != memberService2
        assertThat(memberService1).isSameAs(memberService2);
    }
}
```

### 정리

* 스프링 컨테이너 덕분에 싱글톤 컨테이너를 적용하여 이미 만들어진 객체를 공유해서 효율적으로 재사용할 수 있다.

![](/assets/img/spring/spring-core-principle-5-1.png)

## 싱글톤 방식의 주의점

* 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 **유지하게 설계하면 안된다**.

* 무상태(stateless)로 설계해야 한다.

    * 특정 클라이언트에 **의존적인 필드** 혹은 **값을 변경할 수 있는 필드**가 있으면 안된다. -> `this` X

    * 가급적 **읽기**만 가능해야 한다. (수정 X)

    * 필드 대신에 자바에서 공유하지 않는 **지역변수**, 파라미터, ThreadLocal 등을 사용해야 한다.

### 싱글톤 객체 상태를 무상태로 설계하는 예시(유지 -> 무상태)

#### StatefulService.java 

```java
package hello.core.singleton;

public class StatefulService {

    // private int price; // 상태를 유지하는 필드: 10000 -> 20000

    public int order(String name, int price) {
        System.out.println("name +  = " + name + " price = " + price);
        //this.price = price; // 여기가 문제!
        return price;
    }

}
```

#### StatefulServiceTest.java

```java
package hello.core.singleton;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

class StatefulServiceTest {

    @Test
    void statefulServiceSingleton() {
        ApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);
        StatefulService statefulService1 = ac.getBean(StatefulService.class);
        StatefulService statefulService2 = ac.getBean(StatefulService.class);

        // ThreadA : A사용자 10000원 주문
        int userAPrice = statefulService1.order("userA", 10000);
        // ThreadB : B사용자 20000원 주문
        int userBPrice = statefulService2.order("userB", 20000);

        // ThreadA : 사용자A 주문 금액 조회
        //int price = statefulService1.getPrice();

        //assertThat(statefulService1.getPrice()).isEqualTo(20000);
    }

    static class TestConfig {

        @Bean
        public StatefulService statefulService() {
            return new StatefulService();
        }
    }
}
```

* ThreadA가 사용자A 코드를 호출하고 ThreadB가 사용자B 코드를 호출한다고 가정했을 때

* `StatefulService`의 `price`필드가 this로 주게 되면 특정 클라이언트에 값을 변경할 수 있는 필드가 된다.

* 따라서 공유 필드를 없애고 반환하는 타입을 넣어준다 (int형)

* 실무에서도 이런 경우를 종종 본다고 한다.

## @Configuration과 바이트코드 조작의 마법

* 스프링은 클래스의 바이트코드를 조작하는 라이브러리를 사용한다.

### ConfigurationSingletonTest.java

```java
// 앞에 코드 생략
public class ConfigurationSingletonTest {
  @Test
  void configurationDeep() {
    ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
    AppConfig bean = ac.getBean(AppConfig.class);

    System.out.println("bean = " + bean.getClass()); // class 타입 출력
  }
}
```

* `AnnotationConfigApplicationContext`에 파라미터로 넘긴 값은 스프링 빈으로 등록된다.

* 그래서 `AppConfig` 도 스프링 빈이 된다.

* 하지만 `AppConfig` 스프링 빈을 조회해서 클래스 정보를 출력하면 클래스 명에 xxxCGLIB가 붙으면서 상당히 복잡해 진것을 볼 수 있다.

```text
bean = class hello.core.AppConfig$$EnhancerBySpringCGLIB$$c329221c
```

* 이것은 내가 만든 클래스가 아니라 스프링이 CGLIB라는 **바이트코드 조작 라이브러리**를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한 것이다.

* 그림으로 보면 다음과 같다.

![](/assets/img/spring/spring-core-principle-5-2.png)

* 그 임의의 다른 클래스인 `AppConfig@CGLIB`가 싱글톤이 보장되도록 해준다. 

    * `@Bean`이 붙은 메소드마다 이미 스프링 빈이 존재하면 존재하는 빈을 반환하고, 그게 아니라면(스프링 빈이 없다면) 생성해서 스프링 빈으로 등록하고 반환하는 코드가 동적으로 만들어진다.

    * 단, **`@Configuration`을 적용해야만 싱글톤을 보장**한다.


## Review

* 오늘은 스프링의 싱글톤에 대해서 개념이 무엇이고, 어떤 역할을 하는지, 주의해야할 사항은 무엇인지에 대해 배웠다.

* 그리고 싱글톤을 보장하려면 스프링 설정 정보에 항상 `@Configuration`을 사용해야 한다는 점을 배웠다.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)

