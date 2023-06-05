---
layout: post
title: " [Programmers] SQL > Join 풀이 모음 "
categories: Algorithm
author: devFancy
---
* content
{:toc}

## 구분

* 코딩테스트 연습 > SUM, MAX, MIN

## 조건에 맞는 도서와 저자 리스트 출력하기

[조건에 맞는 도서와 저자 리스트 출력하기 - 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/144854)

```sql
SELECT 
    BOOK.BOOK_ID,
    AUTHOR.AUTHOR_NAME,
    DATE_FORMAT(BOOK.PUBLISHED_DATE, '%Y-%m-%d') AS PUBLISHED_DATE
FROM 
    BOOK
INNER JOIN 
    AUTHOR
ON 
    BOOK.AUTHOR_ID = AUTHOR.AUTHOR_ID
WHERE
    BOOK.CATEGORY = '경제'
ORDER BY 
    BOOK.PUBLISHED_DATE ASC;
```

## 그룹별 조건에 맞는 식당 목록 출력하기

[그룹별 조건에 맞는 식당 목록 출력하기 - 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/131124)



```sql
SELECT 
    MEMBER_PROFILE.MEMBER_NAME,
    REST_REVIEW.REVIEW_TEXT,
    DATE_FORMAT(REST_REVIEW.REVIEW_DATE, '%Y-%m-%d') AS REVIEW_DATE
FROM
    MEMBER_PROFILE
INNER JOIN
    REST_REVIEW
ON
    MEMBER_PROFILE.MEMBER_ID = REST_REVIEW.MEMBER_ID
WHERE
    MEMBER_PROFILE.MEMBER_ID IN
    (
        SELECT MEMBER_ID
        FROM REST_REVIEW
        GROUP BY MEMBER_ID
        HAVING count(member_id) = (SELECT COUNT(REVIEW_TEXT) AS 'NUM'
    	        FROM REST_REVIEW
                GROUP BY MEMBER_ID
                ORDER BY NUM DESC
                LIMIT 1))
ORDER BY 
    REST_REVIEW.REVIEW_DATE ASC;
```

## 상품 별 오프라인 매출 구하기

[상품 별 오프라인 매출 구하기 - 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/131533)

```sql
SELECT P.PRODUCT_CODE, SUM(P.PRICE * O.SALES_AMOUNT) AS SALES
FROM PRODUCT P
JOIN (SELECT PRODUCT_ID, SALES_AMOUNT FROM OFFLINE_SALE) AS O
ON P.PRODUCT_ID = O.PRODUCT_ID
GROUP BY P.PRODUCT_ID
ORDER BY SALES DESC, P.PRODUCT_CODE
```

## Reference

* [프로그래머스 - 상품 별 오프라인 매출 구하기(MySQL)](https://velog.io/@zinu/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-%EC%83%81%ED%92%88-%EB%B3%84-%EC%98%A4%ED%94%84%EB%9D%BC%EC%9D%B8-%EB%A7%A4%EC%B6%9C-%EA%B5%AC%ED%95%98%EA%B8%B0MySQL)