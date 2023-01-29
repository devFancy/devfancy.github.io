---
layout: post
title: " HTTP 웹 기본 지식 : HTTP 상태코드 "
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


## 상태코드 요약

* 클라이언트가 보낸 요청의 처리 상태를 응답에서 알려주는 기능

    * `1xx` (Informational) : 요청이 수신되어 처리중

    * `2xx` (Successful) : 요청 정상 처리

    * `3xx` (Redirection) : 요청을 완료하려면 추가 행동이 필요

    * `4xx` (Client Error) : 클라이언트 오류, 잘못된 문법 등으로 서버가 요청을 수행할 수 없음

    * `5xx` (Server Error) : 서버 오류, 서버가 정상 요청을 처리하지 못함

* 만약에 모르는 상태 코드가 나타나면 **상위 상태 코드**로 해석해서 처리한다.

    * 285 ??? -> 2xx(Successful) : 요청 정상처리

    * 460 ??? -> 4xx(Client Error) : 클라이언트 오류

    * 567 ??? -> 5xx(Server Error) : 서버 오류


## 2xx (Successful)

* `200` OK : 요청 성공

* `201` Create : 요청 성공해서 새로운 리소스가 생성

* `202` Accepted : 요청이 접수되었으나 처리가 완료되지 않았음

* `204` No Content : 서버가 요청을 성공적으로 수행했지만, 응답 페이로드 본문에 보낼 데이터가 없음


## 3xx (Redirection)

* 요청을 완료하기 위해 웹 브라우저(유저 에이전트)의 추가 조치 필요

* `리다이렉트`이란 웹 브라우저가 웹 서버에 어떤 URL을 요청했을 때, 서버가 리다이렉트를 지시하는 특정 HTTP 응답[302]을 통해 웹 브라우저로 하여금 지정된 다른 URL로 재요청하라고 지시하는 것을 말한다.

    * 웹 브라우저는 3xx 응답의 결과에 Location 헤더가 있으면, 해당 Location 위치로 자동 이동하는 것을 의미한다.


### 영구 리다이렉션

* `영구 리다이렉션`이란 특정 리소스의 URI가 영구적으로 이동하는 것을 말한다.

* 원래의 URL을 사용할 수 없고, 검색 엔진에서도 변경을 인지한다.

* `301` Moved Permanently : 리다이렉트시 요청 메서드가 GET으로 변하고, 본문이 제거될 수 있음 (Maybe)

* `308` Permanent Redirect : 301과 기능은 같으나, 리다이렉트시 요청 메서드와 본문이 유지됨 (만약에 처음에 POST를 보내게 되면 리다이렉트시에도 POST로 유지된다)


### 일시적인 리다이렉션

* `일시적인 리다이렉션`이란 리소스의 URI가 일시적으로 변경하는 것을 말한다.

* URI가 일시적으로 변경되기 때문에 검색 엔진에서는 URL를 변경해서는 안된다.

* `302` Found : **리다이렉트시 요청 메서드가 GET으로 변하고, 본문이 제거될 수 있음(Maybe)**

* `307` Temporary Redirect : 302와 기능은 같으나, 리다이렉트시 요청 메서드와 본문이 유지됨

* `303` See Other : 302와 기능은 같으나 리다이렉트시 요청 메서드가 GET으로 변경돰(Must)

    * `303`는 명확하게 GET으로 변경, `302`는 명확하지 않지만 대부분 GET으로 변경됨

    * 현실적으로 이미 많은 애플리케이션 라이브러리들이 `302`를 기본값으로 사용하기 때문에 실무에서도 `302`를 사용한다.    

* 일시적인 리다이렉션(PRG, Post/Redirect/Get)을 사용하게 되면 **중복 주문을 방지**할 수 있다.

![](/assets/img/http/http-5-status-code.png)

* 예를 들어, PRG를 적용하기 이전에는 POST로 주문한 후에 새로 고침을 하게 되면 중복 주문이 된다. 

* 하지만 PRG를 적용하게 되면 POST로 주문한 후에 주문 결과 화면을 GET 메서드로 리다이렉트하게 되면 새로 고침을 해도 GET으로 결과 화면만 조회가 되기 때문에 중복 주문을 방지할 수 있다.


### 기타 리다이렉션

* `300` Multiple Choices : 사용 안함

* `304` Not Modified : 캐시를 목적으로 사용.

    * 클라이언트에게 리소스가 수정되지 않았음을 알려준다. 따라서 클라이언트는 로컬PC에 저장된 캐시를 재사용한다.    

    * `304` 응답은 로컬 캐시를 사용하기 때문에 응답에 메시지 바디를 포함하면 안된다.

    * 조건부 GET, HEAD 요청시 사용한다.


## 4xx (Client Error)

* 클라이언트 오류

* 클라이언트의 요청에서 잘못된 문법으로 인해 서버가 요청을 수행할 수 없는 오류이다.

* 즉 오류의 원인이 클라이언트에 있기 때문에, 클라이언트에서 해당 오류를 수정해야한다.

* `400` Bad Request : 클라이언트가 잘못된 요청을 해서 서버가 요청을 처리할 수 없음. 따라서 클라이언트가 해당 요청 내용을 다시 검토하고 보내야 한다.

* `401` Unauthorized : 클라이언트가 해당 리소스에 대한 인증이 필요함. 해당 오류 발생시 응답에 WWW-Authenticate 헤더와 함께 인증 방법을 설명해준다.

    * 인증(Authentication): 본인이 누구인지 확인, (로그인)

    * 인가(Authorization): 권한부여 (ADMIN 권한처럼 특정 리소스에 접근할 수 있는 권한, 인증이 있어야 인가가 있음)

* `403` Forbidden : 서버가 요청을 이해했지만 승인을 거부함. 접근 권한이 불충분한 경우에 해당한다.

    * 예) 관리자 등급이 아닌 사용자가 관리자 등급의 리소스에 접근을 하는 경우

* `404` Not Found : 요청 리소스가 서버에 없음. 또는 해당 리소스를 숨기고 싶을 


## 5xx (Server Error)

* 서버 오류

* `500` Internal Server Error : 서버 내부 문제로 오류 발생함. 

* `503` Server Unavailable : 서버가 일시적인 과부하 또는 예정된 작업으로 인해 잠시 요청을 처리할 수 없음.

## Reference

* [Redirection](https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%A0%89%EC%85%98)

* [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC/dashboard)
