---
layout: post
title: " Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈 "
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

## 스프링 컨테이너 생성

* 스프링 컨테이너가 생성되는 과정을 알아보자

``` java
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```

* `ApplcationContext` 를 스프링 컨테이너라고 하며 인터페이스이다.

* 스프링 컨테이너는 애노테이션 기반의 자바 설정 클래스로 만들 수 있다. (XML 기반으로 만들 수 있지만, 요즘에는 사용하지 않는다)

* `new AnnotationConfigApplicationContext(AppConfig.class);` 이 클래스는 `ApplcationContext` 인터페이스의 구현체이다.


## 스프링 컨테이너의 생성 과정

### 1. 스프링 컨테이너 생성

![](/assets/img/spring/Spring-Core-Principle-4-1.png)

* 스프링 컨테이너를 생성할 때는 구성 정보를 지정해주어야 하므로 여기서는 `AppConfig.class`로 구성 정보를 지정했다.

### 2. 스프링 빈 등록

![](/assets/img/spring/Spring-Core-Principle-4-2.png)

* 스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보를 사용해서 스프링 빈을 등록한다.

> 빈 이름

* 빈 이름은 메서드 이름을 사용한다.

* 빈 이름을 직접 부여할 수도 있다.

* 주의) 빈 이름은 **항상 다름 이름을 부여**해야 한다.

### 3. 스프링 빈 의존관계 설정 - 준비 & 완료

![](/assets/img/spring/Spring-Core-Principle-4-3.png)

* 스프링 컨테이너는 설정 정보를 참고해서 의존관계를 주입(DI)한다.

* 자바 코드를 호출하는 것 같지만, 차이점은 뒤에 싱글톤 컨테이너에서 설명할 예정이다.

## Review

* 스프링 컨테이너를 생성하고, 설정(구성)정보를 참고해서 스프링 빈도 등록하고, 의존관계도 설정했다.

* 다음 시간에는 스프링 컨테이너에서 데이터를 조회해보자.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)

