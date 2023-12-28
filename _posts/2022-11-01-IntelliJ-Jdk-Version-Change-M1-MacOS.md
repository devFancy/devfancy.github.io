---
layout: post
title:  " IntelliJ JDK 버전 바꾸기(m1 macOS) "
categories: IntelliJ
author: devfancy
---
* content
{:toc}

* 기존에 나는 터미널에서 "java -version" 입력했을 때, JDK 버전이 18이였다.

* 하지만, 11로 바꿔야 하는 방법을 몰라서 여러 구글링과 커뮤니티의 도움을 받아 해결했다.

* 어떻게 JDK 버전을 18 -> 11로 해결하게 됐는지 정리한다.

---

**Java IDE인 IntellJ에서 JDK버전을 바꾸는 방법(m1 macOS 전용)**

1. IntelliJ에서 JDK버전 바꾸기
2. 원하는 JDK버전이 없으면 다운로드 받기
3. 터미널에서 환경변수 설정하기

---
### 1. IntelliJ에서 JDK버전 바꾸기


![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_1.png)

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_2.png)

* IntelliJ환경에서 File -> Project Structure 클릭한다.

* Project Settings - Project - SDK에서 해당 version 11 클릭한다.
  (해당 version이 없는 경우 2번으로 이동한다)


---
### 2. 원하는 JDK버전이 없으면 다운로드 받기

* 아래 링크 접속

* https://www.azul.com/

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_3.png)

* 우측에 있는 "Download Now" 클릭한다.

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_3_2.png)

* 밑에 내려가다보면 이런 화면이 보이게 된다.

* 왼쪽 "Java Version"에 11버전을 선택한다.

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_4.png)

* 11 버전과 macOS, ARM 프로세스를 확인 후 다운로드를 한다.

* **m1 macOS는 ARM 프로세스를 선택해야 한다.**
* 해당 부분 다운로드 후 실행시킵니다.

---
### 3. 터미널에서 환경변수 설정하기

**1) JDK 설치 경로 이동**

* 다시 본인의 IntelliJ 환경으로 넘어온다.

* 해당 터미널을 켠 후, JDK 설치 경로로 이동한다.

```
cd /Library/Java/JavaVirtualMachines/
```


**2) JDK 폴더명 확인 후 경로 복사**

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_5.png)

* ls로 다운로드된 JDK 폴더명이 있는지 확인한다.

```
/Library/Java/JavaVirtualMachines/{zdk폴더명}/Contents/Home
```
* 예시) /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home


**3) bash_profile 편집**
```
vi ~/.bash_profile
```

위 명령어를 입력하면 bash_profile 파일을 편집할 수 있다.


**vi 명령어 정리**
편집모드: i
편집한 모드 끝내기: esc
저장후 나가기: wq
(저장하지 않은 채, 강제로 나가기: q!)

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_6.png)

* 위와 같이 수정한다.

* JAVA_HOME 경로는 위에서 복사한 경로를 써준다.

* PATH는 위 사진대로 수정한다.

**4) zshrc 편집**

```
vi ~/.zshrc
```

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_7.png)

* 위에 있는 export 두줄을 추가해준다.
* 그리고 저장 후 나간다.(wq)

**5) 환경변수 설정 변경 반영**

```
source ~/.bash_profile
source ~/.zshrc
```
* 환경변수 설정에 대해 변경했던 부분들을 반영한다.

---


**Java 버전 확인**

```
java -version
```

* 터미널에 위에 명령어를 입력한다.

![](/assets/img/intellij/IntelliJ-Jdk-Version-Change-M1-MacOS_8.png)

* 그럼 다음과 같이 version이 11로 바뀌는 것을 볼 수 있다.

* **1번(IntelliJ에서 JDK버전 바꾸기)으로 이동해서 원하는 버전으로 바꿔주면 끝!**

* IntelliJ 환경에서 JDK 버전을 변경하는 방법을 배웠다.
