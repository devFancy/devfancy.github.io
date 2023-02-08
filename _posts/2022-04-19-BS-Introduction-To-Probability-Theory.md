---
layout: post
title: " 05. 확률론개론 "
categories: Business-Statistics
author: fancy96
use_math: true
---
* content
{:toc}

> 이 글은 경영학부 경영통계 수업에서 배운 자료들을 정리한 내용입니다.

*  Key Point  : 곱셈법칙, 조건부확률 / 경우의 수

## Contents

* 확률, 실험, 사건 결과에 대해 정의

* 덧셈 법칙을 활용하여 확률 계산

* 곱셈법칙을 활용하여 확률 계산

* 분할표를 활용하여 확률 계산

* 계수법칙을 활용하여 경우의 수를 결정

### 확률 관련 용어 정리

* 확률 : 불확실한 상황에서 어떤 일이 일어날 가능성 (or 우연성)

* 확률을 정의하는 용어
  
  * 실험(Experiment) : 어떤 결과를 발생시키는 행위
    
  * 표본공간, 결과(S, Sample space) : 어떤 실험에서 얻을 수 있는 모든 결과의 집합
    
  * 사건 or 사상(Event) : 어떤 실험에서 가능한 한 개 또는 여러 개 결과의 집합 (**표본공간의 부분집합**)
    
  * 확률 : 어떤 사건이 일어날 가능성**(0≤ P(A) ≤ 1)**

### 덧셈 법칙

* 확률의 덧셈법칙 (Rule of addition)
  
  * P(A or B) = P(A) + P(B) – P(A and B) (덧셈의 일반법칙)
    
  * P(A or B) = P(A) + P(B), 사건 A와 B가 상호배반적일 때 (덧셈의 특수법칙)

* 결합확률 (Joint probability)
  
  * 두 개 이상의 사건이 동시에 일어날 확률
    
  * P(A and B) = P(A) + P(B) – P(A or B)
    
  * P(A and B) = 0, 사건 A와 B가 상호배반적일 때

### 곱셈 법칙

* 확률의 곱셈법칙 (Rule of multiplication)
  
  * 두 사건 A와 B가 동시에 일어날때의 결합 확률(Joint probability)
    
  * 종속 → P(A ∩ B) =  P(A)P(B|A) = P(B)P(A|B)
    
  * 독립 → P(A ∩ B) = P(A)P(B)  > 0

* 조건부 확률 (Conditional probability)
  
  * 어떤 사건이 이미 발생한 상태에서 다른 사건이 일어날 확률
    
  * 종속 → P(A|B) = $\frac{P(A ∩ B)}{P(B)}$
    
  * 독립 → P(A|B) = $\frac{P(A)P(B)}{P(B)}$ = P(A)

* **상호배반적 사건과 독립사건**
  
  * 두 사건이 상호 배반적이라면 두 사건은 독립일까 ?
    
  * 결론적으로는 “No”
    
  * 구체적 이유 : 상호배반적은 P(A ∩ B) = 0 이고, 독립일 경우, P(A ∩ B) = P(A)P(B) > 0 이기 때문이다.

### 분할표

* 2개 이상의 식별 가능 한 카테코리나 구간으로 표본 관측치를 분류하는 표 → 곱셈 법칙 활용

### 경우의 수

* 팩토리얼
  
  * n 개의 사물 **모두를 순서대로** 배열하는 경우의 수 = n!

* **순열과 조합**
  
  * 순열 $_{n}\mathrm{P}_{r}$ (Permutation)

    * n개 물건 중 r개를 **순서대로 배열**하는 경우의 수
          
    * $*_{n}\mathrm{P}_{r} = \frac{n!}{(n-r)!}*$
    
    * n : 전체 갯수, r: 선택한 갯수
  
  * 조합 $*_{n}\mathrm{C}_{r}$* (Combination)
  
    * n개 물건 중 r개를 **순서와 관계없이 선택**하는 경우의 수
    
    * 순서 고려 X

    * $*_{n}\mathrm{C}_{r} = \frac{n!}{r!(n-r)!}*$

## Reference

* [경영경제통계학17판](https://m.yes24.com/Goods/Detail/60561679)

    * Lind, Marchal, Wathen, (2018), McGrawHill, 강종열 등 역, 지필미디어