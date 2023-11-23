---
layout: post
title:  " [JPA] 엔티티 매핑 "
categories: JPA
author: devFancy
---
* content
{:toc}

> 이 글은 [자바 ORM 표준 JPA 프로그래밍 - 기본편] 강의를 듣고 정리한 내용입니다.

## 객체와 테이블 매핑

### @Entity

`@Entity`가 붙은 클래스는 JPA가 관리하며, **`엔티티`** 라 부른다.

JPA를 사용해서 테이블과 매핑할 클래스는 `@Entity`가 필수이다.

몇 가지 주의점이 있다.

  * **기본 생성자가 필수**이다. (파라미터가 없는 public 또는 protected 생성자)

  * final 클래스, enum 클래스, interface, inner 클래스는 사용할 수 없다.

  * 저장할 필드에 final 사용할 수 없다.

> @Entity 속성 정리

속성: `name`: JPA에서 사용할 엔티티 이름을 지정한다.

* 기본값: 클래스 이름을 그대로 사용한다.

  * ex) Entity Class 이름 = **User** -> `@Entity(name = "User")`

* 같은 클래스 이름이 없으면 가급적 기본값을 사용한다.

### @Table

`@Table`은 엔티티와 매핑할 테이블을 지정한다.

속성 1) `name` : 클래스 이름이 **MySQL 예약어와 겹치면 매핑되는 테이블 이름은 `복수형`으로 지정**한다.

  * 기본값은 **엔티티 이름**을 사용한다.

  * ex) Entity Class 이름 = **User** -> `@Table(name = "users")`

속성 2) `catalog` : 데이터베이스 catalog를 매핑한다.

속성 3) `schema` : 데이터베이스 schema를 매핑한다.

속성 4) `uniqueConstraints` : DDL 생성 시에 유니크 제약 조건을 생성한다.

### 예시 - User 클래스(엔티티)

> User 클래스(엔티티)

```java

package woorifisa.goodfriends.backend.user.domain;

import woorifisa.goodfriends.backend.global.common.BaseTimeEntity;
import woorifisa.goodfriends.backend.user.exception.InvalidUserException;

import javax.persistence.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Table(name = "users")
@Entity
public class User extends BaseTimeEntity {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-z0-9._-]+@[a-z]+[.]+[a-z]{2,3}$");

    private static final int MAX_NICKNAME_LENGTH = 20;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "profile_image_url", nullable = false)
    private String profileImageUrl;

    protected User() {
    }

    public User(String email, String nickname, String profileImageUrl) {
        validateEmail(email);
        validateNickname(nickname);
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    private void validateEmail(final String email) {
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        if (!matcher.matches()) {
            throw new InvalidUserException();
        }
    }

    private void validateNickname(final String nickname) {
        if(nickname.isEmpty() || nickname.length() > MAX_NICKNAME_LENGTH) {
            throw new InvalidUserException(String.format("이름은 1자 이상 %d자 이하여야 합니다.", MAX_NICKNAME_LENGTH));
        }
    }
    // getter
}
```

## 테이블 스키마 자동 생성

### 데이터베이스 스키마 자동 생성

> DDL이란 데이터베이스를 정의하는 언어이며, 데이터를 생성, 수정, 삭제하는 등의 데이터 전체의 골격을 결정하는 역할을 하는 언어이다.
> 
> 테이블 관련 명령어 : create(생성), alter(수정), drop(삭제), truncate(초기화)

DDL을 애플리케이션 실행 시점에 자동으로 생성해준다. (테이블 -> 객체 중심)

`데이터베이스 방언`(DB Dialect) 을 활용해서 데이터베이스에 적절한 DDL을 생성한다.

  * Hibernate의 경우엔 `persistence.xml`에서 hibernate.dialect 설정 값을 변경하면 된다.

  * 예를 들어, H2 Dialect 설정 코드는 `<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect" />` 이다.

