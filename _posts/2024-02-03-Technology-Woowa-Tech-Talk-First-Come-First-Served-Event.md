---
layout: post
title:  " [우아한테크토크] 선착순 이벤트 서버 생존기! 47만 RPM에서 살아남다?! "
categories: Technology
author: devFancy
---
* content
{:toc}

## 선착순 이벤트 배너

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-1.png)

- 역대급 이벤트
- 어떤 반응인지 커뮤니티를 참고
- 그 중에서 “배민 또 장애 나겠네..” 반응도 있었음

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-2.png)

- 장애나는 날 전화가 폭주함

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-3.png)

- 2가지 큰 목표를 잡음
- 개발 기간이 1~2주 → 빠르게 개발, 최대한 기존 로직은 건드리지 않고 새로운 시스템을 가지고 구성하려했음



---

## 문제 상황

## 기존의 주문 시스템

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-4.png)

- 주문에 들어가기전에 여러 유효성 검사처리를 하고, 해당 데이터들을 세션에 저장을 한다.
- 고객이 주문지연 웹 뷰에 들어와서 정보를 입력 → 결제 → 결제완료 ⇒ 하나의 주문 건 완성
- 하나의 주문이 완성하려면 수십건의 API 요청을 해야함

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-5.png)

- 이렇게 “주문”은 여러 개의 시스템과 연계되어있음

### 이벤트시 문제점

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-6.png)

- 평소보다 10배이상 트래픽이 발생하게 됨

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-7.png)

- 주말피크와 이벤트 최고 RPM 차이는 약 **150배** 차이가 남
- 예상하지 못한 트래픽이 발생함(예상: 10배, 실제 150배)
- 이렇게 예측을 못하게 되면 시스템은 장애가 날 수 밖에 없음 → 난리 나는 거임
- 데이터 정합성에 맞는 노력을 할 것임

스케일 아웃 / 스케일 업 ⇒ 할 수도 있지만, 10배를 대비해봤자 그 이상이 나오면 장애가 날 거임

## 해결 방안

- 골목식당에서 줄 서는 것도 장애가 나는거와 비슷함
- 솔루션을 제공하는 백종원 아저씨가 항상 하는 말씀이 “**처리할 수 있을 만큼만 순서대로 입장시켜라**”
- 김성주의 안내로 번호표를 통해 대기줄을 빠르게 정리되고 있었음
- 저희는 이 김성주에 집중을 했음 ⇒ 모든 트래픽을 차례대로 처리할 수 있을 만큼 들여보내자.

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-8.png)

- 일단 Redis를 선택함

> 왜 Redis 를 선택했을까?

- 많은 서비스에서 사용하는 검증된 저장소
- 입/출력이 빠른 In-Memory 데이터베이스
- 다양한 자료구조 지원, 요구사항을 쉽게 해결할 수있었음

> 어떤 요구사항인가?

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-9.png)

### 해결 - Sorted set

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-10.png)

- 해당 자료구조 하나로 쉽게 처리할 수 있었음

> 레디스 사용시 고려사항

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-11.png)

- Keys 명령어는 쓰면 장애가 남
- 각 명령어의 시간복잡도를 확인해봐야 함 ⇒ Sorted Set의 경우 시간복잡도 O(log(n))

### 큐 시스템 플로우

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-12.png)

- 이벤트 주문 요청을 하면 → 대기번호 발급 받음

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-13.png)

- 현재 내 상태(참가열, 대기열)에 있는지 → 대기열이면 몇 번인지 조회

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-14.png)

프로모션 스케줄러를 통해서 뒤로 흘리는 TPS를 조절

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-15.png)

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-16.png)

- 순간적인 **대량 트래픽** 소화
- 이제는 트래픽을 일정하게 보낼 수 있게 됨

### 주문라우터

하나의 문제점 → `큐 시스템`을 **중간에 어떻게 끼워넣지?**

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-17.png)

- 우아한형제들 회사에서 만든 `주문라우터` 를 이용
- `주문라우터`에 있는 해당 Rule을 이용한다.

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-18.png)

- 회원번호, 업소번호를 보고 → Rule에 들어있으면 ⇒ 설정된 post로 라우팅을 해준다. ⇒ 큐 시스템으로 넘어간다.
- 만약 Rule 에 들어있지 않으면 → 주문 으로 넘어간다.

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-19.png)

- 일반 사용자는 기존 프로세스의 경우 **주문 라우터 → 주문**
- 쿠폰발급 + 이벤트업소의 경우 **주문 라우터 → 큐 시스템 → 주문** 순으로 구현

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-20.png)

- AWS 사용하는 경우 주문 시스템을 “이벤트용 주문”에 복제해서 큐 시스템 뒤에 붙였음
- 이렇게 하면 일반 사용자는 해당 영향을 받지 않도록 시스템을 격리시킴

⇒ 이벤트에 영향없이 **일반주문은 가능**하도록 장애 격리

## 최종 아키텍쳐

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-21.png)

> 모니터링 - CloudWatch

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-22.png)

- 주요 서버들, 확인해야할 지표들만 가지고 대시보드로 구성해서 모니터링을 진행함

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-23.png)

- 어드민을 만들어서 대기열, 참가열 모니터링, 변수 셋팅을 했음

![](/assets/img/tech_insight/Woowa-Tech-Talk-First-Come-First-Served-Event-24.png)

- 이상 이벤트에 대한 대응을 잘했음

## Review

10만 이상의 트래픽 경험을 쌓기 위해 해당 영상을 참고하게 되었다.

해당 방식은 2019년 우아한형제들에서 발표한 내용으로 현재(2024) 사용하는 방식과 다소 차이가 있을 수 있다.

또한 기존 Mysql 외에 Redis를 사용하면 비용과 관리도 그 만큼 증가하기 때문에, 상황에 맞게 적절히 사용하는게 엔지니어링의 역할이자 책임인 것 같다.

## Reference

- [[우아한테크토크] 선착순 이벤트 서버 생존기! 47만 RPM에서 살아남다?!](https://www.youtube.com/watch?v=MTSn93rNPPE&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC)