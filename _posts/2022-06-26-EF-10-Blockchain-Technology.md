---
layout: post
title: " 10. Blockchain Technology "
categories: Electronic-Finance
author: devfancy
---
* content
{:toc}

> 이 카테고리는 경영학부 전자금융의 이해 수업을 듣고 정리한 내용을 바탕으로 글을 작성하였습니다.


### What is Common to Blockchain Technologies?

* Blockchain Technologies 특징 4가지
  
  * [1] 데이터의 변경내용을 기록하는 데이터 저장소이다.
    
  * [2] 여러 시스템에 걸쳐 데이터 저장소를 실시간으로 복제한다.
    
  * [3] Peer-to-peer 방식으로 네트워크안에 있는 노드들이 줄변에 알려준다.
    
  * [4] 소유권 및 신뢰성을 증명하기 위한 디지털 서명 및 참조용 해쉬를 사용하는 cryptographic method 이다.


* Blockchain vs Database 차이
  
  * Database는 단순히 데이터를 저장하고 보관한다.
    
  * Blockchain은 주변 노드들과 연결이 되어 있고, 각자 자기 역할이 있다.
    
  * 그리고 네트워크 통신을 하면서 주변에 새로운 transaction이 발생하면, 주변에 알리고 정해진 rule에 의해 새로운 transaction에 직접 검증하는 프로세스이다.

![](/assets/img/ef/ef-10-blockchain-technology.png){: width="500"}


### Public Blockchain

* `Public (permissionless) blockchain`
  
  * 누구나 관리당국의 허가없이  block을 만들 거나 bookkeeper가 될 수 있다.
  
  * 누구나 다 자연스럽게 자금을 받기 위한address를 생성할 수 있고 자금을 보내기 위한 transaction을 만들 수 있다

* `Private instance of public blockchain`
  
  * Private network에서 블록체인 소프트웨어를 실행해 새로운 ledger을 만들 수 있다.
    
  * 각 네트워크의 노드는 그들 자신의(자체) 블록체인에 보이는 것만 검증 할 수 있다.
    
  * Private하게 활용하는 코인은 main net 에 있는 코인과 서로 호환되지 않는다.

### Private Blockchain

* `Permissioned (permissionable) blockchain`
  
  * 미리 허가된 사람들만 참가할 수 있는 블록체인
    
  * 보상이 있는 토큰이 존재하지 않으며, 비즈니스 목적으로 만든 것이다.
    
  * 믿을 수 있는 상태에서 데이터들이 block에 저장되는 것이 중요하다.

### What Are Blockchains Good for?

* Public blockchains → **투자 목적**
  
  * Speculation
    
  * Darknet markets (익명성 보장)
    
  * Cross border payments (국경 간 이체)
    
  * Initial coin offerings (초기 자금 조달)

* Private blockchains → **비즈니스 목적**
      
  * Bussiness-business communication
  
  * Duplicated data, processes, and reconciliation

## Reference

* [The Basics of Bitcoins and Blockchains](https://www.amazon.com/Basics-Bitcoins-Blockchains-Introduction-Cryptocurrencies/dp/1633538001)

  * An Introduction to Cryptocurrencies and the Technology that Powers Them , Antony Lewis, 2018, Mango

* [Blockchain and Distributed Ledgers](https://www.amazon.com/Blockchain-Distributed-Ledgers-Alexander-Lipton/dp/9811221510)

    * Mathematics, Technology, and Economics, Alexander Lipton and Adrien Treccani, 2022, World Scientific Publishing

