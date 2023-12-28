---
layout: post
title:  " 인텔리제이와 깃허브 연동 (Mac 버전) "
categories: IntelliJ
author: devfancy
---
* content
{:toc}

* 인텔리제이에서 깃 허브에 Repository를 생성하고 업로드하는 과정을 정리했다.

![](/assets/img/intellij/IntelliJ-Connection-Git-Repository_1.png)

* 우선 인텔리제이에서 깃허브 저장소에 올리고 싶은 프로젝트를 open한다.

![](/assets/img/intellij/IntelliJ-Connection-Git-Repository_2.png)

* 그런 다음에 IntelliJ IDEA -> Settings(Preferences)를 클릭하여 검색창에 git을 입력한다.

* git이 설치되었으면 git 밑에 있는 github 탭을 클릭하여 깃허브에 로그인을 하여 연동시킨다.

![](/assets/img/intellij/IntelliJ-Connection-Git-Repository_3.png)

* Git -> GitHub -> Share Project on GitHub을 클릭하여 Repository name을 적어주고 `Share` 버튼을 클릭한다.

* 뒤이어 나오는 팝업창에서 원하는 프로젝트 요소들을 체크한 후 Commit 메세지를 입력하고 `Add` 버튼을 클릭한다.

![](/assets/img/intellij/IntelliJ-Connection-Git-Repository_4.png)

* 내 깃허브 페이지에 들어와서 새로고침을 하면 다음과 같이 Repository가 추가된 것을 확인할 수 있다.