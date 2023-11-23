---
layout: post
title:  " [JPA] 다양한 연관관계 매핑 "
categories: JPA
author: devFancy
---
* content
{:toc}

## 다대일

다대일에서 `다`쪽이 연관관계 주인이다.

### 다대일 단방향

* `다대일 단방향`은 **가장 많이 사용**하는 연관관계다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-1.png)

### 다대일 양방향

* 외래 키가 있는 쪽을 연관관계의 주인으로 한다.

* 양쪽이 서로 참조되도록 개발한다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-2.png)

## 일대다

일대다에서 `일`쪽이 연관관계 주인이다.

### 일대다 단방향

* `일대다 단방향` 모델은 권장하지 않는다. (실무에서 거의 쓰이지 않는다)

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-3.png)

* DB 설계상 일대다 관계는 **항상 `다` 쪽에 `외래키`가 있다.**

* 객체와 테이블의 차이 때문에 **반대편 테이블의 외래 키(Member의 외래 키)를 관리**하는 특이한 구조이다.

* `@JoinColumn`을 꼭 사용해야 한다. 그렇지 않으면 조인 테이블 방식을 사용해야 한다. (@JoinColumn을 사용하지 않으면 TEAM_MEMBER와 같은 중간에 테이블 하나가 추가된다)

* Team 엔티티 클래스에 대해 java 코드로 작성하면 아래와 같다.

```java
@Entity
public class Team {

    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "team") // Team은 일대다에 '일'에 속하므로 @One으로 시작한다.
    @JoinColumn(name ="TEAM_ID") // **
    List<Member> members = new ArrayList<Member>();
    
    // 아래 부분 생략
}
```

* 일대다 단뱡향 매핑의 단점으로는 아래와 같다.

    * 엔티티가 관리하는 외래 키가 다른 테이블에 있다.

    * 연관관계 관리를 위해 추가로 UPDATE SQL을 실행해줘야 한다.

* 정리하면, 일대다 단방향 매핑보다는 **`다대일 양방향` 매핑을 사용**하자.

### 일대다 양방향 

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-4.png)

* `일대다 양방향` 매핑은 공식적으로 존재하지 않는다.

* 만약 `다`인 `Member` 테이블에서 조회하고 싶다면 아래와 같이 작성하면 된다.

* 읽기 전용 필드(@JoinColumn(insertable=false, updatable=false))을 사용해서 양방향 처럼 사용한다.

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME")
    private String name;
    private int age;

    @ManyToOne 
    @JoinColumn(name = "TEAM_ID", insertable=false, updatable=false) // 읽기 전용 필드를 사용
    private Team team;
    
    // 아래 부분 생략
}
```

* 정리하면, 일대다 양방향보다는 **`다대일 양방향` 매핑을 사용하자.**

## 일대일

* 주 테이블이나 대상 테이블 중에 `외래 키`를 선택 가능하다.

* 둘 중 한군데에만 넣어도 상관없다.

* `외래 키`에 데이터베이스 유니크(UNI) 제약조건을 추가한다.

### 일대일: 주 테이블에 외래 키 단방향

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-5.png)

* 다대일(@ManyToOne) 단방향 매핑과 유사하다.

* `@ManyToOne` 에서 `@OneToOne`으로 바꾼 것 뿐이다.

> Member 클래스

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;
    private int age;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;
    
    // 아래 부분 생략
}
```

### 일대일: 주 테이블에 외래 키 양방향

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-6.png)

* 다대일 양방향 매핑 처럼 **외래 키가 있는 곳이 연관관계의 주인**이다.

* 주인이 아닌 곳(반대편)은 mappedBy를 적용한다.

> Locker 클래스

```java
@Entity
public class Locker {

    @Id
    @GeneratedValue
    private Long id;
    
    private String name;

    // 읽기 전용
    @OneToOne(mappedBy = "locker") // Member 클래스에 Locker의 변수명을 의미한다.
    private Member member;
    
    // 아래 부분 생략
}
```

## 다대다

* `관계형 데이터베이스`는 정규화된 테이블 2개로 다대다 관계를 표현할 수 없다.

    따라서 연결 테이블을 추가해서 일대다, 다대일 관계로 풀어나가야 한다.

* `객체`는 **컬렉션을 사용해서 객체 2개로 다대다 관계가 가능**하다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-7.png)

* `@ManyToMany` 사용하고, `@JoinTable`로 연결 테이블을 지정한다.

* 다대다 매핑은 단방향, 양방향 모두 가능하다.

### 다대다 매핑의 한계

* 결론부터 말하자면, 다대다 매핑는 **실무에서 사용하지 않는다.**

* 연결 테이블이 단순히 연결만 하고 끝나지 않는다.

* 주문시간, 수량 같은 데이터가 들어올 수 있다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-8.png)

### 다대다 한계 극복

* 다대다 한계를 극복하기 위해 **연결 테이블용 `엔티티`를 추가**한다. (연결 테이블을 엔티티로 승격)

* `@ManyToMany` -> `@OneToMany`, `@ManyToOne`으로 바꿔준다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-9.png)

* 다시 한번 말하면, 실무에서는 `@ManyToMany` 사용하지 않는다.

## 연관관계 관련 어노테이션

### @JoinColumn

* `@JoinColumn`은 외래 키를 매핑할 때 사용하는 어노테이션이다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-10.png)

### @ManyToOne - 주요 속성

* `@ManyToOne`은 다대일 관계 매핑할 때 사용하는 어노테이션이다.

* 다대일에서 '다'가 **연관관계 주인**이 되어야 한다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-11.png) 

### @OneToMany - 주요 속성

* `@OneToMany`은 일대다 관계를 매핑할 때 사용하는 어노테이션이다.

![](/assets/img/jpa/JPA-Diverse-Relationship-Mapping-12.png)

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)