---
layout: post
title: " [사이드 프로젝트] 굿프렌즈 - 사용자 기반 기능 전체 리팩터링 "
categories: Goodfriends
author: devFancy
---
* content
{:toc}

## 리팩터링을 도입하게 된 배경

* 8월 1일부터 9월 27일까지 팀 프로젝트를 진행했지만, 그 당시에는 '구현'에 초점이 맞춰졌기 때문에, 개개인의 코드의 품질에 제대로 신경쓰지 못하고 개발했다.

    (초반에는 코드 리뷰를 열심히 해왔지만, 한정된 시간안에 구현해야 하는 압박감과 부담감에 후반으로 갈 수록 코드 리뷰를 제대로 못했다..)

    그리고 좋은 코드가 무엇인지, 좋은 코드를 짜기 위해서 어떻게 리팩터링하는지에 대해서 제대로 알지 못했다.

* 그래서 팀 프로젝트가 끝난 이후에, '나중에 반드시 리팩터링 해야겠다!' 고 다짐했다.

    그렇게 한달이 지나고, 예상치 못한 좋은 기회로 11월부터 12월까지 우아한 스터디의 "`내 코드가 그렇게 이상한가요?`" 주제에 참가하게 되어서, 좋은 코드가 무엇인지 배우게 되었다.

    "내 코드가 그렇게 이상한가요?" 책을 읽으면서 스터디에 참가하는 분들과 토론하면서 좋은 코드로 개선하는 방법을 알게되었다. 

    (해당 책을 공부하면서 내 [블로그: GoodGode](https://devfancy.github.io/category/#GoodCode)에 따로 정리해두었다)

* 해당 스터디에서 배운 내용을 기반으로 기존에 구현했던 기능들, 특히 **사용자 기반** 기능(프로필, 상품, 주문, 신고)을 우선적으로 리팩터링을 진행했다.

## `주문` 도메인에 대한 리팩터링 과정

> 주요 기능 중 하나인 `주문`에 대한 리팩터링 과정을 자세히 확인하고 싶다면, [PR](https://github.com/woorifisa-projects/GoodFriends/pull/355)을 참고하자.

* 사용자 기반의 여러 기능 중 `주문` 도메인에서 **본인이 판매 등록한 물품에 들어온 주문서 전체를 조회하는 API**와 관련된 비즈니스 로직에 대한 리팩터링 과정을 정리하고자 한다.

> 리팩터링 전) `주문` 도메인에서 주문서 전체를 조회하는 API에 대한 비즈니스 로직(OrderService.class) - findAllOrder

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-0.png)

* 리팩터링을 하기전에, 지켜야할 부분을 아래와 같이 정리했다.

```markdown
# 목표
- [ ] 구조를 파악할 수 있도록 기존의 클래스/메서드/변수명 수정할 것 - 굿프렌즈 WIKI에 있는 [객체 및 메서드 생성 규칙](https://github.com/woorifisa-projects/GoodFriends/wiki/객체-및-메서드-생성-규칙)
- [ ] 불변 활용할 것
- [ ] 단일 책임 원칙을 지키기 위해 하나의 메서드에 한가지 일만 담당하도록 구현한다.
- [ ] 메서드 최대 길이 15줄 이내로 할 것  
- [ ] 리팩터링 이후 불필요한 주석은 제거할 것
```

* [1] 먼저 **구조를 파악할 수 있도록 기존의 클래스/메서드 변수명을 수정**하기 위해 `findAllOrder()` 메서드명을 `findAllMyProductOrders()`로 수정했다.

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-1.png)

* [2] 그리고 `findAllMyProductOrders()` 메서드에서 유효성을 검사하는 로직을 `validateOffenderAndMyProduct()` 메서드를 생성해서 처리해주도록 수정했다.

* 추가적으로 예외 클래스명에 대해서도 직관적이고 이해할 수 있는 클래스명으로 수정했다. (예외 처리 클래스를 각 도메인의 비즈니스 규칙에 맞도록 커스터마이징했다)

  * 기존) `NotAccessProductException` -> 변경) `InactiveUserAccessException` - 예외 메시지: '비활성화 상태인 유저로 해당 페이지에 접근이 불가능합니다'

  * 기존) `NotOwnProductException` -> 변경) `InvalidProductOrderAccessException` - 예외 메시지: '본인이 등록하지 않은 상품의 주문서는 조회할 수 없습니다.'

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-2.png)

* [3] `findAllMyProductOrders()`에는 **여러 로직을 처리하고 있어서 `단일 책임 원칙`에 위배**되고 있다. 

