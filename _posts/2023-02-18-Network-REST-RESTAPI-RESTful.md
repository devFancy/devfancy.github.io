---
layout: post
title:  " REST, REST API, RESTful "
categories: Network
author: fancy96
---
* content
{:toc}

## REST

> `REST`(Representation State Transfer)란 자원을 이름으로 구분하여 해당 자원의 상태를 주고 받는 모든 것을 의미한다.

* HTTP URI(Uniform Resource Identifier)를 통해 자원을 명시하고, HTTP 메소드(GET, POST, PUT, PATCH, DELETE)를 통해 해당 자원(URI)에 대한 CRUD Operation을 적용하는 것을 의미한다.

* `CRUD Operation`이란 Create, Read, Update, Delete를 묶어서 읽컫는 말이다.

* REST 에서 CRUD Operation 동작 예시는 다음과 같다.(HTTP 메소드와 비교)

    * `Create` : 데이터 생성 <-> POST

    * `Read` : 데이터 조회 <-> GET

    * `Update` : 데이터 수정 <-> PUT, PATCH

    * `Delete` : 데이터 삭제 <-> DELETE

* 참고) [HTTP 메소드](https://fancy96.github.io/HTTP-3-Method/)에 가면, HTTP 메소드의 종류와 속성을 따로 정리해 두었다.

### REST 구성 요소

* 자원(Resource) : HTTP URI 형태로 나타낸다.

* 자원에 대한 행위(Verb) : HTTP Method를 나타낸다.

* 자원에 대한 행위의 내용(Representations) : HTTP Message Pay Load를 타나낸다.

### REST의 특징

> [1] Uniform Interface(인터페이스 일관성)

* HTTP 표준에만 따른다면, 안드로이드/IOS 플랫폼이든, 특정 언어나 기술에 종속하지 않고 **모든 플랫폼**에 사용할 수 있으며, URI로 지정한 리소스에 대한 조작이 가능한 아키텍쳐 스타일을 의미한다.

* 이러한 범용성을 갖추기 위해 REST API의 HTTP Response Body는 HTML 보다는 JSON, XML 등 여러 플랫폼에서 사용하기 적절한 단순한 텍스트 포맷을 사용한다.

(REST를 이야기 하면, HTTP + JSON을 쉽게 떠올리는데, JSON은 하나의 옵션일 뿐, 메시지 포맷을 꼭 JSON으로 적용해야할 필요는 없다)

> [2] Stateless(무상태)

* 작업을 위한 상태 정보를 따로 저장하지 않고 관리하지 않는다. 즉, 각 요청에 대한 컨텍스트(세션, 로그인 정보)가 서버에 저장되어선 안된다.

* 세션 정보나 쿠키 정보를 별도로 저장, 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 된다.

* 그래서 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않으므로 구현이 단순해진다.

> [3] Cacheable(캐시 처리 가능)

* REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹 표준을 그대로 사용하므로 웹에서 사용하는 기존 인프라를 그대로 활용이 가능하다.

* HTTP 프로토콜 기반의 로드 밸런서나 암호화(SSL)은 물론이고 HTTP가 가진 가장 강력한 특징중의 하나인 **캐싱 기능**을 적용할 수 있다.

* HTTP 프로토콜 표준에서 사용하는 `Last-Modified` 태그나 `E-Tag`를 이용하면 캐싱 구현이 가능하다.

> [4] Client-Server(클라이언트-서버 구조)

* REST 서버는 API를 제공하고, 제공된 API를 이용해서 **비즈니스 로직 처리 및 저장**을 책임진다.

* 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보) 등을 직접 관리하는 구조로 **각각의 역할이 확실히 구분**되기 때문에 클라이언트와 서버에서 개발해야 할 **내용이 명확**해지고 서로 간에 **의존성**이 줄어들게 된다.

> [5] Layered System(계층형 구조)

* 클라이언트는 보통 대상 서버에 직접 연결되었는지 중간 서버를 통해 연결 되었는지를 알 수 없다.

* 중간 서버는 **로드 밸런싱 기능**이나 **공유 캐시 기능**을 제공함으로써 시스템 규모의 확장성을 향상시키는데 유용하다.

* 클라이언트 입장에서는 REST API 서버만 호출할 수 있는 반면에, 서버는 **다중 계층**으로 구성될 수 있다.

* 순수 비즈니스 로직을 수행하는 API 서버와 그 앞단에 **사용자인증(보안), 로드 밸런싱, 암호화(SSL)** 계층을 추가해서 **구조상의 유연성**을 둘 수 있다.

* 그리고 Proxy, Gateway 같은 네트워크 기반의 중간매체를 사용할 수 있게 한다.

