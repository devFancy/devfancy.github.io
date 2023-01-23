---
layout: post
title: " 06. Digital Money "
categories: Electronic-Finance
author: fancy96
---
* content
{:toc}

> 이 카테고리는 경영학부 전자금융의 이해 수업을 듣고 정리한 내용을 바탕으로 글을 작성하였습니다.

### How Are Interbank Payments Made?

* Digital assets are easy to copy.
  
  * 수신자들은 그것이 독특한지 구별할 수 없기 때문에 그것을 가치 있게 여기지 않을 것이다 ⇒ 가치 불분명
    
  * 수신자에게 보낸 후 삭제할지 확신할 수 없습니다 ⇒ 불확신
    
  * 수신자는 파일의 복사본을 다른 사람에게 보냈는지 알 수 없습니다.

* **Double spend problem**
  
  * KOR) 디지털 화폐가 쉽게 중복되지(duplicated)않도록 보장하는 것의 어려움을 설명한다.
    
  * ENG) describes the difficulty of ensuring digital money is not easily duplicated.


## How are Payments Made?

### 1. Same bank ⇒ 같은 은행

* 상황) Alice가 Bob에게 $10 을 보내는 경우

* 조건)Alice와 Bob은 Bank에게  $100을 예금한 상태이다.

* 결과) Alice는 $90이 남았고, Bob은 $110이 남아있다. 그리고 은행의 부채는 $200달러로 Before/After 동일하다.

### 2. Different banks ⇒ 다른 은행

* 상황) Alice가 Bob에게 $10 을 보내는 경우

* 조건) Alice는 Bank A에 $100 을 예금하였고, Bob은 Bank B에게  $100을 예금한 상태이다.

* 결과) Alice는 $90이 남았고, Bob은 $110이 남아있다. 그리고 Bank A의 부채는 $90 이고, Back B의 부채는 $110 이다. 전/후가 다르다.

* Problem
  
  * Bank A now owes Alice $10 less than before and so it is better off. ⇒ 채무가 줄어듦
    
  * Bank B now owes Bob $10 more and so is worse off. ⇒ 채무가 늘어남

* Solution
  
  * Bank A needs to pay Bank B $10 to balance out the customer account movements and complete the end to end payment.
    
  * Bank A could put a bunch of banknotes in a van and send them to Bank B.
    
  * Bank A owes Alice $10 less but pays $10 in banknotes to Bank B.
    
  * Bank B owes Bob $10 more but receives $10 in banknotes from Bank A.

* Digital solutions
  
  * Two main ways a bank can digitally pay another bank
    
    [1] using **correspondent bank accounts**

    [2] using **a central bank payment**

#### Correspondent Bank Accounts

* `Correspondent Bank` : a financial institution that acts as an agent on behalf of other financial institutions

* 다른 은행에 새로운 계좌를 만들때 (기존의 작은 은행보다 더 큰 은행을 만드는 경우) ⇒ `Coreespondent Bank`를 쓴다.

* **The problem** with correspondent bank accounts
  
  * 굉장히 많은 correspondent bank account 개설을 해야한다.
    
  * 기회비용이 많이 발생한다 ( =expensive, risky)

  * **Solution** → `Central Bank Account`

#### Central Bank Account

* A central bank enables banks in its jurisdiction to pay each other without each of them having to maintain accounts with one another. (서로 계정을 유지할 필요가 없다)
  
  * The central bank acts as a bank for the banks in its currency zone.
    
  * Money held at the central bank is called “reserves”.

* Central Bank Account 종류 - DNS, RTGS

* **Deferred Net Settlement (DNS) Systems**
  
  * Bank들 사이에 발생하는 payment 주문들을 줄을 세워 놓고, 하루중 특별한 시점에 결제를 실행시키는 시스템이다.
    
  * “netted off” - 비용을 제외하고 순수하게 남은 것
    
    * 장점 - Capital efficiency (자본활용의 효율성) - 순수하게 남은것만 주고 받기 때문에 많은 자본을 확보할 필요가 없다.
    
    * 단점 - Credit risk(신용 위험) - 누적된 것을 쌓아서 나중에 한번에 결제를 하기 때문에, 만약 예측불가능한 상황이 생긴다면 그것에 대해서 대응하기 어려울 수 있다.

* **Real Time Gross Settlement (RTGS) Systems**
  
  * 고객이 결제를 할때마다 실시간으로 거래가 이루어지는 시스템이다.
    
  * Each payment instruction is settled independently and not grouped, batched, or netted off against any other instructions. ⇒ 각각의 거래가 독립적으로 이루어진다.
    
  * 장점 - Less capital risk - 실시간으로 이루어지기 때문에 앞으로 발생할 현금흐름에 대한 불확실성이 낮다.

  * 단점- Capital inefficiency - 많은 자금을 보유해야 하므로 자본효율성이 낮다.

* **Central clearing counterparty (CCP)** ⇒ “Clearing Bank”
  
  * It acts as the legal trading counterparty.
    
  * Suppose A buys shares from B ⇒ A와 B가 서로 못믿기 때문에,  가운에 “CCP”를 두어서 거래를 하는 구조이다.

### 3. Cross border (same currency) ⇒ 국경간의 이체

#### International Payments

* Two main types
  
  * [1] the payment of **a single currency** across a border
  
  * [2] the transfer of value across borders, with **foreign exchange**, where the sender and the receiver are working in **different currency**

1. Single Currency Transfer Across a Border
2. Sending GBP from UK to Singapore

### 4. Foreign exchange ⇒ 환전하는 경우

* Money does not simply become other money.
  
  * 화폐가 바뀌는 것이 아니라 교환하는 것이다.

* Suppose Alice wants to send GBP from her sterling account for it to arrive as USD in Bob’s US dollar account.
  
  * **Three options** : GBP(pound) → US dollar
  
  * [1] 보내는 쪽에서 환전하는 경우 (파운드→달러로 환전후 보낸다)
  
  * [2] 받는쪽에서 환전하는 경우(파운드로 받은 다음 달러로 환전한다)
    
  * [3] 제 3자가 개입(Alice의 파운드를 받아서  달러로 환전한 뒤, Bob에게 보낸다)


* Option 1 : Alice’s (sending) bank does the FX by deducting pounds from Alice and creating Bob with their dollars.

* Option 2 : Bob’s (receiving) bank does the FX by receiving pounds and crediting Bob with dollars.

* Option 3 : Third party (e.g., Transferwise) does the FX by receiving Alice’s pounds and sending their dollars to Bob.


## Reference

* [The Future of Finance](https://link.springer.com/book/10.1007/978-3-030-14533-0)

    * The Impact of Fintech, AI, and Crypto on Financial Services, Henry Arslanian and Fabrice Fischer, 2019, Springer
