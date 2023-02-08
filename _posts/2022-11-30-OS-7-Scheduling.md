---
layout: post
title:  " 7. Scheduling "
categories: OS
author: fancy96
---
* content
{:toc}

* **`CPU 스케줄링`**이 필요한 이유 : CPU를 사용하는 패턴이 상이한 여러 프로그램이 동일한 시스템 내부에서 함께 실행되기 때문

* CPU 버스트가 균일하지 않은 다양한 프로그램들이 공존하므로 **효율적인 CPU 스케줄링 기법**이 반드시 필요하다.

---

## Process Scheduling

### Process scheduling 이란?

* **ready queue**에 있는 프로세스들 중 어떠한 프로세스에게 CPU를 할당할지 OS가 결정하는 것이다.
  (ready queue : 프로세스를 수행하기 위해 필요한 모든 리소스를 가지고 있지만, CPU 권한만 없는 상태)

* 기본적인 multi-programmed OS이다.

* "**CPU scheduling**" 혹은 "Job scheduling"이라고도 부른다.

### 어떤 sheduling이 best 인가?

* 다양한 주요 스케줄링 기준

  * **User-oriented**(사용자 중심) : Turnaound time(TAT), Response Time, Deadline, ...

  * **System-oriented**(서버 중심) : Thoughput, Processor utilization, ...
  
  * Etc : Fairness, Balancing resoursces, Enforcing priority, Predictability, ...


---

## Scheduling Criteria

* (Maximaize) **`CPU utilization`**(이용률)

  * 전체 시간 중에서 CPU가 일을 한 시간의 비율을 나타낸다.
  
  * 가능한 바쁘게 CPU를 유지하길 원한다.

* (Maximaize) **`Throughput`**(처리량)
  
  * 시간 단위당 작업수을 나타낸다.
  
  * CPU의 서비스를 원하는 프로세스 중 **몇 개**가 원하는 만큼의 CPU를 사용하고 이번 CPU 버스트를 끝내어 준비 큐에 떠났는지 측정하는 것이다.


* (Minimaize) **`Turnaround time`**(소요시간)
  
  * 프로세스가 CPU를 요청한 시점부터 자신이 원하는 만큼 CPU를 다 쓰고 CPU 버스트가 끝날 때까지 걸린 시간이다.
  (생성부터 완료까지의 시간)
  
  * 즉 준비 큐에서 기다린 시간과 실제로 CPU를 사용한 시간의 합을 뜻한다.
  ex) 전체 요리가 나오기까지의 시간


* (Minimaize) **`Waiting time`**(대기시간)

  * 프로세스가 ready queue에서 (CPU 버스트가 끝나기까지)대기하는데 소요하는 시간의 합을 뜻한다.

* (Minimaize) **`Response time`**(응답시간)
  
  * 프로세스가 ready queue에 들어온 후 **첫 번째 CPU**를 얻기까지의 기다린 시간을 뜻한다.
  
  * `대기시간`은 준비 큐에 들어온 직후부터 **이번 CPU 버스트가 끝날 때까지** 준비 큐에서 기다린 시간의 합을 나타내는 반면, `응답시간`은 준비 큐에 들어온 직후부터 **첫 번째 CPU를 얻기까지** 걸린 시간만을 나타내어 이 두 척도는 다소 차이가 있다.
  ex) 첫번째 음식시간이 나오기까지의 시간

* **Fairness**

  * 동등한 방식으로 Users 사이에 CPU를 공유하는 것을 뜻한다.

---

## Terminology for Scheduling

### CPU 스케줄링 방식

#### Non preeptive(cooperative) scheduling(비선점형)

* CPU를 획득한 프로세스가 스스로 CPU를 반납하기 전까지는 CPU를 빼앗기지 않는 방법을 말한다.

* 장점 : 낮은 context switch overhead

* 단점 : 빈번한 우선순위 반전 또는 **더 긴 평균 response time**

#### Preemptive scheduling(선점형)

* 프로세스가 CPU를 계속 사용하기를 원하더라도 강제로 빼앗을 수 있는 방법을 말한다.

* 장점: 유연성, 성능 향상

