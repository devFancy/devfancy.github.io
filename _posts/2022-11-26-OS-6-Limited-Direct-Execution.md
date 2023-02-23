---
layout: post
title:  " 6. Limited Direct Execution "
categories: OS
author: fancy96
---
* content
{:toc}

> 이 글의 사진과 내용은 [공룡책](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X) 과 컴퓨터학부 수업인 운영체제 강의자료를 기반으로 작성했습니다.

## (Virtual) Memory

* 32bit CPU의 메모리 주소 레지스터의 크기는 32bit

* CPU가 만들어내는(표현할 수 있는) 주소 개수 : 2^32

![](/assets/img/os/os-6-Limited-Direct-Execution_1.png)

* Stack : 지역 변수

* Heap : 할당된 변수 or malloc(), calloc()

---

## 1. CPU Virtualization

* How to provide the illusion of many CPU’s
  * OS가 많은 가상의(논리적인) CPU가 존재하는 것처럼 환상을 조장한다.

  * (single-core system으로 가장한다면) 물리적인 CPU 개수는 1개이다.

![](/assets/img/os/os-6-Limited-Direct-Execution_2.png)

* **`Time-sharing`** -> 핵심: **시간을 나눠서 사용한다**
  
  * User가 원하는 만큼 동시에 프로세스를 실행할 수 있다.
  
  * Round robin 방식에 의해서 하나의 프로세스를 실행하고, 멈춘 다음에 다른 프로세스를 실행한다.

![](/assets/img/os/os-6-Limited-Direct-Execution_3.png)

* CPU Virtualization을 구현하기 위해서 필요한 2가지

  * OS’s **low-level mechanism** (How) (e.g. Context switch)
  
  * OS’s **policy** (Which) (e.g. Scheduling policies)

---

## 2. Direct Execution

* **`Direct execution`** : CPU가 프로세스를 수행하는 동안에는 OS가 간섭하지 않는다.

![](/assets/img/os/os-6-Limited-Direct-Execution_4.png)

* 위의 표와 같이 한 번 실행하면 종료될 때까지 프로세스는 멈추지 않는다.

* 하지만 이 방법으로는 지금 구현하려고 하는 CPU 가상화를 구현할 수 없다.

* 한 번 실행된 프로세스에 대해 제어를 할 수 없으며 Time Sharing을 할 수 없다.

* Time Sharing을 하려면 어떠한 Limit를 해줘야 CPU 가상화를 구현할 수 있다.

---

## 3. Limited Direct Execution(LDE)

* Direct Execution는 프로그램을 빠르게 실행하는 장점이 있다.

* 하지만 실행 도중에 **(1)디스크에 대한 I/O 요청이 발생**하거나 **(2)CPU 혹은 Memory에서 더 많은 시스템 리소스에 대한 엑세스 권한을 획득**하는 경우를 해결할 수 없기 때문에 사용할 수 없다.

* 이를 해결하기 위한 방법으로 **`Limited Direct Execution`**을 사용한다.

### Problem#1: Restricted operations

* What to limit?

  * General memory access
  
  * Disk I/O
  
  * Certain instructions

* 이러한 문제를 해결하기 위해 User mode와 Kernel 모드로 상태를 구분한다.

* `User mode`에서는 수행할 수 있는 작업에 제한을 둬서 Application이 HW 리소스에 대한 완전한 접근을 가질 수 없다.

* 이를 보완하기 위해`Kernel mode`에서는 **OS**가 CPU 권한을 가지고 I/O요청과 같은 권한이 필요한 모든 작업을 수행할 수 있다.

**[System call 이란]**

* System call은 일종의 SW적인 인터럽트로서 사용자 프로그램이 system call을 할 경우 trap이 발생해 CPU의 제어권이 OS로 넘아가게 된다.

* 그러면 OS는 해당 system call을 처리하기 위한 루틴으로 가서 정의된 명령을 수행한다.


**[System call 과정 설명]**

* 만약 User mode의 프로세스가 Kernel mode에서 수행 가능한 작업을 원할 때에는 `System call`을 사용하면 된다.

* System call은 **user mode 프로세스에게 kernel mode에서 수행가능한 작업을 수행**할 수 있게 해준다.

* **System call**을 실행하기 위해서 **user process**는 `trap` 명령을 실행하여 Kernel로 Jump하고 kernel mode에서 권한 수준(1->0)을 올린 다음에 작업을 수행한다.

* 제한된 작업이 완료되면, **OS**는 `return-from-trap` 명령을 호출(call)하여 user mode로 권한 수준(0->1)을 내려준다.

