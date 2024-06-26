---
layout: post
title:  " 1-2. Introduction to OS "
categories: OS
author: devfancy
---
* content
{:toc}

> 이 글의 사진과 내용은 [공룡책](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X) 과 컴퓨터학부 수업인 운영체제 강의자료를 기반으로 작성했습니다.

## 1. 운영체제의 정의

`OS`는 컴퓨터 하드웨어 바로 윗단에 설치되는 소프트웨어.

![](/assets/img/os/os-1-and-2-Introduction_1.png)

* 각종 SW들은 위의 그림과 같이 HW와 OS가 한 몸으로 존재하는 컴퓨터 시스템 위에서 수행되는 것으로 볼 수 있다.

* 컴퓨터 전원을 On 하면, OS는 이와 동시에 실행된다.

* OS 중 항상 필요한 부분만을 전원이 On과 동시에 메모리에 올려놓고 그렇지 않은 부분은 필요할 때 메모리에 올려서 사용하게 된다.

![](/assets/img/os/os-1-and-2-Introduction_2.png)

* 이때 메모리에 상주하는 운영체제의 부분을 `커널(kernel)`이라고 부르며 이를 좁은 의미의 운영체제라고도 부른다.

* 즉 커널은 운영체제 코드 중에서도 핵심적인 부분을 뜻한다.

---

## 2. 운영체제의 기능

![](/assets/img/os/os-1-and-2-Introduction_1.png)

컴퓨터 HW와 User 사이에 OS가 존재하므로, OS의 역할은 `HW를 위한 역할`과 `User를 위한 역할`의 두 가지로 나누어볼 수 있다.

* `HW`쪽에서는 User가 직접 다루기 힘든 각종 HW를 OS가 관리하는 역할을 하며, `User`에게는 편리한 Interface를 제공하는 역할을 한다.

* OS의 두 가지 주요 기능

  * [1] **컴퓨터 시스템 내의 자원을 효율적으로 관리하는 것** -> 중요한 핵심 기능

  * [2] .컴퓨터 시스템을 편리하게 사용할 수 있는 환경을 제공하는 것

* OS를 `자원관리자(resource manager)`라고 부르기도 한다.

  * 여기서 `자원`이란 CPU, Memory, HardDisk 등 HW 자원뿐 아니라 SW 자원까지를 통칭해서 부르는 말이다.

![](/assets/img/os/os-1-and-2-Introduction_3.png)

* OS는 사용자 및 프로그램들 간에 **자원이 형평성 있게 분배**되도록 하는 `균형자` 역할도 함께 수행해야 한다.

* 효율성이 가장 큰 목표이지만 이로 인해 일부가 지나치게 희생되지 않게 하는 형평성 역시 OS가 고려해야할 목표이다.

* 이 밖에도 OS는 사용자와 OS 자신을 보호하는 역할을 담당하기도 한다.

---

## 3.운영체제의 분류

OS를 분류하는 기준 `동시 작업`이 있다.

* 동시 작업을 지원하는 여부

  * 단일작업용 OS : 한 번에 하나의 프로그램만 실행 시킬 수 있다.
  
  * 다중작업용 OS : 2개 이상의 프로그램을 처리할 수 있다.

* OS가 다중작업을 처리할 때에는 여러 프로그램이 CPU와 메모리를 공유하게 된다. 참고로 컴퓨터 1개당 CPU는 1개만 존재한다.

* 하지만, CPU의 처리 속도가 워낙 빨라 짧은 시간의 규모로 여러 프로그램들이 CPU에서 번갈아 실행된다. 그렇기 때문에 사용자 입장에서는 여러 프로그램이 동시에 실행되는 것처럼 보인다. 이와 같이 CPU의 작업시간을 여러 프로그램들이 조금씩 나누어 쓰는 시스템을 `시분할 시스템`이라고 부른다.

* CPU와 달리 `메모리`의 경우 여러 프로그램들이 조금씩 메모리 공간을 보유하며 동시에 메모리에 올라가 있을 수 있다.
  이처럼 메모리 공간을 분할해 여러 프로그램들이 동시에 메모리에 올려놓고 처리하는 시스템을 `다중 프로그래밍 시스템`이라고 부른다.

* 다중작업용 OS경우 여러 프로그램을 같이 실행시키지만

  * 사용자 입장에서는 각 프로그램에 대한 키보드 입력의 결과를 화면에 보여주기 때문에 이러한 시스템을 `대화형 시스템`이라고 부른다.

* 다중작업, 시분할, 다중 프로그래밍, 대화형 시스템은 **모두 여러 프로그램이 하나의 컴퓨터에서 동시에 실행된다.**

---

* `다중처리기 시스템`은 하나의 컴퓨터 안에 CPU가 여러 개 설치된 경우를 뜻하므로 앞의 용어들과는 의미가 다르다.

