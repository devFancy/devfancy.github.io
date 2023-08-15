---
layout: post
title: " [우리FISA] 굿프렌즈팀의 Git-flow 전략을 소개합니다. "
categories: Woorifisa
author: devFancy
---
* content
{:toc}

> 이 게시글은 git에 대한 기본적인 명령어 이해를 알고 있다는 전제하에 작성했습니다

## Git-flow 전략

git 브랜치의 대표적인 전략은 다음과 같습니다.

- git flow
- github flow
- gitlab flow

우리 팀은 git 브랜치 전략 중 하나인 Git flow 전략을 사용하기로 했습니다. 참고로 "git flow"는 2010년 빈센트 드리슨이 창안했습니다.

하지만 git flow 전략을 모두 가져가진 않고, 그중에서 필요한 부분을 가져가기로 했습니다.

git flow 전략을 들어본 사람은 알겠지만, 배포 주기가 길고 팀의 이력이 있는 경우 적합한 브랜치 전략입니다.

## Git Repository 구성

프로젝트 시작하기에 앞서, 현재 Git Repository 구성부터 살펴보겠습니다.

![](/assets/img/woorifisa/git-flow-repository-1.jpg)

위 그림은 Git Repository 구성과 워크플로우를 설명하고 있습니다.


**Upstream Remote Repository**: 팀 프로젝트를 진행하는 개발자들이 공유하는 저장소로 최신 소스코드가 저장되어 있는 `원격 저장소` 입니다.

**Origin Remote Repository**: `Upstream Repository`에서 Fork 한 원격 개인 저장소입니다. (Upstream Repository를 직접 clone 하는 것이 아닙니다)

