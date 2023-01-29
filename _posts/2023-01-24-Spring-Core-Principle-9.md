---
layout: post
title: " Spring 핵심원리 - 기본편 : 빈 스코프 "
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

## 빈 스코프란

* 스코프는 빈이 존재할 수 있는 범위를 뜻한다.

* 스프링은 다음과 같은 다양한 스코프를 지원한다.

    * `싱글톤` :  **기본 스코프**, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프이다.

    * `프로토타입` : 빈의 생성과 의존관계 주입까지만 관여한다.

    * `웹 관련 스코프`

        * `request` : 웹 요청이 들어오고 나갈때 까지 유지되는 스코프이다.

        * `session` : 웹 세션이 생성되고 종료될 때 까지 유지되는 스코프이다.

        * `application` : 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프이다.



## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
