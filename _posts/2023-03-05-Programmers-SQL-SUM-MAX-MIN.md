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

* 풀이: `COUNT(컬럼명)`은 특정 컬럼에 있는 데이터(행)의 개수를 세는 함수이다.
  * 여기서 뒤에 나오는 `count`는 `COUNT(ANIMAL_ID)`로 계산된 결과가 나오는 컬럼의 이름을 지정하는 것이다.

## 중복 제거하기

[중복 제거하기 : 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/59408)


```sql
SELECT COUNT(DISTINCT(NAME))
FROM ANIMAL_INS
WHERE NAME IS NOT NULL
```

* 풀이 : 중복되는 이름은 하나로 치는 경우 **DISTINCT** 을 사용하고, 이름이 NULL인 경우를 제외하는 조건에는 `WHERE NAME IS NOT NULL`을 사용한다.


## 조건에 맞는 아이템들의 가격의 총합 구하기

[조건에 맞는 아이템들의 가격의 총합 구하기: 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/273709)

* 문제: ITEM_INFO 테이블에서 희귀도가 'LEGEND'인 아이템들의 가격의 총합을 구하는 SQL문을 작성해 주세요.

```sql
SELECT SUM(PRICE) AS TOTAL_PRICE
FROM ITEM_INFO
WHERE RARITY = 'LEGEND'
```

* 풀이: AS 는 별칭의 의미로, TOTAL_PRICE로 컬럼명을 수정할 때 사용한다. 

## 물고기 종류 별 대어 찾기

[물고기 종류 별 대어 찾기: 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/293261)

* 문제: 물고기 종류 별로 가장 큰 물고기의 ID, 물고기 이름, 길이를 출력하는 SQL 문을 작성해주세요.
  물고기의 ID 컬럼명은 ID, 이름 컬럼명은 FISH_NAME, 길이 컬럼명은 LENGTH로 해주세요.
  결과는 물고기의 ID에 대해 오름차순 정렬해주세요.

> 정답

```sql
-- 종류별로 가장 큰 물고기의 ID, 물고기이름, 길이
-- 결과는 물고기의 ID 기준으로 오름차순 정렬
SELECT F.ID, FN.FISH_NAME, F.LENGTH
FROM FISH_INFO F
INNER JOIN FISH_NAME_INFO FN 
ON F.FISH_TYPE = FN.FISH_TYPE
WHERE (F.FISH_TYPE, F.LENGTH) IN 
(
    SELECT FISH_TYPE, MAX(LENGTH) AS LENGTH_MAX
    FROM FISH_INFO
    GROUP BY FISH_TYPE
)
ORDER BY F.ID
```

> 풀이: 

핵심은 "먼저, 종류별로 가장 큰 길이가 몇 cm인지 알아낸 뒤, 그 길이와 종류에 해당하는 물고기를 찾는다." 이다.


### 1. 종류별 최대 길이 찾기 (서브 쿼리)

```sql
SELECT FISH_TYPE, MAX(LENGTH)
FROM FISH_INFO
GROUP BY FISH_TYPE
```

* `GROUP BY FISH_TYPE` : FISH_INFO 테이블에 있는 물고기들을 종류(FISH_TYPE)별로 그룹으로 묶는다.

* `SELECT FISH_TYPE, MAX(LENGTH)`: 각 그룹 내에서 가장 큰 LENGTH 값을 MAX() 함수로 찾아낸다.

### 2. 조건에 맞는 물고기 정보 결합 및 필터링

```sql
-- 3. 최종적으로 원하는 컬럼들을 선택
SELECT F.ID, FN.FISH_NAME, F.LENGTH

-- 1. 두 테이블을 연결해 물고기 이름 가져올 준비
FROM FISH_INFO F
INNER JOIN FISH_NAME_INFO FN
ON F.FISH_TYPE = FN.FISH_TYPE

-- 2. 1단계에서 만든 '정답 목록'과 일치하는 물고기만 필터링
WHERE (F.FISH_TYPE, F.LENGTH) IN ( [1단계 서브쿼리 결과] )
ORDER BY F.ID
```

* `FROM ... INNER JOIN ... ON ...` : 

  * FISH_INFO와 FISH_NAME_INFO 테이블을 `INNER JOIN` 한다.

  * `ON F.FISH_TYPE = FN.FISH_TYPE` 은 두 테이블을 **연결하는 '조건'** 이다. 즉, "두 테이블의 `FISH_TYPE`이 같을 때 하나의 행으로 합쳐라" 라는 의미이다.

  * 즉, `INNER JOIN`은 교집합에 해당하는 데이터만 남긴다.

* `WHERE (F.FISH_TYPE, F.LENGTH) IN ...`:

  * 이 부분은 **필터링** 단계이다. 

  * JOIN으로 합쳐진 모든 물고기 데이터를 한 줄씩 확인하면서,

  * 물고기의 종류, 물고기의 길이) 쌍이 1단계에서 만든 '정답 목록' 안에 IN 하는지 검사 한다.

  * 예를 들어, `(FISH_TYPE: 0, LENGTH: 30)`인 물고기는 '정답 목록'에 없으므로 탈락하고, `(FISH_TYPE: 0, LENGTH: 60)`인 물고기는 목록에 있으므로 통과한다.

> `ON` vs `WHERE IN` 차이

* ON 절: **테이블을 연결(JOIN)할 때 사용**하는 '연결고리'의 규칙을 정의한다. 어떤 기준으로 두 테이블을 합칠지를 결정한다.

* WHERE ... IN 절: 연결된 결과 중에서 **어떤 행을 남길지를 결정하는 '필터' 역할**을 합니다.

정리하면, ON은 테이블을 **합치는 기준**을 정하고, WHERE는 합쳐진 결과에서 **데이터를 걸러내는 조건**을 정한다.

## 잡은 물고기 중 가장 큰 물고기의 길이 구하기

[잡은 물고기 중 가장 큰 물고기의 길이 구하기: 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/298515)

* 문제: `FISH_INFO` 테이블에서 잡은 물고기 중 가장 큰 물고기의 길이를 'cm' 를 붙여 출력하는 SQL 문을 작성해주세요. 이 때 컬럼명은 'MAX_LENGTH' 로 지정해주세요.

```sql
SELECT CONCAT(MAX(LENGTH), 'cm') AS MAX_LENGTH
FROM FISH_INFO
```

* 풀이: 

  * **`CONCAT(A, B)`**: CONCAT 함수는 A와 B를 순서대로 합쳐서 하나의 문자열로 만들어준다.

  * 이 코드에서는 MAX(LENGTH)를 통해 얻은 숫자(예: 50)와 문자열 'cm'를 합쳐 50cm 를 만들어준다.

## Review

* 프로그래머스에서 `SUM, MAX, MIN` 유형에 대한 문제들을 풀어봤다.

* 각 문제에 대한 중요 문법들을 기억하자.

> 2025.09.03

* SQL 문법에 대해 까먹은 부분이 많아서 초심으로 돌아가 프로그래머스에 있는 SUM, MAX, MIN 유형의 모든 문제를 다시한번 복습했다.

* 까먹으면 다시 풀고, 모르는 부분이 있으면 다시 배우면 된다. 고민할 시간에 하나라도 더 익히자!
