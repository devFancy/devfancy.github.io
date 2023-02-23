---
layout: post
title:  " 26. Concurrency: An Introduction "
categories: OS
author: fancy96
---
* content
{:toc}

> 이 글의 사진과 내용은 [공룡책](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X) 과 컴퓨터학부 수업인 운영체제 강의자료를 기반으로 작성했습니다.

## Multi-threaded Process 

Concurrency(동시성)을 구현하기 전에, 먼저 `Thread`에 대해 알아보자. 

### What is Thread?, What is Concurrency?

* `Thread`(스레드)란 하나의 프로세스 안에서 독립적으로 실행될 수 있는 개별 실행 단위(Each execution unit)이다.

![](/assets/img/os/os-concurrency-thread-concept.png)

* 위의 그림처럼 스레드는 단일 실행 프로세스에 대한 새로운 추상화 개념이다.

* 프로그램은 이처럼 동시에 다중의 스레드를 사용하여 실행된다.

### What is Multi-threaded Process?

* `Multi-threaded Process`란 하나 이상의 스레드보다 많은 것을 가진 프로세스를 의미한다.

    * `Context Switching unit`이 **thread**를 의미하며, 각각의 스레드는 자신만의 실행 상태(PC, register, stack)을 가진다.

    * 그리고 각 스레드의 실행 상태(execution state)는 OS에 의해 관리되는 **TCB**(Tread Control Block)에 저장된다.

![](/assets/img/os/os-concurrency-switching-thread.png)

* 실행하고 있는 T1에서 다른 T2로 Switching이 발생했을 때,

    * T1의 실행 상태는 TCB에 복사(저장)되어야 하고, T2의 실행 상태는 TCB로부터 복원(저장)되어야 한다.

    * 이때 T1, T2은 주소 공간을 **공유**한다는 점이다.

### Address Space of Multi-threaded Process

* 프로세스안에 있는 스레드들은 **주소공간을 공유**하는 특징을 가지고 있다. 

![](/assets/img/os/os-concurrency-process-thread.png)

* 프로세스는 각자 독립적인 주소 공간을 가지는데 비해 스레드들은 주소공간을 공유한다. 여기서 눈여겨 볼 부분이 `Stack`이다

![](/assets/img/os/os-concurrency-process-single-multi-thread.png)

* 왼쪽 그림에서는 싱글 스레드고, 오른쪽 그림은 멀티 스레드다.

* 멀티 스레드의 경우 몇 개의 스레드가 주소 공간을 공유하기 때문에 하나의 주소 공간만을 사용하는 것을 볼 수 있고, 각각의 스레드들은 개별적인 스택 공간을 갖고 있어서 위와 같이 주소 공간에 Stack 부분이 분산되어 있다.

* 스레드들은 자신만의 Stack을 가지고 있고 Code, Data, Heap은 공유한다는 점에서 프로세스와 차이점을 지닌다.

## Why use Multi-threaded Process? 

* `Multi-threaded Process`(멀티 스레드)란 하나의 프로세스안에 여러 개의 스레드로 구성하여 하나의 스레드가 하나의 작업을 처리하도록 하는 것이다.

* 스레드를 사용하는 이유는 크게 2가지다.

* 첫 번째는 병렬 처리가 간단하다. 단일 프로세스에서 여러 스레드가 각자 하나의 작업을 처리하기 때문에 시간을 절약할 수 있다. 이렇게 단일 프로세스에서 각각의 스레드들이 여러 CPU에서 실행하는 것을 `병렬화`라고 하며 이를 구현할 때 스레드를 사용하는 것이 일반적인 방법이다.

* 두 번째는 I/O로 인해 프로그램 수행이 차단되는 것을 막기 위해서이다. 다양한 유형의 I/O가 수행하는 프로그램이 있을 때, 프로그램의 자식 스레드가 오류가 나거나 긴 작업으로 인해 중단되었을 때 다른 스레드로 Context Switching하여 수행하면 I/O와 다른 작업들을 함께 수행할 수 있다.

![](/assets/img/os/os-concurrency-process-why-multi-thread.png)

## Problem and Solution 

* 하지만, 이런 스레드에서도 문제점이 존재한다.

* 첫 번째는 실행 순서가 OS 스케줄러에 의해 **누가 먼저 수행될지를 모른다**는 것이다.

* 다음 그림을 통해 제대로 이해해보자.

![](/assets/img/os/os-concurrency-problem-1.png)

* 여기서 순서를 다음과 같은 경우의 수를 들 수 있다.

