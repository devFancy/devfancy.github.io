---
layout: post
title:  " [Spring] Builder 패턴에 대한 이해와 사용 "
categories: Spring
author: devFancy
---
* content
{:toc}

## Builder 패턴이란?

* 객체를 정의하고 그 객체를 생성할 때 보통 생성자를 통해 생성하는 것을 생각한다.

* 하지만 생성자를 통해 객체를 생성하는데 몇 가지 단점이 있어 객체를 생성하는 별도 builder를 두는 방법이 있다.

* 이를 `Builder 패턴`이라고 한다.

```java
Profile profile = Profile.builder()
                    .name("junyong")
                    .age(20)
                    .address("seoul")
                    .build();
```

* 객체를 생성할 수 있는 빌더를 builder() 함수를 통해 얻고 거기에 셋팅하고자 하는 값을 넣고 마지막에 build() 를 통해 `Builder`를 작동시켜 객체를 생성한다.

## Builder를 써야 하는 이유

* 객체를 생성하는 방법이 생성자말고 `Builder`로 하는 방법이 있다.

* 그렇다면 `Builder` 패턴이 생긴 이유와 왜 사용하는 걸까?

> [1] 생성자 파라미터가 많을 경우 가독성이 좋지 않다.

* 위의 예시에서 Profile 클래스는 생성자 파라미터를 3개만 받는다.

* 하지만 생성자 파라미터로 받아야 하는 값이 많아진다면? 각 값들이 어떤 값을 의미하는지 이해하기 힘들 것이다.

```java
Profile profile = new Profile("junyong", 20, "seoul", "careful", "010-1234-5678", "student");
```

* 하지만 이를 `Builder 패턴`으로 구현하면 각 값들은 **`Builder`의 각 값들의 이름 함수로 셋팅이 되어 각각 무슨 값을 의미하는지 파악하기 쉽다.**

* 따라서 생성자로 설정해야 하는 값이 많을 경우 `Builder`를 쓰는 것이 생성자보다 **가독성이 좋다.**

* 이는 같은 타입의 다른 변수의 값을 서로 바꿔 넣는 것을 방지할 수 있다.

```java
Profile profile = Profile.builder()
                    .name("junyong")
                    .age(20)
                    .address("seoul")
                    .personality("careful")
                    .cellPhone("010-1234-5678")
                    .job("student")
                    .build();
```

> [2] 순서 상관이 없다.

* 생성자의 경우는 정해진 파라미터 순서대로 반드시 값을 넣어줘야 한다. 순서를 무시하고 값을 넣으면 에러가 발생한다.

```java
public Profile(String name, int age, String address) {
            this.name = name;
            this.age = age;
            this.address = address;
        }
```

* 하지만 `Builder 패턴`은 Builder 이름으로 값을 설정하기 때문에 순서에 종속적이지 않다.

* 그리고 

```java
Profile profile = Profile.builder()
                    .name("junyong")
                    .address("seoul") // age와 순서 바꿨음
                    .age(20)
                    .build();
```

> [3] 불변성을 확보할 수 있다.

* 또한 객체를 생성할 때 생성자가 아닌 `Setter` 방식(수정자 패턴)으로 사용하는 경우도 있다.

* 하지만 `Setter`를 사용하게 되면 불필요하게 확장 가능성을 열어두는 것이다.

* 이는 **`Open-Closed Principle`(개발 폐쇄 원칙)에 위배되고, 불필요한 코드 리딩을 유발한다.**

> `Open-Closed Principle`(OCP)이란 **기존의 코드를 변경하지 않으면서, 기능을 추가할 수 있도록 설계**가 되어야 한다는 원칙을 말한다. 
보통 OCP를 **확장에 대해서는 개방적(open)**이고, **수정에 대해서는 폐쇄적(closed)**이어야 한다는 의미로 정의한다.
여기서 확장이란 새로운 기능이 추가됨을 의미한다.
따라서 해석하자면, 기능 추가 요청이 오면 클래스를 확장을 통해 손쉽게 구현하면서, 확장에 따른 클래스 수정은 최소화 하도록 프로그램을 작성해야 하는 설계 기법을 말한다고 보면 된다.


* Setter 방식은 **필드 값에 대해서 불변성이 보장되지 않기 때문**에 특별한 경우가 아니라면 사용을 자제하는 편이 좋다.

* Builder 패턴을 사용함으로써 **Setter 생성을 방지하고 불변 객체로 만들 수 있다.**

## Lombok 없이 Java로 생성

* 생성자의 매개변수가 아래와 같이 많을 경우 보통 Builder 패턴을 이용하여 객체를 생성한다.

```java
public Profile(String name, int age, String address, String personality, String cellPhone, String job) {
}
```

* 위와 같이 생성자 매개변수의 수는 빠르게 처리할 수 없고 매개변수의 배열을 이해하기 어려워질 수 있다.

* 또한 앞으로 더 많은 옵션을 추가하려는 경우 이 매개변수의 목록이 계속 늘어나고, 그렇게 되면 관리하는 부분과 이미 생성되어 있는 것들을 수정하기 어려워지게 된다.