### REST의 장단점

> 장점

1. **HTTP 프로토콜의 표준**을 최대한 활용하여 여러 추가적인 장점을 함께 가져갈 수 있게 해준다.

2. HTTP 표준 프로토콜에 따르는 **모든 플랫폼**에서 사용이 가능하다.

3. REST API 메시지가 의도하는 바를 명확하게 나타내기 때문에 의도하는 바를 쉽게 파악할 수 있다.

4. 여러 가지 서비스 디자인에서 생길 수 있는 문제를 최소화한다.

5. 클라이언트와 서버의 역할을 명확하게 분리한다.

> 단점

1. REST는 **표준이 없어서** 관리가 어렵다.

2. HTTP 메소드 형태가 **제한적**이다.

3. 웹 브라우저를 통해 테스트해야할 일이 많은 서비스라면, 쉽게 고칠 수 있는 URI보다 Header 정보의 값을 처리해야 하므로 **전문성**이 요구된다.

4. 구형 브라우저에서 호환되지 않아, 익스플로어와 같은 지원이 안되는 동작이 많다.

## REST API

> `REST API`란 REST의 아키텍쳐 스타일을 따르는 API를 의미한다.

* `API`란 Application Programming Interface 약자로, 다른 소프트웨어 시스템과 통신하기 위해 따라야 하는 규칙을 의미한다.

### REST API 설계 가이드

[1] URI는 명사, 소문자를 사용해야 한다.

```text
Bad Example https://fancy96.github.io/Healthy
Good Example https://fancy96.github.io/health
```

[2] 마지막에 슬래시(/) 포함하지 않는다.

```text
Bad Example https://fancy96.github.io/health/
Good Example https://fancy96.github.io/health
```

[3] 언더바(_) 대신 가독성을 높이는 하이픈(-)을 사용한다.

```text
Bad Example https://fancy96.github.io/health_club
Good Example https://fancy96.github.io/health-club
```

[4] 파일 확장자(.png, .jpg)는 URI에 포함시키지 않는다.

```text
Bad Example https://fancy96.github.io/developer.png
Good Example https://fancy96.github.io/developer
```

[5] 행위를 포함하지 않는다.

```text
Bad Example https://fancy96.github.io/delete/post/1
Good Example https://fancy96.github.io/post/1
```

## RESTful

> `RESTful`은 일반적으로 REST라는 아키텍쳐를 구현하는 웹 서비스를 나타내기 위해 사용하는 용어이다.

* RESTful API 용어와 REST API 용어는 일반적으로 같은 의미로 사용하나, REST를 사용했다고 모두 RESTful 하다고 볼 수 없다.

* REST API의 설계 규칙을 제대로 지킨 시스템을 **RESTful**하다고 볼 수 있다

* 만약 모든 CRUD 기능을 REST API 혹은 URI 규칙대로 지키지 않았다면, REST API를 사용했다고 말하지만, RESTful 하지 못한 시스템이라고 말할 수 있다.

* RESTful의 목적은 **이해하기 쉽고 사용하기 쉬운 REST API**를 만드는 것이다.

* RESTful한 API를 구현하는 근본적인 목적이 성능 향상에 있는 것이 아니라 **일관적인 컨벤션**을 통한 API의 이해도 및 호환성을 높여주는 것이 주 목적이다.

* 성능 향상이 주 목적인 상황에서는 굳이 RESTful한 API를 구현할 필요는 없다.

### RESTful API 작동원리

1. 클라이언트가 서버에게 요청을 전송한다.

2. 서버가 클라이언트를 인증하고 해당 요청을 수행할 수 있는 권한이 클라이언트에 있는지 확인한다.

3. 서버가 요청을 수신하고 내부적으로 처리한다.

4. 서버가 클라이언트에 응답을 반환한다. 응답에는 요청이 성공했는지 여부를 클라이언트에게 알려주는 정보가 포함된다. 또한 클라이언트가 요청한 모든 정보도 포함된다.

## Review

* REST에 대한 개념을 공부했지만, 아직은 부족한 느낌이 든다.

* REST와 REST API, RESTful API에 대한 공부를 추가적으로 더 하면서 해당 블로그를 업데이트를 하자. 


## Reference

* [REST API + RESTful](https://github.com/Fancy96/2023-CS-Study/blob/main/Network/network_rest_api_restful.md)

* [REST API](https://goodgid.github.io/REST-API/#rest%EC%9D%98-%ED%8A%B9%EC%84%B1)

* [RESTful API란 무엇인가요?](https://aws.amazon.com/ko/what-is/restful-api/)