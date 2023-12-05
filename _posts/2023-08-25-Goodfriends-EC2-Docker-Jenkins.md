---
layout: post
title: " EC2 환경에서 도커를 활용한 젠킨스 설치하기 "
categories: Goodfriends
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/7)에 게시된 글 입니다.

우선 굿프렌즈팀의 프로젝트에서 구축하려는 CI/CD 구조는 다음과 같습니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-1.jpeg)

이번 스프린트3에서는 저는 **배포와 CI/CD와 같이 인프라**와 관련된 태스크에 집중하고 있습니다.

기존 스프린트 2에서 굿프렌즈팀은 새로운 기능을 병합할 때마다 SSH로 EC2 인스턴스에 접속하여 **쉘 스크립트를 매번 실행해야만 한다는 단점**이 존재했습니다. 
저희 팀은 develop 브랜치에 새로운 기능을 병합될 때마다 자동으로 감지하고, 스프링 애플리케이션을 `jar` 파일로 빌드하여 배포하는 환경이 필요하다고 느꼈습니다.
따라서 **CI/CD 도구를 도입**하기로 결정했습니다.

이번 글에서는 굿프렌즈가 EC2 환경에서 도커를 사용하여 젠킨스를 설치한 방법에 대해서 정리하려고 합니다.

## 젠킨스 도입

파이프라인을 구축할 때 여러 가지 방법이 있습니다. Github Action, Jenkins, Travis CI, Circle CI 등등

그 중에서 젠킨스(Jenkins)는 세계적으로 많은 개발자들이 사용중인 CI/CD 관리(빌드, 테스트, 배포)를 돕는 개발 도구입니다.

그리고 젠킨스는 **매우 다양한 IDE를 지원하고 개발자가 직접 커스텀할 수 있는 옵션이 많습니다.**

또한 많은 개발자분들이 사용하기 때문에 **래퍼런스할 수 있는 다양한 문서들이 존재**하여 초기 학습 비용이 적게 든다고 생각합니다.

따라서, 젠킨스를 구축하고 인프라에 있어서 다양한 선택지를 가져가는게 더 좋을 것 같아서 **젠킨스를 도입**하기로 결정했습니다.

## 1. Jenkins 전용 EC2 서버 생성

저희 굿프렌즈팀은 우선 Jenkins 전용의 EC2 인스턴스 주소를 생성했습니다.

### 1-1. 인스턴스 시작

**인스턴스 이름**: GOODFRIENDS-jenkins-server

**애플리케이션 및 OS 이미지(Amazon Machine Image)**: Ubuntu

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-2.png)

**인스턴스 유형**: t2.micro

**키 페어(로그인)**: GOODFRIENDS-rsa-key.pem

**네트워크 생성** 

- 기존 보안그룹 선택 -> GOODFRIENDS-jenkins-security-group -> 인바운드 규칙(아래 2가지 유형 추가)

- 1) 유형: SSH / 포트 범위: 22 / 소스: 내 IP 주소

- 2) 유형: HTTP / 포트 범위: 80 / 소스: 내 IP주소 / 설명: ec2 port for access to use jenkins

## 도커를 사용하는 이유

굿프렌즈 팀은 EC2 인스턴스에 도커를 사용하여 젠킨스 컨테이너를 띄웠습니다.

만약 도커를 사용하지 않고, 젠킨스를 우분투에 직접 설치한다면 해주어야할 환경 설정이 많습니다. 젠킨스를 돌리기 위한 JDK 설치, 젠킨스 설치 및 포트 설정, 방화벽 설정 등등..

하지만 도커를 이용한다면 이런 환경 설정 없이 **간단한 명령어 몇 가지만으로 젠킨스를 설치하고 서버에 띄울 수 있습니다.**

**즉, 우분투에 직접 설치할 때 해주어야할 여러 과정들을 생략할 수 있습니다.**

도커는 컨테이너 기술을 제공하는 수 많은 서비스들 중 하나입니다. 도커를 통해 젠킨스 컨테이너를 받아와서 실행만 하면 됩니다.

이러한 이점으로 굿프렌즈팀은 도커의 이점을 이용하고자 도커를 사용하게 되었습니다.



## 2. Jenkins 전용 EC2 서버에 도커 설치