```text
[첫 번째 경우의 수]

1. starts running 
2. create thread 1 
3. create thread 2 
4. running thread 1 
5. running thread 2

[두 번째 경우의 수]
1. starts running 
2. create thread 1 
3. running thread 1 
4. create thread 2 
5. running thread 2

[세 번째 경우의 수]
1. starts running 
2. create thread 1 
3. create thread 2 
4. running thread 2 
5. running thread 1
```

* 이 처럼 스레드는 OS 스케줄러에 의해 결정되므로 누가 먼저 수행될 지 알 수 없다.

### Race Condition

* 두 번째는 멀티 스레드에서 공유하는 데이터에 **동시에 접근할 때(업데이트 할 때) 문제가 발생**한다.

* 다음 그림을 통해 제대로 이해해보자.

![](/assets/img/os/os-concurrency-problem-2.png)

* 여기서 `counter`는 data 영역(전역 변수)라고 가정한다.

* 왼쪽은 예상된 결과인 counter 값이 12로 나오고, 오른쪽은 예상치 못한 결과인 counter 값이 11로 나오는 것을 확인할 수 있다.

* 오른쪽에서 2번째 순서인 `tmp = tmp + 1`를 끝나고 갑자기 **Context Switching**이 발생했을 때, 2번에서 counter 값이 업데이트 되지 않았기 때문에 3번에서 counter = 10으로 다시 시작된다.

* 그래서 4-5번을 거쳐 counter = 11로 끝나고 다시 Tread1로 넘어오면서 counter = 11 로 끝나는 결과를 보여준다.

* 이렇게 전역 변수와 같이 스레드에서 공유하는 데이터에 접근하는 상황을 **Race condition**(경쟁 상태)라고 하며, 

    여기서 전역 변수와 같은 공유되는 값을 **Critical section**(임계 영역)이라고 하며 위와 같이 **임계 영역에 여러 개의 스레드가 동시에 접근하면 원하는 결과를 얻지 못하는 상황이 발생**하게 된다.

* 그리고 임계 영역에 접근하는 스레드들 중에서 `어떤 스레드가 먼저 읽었는지`와 같은 접근 순서, 타이밍과 같은 것이 결과에 영향을 끼치는 상태를 **Indeterminate**(불확실성) 라고 말한다.

## Critical section

* `Critical section`(임계영역)은 여러개의 스레드가 동시에 접근해서는 안되는, 즉 하나의 스레드만 접근할 수 있는 영역이다.

* 다수의 스레드가 critical section 접근하면 Race condition(경쟁 상태)의 결과를 가져온다.

* 만약 어떤 스레드가 critical section에 접근하는 중이라면 다른 스레드가 접근할 수 없도록 **atomicity**(원자성)을 보장해야 하며, 이를 **mutual exclusion**(상호 배제)라고 부른다.


## Solution

Hardware 지원에서는 `Super instruction`이 있다.

* `Super instruction`이란 하드웨어가 명령어가 **atomically**하게 실행하도록 보장하는 것을 말한다.

* `atomic`이란 한 번에 진행하여 방해없이(끊김없이) 수행되는 것을 말한다. 하나의 명령어이기 때문에 중간에 끊을 수 없다.

    * 영어로 표현하면, **Could not be interrupted(all or nothing)** 이라고 말한다.

![](/assets/img/os/os-concurrency-solution.png)

Software 지원에는 다양한 종류들이 있다.

* Synchronization primitives, Mutex, Semaphore, Conditional variable, Monitor ...

## Review

* 스레드가 무엇인지, 프로세스와는 어떤 차이점을 지니는 지에 대해 알아봤고, 멀티 스레드의 장점과 문제점 및 해결방안들을 살펴봤다.

* 그리고 Concurrency에서 중요한 용어들(Critical section, Race condition, Mutual exclusion, Indeterminate)

* 다음 시간에는 쓰레드의 문제점을 해결하는 Software 지원의 여러 종류들 중에서 `Mutex`, `Semaphore`를 공부하고 정리해보도록 하자. 

## 예상 질문

* 스레드란 무엇인가요? 프로세스와 어떤 차이점을 가지고 있나요?

* 왜 멀티 스레드를 사용하는지, 멀티 스레드의 장점에 대해 설명해 주세요.

* 멀티 스레드의 문제점은 무엇인가요? (Race condition, Critical section, Mutual exclusion) 

* 멀티 스레드의 문제점에 대한 해결방안은 무엇인가요?

## Reference

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)

* [[OS] Concurrency(동시성)구현에서 Thread(스레드)의 문제점](https://icksw.tistory.com/155)