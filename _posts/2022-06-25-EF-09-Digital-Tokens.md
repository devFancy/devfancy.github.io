---
layout: post
title: " 09. Digital Tokens "
categories: Electronic-Finance
author: devfancy
---
* content
{:toc}

> 이 카테고리는 경영학부 전자금융의 이해 수업을 듣고 정리한 내용을 바탕으로 글을 작성하였습니다.

### What Are Digital Tokens?

* `Digital token` : 자산의 가치를 대변하거나 특별한 사용을 의미하며 자체 블록체인에 상주하는 암호화폐의 유형이다

![](/assets/img/ef/ef-09-digital-tokens_1.png)

### Types of Tokens

* `Native blockchain tokens` : block-creators 에게 보상해주는 토큰
  
* `Asset backed tokens` : 믿을만한 관리인이 신탁한 일부 실물 자산에 대한 소유권을 나타낸다.
  
* `Utility tokens` : 토큰의 issuer에 의해 제공된 서비스를 이용할 수 있다.


### Native Blockchain Tokens

* Native blockchain tokens 특징

  * They are created by the same blockchain software that keeps track of ownership of these units.
    
  * No asset backs the value of native tokens.
    
  * Also known as intrinsic tokens or built-in tokens.

### Examples of Native Tokens

#### Ripple

* `Ripple` : Ripple is a money transfer network designed to serve the needs of the financial services industry.
  
* 목적 : Swift 기능을 대체하기 위해 만들어짐
  
* 특이점 : 이용자들이 네트워크를 이용해 거래를 할 때마다 네트워크는 소량의 XRP를 소각한다.

#### XRP

* `XRP` : XRP is a cryptocurrency that runs on the XRP Ledger.

* **Centralized consensus protocol** 로써, XRP는 proof-of-work 에 의존하지 않고, 인정받는 노드들의 리스트를 유지한다.
  
* 안전하고 효율적인 검증 프로세스로써 3-5초 사이로 검증하며 문제가 생기면 멈추고 재검증하는 절차가 들어간다.

* XRP was **pre-mined**
  
  * 가치를 유지하기 위해 유통되고 있는 것의 일부를 소유하며 기간적으로 유통시킨다.
    
  * cryptocurrency 성장에 도움을 준 사람들에게 보상을 해준다.

### Pros and Cons of Ripple

* 장점

  * 검증이 (4-5초) 빠르며, 굉장히 저렴한 거래 수수료(0.000001 XRP)를 가짐
    
  * 법정화폐와 암호화폐에 사용될 수 있는 다목적 교환 네트워크임
    
  * 큰 금융기관에 활용됨

* 단점
  
  * 중앙화되어 있으며, 이미 크게 pre-mined 했음
    
  * SEC가 XRP에 소송을 걸었음

### Asset Backed Tokens

* `Asset backed tokens` : 실물 자산에 대한 디지털화된 문서로 자산이 보증이 된다.
  
  * [1] `Depository receipt tokens` : 기초자산에 대해 소유권을 주장할 수 있다.
    
    * 특징 1) 관리자에 의해 기초자산의 소유권을 나타낸다.
    
    * 특징 2) 토큰을 redeem하고 싶을때, 토큰을 가지고 발행인에게 가서 기초 자산을 청구할 수 있다.

  * [2] `Title tokens` : 자산의 소유권 증명을 나타내는 디지털 문서

  * [3] `Contract tokens` : 토큰 발행자와 토큰 소지자 간의 계약상 의무를 나타내는 토큰

### How Do Asset Backed Digital Tokens Work?

* **Excel spreadsheet 보다 `Goldchain` 을 사용하는 이유**
  
  * 블록체인을 사용하면 여러 노드들의 감시가 있기 때문에 사기를 치기 어렵다.
    
  * 새로운 소프트웨어, 하드웨어가 개발됨에 따라 조금 더 효율적으로 토큰의 거래, 이동을 시킬 수 있다.
    
  * peer-to-peer 시스템에서 중간에 토큰을 발행하고 보관하는 회사가 개입하지 않아도 거래가 가능하다.

### Utility Tokens

* `Utility tokens` :  어떤 토큰에 대해서 토큰을 갖고 있는 주주들이 회사가 제공하는 smart contract 형태와 같은, 회사가 약속한 제품 또는 서비스를 받을 수 있다.
  
  * 발행 회사에게 청구권을 나타낼 수 있다.
    
  * 제품 또는 서비스에 대해 토큰을 사용할 수 있다.


## Reference

* [The Future of Finance](https://link.springer.com/book/10.1007/978-3-030-14533-0)

  * The Impact of Fintech, AI, and Crypto on Financial Services, Henry Arslanian and Fabrice Fischer, 2019, Springer

* [The Basics of Bitcoins and Blockchains](https://www.amazon.com/Basics-Bitcoins-Blockchains-Introduction-Cryptocurrencies/dp/1633538001)

  * An Introduction to Cryptocurrencies and the Technology that Powers Them , Antony Lewis, 2018, Mango

* [Blockchain and Distributed Ledgers](https://www.amazon.com/Blockchain-Distributed-Ledgers-Alexander-Lipton/dp/9811221510)

  * Mathematics, Technology, and Economics, Alexander Lipton and Adrien Treccani, 2022, World Scientific Publishing

