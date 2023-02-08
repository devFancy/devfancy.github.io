---
layout: post
title:  " 3.  Introduction to Computing Systems "
categories: OS
author: fancy96
---
* content
{:toc}

## 1. 컴퓨터 시스템의 구조

* 컴퓨터 시스템의 구조는 컴퓨터 내부장치인 CPU, 메모리와 컴퓨터 외부장치인 디스크, 키보드, 마우스, 모니터, 네트워크 장치 등으로 구성된다.

![](/assets/img/os/os-3-Intro-to-Computing-Systems_1.png)

* Processor와 Memory 부분이 컴퓨터 내부장치에 해당하고, 입출력 장치을 컴퓨터 외부장치라 부른다.

* 컴퓨터는 외부장치에서 내부장치로 데이터를 읽어와 각종 연산을 수행한 후, 그 결과를 외부장치로 다시 내보내는 방식으로 업무를 처리한다.

* 이때 컴퓨터 내부로 데이터가 들어오는 것을 `입력(input)`이라 하고, 컴퓨터 외부 장치로 데이터가 나가는 것을 `출력(output)`이라고 한다.

* 메모리 및 입출력 장치 등의 각 하드웨어 장치에는 `컨트롤러`라는 것이 붙어 있다.
  컨트롤러는 각 하드웨어 장치마다 존재하면서 이들을 제어하는 **작은 CPU**라고 할 수 있다.

* OS는 컴퓨터가 부팅되었을 때부터 항상 수행되면서 각종 자원들을 관리해야 하므로 항상 메모리에 올라가 있다.
  하지만 OS의 모든 코드를 다 메모리에 상주시키면 메모리의 낭비가 발생하게 된다. 따라서 OS 중 항상 메모리에 올라가 있는 부분은 전체 OS 중 핵심적인 부분에 한정되며, 이 부분을 `커널(kernel)`이라고 한다.

---

### Mode Bit

* Dual Mode in OS by setting mode bit

  * Mode bit **0** -> **커널 모드**
  : OS가 CPU권한을 갖는다. (시스템을 안전하게 유지, 관리하기 위해서)
  
  * **시스템의 중요한 동작들을 `OS`가 관리한다.**
  
  * Mode bit **1** -> **User 모드**
  : User가 CPU 권한을 갖는다.
  
    * Why dual mode(or multi-mode)?
    
    * **OS 그 자체와 다른 시스템의 구성요소들을 보호**하기 위해서다.

---

### Timer

* Timer는 특정 시간이 지나면 **CPU를 중단시키는 것**이다.

![](/assets/img/os/os-3-Intro-to-Computing-Systems_2.png)

* Timer가 동작되면 기존 프로그램을 멈춘 다음, User 모드에서 Kernel 모드로 이동시킨 후 그 다음 프로그램을 수행시킨다.

* User program이 CPU를 `독점(monopolizing)`하는 것을 막아준다.

* `시분할 시스템(time-sharing system)` 구현에 사용된다.

---

## 2. CPU 연산과 I/O 연산

![](/assets/img/os/os-3-Intro-to-Computing-Systems_1.png)

* 컴퓨터에서 연산을 한다는 것은 CPU가 무언가 일을 한다는 뜻이다.

* 각 장치마다 이를 제어하기 위해 설치된 장치 컨트롤러는 장치로부터 들어오고 나가는 **데이터를 임시로 저장**하기 위한 작은 메모리를 가지고 있는데, 이를 `로컬버퍼(local buffer)`라고 부른다.

* 디스크나 키보드 등에서 데이터를 읽어오는 경우, 우선 로컬버퍼에 데이터가 임시로 저장된 후 메모리에 전달된다.

* 이때 장치에서 로컬버퍼로 읽어오는 일은 **컨트롤러(controller)**가 담당한다.

* 로컬버퍼로 읽어오는 작업이 끝났는지를 메인 CPU가 지속적으로 체크하는 것이 아니라 장치에 있는 **컨트롤러가 인터럽트를 발생시켜 CPU에 보고**하게 된다.

![](/assets/img/os/os-3-Intro-to-Computing-Systems_3.png)

* 이때 `인터럽트(interrupt)`란 **컨트롤러들이 CPU의 서비스가 필요할 때 이를 통보하는 방법**을 말한다.

* 기본적으로 CPU는 매 시점 메모리에서 명령(instruction)을 **하나씩** 읽어와서 수행한다.

* 이때 CPU 옆에는 `인터럽트 라인(interrupt line)`이 있어서, CPU가 자신의 작업을 하던 중간에 **인터럽트 라인에 신호가 들어오면** 하던 일을 멈추고 인터럽트와 관련된 일을 **먼저 처리**한다.

* 즉, **CPU는 명령 하나를 수행할 때마다 인터럽트가 발생했는지 확인한다.**

---

## 3. 인터럽트의 일반적 기능

* OS는 각종 HW 및 SW 자원 관리뿐 아니라 사용자 프로그램에 필요한 서비스도 제공한다. 그 중 한가지가 **인터럽트 처리루틴**이다.

* CPU는 하던 일을 잠시 멈추고 이 인터럽트가 발생하였을 때 **OS 커널 내**에서 해당 인터럽트의 처리를 위해 정의된 코드를 찾아 수행한다.

* 이때 수행하는 일은 디스크의 로컬버퍼에 있는 내용을 사용자 프로그램의 **메모리**로 전달하고, 해당 프로그램이 CPU를 할당받을 경우 **다음 명령**을 수행할 수 있음을 표시해두는 일이다.

* OS는 할 일을 쉽게 찾아가기 위해 `인터럽트 벡터(interrupt vector)`를 가지고 있다.

