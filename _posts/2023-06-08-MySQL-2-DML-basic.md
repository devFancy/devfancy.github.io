---
layout: post
title: " [MySQL 공식문서] 2. DML - 기본 DB 조작 명령어, DML 스키마 "
categories: MySQL
author: devFancy
---
* content
{:toc}

## 기본 DB 조작 명령어

* 전체 데이터베이스(Schema) 조회

```sql
show databases;
```

### MySQL에서 제공하는 몇 가지 기본 스키마

* [1] [Information schema](https://dev.mysql.com/doc/refman/8.0/en/information-schema-introduction.html) : MySQL 서버에 대한 **메타데이터**를 제공한다. 

  데이터베이스, 테이블, 열, 사용자 및 권한과 같은 정보를 쿼리로 조회가 가능하다.

* [2] mysql : MySQL 사용자 계정 및 권한 정보를 의미한다.

* [3] [performance_schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html) : MySQL 서버의 성능과 관련된 정보를 제공한다. 

  e.g. 쿼리 실행 횟수, 잠금 정보, 스레드 상태, 워크로드 분석 등

* [4] [sys](https://dev.mysql.com/doc/refman/8.0/en/sys-schema.html) : MySQL 서버의 성능 모니터링 및 진단을 위한 시스템 객체와 뷰를 제공한다. 

  sys.schema_table_statistics 및 sys.schema_tables_with_full_table_scans과 같은 뷰를 통해 테이블의 통계 및 I/O 관련 정보에 대한 확인이 가능하다.

### sakila DB

* `sakila DB`란 MySQL에서 제공하는 sample 데이터다. 데이터를 추출, 조작하기에 좋은 예시 데이터다.

> sakila DB 사용

```sql
use sakila;
```

> sakila DB가 보유 중인 테이블(Table) 조회

```sql
show tables;
```

```
mysql> show tables;
+----------------------------+
| Tables_in_sakila           |
+----------------------------+
| actor                      |
| actor_info                 |
| address                    |
| category                   |
| city                       |
| country                    |
| customer                   |
| customer_list              |
| film                       |
| film_actor                 |
| film_category              |
| film_list                  |
| film_text                  |
| inventory                  |
| language                   |
| nicer_but_slower_film_list |
| payment                    |
| rental                     |
| sales_by_film_category     |
| sales_by_store             |
| staff                      |
| staff_list                 |
| store                      |
| tc                         |
+----------------------------+
24 rows in set (0.01 sec)
```

> customer 테이블의 정보 조회

```sql
DESC customer;
```

* Field : Column명(열)
* Type : 해당 컬럼의 데이터 타입
* Null: 할당되지 않음,
* Key: 데이터 모델링 때 설명
* Default : 실제 값을 넣을 때 별도의 값을 작성하지 않을 경우, 기본값으로 설정해주는 값


```
mysql> DESC customer;
+-------------+-------------------+------+-----+-------------------+-----------------------------------------------+
| Field       | Type              | Null | Key | Default           | Extra                                         |
+-------------+-------------------+------+-----+-------------------+-----------------------------------------------+
| customer_id | smallint unsigned | NO   | PRI | NULL              | auto_increment                                |
| store_id    | tinyint unsigned  | NO   | MUL | NULL              |                                               |
| first_name  | varchar(45)       | NO   |     | NULL              |                                               |
| last_name   | varchar(45)       | NO   | MUL | NULL              |                                               |
| email       | varchar(50)       | YES  |     | NULL              |                                               |
| address_id  | smallint unsigned | NO   | MUL | NULL              |                                               |
| active      | tinyint(1)        | NO   |     | 1                 |                                               |
| create_date | datetime          | NO   |     | NULL              |                                               |
| last_update | timestamp         | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+-------------+-------------------+------+-----+-------------------+-----------------------------------------------+
9 rows in set (0.00 sec)
```

> 현재 접속 중인 MySQL의 버전, user, database 확인

```sql
SELECT version(), user(), database();
```

```
mysql> SELECT version(), user(), database();
+-----------+----------------+------------+
| version() | user()         | database() |
+-----------+----------------+------------+
| 8.0.33    | root@localhost | sakila     |
+-----------+----------------+------------+
1 row in set (0.00 sec)
```

## DML 스키마

DML 실습에서 활용할 데이터 스키마

![](/assets/img/mysql/mysql-sakila-schema.png)

* [MySQL sakila DB 정보 기술 문서](https://dev.mysql.com/doc/sakila/en/sakila-structure.html)

* [ERD - Sakila Sample MySQL database](https://dataedo.com/samples/html/Sakila/doc/Sakila_8/modules/Sakila_database_diagram_95/module.html)

![](/assets/img/mysql/mysql-sakila-database-diagram.png)

## Reference

* [INFORMATION_SCHEMA Usage Notes](https://dev.mysql.com/doc/refman/8.0/en/information-schema-introduction.html)

* [Chapter 27 MySQL Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html)

* [Chapter 28 MySQL sys Schema](https://dev.mysql.com/doc/refman/8.0/en/sys-schema.html)

* [MySQL sakila DB 정보 기술 문서](https://dev.mysql.com/doc/sakila/en/sakila-structure.html)

* [ERD - Sakila Sample MySQL database](https://dataedo.com/samples/html/Sakila/doc/Sakila_8/modules/Sakila_database_diagram_95/module.html)