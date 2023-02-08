---
layout: post
title:  " [Git] 다른 사람 혹은 나의 repository에 있는 branch 복사하는 방법 "
categories: Git
author: fancy96
---
* content
{:toc}

## Motivation

* 우아한테크코스 프리코스 미션들을 복습하고 있었다.

* 그러던 와중에, 해당 미션들을 저장하는 branch를 실수로 `main`에 저장하고 있었다.

* 그래서 이전에 만든 repository 기존 branch을 새로운 repository(저장소)를 만들어서 새 branch에 가져오기(복사하기)로 했다.

* 즉, **old repository의 branch -> new repository의 branch로 복사**하는 것이다.

* (기존 branch `main` -> 새 branch`fancy-log2`으로 복사하기)

## Assumption(가정)

* 기존 repository명을 `old-java-bridge-review`이고, branch명은 `main`이다.

* 새로운 repository명을 `new-java-bridge-review`이고, 새 branch명은 `fancy-log2`이다.

* 나는 내 기존 repository에 있는 branch를 가져오는 걸로 했다. (상대방 repository에서 가져오는 방식도 같다)

* 나는 IntelliJ에서 제공하는 terminal에서 작업했다.

  * repository명 : new-java-bridge-review

* **기존 branch를 복사하기 위해서는 새 branch(fancy-log2)에서 작업해야 한다.**

* 따라서, 새 branch인 `fancy-log2`를 먼저 추가해준다.

### local(로컬) branch 추가

* 상대방(혹은 나)의 repository에 있는 기존 branch를 저장하는 새 branch를 추가한다.

* 나는`new-java-bridge-review` repository에서 새 branch명 `fancy-log2`를 만든다.

```
git checkout -b [새 브랜치명] 
```

![](/assets/img/git/Git-My-Repository-Branch-Copy_0.png)

* 위의 코드를 해석하면, 

* 새로운 branch를 만들고 나서 동시에 새로운 branch에 이동이 된다는 의미다.

## branch 복사하기

### 1. 상대방(혹은 나의) git repository 주소 복사하기

![](/assets/img/git/Git-My-Repository-Branch-Copy_1.png)

### 2. remote 추가

* terminal에서 상대방(혹은 나)의 git repository 링크를 저장하기 위해 새 remote명에 추가한다.

`깃 레포지토리 링크` -> `리모트명` 에 저장

```
git remote add <리모트명> <깃 레포지토리 링크>
```

> git remote add fancy-log2-remote http://github.com/fancy-log/old-java-bridge-review.git

* IntelliJ 하단에 있는는 `Git`을 클릭하면 위와 같이 remote명 `fancy-log2-remote`가 추가된 것을 볼 수 있다.

![](/assets/img/git/Git-My-Repository-Branch-Copy_3.png)

### 3. 가져오고자 하는 브랜치 pull

```
git pull <remote명> <remote의 branch명>
```

![](/assets/img/git/Git-My-Repository-Branch-Copy_4.png)

* 위의 코드를 해석하면,

* 2번에서 git repository 링크를 저장한

* 리모트명에 있는 branch(main)를 `new-java-bridge-review` repository의 branch `fancy-log2`에 저장한다는 의미이다.

* 그러면 **기존 repository 있던 branch(main) 안에 있는 코드와 히스토리가 새 repository branch(fancy-log2)에 복사**된다.

* **[추가 설명]**

* git pull 을 해주면 현재 사용하고 있는 branch(fancy-log2) 에 remote 되어 있는 특정 branch를 pull 해오게 된다.

![](/assets/img/git/Git-My-Repository-Branch-Copy_5.png)

* git pull을 해주면 다음과 같이 실행이 된다.

## 결과

![](/assets/img/git/Git-My-Repository-Branch-Copy_6.png)

* 그리고 IntelliJ 하단 `Git`을 클릭하고 해당 branch `fancy-log2`를 클릭하면 커밋 내용과 코드가 복사되었다는 것을 확인할 수 있다.