### 2-1. Jenkins 전용 EC 인스턴스 연결

Docker를 설치하기 이전에, **먼저 Jenkins EC2 인스턴스에 연결을 해줘야 합니다.**

1. SSH 클라이언트를 엽니다.

2. 프라이빗 키 파일을 찾습니다.

3. 필요한 경우 이 명령을 실행하여 키를 공개적으로 볼 수 없도록 합니다: chmod 400 GOODFRIENDS-rsa-kay.pem

4. 퍼블릭 DNS을(를) 사용하여 인스턴스에 연결: "ssh -i "로 시작

### 2-2. Docker 설치

(참고로, $ 앞에 "ubuntu@ip-{젠킨스 EC2 인스턴스 ip 주소}~" 계속 중복되어서 생략했습니다)

[1]. Update the apt package index and install packages to allow apt to use a repository over HTTPS

(아래 명령을 통해서 우분투의 apt의 패키지 인덱스를 최신화하고, apt가 HTTPS를 통해 패키지를 설치할 수 있도록 설정합니다)

```shell
$ sudo apt-get update
$ sudo apt-get install ca-certificates curl gnupg
```


[2]. Add Docker’s official GPG key(도커의 공식 GPG 키 추가)

```shell
$ sudo install -m 0755 -d /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

[3]. Use the following command to set up the repository(레포지토리 셋업)

```shell
$ echo \
"deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
"$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

```


### 2-3. Docker 엔진  설치

[1]. apt 패키지 인덱스를 업데이트 합니다.

```shell
$ sudo apt-get update
```

[2]. 아래 명령을 실행하면 가장 최신버전의 도커 엔진이 설치됩니다.

- Latest 
- Specific version

```shell
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 설치
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
docker-ce-rootless-extras pigz slirp4netns
Suggested packages:
aufs-tools cgroupfs-mount | cgroup-lite
The following NEW packages will be installed:
containerd.io docker-buildx-plugin docker-ce docker-ce-cli docker-ce-rootless-extras docker-compose-plugin pigz slirp4netns
0 upgraded, 8 newly installed, 0 to remove and 82 not upgraded.
Need to get 114 MB of archives.
After this operation, 414 MB of additional disk space will be used.
### 설치하시겠습니까? 허용 ###
Do you want to continue? [Y/n] y
```

버전 확인 명령어입니다.

```shell
$ docker -v
Docker version 24.0.5, build ced0996
```

도커 명령어 실행하기 위한 권한를 부여합니다.

```shell
$ sudo chmod 006 /var/run/docker.sock
```


## 3. Jenkins 이미지 기반 컨테이너 실행
   
### 젠킨스 이미지 설치
   
아래 명령어를 통해 Jenkins:jdk11 버전의 이미지를 다운로드 받습니다.

```shell
$ docker pull jenkins/jenkins:jdk11

### 설치 과정 ###
jdk11: Pulling from jenkins/jenkins
34df401c391c: Pull complete
77112ac9b508: Pull complete
9523019861c2: Pull complete
8f223c71f218: Pull complete
4e1229fae46c: Pull complete
3b06bbef91e1: Pull complete
06e9e0811252: Pull complete
5600a22169a2: Pull complete
161df662cb15: Pull complete
99ac35e9b178: Pull complete
1a672221424a: Pull complete
be697b0f60e7: Pull complete
3f4ea89b49ee: Pull complete
```

설치된 이미지 확인

```shell
$ docker images
### 확인 ###
REPOSITORY        TAG       IMAGE ID       CREATED        SIZE
jenkins/jenkins   jdk11     27aa51b3ca68   2 days ago     463MB
hello-world       latest    9c7a54a9a43c   2 months ago   13.3kB
```


### 3-1. 젠킨스 이미지를 기반으로 컨테이너 실행

설치한 이미지(jenkins/jenkins:jdk11) 기반으로 jenkins 컨테이너를 생성합니다.

```shell
$ docker create -p 80:8080 --name jenkins jenkins/jenkins:jdk11

# -p 80:8080
# 젠킨스 서버 자체의 포트는 8080
# 해당 젠킨스 컨테이너에 접근하기 위한 포트는 80

