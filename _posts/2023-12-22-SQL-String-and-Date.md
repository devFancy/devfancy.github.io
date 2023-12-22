---
layout: post
title: " [Programmers] SQL > String, Date 풀이 모음 "
categories: SQL
author: devFancy
---
* content
{:toc}

## 자동차 대여 기록에서 장기/단기 대여 구분하기

> [자동차 대여 기록에서 장기/단기 대여 구분하기](https://school.programmers.co.kr/learn/courses/30/lessons/151138)

* 문제: `CAR_RENTAL_COMPANY_RENTAL_HISTORY` 테이블에서 대여 시작일이 
    
    2022년 9월에 속하는 대여 기록에 대해서 대여 기간이 30일 이상이면 '장기 대여' 
    
    그렇지 않으면 '단기 대여' 로 표시하는 컬럼(컬럼명: RENT_TYPE)을 추가하여 

    대여기록을 출력하는 SQL문을 작성해주세요. 

    결과는 대여 기록 ID를 기준으로 내림차순 정렬해주세요.

### Answer Code(Lv.1)

```sql
select history_id, car_id, 
date_format(start_date, '%Y-%m-%d') as start_date,
date_format(end_date,  '%Y-%m-%d') as end_date,
case when datediff(end_date, start_date) + 1 >= 30 then "장기 대여"
else "단기 대여" end as rent_type
from car_rental_company_rental_history
where start_date between '2022-09-01' and '2022-09-30'
order by history_id desc;
```

### 문제 풀이
> 문제를 풀기 위해서 해야할 작업들

1. 대여시작일이 2022년 9월인 기옥에 대해서 대여 기간이 30일 이상인 경우 "장기 대여" 그렇지 않으면 "단기 대여"로 구분(`RENT_TYPE` 컬럼 추가)
2. 데이터 포맷은 예시와 동일하게 나타내기
3. `대여 기옥 ID`를 기준으로 내림차순하기

> `DATE_FORMAT` : MySQL에서 사용되는 **날짜 데이터의 출력 형식을 지정하는 함수**

* `date_format(start_date, '%Y-%m-%d')`은 start_date 에서 `'%Y-%m-%d'` 형식으로 반환해준다.

  (대부분의 날짜 데이터는 **`%Y-%m-%d` 형식**을 많이 사용한다.)

* `%Y` : 4자리 연도(예: 2023) / `%y` : 2자리 연도 (예: 23)

* `%m`: 월 (01부터 12까지)

* `%d`: 일 (01부터 31까지)

> `DATEDIFF`: MySQL에서 사용되는 **두 날짜 간의 차이를 계산하는 함수**

* 이 함수는 첫 번째 날짜에서 두 번째 날짜를 뺀 결과를 반환해준다.

* 기본 사용 형식: `DATEDIFF(end_date, start_date)`

* **중요)** 오늘 대여하고 오늘 반납해도 대여 기간은 하루 기간이기 때문에, **(END_DATE - START_DATE) +1 >= 30** 으로 계산해야 한다.

```
# 대여기간 예시
2023년 12월 22일 대여 >> 2023년 12월 22일 반납: 1일
= (22 - 22)일 + 1일
= 1일

2023년 12월 22일 대여 >> 2023년 12월 23일 반납: 2일
= (23 - 22)일 + 1일
= 2일
```

> `CASE 문`: 조건에 따라 새로운 값을 부여하여 **새로운 컬럼을 부여**하는 경우에 사용한다.

* 아래는 `CASE 문`의 기본 사용 형식이다.

```sql
CASE
WHEN 조건 1
THEN 조건 1 만족 시 반환하는 값
WHEN 조건 2
THEN 조건 2 만족 시 반환하는 값
ELSE 조건들에 만족 안 하는 경우 반환 값
END 
```

## 특정 옵션이 포함된 자동차 리스트 구하기(Lv.1)

> [특정 옵션이 포함된 자동차 리스트 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/157343)

* 문제: `CAR_RENTAL_COMPANY_CAR` 테이블에서 '네비게이션' 옵션이 포함된 자동차 리스트를 출력하는 SQL문을 작성해주세요. 

  결과는 자동차 ID를 기준으로 내림차순 정렬해주세요.

### Answer Code1

```sql
select car_id, car_type, daily_fee, options
from car_rental_company_car
where options like '%네비게이션%'
order by car_id desc
```

### 문제 풀이

> 문제를 풀기 위해서 해야할 작업들

