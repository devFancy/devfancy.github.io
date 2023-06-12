---
layout: post
title: " [MySQL] SELECT, JOIN, SubQuery - Practice "
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

> Q1. actor 테이블에서 first_name과 last_name을 연결하여(concat) 대문자(upper)로 출력되도록 쿼리 작성

```sql
SELECT UPPER(CONCAT(first_name, ' ', last_name)) 'Actor Name'
FROM actor;
```

> Q2. actor 테이블에서 actor_id, first_name, last_name을 조회하되, first_name이 Joe인 사람을 조회

제약조건: 테이블 내 실제 값은 대문자인 JOE로 되어있지만, 'Joe'와 같이 대문자 외에 소문자로 섞어서 조회해도 조회가 가능하도록 쿼리 작성

```sql
SELECT actor_id, first_name, last_name
FROM actor
WHERE LOWER(first_name) = LOWER("Joe");
```

> Q3. actor 테이블에서 last_name과 총 몇 명이 동일한 last_name을 가지고 있는지 조회

그룹핑 기준: `last_name`

> 정렬 기준
<br> 1.actor_count 내림차순 <br> 2.last_name 오름차순

```sql
SELECT last_name, COUNT(*) actor_count 
FROM actor 
GROUP BY last_name 
ORDER BY actor_count DESC, last_name;
```

> Q4. 3번 문제 내용으로 동일하게 조회하되, 그룹핑 조건으로 actor_count가 3보다 큰 데이터만 조회

```sql
SELECT last_name, COUNT(*) actor_count 
FROM actor 
GROUP BY last_name 
HAVING actor_count > 3 
ORDER BY actor_count desc, last_name;
```

> Q5. address 테이블에 대한 테이블 생성 쿼리를 조회하기 위한 쿼리 작성

```sql
SHOW CREATE TABLE address;
```

-> address 테이블 생성 시 사용된 DDL 쿼리를 조회할 수 있음

> Q6. JOIN을 활용하여 staff의 first_name과 last_name, address, district, postal_code, city_id를 조회

```sql
SELECT first_name, last_name, address, district, postal_code, city_id 
FROM staff stf 
LEFT JOIN address adr 
ON stf.address_id = adr.address_id;
```

-> 조인하는 테이블 간 공통되지 않는 컬럼은 별칭을 작성하지 않아도, 참조 가능
<br>(first_name, last_name 등)
<br>address_id는 두 테이블에 모두 존재하기 때문에 각각 별칭 지정 필요

> Q7. JOIN을 활용하여 각 staff가 2005년 8월에 집계한 총 대여금액, first_name, last_name 조회 

```sql
SELECT stf.first_name, stf.last_name, SUM(pay.amount)
FROM staff stf 
LEFT JOIN payment pay 
ON stf.staff_id = pay.staff_id 
WHERE month(pay.payment_date) = 8 
AND year(pay.payment_date)  = 2005 
GROUP BY stf.first_name, stf.last_name;
```

> Q8. 영화 제목과 해당 영화에 등장한 배우의 총 인원 수를 조회(INNER JOIN 활용) 

```sql
SELECT flm.title, COUNT(*) number_of_actors 
FROM film flm 
INNER JOIN film_actor fim_act 
ON flm.film_id = fim_act.film_id 
GROUP BY flm.title 
ORDER BY number_of_actors DESC;
```

> Q9. 영화 제목이 'Hunchback Impossible'인 영화는 inventory 테이블에 총 몇 개의 복제본이 있는지 조회 

ex) 만약, Inventory 테이블에 A라는 영화의 복제본이 5개일 경우, 5개의 비디오를 대여 가능하다는 의미

```sql
SELECT flm.title, COUNT(*) number_in_inventory 
FROM film flm 
INNER JOIN inventory inv 
ON flm.film_id = inv.film_id 
WHERE lower(flm.title) = lower('Hunchback Impossible') 
GROUP BY flm.title;
```

> Q10. 고객의 first_name, last_name과 각 고객(customer)이 지금까지 대여 과정에서 지불한 총 금액을 조회

```sql
SELECT cust.first_name, cust.last_name, SUM(pay.amount) 'Total Amount Paid'
FROM payment pay
         JOIN customer cust
              ON pay.customer_id = cust.customer_id
GROUP BY cust.first_name, cust.last_name
ORDER BY cust.last_name;
```

> Q11. 제목이 'K'나 'Q'로 시작하고, 지원 언어가 English인 모든 영화 제목 조회(서브쿼리 활용)

```sql
SELECT title 
FROM film 
WHERE (title LIKE 'K%' OR title LIKE 'Q%') 
AND language_id IN ( 
	SELECT language_id 
	FROM language 
	WHERE name = 'English'
) 
ORDER BY title;
```

> Q12. `Alone Trip`에 등장하는 모든 영화 배우들의 first_name, last_name 조회(서브쿼리 활용)