**Local Repository**: 프로젝트에 속한 각각의 팀원들이 **Fork**를 하여 개인 원격 저장소를 생성하고, 그것을 clone 하여Local Repository`를 생성하여 작업하는 저장소입니다.

이런 워크플로우를 두는 데는 `Upstream Repository`에는 프로젝트에 참여한 팀원들이 **공유**하는 있는 저장소로, **개발자들이 다양한 시도를 하다가 실수할 수 있는 위험부담**이 있기 때문입니다.
그래서 Upstream Repository에서 fork 한 `Origin Repository`를 중간에 둠으로써 각각의 개발자들이 작업을 하다가 실수를 해도, 원격 저장소인 Upstream Repository에 반영이 안 되기 때문에 부담 없이 작업을 진행할 수 있습니다.

워크플로우에 대해 정리하자면, 개인 Repository에서 주어진 작업을 마쳤으면, 개인 `Origin Repository`에 Push를 하고 `Upstream Repository`에 merge 하기 위해 Pull Request를 요청합니다.

## 굿프렌즈팀의 Git-flow 운영 방식

Git-flow는 기본적으로 **5가지** 종류의 브랜치가 존재합니다.

항상 유지해야 하는 **메인 브랜치들**(main, develop)과 **보조 브랜치들**(feature, release, hotfix)이 있습니다. 
메인 브랜치들과 다르게 보조 브랜치들은 해당 작업을 마치면 삭제해야 합니다.

- main(master): 제품으로 출시될 수 있는 브랜치 (최근에는 main이라고 부른다)
- develop: 다음 출시 버전을 개발하는 브랜치
- feature: 기능을 개발하는 브랜치
- release: 이번 출시 버전을 준비하는 브랜치
- hotfix: 출시 버전에서 발생한 버그를 수정하는 브랜치

![](/assets/img/woorifisa/git-flow-1.jpeg)

`main` 브랜치에서 'git checkout -b' 명령어를 통해 develop 브랜치를 생성합니다.

`develop` 브랜치는 개발을 위한 브랜치이고, main 브랜치는 제품으로 출시될 수 있는 브랜치이기 때문에 **항상 배포 가능한 상태**가 되어야 한다. 두 개의 메인 브랜치는 `Upstream remote repository` 에서 운영합니다.

그리고 **새로운 기능 개발 작업**이 있을 경우 develop 브랜치에서  `git checkout -b` 명령어를 통해 feature 브랜치를 생성합니다.

feature 브랜치는 팀원들이 프로젝트에 대한 기능별로 각자 맡은 작업에 대한 코드가 들어있는 브랜치입니다.

feature 브랜치에서 해당 기능 개발 작업을 완료했으면, pull request를 보내고 merge를 통해 develop 브랜치에 합쳐지게 됩니다.

이때, merge 하기 전에는 팀원들 간에 **코드 리뷰 작업**을 진행합니다.
리뷰어로부터 코드 리뷰를 받고 변경 사항이 있으면 추가적인 commit 후 merge를 진행하게 됩니다. 우리 팀은 merge 방식을 `squash and merge` 으로 사용했습니다.

### feature -> develop (squash and merge)

그 이유는 feature 브랜치에서 기능을 개발하기 위한 커밋 내역을 하나의 커밋으로 묶어 develop에 **병합**시킴으로써, develop에는 **기능 단위**로 커밋이 추가되도록 정리할 수 있다는 장점이 있기 때문입니다.

![](/assets/img/woorifisa/git-flow-2.jpeg)

`release` 브랜치는 배포하기 전에 충분한 검증(테스트)을 하기 위해 생성하는 브랜치입니다.
QA 작업을 진행하면서 발생한 버그를 수정하기 위해 사용합니다. **QA 작업이 끝나고 배포할 준비가 완료**되었다고 판단되면, release 브랜치를 main 브랜치와 develop 브랜치에 **merge** 후에 main 브랜치에서 **tag** 명령을 통해 버전 태그를 추가합니다.

![](/assets/img/woorifisa/git-flow-3.jpeg)

`hotfix` 브랜치는 main 브랜치에서 배포하는 중에 버그가 생겨서 긴급하게 수정할 때 사용하는 브랜치입니다.
배포 이후에 이루어지는 브랜치이고, 버그를 해결한 이후에 해당 변경 사항을 **main 브랜치와 develop 브랜치에 merge** 합니다.

![](/assets/img/woorifisa/git-flow-4.jpeg)

앞에서 말씀드렸듯이, 나머지 보조 브랜치들은 해당 작업을 모두 마치게 되면 삭제하여 정리합니다.

그러면 main브랜치와 develop 브랜치만 남게 됩니다.

## 비즈니스 환경에 맞게 바꾸기

git-flow는 "배포 주기가 길고 팀의 이력이 있는 경우 적합한 브랜치 전략"으로 **빈번한 배포가 일어나는 경우에는 적합하지 않습니다.**

특히 우리팀은 주마다 배포를 할 생각이 있고, 해당 프로젝트 전체 기간이 **5주** 남짓이기 때문에, 빠르게 개발하고 배포를 해야 하는 상황입니다. 
그리고 release 브랜치와 hotfix 브랜치에서 main 브랜치에 merge 하면서 버전 태그가 남게 되는데, 태그가 쌓일수록 나중에 팀원들 간에 **커뮤니케이션**을 제대로 진행하지 않으면, 해당 태그가 어디에 해당하는지 제대로 파악하지 못하는 경우가 발생하게 됩니다.

**정리**하자면 다음과 같은 이유를 들 수 있습니다.

- 프로젝트 전체 기간이 5주인데, 해당 프로젝트에서 요구해야 하는 기능들이 많기 때문에 어쩔 수 없이 빠르게 개발하고 빈번하게 배포해야 하는 상황입니다.
- 5개의 브랜치를 관리하면서 신경 써야 할 부분이 많아지면서 자동화를 하기가 까다롭습니다.
- 해당 프로젝트 기간 동안 QA 작업을 진행하면서 생기는 태그들에 대해 커뮤니케이션이 제대로 진행되지 않으면, 프로젝트가 원활하게 진행하기 어렵습니다.

그래도 우리 굿프렌즈팀은 `git-flow` 전략을 사용한 이유는 **실제 운영할 수 있는 서비스**를 개발하면서 **다양한 시도를 통해 경험을 습득**하는 목적이 크기 때문입니다.

또한 `git` 명령어에 익숙하지 않기 때문에 다양한 시도를 통해 **많은 경험과 지식을 학습할 수 있는 기회**라고 생각하기 때문입니다.

대신 기존의 `git-flow`를 정석적으로 사용하지 않고 **현재 상황에 맞게 유연하게 대처**하려고 합니다. 

**`release` 브랜치를 없애고 그 역할을 `develop` 브랜치**에서 대신 진행하기로 해서 총 4개의 브랜치인 `main`, `develop`, `feature`, `hotfix`만 사용하기로 결정했습니다.

### develop -> main (rebase and merge)

main 브랜치는 지금까지 개발한 모든 기능을 병합할 때 사용하는 브랜치입니다. 

앞서 feature 브랜치에서 develop 브랜치로 `squash and merge` 방식을 진행했지만, develop 브랜치에서 main 브랜치로 merge 할 경우는 `rebase and merge` 방식이 적합합니다.

`squash and merge` 방식을 진행하게 되면 커밋 이력이 모두 사라져, 특정 기능에서 문제가 발생되었을 때 롤백 처리를 할 수 없게 됩니다. 하지만, `rebase and merge` 방식을 사용하게 되면 커밋 이력이 남기 때문에 나중에 문제가 발생되어도 롤백 처리를 할 수 있습니다. 

(참고로, `rebase and merge` 은 결과적으로 `Fast-Forward Merge` 방식을 사용하는 것과 같습니다)

## 굿프렌즈 팀의 git-flow 적용기

우선 `Upstream Remote Repository` (원격 저장소)를 기반으로 원격 개인 저장소에 `Fork` 해야 합니다.

![](/assets/img/woorifisa/git-flow-fork.png)

Organization에 생성한 repository에서 Fork를 누르면 본인의 개인 repository에서 `Origin Remote Repository` 이 생성된 것을 확인할 수 있습니다.

그런 다음, Fork로 생성된`Origin Remote Repository` 를 기반으로 `Local Repository` 를 생성합니다.

```shell
// git clone https://github.com/{개인 github 이름}/{repository 이름}.git
$ git clone https://github.com/devFancy/GoodFriends.git
```

git clone 명령어를 통해 원격 저장소에 있는 repository를 손쉽게 가져올 수 있습니다.

```shell
$ cd {repository 이름}
$ git remote -v
origin	https://github.com/{개인 github 이름}/{repository 이름}.git (fetch)
origin	https://github.com/{개인 github 이름}/{repository 이름}.git (push)
```

해당 repository로 이동한 다음에 `git remote -v`로 확인하면 원격 저장소가 등록되어 있다는 것을 확인할 수 있다.

매번 최신 코드를 `fetch` 및 `rebase` 하기 위해서는 `Upstream`을 등록해야 한다.


```shell
$ git remote add upstream https://github.com/woorifisa-projects/GoodFriends.git

