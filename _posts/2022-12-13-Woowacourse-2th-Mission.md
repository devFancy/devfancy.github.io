---
layout: post
title:  " [BE] 2주차 미션 회고 (숫자 야구 게임) "
categories: Woowacourse
author: devfancy
---
* content
{:toc}

![](/assets/img/woowacourse/woowacourse_name.png)

* 이 글은 프리코스 과정 이후에 한번 더 복습한 과정을 담긴 내용이며, 기존에 제출했던 코드와 다를 수 있습니다.


## 미션 - 숫자 야구 게임

[숫자 야구 게임](https://github.com/woowacourse-precourse/java-baseball)

[구현한 코드](https://github.com/devfancy/java-baseball/tree/fancy-review2)


## 우테코 마지막 메일의 일부분

> "그동안의 **프로그래밍 요구 사항**과 **공통 피드백** 받은 사항들을 모두 적용하는 것을 시도해 보세요. 현재의 역량을 한 단계 성장하는 데 있어 새로운 문제에 도전하는 것도 좋지만 그보다 같은 문제를 **다른 방식으로 도전**해 보는 것도 좋은 연습이라 생각해요"

* 4주차 미션이 끝난 이후에 우아한테크코스로부터 받은 메일의 일부분을 가져왔다.

* 프리코스 4주간 미션들을 하면서, 받은 피드백들은 해당 미션이 끝난 이후에 오기 때문에 피드백없이 미션을 풀고 제출하였다.

**이번 목표**는 지난 미션을 다시 복습하면서, 그동안 받았던 피드백과 요구 사항을 모두 지키면서 미션을 푸는 것이다.


## README.md

* README.md를 작성할 때, `나만의 README.md 형식`을 만들어서 그 속에 **내용**만 바꾸기로 했다.

* 최종 코딩테스트에서는 **5시간**이라는 제한된 시간이 있기 때문에 시간을 효율적 쓰기 위해서는 이미 만들어진 형식을 가져오는게 현명하다고 생각한다.

### 기능 목록을 업데이트 한다.

> README.md 파일에 작성하는 기능 목록은 기능 구현을 하면서 변경될 수 있다. 시작할 때 모든 기능 목록을 완벽하게 정리해야 한다는 부담을 가지기보다 기능을 구현하면서 문서를 계속 업데이트한다. **죽은 문서가 아니라 살아있는 문서를 만들기 위해 노력한다.**

* 공통 피드백에 나와있는 것처럼 처음부터 모든 것을 적기보다는 기능을 구현하면서 주기적으로 README.md 파일을 업데이트 했다.

* 그 결과, 다음과 같이 README.md 파일을 작성했다.

``` markdown
# 🚀미션 - 숫자 야구

### 💙구현 목표

- 1부터 9까지 서로 다른 수로 이루어진 3자리의 수를 맞추는 게임이다.

### 📜구현 동작

1. 게임 시작 문구 출력한다.
2. 0이 아닌 서로 다른 3자리 수를 입력한다.
3. 상대방(컴퓨터)와 비교하여 결과를 출력한다.
4. 3개의 숫자가 모두 맞힐 때까지 반복한다.
5. 3개의 숫자를 모두 맞힐 경우, 결과를 출력하고 재시작 여부를 출력한다.
6. 재시작을 선택하면 2번으로 가고, 종료를 선택하면 종료된다.

---

## 🔍구현 로직

- ### Main diagram

- [x] BaseballGame : Controller 역할

- ### Model diagram

- [x] Baseball : 사용자 및 컴퓨터 데이터 갱신 및 값을 비교하는 역할
- [x] BaseballGameResult : 숫자 야구 게임 결과를 알려주는 역할
- [x] BaseballMaker : 서로 다른 3개의 숫자를 ArrayList 에 담아주는 역할
- [x] BaseballNumberGenerator : BaseballRandomNumberGenerator 의 인터페이스 역할
- [x] BaseballRandomNumberGenerator : Random 값을 추출하는 역할

- ### Util diagram

- [x] Validate : 유효 검사
- [x] ErrorMessage : 에러 메세지

- ### View diagram

- [x] InputView : 입력 부분
- [x] OutputView : 출력 부분

---

## ✅ 기능 목록 checkList

- [x] 1.게임 시작 문구 출력한다.
- [x] 2.0이 아닌 서로 다른 3자리 수를 입력한다.
- [x] 3.상대방(컴퓨터)와 비교하여 결과를 출력한다.
    - [x] 같은 자리에 있으면 스트라이크
    - [x] 다른 자리에 있으면 볼
    - [x] 아예 없으면 낫싱
- [x] 4.3개의 숫자가 모두 맞힐 때까지 반복한다.
- [x] 5.3개의 숫자를 모두 맞힐 경우, 결과를 출력하고 재시작 여부를 출력한다.
    - [x] 재시작(1)을 입력하면 2번으로 이동한다.
    - [x] 종료(2)를 입력하면 게임이 종료된다.

## ✅ 예외 처리

- [x] 0이 아닌 서로 다른 3자리 수가 아닌 경우
- [x] 재시작 또는 종료 이외의 다른 숫자를 입력한 경우

## ✅ 테스트 기능 목록

```


## 값을 하드 코딩하지 않는다

* 문자열, 숫자 등의 값을 하드 코딩하지 않고 상수(static final)을 만들고 이름을 부여해서 이 변수의 역할이 무엇인지 의도를 드러내려고 노력했다.

* 그래서 다음과 같이 구현했다.
 
![](/assets/img/woowacourse/2th_BaseballGame_1.png)


## 한 함수가 한 가지 기능만 담당하게 한다

* 사실 이 부분이 구현하면서 가장 어려웠다.

### UI 부분

* view에 있는 InputView, OutputView는 한 가지 기능만 담당하도록 기능을 구현했다.

#### InputView(view)

![](/assets/img/woowacourse/2th_InputView.png)

* 유효성 검사(validate)부분은 복잡하지 않은 선에서 InputView에 담았다.

* 게임 재시작 여부에 대한 유효성 검사는 InputView에 담기에는 메소드 길이 가 길어져서 Controller에서 유효성 검사를 했다.

#### Outputview(view)

![](/assets/img/woowacourse/2th_Outputview.png)

* 게임 결과를 출력해주는 부분을 제외하고는 나머지 System.out.println을 OutputView에서 처리했다.

* 그리고 고정적인 출력부분은 상수화(static final)하였다.

### 비즈니스 로직

#### BaseballGame(controller)

![](/assets/img/woowacourse/2th_BaseballGame_2.png)

* 입출력 부분은 한 가지 기능만 담당하게 했으나, **Controller부분(BaseballGame)에서 gameStart() 메서드는 그렇게 하지 못했다.**

* 이 부분은 추후에 생각이 나면 리팩토링하면서 보완하려고 한다.


#### Random 값 추출

* 사실 숫자 야구 게임에서 제일 크게 배운 부분이 여기였다.

* **프로그래밍 요구사항**에서 Random 값 추출하는 라이브러리를 활용하는 부분이 있었다.

![](/assets/img/woowacourse/2th_programming_library.png)

* 이전에는 하나의 클래스에서 Random 값 추출하는 기능을 구현했었는데, 이번에는 **인터페이스**를 만들어서 구현하기로 했다.

> 인터페이스란?
: 극단적으로 동일한 목적 하에 동일한 기능을 보장한다.

> 왜 사용하는가?
: 자바의 다형성을 극대화하여 개발코드 수정을 줄이고 프로그램 유지보수성을 높이기 위해 인터페이스를 사용한다

* 그래서 BaseballMaker 클래스에서 BaseballRandomNumberGenerator 클래스의 generate() 메서드를 호출하고 인터페이스를 연결하는 식으로 구현했다.

  * 순서:
  BaseballMaker(클래스) - makeNumber() 메서드
  -> BaseballRandomNumberGenerator(클래스) - generate() 메서드
  -> BaseballNumberGenerator(인터페이스)


**BaseballMaker**

![](/assets/img/woowacourse/2th_BaseballMaker.png)

**BaseballRandomNumberGenerator**

![](/assets/img/woowacourse/2th_BaseballRandomNumberGenerator.png)

* 인터페이스를 사용하려면 클래스명 옆에 implements를 추가하고 옆에 해당 인터페이스명을 입력해야 한다.


**BaseballNumberGenerator(인터페이스)**

![](/assets/img/woowacourse/2th_BaseballNumberGenerator.png)

---

## 회고

* 이번 2주차의 목표는 그동안 받았던 `프로그래밍 요구사항`과 `공통 피드백`들을 모두 반영한 것이다.

* 기능 구현을 하면서 프로그래밍 요구사항은 모두 지켰지만, **공통 피드백은 지키지 못했다.**

* **지키지 못한 부분들**은 다음과 같다.

* 객체는 객체스럽게 사용한다

* 테스트 코드와 관련된 전체

* Spring MVC 패턴 - [MVC를 지키면서 코딩하는 방법](https://velog.io/@fancy-log/Spring-MVC-%EA%B5%AC%EC%A1%B0-%EC%9D%B4%ED%95%B4) (-> 이후에 리팩토링 하였음)


* 아무래도 제한시간이 있다보니, **테스트보다는 기능 구현을 해야 한다는 `목적`**이 있기 때문에 후순위로 미룬 것도 있다.

* `객체는 객체스럽게 사용한다` 부분과 `테스트 코드` 부분은 **이후에 리팩토링 하면서 조금 더 보완하려고 한다. **

* Spring MVC 패턴에서 **MVC를 지키면서 코딩을 하는게 쉽지 않았다.**

* 우아한테크코스 프리코스 미션 이전에 Spring을 개인적으로 공부를 했었고, 현장실습으로 관련 프로젝트도 했었는데, 내가 그동안 구현했던 코드는 MVC 패턴을 제대로 지키지 않았다는 걸 느꼈다.

![](/assets/img/woowacourse/2th_spring_mvc_pattern.png)

* MVC를 지키면서 코딩하는 방법 5가지 중에서 **1번째인 "Model은 Controller와 View에 의존하지 않아야 한다."** 에서 Model은 Controller와 View에 관한 코드가 있으면 안된다라는게 적혀져 있다.

* 하지만, BaseballGameResult 클래스에서 1번째 부분을 지키지 못했다.


**BaseballGameResult(Model 부분)**

![](/assets/img/woowacourse/2th_BaseballGameResult.png)

* 여기서 showResult() 메서드에서 view 패키지의 Outputview 클래스를

* 가져와서 구현을 했다는 것은 `View`에 관한 코드가 있다는 의미이기 때문이다. 

* 해당 부분도 추후에 리팩토링으로 코드를 수정하려고 한다.

* (-> **12/8 기준** 리팩토링하여 MVC패턴 규칙을 지켰다!)

* 비록 1~3주차 공통 피드백을 모두 지키진 못했지만, 그동안 내가 구현했던 것들 중에 제일 깔끔한 코드로 구현했어서 `성장`했다는 것만으로도 뿌듯하다.

* 하지만, 지금으로 만족하기 보다는 지속적으로 성장해서 이번 주차의 목표였던  "그동안의 **프로그래밍 요구 사항**과 **공통 피드백** 받은 사항들을 모두 적용"하기 위해 복습, 또 복습하자!

* 최종 대상자가 아직 선정되진 않았지만, 발표일 전까지 꾸준히 학습해서 성장하자
