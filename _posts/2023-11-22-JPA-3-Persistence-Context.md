---
layout: post
title:  " [JPA] 영속성 컨텍스트란 "
categories: JPA
author: devFancy
---
* content
{:toc}

> 이 글은 [자바 ORM 표준 JPA 프로그래밍 - 기본편] 강의를 듣고 정리한 내용입니다.

## 영속성 컨텍스트란

* JPA를 사용하면, 일반적으로 엔티티 매니저 팩토리와 엔티티 매니저에 대해 이해를 해야 한다.

![](/assets/img/jpa/JPA-Persistence-Context-1.png)

* 웹 애플리케이션을 개발하면서 고객으로부터 요청이 오면, 엔티티 매니저 팩토리를 통해 엔티티 매니저를 생성한다.

* 엔티티 매니저는 데이터베이스 커넥션 풀을 사용해서 DB를 사용하게 된다.

    `영속성 컨텍스트`란 **엔티티를 영구 저장하는 환경**이라는 뜻을 가진 **논리적인 개념**으로 **어플리케이션과 DB 사이에서 객체를 보관하는 가상의 DB같은 역할**을 한다. 

    즉, 애플리케이션에서 DB에 저장하기 전에 사용을 하는 임시 저장 공간이라고 이해를 하면 편할 것이다.

    * `EntityManager.persist(entity);`

* 엔티티 매니저를 통해서 `영속성 컨텍스트`에 접근한다.

    * `엔티티 매니저`(Entity Manager)란 **영속성 컨텍스트에 접근하여 엔티티에 대한 데이터베이스 작업을 제공**하는 것을 의미한다.

    * `엔티티 매니저`(Entity Manager)는 엔티티를 저장하고, 수정하고, 삭제하고 조회하는 등 엔티티와 관련된 모든 일을 처리한다.

* 영속성 컨텍스트를 통해 **데이터의 상태 변화를 감지하고 필요한 쿼리를 자동으로 수행**한다.

## 엔티티의 생명 주기

* 엔티티의 생명 주기는 아래와 같이 4가지로 구성되어 있다.

1. **비영속(new/transient)** : 영속성 컨텍스트와 전혀 관계가 없는 **새로운** 상태
2. **영속(managed)** : 영속성 컨텍스트에 **관리**되는 상태
3. **준영속(detached)** : 영속성 컨텍스트에 저장되었다가 **분리**된 상태
4. **삭제(removed)** : **삭제**된 상태

![](/assets/img/jpa/JPA-Persistence-Context-2.png)

### 비영속

* 아래와 같이 Member 객체만 생성만 한 상태 ⇒ JPA와 전혀 관계가 없는 **새로운** 상태를 `비영속` 상태라고 한다.

![](/assets/img/jpa/JPA-Persistence-Context-3.png)

### 영속

* 아래와 같이 Member 객체를 생성한 다음에, 엔티티 매니저를 얻어와서 **Member 객체를 저장하면 영속성 컨텍스트에 관리되는 상태**를 `영속` 상태라고 한다.

![](/assets/img/jpa/JPA-Persistence-Context-4.png)

* 아래의 java 코드로 비영속 상태와 영속 상태를 구분할 수 있다.

```java
import javax.persistence.Persistence;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;

public class JpaMain {
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();

        EntityTransaction tx = em.getTransaction();
        tx.begin()

        try {
            // 비영속
            Member member = new Member();
            member.setId(100L);
            member.setName("HelloJPA");

            // 영속
            em.persist(member);

            tx.commit();
        } catch (Exception e) {
            tx.rollback();
        } finally {
            ex.close();
        }
    }
}
```

### 준영속, 삭제

* Member 엔티티를 영속성 컨텍스트에서 분리한 상태를 `준영속` 상태라고 한다.

  * 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)되어 영속성 컨텍스트가 제공하는 기능을 사용하지 못한다.

* 준영속 상태로 만드는 방법

  * em.detach(entity) : 특정 엔티티만 준영속 상태로 전환

  * em.clear() : 영속성 컨텍스트를 완전히 초기화

  * em.close() : 영속성 컨텍스트를 종료

* 객체를 삭제한 상태를 `삭제`라고 하며, 코드에서는 `em.remove(member);`를 의미한다.

```java
//삭제 대상 엔티티 조회
Member memberA = em.find(Member.class, “memberA");

em.remove(memberA); //엔티티 삭제
```

## 영속성 컨텍스트의 이점

### 1차 캐시

* 영속성 컨텍스트 내부에는 엔티티 인스턴스를 캐싱하는 `1차 캐시` 가 있다.

* 일반적으로 **트랜잭션 내에서 유효한 생명주기**를 갖는다.

![](/assets/img/jpa/JPA-Persistence-Context-5.png)

* member를 영속하면, member1과 member라는 엔티티 클래스를 1차 캐시에 저장한다.

![](/assets/img/jpa/JPA-Persistence-Context-6.png)

* 그런 다음, 영속성 컨택스트에서 `member1`를 조회하면, JPA는 **DB가 아닌 1차 캐시에 저장된 값을 가져온다.**

![](/assets/img/jpa/JPA-Persistence-Context-7.png)

* 그런데 만약 `member2`를 조회할 때, **1차 캐시에 없다면, DB를 조회**한다. 그런 다음에 **해당 값을 1차 캐시에 저장하고 값을 반환한다.**

