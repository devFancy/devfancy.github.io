---
layout: post
title:  " OSI 7 Layers "
categories: Network
author: devfancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 대학 수업 `컴퓨터망프로그래밍` 과목을 공부하면서 정리한 내용입니다.

## OSI 7 Layers

* 국제표준화기구(ISO)에서 개발한 모델이다.

    * 컴퓨터 네트워크 프로토콜 디자인과 통신을 7계층으로 나누어 설명한다.

    * 각 계층은 하위 계층의 기능만을 이용, 상위 계층에게 기능을 제공한다.

    ![](/assets/img/network/network-OSI7-hierarchy-1.png)

* 레퍼런스 모델

    ![](/assets/img/network/network-OSI7-hierarchy-2.png)

## 1계층 : Physical Layer

* 역할

    * 전기적, 기계적 특성을 이용해서 통신 케이블로 데이터를 전송한다.

    * 통신 단위는 비트(0, 1)

    * 데이터를 전달하는 기능이다.(어떤 데이터인지는 관여하지 않는다)

* 장비 - 통신 케이블, 리피터, 허브 등

![](/assets/img/network/network-OSI7-hierarchy-3.png)


## 2계층 : Data Link Layer

* 역할

    * 물리 계층을 통해 송수신되는 **정보의 오류 검출** 및 **흐름을 관리**한다.

    * 안전한 정보의 전달을 수행할 수 있도록 도와준다.

    * 통신 오류 검출 및 재전송을 한다.

    * MAC 주소를 이용하여 통신한다.

* 장비 - 브리지, 스위치 (스위칭 브리지) 등

![](/assets/img/network/network-OSI7-hierarchy-4.png)


## 3계층: Network Layer

* 역할

    * 데이터를 목적지까지 전달하는 기능이다(**라우팅**) 
  
    * **경로 선택하고**, **경로에 따라 패킷을 전송**한다.
    
    * **IP 주소**를 사용한다.
    
    * 다양한 프로토콜 및 라우팅 기술을 사용한다.

* 장비 - 라우터

![](/assets/img/network/network-OSI7-hierarchy-5.png)

## 그 외 계층들

### 4계층: Transport layer (전송 계층)

* 최종 시스템 및 호스트 간의 데이터 전송 조율을 담당한다.

* 흐름 제어, 중복 검사

* 보낼 데이터의 용량, 목적지 등을 처리한다.

* **TCP/UDP** 프로토콜 사용한다.

### 5계층: Session layer (세션 계층)

* 통신 세션을 구성하는 계층으로 포트를 (port)연결한다.

* 사용자간의 포트 연결(session)이 유효한지 확인하고 설정한다.

### 6계층: Presentation layer (표현 계층)

* 운영체제의 일부분

* 네트워크 형식 <-> 응용프로그램 형식

* 부호화, 변화, 데이터 압축 및 암호화 등

### 7계층: Application layer (응용 계층)

* 응용 프로세스간 정보 교환

* 각종 응용 프로그램

## Socket API

![](/assets/img/network/network-OSI7-hierarchy-6.png)

## 계층간 데이터 송수신 과정

![](/assets/img/network/network-OSI7-hierarchy-7.png)

* HTTP를 통해 웹 서버에 있는 데이터를 요청하면 다음과 같은 일이 일어난다.

* 애플리케이션 계층에서 전송 계층으로 필자가 보내는 요청(request)값들이 캡슐화 과정을 거쳐 전달되고, 다시 링크 계층을 통해 해당 서버와 통신을 하고, 해당 서버의 링크 계층으로부터 애플리케이션까지 비캡슐화 과정을 거쳐 데이터가 전송된다.

### 캡슐화 과정

* 캡슐화 과정은 **상위 계층의 헤더와 데이터를 하위 계층의 데이터 부분에 포함**시키고 해당 계층의 헤더를 삽입하는 과정을 말한다.

![](/assets/img/network/network-OSI7-hierarchy-8.png)

### 비캡슐화 과정

* 비캡슐화 과정은 하위 계층에서 상위 계층으로 가며 각 계층의 헤더 부분을 제거하는 과정을 말한다.

![](/assets/img/network/network-OSI7-hierarchy-9.png)

* 최종적으로 사용자에게 애플리케이션의 `PDU`인 메시지로 전달된다.

## PDU

* 네트워크의 어떠한 계층에서 계층으로 데이터가 전달될 때 한 덩어리의 단위를 `PDU`(Protocol Data Unit)라고 한다.

* PDU는 제어 관련 정보들이 포함된 **헤더**, 데이터를 의미하는 **페이로드**로 구성되어 있으며 계층마다 부르는 명칭이 다르다.

  * `애플리케이션 계층` : 메세지

  * `전송 계층` : 세그먼트(TCP), 데이터그램(UDP)
  
  * `인터넷 계층` : 패킷

  * `링크 계층` : 프레임(데이터 링크 계층), 비트(물리 계층)

* 참고로 PDU 중 **비트**로 송수신하는 것이 모든 PDU 중 가장 빠르고 효율성이 높다. 하지만 애플리케이션 계층에서는 **문자열을 기반으로 송수신** 하는데, 그 이유는 헤더에 **authorization** 값 등 다른 값들을 넣는 확장이 쉽기 때문이다.


## Reference

* 학교 수업 자료 - 컴퓨터망프로그래밍

* [면접을 위한 CS 전공 지식 노트](https://product.kyobobook.co.kr/detail/S000001834833)

* [OSI 7 계층 그림-1 참조](https://blog.naver.com/PostView.nhn?blogId=pst8627&logNo=221670903384)

* [OSI 7 계층 그림-2 참조](https://shlee0882.tistory.com/110)