1. `네비게이션` 옵션이 포함된 자동차 리스트를 출력한다.
2. 자동차 ID를 기준으로 내림차순으로 정렬한다.

* `CAR_RENTAL_COMPANY_CAR` 테이블에서 '네비게이션' 옵션이 포함 => **where + like** 절을 사용한다. => `like '%네비게이션%'` 

* `order by car_id desc` => `DESC`는 내림차순(`ASC`는 오름차순 이다)

## 조건에 맞는 사용자 정보 조회하기(Lv.3)

> [조건에 맞는 사용자 정보 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164670)

* 문제: `USED_GOODS_BOARD`와 `USED_GOODS_USER` 테이블에서 

  중고 거래 게시물을 3건 이상 등록한 사용자의 사용자 ID, 닉네임, 전체주소, 전화번호를 조회하는 SQL문을 작성해주세요.

  이때, 전체 주소는 시, 도로명 주소, 상세 주소가 함께 출력되도록 해주시고, 

  전화번호의 경우 `xxx-xxxx-xxxx` 같은 형태로 하이픈 문자열(-)을 삽입하여 출력해주세요.

  결과는 회원 ID를 기준으로 내림차순 정렬해주세요.

### Answer Code

```sql
select user.user_id, user.nickname, 
concat(user.city,' ', user.street_address1,' ', user.street_address2) AS 전체주소,
concat(LEFT(tlno, 3), '-', MID(tlno, 4, 4),'-', RIGHT(tlno, 4)) AS 전화번호
from used_goods_user as user
join used_goods_board as board
on user.user_id = board.writer_id
group by board.writer_id
having count(board.writer_id) >= 3
order by user.user_id desc;
```

### 문제 풀이

> 문제를 풀기 위해서 해야할 작업들

1. `USED_GOODS_BOARD` 테이블에서 writer_id 컬럼의 값을 count하여 3개 이상인 writer_id 찾기
2. CONCAT() 함수와 `USED_GOODS_USER`의 CITY, STREET_ADDRESS1, STREET_ADDRESS2를 활용하여 '전체주소' 생성하기
3. CONCAT() 함수와 `USED_GOODS_USER`의 TLNO를 활용하여 '전화번호' 생성하기
4. USER_ID 기준으로 내림차순하기

> `GROUP BY` 구문: 주로 집계 함수(COUNT)와 함께 사용되어 특정 열의 값에 기반하여 그룹을 형성하는 역할

```sql
group by board.writer_id
having count(board.writer_id) >= 3
```

* `USER_GOODS_BOARD` 테이블에서 `WRITER_ID` 열을 기준으로 그룹을 형성한다.

* 그런 다음, `HAVING` 구문을 사용하여 `USER_GOOD_BOARD` 테이블에서 각 작성자(`WRITER_ID`)가 최소 3개 이상의 게시물을 작성한 경우에만 해당 그룹이 선택된다.

> `CONCAT()` 함수: SQL에서 사용되는 문자열을 연결하는 함수

```sql
concat(user.city,' ', user.street_address1,' ', user.street_address2) AS 전체주소
```

* SELECT 절에서 "CONCAT() 함수"를 이용해서 `CITY`, `STREET_ADDRESS1`, `STREET_ADDRESS2` 컬럼을 **하나의 문자열**로 연결하는 작업이다.

* 예시에서 나온 것과 같게 만들기 위해서는 **공백(' ')으로 각 컬럼의 값을 구분하고, AS 절을 이용하여 요구한 컬럼의 이름과 동일하게 `전체주소` 라는 컬럼을 부여**했다.

```sql
concat(LEFT(tlno, 3), '-', MID(tlno, 4, 4),'-', RIGHT(tlno, 4)) AS 전화번호
```

* "CONCAT() 함수"를 이용해서 연결 사이에 '-' 으로 구분하여 하나의 문자열을 만들었다.

  * LEFT(tlno, 3): 전화번호 문자열의 왼쪽에서 3자리를 추출

  * MID(tlno, 4, 4): 전화번호 문자열에서 4번째 위치에서부터 4자리를 추출

  * RIGHT(tlno, 4): 전화번호 문자열의 오른쪽에서 4자리를 추출합니다.

> 다른 방법: SUBSTR((또는 SUBSTRING)) 함수 사용 : **문자열에서 일부분을 추출**하는 데 사용되는 SQL 함수이다.

```sql
CONCAT(SUBSTR(TLNO, 1, 3), '-', SUBSTR(TLNO, 4, 4), '-', SUBSTR(TLNO, 8)) AS 전화번호
```

