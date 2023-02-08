---
layout: post
title:  " 4-5. Process "
categories: OS
author: fancy96
---
* content
{:toc}

## 1. 프로세스의 개념 (A Process)

* `프로세스`란 실행 중인 프로그램(program in execution)을 뜻한다.

  * Disk에 실행파일 형태로 존재하던 프로그램이 `Memory`에 올라가서 **실행되기 시작**하면 비로소 **생명력을 갖는** 프로세스가 되며, 프로세스는 CPU를 반환하고 입출력 작업을 수행하기도 한다.

* 
* 프로그램은 “a set of data associated with that code"을 뜻한다.
  
  * 디스크에 있으며, CPU 권한을 바로 누릴 수 없다.(수행될 준비 X)

Code, Program, and Process

![](/assets/img/os/os-4-and-5-Process_1.png)

Process Creation: A Little More Detail

![](/assets/img/os/os-4-and-5-Process_2.png)

---

## 2. 프로세스 상태 (Process States)

* 프로세스의 상태는 실행(running), 준비(ready), 봉쇄(blocked, wait, sleep)의 세 가지로 구분한다.

![](/assets/img/os/os-4-and-5-Process_3.png)

* `실행`(**Running**)상태는 프로세스가 (1)해당 프로세스를 수행하기 위해 필요한 모든 리소스를 갖고 있고, (2)CPU에 대한 권한이 있다.

  * CPU 권한이 없을 때 Ready 상태로 이동한다.
  
  * 필요한 정보가 충분하지 못한 상태(I/O 작업이 시작할때)인 경우 Blocked로 이동한다.

* `준비`(**Ready**)상태는 (1)해당 프로세스를 수행하기 위해 필요한 모든 리소스는 갖고 있지만, (2)CPU에 대한 권한이 없다.
  
  * Scheduled 되었으면 Running 상태로 이동한다.

* `봉쇄`(**Blocked, Wait**)상태는 해당 프로세스를 수행하기 위한 필요한 모든 리소스를 갖고 있지 못하고, CPU에 대한 권한도 없다.(ex. 입출력 작업이 진행 중인 경우)
  * I/O가 완료되었으면 해당 프로세스는 리소스를 갖게 되면서 Ready 상태로 간다.

* 이와 같이 프로세스의 상태를 구분하는 이유는 **컴퓨터의 자원을 효율적으로 관리**하기 위해서이다.

### 5-State Model

![](/assets/img/os/os-4-and-5-Process_4.png)

* `시작`(**New**)상태는 프로세스을 위한 PCB가 생성되었지만 아직 충분한 리소스를 할당받지 못한 상태이다.(메모리 획득을 승인받지 못한 상태)

* `종료`(**Terminated**)상태는 프로세스가 작업을 완료하여 메모리 자원을 반납하고 PCB가 삭제된 상태이다.

* 실행시킬 프로세스를 변경하기 위해 원래 수행 중이던 프로세스의 문맥을 저장하고 새로운 프로세스의 문맥을 세팅하는 과정을 `문맥교환`(context switch)이라고 한다.

``` markdown
예를 들어, 실행 상태에 있던 프로세스가 입출력 요청 등으로
봉쇄 상태로 바뀌는 경우를 들 수 있다.

이때 준비 상태에 있는 프로세스들 중에서
CPU를 할당받을 프로세스를 선택한 후
실제로 CPU의 제어권을 넘겨받는 과정을 CPU 디스패치(dispatch)라고 한다.
```

* 그 밖에 상태들
  
  * 일정기간 exit된 프로세스를 OS가 관리하는 경우를 `Zombie` 상태라고 한다.
  
  * 자식 프로세스가 종료되기 전에 부모 프로세스가 종료된 상태를 `Orphan` 상태라고 한다.

### 7-State Model

![](/assets/img/os/os-4-and-5-Process_5.png)

* 메인 메모리의 용량이 실행해야 하는 더 많은 프로세스를 로드하기에 충분하지 않은 경우 `Swapping`을 사용한다.

  * **Swapping**이란 `메모리 공간 확보`를 위해 필요에 의해서 **메인 메모리**에 있는 프로세스 일부를 **디스크**에 내려보내는 것을 말한다.

* Suspend vs Preemption

  * Suspend : 메모리 공간이 부족해서 급한 것부터 처리하기 위해서 메인 메모리에 있는 Ready 또는 Blocked(Wait)에 있는 것들을 디스크로 내려 보내는 것을 말한다.
  
  * Preemption: Running state에서 Ready state로 가는 것을 말한다. (현재 수행되고 있는 것을 멈춘다)

  ![](/assets/img/os/os-4-and-5-Process_6.png)

  * Swap Out : 메모리 -> 디스크
  
  * Swap In : 디스크 -> 메모리

