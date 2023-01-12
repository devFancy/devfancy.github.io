---
layout: post
title:  " [BE] 3주차 미션 회고 (로또 게임) "
categories: Woowacourse
author: fancy96
---
* content
{:toc}

![](/assets/img/woowacourse/woowacourse_name.png)

* 이 글은 프리코스 과정 이후에 한번 더 복습한 과정을 담긴 내용이며, 기존에 제출했던 코드와 다를 수 있습니다.

---

## 미션 - 로또

[로또](https://github.com/woowacourse-precourse/java-lotto)

[구현한 코드](https://github.com/fancy-log/java-lotto-review/pull/1)

> **3주차 미션 목표**
1. 클래스(객체)를 분리하는 연습
2. 도메인 로직에 대한 단위 테스트를 작성하는 연습

> 공통 피드백에서 반영한 부분
* 함수(메서드) 라인에 대한 기준 - 15라인(3주차 피드백)
* 성공하는 케이스 뿐만 아니라 예외에 대한 케이스도 테스트한다(3주차 피드백)
* 연관성이 있는 상수는 static final 대신 enum을 활용한다(3주차 피드백)


### 기능 목록 작성

* 구현 동작 -> 구현 로직 -> 기능 목록 / 예외처리 목록 순으로 작성했다.

![](/assets/img/woowacourse/3th_lotto_1.png)

![](/assets/img/woowacourse/3th_lotto_2.png)

![](/assets/img/woowacourse/3th_lotto_3.png)



* 이번에는 LottoGame 기준으로 controller-domain-model-util-view 로 구성했다.

![](/assets/img/woowacourse/3th_lotto_4_structure.png)

---

## 피드백 반영

### 함수(메서드) 라인에 대한 기준 - 15라인(3주차 피드백)

* 3주차 공통 피드백에서 함수 라인을 15라인 이내로 제안하는 요구사항이 있었지만, 4주차 미션이였던 [다리건너기](https://github.com/woowacourse-precourse/java-bridge) 프로그래밍 요구사항에서 10라인 이내로 작성하는 게 있기 때문에, 10라인 이내로 구현하는 것으로 수정했다.


### 성공하는 케이스 뿐만 아니라 예외에 대한 케이스도 테스트한다(3주차 피드백)

* 예외에 대한 케이스도 테스트하기 위해 assertThatThrowBy()라는 함수를 사용했다.

* assertThatThrownBy : 예외가 throw됐을 경우 그 예외를 catch해주는 기능을 가진다.

![](/assets/img/woowacourse/3th_lotto_5_error_test_success.png)

### 연관성이 있는 상수는 static final 대신 enum을 활용한다(3주차 피드백)

* 이번 로또 게임에서는 Rank에 대해서 enum을 사용했다.

* enum을 사용하고 구현하니까 확실히 직관적으로 코드가 깔끔해질 수 있다는 것을 느꼈다.

![](/assets/img/woowacourse/3th_lotto_6_enum.png)

## 에러 발생

### ApplicationTest 실패

* test 폴더의 ApplicationTest 부분에서 에러가 발생했다.

* 제대로 확인해보니, 문제점은 총 3개였다.

1. 출력 결과에서 처음에 null이 뜬금없이 나오는데, 왜 그렇지..?라는 생각에 원인이 LottoMachine 클래스의 makeNumber 메서드에서 Collection.sort() 을 사용해서 그렇다. 알고보니, Collection.sort()를 사용하면 null이 발생했기 때문에 해당 함수를 주석처리해서 null 값은 사라졌다.

![](/assets/img/woowacourse/3th_lotto_7_makeNumber.png)

2. OutputView 클래스에서 출력부분에서 오타가 발생해서 에러가 발생한 것이다. 그래서 해당 부분을 미션에 나와있는 실행 결과 예시처럼 바꿨다.

![](/assets/img/woowacourse/3th_lotto_8_printResult.png)

3. 예외_테스트대로 ERROR_MESSAGE를 포함했음에도 테스트 결과가 실패했다. 그래서 해당 미션의 요구 사항을 다시 한번 확인했다.

![](/assets/img/woowacourse/3th_lotto_9_exception_test.png)

**기능 요구 사항** 의 일부분

![](/assets/img/woowacourse/3th_lotto_10_function_requirement.png)

* "[ERROR]로 시작하는 에러 메세지를 출력하고 종료한다."의미가 에러 메세지를 출력한 다음, 정상 종료해야 한다는 뜻이였다.

* 즉, 처음 시작부분이었던 Application 클래스에 에러 메세지를 출력해줘야 하면 된다.

* 그래서 main 메서드에서 try-catch문을 추가해줬다.

![](/assets/img/woowacourse/3th_lotto_11_main_try_catch.png)

* 3가지 문제점을 모두 수정한 뒤에 다시 테스트 해보니, 정상 처리가 되었다.

![](/assets/img/woowacourse/3th_lotto_12_test_results_success.png)

## 회고

* 이번 미션을 2번 복습하면서 이전보다 좀 더 구체적으로 어떤 부분이 부족했는지를 확인할 수 있었다.

* 무엇보다도 해당 미션을 통해 배운 것들을 따로 노트에 정리하면서 지식이 쌓여가고 성장한다는 것을 느낄 수 있었다.

* 그리고 에러 상황이 발생했을 때 하루 종일 고민해 봐도 어떤 문제인지 안 보였는데, 자고 일어나 보니 1시간 만에 확인할 수 있었다. 그래서, **문제점이 안 보일 때에는 때로는 다른 공부를 하든지, 혹은 수면을 취하고 다시 보는 것도 좋은 방안일 것 같다.**

* 포기하지 않고 끝까지 해보고 '조금 더 효율적이게, 더 보기 쉬운 코드가 되게' 코딩을 하는 게 중요한 것 같다.

* 내가 아무리 열심히 코드를 작성해도 남들이 내 코드를 이해하지 못한다면, 효율적이지 못하거나 쉬운 코드가 아닌 게 확실하기 때문이다. 우테코 프리코스 과정과 그 이후의 한 달간의 복습, 총 2달 동안 자바에 대해 많은 것을 배웠고 성장했지만,

* 이러한 느낌을 계속 가져가면서 꾸준히 공부해가자.