# --name jenkins
# 생성할 젠킨스 컨테이너의 이름은 jenkins
위 명령어를 통해  jenkins 이미지를 기반으로 생성된 컨테이너의 ID를 확인할 수 있습니다.
```

생성한 컨테이너 실행

```shell
$ docker start jenkins
jenkins
```

**80번 포트로 접속할 수 있도록 허용**하였기 때문에 80포트로 접근할 수 있습니다.

public IP 주소로 웹 브라우저(**크롬**)에서 접근합니다.


**만약 접근이 안될 경우** 아래와 같이 **젠킨스 전용 보안 그룹**을 고려하시길 바랍니다.


젠킨스 전용 보안 그룹에서 인바운드 규칙으로 80 포트를 허용했는지 확인합니다.

위치: EC2 -> 인스턴스 -> 하단 인바운드 규칙 -> 인바운드 규칙 편집 클릭

-> **규칙 추가 - 유형: HTTP / 프로토콜: TCP / 포트 범위: 80 / 내 IP**


도커를 사용하여 젠킨스 컨테이너가 EC2 인스턴스에 접속이 되면 아래 화면과 같이 뜨게 됩니다.

localhost:8080으로 접속하면 아래와 같은 화면이 보일 것 입니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-3.png)

## 4. Jenkins 로그인
   
### 4-1. 젠킨스 접속 비밀번호 확인
   
젠킨스가 실행되면 초기 비밀번호를 제공해주는데, 이 비밀번호를 통해 젠킨스 초기 환경 설정을 진행해야 합니다.

젠킨스 컨테이너 내부로 접근하여 젠킨스 비밀번호 경로 및 비밀번호를 확인합니다.

```shell
$ docker exec -it jenkins /bin/bash
$ cat /var/jenkins_home/secrets/initialAdminPassword

### 젠킨스 컨테이너 비밀번호 확인 ###
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

아래 비밀번호인 "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"를 복사한 후 젠킨스 홈페이지 비밀번호 탭에 붙여넣은 다음에 로그인을 합니다.

그러면 아래와 같이 로그인이 완료되는 것을 확인할 수 있습니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-4.png)

### 4-2. Customize Jenkins

**Jenkins 추천 플러그인 설치**

Install Suggested plugins 버튼을 선택합니다.

그리고 시간이 지나면, **Getting Started - 플러그인 설치 과정이 완료**되는 걸 확인할 수 있습니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-5.png)

### 4-3. Create First Admin User

Jenkins에 로그인하기 위해서는 별도의 계정을 생성하거나 임시 계정(Admin)으로 로그인이 가능합니다.

추후 직접 계정 생성하여 사용하고 여기서는 Skip and continue as admin 버튼 선택해도 됩니다.

### 4-4. Instance Configuration

Jenkins Dashboard에 접속하기 위한 URL을 설정하는 부분으로, 기본 URL(Jenkins EC2 인스턴스의 퍼블릭 ip 주소)를 복붙하고 "Save and Finish" 버튼을 클릭합니다.

(Jenkins URL = 젠킨스 인스턴스 주소)

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-6.png)


### 4-5. Jenkins is Ready!
"Start using jenkins" 버튼을 선택합니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-7.png)

### 4-6.  젠킨스 접속 완료
앞서 만든 사용자 계정으로 젠킨스에 접속하게 되면 아래와 같은 화면이 나오게 됩니다. 🤟

아래와 같이 젠킨스가 웹 인터페이스를 제공하는 덕분에 저희 굿프렌즈팀은 CLI가 아닌 GUI화면을 통해 CI/CD 를 구축할 수 있습니다.

![](/assets/img/project/Goodfriends-EC2-Docker-Jenkins-8.png)


## 다음 글에서는

다음 글에서는 굿프렌즈가 젠킨스를 이용하여 어떻게 **배포 자동화 프로세스**를 구축하였는지 작성해 보도록 하겠습니다. ✍🏻

긴 글 읽어주셔서 감사합니다.

## Reference

- [[Infra] CI/CD 파이프라인 구축기 [Jenkins, Docker]](https://developer-nyong.tistory.com/47)

- [젠킨스를 사용한 달록팀의 지속적 배포 환경 구축기 (1) - 백엔드편](https://dallog.github.io/continuous-deploy-with-jenkins-1-backend/)