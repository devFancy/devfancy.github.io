---
layout: post
title:  " [BE] 4주차 미션 회고 (다리 건너기) "
categories: Woowacourse
author: devfancy
---
* content
{:toc}

![](/assets/img/woowacourse/woowacourse_name.png)

* 이 글은 프리코스 과정 이후에 한번 더 복습한 과정을 담긴 내용이며, 기존에 제출했던 코드와 다를 수 있습니다.


## 미션 - 다리 건너기

[다리건너기](https://github.com/woowacourse-precourse/java-bridge)

[구현한 코드](https://github.com/devfancy/java-bridge/tree/fancy-review)


> **4주차 미션 목표**
1. 클래스(객체)를 분리하는 연습
2. 리팩터링

> **공통 피드백에서 반영한 부분**
*  비즈니스 로직과 UI 로직을 분리한다(3주차 피드백)
*  한 함수가 한 가지 기능만 담당하게 한다(2주차 피드백)
*  우아한테크코스의 프리코스 미션에서 공통 피드백들 중에서 나에게 어려웠던 위의 2가지를 지키면서 기능을 구현해보자.


## 피드백 반영

### 비즈니스 로직과 UI 로직을 분리

* `비즈니스 로직(도메인 로직)`은 **주어진 문제를 해결하기 위한 전반적인 알고리즘 시스템**을 의미하고,

* `UI 로직`은 **입출력**에 관련된 로직만을 담당한다.

* 프리코스 미션에 참가한 분들 중에 Spring MVC패턴을 적용하는 사람들이 많았다.

* 하지만, 나는 비즈니스 로직와 UI 로직을 분리조차 익숙치가 않아서 이분화한 체계를 제대로 잡은 다음에 Spring MVC패턴을 하기로 결정했다.

* 참고로 Spring MVC를  도메인/UI 로직로 나타낸다면, 아래처럼 표현된다고 생각한다.

> **Controller + Model = Domain(Business)**
  **View = UI**

* [변경 전]

![](/assets/img/woowacourse/4th_bridgeGame_1_logic.png)

* 위와 같이, 비즈니스 로직과 UI로직을 분리하지 않은 상태다.

* 그래서 해당 로직을 구분하기 위해 View라는 폴더를 생성하였고, 그 안에 InputView, OutputView를 담았다.

* [변경 후]

![](/assets/img/woowacourse/4th_bridgeGame_2_logic.png)

* 이처럼 비즈니스 로직과 UI 로직을 분리하였다.

---

### 한 함수가 한 가지 기능만 담당

#### 예시 1) BridgeGame 클래스 - init() 메서드

![](/assets/img/woowacourse/4th_bridgeGame_3_one_function.png)

* 위의 init() 메서드는 BridgeGame() 클래스에서 다리 건너기 게임의 초기세팅을 해주는 역할이다.

* 하지만, 메서드 안을 자세히 보면 사용자 입력, 유효값 검증, 그리고 다리를 생성하는 bridgeMaker 클래스를 이용하는 등 여러 일을 하고 있다.

* 그래서 **사용자 입력과 유효값 검증을 (함수)분리**하는 것을 목표를 두고 다음과 같이 분리하였다.

[Application 클래스] - init()

![](/assets/img/woowacourse/4th_bridgeGame_4_one_function.png)

* 사용자 입력을 받기 위해서 Application 클래스안에 init() 메서드를 새로 생성하였다.

[BridgeGame 클래스] - init()

![](/assets/img/woowacourse/4th_bridgeGame_5_one_function.png)

* 유효값 검증과 다리를 생성하기 위해 BridgeGame 클래스 안에 init() 메서드를 위와 같이 코드를 수정했다.

#### 예시 2) BridgeGame 클래스 - move() 메서드

![](/assets/img/woowacourse/4th_bridgeGame_6_one_function.png)

* 위의 move() 메서드는 다리 건너기 게임에서 사용자가 칸을 입력할 때마다 결과를 출력해주는 역할이다.

* move() 메서드 예시(입출력)

![](/assets/img/woowacourse/4th_bridgeGame_7_one_function.png)

* 하지만, 해당 메서드는 사용자 입력, 유효값 검증, 출력을 하고 있다.

* 그래서 **사용자 입출력과 유효값 검증을 (함수)분리**하기 위해 아래와 같이 코드를 수정했다.

[Application 클래스] - move(), printBridge()

![](/assets/img/woowacourse/4th_bridgeGame_8_one_function.png)

* Application 클래스 안에 move()와 printBridge()를 새로 생성하였다.

* 해당 move() 메서드는 사용자 입출력을 받고, isRightDirection이라는 boolean 변수를 선언해 BridgeGame 클래스의 move()메서드로부터 값을 받아오는 역할이다.

[Bridge 클래스] - move()

![](/assets/img/woowacourse/4th_bridgeGame_9_one_function.png)

* Bridge 클래스안에 move() 메서드를 위와 같이 수정했다.

* 해당 move() 메서드는 유효값 검증을 하고, 사용자가 칸을 입력할 때 해당 다리가 정답과 일치여부 값을 가져오기 위해 Bridge 클래스의 isRightDirection()메서드로부터 값을 받아오는 역할이다.

* 이런식으로 **여러 일을 하고 있는 메서드(함수)가 있다면 적절하게 분리**하려고 노력했다.

---

## 최종

* 기능 요구사항들을 전부 구현한 뒤에 IntelliJ에서 다이어그램을 그려주는 기능을 얼마전에 알게 되었다.

* 해당 기능을 통해 전체 다이어그램을 아래와 같이 나타냈다.(참고로, 해당 다이어그램은 Layout-Orthogonal-Orthogonal Group을 기준으로 만든 다이어그램입니다)

![](/assets/img/woowacourse/4th_bridgeGame_10_class_diagram.png)

* BridgeGame 클래스 다이어그램을 기준으로 구성해보니 머릿속에서 생각하는 것보다 눈으로 쉽게 볼 수 있어서 확실히 이해되기 쉬웠다.

* (해당 다이어그램을 그리는 방법은 [IntelliJ - 클래스 다이어그램 그리는 기능](https://velog.io/@fancy-log/IntelliJ-%ED%81%B4%EB%9E%98%EC%8A%A4-%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8-%EA%B7%B8%EB%A6%AC%EB%8A%94-%EA%B8%B0%EB%8A%A5)에 자세하게 설명했습니다😌)

---

## 회고

* 이번 4주차 미션의 `학습 목표`는 **클래스(객체)를 분리하는 연습과 리팩터링**이었습니다.

* 다음 두 가지 학습 목표와 2-3주차 피드백을 바탕으로 4주차 과제인 "다리 건너기" 게임을 구현하려고 노력했습니다.

* **처음에는 기능 목록들을 정리한 이후에, 기능 목록에 있는 순서대로 구현**하였습니다.

* 저는 구현을 완성한 이후에  클래스 분리와 리팩토링을 하였습니다.

* **이번 주차 과제를 하면서 가장 어려웠던 부분이 `에러 처리`하는 부분과 `클래스 분리`**였습니다.

* **`에러 처리`하는 부분은 "Validate" 클래스**를 생성하여 README.md에 작성해두었던 에러 처리 목록대로 구현하려고 노력했지만, 기능 요구 사항의 의도를 제대로 파악하지 못해서 시간을 오래 잡아먹었습니다.

* 여러 구글링과 자바와 스프링 책을 통해 해당 의도를 파악하였고, 이후에는 버그가 발생하지 않도록 수행하였습니다.

* **`클래스 분리`에서는 과제에서 각각의 클래스의 설명을 해주셨음에도 어떻게 구현해야 할지 막막했습니다.**

* 하지만, README.md에 있는 기능 목록대로 구현하면서, 각각의 클래스가 어떤 역할을 하는 지 알게 되었고, 특히 **주석의 중요성**을 다시 알게 되었습니다. 그리고 **각각의 클래스의 역할이 분명하도록 구분하고 구현**하려고 노력하였습니다.

* **리팩터링한 것들 중에서 가장 어려웠던 부분은 과제에 나와있는 "메서드의 길이가 10라인을 넘어가지 않도록 구현한다"** 였습니다. 그래서 최대한 메서드들의 역할을 잘게 쪼개서 구현하려고 했고, 구현 완성된 이후에는 불필요한 메서드나 필드명을 제거해서 깔끔한 코드를 만들려고 노력했습니다.

* 이번 미션를 완수하면서 느낀 점은 함수의 역할이 이전보다 더 명확해서 '제 3자가 저의 코드를 봐도 이해할 수 있겠구나' 라는 생각이 들었습니다. **'다른 사람이 내 코드를 봐도 충분히 이해할 수 있는 코드를 만드는 것'**이 중요하다는 걸 다시 알게 되었습니다.

* 이번 미션를 통해 **객체 지향 설계 및 좋은 구현**이 무엇인지에 대해 여러 가지를 배우게 해주셔서 감사드립니다.

* 앞으로 남은 시간 동안 이전에 수행했던 미션들을 다시 복습하면서, 피드백에서 전달받은 내용들을 모두 소화시키려고 합니다. 특히 **`"객체는 객체스럽게 사용한다"`** 는 부분은 꼭 짚고 넘어가겠습니다.