* 단점: **높은 context switching overhead**, 공유된 데이터에 접근과 연관된 비용이 발생한다.(프로세스 동기화)

### CPU burst & I/O burst

* `CPU burst` : User 프로그램이 CPU를 직접 가지고 빠른 명령을 수행하는 일련의 단계
  
  * 메모리에 접근을 수행하는 명령

    * Load 명령 : 메모리에 있는 데이터를 CPU로 읽어들이는 명령
    
    * Store 명령 : CPU에서 계산된 결괏값을 메모리에 저장하는 명령
  
  * CPU 내에서 수행되는 명령
  
    * Add 명령 : CPU 내의 레지스터에 있는 두 값을 더해 레지스터에 저장하는 명령 (수행 속도가 매우 빠르다)


*   `I/O burst` : I/O 요청이 발생해 커널에 의해 입출력 작업을 진행하는 비교적 느린 단계

  * Disk I/O : 프로그램이 수행되는 중에 I/O를 요청하면 CPU의 제어권이 OS kernel로 넘어가게 된다.


* 즉, `CPU 버스트`는 프로그램이 I/O를 한 번 수행한 후 **다음 I/O를 수행하기까지 직접 CPU를 가지고 명령을 수행**하는 일련의 작업이다.

* 이에 비해, `I/O 버스트`는 **I/O 작업이 요청된 후 완료되어 다시 CPU 버스트로 돌아가기**까지 일어나는 일련의 작업이다.

![](/assets/img/os/os-7-Scheduling_0.png)

* 각 프로그램마다 CPU 버스트, I/O 버스트가 차지하는 비율이 균일하지 않다.

* 이와 같은 기준에서 프로세스를 크게 CPU 바운드 프로세스, I/O 바운드 프로세스로 나누어 볼 수 있다.

  * `CPU bound process` : I/O 작업을 거의 수행하지 않아 **CPU 버스트가 길게 나타나는 프로세스**를 말한다.
  
    * ex) 계산 위주의 프로그램
  
  * `I/O bound process` : I/O 요청이 빈번해 **CPU 버스트가 짧게 나타나는 프로세스**를 말한다.

    * ex) 대화형 프로그램

---

## Sheduling: Introdution

#### Workload 란?

*   주어진 시간 동안 entity에 의해 수행된 작업의 양이다.

* CPU 스케줄링에서는 작업(또는 프로세스)의 수로 정의된다.

#### Workload 가정

1. 각각의 job들은 **running time이 동일**하다.

2. 모든 job들은 **동시에 도착**한다.

3. 모든 job들은 오직 **CPU**를 사용한다.

4. 각각의 job의 **run-time**은 알고 있다.

5. A running job은 중간에 멈추지 않는다(**non-preemptive**)

### Sheduling Metrics

* Performance metric : **`Turnaround time`**(소요시간)

  * 어떤 job이 시스템에 도착해서 끝날때까지의 시간

  ![](/assets/img/os/os-7-Scheduling_1.png)

---

### Sheduling Algorithm

#### First In, First Out(FIFO)

선입선출 스케줄링

* 프로세스가 준비 큐에 도착한 시간 순서대로 CPU를 할당하는 방식을 말한다.

* "First Come, First Served(FCFS)"이라고도 부른다.

* **Example** :

  * 프로세스 A, B, C 모두 동시에 도착했다고 가정하자.
  
  * 프로세스 A 끝나는 시간 : 10 sec
  
  * 프로세스 B 끝나는 시간 : 20 sec
  
  * 프로세스 C 끝나는 시간 : 30 sec

  ![](/assets/img/os/os-7-Scheduling_2.png)

  * 평균 소요시간 : (10 + 20 + 30) / 3 = 20 sec가 된다.

* **FIFO 좋지 못한 이유**

  * 먼저 도착한 프로세스의 성격에 따라 `평균 소요시간`이 크게 달라진다.
  
  * 즉 CPU 버스트가 긴 프로세스가 먼저 도착할 경우, 평균 대기시간이 길어지는 반면에, CPU 버스트가 짧은 프로세스가 먼저 도착하게 되면 평균 대기시간은 짧아지게 된다.
  
  * CPU 버스트가 짧은 프로세스가 CPU 버스트가 긴 프로세스 보다 나중에 도착해 오랜 시간을 기다려야 하는 현상을 **`Convoy effect`** 이라고 하며, 이는 **FIFO의 대표적인 단점**에 해당된다.

