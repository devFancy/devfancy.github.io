---
layout: post
title: " [DB] 트랜잭션 격리 수준 "
categories: Database
author: devFancy
---
* content
{:toc}

## Prologue

* [이전 트랜잭션](https://devFancy.github.io/DB-Transaction/)의 ACID 특성 중 한 가지인 **격리성**에 대해 조금 더 깊게 공부하기 위해 해당 포스트를 작성하게 되었다.

## 격리성

* 트랜잭션의 특성 중 한 가지인 `격리성`(Isolation)은 현재 수행 중인 트랜잭션이 완료될 때까지 트랜잭션이 생성된 중간 연산 결과에 **다른 트랜잭션들이 접근할 수 없음**을 의미한다.

* 격리성은 여러 개의 격리 수준으로 나뉘어 격리성을 보장한다.

* 격리 수준은 아래와 같이 4개가 있다.

![](/assets/img/db/db-transaction-isolation-level-1.jpg)

* 위로 갈수록 동시성이 강해지지만 격리성은 약해지고, 아래로 갈수록 동시성은 약해지지만 격리성은 강해진다.

* 또한 각 단계마다 나타나는 현상이 있다. 

    * `READ_UNCOMMITTED` - 팬텀 리드, 반복 가능하지 않는 조회, 더티 리드가 발생할 수 있다.

    * `READ_COMMITTED` - 팬텀 리드, 반복 가능하지 않는 조회가 발생한다.

    * `REPEATABLE_READ` - 팬텀 리드가 발생한다.

## 격리 수준에 따라 발생하는 현상

* 격리 수준에 따라 발생하는 현상은 더티 리드, 반복 가능하지 않는 조회, 팬텀 리드가 있다.

### 더티 리드

* 더티 리드(Dirty Read)는 반복 가능하지 않은 조회와 유사하며 한 트랜잭션이 실행 중일 때 **다른 트랜잭션에 의해 수정되었지만 아직 '커밋되지 않은'행의 데이터를 읽을 경우** 발생한다.

* 예를 들어 사용자 A의 계좌(A 트랜잭션)가 $100을 $0으로 변경한 내용이 **아직 커밋되지 않은** 상태라도 그 이후에 사용자 B가 조회했을 때 결과가 $0으로 나온 경우를 말한다.

* 만약 **수정한** 트랜잭션 A가 그 변경 사항을 **롤백**하면, 그 데이터를 읽은 다른 트랜잭션 B가 **더티 데이터**를 가지고 있다고 말한다.

### 반복 가능하지 않은 조회

* 반복 가능하지 않은 조회(Non-Repeatable Read)는 한 트랜잭션 내의 **같은 행**에 두 번 이상 조회가 발생했는데, 그 **값이 다른 경우**를 가리킨다.

* 예를 들어 팬시의 계좌가 1번인 잔고 안에 $100가 들어 있다.

  처음에 계좌 1번의 데이터를 읽으면, $100를 읽게 된다.

  하지만 이 때 팬시가 계좌가 1번인 잔고에서 $10을 다른 계좌로 송금했다.

  그러면 두 번째로 계좌 1번의 데이터를 읽을 때에는 $90를 읽게 된다. 

* 이처럼 한 트랜잭션 내에서 **같은 Key**를 가진 Row를 두 번 읽었는데 그 사이에 **값이 변경되거나 삭제**되어 결과가 다르게 나타나는 현상을 말한다.

### 팬텀 리드

* 팬텀 리드(Phantom Read)는 한 트랜잭션 내에서 동일한 쿼리를 보냈을 때 **해당 조회 결과가 다른 경우**를 말한다.

* 다른 트랜잭션 의한 변경 사항으로 인해 현재 사용중인 트랜잭션의 Where 절의 **조건**에 맞는 **새로운 행**이 생길 수 있는 경우에 관한 것이다.

* 예를 들어, 팬시의 잔고가 $100 미만인 계좌가 2개인 DB에서

  $100 미만인 계좌를 찾는 트랜잭션이 있고, 그 트랜잭션안에서 Select 쿼리를 2번 수행한다고 가정하자.

  처음에 데이터를 읽으면 **2개**의 계좌를 찾게 된다.

  하지만 이 때 다른 트랜잭션에서 **$0인 계좌**를 새로 만들고 난 이후에

  두 번째 데이터를 읽을 때에는 **3개**의 계좌를 찾게 된다.

* 이처럼 Where 절의 조건에 맞는 새로운 행이 생길 수 있는 경우를 말한다.

## 격리 수준

![](/assets/img/db/db-transaction-isolation-level-2.png)

* 위의 표에서 알 수 있듯이 엄격해질수록 이상 현상을 허용하지 않는다.

* 격리 수준은 세 가지 이상 현상을 정의한 뒤 어떤 현상을 허용/허용하지 않는지에 따라 격리 수준이 나뉜다.

* 개발자는 이 격리 수준을 통해 전체 **처리량**(Throughput)과 **데이터 일관성** 사이에서 **trade** 할 수 있다.

### 격리 수준의 필요성

* DB는 데이터 무결성을 보장하는 것이 중요하다. `데이터 무결성`은 데이터의 정확성과 일관성을 유지하고 보증하는 것을 말한다.

    그리고 그 무결성을 보장하기 위한 특징이 **ACID**(Atomicity, Consistency, Isolation, Durability)이다.

    데이터베이스는 ACID 특징과 같이 트랜잭션이 독립적인 수행을 하도록 한다. 그래서 등장한 개념이 **Locking**이다.

* `Locking`은 트랜잭션이 DB를 다루는 동안 다른 트랜잭션이 관여하지 못하게 막는 역할이다.

    하지만 **무조건적인 Locking**으로 동시에 수행되는 수많은 트랜잭션들을 순서대로 처리하면 **DB의 성능**은 현저히 떨어지게 될 것이다.

    그렇다고 해서 성능을 높이기 위해 **Locking 범위**를 줄인다면, 잘못된 값이 처리될 수 있다.

    그래서 최대한 효율적인 **Locking 방법**이 필요하다.

* 이와 관련된 Locking 방법이 **격리 수준**(Isolation Level)이다.

### READ_UNCOMMITTED

* 가장 낮은 격리 수준으로, 하나의 트랜잭션이 커밋되기 이전에 다른 트랜잭션에 **노출**되는 문제가 있지만 가장 빠르다.

* 이는 데이터 무결성을 위해 되도록이면 사용하지 않는 것이 이상적이나, 몇몇 행이 제대로 조회되지 않더라도 괜찮은 거대한 양의 데이터를 **어림잡아 집계**하는 데는 사용하면 좋다.

* 발생할 수 있는 문제

  * Phantom Read

  * Non-Repeatable Read

  * Dirty Read

### READ_COMMITTED

* 가장 많이 사용하는 격리 수준이며, PostgreSQL, SQL Server, 오라클에서 기본값으로 설정되어 있다.

* READ_UNCOMMITTED 와 달리 다른 트랜잭션이 커밋 되지 않은 정보는 읽을 수 없다.

    즉, **커밋 완료된 데이터**만 조회를 허용한다.

* 하지만, 어떤 트랜잭션이 접근한 행을 다른 트랜잭션이 **수정**할 수 있다.

    예를 들어 트랜잭션 A가 수정한 행을 트랜잭션 B가 수정할 수 있다.

* 발생할 수 있는 문제

  * Phantom Read

  * Non-Repeatable Read

### REPEATABLE_READ

> "REPEATABLE READ: This is the default isolation level for InnoDB." - MySQL 공식문서 -

* **`MySQL의 InnoDB엔진`의 기본 격리수준**으로, 하나의 트랜잭션이 수정한 행을 다른 트랜잭션이 수정할 수 없도록 막아주지만 **새로운 행을 추가**하는 것은 막지 않는다.

    따라서 이후에 **추가된 행**이 발견될 수 있다.

* 발생할 수 있는 문제

  * Phantom Read

#### REPEATABLE READ와 스냅샷

> 2025.07.23 업데이트

앞선 설명만 보면 한 가지 의문이 생길 수 있다.

"REPEATABLE READ도 커밋된 데이터를 읽는다고 했는데, 왜 다른 트랜잭션이 커밋한 최신 데이터를 보지 못하는 걸까?"

앞선 설명만 보면 한 가지 의문이 생길 수 있습니다. "REPEATABLE READ도 커밋된 데이터를 읽는다고 했는데, 왜 다른 트랜잭션이 커밋한 최신 데이터를 보지 못하는 걸까?"

결론부터 말하면 **`REPEATABLE READ`는 트랜잭션 내 첫 `SELECT` 시점의 '스냅샷(Snapshot)'을 만들어, 트랜잭션이 끝날 때까지 그 스냅샷의 데이터만 일관되게 보여주기 때문**이다. 이는 MySQL의 **MVCC(Multi-Version Concurrency Control)** 와 관련된 핵심 동작 방식이다.

다른 트랜잭션이 데이터를 변경하고 커밋해도, 현재 트랜잭션은 **'반복 가능한 읽기'를 보장하기 위해 의도적으로 최신 변경 사항을 무시**하고 자신만의 스냅샷을 참조한다.

아래 그림은 동시 결제 요청 시 스냅샷으로 인해 문제가 발생하는 과정을 보여준다.

> REPEATABLE READ의 스냅샷 동작 원리

![](/assets/img/db/DB-Concurrency-Issue-Scenario.png)

시나리오 분석: 아래 타임라인을 통해 두 트랜잭션이 어떻게 상호작용하는지 자세히 살펴보자.

* T1: 트랜잭션 A(5,000원 결제)와 B(3,000원 결제)가 거의 동시에 시작된다. 트랜잭션 B는 잔액 `10,000원`을 조회하고, 이 시점에 **B를 위한 데이터 스냅샷(Snapshot)이 생성된다.**

* T2 ~ T3: 트랜잭션 A가 먼저 DB Lock을 획득하여 결제를 처리한다. 트랜잭션 B는 동일한 데이터에 접근하려다 Lock을 얻지 못하고 **대기(Blocked) 상태**가 된다.

* T4: 트랜잭션 A가 처리를 마치고 `5,000원`이 차감된 잔액을 **커밋(Commit)**한다. DB의 실제 잔액은 `5,000원`이 되고 Lock은 해제된다. 대기하던 트랜잭션 B가 드디어 Lock을 획득하고 깨어난다.

* T5: 로직을 재개한 트랜잭션 B가 비즈니스 로직을 위해 잔액을 참조한다. 이때 B는 DB의 최신 값(5,000원)을 보는 것이 아니라, **T1에서 생성한 자신만의 스냅샷**을 일관되게 참조한다. 따라서 B에게 잔액은 여전히 `10,000원`으로 보인다. 이것이 바로 `REPEATABLE READ`의 핵심 동작이다.

* T6 ~ T7: 트랜잭션 B는 10,000원을 기준으로 3,000원 결제를 처리한 후, `UPDATE ... WHERE balance = 10000` 쿼리를 실행한다. 하지만 T4 시점에 A가 커밋한 DB의 실제 잔액은 5,000원이므로 `WHERE` 조건이 불일치하여 **최종 업데이트는 실패**한다.

이처럼 `REPEATABLE READ`는 **'트랜잭션 내의 일관성'** 을 위해 **'데이터 정합성'** 을 일부 희생하는 전략을 사용한다. 이 특징을 이해해야 동시성 이슈가 발생했을 때 정확한 원인을 파악하고 `READ COMMITTED`와 같은 다른 격리 수준을 대안으로 고려할 수 있다.

### SERIALIZABLE

* 말 그대로 트랜잭션을 순차적으로 진행시키는 것을 말한다.(직렬화)

    여러 트랜잭션이 동시에 같은 행에 접근할 수 없다.

    이 수준은 **매우 엄격한 수준**으로 해당 행에 대해 격리시키고, 이후 트랜잭션이 이 행에 대해 일어난다면 **기다려야** 한다.

    그렇기 때문에 **교착 상태**가 일어날 확률도 많고 **가장 성능이 떨어지는** 격리수준이다.

> 교착 상태(Dead Lock)란 두 트랜잭션이 각각 Lock을 설정한 다음 **서로의 Lock에 접근**하여 값을 얻어오려고 할 때 이미 각각의 **트랜잭션**에 의해 Lock이 설정되어 있기 때문에 양쪽 트랜잭션 모두 **무한정 기다려야 하는 상태**를 말한다.

* 발생할 수 있는 문제 X

### 어떤 격리 수준을 선택해야 할까?

지금까지의 내용을 보면 `REPEATABLE READ`의 스냅샷 동작 방식이 문제를 일으켰으니, 무조건 `READ COMMITTED`를 써야 할 것처럼 보일 수 있다. **하지만 항상 그런 것은 아니다.**

**`REPEATABLE READ`가 유리한 경우도 있다.**
예를 들어, 사용자가 쇼핑몰에서 1,000원짜리 상품을 보고 결제를 진행한다고 상상해 보자. 만약 격리 수준이 `READ COMMITTED`라면, 사용자가 결제하는 그 짧은 순간에 운영자가 상품 가격을 1,500원으로 변경하고 커밋할 수 있다. 이 경우 사용자는 1,000원을 예상했지만 실제로는 1,500원이 결제되는 혼란스러운 상황을 겪게 된다.

반면, `REPEATABLE READ` 환경에서는 사용자의 결제 트랜잭션이 시작될 때 상품 가격(1,000원)이 스냅샷으로 저장된다. 중간에 가격이 1,500원으로 변경되더라도 사용자의 트랜잭션 내에서는 일관되게 1,000원으로 처리되어 예측 가능한 경험을 제공한다.

결국 정답은 없다.
격리 수준의 선택은 '데이터의 정합성'과 **'트랜잭션 내의 일관성(논리적 정합성)'** 사이의 트레이드오프이다.

- `READ COMMITTED`: 다른 트랜잭션의 변경 사항을 빠르게 반영해야 하는 금융 정보 조회 등 **데이터 정합성(최신 데이터 반영)**이 중요할 때 유리하다. (ex: 계좌 잔액)
- `REPEATABLE READ`: 하나의 비즈니스 로직이 진행되는 동안 데이터의 일관성을 유지하는 것이 더 중요할 때 유리하다. (ex: 결제 시점의 상품 가격, 재고 수량 등)

따라서 개발자는 RDBMS(Oracle, MySQL 등)별 기본 격리 수준을 인지하고, 서비스의 비즈니스 정책과 요구사항을 면밀히 분석하여 각 트랜잭션에 가장 적합한 격리 수준을 적용해야 한다.

## 예상 질문

* 트랜잭션 격리 수준이 필요한 이유는 무엇일까요?

* 트랜잭션 격리 수준에 대해 설명해 주세요.

* 트랜잭션 격리 수준에 따라 발생하는 현상에 대해 설명해 주세요.

## Reference

* 면접을 위한 CS 전공지식 노트

* [[DB] 트랜잭션과 격리성](https://sabarada.tistory.com/117)

* [트랜잭션 고립화 레벨](https://goodgid.github.io/Transaction-Isolation-Level/)

* [트랜잭션 격리 수준](https://gyoogle.dev/blog/computer-science/data-base/Transaction%20Isolation%20Level.html)

* [트랜잭션 - Isolation level(격리 수준)과 이상 현상](https://github.com/devfancy/2023-CS-Study/blob/main/DB/db_transaction_isolation_level.md)

* [[네이버페이] 실무에서 만나는 DB isolation level](https://medium.com/naverfinancial/%EC%8B%A4%EB%AC%B4%EC%97%90%EC%84%9C-%EB%A7%8C%EB%82%98%EB%8A%94-db-isolation-level-e94a904bbf9d)