```markdown
### Dialect란

SQL은 다음과 같이 표준 SQL인 ANSI SQL이 있으며, 이외에 각 DBMS Vendor(벤더, 공급업체)인 MS-SQL, Oracle, MySQL, PostgreSQL 에서 자신만의 기능을 추가한 SQL이 있다.


ANSI SQL은 모든 DBMS에서 공통으로 사용 가능한 핵심 표준 SQL이지만,
여러 제품의 DBMS에서는 자신만의 독자적인 기능을 위하여 추가적인 SQL을 만들었다.
이를 방언(Dialect)이라고 한다.

예를 들어, MS-SQL의 T-SQL 그리고 Oracle의 PL/SQL이 대표적이다.

다르게 비유를 하면, 대한민국 수도인 서울에서 사용하는 표준어가 있고, 강원도, 경상도, 전라도, 충정도 등의 여러 지방에서 사용하는 방언이 있는 것이라 볼 수 있다.

여기서 `ANSI`란 DBMS(Oracle, MySQL, Microsoft SQL, PostgreSQL) 들에서 각기 다른 SQL을 사용하므로 미국 표준 협회(American National Standards Institute)에서 이를 표준화하여 표준 SQL문을 정립시켜 놓은 것이다.

---

### JPA에서 Dialect 설정하기

JPA는 애플리케이션이 직접 JDBC 레벨에서 SQL을 작성하는 것이 아니라, JPA가 직접 SQL을 작성하고 실행하는 형태이다.

그런데 DBMS 종류별로 사용하는 SQL 문법이 다르므로 종류에 맞게 사용해야 한다.

예를 들어 JPA로 게시판을 개발할 때 DBMS마다 다른 데이터 타입, 함수명, 페이징 방법 등 다양한 부분에서 처리할 필요가 생기게 된다.
또한 각각 DBMS 벤더별로 다른 모듈을 개발해 주어야 한다.

만약 고객의 요구에 따라 MySQL DB를 기준으로 작성했던 게시판 프로그램을 Oracle SQL에 맞게 추가로 개발하려면 엄청난 비용이 들 것이다.

그러나 개발자가 JPA를 사용하게 되면 쿼리를 따로 작성할 필요도 없고 
JPA를 사용하더라도 DBMS별로 조금씩 다른 SQL 방언을 걱정할 필요가 없다.

왜냐하면 JPA에서는 이를 Dialect라는 **추상화된 방언 클래스**를 제공하고 각 벤더에 맞는 구현체를 제공하고 있기 때문이다.

JPA에선 설정을 통해 **원하는 Dialect만 설정해주면 해당 Dialect를 찾고하여 그에 맞는 쿼리를 생성**한다.

따라서 개발 시에 MySQL DB에 맞게 설정하고 애플리케이션을 개발하다가, 
실제로 고객의 환경이 Oracle DB로 사용중이라면
설정만 `OracleDialect`으로 변경해주면 된다. (Dialects: `org.hibernate.dialect.OracleDialect`)
```

![](/assets/img/jpa/JPA-Entity-Mapping-1.png)

이렇게 생성된 DDL은 **개발 장비에만 사용**한다.

생성된 DDL은 운영서버에는 사용하지 않거나, 적절하게 다듬어서 사용해야 한다.

> 데이터베이스 스키마 자동 생성 - 속성

`hibernate.hbm2ddl.auto`은 아래와 같은 속성들이 있다.

![](/assets/img/jpa/JPA-Entity-Mapping-2.png)

> 데이터베이스 스키마 자동 생성 - 주의

운영 장비에는 **절대 create, create-drop, update 사용하면 안된다.**

* 개발 초기 단계는 `create` 또는 `update`를 사용한다.

* 테스트 서버는 `update` 또는 `validate`를 사용한다.

* 스테이징과 운영 서버는 `validate` 또는 `none`을 사용한다.

### DDL 생성 기능