* 일반적인 사용 형식: `SUBSTR(string, start_position, length)` 

  * string: 추출하려는 문자열

  * start_position: 추출을 시작할 위치입니다. 1부터 시작한다.

  * length (선택사항): 추출하려는 부분의 길이를 지정한다. 만약 이 부분을 생략하면 시작 위치부터 문자열의 끝까지 추출하게 된다.

* `SUBSTR()` (또는 SUBSTRING) 함수: **문자열에서 일부분을 추출**하는 데 사용되는 SQL 함수이다.

  * SUBSTR(TLNO, 1, 3): 전화번호 문자열의 1번째 위치에서부터 3자리를 추출

  * SUBSTR(TLNO, 4, 4): 전화번호 문자열에서 4번째 위치에서부터 4자리를 추출

  * SUBSTR(TLNO, 8): 전화번호 문자열의 8번째 위치에서부터 끝까지 추출

### Answer Code2

```sql
SELECT  USER_ID
        , NICKNAME
        , CONCAT(CITY, ' ', STREET_ADDRESS1, ' ', STREET_ADDRESS2) AS '전체주소'
        , CONCAT(SUBSTR(TLNO, 1, 3), '-', SUBSTR(TLNO, 4, 4), '-', SUBSTR(TLNO, 8)) AS '전화번호'
FROM    USED_GOODS_USER 
WHERE   USER_ID IN (
                     SELECT  WRITER_ID
                     FROM    USED_GOODS_BOARD
                     GROUP BY WRITER_ID
                     HAVING  COUNT(*) >= 3
                 )
ORDER 
  BY  USER_ID DESC;
```

### 문제 풀이

* 위 정답은 다른 사람이 푼 것을 가져와봤다.

* `Answer Code1`는 join을 사용했는데, `Answer Code2`는 join 없이 서브 쿼리를 사용한 SQL 구문이다.

## 조회수가 가장 높은 중고거래 게시물에 대한 첨부파일 경로를 조회하기(Lv.3)

> [조회수가 가장 높은 중고거래 게시물에 대한 첨부파일 경로를 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164671)

* 문제: `USED_GOODS_BOARD`와 `USED_GOODS_FILE` 테이블에서

  조회수가 가장 높은 중고거래 게시물에 대한 첨부파일 경로를 조회하는 SQL문을 작성해주세요. 

  첨부파일 경로는 FILE ID를 기준으로 내림차순 정렬해주세요. 

  기본적인 파일경로는 /home/grep/src/ 이며, 게시글 ID를 기준으로 디렉토리가 구분되고, 

  파일이름은 파일 ID, 파일 이름, 파일 확장자로 구성되도록 출력해주세요. 

  조회수가 가장 높은 게시물은 하나만 존재합니다.

### Answer Code1

```sql
SELECT  CONCAT('/home/grep/src/', BOARD_ID, '/', FILE_ID, FILE_NAME, FILE_EXT) AS FILE_PATH
FROM  USED_GOODS_FILE
WHERE  BOARD_ID = (
  SELECT BOARD_ID
  FROM USED_GOODS_BOARD
  ORDER BY VIEWS DESC
  LIMIT 1
)
ORDER
  BY  FILE_ID DESC;
```

### 문제 풀이

> 문제를 풀기 위해서 해야할 작업들

1. CONCAT() 함수를 이용하여 `USED_GOODS_FILE` 테이블에서 BOARD_ID 를 기준으로 디렉터리를 '/' 으로 구분하고, 파일이름은 FILE_ID, FILE_NAME, FILE_EXT로 구성되도록 한다.
2. 조건 where 절에서 `USED_GOODS_BOARD` 테이블에서 가장 높은 조회수(VIEW)를 SELECT 절과 MAX를 이용해서 하나만 조회하도록 한다.
3. FILE_ID를 기준으로 내림차순 정렬하여 결과를 출력한다.

[1]. CONCAT() 함수를 이용하여 `USED_GOODS_FILE` 테이블에서 BOARD_ID 를 기준으로 디렉터리를 '/' 으로 구분하고, 파일이름은 FILE_ID, FILE_NAME, FILE_EXT로 구성되도록 한다.

```sql
SELECT  CONCAT('/home/grep/src/', BOARD_ID, '/', FILE_ID, FILE_NAME, FILE_EXT) AS FILE_PATH
FROM  USED_GOODS_FILE
```

