---
layout: post
title:  " [Git 공식문서 & Git 마스터과정] Git 기초 "
categories: Git
author: devfancy
---
* content
{:toc}

> 아래의 글은 Git 공식 문서를 통해 배운 것을 정리한 내용입니다.

## Git 저장소 만들기

* 주로 다음 두 가지 중 한 가지 방법으로 Git 레포지토리를 쓰기 시작한다.

1. 로컬 디렉토리 하나를 선택해서 Git 레포지토리를 적용하는 방법.

2. 다른 어딘가에서 Git 저장소를 **Clone** 하는 방법.

### 로컬 디렉토리를 Git 저장소로 만들기

* 우선 기존 프로젝트를 Git으로 관리하고 싶은 경우 해당 프로젝트가 있는 디렉토리로 이동하고 명령어를 입력한다.

* Mac 기준 명령어는 다음과 같다.

```bash
cd /Users/user/my_project
```

* 그리고 아래와 같은 명령어를 실행한다.

```bash
git init
```

* `git init` 명령은 `.git`이라는 하위 디렉토리를 만든다는 의미이다.

* Git이 파일을 관리하게 하려면 레포지토리에 파일을 추가하고 커밋해야 한다. 

* `git add` : 파일을 추가하는 명령어 / `git commit` : 커밋하는 명령어

```bash
git add " 파일이름 "
git commit -m " 커밋 메시지 "
```

### 기존 저장소를 Clone 하기

* 기존 혹은 다른 프로젝트에서 Git 레포지토리를 복사하고 싶을 때 `git clone` 명령을 사용한다.

* 해당 명령어를 실행하면 프로젝트 히스토리를 전부 받아온다. 

* `git clone <url>` 명령으로 저장소를 Clone 한다.

* devfancy.github.io에 있는 소스코드를 Clone하려면 아래와 같이 실행한다.

```bash
https://github.com/devfancy/devfancy.github.io.git
```

* 만약 다른 디렉토리 이름(`jun-yong`)으로 Clone 하고 싶을 경우 아래와 같이 입력하면 된다.

```bash
https://github.com/devfancy/devfancy.github.io.git jun-yong
```

* url 주소 뒤에 하고 싶은 디렉토리 이름을 추가해서 명령어를 입력하면 된다.

---

> 아래의 글은 Git 마스터 과정에서 배운 것을 정리한 내용입니다.

## Basic

### Git init

```bash
git init #initialise git  -> git이 초기화됨.
rm -rf .git #delete .git 
```

### Show the working tree status 

* git의 상태를 볼 수 있는 명령어다.

```bash
git status #full status
git status -s #short status -> 간편하게 확인하고 싶을 때
```

### Ignoring Files

* git과 github에 올리고 싶지 않은 파일들 → **.gitignore** 파일에 추가할 수 있다.

* 예) echo *.log > .gitignore ⇒ *.log라는 파일은 `.gitignore`에 속해진다.

### Staging files

```bash
git add a.txt #stage a.txt file
git add a.txt b.txt #stage a.txt, b.txt files
git add *.txt #stage all files ends with .txt 
git add * #stage all files except deleted files and files that begin with a dot
git add . #stage everything 
```

### Modifying files

* git 명령어를 사용(git rm or git mv)하면 `git status` 명령어를 통해 **Staging area**에 포함이 되는 것을 볼 수 있다.

Removing files

```bash
rm file.txt #delete file
git add file.txt #add to staging area
	# git add 를 통해 해당 파일을 staging area로 이동한다.
git rm file.txt # removes file from working directory and staging area
git rm --cached file.txt #removes from staging area only
git clean -fd #removes all untracked files
```

Moving files

```bash
git mv from.txt to.txt
git mv from.text /logs/from.text
```

### Viewing the Staged/Unstaged changes

* 정확하게 어떤 파일의 내용이 수정이 되었는지 확인하려면 **diff** 명령어를 수행한다.

```bash
git status #full status
git status -s #short status
git diff #changes in working directory
git diff --staged #changes in staging area
git diff --cached #same as --staged
```

### Commit

* 버전을 만들때 쓰는 명령어다.

