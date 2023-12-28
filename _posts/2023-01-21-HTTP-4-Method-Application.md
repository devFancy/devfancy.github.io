---
layout: post
title: " HTTP 웹 기본 지식 : HTTP 메서드 활용 "
categories: HTTP
author: devfancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [HTTP 웹 기본 지식 : HTTP 기본](https://devfancy.github.io/HTTP-1-Basic/)

2. [HTTP 웹 기본 지식 : HTTP 메세지](https://devfancy.github.io/HTTP-2-Basic/)

3. [HTTP 웹 기본 지식 : HTTP 메서드](https://devfancy.github.io/HTTP-3-Method/)

4. [HTTP 웹 기본 지식 : HTTP 메서드 활용](https://devfancy.github.io/HTTP-4-Method-Application/)

5. [HTTP 웹 기본 지식 : HTTP 상태코드](https://devfancy.github.io/HTTP-5-Status-Code/)

6. [HTTP 웹 기본 지식 : HTTP 헤더1 - 일반 헤더](https://devfancy.github.io/HTTP-6-Header1/)

7. [HTTP 웹 기본 지식 : HTTP 헤더2 - 캐시와 조건부 요청](https://devfancy.github.io/HTTP-7-Header2/)

## 클라이언트에서 서버로 데이터 전송

* 데이터 전달 방식은 크게 2가지

    * 쿼리 파라미터를 통한 데이터 전송 : GET - 주로 정렬 필터(검색어)

    * 메세지 바디를 통한 데이터 전송 : POST, PUT, PATCH - 회원 가입, 상품 주문, 리소스 등록, 리소스 변경

* 클라이언트에서 서버로 데이터 전송하는 4가지 상황은 다음과 같다.

### 1. 정적 데이터 조회

* 이미지, 정적 텍스트 문서

* 조회는 `GET`을 사용한다.

* 정적 데이터는 쿼리 파라미터 없이 리소스 경로로 단순하게 조회가 가능하다.

### 2. 동적 데이터 조회

* 주로 검색, 게시판 목록에서 정렬 필터(검색어)

* 조회 조건을 줄여주는 피렅, 조회 결과를 정렬하는 정렬 조건에 주로 사용한다.

* 마찬가지로 `GET`을 사용한다.

### 3. HTML Form을 통한 데이터 전송

* HTML Form submit 할 때 POST로 전송한다. 

    * 회원 가입, 상품 주문, 데이터 변경

* HTML Form 전송은 **GET, POST**만 지원하므로 제약이 있다.

* Content-Type : multipart/form-data - 파일 업로드 같은 바이너리 데이터 전송시 사용한다. 

### 4. HTML API 데이터 전송

* 서버 to 서버 - 백엔드 시스템 통신

* 앱 클라이언트 - 아이폰, 안드로이드

* 웹 클라이언트 - HTML에서 Form 전송 대신 자바 스크립트를 통한 통신에 사용(AJAX) ex) React, VueJs 같은 웹 클라이언트와 API 통신

* GET : 조회, 쿼리 파라미터로 데이터를 전달한다.

* POST, PUT, PATCH : 메세지 바디를 통해 데이터를 전송한다.

* Content-Type : application/json을 주로 사용한다. (사실상 표준) - TEXT, XML, JSON 등등

## HTTP Form 사용

* 회원 관리 시스템에서 HTML FORM을 사용하면 다음과 같다.

   * 회원 목록 /members -> **GET**

    * 회원 등록폼 /members -> **GET**

    * 회원 등록 /members/new, /members -> **POST**

    * 회원 조회 /members/{id} -> **GET**

    * 회원 수정폼 /members/{id}/edit -> **GET**

    * 회원 수정 /members/{id}/edit, /members/{id} -> **POST**

    * 회원 삭제 /members/{id} -> **POST**

* HTML Form은 GET, POST만 지원하므로 제약이 있기 때문에 이런 제약을 해결하기 위해 `컨트롤 URI`를 사용한다.

* 컨트롤 URI는 동사로 된 리소스 경로를 사용하고 여기서는 POST의 /new, /edit, /delete가 컨트롤 URI에 해당한다.

* HTTP 메서드로 해결하기 애매한 경우에도 사용한다. (HTTP API 포함)

## HTTP API 설계

### API 설계 - POST 기반 등록

* 회원 관리 시스템에서 API 설계를 POST 기반 등록을 했을 경우 다음과 같이 설계한다.

    * 회원 목록 /members -> **GET**

    * 회원 등록 /members -> **POST**

    * 회원 조회 /members/{id} -> **GET**

    * 회원 수정 /members/{id} -> **PATCH, PUT, POST**

    * 회원 삭제 /members/{id} -> **DELETE**

* 회원 관리 시스템 API 설계에서 POST 기반의 등록인 경우 클라이언트는 등록될 리소스의 URI를 모르고 서버에게 넘겨주고, 서버는 새로 등록된 URI를 생성해준다. 이런 스타일의 관리를 `Collection(컬렉션)`이라고 한다.

* 컬렉션에서는 서버가 리소스 URI를 결정하고 관리를 한다.

* 반면에 PUT 기반의 등록인 경우 클라이언트가 직접 리소스의 URI를 지정한다. 이런 스타일의 관리를 `Store(스토어)` 라고 한다.

* 대부분 실제 실무에서는 **POST 기반의 등록(Collection 기반)** 을 주로 사용한다.

## 정리

* 문서 - 단일 개념(파일 하나, 객체 인스턴스, 데이터베이스 row)

    * 예) /members/100, /files/star.jpg

* 컬렉션 - 서버가 관리하는 리소스 디렉터리. 서버가 리소스의 URI를 생성하고 관리한다.

* 스토어 - 클라이언트가 관리하는 자원 저장소. 클라이언트가 리소스의 URI를 알고 관리한다.

* 컨트롤러, 컨트롤 URI - 문서나 컬렉션, 스토어로 해결하기 어려운 부분에 대해서 도와주는 개념이다.

    * 동사를 직접 사용한다. -> 예) members/{id}/delete

* 정리) 실무에 나가게 된다면, 문서와 컬렉션을 가지고 그 안에서 GET, POST, PUT, DELETE로 최대한 해결을 한다. 그런데 만약에 해결하기 어려운 경우에는 컨트롤 URI를 사용해서 해결한다.

## Reference

* [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC/dashboard)