---

## 3. 프로세스 제어블록(PCB)

* `프로세스 제어블록`(Process Control Block: **PCB**)이란 OS가 시스템내의 프로세스들을 관리하기 위해 프로세스마다 유지하는 정보들을 담는 커널 내의 자료구조를 뜻한다.

  * 쉽게 말해, **기본 프로세스에 대한 정보를 갖고 있는 자료구조**이다.
  
  * 프로세스 상태 관리와 문맥 교환을 위해 필요하다.
  
  * PCB는 프로세스 생성시 만들어지며 메모리에 유지된다.

### Information in PCB

![](/assets/img/os/os-4-and-5-Process_6_2.png)

* **PID**(Process Identification Number)

* **Process state** (running, blocked, ready) : CPU를 할당해도 되는지 여부이다.

* **Program counter** : 다음에 수행할 명령어의 위치를 가리킨다.

* **CPU registers** : CPU 연산을 위해 현 시점에 레지스터에 어떤 값을 저장하고 있는지를 나타낸다.

* Sheduling information : CPU 스케줄링을 위한 필요한 정보이다.

* Memory management information : 메모리 할당을 위해 필요한 정보이다.

* I/O status information : 프로세스가 오픈한 파일 정보 등 프로세스의 입출력 관련 상태 정보를 나타낸다.

* Accounting informaion : 사용자에게 자원 사용 요금을 계산해 청구하는 용도이다.

* Program counter와 CPU registers는 **"context"**에 해당한다.

---

## 4. 문맥교환(context switch)

* 문맥교환이란 하나의 사용자 프로세스로부터 다른 사용자 프로세스로 CPU의 제어권이 이양되는 과정을 뜻한다.

* 문맥교환은 **타이머 인터럽트가 발생**하는 경우 외에 실행 중이던 프로세스가 **입출력 요청**이나 다른 조건을 충족하지 못해 CPU를 회수당하고 봉쇄 상태가 되는 경우에도 발생할 수 있다.

---

## 5. fork()

* 시스템이 부팅된 후 최초의 프로세스는 OS가 직접 생성하지만 그다음부터는 이미 존재하는 프로세스가 다른 프로세스를 복제, 생성하게 된다.

* 이때 프로세스를 생성한 프로세스를 `부모` 프로세스라고 하고, 새롭게 생성된 프로세스를 `자식` 프로세스라고 한다.

* 즉, 부모 프로세스가 자식 프로세스를 생성하게 되는 것이다.

* 이러한 방식을 통해 프로세스는 족보와 같은 **계층**을 형성하게 된다.

* 프로세스의 세계에서는 자식이 먼저 죽고, 이에 대한 처리는 자식을 생성했던 부모 프로세스가 담당하는 방식으로 진행된다.

* 즉, 부모 프로세스는 **자식 프로세스들을 연쇄적으로 종료시킨 후**에야 종료될 수 있다.

### fork: Creating New Processes

* Unix에서 fork() 시스템 콜은 자식 프로세스를 생성할 때 부모 프로세스의 내용을 그대로 복제 생성하게 된다.

![](/assets/img/os/os-4-and-5-Process_7.png)

* 즉, **프로세스 ID(pid)를 제외한** 모든 정보를 그대로 복사하는 방법을 사용한다. 따라서 부모 프로세스와 자식 프로세스는 비록 **주소 공간을 따로 갖게 되지만** 주소 공간 내에는 동일한 내용을 가지게 된다.

* fork()를 통해 생성된 자식 프로세스는 exec() 시스템 콜을 통해 새로운 프로그램으로 주소 공간을 덮어씌울 수 있다.

* 이때 부모 프로세스에서는 자식 pid가 반환되고 `자식 프로세스`에서는 **0**이 반환된다. 만약 fork() 함수 실행이 실패하면 **-1**을 반환한다.

### fork() example

![](/assets/img/os/os-4-and-5-Process_8.png)

첫번째 예시( int main() )

* 위에서 자식 프로세스는 fork() 함수의 반환값이 0이라고 했다.

* 따라서 pid 가 0일 때는(child) x가 1증가해 "child: x=2"이 출력된다.

* 부모 프로세스는 자식 pid를 받으므로, 0이 아니기 때문에 "parent: x=0"이 출력된다.

두번째 예시( void fork2() )

* fork()를 할 때마다 자식 프로세스가 생성되는 것을 확인할 수 있다.

* 정리하자면, **fork() 반환 결과가 0이라면 `자식 프로세스`이고 0이 아니면(자식프로세스의 id를 가질것) `부모 프로세스`**이다.

## Reference

* [운영 체제와 정보기술의 원리](http://www.yes24.com/Product/Goods/90124877)

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)
