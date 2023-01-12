---
layout: post
title:  " Git 이란? "
categories: Git
author: fancy96
---
* content
{:toc}


## Git 과 Github는 무엇인가 ?

### Distributed Version Control - 분산시스템

* 모든 개발자들이 동일한 히스토리 정보를 가지고 있다.

* 서버에 문제가 생기거나, 다운이 되어도 각각의 개발자들이 동일한  히스토리를 가지고 있기 때문에

* 서로의 정보를 이용해서 서버를 보관하고 계속 일을 이어나갈 수 있다.

* 인터넷이 없어도 오프라인에서 일을 진행할 수 있는 장점이 있다.

* **클라우드 서버** - Github, Bitbucket
  
  * 그 중 github가 가장 대중적으로 널리 알려져 있음.

### Git 배경 및 특징

* Git 을 만든 사람은 리눅스 커널의 창시자인 Trovalds가 만듦

* Git은 프로젝트의 전체적인 내용을 스냅샷해서 가지고 있다.
  
  * 버전들 사이를 자유자재로 이동이 가능하고, branch들 사이에서 이동이 빠르고 오류가 없다.
  
  * 각각의 스냅샷은 그렇게 무겁지 않다.

### Git 사용하는 이유

* most commonly used

* free

* open source

* lightning fast

* work offline

* undo mistakes

* easy and fast branching / merging ⇒ 협엽을 효율적으로 할 수 있다.

---

## Git의 중요한 컨셉 이해하기

### Git Workflow - 3가지 작업환경

* working directory - 우리가 프로젝트의 파일들을 수정하고 작업하고 있는 환경

  * untracked  - 새로 만들어진 파일이거나, 아직 트랙킹 하지 않는 파일
  
  * tracked - Git이 이미 알고 있는, Git이 트랙킹하고 있는 파일
  
    * unmodified - 이전 버전과 비교해서 수정되지 않은 파일
    
    * modified - 오직 수정이 된 파일만 `staging area`로 옮길 수 있다.

* staging area - 어느 정도 작업하다가 버전의 히스토리에 저장할 준비가 되어있는 파일들을 옮겨놓은 환경 ( commit 명령어를 이용해서 .git directory로 옮긴다)

* git directory - 버전의 히스토리를 가지고 있는 환경 (== .git repository)

  * git directory에 저장된 버전들은 checkout이라는 명령어를 이용해서 언제든지 원하는 버전으로 다시 돌아갈 수 있다.

  * **push**라는 명령어를 이용해서 나의 git directory를 서버에 업로드를 해둘 수 있다.

  * 그리고 서버에서 다시 로컬로 다운로드 받고 싶을 때는 **pull**이라는 명령어를 이용할 수 있다.

![](/assets/img/git/Git_Workflow_1.png)

---

### 로컬 파일들 추가하기 - add - 예시)

![](/assets/img/git/Git_Workflow_2.png)

* git add * → 디렉토리에 있는 모든 파일들 Staging area로 옮겨진다.

* 여기서 rm a.txt → a.txt 파일이 삭제되었다면,

* 그다음 git add * → git status하면 삭제된 a 파일은 Staging area에  추가되지 않은 것을 확인해 볼 수 있다.

![](/assets/img/git/Git_Workflow_3.png)

* 이럴 경우, git add . ⇒ 모든 파일들을 포함해서 Staging area에 추가되는 것을 볼 수 있다.

![](/assets/img/git/Git_Workflow_4.png)

---

### 커밋할 때 팁

![](/assets/img/git/Git_Workflow_5.png)

커밋할 때 주의사항

* 커밋메세지에 맞게 해당 내용만 커밋하는 것이 중요하다.

* 커밋 너무 커도, 작은 단위로 하면 의미가 없다. 의미있는 단위로 하는 것이  좋다.

---

### 태그

* 태그는 왜 필요할까 ?
  
  * 내가 특정한 commit을 북마크 하고 싶을 때 `git tag` 이다.
  
  * 대부분 `sematic versioning 시스템`을 따라간다.

![](/assets/img/git/Git_Workflow_6.png)

* major 버전은 어떤 특정한 기능, 전체적인 업데이트한다.

* minor 버전은 커다란 기능 중에서 조금의 기능이 수정될 때 업데이트한다.

* fix 버전은 기존 기능에서 성능이 개선 , 오류 수정일 때 업데이트한다.

---

## Git - Branch

* Git에서 따로 지정을 하지 않는 이상 master branch가 지정이 된다.

* head는 최신 commit을 바라본다.

![](/assets/img/git/GIt-branch_1.png)

* 보통 master branch는 코드가 정확하게 검증된 제품에 포함이 되는 내용만 있다.

* 만약 새로운 A인 feature A를 개발한다고 한다면, feature A라는 branch를 만들어서 따로 커밋을 해나가는 것이 중요합니다.

![](/assets/img/git/GIt-branch_2.png)

![](/assets/img/git/GIt-branch_3.png)

* 이렇게 기능별로, 리팩토링 별로 하면 동시다발적으로 개발자가 할 수 있기 때문에 병렬적으로 작업한다는 장점이 있다.

---

## Woowacourse - Git 강의 내용 정리

### Quiz 1 - upstream, origin이 뭔말이지?

* 관계를 나타내주는 상대적인 개념

* upstream은 한개이다.

* 관계가 생성될 때, upstream, downstream이 존재하게 된다.

* 3개의 파트로 나눠져있다.

* git remote add origin https://github.com/~

  * 원격 저장소를 origin에 추가
  
  * remote: 원격으로 관리해주는 역할

* git push -u origin main
  
  * 해석) origin저장소에 main branch에 push 한다는 의미.
  
  * -u 의미: —set-upstream의 약자로, 위계질서를 성립해주기 위해서이다.

### Quiz 2 - add, commit, push 를 잘 쓰고 싶다.

* git “명령어” —help

  * 세부 설명이 나와있다.

### Quiz 3 - git의 객체가 아닌 것은?

* branch - 커밋에 대한 참조일 뿐, 객체가 아니다.

* git의 객체
  
  1. blob - 파일
  
  2. commit - 저장 단위, tree + blob + 메타 정보
  
  3. tree - blob을 묶어서 관리 (디렉토리 구조와 유사)
  
  4. tag - 커밋에 대한 참조이지만 설명이 추가되는 객체

* commit
  
  * 커밋  = 작업 디렉토리 스냅샷, 세이브 포인트

### Quiz 4 - 파일의 내용을 수정하고 커밋하면 Git은 공간 효율을 위해 변경사항만 저장한다?

* 변경사항만 저장하지 않고, 파일 전체를 저장한다.

---

## 참고

* 드림코딩 엘리 - Git 마스터과정

* 우아한테크코스 - Git 강의 