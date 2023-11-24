---
layout: post
title:  " [JPA] 고급 매핑 (상속관계 매핑, BaseEntity) "
categories: JPA
author: devFancy
---
* content
{:toc}

> 이 글은 [자바 ORM 표준 JPA 프로그래밍 - 기본편] 강의를 듣고 정리한 내용입니다.

## 상속관계 매핑

* 관계형 데이터베이스에는 상속 관계가 없다.

* 대신에 관계형 데이터베이스는 **슈퍼타입 서브타입 관계**라는 모델링 기법이 객체 상속과 유사하다.

![](/assets/img/jpa/JPA-Advanced-Mapping-1.png)

* 왼쪽이 `슈퍼타입 서브타입 논리 모델`이고, 오른쪽이 `객체 상속 모델`이다.

* `상속관계 매핑`이란 관계형 데이터베이스의 슈퍼타입 서브타입 논리 모델을 실제 물리 모델로 구현하는 방법을 말한다.

* 상속관계 매핑하는 방법에는 3가지 방법이 있다.

    * `조인 전략`: 각각 테이블로 변환

    * `단일 테이블 전략`: 통합 테이블로 변환

    * `구현 클래스마다 테이블 전략`: 서브타입 테이블로 변환

### 주요 어노테이션

* `@Inheritance(strategy=InheritanceType.XXX)`

    * `JOINED` : 조인 전략 (InheritanceType.JOINED)

    * `SINGLE_TABLE` : 단일 테이블 전략 (InheritanceType.JOINED)

    * `TABLE_PER_CLASS` : 구현 클래스마다 테이블 전략 (InheritanceType.TABLE_PER_CLASS)

* `@DiscriminatorColumn(name=“DTYPE”)` : 부모에서 **구분 컬럼을 지정**할 때 사용한다. 기본값이 `DTYPE`이므로 name 속성은 생략 가능하나, 작성하는 것이 협업하기 있어서 좋다. 

* `@DiscriminatorValue(“XXX”)` : 자식에서 구분 컬럼에 입력할 값을 지정할 때 사용한다. 기본값은 `엔티티 이름`이다.

* `@PrimaryKeyJoinColumn(name = "Book_ID")` : 기본 값으로 자식 테이블은 부모 테이블 id 컬럼명을 그대로 사용하나, 변경 시 해당 설정값을 추가해줘야 한다.

### 조인 전략

* `조인 전략`은 엔티티마다 모두 테이블로 만들어주고 부모의 기본키를 `기본키 + 외래키`로 사용한다.

* 그래서 조회할 때 조인을 사용한다.

* 다만 객체는 타입이 있는데 **테이블은 타입에 개념이 없어서 따로 컬럼을 추가**해줘야 한다.

    * ex) `@DiscriminatorColumn(name = "DTYPE")`

![](/assets/img/jpa/JPA-Advanced-Mapping-2.png)

```java
// Item 엔티티
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "DTYPE")
public abstract class Item{
	@Id @GeneratedValue
	@Column(name = "ITEM_ID")
	private Long id;
	
	private String name;
	private int price;
	
	...
}

// Album 엔티티
@Entity
@DiscriminatorValue("A")
public class Album extends Item {
	private String artist;
	...
}

// Movie 엔티티
@Entity
@DiscriminatorValue("M")
public class Movie extends Item {
	private String director;
	private String actor;
	...
}

// Book 엔티티
@Entity
@DiscriminatorValue("B") 
public class Book extends Item {
    private String author;
    private String isbn;
}
...
``` 

* Item 엔티티에서 상속 매핑을 하기 위해서 `@Inheritance` 추가하고, 조인 전략을 사용하기 위해 `InheritanceType.JOINED`을 추가한다.

* 그리고 부모에서 구분 컬럼을 지정한다. -> `@DiscriminatorColumn(name = "DTYPE")`

* 자식들은 구분 컬럼을 어떻게 저장할지 작성한다.

    * `Album 엔티티`는 부모로부터 DTYPE에 `A`라는 값으로 저장된다. -> `@DiscriminatorValue("A")`

    * `Movie 엔티티`는 부모로부터 DTYPE에 `M`라는 값으로 저장된다.

    * `Book 엔티티`는 부모로부터 DTYPE에 `B`라는 값으로 저장된다.

* 자식 엔티티에는 Id가 없는데 부모 테이블에서 Id를 자식 테이블에서 그대로 사용한다.

    * 만약 자식 테이블 기본 컬럼명을 따로 설정하려면 `@PrimaryKeyJoinColumn`을 사용한다.

```java
// Book 엔티티
@Entity
@DiscriminatorValue("B")
@PrimaryKeyJoinColumn(name = "BOOK_ID")
```