* CPU가 여럿 있는 컴퓨터는 서로 다른 CPU에서 여러 프로그램이 동시에 실행될 수 있어 처리가 더욱 빨라지지만,

  * **OS입장**에서는 여러 CPU를 관리하기 위해 **더욱 복잡한 메커니즘**을 필요로 한다.

---

OS를 분류하는 또다른 기준은`다중 사용자에 대한 동시 지원`이다.

- 단일 사용자용 OS : 한 번에 한 명의 사용자만이 사용하도록 허용하는 OS (ex. DOS)
- 다중 사용자용 OS : 여러 사용자가 동시에 접속해 사용할 수 있게 하는 OS (ex. 이메일 서버, 웹 서버)

---

OS를 분류하는 또 다른 기준은 `작업을 처리하는 방식`이다.


* [1] 일괄처리(Batch processing)

  * 요청된 작업을 일정량씩 모아서 한꺼번에 처리하는 방식이다.

* [2] 시분할 방식(**Time sharing**)

  * 여러 작업을 수행할 때 컴퓨터의 처리 능력을 **일정한 시간 단위로 분할**해 사용하는 방식이다.

  * 일괄처리 방식에 비해 **짧은 응답시간**을 갖게 된다.
  
  * 사용자의 요청에 대한 결과를 곧바로 얻을 수 있는 시스템을 대화형 시스템이라고 표현

* [3] 실시간(Real time)
  
  * **정해진 시간 안에 어떠한 일이 반드시 처리**됨을 보장해야 하는 시스템에서 사용된다.
  
  * 실시간 시스템은 `시간제약의 중요성`에 따라 경성 실시간 시스템(hard realtime system)과 연성 실시간 시스템(soft realtime system) 두가지로 세분화할 수 있다.
  
    * [A] 경성 실시간 시스템(Hard realtime system) : 주어진 시간을 지키지 못할 경우 매우 위험한 결과를 초래할 가능성이 있는 시스템을 말한다.
  
    * [B] 연성 실시간 시스템(Soft realtime system) : 데이터가 정해진 시간 단위로 전달되어야 올바른 기능을 수해할 수 있는 시스템을 말한다.
    시간이 지켜지지 않을 경우 정확히 전달되지 않을 우려가 있지만, 경성 실시간 시스템처럼 위험한 결과를 초래하지는 않는다.

---

## 4. 운영체제의 자원 관리 기능

**OS의 가장 핵심적인 기능**은 `자원을 효율적으로 관리`하는 것

여기서 자원은 HW 자원과 SW 자원으로 나뉜다.

* HW 자원 : CPU와 메모리를 비롯해 주변장치 또는 입출력 장치라 불리는 장치들로 구성된다.

* CPU와 메모리는 전원이 꺼지면 처리 중이던 정보가 모두 지워지기 때문에 전원이 나가도 기억해야 하는 부분을 입출력 장치 중 한 종류인 `보조기억장치`에 파일 형태로 저장한다.

* 이때 이러한 파일들이 저장되는 방식 및 접근 권한에 대해서도 OS가 관리해줘야 한다.

* 보조기억장치로 사용되는 대표적인 매체로는 **하드디스크**가 있으며, 이외에도 **키보드, 모니터**가 있다.

![](/assets/img/os/os-1-and-2-Introduction_4.png)

---

### CPU를 관리하는 방법

* 매 시점 어떠한 프로세스에 CPU를 할당해 작업을 처리할 것인지 결정하는 일이 필요하다.

* 이러한 일을 `CPU 스케줄링(CPU scheduling)`이라고 한다.

* CPU 스케줄링의 목표는 **CPU를 효율적으로 사용하면서도, 특정 프로세스가 불이익을 당하지 않도록 하는 것**이다.

* 대표적인 CPU 스케줄링 기법
  
  * 선입선출(First Come Fiest Served, FCFS)
  
  * 라운드 로빈(Round Robin)
  
  * 우선순위(priority)

* [1] `선입선출 기법(FCFS)`

  * CPU를 사용하기 위해 도착한 프로세스들 중 **먼저 온 것을 처리해주는 방식**(일상생활에서 줄을 서는 것과 유사하다)

  * 이 방식에서는 CPU를 먼저 얻은 프로세스가 원하는 작업을 완료할 때까지 다른 프로세스들이 CPU를 사용하지 못한다.

  * 전체 시스템 입장에서는 비효율적인 결과를 초래할 가능성이 있다.

  * 이러한 선입선출 기법의 단점을 보완하고자 고안된 기법이 라운드 로빈 기법이다.

* [2] `라운드 로빈기법(Round Robin)`
  
  * CPU를 한 번 할당받아 **사용할 수 있는 시간을 일정하게 고정된 시간으로 제한**한다.
  
  * 긴 작업을 요하는 프로세스가 CPU를 할당받더라도 정해진 시간이 지나면 CPU를 내어놓고 CPU 대기열의 제일 뒤에 가서 줄을 서야 한다.

