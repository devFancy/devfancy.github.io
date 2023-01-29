---
layout: post
title: " HTTP 웹 기본 지식 : HTTP 메서드 "
categories: HTTP
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [HTTP 웹 기본 지식 : HTTP 기본](https://fancy96.github.io/HTTP-1-Basic/)

2. [HTTP 웹 기본 지식 : HTTP 메세지](https://fancy96.github.io/HTTP-2-Basic/)

3. [HTTP 웹 기본 지식 : HTTP 메서드](https://fancy96.github.io/HTTP-3-Method/)

4. [HTTP 웹 기본 지식 : HTTP 메서드 활용](https://fancy96.github.io/HTTP-4-Method-Application/)

5. [HTTP 웹 기본 지식 : HTTP 상태코드](https://fancy96.github.io/HTTP-5-Status-Code/)

6. [HTTP 웹 기본 지식 : HTTP 헤더1 - 일반 헤더](https://fancy96.github.io/HTTP-6-Header1/)

7. [HTTP 웹 기본 지식 : HTTP 헤더2 - 캐시와 조건부 요청](https://fancy96.github.io/HTTP-7-Header2/)

## API URI 설계

* 예를 들면 요구사항에서 회원 정보 관리 API를 만드는 내용이 적혀져 있다.

* 이런 경우 좋은 URI 설계는 **리소스를 식별**하는 것이다. 여기서 리소스는 `회원`을 의미한다. 

    * **회원** 목록 조회 /members

    * **회원** 조회 /members/{id}

    * **회원** 등록 /members/{id}

    * **회원** 수정 /members/{id}

    * **회원** 삭제 /members/{id}

* URI는 리소스만 식별하므로 리소스와 해당 리소스를 대상으로 하는 **행위**를 분리시킨다. 여기서 행위는 `조회`, `등록`, `수정`, `삭제`을 의미한다.

* 행위(메서드)는 GET, POST, PUT, PATCH, DELETE 로 구분한다.

## HTTP 메서드 종류

* `GET` : 리소스를 **조회**한다.

* `POST` : 요청 데이터 처리, 주로 **등록**에 사용한다.

* `PUT` : 리소스를 **완전히 대체**한다. 해당 리소스가 없으면 생성한다.

* `PATCH` : 리소스를 **일부 변경**한다. (`PUT`은 모든 것을 변경한다)

* `DELETE` : 리소스를 **삭제**한다.

### GET

```text
GET /search?q=hello&hl=ko HTTP/1.1 
Host: www.google.com
```

* 리소스를 조회하는 역할로 서버에 전달하고 싶은 데이터는 query(쿼리 파라미터, 쿼리 스트링)를 통해 전달한다.


### POST

```text
POST /members HTTP/1.1 
Content-Type: application/json
{
"username": "hello", "age": 20
}
```

* [1] 새 리소스를 생성(등록)

    * 서버가 아직 식별하지 않는 새 리소스를 생성

* [2] 요청 데이터를 처리

    * 단순히 데이터를 생성하거나 변경하는 것을 넘어서 **프로세스를 처리해야 하는 경우**

    * 예시) 주문에서 결제완료 -> 배달시작 -> 배달완료 처럼 프로세스의 상태를 변경되는 경우

    * POST의 결과로 새로운 리소스가 생성되지 않을 수 있다.

    * 예시) POST /orders/{orderId}/start-delivery(**컨트롤 URL**)

* [3] 다른 메서드로 처리하기 애매한 경우

    * 만약 HTTP에서 PATCH를 받아들이지 못하는 경우 POST를 쓰면 된다.


### PUT

```text
PUT /members/100 HTTP/1.1 
Content-Type: application/json
{
"username": "hello", "age": 20
}
```

* 리소스를 완전히 대체한다. 리소스가 있으면 대체, 없으면 생성한다. (쉽게 말해 덮어버린다는 의미다)

* 클라이언트가 리소스를 식별하고 URI를 지정한다. => /members/100 

    * `POST`의 경우 리소스를 식별하지 못한다. => /members

### PATCH

```text
PATCH /members/100 HTTP/1.1 
Content-Type: application/json
{
"age": 50
}
```

* 리소스 일부를 대체(변경)한다.

### DELETE

```text
DELETE /members/100 HTTP/1.1 
Host: localhost:8080
```

* 리소스를 제거한다.

## HTTP 메서드의 속성

### 안전(Safe)

* 호출해도 리소스를 변경하지 않는다. 해당 리소스만 고려하기 때문에 로그가 쌓여서 장애가 발생하는 부분까지 고려하지 않는다.

    * 안전에 해당하는 메서드 : `GET`

### 멱등(Idempotent)

* 몇번을 호출하든 결과가 똑같다. 외부 요인으로 중간에 리소스가 변경되는 것 까지는 고려하지 않는다.

    * 멱등에 해당하는 메서드 : `GET`, `PUT`, `DELETE`, `HEAD`

* 활용) 자동 복구 메커니즘

### 캐시가능(Cacheable)

* 응답 결과 리소스를 캐시해서 실제로 사용하는 메서드는 `GET`, `HEAD` 가 있다.

    * 캐시가능에 해당하는 메서드 : `GET`, `HEAD`, `POST`, `PATCH`  

## Reference

* [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC/dashboard)
