---
layout: post
title: " Spring 핵심원리 - 기본편 : 의존관계 자동 주입 "
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


## 다양한 의존관계 주입 방법

* 가장 많이 쓰이는 방법은 **생성자 주입** 이다.

### 생성자 주입

* 이름 그대로 생성자를 통해서 의존 관계를 주입 받는 방법이다. 지금까지 진행했던 방법이 바로 생성자 주입이다.

#### 특징

* 생성자 호출시점에 딱 1번만 호출되는 것이 보장된다.

* **불변, 필수** 의존관계에 사용한다.

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

* 위의 예시처럼 `memberRepository`, `discountPolicy`는 값이 무조건 있어야하기 때문에 this를 사용해야한다.

* **중요** : 생성자(`OrderServiceImpl`)가 딱 1개만 있다면` @Autowired`를 생략해도 자동 주입 된다. (스프링 빈에만 해당한다)

### 수정자 주입(setter 주입)

* setter라 불리는 필드의 값을 변경하는 수정자 메서드를 통해서 의존관계를 주입하는 방법이다.

#### 특징

* **선택, 변경** 가능성이 있는 의존관계에 사용한다.

* 자바빈 프로퍼티 규약의 수정자 메서드 방식을 사용하는 방법이다.

```java
@Component
  public class OrderServiceImpl implements OrderService {
      private MemberRepository memberRepository;
      private DiscountPolicy discountPolicy;
    @Autowired
    public void setMemberRepository(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
    @Autowired
    public void setDiscountPolicy(DiscountPolicy discountPolicy) {
        this.discountPolicy = discountPolicy;
    }
}
```

* 참고 :  `@Autowired` 의 기본 동작은 주입할 대상이 없으면 오류가 발생한다. 주입할 대상이 없어도 동작하게 하려면 `@Autowired(required = false)` 로 지정하면 된다.

### 필드 주입

* 이름 그대로 필드에 바로 주입하는 방법이다.

#### 특징

* 코드가 간결해서 많은 개발자들을 유혹하지만 외부에서 변경이 불가능해서 **테스트 하기 힘들다**는 치명적인 단점이 있다.

* DI 프레임워크가 없으면 아무것도 할 수 없다.

* 사용하지 말자!

### 일반 메서드 주입

* 일반 메서드를 통해서 주입 받을 수 있다.

#### 특징

* 한번에 여러 필드를 주입 받을 수 있다.

* 일반적으로 잘 사용하지 않는다.

* 참고 : 의존관계 자동 주입은 **스프링 컨테이너가 관리하는 스프링 빈**이어야 동작한다. 스프링 빈이 아닌 `Member` 같은 클래스에서 `@Autowired` 코드를 적용해도 아무 기능도 동작하지 않는다.

## 옵션 처리

* 주입할 스프링 빈이 없어도 동작해야 할 때가 있다.

* 그런데 `@Autowired` 만 사용하면 `required` 옵션의 기본값이 `true` 로 되어 있어서 자동 주입 대상이 없으면 오류가 발생한다.

* 자동 주입 대상을 옵션으로 처리하는 방법은 다음과 같다.

    * `@Autowired(required=false)` : 자동 주입할 대상이 없으면 수정자 메서드 자체가 호출 안됨 

    * `org.springframework.lang.@Nullable` : 자동 주입할 대상이 없으면 null이 입력된다.

    * `Optional<>` : 자동 주입할 대상이 없으면 `Optional.empty` 가 입력된다.

```java
static class TestBean{
    // 호출 안됨 - 의존관계가 없으면 메서드 자체가 호출이 안된다.
    @Autowired(required = false)
    public void setNoBean1(Member noBean1) {
        System.out.println("noBean1 = " + noBean1);
    }
    // 호출은 되나, 의존관계가 없으면 null이 입력된다.
    @Autowired
    public void setNoBean2(@Nullable Member noBean2) {
        System.out.println("noBean2 = " + noBean2);
    }
    // 호출은 되나, 의존관계가 없으면 Optional.empty 가 입력된다.
    @Autowired
    public void setNoBean3(Optional<Member> noBean3) {
        System.out.println("noBean3 = " + noBean3);
    }
}
```

* **Member는 스프링 빈이 아니다.**

* `setNoBean1()` 은 `@Autowired(required=false)` 이므로 호출 자체가 안된다.

## 생성자 주입을 선택해라!

* 최근에는 스프링을 포함한 DI 프레임워크 대부분이 `생성자 주입`을 권장한다.

* **불변** - 생성자 주입은 객체를 생성할 때 딱 1번만 호출되므로 이후에 호출되는 일이 없다. 따라서 불변하게 설계할 수 있다.

* **누락**을 막을 수 있다.

* 오직 생성자 주입 방식만 `final` 키워드를 사용할 수 있다.  `final` 키워드를 사용하면 생성자에서 혹시라도 값이 설정되지 않는 오류를 컴파일 시점에 막아준다.