$ git remote -v

origin	https://github.com/{개인 github 이름}/{repository 이름}.git (fetch)
origin	https://github.com/{개인 github 이름}/{repository 이름}.git (push)
upstream	https://github.com/{organization 이름}/{repository 이름}.git (fetch)
upstream	https://github.com/{organization 이름}/{repository 이름}.git (push)
```

`git remote add upstream` 명령어를 통해 upstream을 등록합니다. 정상적으로 등록된 것을 확인했으면 이제 작업할 때마다 브랜치를 생성하고 최신 코드를 pull 받아야 한다.

우리 팀은 개발해야 할 기능에서 각각의 작업 단위를 `github - issues`에 등록한 뒤 issue 번호를 기준으로 브랜치를 생성하기로 결정했다.

간단한 예시를 들자면,

![](/assets/img/woorifisa/git-flow-issue.png)

이슈를 생성할 때 제목은 구현해야 할 기능에서 세부 기능 작업 단위로 작성합니다. 오른쪽은 아래의 예시 사항에 맞게 선택합니다.

예시)
- Title: [상품 등록] 사용자는 중고 물품을 등록해서 판매한다.
- Assignees : devfancy
- Label: 기능, 백엔드
- Projects: Goodfriends
- Milestone: 스프린트 2

이슈를 생성했으면 해당 번호를 기준으로 local repository에서 feature 브랜치를 생성합니다.
여기선 이슈 번호를 `11`이라고 가정했습니다.


```shell
$ git branch feature/11-register-used-product
$ git checkout feature/11-registar-used-product

또는

