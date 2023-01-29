---
layout: post
title: " Spring 핵심원리 - 기본편 : 테스트를 할 때 쓰이는 어노테이션 "
categories: Spring
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였고, 추후에 업데이트 될 수 있습니다.

* 테스트를 할 때 종종 쓰이는 어노테이션을 기록해두려고 한다.

## @BeforeEach 어노테이션

* @BeforeEach 어노테이션을 명시한 메소드는 테스트 메소드 실행 전에 무조건 실행된다.

```java
package hello.core.member;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import hello.core.AppConfig;

public class MemberServiceTest {
    MemberService memberService;

    @BeforeEach
    public void beforeEach() {
        AppConfig appConfig = new AppConfig();
        memberService = appConfig.memberService();
    }

    @Test
    void join() {
        // given
        Member member = new Member(1L, "memberA", Grade.VIP);

        // when
        memberService.join(member);
        Member findMember = memberService.findMember(1L);

        // then
        Assertions.assertThat(member).isEqualTo(findMember);
    }
}
```

* 테스트 메소드를 실행하기 전에, AppConfig 객체를 만들고 memberService 를 할당 해준다.

* 그리고 나서 @Test가 실행된다. 만약에 @Test가 2개 이상인 경우 @BeforeEach도 2번 이상 실행된다.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)