* **Staging area에 있는 변경사항을 Git repository에 옮겨주는 역할**이다.

```bash
git commit #commit stagged files
git commit -m "Commit message" 
	# commit stagged files with commit message
git commit -am "Commit message" #commit all files with commit message
```

### Log · History

See history

* 히스토리를 확인하기 위해 **git log**를 이용한다.

```bash
git log #list of commits  -> 누가, 언제, 추가한 내용을 보여준다.
git log --patch #shows the difference introduced in each commit
git log -p #same as --patch
git log --state #abbreviated states for each commit
git log --oneline #oneline -> 간편하게 한줄로 확인(제목)
git log --oneline --reverse #oneline, from the oldest to the newest  -> 오래된 것부터 순서대로 확인한다.
```

Filtering

```bash
git log -2 #shows only the last n commits -> n번까지 출력할 것인지 예시에서는 2줄까지 출력한다.
git log --author="fancy" 
git log --before="2022-01-01"
git log --after="one week ago"
git log --grep="message" #finds in commit messages -> message가 포함된 commit을 찾는다.
git log -S="code" #finds in the code
git log file.txt #logs only for file.txt
	# 조금 더 자세히 보고 싶다면 
	git log -p file.txt
	# 간단하게 보고 싶다면
	git log -s file.txt
```

History of a file

```bash
git log file.txt #history of file.txt
git log --state file.txt #shows statistics
git log --patch file.txt #show the changes
git log -p # 위에 있는 git log --patch file.txt와 같은 명령어이다.
```

HEAD

```bash
git log HEAD
git log HEAD~1 # HEAD 바로 이전 첫번째 꺼를 보고 싶다면 => HEAD~1, HEAD이전 몇번째를 보고 싶다면 => HEAD~n
```

Viewing a commit

```bash
git show HEAD #shows the last commit
git show hash #shows the given commit
git show hash:file.txt 
  ex) 만약에 commit에 여러가지 파일들이 들어있다면, 그 중에서 user_repository.txt만 보고 싶다면
    -> git show hash:user_repository.txt
```

Comparing

```bash
git diff hash1 hash2 #all changes between two commits
	ex) git diff 5e27f5819e 0e0fe985e022 => 두가지 해쉬코드값을 보고 두 파일을 비교한다.
git diff hash1 hash2 file.txt #changes to file.txt only
```


### Tagging

* 내가 특정한 commit을 북마크 하고 싶을 때 **git tag** 명령을 사용한다.

* 대부분 `Sematic Versioning` 시스템을 따라간다. (`Semetic Versioning`은 버전 형식에 의미를 부여하여 좀 더 체계적인 버전 관리를 위한 제안이다)

Creating

```bash
git tag v1.0.0 #lightweight tag on latest commit
git tag v1.0.0 hash #lightweight tag on the given commit
	원하는 해쉬코드에 태그를 넣는다. 여기서 문자열은 "v1.0.0"을 뜻한다.
git show v.0.0 
 #shows the tag 태크에 있는 내용을 확인 할 수 있다.
git tag -a v.1.0.0 -m "message" 
 #-a: annotated tag(조금더 정보를 추가하겠다)
 #-m: message를 추가하는 옵션 뒤에 " "안에 있는 것이 message를 의미한다. 
```

Listing

```bash
git tag #all the tags (만들어진 모든 태그들을 확인 할 수 있다.)
git tag -l "v1.0.*" #search certain tags (특정한 태그만 확인할 수 있다)
```

Deleting

```bash
git tag -d v1.0.0 #delete the given tag
```

Checking out Tags

```bash
git checkout v1.0.0 #checkout certain tag (v1.0.0이라는 태그로 이동이 가능하다)
git checkout -b branchName v1.0.0 
	#create a new bracnh with the given tag 
	# 태그를 checkout하면서 새로운 branch를 만들고 싶을때 사용한다.

```

참고) checkout : 이동하거나 브랜치를 만들때 쓰는 명령어다.

* 예) git checkout fix : fix라는 branch로 이동한다.


## Reference

* [git 공식문서](https://git-scm.com/book/en/v2)

* [Dream Coding - Git 마스터 과정](https://academy.dream-coding.com/courses/git)