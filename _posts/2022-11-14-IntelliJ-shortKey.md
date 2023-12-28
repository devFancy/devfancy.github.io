---
layout: post
title:  " IntelliJ 유용한 단축키들 (Mac 기준) "
categories: IntelliJ
author: devfancy
---
* content
{:toc}

* Mac기준으로 인텔리제이를 쓰면서 유용한 단축키 기능들을 정리해보려고 한다.

* 정리한 이후에도 유용한 단축키를 알게되면 추가적으로 업로드를 할 예정이다.

## 단축키

### Getter & Setter 추가 / this 추가 / toString 추가

* `cmd + n`을 눌러서 Getter & Setter을 클릭하고 원하는 변수를 선택하여 ok 버튼을 클릭하면 자동으로 추가된다.

* `cmd + n`을 눌러서 Constructor을 클릭하여 위와 같은 방식으로 처리하면 this가 자동으로 추가된다.

* `cmd + n`을 눌러서 `toString` 을 입력하여 클릭하고 위와 같은 방식으로 처리하면 toString이 자동으로 추가된다.

###  Import 추가 / 이름 변경(클래스, 메서드 , 패키지)

* import가 필요한 경우 `option + enter`를 누르면 "Implement methods" 를 선택한 다음에 

* 해당 변수들을 선택하고 ok버튼을 클릭하면 다음과 같이 자동으로 추가된 것을 확인할 수 있다.

* 이름을 변경하고 싶으면 `option + enter`를 누르고 "Rename file"을 선택하면 된다.

### 변수 (세미콜론까지) 자동으로 입력

* `cmd + shift + enter` 누르면 세미콜론까지 자동으로 입력된다.

### 자동 정렬 기능

* `cmd + option + L`을 누르면 자동으로 정렬이 된다.

### 변수 선언 및 return 부분을 합치는 기능

방법1 : `control + t` 누르고 Inline Variable 클릭하면 된다.

방법2 : `cmd + option + n` (Inline Variable 단축키)

> 방법2 예시

[변경 전]

```java
public class MemberRepository {
    /* ... */
    
    public List<Member> findALl() {
        List<Member> result = em.createQuery("select m from Member m", Member.class)
            .getResultList();
        return result;

    }
}
```

* 변수를 선언한 이후에 해당 {} 안을 깔끔하게 합치려면, `cmd + option + n`을 누르면 다음과 같이 단축된다.

[변경 후]

```java
public class MemberRepository {
    /* ... */
    
    public List<Member> findALl() {
        return em.createQuery("select m from Member m", Member.class)
            .getResultList();

    }
}
```



* `cmd + option + n`을 누르면

#### 패키지 모든 영역에 적용하고 싶다면 ?

* 하나의 패키지를 선택하고  `cmd + option + L` 누르고

* "Run"이라는 버튼을 클릭하면 패키지 안에 있는 모든 클래스가 적용이 된다.

### 자동 입력 기능

* `psvm` 을 입력하면 public static void main()이 자동으로 생성된다.

* `soutv` 를 입력하면 System.out.println()과 변수명을 자동으로 생성된다.

* `iter` 를 입력하면 for()문이 자동으로 생성된다.

### 검색

* 경로내(파일내) 검색하기 : `cmd + shift + f`

* **전체 검색하기** : `shift` 두번(연속으로)

* 최근 파일 열기 : `ctrl + E`

* **사용하는 코드 추적하기** : 해당 클래스 / 메서드에서 `cmd + B`

### 코드 Edit

#### 변수 자동 생성

``` java
public static void main(String[] args) {
    new Member(id: 1L, name: "memberA", Grade.VIP);
}
```

* 방법1) 여기서 `cmd + option + v`를 누르면, new 앞에 변수가 자동으로 생성된다.

* (최근 IntelliJ 버전은 맨 앞에 `final`이라는 변수를 생성한다)


``` java
public static void main(String[] args) {
   final MemberA memberA =  new Member(id: 1L, name: "memberA", Grade.VIP);
}
```

* 방법2) * 그리고 해당 라인에서 `option + enter`를 치면, 다음과 같이 "introduce loval variable"이라는 일종의 알람이 나타난다.

* 그 상태에서 `enter`를 치면, 자동으로 선언부가 완성된다.

#### 메서드 추출하기

``` java
//* 메서드  추출전
public MemberService memberService() {
    return new MemberServiceImpl(new MemoryMemberRepository());
}
```

* `new MemoryMemberRepository`을 드래그 한 다음에 `cmd + option + m`을 입력하고

* 메서드 이름을 `memberRepository`로 입력하면 아래와 같이* 메서드 가 추출된다.

``` java
//* 메서드  추출후
public MemberService memberService() {
    return new MemberServiceImpl(memberRepository());
}
private MemberRepository memberRepository() {
    return new MemoryMemberRepository();
}
```

#### 한 줄 복사하기

* `cmd + d`를 입력하면 복사가 된다.

#### 한 줄 삭제하기

* `cmd + x`를 입력하면 삭제가 된다.

#### 과거 히스토리 확인

* `cmd + e`를 입력하면 과거 히스토리를 확인할 수 있다.

## 테스트코드

### 테스트코드 자동 추가

* 메서드 이름앞에서 `cmd + shift + T` 를 누르면 "Create New Test"를 클릭하고

![](/assets/img/intellij/intellij_shortKey_testCode.png)

* 원하는 테스트코드 라이브러리를 선택하고 이름을 지은 후에 Ok버튼을 클릭하면 test폴더에 패키지와 클래스가 자동으로 추가된다.

### Assertions 없이 assertThat()만 사용하기

> static import문을 사용하면 static 멤버를 호출할 때 클래스명을 생략할 수 있다.

``` java
// static import 선언전
Assertions.assertThat(discount).isEqualTo(1000);
```

* 예를 들어, 어떤 조건이 참인지 아닌지 검증하는 `org.assertj.core.api.Assertions` 라이브러리의 assertThat()은 위와 같이 사용된다.

* Assertions 앞에서 `option + enter`를 누르고, `Add on-demand static import`을 선택하면 

``` java
// static import 선언후
import static org.assertj.core.api.Assertions.*;
```

* import static이 추가가 되면서 Assertions 없이 assertThat()만 사용할 수 있다.


### main <-> test 이동하기

* `cmd + shift + t`를 입력하면 **테스트 -> 메인** 혹은 **메인 -> 테스트**와 같이, 비슷한 이름의 클래스로 편리하게 이동할 수 있다.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