$ git checkout -b feature/11-register-used-product
```

이제 Upstream에 있는 remote repository에서 최신 소스 코드를 가져옵니다.


```shell
$ git fetch upstream # 현재 remote의 최신 내용(commit 기록)에 대한 이력을 가져옵니다.
$ git rebase upstream/develop # git fetch로 가지고 온 최신 내용(commit 기록)을 자신의 local repository에 합칩니다.
```

git pull을 사용하여 등록한 upstream develop에서 commit 기록을 병합합니다.

그리고 이제 본인이 맡은 작업을 진행하고 자신의 원격 저장소인 `Origin remote repository`에 push 합니다.

```shell
$ git push origin feature/11-register-used-product
```

그렇게 하고 나면 개인 github repository를 살펴보면 변경을 감지하고 pull request를 생성할 것인지에 대한 탭을 확인할 수 있습니다.

작업을 모두 완료했으면, 개인 `Origin Remote repository`에 있는 `feature/11-register-used-product` 브랜치를 Upstream에 있는 develop 브랜치에 merge 하기 위해서 pull request 작업을 진행합니다.

본인이 작성한 코드를 리뷰해 줄 팀원들을 선택하고, **본인이 작업한 commit에 대한 전반적인 내용을 간단하게 요약해서 작성**한 뒤 PR를 생성합니다.

생성한 PR을 기반으로 리뷰어가 코드 리뷰를 진행하고, 변경 사항이 있으면 추가 commit 작업을 한 다음에 merge를 통해 develop에 반영하게 됩니다.

## 작업을 진행할 때 지켜야 할 서로 간의 약속

우리 굿프렌즈팀은 다음과 같은 순서로 작업을 진행하기로 했습니다.

### [feature-> develop]
- [1] Issues에서 새로운 이슈(작업 티켓)를 생성합니다.
    - 이때 Projects 부분에는 해당 프로젝트명을, Milestone 부분에는 해당 스프린트 주차를 선택하여 연동시킵니다.
- [2] 새로운 이슈 번호를 기준으로 브랜치를 생성합니다. ex) feature/11-register-used-product
- [3] 작업이 완료되면, develop 브랜치에 PR을 생성합니다.
- [4] Merge 하기 전에, 코드 리뷰를 진행합니다. 이때, 변경 사항이 있으면 추가 commit 작업을 진행합니다.
    - feature -> develop 일 경우, `squash and merge` 로 진행합니다.

### [develop -> main]
- [1] develop 브랜치에서 배포하여 기능 동작을 확인합니다. (FE 배포 방법, BE 배포 방법)
- [2] 정상적으로 기능 동작이 되면 develop -> main 으로 PR & Merge 작업을 진행합니다.
    - commit message는 `Create a merge commit` 으로 작성합니다.
    - develop -> `main`일 경우, `rebase and merge`로 진행합니다.
- [3] main에 배포할 작업 내역과 관련해서 release 노트를 작성합니다. (main 기준)
- [4] 상용 환경에 main 브랜치로 배포하여 기능 동작을 확인합니다. (FE 배포 방법, BE 배포 방법)
    - 기능 동작 확인하는 과정 중에 버그가 발생한다면, hotfix 브랜치를 생성하여 버그를 수정한 뒤 main에 PR&merge 합니다.


## 정리

이번 프로젝트를 진행하면서 `git-flow` 전략을 **굿프렌즈팀에 어떻게 적용하면 좋을지**에 대해 여러 자료를 참고해 가면서 많은 공부와 경험을 하게 되었습니다. 

`git-flow` 전략이 무조건적인 정답이 아니기에, 우리 팀에 맞게 몇 가지 부분을 수정했습니다. 

특히, 이번 `git-flow`에 대한 여러 자료를 참고하면서 `upstream`과 `origin`을 분리하면서 작업을 진행한다는 점이 보다 더 안전하게 진행할 수 있게 되어서 유의미한 경험이 되었습니다. 

그리고 **코드 리뷰**와 상황에 따른 **merge 방식**도 배우면서 양질의 웹기반 애플리케이션 서비스가 될 수 있도록 노력해 보겠습니다.

(혹시나 해당 내용을 읽으시다가, 잘못된 부분이 있다면 댓글로 남겨주시면 감사하겠습니다. 😊)


## Reference

- [우린 Git-flow를 사용하고 있어요](https://techblog.woowahan.com/2553/)
- [git flow; 환상과 현실 그 사이에 서비스](https://vallista.kr/git-flow;-%ED%99%98%EC%83%81%EA%B3%BC-%ED%98%84%EC%8B%A4-%EA%B7%B8-%EC%82%AC%EC%9D%B4%EC%97%90-%EC%84%9C%EB%B9%84%EC%8A%A4/)
- [git 브랜치 전략을 소개합니다.](https://dallog.github.io/git-branch-strategy/)