* [3] `우선순위(priority)`
  
  * CPU 사용을 위해 대기 중인 프로세스들에 우선순위를 부여하고 우선순위가 높은 프로세스에 CPU를 먼저 할당한다.
  
  * 시스템 내의 프로세스 중에는 상대적으로 **더 중요한 프로세스**가 있을 수 있으므로 그런 **프로세스의 우선순위를 높게 하여 CPU를 먼저 획득할 수 있도록 한다는 점이** 우선순위 스케줄링의 핵심이다.

---

### 메모리를 관리하는 방법

* `메모리`는 CPU가 직접 접근할 수 있는 컴퓨터 내부의 기억장치이다.

* 한정된 메모리 공간에 여러 프로그램을 수용하려면 메모리에 대한 효율적인 관리 매커니즘이 필요하다.

* 따라서 메모리 관리를 위해 OS는 메모리의 어느 부분이 어떤 프로그램에 의해 사용되고 있는지를 파악하여 이를 유지하게 되는데, 이러한 정보는 `주소(address)`를 통해 관리된다.

* OS는 프로그램에 메모리가 필요할 때 `할당`하고, 더 이상 필요하지 않을 때 `회수`한다.

* OS는 **전체 메모리 공간이 효율적으로 사용**될 수 있도록 해야한다.

* OS는 각 프로세스가 **자신의 메모리 영역에만 접근**할 수 있도록 관리해야 한다.

* 물리적 메모리를 관리하는 방식

1. `고정분할(fiexd partition)` 방식
: 물리적 메모리를 몇개의 분할로 미리 나누어 관리한다.
  
   * 메모리에 동시 적재되는 최대 프로그램의 수가 분할 개수로 한정된다.(융통성이 없다)

   * 분할의 크기보다 큰 프로그램은 적재 X

2. `가변분할(variable partition)` 방식
: 매 시점 프로그램의 크기에 맞게 메모리를 분할해서 사용하는 방식을 말한다.

   * 분할의 크기 때문에 큰 프로그램의 실행 O
   
   * 그러나 물리적 메모리의 크기보다 더 큰 프로그램의 실행 X

3. `가상메모리(virtual memory)` 방식
: 물리적 메모리보다 더 큰 프로그램이 실행 O

   * 이때 실행될 수 있는 프로그램의 크기는 `가상메모리의 크기`에 의해 결정된다.
   
   * 모든 프로그램은 물리적 메모리와는 독립적으로 0번지부터 시작하는 자신만의 `가상메모리 주소`를 갖는다.
   
   * OS는 이 가상메모리 주소를 물리적 메모리 주소로 `매핑(mapping)`하는 기술을 이용해 주소를 변환시킨 후 프로그램을 물리적 메모리에 올리게 된다.
   
   * 이것을 가능하게 하는 원리는 다음과 같다.

``` markdown
    프로그램의 전체 크기 2Gbyte일지라도 전체가 항상 동시에 사용되는 것은 아니다.
    현재 사용되고 있는 부분만 메모리에 올리고,
    나머지는 하드디스크와 같은 보조기억장치에 저장해두었다가
    필요할 때 적재하는 방식을 취한다.
    
    이때 사용되는 보조기억장치의 영역을 스왑 영역(swap area)이라고 부른다.
    
    프로그램을 구성하는 가상메모리 주소 공간은 페이지(page)라는 
    동일한 크기의 작은 단위로 나누어 물리적 메모리와 스압 영역에 일부분씩 저장된다.
    
    이렇게 동일한 단위로 메모리를 나누느 기법은 페이징(paging)기법이라고 한다.
```
  
---    

### 주변 장치 및 입출력 장치 관리

* 주변장치 및 입출력 장치는 CPU나 메모리와 달리 `인터럽트(interrupt)`라는 메커니즘을 통해 관리가 이루어진다.

* 주변장치들은 CPU의 서비스가 필요한 경우에 신호를 발생시켜 서비스를 요쳥하는데, 이때 발생시키는 신호를 `인터럽트`라고 한다.

* CPU는 평소 CPU 스케줄링에 따라 자기에게 주어진 작업을 수행하다가 인터럽트가 발생하면 하던 일을 잠시 멈추고 인터럽트에 의한 요청 서비스를 수행한다.

* OS는 인터럽트를 처리한 후 원래 수행하던 작업으로 돌아오기 위해 인터럽트 처리 직전에 수행 중이던 작업의 상태를 저장해둔다.

* 인터럽트는 요청하는 장치와 발생 상황에 따라 다양한 종류가 있기 때문에 OS는 인터럽트의 종류마다 서로 다른 인터럽트 처리루틴을 가지고 있다.
  `인터럽트 처리루틴`이란 **인터럽트가 발생했을 때 해주어야 할 작업을 정의한 프로그램 코드**를 말한다.
  이것은 OS 커널 내에 존재하는 코드로 CPU 스케줄링, 메모리 관리루틴 등 다양한 기능을 위한 커널 코드의 일부분이라고 할 수 있다.

## Reference

* [운영 체제와 정보기술의 원리](http://www.yes24.com/Product/Goods/90124877)

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)
