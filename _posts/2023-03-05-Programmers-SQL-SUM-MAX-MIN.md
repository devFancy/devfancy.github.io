---
layout: post
title: " [Programmers] SQL > SUM, MAX, MIN 풀이 모음 "
categories: SQL
author: devFancy
---
* content
{:toc}

  
## 구분

* 코딩테스트 연습 > SUM, MAX, MIN

## 가장 비싼 상품 구하기

[가장 비싼 상품 구하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/131697)


```sql
SELECT MAX(PRICE)
FROM PRODUCT
ORDER BY PRICE DESC;
```


## 가격이 제일 비싼 식품의 정보 출력하기

[가격이 제일 비싼 식품의 정보 출력하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/131115)


```sql
SELECT PRODUCT_ID, PRODUCT_NAME, PRODUCT_CD, CATEGORY, PRICE
FROM FOOD_PRODUCT
WHERE PRICE = (SELECT MAX(PRICE) FROM FOOD_PRODUCT);
```


## 최댓값 구하기

[최댓값 구하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/59415)


```sql
SELECT MAX(DATETIME)
FROM ANIMAL_INS;
```

* 풀이 : DATETIME(보호 시작일)이 가장 최근인 동물의 보호 시작일이란, **DATETIME**의 값이 가장 큰 값을 가져올 때, **MAX**을 사용하면 된다.


## 최솟값 구하기

[최솟값 구하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/59038)


```sql
SELECT MIN(DATETIME)
FROM ANIMAL_INS;
```

* 풀이 : 동물 보호소에 가장 먼저 들어온 동물은 최근과 반대되는 개념이므로 **MIN**을 사용하면 된다.


## 동물 수 구하기

[동물 수 구하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/59406)


```sql
SELECT COUNT(ANIMAL_ID) count
FROM ANIMAL_INS
```


## 중복 제거하기

[중복 제거하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/59408)


```sql
SELECT COUNT(DISTINCT(NAME))
FROM ANIMAL_INS
WHERE NAME IS NOT NULL
```

* 풀이 : 중복되는 이름은 하나로 치는 경우 **DISTINCT** 을 사용하고, 이름이 NULL인 경우를 제외하는 조건에는 `WHERE NAME IS NOT NULL`을 사용한다.


## Review

* 프로그래머스에서 `SUM, MAX, MIN` 유형에 대한 문제들을 풀어봤다.

* 각 문제에 대한 중요 문법들을 기억하자.



