---
layout: post
title: " 01. Probability Theory "
categories: Probability-Statistics
author: devfancy
use_math: true
---
* content
{:toc}

> 이 글은 컴퓨터학부 확률과통계 수업에서 배운 자료들을 정리한 내용입니다.

## Contents

* 1.1 Probabilities

* 1.2 Events

* 1.3 Combinations of Events

* 1.4 Conditional Probability

* 1.5 Probabilities of Event Intersections

* 1.6 Posterior Probabilities

### 1.1.1 Introduction

* Probability theory provides the basis for the science of statistical inference through experimentation and data analysis

### 1.1.2 Sample Spaces

* `Sample Space` “집합”(전체에 대한 개념)
  
  * (esg) The Sample spaces $S$ of an experiment is a set consisting of all the possible experimental outcomes
    
  * (kor) 실험의 표본 공간 S는 가능한 모든 실험 결과로 구성된 집합입니다.

    
### 1.1.3 Probability Values

* `Probabilities`

> A set of probability values ofr an experiment with a sample space
>
> $S = \{\ O_1, O_2, ... , O_n \}$  consist of some probabilities
>
> $P_1, P_2, ... , P_n$
> 
> that satisfy
> 
> $0 ≤ p_1 ≤ 1, 0 ≤ p_2 ≤ , ... , 0 ≤ p_n ≤ 1$
> 
> and
>
> $p_1 + p_2 + ... + p_n = 1$
>
> The probability of Outcome $O_i$ occurring is said to be $p_i$, and this is written
>
> $P(O_i) = p_i$  ($O_i$가 발생할 확률)
>
> Ex) $O_1 = 1\ P_1 = 1/6$ (1 ~ 6중에 1이 나올 확률)


### 1.2.1 Events and Complements

* Events → **P(A)**

* An event A is a subset of the sample space S. it collects outcomes of particular interest. The probability of an event A, P(A), is obtained by summing the probabilities of the outcomes contained within the event A.

* An events are said to occur if one of the outcomes contained within the event occurs

& → P(A)는 확률값들을 더한 값이다.

* `Complements of Events` (여집합) → **P(A’)**

* The event A, the **complement** of an event A, is the event consisting  of everything in the sample space S that is not contained within the event A. In all cases

> $P(A) + P(A’) = 1$

* Events that consist of an individual outcomes are sometimes referred to as **elementary events** or **simple events**


### 1.3.1 Intersections of Events

* `Intersections of Events`

* The Event $A \bigcap B$ is the **intersection** of the events A and B consists of the outcomes that are contained within both events A and B. The probability of this event, $P(A\cap B)$, is the probability that both events A and B occur simultaneously.

> $P(A \cap B) + P(A \cap B') = P(A) \\ P(A \cap B) + P(A' \cap B) = P(B)$


* `Mutually Exclusive Events` ( 공통점이 없는 경우 )

* Two events A and B are said to be mutually exclusive if $A \cap B = \emptyset$ so that they have no outcomes in common.

* 동시에 발생할 수 없다 ⇒ 상호 배타적이다.

* 예를 들어, 동전을 뒤집으면 앞면이나 뒷면만 보이고 둘 다 보이지 않는다.

* **Some other simple results concerning the intersections**

> $A \cap B = B \cap A\\ A\cap S = A\\ A \cap A' = \emptyset$
>
> $A \cap A = A\\ A\cap \emptyset = \emptyset\\ A \cap (B \cap C) = (A \cap B) \cap C)$


### 1.3.2 Unions of Events

* `Unions of Events` (합집합)

* The event $A \cup B$ is the union of events A and B and consists of the outcomes that are contained within at least one of the events A and B. The probability of this events, $P(A\cup B),$ is the probability that at least one of the events A and B occurs.

> $방법1)\ P(A\cup B) = P(A\cap B') + P(A'\cap B) + P(A\cap B$)

* **Some simple results concerning the unions**

> $방법2)\ P(A\cup B) = P(A) + P(B) - P(A\cap B)$

> If the events A and B are **mutually exclusive** so that
>
> $P(A\cap B) = 0,$  then
> 
> $\\ P(A\cup B) = P(A) + P(B)$
>
> $\ cf) (A\cup B)' = A'\cap B'$


### 1.3.4 Combinations of  Three or More Events

* `Union of Three Events`

* The probability of the **union of three evnets** A, B and C is the sum of the probability values of the simple outcomes that are contained within at least one of the three events. It can also be calculated from the expression

> $P(A\cup B\cup C) = [P(A)\ + P(B)\ + P(C)] \\ - [P(A\cap B) + P(A\cap C) + P(B\cap C)] + P(A\cap B\cap C)$

* `Union of Mutually Exclusive Events`

