---
layout: post
title:  " Spring MVC 이해와 적용 "
categories: Spring
author: fancy96
---
* content
{:toc}

## Spring MVC

### MVC란 ?

* **소프트웨어 설계와 관련된 디자인 패턴**으로, 소프트웨어 공학에서의 ‘흔히 사용되는’ 설계 패턴을 의미한다.

### MVC 가 생겨난 이유

* 코드가 많아지고 길어질수록 나중에 기능을 수정할때마다 코드를 갈아엎어야 하는 경우가 많다.

* 한마디로 유지보수가 너무 불편한 경우가 있다.

* 그래서 프로그래머들이 **유지보수성, 애플리케이션의 확장성, 그리고 유연성이 증가하고, 중복코딩이라는 문제점 또한 사라지는 효과를 가질 수 있기 때문에** Spring MVC라는 구조를 만들었다.

---

### MVC 구조 맛보기

![](/assets/img/spring/spring-mvc-concept_1.png)

* **M**odel : 데이터와 관련된 부분

* **V**iew : 사용자한테 보여지는 부분

* **C**ontroller : Model과 View를 이어주는 부분

---

### MVC를 지키면서 코딩하는 방법

1. Model은 Controller와 View에 **의존하지 않아야 한다**.(Model 내부에 Controller와 View에 관한 코드가 있으면 안된다.)

2. View는 **`Model`에만 의존**해야하고, Controller에는 의존하면 안된다. (View 내부에 Model 코드만 있을 수 있고, Controller 코드는 있으면 안된다.)

3. View가 Model로부터 데이터를 받을 때, 사용자마다 다르게 보여주어야 하는 데이터에 대해서만 받아야 한다.

4. Controller는 **`Model`과 `View`에 의존**해도 된다.(Controller 내부에는 Model과 View의 코드가 있을 수 있다.)

5. View가 Model로부터 데이터를 받을 때, 반드시 Controller에서 받아야 한다.


### MVC의 장점

* 기능별로 코드를 분리하여 하나의 파일에 코드가 모이는 것을 방지하여 가독성과 코드의 재사용이 증가한다.

* 각 구성요소들을 독립시켜 협업을 할 때 맡은 부분의 개발에만 집중할 수 있어 개발의 효율성을 높여준다. 

* 개발 후에도 유지보수성과 확장성이 보장된다.

### MVC의 한계

* Model과 View는 서로의 정보를 갖고 있지 않는 독립적인 상태라고 하지만 Model과 View사이에는 Controller를 통해 소통을 이루기에 의존성이 완전히 분리될 수 없다.

* 복잡한 대규모의 프로그램의 경우 다수의 Model과 View가 Controller를 통해 연결되기 때문에, Controller가 불필요하게 커지는 현상이 발생하게 된다.

* 이러한 현상을 **Massive-View-Controller** 이라고 한다.

* 이를 보완하기 위해 MVP, MVVM, Flux, Redux등의 다양한 패턴들이 생겨났다.

---

## 더욱 더 체계적인 MVC

* 우아한테크코스 프리코스 미션들을 수행하면서 MVC 패턴에 대해 조금 더 체계적으로 이해할 필요가 있어서 추가하게 되었다.

* Controller, Service, Repository에 대해 개념을 정리해보자.

![](/assets/img/spring/spring-mvc-concept_2.png)

### Controller 란?

* Controller은 MVC에서 C에 해당 하며 주로 사용자의 요청을 처리 한 후 지정된 뷰에 모델 객체를 넘겨주는 역할을 한다.

* 즉 사용자의 요청이 진입하는 지점이며 요청에 따라 어떤 처리를 할지 결정을 Service에 넘겨준다.

### Controller을 사용하는 이유는 ?

* 카카오, 네이버와 같은 대규모 서비스에는 다양한 서비스들이 있다.

* 예를 들어 A 서비스, B 서비스, C 서비스 등등 있다고 가정하자.

