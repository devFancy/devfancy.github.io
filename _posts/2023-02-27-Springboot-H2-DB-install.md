---
layout: post
title: " [SpringBoot] H2 데이터베이스 설치 "
categories: SpringBoot
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 [실전! 스프링 부트와 JPA 활용 1] 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

* `H2` DB를 사용하는 이유 : 개발이나 테스트 용도로 가볍고 편리한 DB, 웹 화면 제공하기 때문.

* [1] H2 데이터베이스 1.4.199 다운로드를 받은 후, 압축을 푼다. (압축푼 폴더명 : h2)

* [2] 터미널을 열고 해당 폴더(h2) -> bin으로 이동한다.(cd bin) -> `ll`로 h2.sh가 있는지 확인한다.

* [3] `cat h2.sh` -> java 언어이기 때문에 java 언어로 미리 다운받아있어야 한다.

* 사전에 **brew + java11**이 설치되어 있어야 한다. 

    * [3-1] [adoptopenjdk/openjdk](https://github.com/AdoptOpenJDK/homebrew-openjdk) 추가 : `brew tap adoptopenjdk/openjdk`
  
    * [3-2] 설치 가능한 모든 JDK 찾기 : `brew search jdk`

    * [3-3] java 11버전 [설치](https://formulae.brew.sh/cask/adoptopenjdk#default) : `brew install --cask adoptopenjdk11`

    * [3-4] 자바가 설치된 곳 확인 : `/usr/libexec/java_home -V`

    * [3-5] 자바 버전 확인 : `java --version`

* [4] 실행 : `./h2` -> [5], [6]

    * 만약 `-bash: ./h2.sh: Permission denied` 문제가 발생하는 경우, `chmod 755 h2.sh` 입력후 엔터친 다음에 다시 `./h2.sh`를 입력한다.

    * cf) 실행 취소 명령어 : `control + c`

* [5] DB 파일 생성 방법 : 세션키 유지한 상태로, JDBC URL에 해당 `jdbc:h2:~/jpashop` 입력후 `연결`버튼을 클릭한다. 그러면 /jpashop이라는 DB 파일이 생성된다. 

![](/assets/img/springboot/springboot-h2-db-install-1.png)

* [6] 생성된 이후에는 JDBC URL에 네트워크 모드로(TCP/IP를 통해) 접근하기 위해 `jdbc:h2:tcp://localhost/~/jpashop` 입력후 `연결`버튼을 클릭한다.

![](/assets/img/springboot/springboot-h2-db-install-2.png)

* [7] 이렇게 해서 DB 설치가 완료된 것을 확인할 수 있다. (http://localhost:8082/~)

![](/assets/img/springboot/springboot-h2-db-install-3.png)

## Reference

* [실전! 스프링 부트와 JPA 활용 1](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1/)

* [Mac에서 brew로 java 설치(feat. java version 바꾸는 방법)](https://llighter.github.io/install-java-on-mac/)