[2]. 조건 where 절에서 `USED_GOODS_BOARD` 테이블에서 가장 높은 조회수(VIEW)를 SELECT 절과 ORDER BY, LIMIT절을 이용해서 하나만 조회한다.

```sql
WHERE  BOARD_ID = (
  SELECT BOARD_ID
  FROM USED_GOODS_BOARD
  ORDER BY VIEWS DESC
  LIMIT 1
)
```

[3]. FILE_ID를 기준으로 내림차순 정렬하여 결과를 출력한다.

```sql
ORDER
  BY  FILE_ID DESC;
```

### Answer Code2

```sql
SELECT
    CONCAT('/home/grep/src/', FILE.BOARD_ID, '/', FILE_ID, FILE_NAME, FILE_EXT) AS FILE_PATH
FROM USED_GOODS_FILE AS FILE
LEFT JOIN USED_GOODS_BOARD AS BOARD
ON FILE.BOARD_ID = BOARD.BOARD_ID
WHERE VIEWS = (SELECT MAX(VIEWS) FROM USED_GOODS_BOARD)
ORDER BY FILE_ID DESC
```

## 자동차 대여 기록 별 대여 금액 구하기(Lv.4)

> [자동차 대여 기록 별 대여 금액 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/151141)

* 문제: `CAR_RENTAL_COMPANY_CAR` 테이블과 `CAR_RENTAL_COMPANY_RENTAL_HISTORY` 테이블과 `CAR_RENTAL_COMPANY_DISCOUNT_PLAN` 테이블에서

  자동차 종류가 '트럭'인 자동차의 대여 기록에 대해서 대여 기록 별로 대여 금액(컬럼명: FEE)을 구하여

  대여 기록 ID와 대여 금액 리스트를 출력하는 SQL문을 작성해주세요. 

  결과는 대여 금액을 기준으로 내림차순 정렬하고, 
  
  대여 금액이 같은 경우 대여 기록 ID를 기준으로 내림차순 정렬해주세요.

### Answer Code

```sql
SELECT  D.HISTORY_ID
        , ROUND(IF(D.DISCOUNT_RATE IS NULL, D.DAILY_FEE * D.DATE_DIFF, D.DAILY_FEE * D.DATE_DIFF * (100-D.DISCOUNT_RATE)*0.01),0) AS FEE
  FROM  (
        SELECT  A.*
                , B.HISTORY_ID
                , DATEDIFF(B.END_DATE,B.START_DATE) + 1 AS DATE_DIFF
                , C.DISCOUNT_RATE
          FROM  CAR_RENTAL_COMPANY_CAR A
          LEFT
          JOIN  CAR_RENTAL_COMPANY_RENTAL_HISTORY B
            ON  A.CAR_ID = B.CAR_ID
          LEFT
          JOIN  CAR_RENTAL_COMPANY_DISCOUNT_PLAN C
            ON  CASE WHEN DATEDIFF(B.END_DATE,B.START_DATE) BETWEEN 7 AND 29 THEN C.PLAN_ID = 10
                     WHEN DATEDIFF(B.END_DATE,B.START_DATE) BETWEEN 30 AND 89 THEN C.PLAN_ID = 11
                     WHEN DATEDIFF(B.END_DATE,B.START_DATE) >= 90 THEN C.PLAN_ID = 12 END
         WHERE  A.CAR_TYPE = '트럭'
         ) D 
 ORDER
    BY   FEE DESC 
         , HISTORY_ID DESC
```

## 조건에 부합하는 중고거래 상태 조회하기(Lv.2)

> [조건에 부합하는 중고거래 상태 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164672)

* 문제: `USED_GOODS_BOARD` 테이블에서 2022년 10월 5일에 등록된 

  중고거래 게시물의 게시글 ID, 작성자 ID, 게시글 제목, 가격, 거래상태를 조회하는 SQL문을 작성해주세요.

  거래상태가 SALE 이면 판매중, RESERVED이면 예약중, DONE이면 거래완료 분류하여 출력해주시고, 

  결과는 게시글 ID를 기준으로 내림차순 정렬해주세요.

### Answer Code

```sql
select board_id, writer_id, title, price, 
    case 
        when status = 'SALE' then '판매중' 
        when status = 'RESERVED' then '예약중' 
        when status = 'DONE' then '거래완료' 
        end status
from used_goods_board
where board_id in(
    select board_id 
    from used_goods_board 
    where created_date = '2022-10-05'
)
order 
    by board_id desc;
```

## Reference

- https://kkw-da.tistory.com/category/Skill%20Sets/SQL