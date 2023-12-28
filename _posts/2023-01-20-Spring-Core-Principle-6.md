---
layout: post
title: " Spring 핵심원리 - 기본편 : 컴포넌트 스캔 "
categories: Spring
author: devfancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

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

## 컴포넌트 스캔과 의존관계 자동 주입 시작하기

* 지금까지 스프링 빈을 등록할 때는 자바 코드의 @Bean을 통해서 설정 정보에 직접 등록할 스프링 빈을 나열했다면, 이번에는 **자동으로 스프링 빈을 등록하는 `컴포넌트 스캔`** 에 대해서 알아보자.

* 코드로 컴포넌트 스캔과 의존관계 자동 주입을 알아보자.

> 기존 `AppConfig.java`는 과거 코드와 테스트를 유지하기 위해 남겨두고 새로운 `AutoAppConfig.java`를 만들었다.

### @ComponentScan - 컴포넌트 스캔

#### AutoAppConfig.java

```java
package hello.core;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;

@Configuration
@ComponentScan (
        excludeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Configuration.class)
)
public class AutoAppConfig {
}
```
* 컴포넌트 스캔을 사용하기 위해서는 `@ComponentScan` 을 설정 정보에 입력하면 된다.

* 여기서 `excludeFilters`는 사용한 이유는 앞서 `AppConfig.java`에서 만든 설정 정보들과 등록이 겹치기 때문이다. 

* 따라서 겹치지 않기 위해 `excludeFilters` 사용하여 컴포넌트 스캔 대상에서 제외하는 방법으로 설정했다.

* 이제 각 클래스가 컴포넌트 스캔의 대상이 되도록 `@Component` 애노테이션을 붙여주면 된다.

    * MemoryMemberRepository @Component 추가

    * RateDiscountPolicy @Component 추가

### @Autowired - 의존관계 자동 주입

#### MemberServiceImpl.java - @Component, @Autowired 추가

```java
@Component
  public class MemberServiceImpl implements MemberService {
      private final MemberRepository memberRepository;
      @Autowired
      public MemberServiceImpl(MemberRepository memberRepository) {
          this.memberRepository = memberRepository;
      }
}
```

* `@Autowired` 는 의존관계를 자동으로 주입해준다.

* 그리고 `@Autowired` 를 사용하면 생성자에서 여러 의존관계도 한번에 주입받을 수 있다.

#### OrderServiceImpl - @Component, @Autowired 추가

```java
@Component
  public class OrderServiceImpl implements OrderService {
      private final MemberRepository memberRepository;
      private final DiscountPolicy discountPolicy;
@Autowired
      public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy
  discountPolicy) {
          this.memberRepository = memberRepository;
          this.discountPolicy = discountPolicy;
      }
}
```

* 자세한 규칙에 대해서는 **의존관계 자동 주입** 에 대한 페이지에서 설명할 예정이다.

## 탐색 위치와 기본 스캔 대상

### 탐색할 패키지의 시작 위치 지정

* 모든 자바 클래스를 다 컴포넌트에 스캔하면 시간이 오래 걸리기 때문에 **필요한 위치부터 탐색하도록 시작 위치를 지정**할 수 있다.

```text
 @ComponentScan(
          basePackages = "hello.core",
}
```

* `backPackages` : 탐색할 패키지의 시작 위치를 지정한다.

* 해석하자면, "hello.core" 패키지를 포함해서 하위 패키지를 모두 탐색한다는 의미이다.

    * `basePackages = {"hello.core", "hello.service"}` 처럼 여러 시작 위치를 지정할 수도 있다.

```text
@ComponentScan(
          basePackageClasses = AutoAppConfig.class,
}
```

* `basePackageClasses` : 지정한 클래스의 패키지를 탐색 시작 위치로 지정한다.

* 패키지의 시작 위치를 지정하지 않으면 `@ComponentScan`이 붙은 설정 정보 클래스의 패키지가 시작 위치가 된다.

> **권장하는 방법**은 패키지의 위치를 지정하지 않고, 설정 정보 클래스의 위치를 **프로젝트 최상단**에 두는 것이다. 스프링 부트도 이 방법을 기본으로 제공한다.

* 예를 들어 프로젝트가 다음과 같은 구조로 되어 있으면

    * `com.hello`
    
    * `com.hello.service`

    * `com.hello.repository`

* `com.hello` 를 프로젝트 시작 루트로 하고, 여기에 AppConfig와 같은 메인 설정 정보를 두고, @ComponentScan 애노테이션을 붙이고, `basePackages` 지정은 생략한다.

* 그러면 `com.hello` 를 포함한 하위 패키지 모두 자동으로 컴포넌트 스캔의 대상이 된다.

### 컴포넌트 스캔 기본 대상

* 컴포넌트 스캔은 `Component` 뿐만 아니라 다음과 같은 내용도 추가로 대상에 포함한다.

    * `@Contoller` : 스프링 MVC 컨트롤러에서 사용

    * `@Service` : 스프링 비즈니스 로직에서 사용

    * `@Repository` : 스프링 데이터 접근 계층에서 사용

    * `@Configuration` : 스프링 설정 정보에서 사용


## 필터

* `includeFilters` : 컴포넌트 스캔 대상을 추가로 지정한다.

* `excluderFilters` : 컴포넌트 스캔에서 제외할 대상을 지정한다.

## 중복 등록과 충돌

* 컴포넌트 스캔에서 같은 빈 이름을 등록하는 두가지 상황이 있다. 결론적으로 둘다 오류가 발생한다.

1. 자동 빈 등록 vs 자동 빈 등록 -> 같은 경우 스프링은 `ConflictingBeanDefinitionException` 와 같은 예외를 발생시킨다.

2. 수동 빈 등록 vs 자동 빈 등록 -> 같은 경우 수동 빈 등록이 우선권을 가지면서 자동 빈을 오버라이딩 해버린다.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