* 사실, 엔티티 매니저라는 건 데이터베이스 트랜잭션이 끝날 때 종료된다. ⇒ 비즈니스가 끝나면, 해당 엔티티 매니저가 사라져버린다.

* 차 캐시라는건 데이터베이스 하나의 트랜잭션 안에서만 효과가 있기 때문에 성능에 대한 장점은 없다.

### 동일성 보장

* 영속성 컨텍스트는 영속성 컨텍스트 안에서 영속 엔티티들의 동일성을 보장한다.

* 따라서 **같은 식별자**를 통해 1차 캐시에서 얻은 엔티티 인스턴스는 `==` 연산을 통해 동일성을 보장한다.

```java
Member a = em.find(Member.class, "member1");
Member b = em.find(Member.class, "member1");

System.out.println(a == b); //동일성 비교 true
```

* JPA가 영속 엔티티의 동일성을 보장한다. 마치 자바 컬렉션에서 똑같은 레퍼런스 객체를 꺼내오는 것과 같다. 1차 캐시가 있기 때문에 가능한 것이다.

* **같은 트랜잭션 안에서 비교**할 때에만 동일하다는 것이다.

### 트랜잭션 쓰기 지연

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();//엔티티 매니저는 데이터 변경시 트랜잭션을 시작해야 한다.
transaction.begin(); // [트랜잭션] 시작

em.persist(memberA); // 1
em.persist(memberB); // 2
//여기까지 INSERT SQL을 데이터베이스에 보내지 않는다.

//커밋하는 순간 데이터베이스에 INSERT SQL을 보낸다.
transaction.commit(); // 3 [트랜잭션] 커밋
```

* 위에 작성한 자바 코드에서 1->2->3 순서대로 세부 과정에 대해 알아보자.

> em.persist(memberA);

![](/assets/img/jpa/JPA-Persistence-Context-8.png)

* [1] `em.persist(memberA);`을 통해 memberA가 1차 캐시에 들어간다.(집어 넣는다)

* [2] 그러면서 동시에 JPA가 이 엔티티를 분석해서 INSERT SQL 쿼리를 생성한다.

* [3] 그래서 쓰기 지연 SQL 저장소에 쌓아둔다.

> em.persist(memberB);

![](/assets/img/jpa/JPA-Persistence-Context-9.png)

* [4] 그런 다음에 `em.persist(memberB);` 을 하면, memberB도 1차 캐시에 들어간다.(집어 넣는다)

* [5] 그리고 이때, INSERT SQL 쿼리를 생성해서 쓰기 지연 SQL 저장소에 차곡차곡 쌓아둔다.

> transaction.commit();

![](/assets/img/jpa/JPA-Persistence-Context-10.png)

* [6] 그리고 `transaction.commit();` 을 통해 **커밋하는 순간 `쓰기 지연 SQL 저장소`에 있던 데이터들이 flush가 되면서, `데이터베이스`에 INSERT SQL을 보낸다.**

* [7] 그리고 실제 데이터베이스가 commit 된다.

### 변경 감지

* `변경 감지`란 JPA를 사용하여 데이터를 수정하려면 `Entity`를 조회하여 조회된 `Entity` 데이터를 변경만 하면 `데이터베이스`에 자동으로 반영이 되도록 하는 기능이다.

![](/assets/img/jpa/JPA-Persistence-Context-11.png)

* [1] 데이터베이스에 커밋하면, 내부적으로 flush가 발생하고

* [2] JPA가 엔티티하고 스냅샷을 비교한다.

    * **`엔티티 인스턴스 값`을 읽어온 그 시점의 최초 상태를 `영속성 컨텍스트`에 저장**하는 데, 이를 `스냅샷`이라 부른다.

* 만약 MemberA에 대한 데이터가 변경되면 `쓰기 지연 SQL 저장소`에 [3] UPDATE SQL 쿼리를 생성한다.

* 그리고 [4] UPDATE SQL 쿼리를 flush를 통해 데이터베이스에 반영하고

* [5] commit 하게 된다.

## 플러시

* **`flush` 란 영속성 컨텍스트의 변경내용을 데이터베이스에 반영하는 것**을 말한다.

* 플러시가 발생하면, 다음 3가지가 일어난다.

    * 변경 감지

    * 수정된 엔티티의 쓰기 지연 SQL 저장소에 등록 

    * 쓰기 지연 SQL 저장소의 쿼리를 데이터베이스에 전송 (등록, 수정, 삭제 쿼리)

* 영속성 컨텍스트를 플러시하는 방법은 3가지가 있다.

    * em.flush() - 직접 호출 -> 쿼리가 DB에 반영되어 버린다.

    * 트랜잭션 커밋 - 플러시 자동 호출

    * JPQL 쿼리 실행 - 플러시 자동 호출

* 플러시 모드 옵션은 기본적으로 AUTO(`em.setFlushMode(FlushModeType.AUTO`)로 사용된다. (거의 사용할 일은 없다)

    * FlushModeType.AUTO : 커밋이나 쿼리를 실행할 때 플러스 (기본값)

    * FlushModeType.COMMIT : 커밋할 때만 플러시

* 정리하면, 플러시는

    **영속성 컨텍스트를 비우지 않고, 변경 내용을 데이터베이스에 동기화**하고

    **트랜잭션 커밋 직전**에만 동기화하면 된다.

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)