---
layout: post
title: " [MySQL] 8. SELECT, JOIN, SubQuery - Practice "
categories: MySQL
author: devFancy
---
* content
{:toc}

> 이 글은 MySQL 기반의 SELECT, JOIN, SubQuery 문제에 대한 정리를 바탕으로 작성했습니다.

해당 문제는 sakila DB를 기반으로 풀었습니다.

* 설치 과정에 대한 내용은 [Installation](https://dev.mysql.com/doc/sakila/en/sakila-installation.html)이며,

* sakila DB를 다운받는 위치는 [Other MySQL Documentation](https://dev.mysql.com/doc/index-other.html) 안에 **Example Databases - `sakila database(ZIP)`** 다운받으면 됩니다.

![](/assets/img/mysql/mysql-practice.png)

* 위의 sakila DB 다운받은 후에 `MySQL Workbench`를 실행한 다음, 해당 파일(4.exercise)에서 문제를 풀었습니다.

* 문제를 풀기 전에 `sakila DB`를 사용하는 명령어를 입력한다.

```sql
use sakila;
```

## Example 1


> Q. film 테이블에서 영화 제목, 영화 설명, 대여 기간(rental_duration), 대여 비용(rental_rate), 
총 렌탈 비용(직접 생성할 새로운 컬럼)에 해당하는 데이터를 상위 10개만 조회

```
컬럼 설명
-   `rental_duration`: 대여 기간(day 기준),
    → The length of the rental period, in days
-   `rental_rate`: `rental_duration` 컬럼에 저장된 기간 동안 film을 대여하는데 필요한 비용
    The cost to rent the film for the period specified in the `rental_duration` column
```

```sql
SELECT title, description, rental_duration, rental_rate
     , rental_duration * rental_rate AS "총 렌탈 비용" 
FROM film LIMIT 10;
```

> Q. payment 테이블에서 payment_id, 금액, 지불날짜 열에 해당하는 모든 데이터를 조회하되, 지불날짜가 2005년 8월 23일만 해당하는 모든 데이터 조회

```sql
SELECT payment_id, amount, payment_date 
FROM payment 
WHERE payment_date = DATE('2005-08-23');
```

> Q. customer 테이블에서 모든 열에 해당하는 데이터를 조회하되, last_name이 s로 시작하고, first_name이 n으로 끝나는 데이터만 필터링하여 조회

```sql
SELECT * FROM customer WHERE last_name LIKE 's%' AND first_name LIKE '%n';
```

> Q. category 테이블에서 모든 열에 해당하는 데이터를 조회하되, category_id가 4보다 크고, name 열에 해당하는 데이터가 c로 시작하거나, s로 시작하거나, t로 시작하는 데이터로 필터링하여 조회

```sql
SELECT * FROM category WHERE category_id > 4 AND name LIKE 'c%' OR name LIKE 's%' OR name LIKE 't%';
```

> Q. address 테이블에서 phone, 구역(district) 컬럼을 조회하되, 구역이 California, England, Taipei,  West Java에 해당하는 구역만 필터링하고, district 컬럼을 기준으로 오름차순 정렬하여 조회

```sql
SELECT phone, district FROM address WHERE district IN('California', 'England', 'Taipei', 'West Java')
ORDER BY district ASC;
```

> Q. payment 테이블에서 payment_id, 금액, 지불날짜 열에 해당하는 데이터를 조회하되, 지불날짜가 2005년 8월 23일, 24일, 25일에 해당하는 데이터만 조회(`IN, Date()` 활용)

```sql
SELECT payment_id, amount, payment_date
FROM payment
WHERE DATE(payment_date) IN ('2005-08-23','2005-08-24','2005-08-25');
```

> Q. payment 테이블에서 모든 열에 해당하는 데이터를 조회하되, 2005년 8월 23일에만 해당하는 데이터 조회

```sql
SELECT * FROM payment WHERE DATE(payment_date) = '2005-08-23';
```

> Q. payment 테이블에서 지불날짜와 금액에 해당하는 데이터를 조회하되, 금액이 5달러보다 높고, 상위 10개 행으로 제한하되, 20번째 행부터 조회
-> 20번째 행부터 상위 10개 데이터 조회(Hint: LIMIT 19, 10: 20번째 행부터 상위 10개 데이터 조회)

```sql
SELECT payment_date, amount
FROM payment
WHERE amount >= 5 AND payment_id >=20
LIMIT 19, 10;
```

> Q. film 테이블에서 제목, 줄거리, 영화 특징(special_features), 러닝타임, 대여 기간에 해당하는 데이터를 조회하되,
영화 특징으로 'Behind the Scenes'만 해당되고,
러닝타임은 2시간 미만이고
대여기간은 5일에서 7일 사이에 해당하는 모든 데이터를 조회, 정렬 조건은 러닝타임을 기준으로 내림차순 정렬하여 상위 10개 데이터만 조회

```sql
SELECT title, description, special_features, length, rental_duration
FROM film
WHERE special_features LIKE 'Behind the Scenes' 
AND length < 120
AND rental_duration BETWEEN  5 AND 7
ORDER BY length DESC;
```

> Q. customer와 actor 테이블의 데이터를 활용하여 customer와 actor가 서로 이름이 같은 사람의 데이터를 찾으려고 할 때,
    

    `비교 조건`
    customer의 first_name과 actor의 first_name이 같고,
    customer의 last_name과 actor의 last_name이 같은 경우
    
    `조인 조건`
    customer, actor 순으로 LEFT JOIN 활용
    
    `별칭`
    customer_first_name
    customer_last_name
    actor_first_name
    actor_last_name
    */

```sql
SELECT c.first_name AS 'customer_first_name', c.last_name AS 'customer_last_name',
a.first_name AS 'actor_first_name', a.last_name AS 'actor_last_name'
FROM customer c
LEFT JOIN actor a
ON c.first_name = a.first_name
AND c.last_name = a.last_name;
```

> Q. city 테이블에서 city 이름, country 테이블에서 country 이름에 해당하는 데이터 조회,


    `조인 조건`
    city의 country_id와 country의 country_id
    LEFT JOIN 활용
    
    `정렬 조건`
    country 테이블 기준

```sql
SELECT ci.city, co.country
FROM city ci
LEFT JOIN country co
ON ci.country_id = co.country_id
ORDER BY country;
```

> Q. film 테이블에서 title, description, release_year, language 테이블에서 name열에 해당하는 모든 데이터를 조회

    `조인 조건`
    film 테이블의 language_id와 language 테이블의 language_id
    LEFT JOIN 활용
    
    `정렬 조건`
    language 테이블 기준 -> 해석: language 테이블 내에 있는 필드(열)


```sql
SELECT f.title, f.description, f.release_year, l.name
FROM film f
LEFT JOIN language l
ON f.language_id = l.language_id
ORDER BY name;	-- 정렬은 필드(열)로 줘야한다.
```

> Q. staff 테이블에서 first_name, last_name, address, address2, district, postal_code, city 테이블에서 city 열에 해당하는 모든 데이터 조회

    `조인 조건`
    staff 테이블의 address_id와 address 테이블의 address_id
    address 테이블의 city_id와 city 테이블의 city_id
    LEFT JOIN 활용


```sql
SELECT s.first_name, s.last_name, a.address, a.address2, a.district, a.postal_code, c.city
FROM staff s
LEFT JOIN address a
ON s.address_id = a.address_id
LEFT JOIN city c
ON a.city_id = c.city_id;
```

## Example 2