* 그러면 다양한 서비스를 하나의 클래스에서 처리하는 것보다 Controller 이라는 **중간 제어자(컨트롤타워)**를 만드는 것이다.

* A 서비스에 대한 것은 A-Controller, B 서비스에 대한 것은 B-Controller, C 서비스에 대한 것은 C-Controller 처럼 **역할**에 따라 설계를 하고 코딩을 하면 **유지보수 비용**이 대폭 줄어들기 때문에 Controller를 사용하는 것이다.

### Service 란?

* Service에 대한 큰 틀을 다음과 같은 순서로 표현하자면,

1. Client가 요청(Request)을 보낸다.

2. Client Request에 맞는 URL을 Controller가 수신받는다.

3. Controller는 넘어온 요청을 처리하기 위해 Service를 호출한다.

4. Service는 알맞는 정보를 가공하여 Controller에게 데이터를 넘긴다.

5. Controller는 Service의 결과물을 Client에게 보낸다.

* 이처럼 Service는 **알맞는 정보를 가공**하여 Controller에게 전달해주는 역할이다. 다른 말로 '**비즈니스 로직을 수행한다**'라고 한다.

* Service는 알맞는 정보를 가공하기 이전에, Repository에 데이터를 등록, 조회, 수정, 삭제를 명령하는 메서드들이 있다.

* 즉, Repository로부터 데이터를 가져와서 알맞는 정보로 가공하여 Controller에게 전달해준다.

### Repository 란?

* Entity에 의해 생성된 **DB에 접근**하는 메서드 들을 사용하기 위한 인터페이스이다.

* 쉽게 말해 DB 연결, 해제, 자원을 관리하고 CRUD 작업을 처리한다.

* 여기서 CRUD는 등록, 조회, 수정, 삭제를 의미한다.

---

## MVC 적용

* 우아한테크코스4기 최종미션에 나왔던 **페어매칭관리 애플리케이션**을 MVC패턴을 적용하면서 해당 개념들을 조금 더 이해하게 되었다.

[페어매칭관리 애플리케이션](https://github.com/woowacourse/java-pairmatching-precourse)

[Pull request 주소](https://github.com/fancy-log/java-pairmatching-precourse-review/pull/1)

### 클래스 다이어그램

* IntelliJ에서 제공하는 다이어그램 기능을 통해 클래스 다이어그램을 다음과 같이 만들었다.

![](/assets/img/spring/spring-mvc-concept_3.png)

* Application()을 중심으로 Controller(빨간색 표시)와 Service(파랑색 표시)를 구분하였다.


### 페어매칭 MVC 구조

* 코드를 작성한 체계는 다음과 같이 구성했다.

![](/assets/img/spring/spring-mvc-concept_4.png)

* **Controller** : View 와 Service 에 위치한 메서드를 호출하여 최종적인 단일 기능의 메서드를 생성하는 부분.

* **Domain(Model)** : 해당 프로그램에서 사용되는 객체 클래스 파일이 담겨 있는 부분(데이터)

* **Repository** : Entity(domain 에 있는 클래스)에 의해 생성된 DB에 접근하는 메서드 들을 사용하기 위한 인터페이스.

* **Service** : Controller 로부터 알맞는 정보를 가공하는 부분.

* **Utils** : 에러 처리 밎 유효성 검사하는 부분.

* **View** : 사용자 입출력에 해당하는 부분.

---

## 참고

* [[10분 테코톡] 제리의 MVC 패턴](https://www.youtube.com/watch?v=ogaXW6KPc8I&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9CTech)

* [Controller-Service-Repository가 무엇일까](https://velog.io/@jybin96/Controller-Service-Repository-가-무엇일까)

* [MVC패턴이란?](https://seongwon.dev/ETC/20211207_MVC%ED%8C%A8%ED%84%B4%EC%9D%B4%EB%9E%80/)