> Builder 패턴으로 생성자 Class 생성

```java
public final class Profile{
    private String name;
    private int age;
    private String address;
    private String personality;
    private String cellPhone;
    private String job;
    
    private Profile(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.address = builder.address;
        this.personality = builder.personality;
        this.cellPhone = builder.cellPhone;
        this.job = builder.job;
    }
    
    @Override
    public String toString() {
        return "Profile { " +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address=" + address +
                ", personality=" + personality +
                ", cellPhone=" + cellPhone +
                ", job=" + job +
                " }";
    }
}
```

> Builder Class 생성

```java
public static class ProfileBuilder {
    private final String name;
    private int age;
    private String address;
    private String personality;
    private String cellPhone;
    private String job;

    public ProfileBuilder(String name) {
        if ( name == null) {
            throw new IllegalArgumentException("name can not be null");
        }
        this.name = name;
    }
    
    public ProfileBuilder withAge(int age) {
        this.age = age;
        return this;
    }

    public ProfileBuilder withAddress(String address) {
        this.address = address;
        return this;
    }

    public ProfileBuilder withPersonality(String personality) {
        this.personality = personality;
        return this;
    }

    public ProfileBuilder withCellPhone(String cellPhone) {
        this.cellPhone = cellPhone;
        return this;
    }

    public ProfileBuilder withJob(String job) {
        this.job = job;
        return this;
    }
}
```

> Builder Class 실행

```java
public static void main(String [] args) {
    
    Profile profile = new ProfileBuilder()
        .name("junyong")
        .age(20)
        .adress("seoul")
        .personality("careful")
        .cellPhone("010-1234-5678")
        .job("student")
        .build();
    
    System.out.println(profile); // 결과: Profile { name=junyong, age=20, address=seoul, personality=careful, cellphone=010-1234-5678, job=student }
}
```

## Builder 패턴 사용법 (Lombok을 이용)

* `Builder` 패턴을 쉽게 사용하기 위해 Lombok에서 `Builder` 어노테이션을 제공해준다.

* `Builder` 어노테이션은 클래스 또는 생성자에 적용할 수 있다.

* 클래스에 적용을 해도 되지만, **모든 필드 값에 적용하기 때문에 id와 같이 세팅하는 값이 필드에 있을 수 있기 때문**에 생성자에 적용하는 것이 좋다.

* 아래의 Profile 클래스는 실제 프로젝트(히빗)를 했을 때 Builder 어노테이션을 생성자에 적용한 예시다. 

```java
@Table(name = "profiles")
@Entity
public class Profile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "members_id")
    private Member member;

    @Column(name = "nickname", length = 20, unique = true)
    private String nickname;

    @Column(name = "age")
    private int age;

    @Column(name = "gender")
    private int gender;

    @Column(name = "personality")
    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = PersonalityType.class)
    private List<PersonalityType> personality;

    @Column(name = "introduce", length = 200)
    private String introduce;

    @Column(name = "main_img", length = 100)
    private String mainImg;

    @ElementCollection
    private List<String> subImg;

    @Column(name = "job", length = 50)
    private String job;

    @Column(name = "address_city")
    @Enumerated(EnumType.STRING)
    private AddressCity addressCity;

    @Column(name = "address_distinct")
    @Enumerated(EnumType.STRING)
    private AddressDistrict addressDistrict;

    @Column(name = "ban")
    private int ban;

    @Column(name = "job_visible")
    private int jobVisible;

    @Column(name = "sub_img_visible")
    private int subImgVisible;

    @Column(name = "address_visible")
    private int addressVisible;

    protected Profile() {
    }

    @Builder
    public Profile(Member member, String nickname, int age, int gender, List<PersonalityType> personality,
                   String introduce, String mainImg, List<String> subImg, String job, AddressCity addressCity,
                   AddressDistrict addressDistrict, int jobVisible, int subImgVisible, int addressVisible) {
        this.member = member;
        this.nickname = nickname;
        this.age = age;
        this.gender = gender;
        this.personality = personality;
        this.introduce = introduce;
        this.mainImg = mainImg;
        this.subImg = subImg;
        this.job = job;
        this.addressCity = addressCity;
        this.addressDistrict = addressDistrict;
        this.jobVisible = jobVisible;
        this.subImgVisible = subImgVisible;
        this.addressVisible = addressVisible;
    }
    // 밑부분 생략
}
```

## Reference

* [빌더 패턴(Builder pattern)을 써야하는 이유, @Builder](https://pamyferret.tistory.com/67)

* [완벽하게 이해하는 OCP(개방 폐쇄 원칙)](https://inpa.tistory.com/entry/OOP-%F0%9F%92%A0-%EC%95%84%EC%A3%BC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-OCP-%EA%B0%9C%EB%B0%A9-%ED%8F%90%EC%87%84-%EC%9B%90%EC%B9%99)

* [[Spring] Builder 패턴 생성 및 장점 사용이유 설명 (코드 생성)](https://jung-story.tistory.com/131)