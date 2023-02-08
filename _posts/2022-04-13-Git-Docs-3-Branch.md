---
layout: post
title:  " [Git 공식문서 & Git 마스터과정] Git 브랜치 정리하기 "
categories: Git
author: fancy96
---
* content
{:toc}

> 이 글은 Git 공식 문서를 통해 Git 브랜치에 대해 배운 것을 정리한 내용입니다.

* 개발을 하다 보면 코드를 여러 개로 복사해야 하는 일이 생기거나 팀 프로젝트에서 개인이 독립적으로 개발을 진행할 때 필요한 것이 `브랜치`다.

* Git은 브랜치를 만들어 작업하고 나중에 Merge 하는 방법을 권장한다.

## 브랜치란 무엇인가

* Git의 브랜치는 커밋 사이를 가볍게 이동할 수 있는 어떤 포인터 같은 것이다.

* 기본적으로 Git은 `master` (현재는 `main`)을 만든다.

* 처음 커밋하면 이 `master` 브랜치가 생성된 커밋을 가리킨다. 이후 커밋을 만들면 `master` 브랜치는 자동으로 가장 마지막 커밋을 가리킨다.

![](/assets/img/git/git-docs-branch-1.png)

### 새 브랜치 생성하기

* 브랜치를 하나 새로 만들면 어떻게 될까?

* `git branch` 명령어로 `testing` 브랜치를 만든다.

```text
$ git branch testing
```

![](/assets/img/git/git-docs-branch-2.png)

* Git은 `HEAD`라는 특수한 포인터가 있는데, 이 포인터는 지금 작업하는 로컬 브랜치를 가리킨다.

![](/assets/img/git/git-docs-branch-3.png)

* 브랜치를 새로 만들었지만, 아직 Git은 `master` 브랜치를 가리키고 있다.

* `git log` 명령에 `--decorate` 옵션을 사용하면 쉽게 브랜치가 **어떤 커밋을 가리키는지** 확인할 수 있다.

```bash
git log --oneline --decorate
f30ab (HEAD -> master, testing) add feature #32 - ability to add new formats to the central interface
34ac2 Fixed bug #1328 - stack overflow under certain conditions
98ca9 The initial commit of my project
```

* 현재 작업중인 브랜치를 가리키는 HEAD가  `f30ab (HEAD -> master, testing)` 통해 `master` 브랜치를 가리키고 있는 것을 확인할 수 있다.

### 브랜치 이동하기

* `git checkout` 명령으로 현재 브랜치에서 다른 브랜치로 이동할 수 있다.

* 현재 `master` 브랜치에서 새로 만든 `testing` 브랜치로 이동하는 명령어는 다음과 같다.

```bash
git checkout testing
```

![](/assets/img/git/git-docs-branch-4.png)

* 이렇게 하면 HEAD는 `testing` 브랜치를 가리키는 것을 확인 할 수 있다.

* 만약 다시 `master` 브랜치로 이동하고 싶으면, `git checkout` 명령을 사용하면 된다.

* 현재 브랜치가 가리키고 있는 히스토리가 무엇이고, 어떻게 갈라져 나왔는지 확인하려면 `git log` 명령를 입력하면 된다.

* `git log --oneline --decorate --graph --all ` 입력하면 히스토리를 출력한다.

```bash
git log --oneline --decorate --graph --all
* c2b9e (HEAD, master) made other changes
| * 87ab2 (testing) made a change
|/
* f30ab add feature #32 - ability to add new formats to the
* 34ac2 fixed bug #1328 - stack overflow under certain conditions
* 98ca9 initial commit of my project
```

---

> 아래의 글은 Git 마스터 과정에서 배운 것을 정리한 내용입니다.

## Branch

### Creating branch

* `git hist`를 통해 **branch에 대한 현재 상태를 확인**할 수 있다.

* `checkout`을 하게 되면 원하는 버전으로 갈 수 있고, 원하는 branch로도 이동이 가능하다.

* **내가 원하는 branch로 이동하고 싶다면** `checkout`, `switch` 둘 중 하나 선택해서 하면 된다.

```bash
git branch testing #create a new branch called testing
	# 새로운 "testing"이라는 branch를 만든다.
git checkout testing #switches to testing branch
	# testing branch로 이동하게 된다.
git checkout [hashcode]
	# checkout 뒤에 hashcode를 입력하게 되면 해당 commit으로 이동하게 된다.
	# 그리고 git hist를 통해 확인하면, (HEAD)가 최신 commit이 아니라,
	# 방금 checkout한 commit을 가리키게 된다.
git switch testing #same as the above
	# 다른 branch 로 이동할 때 switch를 사용한다.
git checkout -b testing #create and switch to testing 
	# 새로운 branch를 만들고 나서 동시에 새로운 branch에 이동이 된다.
	# 밑의 git switch -C testing 과 같은 의미이다.
git switch -C testing #same as the above
	# 새로운 branch를 만들고 나서 동시에 새로운 branch에 이동이 된다.
	# ex) git switch -C new-branch : new-branch로 만들고 나서, new-branch로 이동하게 된다.
```

### Managing Branch

```bash
git branch #simple listing of all branches 
	#내 컴퓨터안의 branch들을 보여준다.
git branch -r #sees the remote branches
git branch --all #list including remote branches
	# 서버에 있는 branch들의 모든 정보를 보여준다. Gitbub와 같은 서버
git branch -v #sees the last commit on each branch
	# 간단하게 최신 commit들을 확인할 수 있다.
git branch --merged #sees merged branches
	# 현재 merged된 branch들을 확인할 수 있다.
git branch --no-merged #sees not merged branches
	# master branch에서 merge되지 않은, 즉 master branch에서 파생된 
	# 다른 변경사항, 다른 commit 있는 것을 보여준다.
git branch -d testing #deletes the branch
	# testing이라는 branch를 삭제할 때 옵션 -d를 쓰면 된다.
git push origin --delete testing
	# 원격에 있는 곳에도 삭제를 원할 시 사용한다.
git branch --move wrong correct #rename
	# 이름을 correct로 변경하고 싶을 때
git push --set-upstream origin correct #push new name
	# 원격에 업데이트 하고 싶을 때
	# 원격에 correct라는 이름으로 업데이트 하고 싶을 때
```

### Comparing

```bash
git log branch1..branch2 #all the commits between branch1 and branch2
	# branch1와 branch2 사이 commit을 확인하고 싶을 때 git log를 사용한다.
git diff branch1..branch2 #all the changes between branch1 and branch2
	# 마찬가지로 코드를 확인하고 싶을 때 git diff를 사용한다.
```

## Reference

* [git 공식문서](https://git-scm.com/book/en/v2)

* [Dream Coding - Git 마스터 과정](https://academy.dream-coding.com/courses/git)