---
layout: post
title: " Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회 "
categories: Spring
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [Spring 핵심원리 - 기본편 : 객체 지향 설계와 스프링](https://fancy96.github.io/Spring-Core-Principle-1/)

2. [Spring 핵심원리 - 기본편 : 스프링으로 전환하기](https://fancy96.github.io/Spring-Core-Principle-2/)

3. [Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈](https://fancy96.github.io/Spring-Core-Principle-4/)

4. [Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회](https://fancy96.github.io/Spring-Core-Principle-4-2/)

5. [Spring 핵심원리 - 기본편 : 싱글톤 컨테이너](https://fancy96.github.io/Spring-Core-Principle-5/)

6. [Spring 핵심원리 - 기본편 : 컴포넌트 스캔](https://fancy96.github.io/Spring-Core-Principle-6/)

7. [Spring 핵심원리 - 기본편 : 의존관계 자동 주입](https://fancy96.github.io/Spring-Core-Principle-7/)

8. [Spring 핵심원리 - 기본편 : 빈 생명주기 콜백](https://fancy96.github.io/Spring-Core-Principle-8/)

9. [Spring 핵심원리 - 기본편 : 빈 스코프](https://fancy96.github.io/Spring-Core-Principle-9/)

* 스프링 컨테이너에 실제 스프링 빈들이 잘 등록되었는지 테스트코드에서 확인해보자.

## 컨테이너에 등록된 모든 빈 조회

### ApplicationContextInfoTest 클래스

#### 모든 빈 조회 (출력하기)

```java
package hello.core.beanfind;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.AppConfig;

class ApplicationContextInfoTest {

    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

    @Test
    @DisplayName("모든 빈 출력하기")
    void finaAllBean() {
        String[] beanDefinitionNames = ac.getBeanDefinitionNames();
        for (String beanDefinitionName : beanDefinitionNames) {
            Object bean = ac.getBean(beanDefinitionName);
            System.out.println("name = " + beanDefinitionName + " object = " + bean);
        }
    }
}
```

* 실행하면 스프링에 등록된 모든 빈 정보를 출력할 수 있다.

* `ac.getBeanDefinitionNames()` : 스프링에 등록된 모든 빈 이름을 조회한다.

* `ac.getBean()` : 빈 이름으로 빈 객체(인스턴스)를 조회한다.

* 참고1) `ac.getBean(beanDefinitionName)`에서 `option + enter` 또는 `option + cmd + v` 누르면 자동으로 변수가 생성된다.

* 참고2) `soutv` 를 입력하면 자동으로 System.out.println과 변수명이 생성된다.


#### 애플리케이션 빈 조회(출력하기)

* 하지만 위에 있는 출력은 스프링 내부에 있는 빈 정보들까지 모두 출력하므로, 내가 등록한 빈만 출력하려면 추가로 입력하는 부분이 있다.

```java
package hello.core.beanfind;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.AppConfig;

class ApplicationContextInfoTest {
    @Test
    @DisplayName("애플리케이션 빈 출력하기")
    void finaApplicationBean() {
        String[] beanDefinitionNames = ac.getBeanDefinitionNames();
        for (String beanDefinitionName : beanDefinitionNames) {
            BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionName);

            //Role ROLE_APPLICATION: 직접 등록한 애플리케이션 빈
            //Role ROLE_INFRASTRUCTURE: 스프링이 내부에서 사용하는 빈
            if (beanDefinition.getRole() == BeanDefinition.ROLE_APPLICATION) {
                Object bean = ac.getBean(beanDefinitionName);
                System.out.println("name = " + beanDefinitionName + " object = " + bean);
            }
        }
    }
}
```

* 스프링 내부에서 사용하는 빈은 `getRole()`로 구분할 수 있다.

    * `ROLE_APPLICATION` : **일반적으로 사용자가 정의한 빈**

    * `ROLE_INFRASTRUCTURE` : 스프링이 내부에서 사용하는 빈


## 스프링 빈 조회 - 기본

### ApplicationContextBasicFindTest 클래스

* 스프링 컨테이너에서 스프링 빈을 찾는 가장 기본적인 조회 방법

    * `ac.getBean(빈이름, 타입)` 또는 `ac.getBean(타입)`

* 조회 대상 스프링 빈이 없으면 다음과 같은 예외가 발생한다.

    * `NoSuchBeanDefinitionException: No bean named 'xxxxx' available`

```java
package hello.core.beanfind;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import hello.core.AppConfig;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;

public class ApplicationContextBasicFindTest {

    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
    
    @Test
    @DisplayName("빈 이름과 타입으로 조회")
    void findBeanByName() {
        MemberService memberService = ac.getBean("memberService", MemberService.class);
        //System.out.println("memberService = " + memberService);
        //System.out.println("memberService.getClass() = " + memberService.getClass());
        assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
    }

    @Test
    @DisplayName("이름 없이 타입으로만 조회")
    void findBeanByType() {
        MemberService memberService = ac.getBean(MemberService.class);
        assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
    }

    @Test
    @DisplayName("구체 타입 조회")
    void findBeanByName2() {
        MemberService memberService = ac.getBean("memberService", MemberServiceImpl.class);
        assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
    }

    @Test
    @DisplayName("빈 이름으로 조회X")
    void findBeanByNameX() {
        //ac.getBean("xxxxx", MemberService.class);
        // 오른쪽에 있는 로직이 실행하면 왼쪽에 있는 예외가 터지면 성공, 아니면 실패
        assertThrows(NoSuchBeanDefinitionException.class,
            () -> ac.getBean("xxxxx", MemberService.class));
    }
}
```

* 검증은 `Assertions`을 사용하고, `Assertions`는 `org.assertJ.core.api`를 사용한다.

    * assertThat : 검증할 때 쓰는 메소드

* 구체 타입 조회는 타입으로 반환형인 `MemberServiceImpl.class`로 조회를 한다. 하지만 역할과 구현을 구분해야하고 역할에 의존해야하므로 구체 타입 조회는 안쓰는 것이 좋다.

* 중요) 항상 테스트는 **실패 테스트**를 만들어야 한다. 그러기 위해서는 `Assertions`을 사용하고, `Assertions`는 `org.junit.jupiter.api`를 사용한다.

    * assertThrows : 실패할 때 쓰는 메소드로, 예외가 터질 때 테스트가 성공이 나온다.
  
    * 오른쪽에 있는 `() -> ac.getBean("xxxxx", MemberService.class)`이 실행을 하면, 왼쪽에 있는 `NoSuchBeanDefinitionException.class` 예외가 터진다는 의미이다.
  
    * 참고) Assertions를 static import(축약)를 하려면 `option + enter`를 눌러서 `Add on-demand static import`를 선택하면 된다.


## 스프링 빈 조회 - 동일한 타입 둘 이상

### ApplicationContextSameBeanFindTest 클래스

```java
package hello.core.beanfind;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.NoUniqueBeanDefinitionException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hello.core.member.MemberRepository;
import hello.core.member.MemoryMemberRepository;

public class ApplicationContextSameBeanFindTest {

    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(SameBeanConfig.class);

    @Test
    @DisplayName("타입으로 조회시 같은 타입으로 둘 이상 있으면, 중복 오류가 발생한다")
    void findBeanByTypeDuplicate() {
        assertThrows(NoUniqueBeanDefinitionException.class,
            () -> ac.getBean(MemberRepository.class));
    }
    
    @Test
    @DisplayName("타입으로 조회시 같은 타입이 둘 이상 있으면, 빈 이름을 지정하면 된다.")
    void findBeanByName() {
        MemberRepository memberRepository = ac.getBean("memberRepository1", MemberRepository.class);
        assertThat(memberRepository).isInstanceOf(MemberRepository.class);
    }

    @Test
    @DisplayName("특정 타입을 모두 조회하기")
    void findAllBeanByType() {
        Map<String, MemberRepository> beansOfType = ac.getBeansOfType(MemberRepository.class);
        for (String key : beansOfType.keySet()) {
            System.out.println("key = " + key + " value = " + beansOfType.get(key));
        }
        System.out.println("beansOfType = " + beansOfType);
        assertThat(beansOfType.size()).isEqualTo(2);

    }

    @Configuration
    static class SameBeanConfig {

        @Bean
        public MemberRepository memberRepository1() {
            return new MemoryMemberRepository();
        }

        @Bean
        public MemberRepository memberRepository2() {
            return new MemoryMemberRepository();
        }
    }
}
```

* 특정 타입을 모두 조회하려면 `ac.getBeansOfType()` 을 사용하면 된다.

## 스프링 빈 조회 - 상속 관계

* **상속 관계는 중요하다.**

* 스프링 빈은 부모 타입으로 조회하면, 자식 타입도 함께 조회된다.

* 참고로 스프링의 최상위 부모 `Object` 타입을 조회하면, 모든 스프링 빈을 조회하게 된다. 

![](/assets/img/spring/spring-core-principle-4-2-1.md.png)

### ApplicationContextExtendsFindTest 클래스

```java
package hello.core.beanfind;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.NoUniqueBeanDefinitionException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.discount.RateDiscountPolicy;

public class ApplicationContextExtendsFindTest {

    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);

    @Test
    @DisplayName("부모 타입으로 조회시, 자식이 둘 이상 있으면, 중복 오류가 발생한다")
    void findBeanByParentTypeDuplicate() {
        assertThrows(NoUniqueBeanDefinitionException.class,
            () -> ac.getBean(DiscountPolicy.class));
    }

    @Test
    @DisplayName("부모 타입으로 조회시, 자식이 둘 이상 있으면, 빈 이름을 지정하면 된다")
    void findBeanByParentTypeBeanName() {
        DiscountPolicy rateDiscountPolicy = ac.getBean("rateDiscountPolicy", DiscountPolicy.class);
        assertThat(rateDiscountPolicy).isInstanceOf(RateDiscountPolicy.class);
    }

    @Test
    @DisplayName("특정 하위 타입으로 조회")
    void findBeanBySubType() {
        RateDiscountPolicy bean = ac.getBean(RateDiscountPolicy.class);
        assertThat(bean).isInstanceOf(RateDiscountPolicy.class);
    }

    @Test
    @DisplayName("부모 타입으로 모두 조회하기")
    void finaAllBeanByParentType() {
        Map<String, DiscountPolicy> beansOfType = ac.getBeansOfType(DiscountPolicy.class);
        assertThat(beansOfType.size()).isEqualTo(2);
        for (String key : beansOfType.keySet()) {
            System.out.println(" key =  " + key + "value = " + beansOfType.get(key));
        }
    }

    @Test
    @DisplayName("부모 타입으로 모두 조회하기 - Object")
    void finaAllBeanByObjectType() {
      Map<String, Object> beansOfType = ac.getBeansOfType(Object.class);
      for (String key : beansOfType.keySet()) {
        System.out.println(" key =  " + key + "value = " + beansOfType.get(key));
      }
    }
    
    @Configuration
    static class TestConfig {
        @Bean
        public DiscountPolicy rateDiscountPolicy() {
            return new RateDiscountPolicy();
        }

        @Bean
        public DiscountPolicy fixDiscountPolicy() {
            return new FixDiscountPolicy();
        }
    }
}
```

* 특정 하위 타입으로 조회하는 것보다 빈 이름을 지정해주는 것이 더 좋다.

* 부모 타입으로 모두 조회하는 경우 `ac.getBeansOfType()` 을 사용하면 된다.

    * (실무)실제 테스트 케이스에서는 출력문을 사용하면 안된다. (시스템이 자동으로 통과하는지 안하는지 스스로 결정하기 때문이다) 

  
## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)