* `인터럽트 벡터`란 **인터럽트 종류마다 번호를 정해서, 번호에 따라 처리해야 할 코드가 위치한 부분을 가리키고 있는 자료구조**를 말한다.

* 실제 처리해야할 코드는 **인터럽트 처리루틴(interrupt service routine) 또는 인터럽트 핸들러(interrupt handler)** 라고 불리는 다른 곳에 정의된다.

### 내부 인터럽트 종류

Software interrupt 또는 Internal interrupt

* Trap

  * 의도적이다.
  
  * 예시) **system call**
  
  * 이벤트 수행하고 나면 **"next"** 명령으로 간다.

* Fault

  * 의도치 않는 실수이지만 복구 가능하다.

  * 예시) page fault
  
  * **"current"** 명령을 재수행하거나 중단한다.

* Abort
  
  * 의도치 않는 실수이고 복구 불가능하다.
  
  * 예시) illegal instruction
  
  * 현재 프로그램이 멈춘다.

---

## 4. 인터럽트 핸들링

* 인터럽트 핸들링(interrupt handling)이란 인터럽트가 발생한 경우에 처리해야 할 일의 절차를 의미한다.

* OS는 현재 시스템 내에서 실행되는 프로그램들을 관리하기 위해 `프로세스 제어블록`(Process Control Block: **PCB**)이라는 자료구조를 둔다. 
PCB는 각각의 프로그램마다 **하나씩** 존재하며 **해당 프로그램의 어느 부분이 실행 중이었는지**를 저장하고 있다.

* 프로그램 A가 실행되던 중에 인터럽트가 발생하면 A의 **현재 상태**를 PCB에 저정한 후 CPU의 제어권이 **인터럽트 처리루틴**으로 넘어가게 되며, 인터럽트 처리가 끝나면 저장된 상태를 PCB로부터 CPU상에 복원해 **인터럽트 당하기 직전의 위치**부터 실행이 이어지게 되는 것이다.

---

## 5. 입출력 구조

* 입출력(I/O)이란 컴퓨터 시스템이 컴퓨터 외부의 입출력 장치들과 데이터를 주고받는 것을 말한다.

![](/assets/img/os/os-3-Intro-to-Computing-Systems_4.png)

### 동기식 입출력(Synchronous I/O)

* 동기식 입출력은 프로그램 A가 입출력 요청을 했을 때 입출력 작업이 완료된 후에야 프로그램 A의 후속 작업을 수행할 수 있는 방식을 말한다.

* 동기식 입출력에서 CPU는 입출력 연산이 끝날 때까지 인터럽트를 기다리며 자원을 낭비하게 된다.

### 비동기식 입출력(Asynchronous I/O)

* 비동기식 입출력은 입출력 연산을 요청한 후에 연산이 끝나기를 기다리는 것이 아니라 CPU의 제어권을 입출력 연산을 호출한 그 프로그램에게 곧바로 다시 부여하는 방식을 말한다.

#### 예시

![](/assets/img/os/os-3-Intro-to-Computing-Systems_5.png)

* 왼쪽이 비동기식 입출력, 오른쪽이 동기식 입출력이다.

---

## 6. DMA

DMA(Diredt Memory Access)

* 원칙적으로 메모리는 **CPU에 의해서만** 접근할 수 있는 장치이다.

* CPU 외의 장치가 메모리의 데이터에 접근하기 위해서는 **CPU에게 인터런트를 발생시켜 CPU가 이를 대행하는 식**으로만 가능하다.

* 하지만, 컨트롤러가 CPU에게 인터럽트를 발생시키면 CPU는 컨트롤러의 로컬버퍼와 메모리 사이에서 데이터를 옮기는 일을 하게 된다.

* 모든 메모리 접근 연산이 CPU에 의해서만 이루어질 경우 입출력 장치가 메모리 접근을 원할 때마다 인터럽트에 의해 CPU의 업무가 방해를 받게 되어 **CPU 사용의 효율성이 떨어지는 문제점**을 발생하게 된다.

* 이러한 비효율성을 극복하기 위해 CPU 이외에 메모리 접근이 가능한 장치를 `DMA`라고 부른다.

![](/assets/img/os/os-3-Intro-to-Computing-Systems_6.png)

* DMA는 일종의 컨트롤러로서, **CPU가 입출력 장치들의 메모리 접근 요청에 의해 자주 인터럽트 당하는 것을 막아주는 역할**을 한다.

* 이때 DMA는 **블록(block)** 이라는 큰 단위로 정보를 메모리로 읽어온 후에 CPU에게 인터럽트를 발생시켜서 해당 작업의 완료를 알려준다.

* 이러한 방식으로 CPU에게 발생하는 **인터럽트의 빈도를 줄여 CPU를 좀 더 효율적으로 관리**하고 **입출력 연산을 빠르게 수행**할 수 있게 된다. (interrupt 낮추고, CPU 성능 높이는)

---

## 7. Bus

![](/assets/img/os/os-3-Intro-to-Computing-Systems_7.png)

* Northbridge(= Memory Controller Hub) : PC motherboard 에 있는 핵심 로직 칩셋에서 두개의 칩 중 하나이다.

  * CPU, Memory, Graphic card에 직접적으로 연결 O
  
  * 매우 빠른 의사소통을 처리한다.
  
  * PCle bus를 통해 "southbridge"로 연결된다.

* Southbridge(= I/O Controller Hub) : 모든 컴퓨터 I/O 기능들을 관리하는 칩이다.
  
  * USB, audio, serial, BIOS 등등
  
  * CPU에 직접적으로 연결 X

![](/assets/img/os/os-3-Intro-to-Computing-Systems_8.png)

## Reference

* [운영 체제와 정보기술의 원리](http://www.yes24.com/Product/Goods/90124877)

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)