"회원 이름은 필수, 10자 초과X" 와 같은 제약 조건이 있을 경우,

  * 필드 위에 `@Column(nullable = false, length = 10)`을 써주면 된다.

또한 유니크 제약 조건을 아래와 같이 추가할 수도 있다.

  * `@Table(uniqueConstraints = {@UniqueConstraint( name = "NAME_AGE_UNIQUE", columnNames = {"NAME", "AGE"} )})`

이러한 DDL 생성 기능은 **DDL을 자동 생성할 때만 사용되고 JPA의 실행 로직에는 영향을 주지 않는다.**

## 필드와 컬럼 매핑

다음과 같은 요구사항이 추가된다고 가정해보자.

> 
> 1. 회원은 일반 회원과 관리자로 구분해야 한다.
> 2. 회원 가입일과 수정일이 있어야 한다.
> 3. 회원을 설명할 수 있는 필드가 있어야 한다. 이 필드는 길이 제한이 없다.

```java
package hellojpa;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class User extends BaseTimeEntity {

  @Id
  private Long id;

  @Column(name = "name", nullable = false)
  private String username;

  @Enumberated(EnumType.STRING) // enum 이름을 DB에 저장
  private RoleType roleType;

  @Temporal(TemporalType.TIMESTAMP) // 최신 하이버네이트에서 지원하는 LocalDate, LocalDateTime을 더 자주 사용한다.
  private Date createdDate;
  
  @Temporal(TemporalType.TIMESTAMP)
  private Date lastModifiedDate;

  @Lob
  private String description;
  
  // Getter, Setter ..
```

> 매핑 어노테이션 정리(hibernate.hbm2ddl.auto)

![](/assets/img/jpa/JPA-Entity-Mapping-3.png)

### @Column

`@Column`은 매핑에 대한 어노테이션 중에 가장 많이 쓰인다.

![](/assets/img/jpa/JPA-Entity-Mapping-4.png)

여기서 `unique(DDL)`을 컬럼에 사용할 경우, 랜덤 값처럼 나오므로, 운영 서버에 쓰일 수 없다.

그래서 보통 같은 방식인 `@Table`의 uniqueConstraints을 사용하는 방식을 선호한다.

### Enumerated

`@Enumerated`은 자바 enum 타입을 매핑할 때 사용한다.

![](/assets/img/jpa/JPA-Entity-Mapping-5.png)

주의할 것은 **`ORDINAL`을 사용 안하는게 좋다.** (굉장히 위험하다)

`ORDINAL`은 0부터 시작해서 숫자로 저장되기 때문에 데이터베이스에 저장되는 데이터 크기가 작은 장점을 가진다.

히지만, 고객의 새로운 요구사항이 추가될 때, 이미 저장된 enum의 순서를 변경할 수 없어서 해결할 수 없게 된다.

예를 들어, 기존에 enum 클래스인 RoleType에 `USER`, `ADMIN`이 있을 경우 0과 1로 저장이 된다.

```java
enum RoleType {
  USER, ADMIN // USER: 0, ADMIN: 1
}
```

여기서 `GUEST`라는 값을 `USER` 앞에 추가할 경우, 다음부터는 `GUEST`가 0으로 저장되어서 개발자가 해결하기 어려워진다.

```java
enum RoleType {
  GUEST, USER, ADMIN // GUEST: 0, USER: 1, ADMIN: 2
}
```

따라서 **개발할 때는 `EnumType.ORDINAL`는 사용하지 말고 이름을 저장하는 `EnumType.STRING`을 사용하자.**

### @Temporal

날짜 타입(java.util.Date, java.util.Calendar)을 매핑할 때 사용

최신 하이버네이트에서 지원하는 `@LocalDate`, `@LocalDateTime`을 사용한다.

![](/assets/img/jpa/JPA-Entity-Mapping-6.png)

### @Lob

`@Lob`은 데이터베이스 BLOB, CLOB 타입과 매핑한다.

* @Lob에는 지정할 수 있는 속성이 없다.