> For a sequence $A_1, A_2, ..., A_n$ of **mutually exclusive events**, the probability of the **union** of the events is given by
>
> $P(A_1 \cup .\ .\ . \cup A_n) = P(A_1)\ + .\ .\ .\ + P(A_n)$
>

* `Sample Space Partitions`

> A partition of a sample space is a sequence $A_1, A_2, ..., A_n$ of $mutually\ exclusive\$ events for which
>
> (1) $\ A_1 \cup\ .\ .\ .\ \cup\ A_n = S$
>
> (2) Each outcome in the sample is then contained within one and only one of the events $A_i$


### 1.4.1 Definition of Conditional Probability

* **Conditional Probability**

* The conditional probability of event A conditional on event B is

> $P(A|B) = \frac{P(A\ \cap\ B)}{P(B)}$
>
> for P(B) > 0. It measures the probability that event A occurs when it is known that event B occurs.

### 1.5.1 General Mutiplication Law

*  **Probabilities of Event Intersections**

> The  probability of the **intersection of a series of events**
>
> $A_1,\  ...\ , A_n$  can be calculated from the expression
>
> $\\P(A_1\ \cap .\ .\ .\ \cap A_n) = P(A_1)\ \times P(A_2|A_1)\ \times P(A_3|A_1\ \cap\ A_2)\ \times .\ .\ .\ \times P(A_n|A_1\ \cap\ .\ .\ .\ A_{n-1})$
>
> 전개해보면 $P(A_1\ \cap .\ .\ .\ \cap A_n)$ 으로 되는 것을 알 수 있다.

### 1.5.2 Independent Events

* **Independent Events  $\ne$ mutually exclusive**

> Two events A and B are said to be **independent events** if
>
> $P(A|B)\ = P(A),\ P(B|A)\ = P(B)\ and\ P(A\ \cap\ B) = P(A)\ P(B)$
>
> Any one of these three conditions implies the other two. The interpretation(해석) of two events being independent is that knowledge about one event does not affect the probability of the other event. (**한 사건에 대한 지식이 다른 사건의 확률에 영향을 미치지 않는다는 것이**다)


<aside>
️예를 들어, 만약 우리는 동전을 두 번 뒤집습니다. 첫 번째는 앞면이 보일 수 있지만,

다음 번에는 뒤집을 때 동전도 앞면이 될 것입니다.

이 예시에서, 우리는 (다음 이벤트의 발생에 영향을 주지 않습니다) 라는 첫 번째 사건을 볼 수 있습니다.

**간단히 말해서**, 독립 사건의 경우 두 개의 서로 다른 시행에서 파생된 두 개의 사건이 있습니다.

동전 던지기, 주사위 굴리기, 동전 두 개 던지기)와 같은 다양한 이벤트.

그러므로, 하나의 발생 확률은 다른 것의 발생 확률에 영향을 미치지 않습니다.

**상호 배타적 이벤트의 경우**, 우리는 또한 두 개의 이벤트(2개 이상일 수 있음)를 가지고 있지만

차이점은 ( 주사위를 굴리는 과정에서, 짝수 마주보는) 동일한 시험으로부터 파생된 사건들이

(짝수와 홀수는) 서로 배타적입니다.

</aside>

* **Intersections of Independent Events**

> The probability of the intersection of series of **independent events** $A_1,\ ...\ , A_n$ is simply given by
>
> $P(A_1\ \cap .\ .\ .\ \cap A_n) = P(A_1)\ P(A_2)\ .\ .\ .\ P(A_n)$


### 1.6.1 Law of Total Probability

* Law of Total Probability

> If $A_1,\ ...\ , A_n$ is a partition of a sample space, then the probability of an event B can be obtained from the probabilities $P(A_i)$ and $P(B|A_i)$ using the formula
>
> $P(B) = P(A_1)\ P(B|A|_1) + .\ .\ .\ + P(A_n)\ P(B|A_n) => P(B\cap A_i)$

### 1.6.2 Calculation of Posterior Probabilities

* **Bayes’ Theorem**

> If $A_1,\ ...\ , A_n$ is a partition of a sample space, then the **posterior probabilities** of the events $A_i$  conditional on an event B can be obtained from the probabilities $P(A_i)$ and $P(B|A_i)$ using the formula
>
> $P(A_i | B) = \frac{P(A_i)\ P(B|A_i)}{\sum\nolimits_{j=1}^n P(A_j)P(B|A_j)}$
>
> $P(A_i| B) = \frac{P(A_i \cap B)}{P(B)} = \frac{P(A_i)P(B|A_i)}{P(B)}$


## Reference

* [Probability and Statistics for Engineers and Scientists, 4/E](http://www.yes24.com/Product/Goods/5404183)