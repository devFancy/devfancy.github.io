---
layout: post
title:  " [JPA] 연관관계 기초 "
categories: JPA
author: devFancy
---
* content
{:toc}

> 이 글은 [자바 ORM 표준 JPA 프로그래밍 - 기본편] 강의를 듣고 정리한 내용입니다.

## 연관관계가 필요한 이유

> 객체지향 설계의 목표는 자율적인 객체들의 **협력 공동체**를 만드는 것이다 - 조영호(객체지향의 사실과 오해)

이번 글에서는 JPA에서 **`외래 키`로 조인을 사용하고, `객체`는 참조를 사용**해서 연관관계를 매핑하는 방법에 대해서 알아보자.

* 예를 들어, 회원과 팀이 있고,

    회원은 하나의 팀에만 소속될 수 있고,

    회원(다)과 팀(일)은 다대일 관계라고 시나리오를 가정해보자.

* 이때, 객체를 테이블에 맞추어서 모델링을 하면, Member, Team 두개의 테이블을 통해 식별자(member.getId(), team.getId())로 조회해야 한다.

    이처럼 객체를 테이블에 맞추어 데이터 중심으로 모델링하면, **협력 관계**를 만들 수 없다.

* 따라서 객체지향 설계로 **협력 관계**를 만들기 위해 아래와 같이 생각해서 매핑한다.

    * **테이블은 `외래 키`로 조인을 사용**해서 연관된 테이블을 찾는다.

    * **객체는 `참조`를 사용**해서 연관된 객체를 찾는다.

## 단방향 연관관계

**객체 지향적인 모델링**(객체 연관관계 사용)을 하면 아래 그림과 같다.

![](/assets/img/jpa/JPA-Relationship-Mapping-1.png)

* 객체의 참조와 테이블의 외래 키를 매핑하면 아래와 같은 코드로 짜야한다.

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;
    private int age;

//    @Column(name ="TEAM_ID")
//    private Long teamId;

    @ManyToOne // User: M이므로 '다'에 속하기 때문에 Many~로 시작한다.
    @JoinColumn(name = "TEAM_ID") // 조인할 테이블의 식별키를 작성한다. => 외래 키
    private Team team;
    
    // 아래 Getter 생략
}
```

* ORM 매핑되어 아래 그림과 같이 된다.

![](/assets/img/jpa/JPA-Relationship-Mapping-2.png)

* 아래는 Java 코드로 연관관계를 저장하고, 객체의 참조로 연관관계를 조회(객체 그래프 탐색)한 부분이다.

```java
//팀 저장
Team team = new Team();
team.setName("TeamA");
em.persist(team);

//회원 저장
Member member = new Member();
member.setName("member1");
member.setTeam(team); //단방향 연관관계 설정, 참조 저장
em.persist(member);

//조회
Member findMember = em.find(Member.class, member.getId());

//참조를 사용해서 연관관계 조회
Team findTeam = findMember.getTeam();
```

## 양방향 연관관계

* 양방향 연관관계에 대해 정확한 이해를 위해 회원과 팀에 대한 예시를 아래와 같이 가정해본다.

![](/assets/img/jpa/JPA-Relationship-Mapping-3.png)

* Member 엔티티는 단방향과 동일하다.

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;
    private int age;

    @ManyToOne // User: M이므로 '다'에 속하기 때문에 Many~로 시작한다.
    @JoinColumn(name = "TEAM_ID") // 조인할 테이블의 식별키를 작성한다. => 외래 키
    private Team team;
    
    // 아래 부분 생략
}
```

* Team 엔티티에는 Member에 대한 컬렉션을 추가해줘야 한다.

```java
@Entity
public class Team {

    @Id
    @GeneratedValue
    private Long id;
    
    private String name;


    @OneToMany(mappedBy = "team") // Team은 일대다에 '일'에 속하므로 @One으로 시작한다.
    List<Member> members = new ArrayList<Member>();
    
    // 아래 부분 생략
}
```

* 여기서 `(mappedBy = "team")`은 **`Member` 엔티티에 있는 Team의 변수명인 team과 연관되었다**는 걸 의미한다.

### 연관관계의 주인과 mappedBy

* 객체와 테이블 간에 연관관계를 맺는 차이를 이해해보자.

* `객체`는 연관관계가 2개이고, `테이블`은 연관관계가 1개로 구성되어 있다.

    * 객체) 회원 -> 팀 연관관계 1개(단방향), 팀 -> 회원 연관관계 1개(단방향)

    * 테이블) 회원 <-> 팀의 연관관계 1개(양방향)

![](/assets/img/jpa/JPA-Relationship-Mapping-4.png)

* 객체의 양방향 관계는 사실 양방향 관계가 아니라 **서로 다른 단방향 관계 `2개`다.**

    따라서 객체를 양방향으로 참조하려면 **단방향 연관관계를 2개** 만들어야 한다.

* 테이블은 **외래 키 하나**로 두 테이블의 연관관계를 관리한다. 

    이때, 둘 중 하나로 외래 키를 관리해야 한다.

#### 연관관계의 주인(Owner)

* **양방향 매핑**에는 다음과 같은 규칙이 있다.

    * 객체의 두 관계중 하나를 `연관관계의 주인`으로 지정해야 한다.

    * **연관관계의 주인만이 `외래 키`를 관리(등록, 수정)할 수 있다.**

    * `주인`은 mappedBy 속성을 사용하지 않는다.

    * `주인이 아닌쪽`은 **읽기만 가능하므로 `mappedBy 속성`으로 주인을 지정**해준다.

* 결론부터 말하면, **`외래 키`의 위치를 기준으로 연관관계 주인을 정하면 된다.** (연관관계 주인 => 외래 키가 있는 곳)

* 여기서는 `Member.team`이 연관관계의 주인이다.

![](/assets/img/jpa/JPA-Relationship-Mapping-5.png)

* 그래서 양방향 매핑시 **연관관계의 주인에 값을 입력**해야 한다.

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

team.getMembers().add(member); 
//연관관계의 주인에 값 설정
member.setTeam(team); //**중요**

em.persist(member);
```

![](/assets/img/jpa/JPA-Relationship-Mapping-6.png)

### 양방향 매핑 정리

* **단방향 매핑만으로도 이미 연관관계 매핑은 완료**된다.

* 양방향 매핑은 **반대 방향으로 조회(객체 그래프 탐색) 기능이 추가**된 것 뿐이다.

* JPQL에서 역방향으로 탐색할 일이 많을 때 사용한다.

* 정리하면, **[1] 처음에는 단방향 매핑으로 잡은 뒤, [2] 필요할 때 양방향으로 추가해준다.** (단방향 -> 양방향으로 바꿀 때 테이블에 영향을 주지 않는다.)

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)