```java
@Component
public class OrderServiceImpl implements OrderService{

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
}
```

* 항상 생성자 주입을 선택하고, 가끔 옵션이 필요하면 수정자 주입을 선택한다.

## 롬복과 최신트랜드

* 개발을 하다보면 99% 불변이고, 생성자에 final 키워드를 사용하게 된다.

* 생성자 주입보다 편리하게 사용하는 방법은 `롬복(Lombok)`이다.

**기본 코드**

```java
@Component
public class OrderServiceImpl implements OrderService {
    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;
    
    @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
}
```

* 생성자가 딱 1개만 있으면 `Autowired` 를 생략할 수 있다. -> 밑의 예시

```java
@Component
public class OrderServiceImpl implements OrderService {
    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;
    
    // @Autowired 생략
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
}
```

* 여기서 롬복 라이브러리를 적용해보자.

### 롬복 라이브러리 적용 방법

* `build.gradle`에 라리브러리 및 환경을 추가한다.

```text
plugins {
      id 'org.springframework.boot' version '2.3.2.RELEASE'
      id 'io.spring.dependency-management' version '1.0.9.RELEASE'
      id 'java'
}

group = 'hello'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

//lombok 설정 추가 시작
configurations {
    compileOnly {
        extendsFrom annotationProcessor
    } 
}
//lombok 설정 추가 끝


repositories {
    mavenCentral()
}
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
    
    //lombok 라이브러리 추가 시작
    compileOnly 'org.projectlombok:lombok' 
    annotationProcessor 'org.projectlombok:lombok'
    
    testCompileOnly 'org.projectlombok:lombok' 
    testAnnotationProcessor 'org.projectlombok:lombok'
    //lombok 라이브러리 추가 끝
 
    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }   
}
    test {
        useJUnitPlatform()
    }
}
```

1. Preferences(윈도우 File -> Settings) -> plugin -> lombok 검색 설치 실행 (재시작)

2. Preferences -> Annotation Processors 검색 -> Enable annotation processing 체크 (재시작)

3. 임의의 테스트 클래스를 만들고 @Getter, @Setter 확인

**최종 결과 코드**

```java
@Component
  @RequiredArgsConstructor
  public class OrderServiceImpl implements OrderService {
      private final MemberRepository memberRepository;
      private final DiscountPolicy discountPolicy;
}
```

* 롬복 라이브러리가 제공하는 `@RequiredArgsConstructor` 기능을 사용하면 final이 붙은 필드를 모아서 생성자를 자동으로 만들어준다.

* 코드에서 보이지 않지만 실제로는 호출이 가능하다. (확인 방법 : (Mac기준) cmd + F12 -> `OrderServiceImpl` 생성자를 확인할 수 있다.)

* **(정리) 최신 트랜드**

  * 최근에는 생성자를 딱 1개 두고, `@Autowired`를 생략하는 방법을 주로 사용한다.

  * 여기에 Lombok 라이브러리의 `@RequiredArgsConstructor` 함께 사용하면 기능은 다 제공하면서, 코드는 깔끔하게 사용할 수 있다. (생성자 자동 생성)

## 자동, 수동의 올바른 실무 운영 기준

* 편리한 자동 기능을 기본으로 사용하자 - 자동 빈 등록을 사용해도 OCP, DIP를 지킬 수 있다.

* 수동 빈 등록은 애플리케이션에 광범위하게 영향을 미치지는 **기술 지원 객체**인 경우 사용하자.

  * 애플리케이션은 크게 업무 로직과 기술 지원 로직으로 나눌 수 있다.

    * **업무 로직 빈** : 웹을 지원하는 컨트롤러, 핵심 비즈니스 로직이 있는 서비스, 데이터 계층의 로직을 처리하는 레포지토리 등이 업무 로직에 속한다. 
                      보통 비즈니스 요구사항을 개발할 때 추가되거나 변경된다.
    * **기술 지원 빈** : 기술적인 문제나 공통 관심사(AOP)를 처리할 때 주로 사용된다. 
                      데이터베이스 연결이나 공통 로그 처리와 같이 업루 로직을 지원하기 위한 하부 기술이나 공통 기술들이다.

  * 업무 로직은 숫자도 매우 많고, 유사한 패턴이 있으므로 자동 기능을 적극 사용한다. 반면에 기술 지원 로직은 업무 로직에 비해 숫자가 매우 적고, 보통 **애플리케이션 전반에 걸쳐서 광범위하게 영향을 미치기 때문에**, 가급적 **수동 빈 등록**을 사용해서 명확하게 드러내는 것이 좋다.

* 비즈니스 로직 중에서 다형성을 적극 활용할 때 딱 보고 이해가 되기 위해서는 수동 빈으로 등록해서 명확하게 드러내는 것이 좋다.



## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
