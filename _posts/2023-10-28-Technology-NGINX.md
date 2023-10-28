---
layout: post
title:  " NGINX란? "
categories: Technology
author: devFancy
---
* content
{:toc}


## NGINX 등장 배경: Apache 의 문제점

Nginx 등장이전에는 Apache가 웹서버로써의 높은 인기를 가졌습니다. 

잘 사용되던 아파치 웹 서버는 어느 순간 어떠한 문제를 가져왔습니다.

![](/assets/img/technology/NGINX-1.png)

아파치의 초기 요청 처리 메커니즘과 함께 어떠한 문제를 가져왔는지 살펴보면, 그림과 같이 요청(Request)가 들어올 때마다 **새로운 Process를 생성하여 네트워크를 연결하고, 요청을 처리**했습니다. (이러한 처리 방식을 `prefork`라고 합니다)

그런데, 2000년이 접어 들고 인터넷 트래픽이 증가하면서 아파치의 요청 처리방식은 `C10k` 문제를 가져왔습니다.

> **`C10K`** 문제란 Connection 10000 Problem의 줄임말로 웹 서버가 1만개의 동시 Connection을 처리하기 어렵다는 의미이다.

일단 `동시 Connection`을 자세히 살펴보면,

![](/assets/img/technology/NGINX-2.png)

**`웹서버`** 는 `클라이언트` 로부터 요청이 들어오면 `Connection`을 생성하고 유지합니다. 그리고 위의 그림과 같이 `클라이언트`는 생성된 `Connection`을 통해 또 다른 요청을 `서버`에게 전달합니다.

이렇게 `Connection` 하나로 여러 요청을 처리하는 이유는, `클라이언트`와 `서버`는 `Connection`을 생성하는데 여러가지 절차가 필요합니다. 그래서 **매 요청마다 `Connection`을 생성하는 것은 비효율적이고 느렸습니다.**

비효율성을 해결하기 위해 사람들은 이미 만들어진 `Connection`이 있다면 이를 활용하여 요청을 보내고자 했습니다.

이렇게 유지되는 Connection들을 `동시 Connection`이라고 합니다.

이때 Apach 서버는 C10K문제를 가져왔습니다.

![](/assets/img/technology/NGINX-3.png)

그림과 같이 Apache 서버는 요청이 들어올 때마다, Process를 생성했는데,, 요청이 만단위를 넘어가면서 어느 순간부터 요청에 대한 Connection을 생성하지 못한 것입니다.

이러한 문제를 가져온 원인은 다음과 같습니다.

- **메모리 부족** - 아파치 서버는 `Connection`이 생성될 때마다 `Process`를 생성해야 했는데 동시에 유지해야할 `Connection`이 많아지면서 유지해야할 `Process`가 증가했고 메모리 부족을 발생시켰습니다.

- **CPU 과부화** - 실행중인 `Process`가 많아지면서 CPU는 Process를 처리할 때, `컨텍스트 스위칭`을 굉장히 많이 해야했습니다. 그래서 CPU의 부하가 증가했습니다.

결국 수많은 동시 커넥션을 처리하기엔 아파치의 요청 처리구조는 부적합했습니다.

그래서 Apache의 단점을 보완하기 위해 2004년 Nginx가 등장했습니다.

## NGINX란

> `Nginx`는 WB(Web Server)의 일종이다. 주로 정적 컨텐츠를 제공하거나 ReverseProxy(리버스 프록시), LoadBalancer(로드밸런싱)의 역할을 한다.

## NGINX 자세히 알아보기

![](/assets/img/technology/NGINX-4.png)

Nginx는 `MasterProcess` 를 통해 설정 파일을 읽고 `**WokerProcess**`와 같은 자식 `Process` 2종류를 생성합니다.

(`cache loader`, `cache manager`가 있습니다)

그리고 생성된 `WorkProcess`는 요청이 들어오면 `Connection`을 형성하고 요청을 처리합니다. 요청에 따라서 매번 `Process`를 생성하던 Apache와 달리, **NGINX는 `MasterProcess`에 따라 `WorkerProcess`를 생성하고 고정된 개수의 `Woker Process`들이 요청을 처리**합니다.

이렇게 고정된 `Process`의 개수로 요청을 처리하기 위해 NGINX는 `Event-Driven` 방식으로 요청을 처리합니다.

> 💡`Event-Driven`이란? NGINX는 형성된 Connection에 아무런 요청이 없으면 새로운 요청에 대한 Connection을 형성하여 요청을 처리한다. 또는 이미 만들어진 다른 Connection으로부터 요청을 처리한다. Nginx에서의 Conneciton 형성, Connection 제거, 새로운 요청 처리를 Event라고 부른다. 또한, Event를 비동기 방식으로 처리하는 것을 Event-Driven이라고 한다.

![](/assets/img/technology/NGINX-5.png)

Nginx는 그림과 같이 큐 형태의 저장소에 `Event`들을 담아 `Worker Process`가 순차적으로 작업을 처리합니다.

## NGINX 장점

NGINX는 Apache에 비해 **성능 측면**에서 두가지 장점이 있습니다.

1. 처리할 수 있는 동시 커넥션 개수가 훨씬 많습니다.
2. 동일한 개수의 커넥션 처리 속도가 더 빠릅니다.

이러한 장점을 가지고 오는 이유를 마지막으로 정리해보면,

고정된 Process 개수 만을 사용하기에 Process 생성 비용이 없습니다.

또한, `Process` **개수가 제한**되어 CPU의 부담이 줄어듭니다. (컨텍스트 스위칭이 적어지기 때문)
**비동기 방식**이기에 `Process`가 쉬지 않고 일을 할 수 있습니다.

## 마치며

이번 시간에는 NGINX에 대해서 등장 배경부터 NGINX의 요청 처리 방식, 장점에 대해 알아봤습니다.

다음 시간에는 기존 프로젝트에 NGINX를 어떻게 적용했는지에 대한 방법을 정리할 예정입니다.

읽어주셔서 감사합니다.

## Reference

* [[10분 테코톡] 🤫 피케이의 Nginx](https://www.youtube.com/watch?v=6FAwAXXj5N0&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC)

* [NGINX 란?](https://dallog.github.io/what_is_nginx/)

* [Ngnix의 개념과 작동방식 정리 (feat. Apache)](https://jizard.tistory.com/306)