* 이를 해결하기 위해 첫 번째로 **하나의 메서드에 한 가지 일만 담당**하도록 로직을 수정했고, 동시에 **중첩 if문을 제거**했다.

  * 이때, 상태 체크와 해당 상태에 따른 주문서를 조회하는 로직을 분리했다. -> `handleNonSellProduct()`

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-3-1.png)

* [4] 그런 다음, 두 번째로 map 부분에서 `OrderProductResponse` 클래스(이전 클래스명: `OrderViewOneResponse`) **`정적 팩토리 메서드`(of)를 추가하여 중복되는 부분을 최소화**했다.

  * `팩토리 메서드 패턴`(Factory Method Pattern)은 **객체 생성**을 처리하기 위한 디자인 패턴 중 하나다.

  * 이 패턴을 사용함으로써 객체 생성과정이 클래스 외부로 추상화되어, 코드의 가독성이 높아지고 유지보수가 용이해진다.

  * 또한 `팩토리 메서드 패턴`은 **객체 생성에 필요한 복잡한 로직을 한 곳에 모아둠으로써 중복을 줄일 수 있다.**

  * `of` 메서드는 주로 정적(static) 팩터리 메서드로 사용되며, **해당 객체를 생성하고 초기화하는데 사용**된다. 불변성(Immutability)을 강조하거나 특정한 시나리오에서 명확하게 사용할 수 있도록 하는데 주로 쓰인다.

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-3-2.png)

* [5] `findAllMyProductOrders()`, `handleNonSellProduct()` 두 메서드의 return 하는 부분에서 true/false 값은 판매 상태 여부를 나타내는 걸 의미하는데, 이를 `private static final`로 상수화로 선언해서 아래와 같이 수정했다.

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-4.png)

* [6] `findAllMyProductOrders()` 메서드에서 **주문 응답을 가져오는 로직**을 `getOrderProductResponses()` 메서드로 추출했다.

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-5.png)

* 마지막으로 `findAllMyProductOrders()` 메서드에서 로직을 처리하는 순서에 맞게 조정했다.

  그리고 `handleNonSellProduct()`메서드 명에 대해서도 직관적으로 이해할 수 있게 `beginDealForOrder()`으로 다시 수정했다.

* 이렇게 해서 `주문` 도메인에서 **본인이 판매 등록한 물품에 들어온 주문서 전체를 조회하는 API**와 관련된 비즈니스 로직에 대한 리팩터링을 진행했다.

```markdown
# 목표 달성
- [x] 구조를 파악할 수 있도록 기존의 클래스/메서드/변수명 수정할 것 - 굿프렌즈 WIKI에 있는 [객체 및 메서드 생성 규칙](https://github.com/woorifisa-projects/GoodFriends/wiki/객체-및-메서드-생성-규칙)
- [x] 불변 활용할 것
- [x] 단일 책임 원칙을 지키기 위해 하나의 메서드에 한가지 일만 담당하도록 구현한다.
- [x] 메서드 최대 길이 15줄 이내로 할 것  
- [x] 리팩터링 이후 불필요한 주석은 제거할 것
```

> 리팩터링 후) `주문` 도메인에서 주문서 전체를 조회하는 API에 대한 비즈니스 로직(OrderService.class) - `findAllMyProductOrders()`

![](/assets/img/goodfriends/order-refactor-findAllMyProductOrders-6.png)

## 리팩터링을 마치며

* 사실 `주문` 도메인에 대한 리팩터링 하기 이전에, 이미 `프로필`, `신고`, `상품`에 대해 리팩터링을 진행했다.

  * [`신고`에 대한 리팩터링 과정 -PR](https://github.com/woorifisa-projects/GoodFriends/pull/346)

  * [`프로필`에 대한 리팩터링 과정 -PR](https://github.com/woorifisa-projects/GoodFriends/pull/348)

  * [`상품`에 대한 리팩터링 과정 -PR](https://github.com/woorifisa-projects/GoodFriends/pull/350)

* 스터디에서 배운 내용을 기반으로 기존 프로젝트(굿프렌즈)에서 사용자 기반의 기능들을 모두 리팩터링하면서 적용해봤다.

* 책에 있는 기술, 개념들을 적용하는 과정에서 시간이 많이 걸렸지만, 그 만큼 많은 경험을 얻게 되었다.

* 다음에는 이전에 테스트 코드 강의를 듣고 정리해둔 [Practical Testing: 테스트 코드 작성 방법](https://devfancy.github.io/Practical-Testing/)을 기반으로 굿프렌즈 프로젝트에 단위 및 통합 테스트 코드를 작성해보자!