* 위처럼 Book 테이블에서 Id 컬럼명은 `BOOK_ID`(이전: ITEM_ID)로 된다.

#### 조인 전략 장단점

* 장점

    * 테이블이 정규화가 된다.

    * 외래 키 참조 무결성 제약조건을 활용할 수 있다. -> 외래 키 참조로 `ITEM_ID`로 ITEM 테이블만 확인해도 된다.

        * `참조 무결성 제약조건`이란 자식 릴레이션의 외래 키의 값은 **참조된 부모 릴레이션의 기본 키 값과 같아야 하며**, 자식 릴레이션의 값이 변경될 때 부모 릴레이션의 제약을 받는다는 조건을 말한다.

        * `외래 키`는 NULL 값이거나 또는 부모 테이블의 기본 키 or 고유 키 값과 동일해야 한다.

    * 저장공간을 효율적으로 사용할 수 있다.

* 단점

    * 조회시 조인을 많이 사용해서 성능이 저하된다.

    * 조회 쿼리가 복잡하다.

    * 데이터 저장시 INSERT SQL을 2번 호출한다.

### 단일 테이블 전략

* `단일 테이블 전략`은 말 그대로 **테이블을 하나로 합치는 전략**이다.

* 구분 컬럼(DTYPE)을 통해 어떤 자식 데이터가 저장되었는지 알 수 있다.

![](/assets/img/jpa/JPA-Advanced-Mapping-3.png)

* 조인 전략과 형식은 비슷한데, 부모 테이블에 `@Inheritance`에 `(strategy = InheritanceType.SINGLE_TABLE)`을 지정한다.

* 또한 **모든 테이블이 하나로 통합되어 있기 때문에 `구분 컬럼`은 필수**다.

```java
// Item 엔티티
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DisciminatorColumn(name = "DTYPE")
...

// 자식 엔티티
@Entity
@DiscriminatorValue("A")
...

@Entity
@DiscriminatorValue("M")

@Entity
@DiscriminatorValue("B")
...
```

#### 단일 테이블 전략 장단점

* 장점

    * 테이블이 하나이므로 조인이 필요없기 때문에 일반적으로 조회 성능이 빠르다.

    * 조회 쿼리가 단순하다.

* 단점

    * 자식들을 모두 하나의 테이블로 만들었기 때문에, **자식들마다 컬럼이 달라서 null 값이 많을 수 있다.** -> null 값 허용 예) Album 엔티티에는 ACTOR 컬럼을 쓰지 않아 null 이다.

    * 단일 테이블에 모든 것이 저장되므로 **테이블이 커질 수록 조회 성능이 오히려 느릴 수 있다.**

### 구현 클래스마다 테이블 전략

* `구현 클래스마다 테이블 전략`은 자식 테이블이 부모 테이블의 모든 것을 다 가지고 있는 형태이다. 그래서 자식 엔티티마다 테이블을 다 만들어준다.

![](/assets/img/jpa/JPA-Advanced-Mapping-4.png)

* 이 전략은 **데이터베이스 설계자와 ORM 전문자 둘다 추천하지 않는 전략**이다.

```java
// Item 엔티티
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
...

// 자식 엔티티
@Entity
@DiscriminatorValue("A")
...

@Entity
@DiscriminatorValue("M")

@Entity
@DiscriminatorValue("B")
...
```

* 부모 테이블에 `@Inheritance`에 `(strategy = InheritanceType.TABLE_PER_CLASS)`을 지정한다.

#### 구현 클래스마다 테이블 전략 장단점

* 장점

    * 서브 타입을 구분해서 처리할 때 효과적이다.

    * not null 제약조건을 사용할 수 있다. (각각의 테이블을 가지고 있기 때문)

* 단점

    * 여러 자식 테이블을 함께 조회할 때 성능이 느리다. (SQL에 `UNION`을 사용한다)

    * 자식 테이블을 통합해서 쿼리하기가 어렵다.

## @MappedSuperclass

* 위에서는 부모-자식 클래스 모두 데이터베이스 테이블과 상속 관계로 매핑했는데, 여기선 다르다.

* **객체 입장에서 부모 클래스를 자식 클래스에게 매핑 정보만 제공**하고 싶을때, `@MappedSuperclass` 를 사용한다.

* `@Entity`가 있는 클래스의 경우 실제 테이블과 매핑되지만, **`@MappedSuperclass`를 사용한 클래스는 실제 테이블과 매핑되지 않고, 공통 매핑 정보가 필요할 때 사용할 목적**으로만 사용된다.

* 아래 그림처럼 id, name과 같은 공통 매핑 정보가 필요할 때 `BaseEntity` 클래스를 만들어서 Member와 Seller로부터 상속받게 설계를 한다.

