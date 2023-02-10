---
layout: post
title:  " DNS "
categories: Network
author: fancy96
---
* content
{:toc}

## DNS

* 사람은  `www.apple.com` 과 같은 **도메인 이름**을 통해 온라인으로 정보에 접근한다.

* 웹브라우저는 **인터넷프로토콜(IP)** 주소를 통해 상호작용한다.

* `DNS`는 브라우저가 인터넷 자원을 로드할 수 있도록 **도메인 이름과 IP 주소를 매핑해주는 서버**로서, 도메인 이름과 IP 주소를 저장하고 있는 분산 데이터베이스다.

  * 예) `www.naver.com` 의 IP 주소가 222.111.222.111로 되어있는데 사용자가 보기 쉽게 도메인 이름으로 매핑해준다.

  * 쉽게 말하면 **웹 사이트를 위한 주소록**이라고 생각하면 된다.

* `DNS` 는 애플리케이션 계층에 속한다. (예플리케이션 계층 - FTP, HTTP, SSH, SMTP, DNS)

    * `애플리케이션 계층`은 웹 서비스, 이메일 등 서비스를 실질적으로 사람들에게 제공하는 층이다.

## 분산 계층 데이터베이스


## DNS query


## DNS 캐싱


## 예상 질문

* DNS는 몇 계층 프로토콜인가요?

* UDP와 TCP 중 어떤 것을 사용하나요?

* DNS Recursive Query, Iterative Query가 무엇인가요?

* DNS 쿼리 과정에서 손실이 발생한다면, 어떻게 처리하나요?

* DNS 레코드 타입 중 A, CNAME, AAAA의 차이에 대해서 설명해주세요.

* hosts 파일은 어떤 역할을 하나요? DNS와 비교하였을 때 어떤 것이 우선순위가 더 높나요?

## Reference

* [웹 통신의 흐름](https://hello-judy-world.tistory.com/189)
