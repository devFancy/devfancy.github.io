---
title: "[Git] fork 해온 repository 잔디 심는 방법"
date: 2022-12-08
categories: ["도구"]
tags: ["Git"]
---

## fork 해온 repository 잔디 심는 방법 

* 잔디를 심기 위해서는 아래의 요건들이 충족되어야 한다.

> GitHub 계정과 commit 이메일 계정이 동일하거나
>
> commit이 Fork한 repository가 아닌 나만의 repository에서 이루어져야 한다

## 순서

* fork 없이 repository를 나의 깃허브로 복사해오도록 할 것이다.

[1] 일단 내 git hub에 새로운 레파지토리를 만든다.

[2] terminal을 연다.

[3] 복사하고자 하는 repository를 bare clone한다.

> \$ git clone --bare https://github.com/exampleuser/old-repository.git

* 터미널에 git clone --bare를 입력하고 그 뒤에 복사해온 주소를 붙여넣기한다.

[4] 새로운 레파지토리로 Mirror-push

> \$ cd old-repository.git
>
> \$ git push --mirror https://github.com/exampleuser/new-repository.git

* cd 명령어를 이용해 새로운 레파지토리로 이동한뒤👉 3번에서 한 것과 같이 새로운 레파지토리 주소를 복사한뒤, git push --mirror 뒤에 붙여넣으면 Mirror-push가 된다.

[5] 처음에 임시로 생성했던 local repository를 삭제

> \$ cd ..
> 
> \$ rm -rf old-repository.git

---

## 참고

[fork 해온 repository 잔디 심는 방법 : repository 복사해오기 duplicate the repository](https://soranhan.tistory.com/11)