#### Shortest Job First(SJF)

최단 작업 우선 스케줄링

* CPU 버스트가 가장 짧은 프로세스에게 제일 먼저 CPU를 할당하는 방식이다. (**CPU 버스트가 가장 짧다 == run-time이 가장 짧다**)

* SJF 알고리즘은 평균 대기시간을 가장 짧게 하는 최적 알고리즘으로 알려져 있다.

* Non-preemptive 스케줄러이다.

* **Example 1** :

  * A, B, C가 모두 동시에 도착했다고 가정하자.

  ![](/assets/img/os/os-7-Scheduling_3.png)


* **Example 2** :

  * A가 먼저 도착하고 10초후에 B,C가 도착했다고 가정하자.

  ![](/assets/img/os/os-7-Scheduling_4.png)

#### Shortest Time-to-Completion First(STCF)

* SJF에 preemption(선점형) 방식을 추가한 알고리즘이다.

* 새로운 job이 도착하면, 현재 CPU에서 실행 중인 프로세스들의 남은 시간을 볼 때, run-time이 가장 짧은 프로세스에게 CPU를 빼앗기게 된다.

* **Example** :
  
  * A는 도착시간이 0초이고, run-time이 100초이다.
  
  * B와 C는 도착시간이 10초이며, 각각 run-time이 10초이다.

  ![](/assets/img/os/os-7-Scheduling_5.png)

  * A를 실행하다가 run-time이 더 짧은 B,C가 도착했으므로, B,C 먼저 끝낸 이후에 남은 A를 실행한다.

---

### New Sheduling Metrics : Response time

* job이 도착한 시점부터 처음 시작하는 시간까지의 시간을 의미한다.

  ![](/assets/img/os/os-7-Scheduling_6.png)


#### Round Robin (RR) Sheduling

* 시분할 시스템의 성질을 가장 잘 활용한 새로운 의미의 스케줄링 방식이다.

* 라운드 로빈 스케줄링에서는 각 프로세스가 CPU를 연속적으로 사용할 수 있는 시간이 특정 시간으로 제한되며, 이 시간이 경과하면 해당 프로세스로부터 CPU를 회수해 ready queue에 줄 서 있는 다른 프로세스에게 CPU를 할당한다.

* 그러면 이 프로세스는 ready queue의 제일 뒤에 가서 줄을 서 다음번 차례가 오기를 기다리게 된다.
이때 각 프로세스마다 한 번에 CPU를 연속적으로 사용할 수 있는 최대시간을 **`time slice` (time quantum), 할당시간**이라고 부른다.

* 라운드 로빈 스케줄링을 적용하면 프로세스의 **CPU 사용량에 비례**하여 처리할 수 있다.

* Example

  * 프로세스 A, B, C 모두 동시에 도착했다고 가정하자.
  
  * 그들은 5초의 run-time이 있다.

  ![](/assets/img/os/os-7-Scheduling_7.png)

  * Response time(응답 시간)으로 봤을 때, RR이 SJF보다 더 짧은 시간을 보여준 것을 나타낸다.
  즉, 1초의 time-slice를 갖는 RR이 SJF보다 Response time에 더 좋다.

* The shorter time slice
  
  * 응답시간이 더 좋다.
  
  * context switching의 비용이 전반적인 성능을 좌우할 것이다.
  (할당시간을 너무 짧게 설정하면 문맥교환의 오버헤드가 증가해 전체 시스템의 성능을 저하시킬 수 있다.

* The Longer time slice
  
  * 응답시간이 더 길다.
  
  * context switching의 비용이 줄어들 것이다.

## Reference

* [운영 체제와 정보기술의 원리](http://www.yes24.com/Product/Goods/90124877)

* 학교 수업 내용 - [Operating Systems Three Easy Pieces](https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X)