```sql
SELECT first_name, last_name 
FROM actor 
WHERE actor_id IN ( 
	SELECT actor_id 
	FROM film_actor 
	WHERE film_id IN (
		SELECT film_id FROM film WHERE LOWER(title) = LOWER('Alone Trip')
	)
);
```

> Q13. 국적이 캐나다인 고객의 first_name과 last_name, email 조회

```sql
-- Sub Query
SELECT first_name, last_name, email 
FROM customer 
WHERE address_id IN (
	SELECT address_id 
	FROM address 
	WHERE city_id IN (
		SELECT city_id 
		FROM city 
		WHERE country_id IN (
			SELECT country_id 
			FROM country 
			WHERE country = 'Canada'
		)
	)
);

-- Join
SELECT cus.first_name, cus.last_name, cus.email 
FROM customer cus 
JOIN address adr 
ON cus.address_id = adr.address_id 
JOIN city cit 
ON adr.city_id = cit.city_id 
JOIN country cou 
ON cit.country_id = cou.country_id 
WHERE cou.country = 'Canada';
```

> Q14. 영화 카테고리가 가족(`Family`)으로 분류된 모든 영화의 제목과 출시연도 조회

```sql
SELECT film_id, title, release_year 
FROM film 
WHERE film_id IN (
	SELECT film_id 
	FROM film_category 
	WHERE category_id IN ( 
		SELECT category_id 
		FROM category 
		WHERE name = 'Family'
	)
);
```


> Q15. 가장 많이 대여된 영화ID(film_id)와 영화 제목, 대여 횟수를 조회

```sql
SELECT A.film_id, A.title, B.times_rented 
FROM film A 
JOIN (
	SELECT inv.film_id, COUNT(ren.rental_id) times_rented 
	FROM rental ren 
	JOIN inventory inv 
	ON ren.inventory_id = inv.inventory_id 
	GROUP BY inv.film_id
) B 
ON A.film_id = B.film_id 
ORDER BY B.times_rented DESC;
```

> Q16. 영화 가게 id(store_id)와 각 영화 가게(store)가 벌어들인 총 매출 조회

```sql
SELECT A.store_id, B.sales 
FROM store A 
JOIN (
	SELECT cus.store_id, SUM(pay.amount) sales 
	FROM customer cus 
	JOIN payment pay 
	ON pay.customer_id = cus.customer_id 
	GROUP BY cus.store_id
) B 
ON A.store_id = B.store_id 
ORDER BY a.store_id;
```

> Q17. 각 영화 가게의 id, 도시, 국가, 총 매출에 대해 조회

(활용 테이블: store, address, customer, payment, city, country)

```sql
SELECT A.*, B.sales 
FROM (
	SELECT sto.store_id, cit.city, cou.country 
	FROM store sto 
	LEFT JOIN address adr 
	ON sto.address_id = adr.address_id 
	JOIN city cit 
	ON adr.city_id = cit.city_id 
	JOIN country cou 
	ON cit.country_id = cou.country_id
) A 
JOIN (
	SELECT cus.store_id, sum(pay.amount) sales 
	FROM customer cus 
	JOIN payment pay 
	ON pay.customer_id = cus.customer_id 
	GROUP BY cus.store_id
) B 
ON A.store_id = B.store_id 
ORDER BY a.store_id;
```

> Q18. 총 수익 기준 상위 5개에 해당하는 영화 장르와 총 수익(별칭으로 `revenue`라고 작명) 조회

```sql
SELECT cat.name category_name, SUM( IFNULL(pay.amount, 0) ) revenue 
FROM category cat 
LEFT JOIN film_category flm_cat 
ON cat.category_id = flm_cat.category_id 
LEFT JOIN film fil 
ON flm_cat.film_id = fil.film_id 
LEFT JOIN inventory inv 
ON fil.film_id = inv.film_id 
LEFT JOIN rental ren 
ON inv.inventory_id = ren.inventory_id 
LEFT JOIN payment pay 
ON ren.rental_id = pay.rental_id 
GROUP BY cat.name 
ORDER BY revenue DESC 
LIMIT 5;
```

> Q19. `view`를 활용하여 18번에서 조회한 쿼리 임시 저장하기

```sql
CREATE VIEW top_five_genres as 
SELECT cat.name category_name, SUM( IFNULL(pay.amount, 0) ) revenue 
FROM category cat 
LEFT JOIN film_category flm_cat 
ON cat.category_id = flm_cat.category_id 
LEFT JOIN film fil 
ON flm_cat.film_id = fil.film_id 
LEFT JOIN inventory inv 
ON fil.film_id = inv.film_id 
LEFT JOIN rental ren 
ON inv.inventory_id = ren.inventory_id 
LEFT JOIN payment pay 
ON ren.rental_id = pay.rental_id 
GROUP BY cat.name 
ORDER BY revenue DESC 
LIMIT 5;
```

> Q20. 저장한 view로 다시 조회

```sql
SELECT * FROM top_five_genres;
```

> Q21. 사용하던 view 제거

```sql
DROP VIEW top_five_genres;
```