* 매핑하는 필드 타입이 문자면 CLOB 매핑, 나머지는 BLOB 매핑

    * CLOB: String, char[], java.sql.CLOB

    * BLOB: byte[], java.sql. BLOB

### @Transient

`@Transient`은 필드에 매핑되지 않고, 데이터베이스에도 저장 또는 조회가 안된다.

주로 **메모리 상에서만 임시로 어떤 값을 보관**하고 싶을 때 사용한다.

## 기본 키 매핑

기본 키 매핑 방법에는 **직접 할당**하는 `@Id`와 **자동으로 생성**해주는 `@GeneratedValue`가 있다.

`@GeneratedValue`에는 4가지 속성이 있다.

  * IDENTITY: 데이터베이스에 위임, MYSQL

  * SEQUENCE: 데이터베이스 시퀀스 오브젝트 사용, ORACLE, PostgreSQL, DB2, H2 데이터베이스에서 사용 -> @SequenceGenerator 필요

  * TABLE: 키 생성용 테이블 사용, 모든 DB에서 사용 -> @TableGenerator 필요

  * AUTO: 방언에 따라 자동 지정, 기본값

### IDENTITY 전략

`IDENTITY`는 기본 키 생성을 데이터베이스에 위임하는 걸 의미한다.

주로 MySQL, PostgreSQL, SQL Server, DB2에서 사용한다. (예: MySQL의 `AUTO_ INCREMENT`)

JPA는 보통 **트랜잭션 커밋 시점에 INSERT SQL 실행**하는데, `AUTO_ INCREMENT`는 **데이터베이스에 INSERT SQL을 실행한 이후에 ID 값**을 알 수 있다.

쉽게 말해, ID 값은 DB에 값이 들어가야 알 수 있다.

정리하면, `IDENTITY` 전략은 **em.persist() 시점에 즉시 데이터베이스에 INSERT SQL 실행 하고 DB에서 식별자를 조회**한다.

(보통은 트랜잭션 커밋 시점에 데이터베이스에 INSERT SQL 실행하는데, `IDENTITY` 전략은 커밋 하기전에 em.persist() 시점에 데이터베이스에 INSERT SQL 실행한다.)

단점이라고 하면, `IDENTITY`전략에서는 commit 하기 전에 `쓰기 지연 SQL 저장소`에 모으는게 불가능하다.

![](/assets/img/jpa/JPA-Entity-Mapping-7.png)

```java
package hellojpa;

@Entity
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

### SEQUENCE 전략

데이터베이스 시퀀스는 **유일한 값을 순서대로 생성**하는 특별한 데이터베이스 오브젝트이다. (예: 오라클 시퀀스)

주로 오라클, PostgreSQL, DB2, H2 데이터베이스에서 사용한다.

> SEQUENCE - @SequenceGenerator

주의할점 : allocationSize 기본값 = 50

![](/assets/img/jpa/JPA-Entity-Mapping-8.png)

```java
package hellojpa;

@Entity
@SequenceGenerator(
        name = “MEMBER_SEQ_GENERATOR",
        sequenceName = “MEMBER_SEQ", //매핑할 데이터베이스 시퀀스 이름
        initialValue = 1, allocationSize = 1)
public class Member {

    @Id 
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "MEMBER_SEQ_GENERATOR")
            private Long id,
}
```

### 권장하는 식별자 전략

* 기본 키 제약 조건: null이 아닌 유일한 값으로 변하면 안된다.

* 미래까지 이 조건을 만족하는 자연키는 찾기 어렵다. 따라서 대리키(대체키)를 사용하자.

* 예를 들어 주민등록번호, 연락처도 기본 키로 적절하지 않다.

* 권장하는 점은 **Long형 + 대체키 + 키 생성전략을 사용**하자.

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)

* [JPA에서 말하는 Dialect(방언)이란?](https://goodgid.github.io/What-is-Dialect/)