![](/assets/img/os/os-6-Limited-Direct-Execution_5.png)


* **trap** 명령이 실행되면, processor는 program counter, falgs, 그리고 다른 register을 process별로 **kernel stack**으로 `push`한다.

* **return-from-trap** 명령이 실행되면, stack에서 값을 `pop`하고 user mode의 실행을 다시 시작한다.

**[System Call Procedure]**

* 아래 그림에서 user mode에서 kernel mode로 이동할 때 trap 명령을 실행하는 것을 확인할 수 있다.

![](/assets/img/os/os-6-Limited-Direct-Execution_6.png)

### Problem#2: Switching between processes

* Problem#1에서는 **하나**의 프로세스가 수행중에 권한이 있는 작업을 수행하는 방법에 대해 알아봤다.

* 그렇다면 이젠 하나가 아닌 **여러 개의 프로세스를 동시에 실행할 때 발생할 수 있는 문제**를 해결하자.

* 문제를 해결하기 위한 2가지 방법이 있다.

  * [1] 협력적인 방법
  
  * [2] 비협력적인 방법

* [1] 협력적인 방법으로는 **system call을 기다리는 방법**이다.
  
  * 프로세스가 system call을 실행하면 OS로 제어권이 넘어오게 되고 OS는 작업을 수행한 후에 다음 프로세스에게 제어권을 넘겨준다.
  
  * 하지만 만약에 프로세스가 **무한 루프(infinite loop)** 에 빠지게 되고, system call을 호출하지 않으면 어떻게 될까 ?
  
  * 해결이 안될 때에는 머신을 재부팅(reboot)해야 한다.

* [2] 1번을 해결하기 위해서 **`timer interrupt`를 사용**한다.
  
  * time interrupt는 일정 시간마다 interrupt를 발생시키는 방법이다.
  
  * time interrupt가 발생되면 OS가 제어를 갖고 다음 프로세스를 실행하는 의미이다.
  즉, `timer interrupt`는 특정 시간동안 **OS가 CPU를 다시 실행할 수 있는 권한을 준다. **
  
  * 하지만, 여기서 **여러 개의 프로세스를 잘 수행하려면** 기존에 실행했던 프로세스의 정보를 저장하고, 나중에 다시 실행할 때 저장된 정보를 가져오는 `Context switch` 을 사용해야 한다.
  
  * 여기서 `Context`는 프로세스와 관련된 정보의 집합을 의미한다.
  
  * Context switch는 **context saving**과 **context restoring**이라는 두 가지 방법이 있는데, 말 그대로 하나는 **현재 프로세스에 대한 레지스터 값들을 kernel stack에 `저장`하는 것**이고, 다른 하나는 **kernel stack으로부터 저장된 값을 `복구`하는 것**이다.

#### [Saving and Restoring Context]

![](/assets/img/os/os-6-Limited-Direct-Execution_7.png)

* 위와 같은 방식으로 Schedular가 switch를 원하면 context switch를 통해 Process A에서 Process B로 이동하게 된다.

#### [Example Of Context Switching]

![](/assets/img/os/os-6-Limited-Direct-Execution_8.png)

* 위의 예시처럼 Context Switching도 시간이 걸리며 오버헤드가 발생한다.

---

## 4. Worried About Concurrency?

* 하지만, 위의 문제들을 해결하고 또 다른 문제가 발생한다.

* 만약 interrupt 혹든 trap 처리하는 도중에 또 다른 interrupt가 발생한다면 어떻게 해야할까?

* 이러한 상황에서 OS는 두가지 방안으로 처리한다.
  
  * `Disable interrupts`
  : interrupt 처리중에는 다른 **interrupt들을 무시**한다.
  
  * `locking`
  : 내부의 자료 구조에 동시에 접근하는 것을 보호하기 위해 여러가지 정교한 **잠금** scheme를 사용한다.

---

## Review

* 이번 장은 **Limited Direct Execution**에 대해 복습하고 정리해봤다.

* 디스크에 I/O요청이 오거나 CPU 또는 메모리와 같은 더 많은 시스템 리소스에 접근을 허용할 때에는 **system call을 통해 mode switch 하는 방법**, 그리고 여러 개의 프로세스들이 동시에 실행할 때에는 **context switch를 통해 time interrupt를 사용하는 방법**을 배웠다.

## Reference

* [운영 체제와 정보기술의 원리](http://www.yes24.com/Product/Goods/90124877)

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)
