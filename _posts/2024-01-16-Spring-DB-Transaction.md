---
layout: post
title: " Spring의 Transaction 이해 (@Transactional) "
categories: Spring
author: devFancy
---
* content
{:toc}

> 이 글은 [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard) 강의를 듣고 정리한 내용입니다.

## 이 글을 작성한 이유

Spring의 Transaction에 대한 심층적인 이해를 위해 "Spring의 Transaction 정리 (@Transactional)"이라는 주제로 글을 작성하려고 한다.

이전에는 데이터베이스 교재를 통해 [트랜잭션](https://devfancy.github.io/DB-Transaction/)과 [트랜잭션 격리 수준](https://devfancy.github.io/DB-Transaction-Isolation-Level/)을 공부하며 관련 개념을 정리했다.

그러나 팀 프로젝트에서는 `@Transactional` 어노테이션을 사용하면서도 실제로 어떻게 트랜잭션을 관리해야 하는지 제대로 알지 못했다..
이에 따라서 이번 기회에 Spring의 Transaction에 대해서, 그리고 `@Transactional` 어노테이션이 왜 도입하게 되었고, 어떻게 사용하고 있는지 알아가보자.

## 트랜잭션이란?

트랜잭션을 이름 그대로 번역하면 `거래`라는 의미이다. 데이터베이스에서 `트랜잭션`은 하나의 거래를 안전하게 처리하도록 보장해주는 것을 뜻한다. 
조금 더 구체적으로 말하면, `트랜잭션`은 작업 하나를 수행하는 데 필요한 데이터베이스의 연사들을 모아놓은 것으로, 데이터베이스에서 **논리적인 작업의 단위**가 된다. 
그리고 데이터베이스에 장애가 발생했을 때 **데이터를 복구하는 작업의 단위**도 된다.

> `Spring의 Transaction`을 알기 위한 사전 준비
> 
> 트랜잭션에 관한 예시와 개념, 그리고 트랙잭션의 특성에 대해 자세히 알고 싶다면, 이전에 작성한 [트랜잭션](https://devfancy.github.io/DB-Transaction/)을 참고하자.
> 트랜잭션 격리 수준에 대해서도 자세히 알고 싶다면, 이전에 작성한 [트랜잭션 격리 수준](https://devfancy.github.io/DB-Transaction-Isolation-Level/)을 참고하자.
> 
> 추가적으로, Spring의 트랜잭션을 이해하기 위해서는 Connection pool과 DataSource에 대한 이해가 필요한데, 이에 대한 내용은 이전에 작성한 [커넥션 풀과 데이터소스 이해](https://devfancy.github.io/Spring-DB-ConnectionPool-DataSource/)을 참고하자.
> 
> 이 글에서는 일반적으로 많이 사용하는 `READ COMMITTED`(커밋된 읽기) 트랜잭션 격리 수준을 기준으로 작성했다.

## 데이터베이스 연결 구조와 DB 세션

트랜잭션을 더 자세히 이해하기 위해 데이터베이스 서버 연결 구조와 DB 세션에 대해 알아보자.

![](/assets/img/spring/Spring-DB-Transaction-1.png)

사용자는 `웹 애플리케이션 서버`(WAS)나 `DB 접근 툴` 같은 클라이언트를 사용해 데이터베이스 서버에 접근할 수 있다.

이때 `데이터베이스 서버`는 내부에 `세션`이라는 것을 만들고 앞으로 해당 커넥션을 통한 모든 요청을 해당 세션을 통해 실행한다.
쉽게 말해, 개발자가 클라이언트를 통해 SQL를 전달하면 현재 커넥션에 연결된 세션이 SQL을 실행한다.

`세션`은 **트랜잭션을 시작하고, 커밋 또는 롤백을 통해 트랜잭션을 종료**한다. 그리고 이후에 새로운 트랜잭션을 다시 시작할 수 있다.
세션을 종료하는 방법은 사용자가 커넥션을 닫거나, 또는 DBA가 세션을 강제로 종료하면 된다.
(참고로 커넥션 풀이 10개의 커넥션을 생성하면 세션도 10개 만들어진다)

## 애플리케이션 구조

스프링을 이용한 트랜잭션을 처리하기 이전에, `애플리케이션 구조`에 대해 간단하게 짚고 넘어가자.

가장 단순하면서 많이 사용하는 방법은 역할에 따라 3가지 계층으로 나누는 거이다.

![](/assets/img/spring/Spring-DB-Transaction-2.png)

* `프리젠테이션 계층`은 **UI와 관련된 처리를 담당**한다. 그외 다른 역할들은 다음과 같다.

    * 웹 요청과 응답

    * 사용자 요청을 검증

    * 주 사용 기술: 서블릿과 HTTP 같은 웹 기술, 스프링 MVC

* `서비스 계층`은 **비즈니스 로직을 담당**한다.

    * 주 사용 기술: 가급적 특정 기술에 의존하지 않고, **순수 자바 코드**로 작성

* `데이터 접근 계층`은 **실제 데이터베이스에 접근하는 코드를 담당**한다.

    * 데이터를 저장하고 관리하는 기술 담당

    * 주 사용 기술: JDBC, JPA, File, Redis, ...

여기서 가장 중요한 곳은 **핵심 비즈니스 로직이 들어있는 `서비스 계층`이다.**

* 시간이 흘러도 비즈니스 로직은 최대한 변경없이 유지되어야한다.

* 이렇게 계층을 나눈 이유도 서비스 계층을 **최대한 순수하게 유지하기 위한 목적이 크다.**

* JDBC, JPA와 같은 구체적인 데이터 접근 기술로부터 `서비스 계층`을 보호해주는데, 예를 들어 JDBC에서 JPA로 변경해도 서비스 계층은 변경하지 않아도 된다.

    * 서비스 계층에서 `JdbcRepository` 대신 `JpaRepository` 인터페이스로 변경하면 되기 때문이다. (인터페이스에 의존하는 것이 좋다)

* 그래서 서비스 계층은 특정 기술에 종속되지 않기 때문에 **비즈니스 로직을 유지보수 하기도 쉽고, 테스트하기도 쉽다.**

* 정리하면, 서비스 계층은 가급적 **비즈니스 로직만 구현**하고, 특정 구현 기술에 직접 의존해서는 안된다. 이렇게 하면 향후 구현 기술이 변경될 때 **변경의 영향 범위를 최소화**할 수 있다.

## 트랜잭션 추상화

![](/assets/img/spring/Spring-DB-Transaction-3.png)

데이터베이스에는 여러 접근 기술이 존재한다.

만약 JDBC에 의존하는 코드를 작성하다가 JPA로 전환하고자 한다면, 기존 코드를 전부 고쳐야 하는 문제가 발생한다.

하지만 JDBC, JPA 모두 논리적인 로직에 대한 과정(트랜잭션 시작 -> 비즈니스 로직 수행(성공 시 커밋, 실패시 롤백) -> 트랜잭션 종료)은 같다.

이 문제를 해결하려면 스프링이 제공하는 **트랜잭션 추상화 기술**을 사용하면 된다.

![](/assets/img/spring/Spring-DB-Transaction-4.png)

스프링 트랜잭션 추상화의 핵심인 `PlatformTransactionManager` 인터페이스는 **트랜잭션 매니저**라고 부르는데 트랜잭션 시작, 종료, 커밋, 롤백에 대한 내용이 있고, 이에 대한 각 접근 기술인 구현체를 제공한다.

```java
package org.springframework.transaction;

    public interface PlatformTransactionManager extends TransactionManager {
     TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
             throws TransactionException;
     void commit(TransactionStatus status) throws TransactionException;
     void rollback(TransactionStatus status) throws TransactionException;
}
```

## 트랜잭션 매니저와 트랜잭션 동기화 매니저

스프링이 제공하는 `트랜잭션 매니저`는 크게 2가지 역할을 한다.

1. 트랜잭션 추상화 -> 앞에서 설명했으니 생략

2. 리소스 동기화 : 트랜잭션을 유지하려면 트랜잭션의 시작부터 끝까지 **같은 데이터베이스 커넥션을 유지**해야 한다.

보통 코드를 작성하면 서비스 계층에서 트랜잭션이 시작하고 로직이 끝나면 트랜잭션이 종료된다.

즉, 하나의 서비스 로직에서 리포지토리 계층(데이터 접근 계층)에 접근하는 로직이 여러 개 있다고, 여러 개의 트랜잭션을 사용하는 것이 아니라 **같은 트랜잭션을 사용**한다.

이를 위해 스프링은 `쓰레드 로컬`(ThreadLocal)을 사용해 커넥션을 동기화해주는 **`트랜잭션 동기화 매니저`** 을 제공한다.

* 쓰레드 로컬을 사용하면 각각의 쓰레드마다 별도로 저장소가 부여된다. 따라서 해당 쓰레드만 해당 데이터에 접근할 수 있다. 

* (쓰레드 로컬에 대한 자세한 내용은 [스프링 핵심 원리 - 고급편 강의](https://www.inflearn.com/course/스프링-핵심-원리-고급편)을 참고하자.(정말 끝도 없구나..)

트랜잭션 매니저는 내부에서 이 `트랜잭션 동기화 매니저`를 사용한다. 내부 동작 방식은 아래와 같다.

![](/assets/img/spring/Spring-DB-Transaction-5.png)

클라이언트의 요청으로 서비스 로직을 실행한다.

[1] 서비스 계층에서 `transactionManager.getTransaction()` 을 호출해서 트랜잭션을 시작한다.

[2] 트랜잭션이 시작하려면 머저 데이터베이스 커넥션이 필요하기 때문에 `트랜잭션 매니저`는 내부에서 데이터소스를 사용해 커넥션을 생성한다.

[3] 커넥션을 수동 커밋 모드로 변경해서 실제 데이터베이스 트랜잭션을 시작한다.

[4] 커넥션을 `트랜잭션 동기화 매니저`에 보관한다.

[5] 트랜잭션 동기화 매니저는 쓰레드 로컬에 커넥션을 보관한다. (멀티 쓰레드 환경에서는 안전하게 커넥션을 보관할 수 있다)

![](/assets/img/spring/Spring-DB-Transaction-6.png)

[6] 서비스 계층은 비즈니스 로직을 실행하면서 리포지토리 메서들을 호출한다.

[7] 리포지토리 메서드들은 트랜잭션이 시작된 커넥션이 필요하므로 `DataSourceUtils.getConnection()` 을 사용해서 트랜잭션 동기화 매니저에 보관된 커넥션을 꺼내서 사용한다. 이 과정에서 같은 커넥션을 사용하므로 트랜잭션도 유지하게 된다.

[8] 획득한 커넥션을 사용해서 SQL을 데이터베이스에 전달해서 실행한다.

![](/assets/img/spring/Spring-DB-Transaction-7.png)

[9] 비즈니스 로직이 끝나고 트랜잭션 종료를 요청한다.

[10] 트랜잭션을 종료하려면 동기화된 커넥션이 필요한데, 트랜잭션 동기화 매니저를 통해 동기화된 커넥션을 획득한다.

[11] 획득한 커넥션을 통해 데이터베이스에 트랜잭션을 커밋하거나 롤백한다.

[12] 전체 리소스를 정리한다.

* 트랜잭션 동기화 매니저를 정리한다. 쓰레드 로컬은 사용후 꼭 정리해야 한다.

* `con.setAutoCommit(true)` 로 되돌린다. 커넥션 풀을 고려해야 한다.

* `con.close()` 를 호출해셔 커넥션을 종료한다. 커넥션 풀을 사용하는 경우 `con.close()` 를 호출하면 커넥션 풀에 반환된다.

## 트랜잭션 AOP 이해 - @Transactional 적용

트랜잭션 AOP를 이해하기 전에, 위에 설명한 트랜잭션 매니저를 사용하면 작성하게 되는 코드를 살펴보자.

> @Transactional 적용 전

```java
/**
 * 트랜잭션 - 트랜잭션 매니저
 */
@Slf4j
@RequiredArgsConstructor
public class MemberServiceV3_1 {

    private final PlatformTransactionManager transactionManager;
    private final MemberRepositoryV3 memberRepository;

    public void accountTransfer(String fromId, String toId, int money) {
        // 트랜잭션 시작
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            // 비즈니스 로직
            bizLogic(fromId, toId, money);
            transactionManager.commit(status);
        } catch (Exception e) {
            transactionManager.rollback(status); //실패시 롤백
            throw new IllegalStateException(e);
        }
        // 커넥션 release는 커밋되거나 롤백되면 알아서 transactionManager가 처리한다.
    }
}
```

코드를 확인해보면 `트랜잭션을 처리하는 객체`와 `비즈니스 로직을 처리하는 서비스 객체`가 섞여있는 것을 확인할 수 있다.
이는 가독성을 떨어뜨리며 유지 보수도 여려워지게 만든다.

![](/assets/img/spring/Spring-DB-Transaction-8.png)

스프링에서 `프록시`를 사용하면 트랜잭션을 처리하는 객체와 비즈니스 로직을 처리하는 서비스 객체를 **명확하게 분리**할 수 있다.

```java
// 프록시 객체
public class TransactionProxy {
  private MemberService target;

  public void logic() {
    TransactionStatus status = transactionManager.getTransaction(..); //트랜잭션 시작
    try {
      target.logic(); //실제 대상 호출
      transactionManager.commit(status); //성공시 커밋
    } catch (Exception e) {
      transactionManager.rollback(status); //실패시 롤백 throw new IllegalStateException(e);
    }
  }
}
```

`프록시 객체`는 트랜잭션을 시작한 후에 실제 서비스 로직을 대신 호출한다. 
이러한 작업으로 인해 `서비스 계층`에서는 트랜잭션 관련 코드를 명시적으로 작성하지 않아도 되며, 결과적으로 서비스 계층은 순수한 비즈니스 로직에만 집중할 수 있게 된다.

트랜잭션 프록시를 활용하기 위해 **스프링에서 제공하는 `@Transactional` 어노테이션을 사용**하면 해당 기능을 자동으로 처리할 수 있다.

`@Transactional` 어노테이션을 적용한 코드는 아래와 같다.

> @Transactional 적용 후

```java
/**
 * 트랜잭션 - @Transactional AOP
 */
@Slf4j
public class MemberServiceV3_3 {

    private final MemberRepositoryV3 memberRepository;

    public MemberServiceV3_3(MemberRepositoryV3 memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Transactional // 트랜잭션 AOP 기능
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {
        bizLogic(fromId, toId, money);
    }
    private void bizLogic(String fromId, String toId, int money) throws SQLException {
      Member fromMember = memberRepository.findById(fromId);
      Member toMember = memberRepository.findById(toId);
      
      memberRepository.update(fromId, fromMember.getMoney() - money);
      validation(toMember);
      memberRepository.update(toId, toMember.getMoney() + money);
    }
    // ... 생략
}
```

이러한 구현을 통해 트랜잭션 처리에 대한 부분을 간소화하고, 비즈니스 로직에 집중할 수 있게 된다.

`@Transactional` 애노테이션은 메서드에 붙여도 되고, 클래스에 붙여도 된다. 
클래스에 붙이면 외부에서 호출 가능한 `public` 메서드가 AOP 적용 대상이 된다.

* 스프링에서는 보통 `클래스` 단위로 프록시 객체를 생성한다. 

* 예를 들어 Service 클래스에 `@Transactional`이 붙은 메서드가 여러 개 있더라도,
  프록시 객체는 **한 개**만 만들어지고, 해당 프록시 객체 안에서 트랜잭션이 필요한 메서드들을 관리한다.
  따라서 Service 클래스에 `@Transactional`이 붙은 메서드가 2개, 일반 메서드 1개가 있을 경우에도 **프록시 객체는 한 개만 생성되며, 트랜잭션이 필요한 메서드에서만 트랜잭션 관련 프록시 동작이 수행**된다.

## 트랜잭션 AOP 정리

트랜잭션 AOP가 사용된 전체 흐름을 그림과 글로 다시 한번 정리해보자.

![](/assets/img/spring/Spring-DB-Transaction-9.png)

1. 클라이언트로부터 API 요청이 들어오면 `프록시`가 호출된다.

2. 스프링 컨테이너를 통해 트랜잭션 매니저를 획득한다.

3. `DataSourceUtils.getConnection()` 을 호출해 트랜잭션을 시작한다.

4. 데이터소스를 통해 커넥션을 생성한다.

5. 만든 커넥션을 수동 커밋 모드로 변경해서 실제 데이터베이스를 시작한다.

6. 커넥션을 트랜잭션 동기화 매니저에 보관한다.

7. 보관된 커넥션은 스레드 로컬에서 멀티 스레드에 안전하게 보관된다.

8. 실제 서비스 로직을 호출한다.

9. 리포지토리의 데이터 접근 로직에서는 트랜잭션 동기화 매니저에서 커넥션을 획득한다.

10. 트랜잭션 처리 로직(AOP 프록시)으로 돌아와 성공이면 커밋하고, 예외(실패)시 롤백을 수행하며 트랜잭션을 종료한다.

> AOP 프록시 적용 확인 - MemberServiceV3_3Test

![](/assets/img/spring/Spring-DB-Transaction-10.png)

다음 테스트 코드를 통해 `MemberService` 클래스에 프록시가 적용된 걸 확인할 수 있다.

```
2024-01-16 20:18:27.624  INFO 94861 --- [main] h.jdbc.service.MemberServiceV3_3Test     : memberService class=class hello.jdbc.service.MemberServiceV3_3$$EnhancerBySpringCGLIB$$28863787
2024-01-16 20:18:27.624  INFO 94861 --- [main] h.jdbc.service.MemberServiceV3_3Test     : memberRepository class=class hello.jdbc.repository.MemberRepositoryV3
```

> 선언적 트랜잭션 관리 vs 프로그래밍 방식 트랜잭션 관리

* 선언적 트랜잭션(Declarative Transaction Management)

    * ex) `@Transactional` 

    * 과거에는 XML에 설정하기도 했다.

    * 프로그래밍 방식에 비해 훨씬 간편하고 실용적이라 실무에서는 대부분 선언적 트랜잭션 관리를 사용한다.

* 프로그래밍 방식의 트랜잭션 관리(programmatic transaction management)

    * ex) TransactionManager, TransactionTemplate

    * 트랜잭션 관련 코드를 직접 작성하는 것을 말한다.

## Review

* 스프링 트랜잭션에 대한 이해를 위해서는 트랜잭션 추상화, 트랜잭션 매니저 등 다양한 개념을 알아야 한다. (사실 여기서부터 다양한 개념들을 이해하느라 머리가 아팠다..🥲)

* 처음에는 김영한님의 Spring DB 1편 강의를 듣고 실습해도 완벽한 이해가 어려워, 여러 차례 복습하면서 머릿속에 개념과 구조를 조금씩 잡아나갔다.

* `@Transactional`이 어떻게 동작하는지와 그 용도를 대강은 이해했다고 느끼고 있지만, 아직 완벽하게 흡수되지 않았기 때문에 종종 복습하고, 프로젝트에도 적용해보면서 서서히 이해의 폭을 넓혀가자! 

## Reference

* [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard)

* [[Spring] Spring의 트랜잭션 관리 (feat: @Transactional)](https://yeonyeon.tistory.com/223)

* [[Tecoble] Transaction 어노테이션](https://tecoble.techcourse.co.kr/post/2021-05-25-transactional/)