![](/assets/img/jpa/JPA-Advanced-Mapping-5.png)

```java
// BaseEntity
@MappedSuperclass
public abstract class BaseEntity{
	@Id @GeneratedValue
	private Long id;
	
	private String name;
	...
}

// Member 엔티티
@Entity
public class Member exteds BaseEntity{
	// ID, NAME 상속
	private String email;
	...
}

// Seller 엔티티
@Entity
public class Seller exteds BaseEntity{
	// ID, NAME 상속
	private String shopName;
	...
}
```

* `@MappedSuperclass` 특징을 정리하면 아래와 같다.

  * 상속관계 매핑이 아니다.

  * 그래서 엔티티도 아니고 테이블과 매핑하지도 않는다.

  * 부모 클래스를 상속 받은 **자식 클래스에 매핑 정보만 제공**해준다.

  * 직접 생성해서 사용할 일이 없기 때문에 **추상 클래스로 사용하는 것을 권장**한다.

  * 엔티티와 다르게 `BaseEntity` 추상 클래스에는 **조회나 검색이 불가능**하다.

* 정리하면, `@MappedSuperclass`는 테이블과 관계 없고, 단순히 엔티티가 **공통으로 사용하는 매핑 정보를 모으는 역할**이고,

  주로 등록일, 수정일, 등록자, 수정자와 같은 전체 엔티티에서 **공통적으로 적용하는 정보를 모을 때 사용**한다.

### 실제 예시

[굿프렌즈](https://github.com/woorifisa-projects/GoodFriends) 프로젝트에서 몇몇 테이블에 **등록 시간과 수정 시간이 공통적으로 필요**해서, `@MappedSuperclass`을 사용했다.

* 회원, 상품, 주문, 신고 테이블에 **등록 시간과 수정 시간이 필요**해서 `BaseTimeEntity` 추상 클래스를 만들어서 상속받도록 했다.

  프로필, 신고 테이블에는 **등록 시간만 필요**해서 `BaseCreateTimeEntity` 추상 클래스를 만들어서 상속받도록 했다.

* `굿프렌즈` 프로젝트에서는 공통으로 쓰는 클래스를 global -> common 패키지에 넣어두었다.

  * 참고로 `@EntityListeners(AuditingEntityListener.class)`에 대한 부분은 나중에 다른 포스팅에서 설명할 에정이다.

> BaseTimeEntity - 등록 시간, 수정 시간

```java
package woorifisa.goodfriends.backend.global.common;


import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@SuperBuilder
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class) // 3, 4
public abstract class BaseTimeEntity {

    @CreatedDate // 1
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate // 1
    @Column(name = "last_modified_at", nullable = false)
    private LocalDateTime lastModifiedAt;

    public BaseTimeEntity() {
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastModifiedAt() {
        return lastModifiedAt;
    }
}
```

> BaseCreateTimeEntity - 등록 시간

```java
package woorifisa.goodfriends.backend.global.common;

import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@SuperBuilder
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseCreateTimeEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public BaseCreateTimeEntity() {
    }

    public LocalDateTime getCreatedDate() {
        return createdAt;
    }
}
```

> 회원 테이블(User) - BaseTimeEntity 추상 클래스로부터 상속받음

```java
package woorifisa.goodfriends.backend.user.domain;

import lombok.experimental.SuperBuilder;
import woorifisa.goodfriends.backend.global.common.BaseTimeEntity;
import woorifisa.goodfriends.backend.user.exception.InvalidUserException;

import javax.persistence.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@SuperBuilder
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

  private int ban;

  private  boolean activated = true;

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
  // getter, update 생략
}
```

> 프로필 테이블(Profile) - BaseCreateTimeEntity 추상 클래스로부터 상속받음

```java
package woorifisa.goodfriends.backend.profile.domain;

import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import woorifisa.goodfriends.backend.global.common.BaseCreateTimeEntity;
import woorifisa.goodfriends.backend.user.domain.User;

import javax.persistence.*;

@SuperBuilder
@Table(name = "profiles")
@Entity
public class Profile extends BaseCreateTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "mobile_phone")
    private String mobileNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "account_type")
    private AccountType accountType;

    @Column(name = "account_number")
    private String accountNumber;

    protected Profile() {
    }

    public Profile(User user, String mobileNumber, String address, AccountType accountType, String accountNumber) {
        this.user = user;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.accountType = accountType;
        this.accountNumber = accountNumber;
    }
    // getter, update 생략
}
```

## Reference

* [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)

* [[굿프렌즈] 프로젝트 URL](https://github.com/woorifisa-projects/GoodFriends)