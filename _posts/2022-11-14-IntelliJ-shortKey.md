---
layout: post
title:  " IntelliJ 유용한 단축키들 (Mac 기준) "
categories: IntelliJ
author: fancy96
---
* content
{:toc}

* Mac기준으로 인텔리제이를 쓰면서 유용한 단축키 기능들을 정리해보려고 한다.

* 정리한 이후에도 유용한 단축키를 알게되면 추가적으로 업로드를 할 예정이다.

## 단축키

### Getter & Setter 추가

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_1.png)

* cmd + n을 눌러서 Getter & Setter을 클릭한다.

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_2.png)

* id, name, grade 모두 선택하여 ok버튼을 클릭하면 아래와 같이 추가된 것을 확인할 수 있다.

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_3.png)

###  Import 추가

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_4.png)

* 다음과 같이 빨간 줄이 보이거나 혹은 import가 필요한 경우 option + enter를 누르면 Implement methods를 클릭하고

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_5.png)

* 해당 변수들을 클릭하고 ok버튼을 클릭하면 다음과 같이 자동으로 추가된 것을 확인할 수 있다.

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_6.png)

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_7.png)

### 해당 코드 자동으로 입력(세미콜론까지 추가)

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_8.png)

* cmd + shift + enter 누르면 세미콜론까지 자동으로 입력된다.

### 자동 정렬 기능

#### 클래스 한 구간에만 자동 정렬하기

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_9.png)

* 해당 클래스에서 cmd + A를 해서 지정한 다음

* cmd + option + L을 누르면 자동으로 정렬이 된다.

#### 패키지 모든 영역에 적용하고 싶다면 ?

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_10.png)

* 다음과 같이 하나의 패키지를 선택하고  cmd + option + L 누르면 아래와 같은 화면이 나오게 된다.

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_11.png)

* 여기서 "Run"이라는 버튼을 클릭하면 패키지 안에 있는 모든 클래스가 적용이 된다.


### 인스턴스 자동 완성 기능

![](/assets/img/intellij/IntelliJ-Auto-ShortKey_12.png)

* 위의 그림처럼 new 키워드로 객체를 생성한다.

* 그리고 해당 라인에서 option + enter를 치면, 다음과 같이 "introduce loval variable"이라는 일종의 알람이 나타난다.


![](/assets/img/intellij/IntelliJ-Auto-ShortKey_13.png)

* 그 상태에서 자동으로 엔터를 치면, 자동으로 선언부 완성됩니다.

### 자동 입력 기능

* psvm 을 입력하면 public static void main()이 자동으로 입력된다.

* soutv 를 입력하면 System.out.println()이 자동으로 입력된다.

### 변수 자동 생성

``` java
public static void main(String[] args) {
    new Member(id: 1L, name: "memberA", Grade.VIP);
}
```

* 여기서 cmd + option + v를 입력하면, new 앞에 변수가 자동으로 생성된다.

* (최근 IntelliJ 버전은 맨 앞에 `final`이라는 변수를 생성한다 )

``` java
public static void main(String[] args) {
   MemberA memberA =  new Member(id: 1L, name: "memberA", Grade.VIP);
}
```
