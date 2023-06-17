---
layout: post
title: " [DB] 파티셔닝(Partitioning) "
categories: Database
author: devFancy
---
* content
{:toc}

> 이 글은 MySQL 기준으로 작성했습니다.

## Motivation

* 서비스, 사용자 요구사항의 고도화에 따라서 데이터 규모가 대용량으로 증가되면서, **기존에 사용하던 DB의 용량(storage)과 성능(performance)에 한계**가 생기게 된다.

* 즉, VLDB(Very Large DBMS)와 같이 하나의 DBMS에 너무 큰 table이 들어가면서 용량과 성능 측면에서 많은 이슈가 발생하게 되었고, 이런 이슈를 해결하기 위한 방법으로 테이블을 `partition`이라는 **몇 개의 단위로 나눠서 관리하는 `파티셔닝(Partitioning)` 기법**을 활용하면 된다.

* `파티셔닝(Partitioning)` 기법을 통해 SW적으로 DB를 분산처리하여 성능이 저하되는 것을 방지하고 관리를 보다 수월하게 할 수 있게 되었다.

## 파티셔닝이란

* `파티셔닝(Partitioning)`이란 하나의 테이블을 다수의 테이블로 분할하여 관리하는 것을 의미하며, 프로그래머 입장에서는 여전히 하나의 테이블로 동작하는 것처럼 사용할 수 있다.

* 즉, **큰 테이블이나 인덱스를, 관리하기 쉬운 파티션이라는 작은 단위로 물리적으로 분할하는 것을 의미한다.**

* 논리적으로는 하나의 테이블처럼, 물리적으로는 여러 개의 테이블로 구성된다.

## 파티셔닝의 목적

### 성능(performence)

* 특정 DML과 Query의 성능을 향상시킨다.

* 주로 대용량 data wirte 환경에 효율적이다.

* 특히, full scan에서 데이터 access의 범위를 줄여 성능 향상을 가져온다.

### 가용성(Availability)

* 물리적인 파티셔닝으로 인해 전체 데이터의 훼손 가능성이 줄어들고 데이터 가용성이 향상된다.

* 각 분할 영역(partition 별로)을 독립적으로 백업하고 복구할 수 있다.

* table의 partition 단위로 Disk I/O을 분산하여 경합을 줄이기 때문에 update 성능을 향상시킨다.

### 관리 용이성(Manageability)

* 큰 테이블을 제거하여 관리를 쉽게 해준다.

## 파티셔닝의 장단점

### 장점

* 관리적 측면: partition 단위 백업, 추가, 삭제, 변경
    * 전체 데이터를 손실할 가능성이 줄어들어 데이터 가용성이 향상된다.
    * partition별로 백업 및 복구가 가능하다.
    * partition 단위로 I/O 분산이 가능하며 update 성능을 향상시킨다.

* 성능적 측면: partition 단위로 조회 및 DML 수행
    * 데이터 전체 검색시 필요한 부분만 탐색해 성능이 증가된다.
    * 즉, full scan에서 데이터 접근의 범위를 줄여 성능 향상을 가져온다.
    * 필요한 데이터만 빠르게 조회할 수 있기 때문에 쿼리 자체가 가볍다.

### 단점

* table간 JOIN에 대한 비용이 증가한다.
* table과 index를 별도로 파티셔닝할 수 없다. -> table과 index를 같이 파티셔닝해야 한다.

## 파티셔닝 방식

* 테이블을 파티셔닝하는 방법은 크게 2가지로 구분할 수 있다.

1. 수평 분할 - 주로 사용
2. 수직 분할

![](/assets/img/db/what_is_horizontal_partitioning_in_database.png)

### 수평 분할 방식

* 수평분할(Horizontal Partitioning)은 행(row)을 기준으로 테이블을 분할하는 형테이다.

### 수직 분할 방식

* 특정 열에 대한 접근을 제한하거나 성능 향상이 필요할 때 열(column) 기준으로 분할하는 방식이다.

## 파티셔닝 종류

### RANGE 파티셔닝

* 지정된 범위에 속하는 열 값을 기반으로 파티션에 행을 할당한다. 

* 예를 들어, 우편 번호를 분할 키로 수평 분할하는 경우이다.

### LIST 파티셔닝

* 값 목록에 파티션을 할당 분할 키 값을 그 목록에 비추어 파티션을 선택한다. 

* 예를 들어, Country 라는 컬럼의 값이 Iceland , Norway , Sweden , Finland , Denmark 중 하나에 있는 행을 빼낼 때 북유럽 국가 파티션을 구축 할 수 있다.

### HASH 파티셔닝

* 해시 함수의 값에 따라 파티션에 포함할지 여부를 결정한다. 

* 예를 들어, 4개의 파티션으로 분할하는 경우 해시 함수는 0-3의 정수를 돌려준다.

### KEY 파티셔닝

* key 파티션은 hash 파티션과 거의 동일하다.

* key 파티션은 선정된 파티션 키 값에 대하여 내부적으로 [MD5()](https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_md5)을 이용하여 해시값을 계산하고, 그 값에 MOD를 적용하여 저장할 파티션을 결정한다.

## Reference

* [[DB] DB 파티셔닝(Partitioning)이란](https://gmlwjd9405.github.io/2018/09/24/db-partitioning.html)

* [[MySQL] Chapter 24 Partitioning](https://dev.mysql.com/doc/refman/8.0/en/partitioning.html)

* [Why Horizontal Partitioning Is Important For Database Design](https://www.rkimball.com/why-horizontal-partitioning-is-important-for-database-design/)