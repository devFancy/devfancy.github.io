---
layout: post
title: " [Goodfriends] 젠킨스를 사용하여 CI/CD Pipeline 구축기(백엔드편) "
categories: Side_Project
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/8)에 게시된 글 입니다.

## Intro

굿프렌즈팀의 프로젝트에서 백엔드 CI/CD 구조는 다음과 같습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-1.png)

우선, 굿프렌즈의 프론트/백엔드 개발자가 기능을 개발하여 Github에 PR을 생성합니다. 이때 PR 코드가 정상적으로 빌드되고, 모든 테스트를 통과하는지 Github Actions를 사용하여 우선적으로 검사합니다. 이때, PR 브랜치의 코드가 문제가 있다면 develop 브랜치로 병합이 불가능합니다.

정상적으로 빌드가 되는 코드는 굿프렌즈 개발자들끼리 코드리뷰가 진행되고, develop 브랜치에 병합이 됩니다.

이때, Github은 굿프렌즈팀이 구축한 젠킨스 서버에 `Webhook`을 통해 병합 사실을 알립니다.

`Webhook`이란, **특정한 애플리케이션이 다른 애플리케이션으로 이벤트 발생 정보를 실시간으로 제공하기 위한 방법**입니다.

젠킨스는 외부에 Webhook URL을 열어두고, Github으로부터 이 Webhook URL로 요청을 받아 이벤트가 발생한 즉시 그 사실을 알 수 있습니다.

### [백엔드]

Webhook을 통해 신호를 받은 젠킨스는 미리 지정된 젠킨스 파이프라인 스크립트를 실행하여 스프링 부트 애플리케이션을 빌드하여 jar 파일을 생성합니다.

생성한 jar 파일은 스프링부트 애플리케이션이 실행되고 있는 EC2 인스턴스로 전송됩니다. 그리고 스프링부트 인스턴스에서 jar 파일이 실행되어 배포가 완료됩니다.

## 1. 젠킨스 서버에게 github 접근 권한 주기

젠킨스가 Github에서 레포지토리를 clone하기 위해서는 해당 레포지토리에 대한 접근 권한이 필요합니다.

(public repository이면 아래 과정들을 안해도 상관 없습니다)

### 1-1. github에서 personal access token 발급 받기

우측 상단 프로필 선택 후 하단 settings → 좌측 하단 Developer settings → Personal Access tokens → Tokens(classic) →

우측 상단에 `Generate new token` 선택합니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-2.png)

Note, Expiration, Select scopes를 아래와 같이 선택했습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-3.png)

그런 다음 하단에 `Generate token` 을 선택했습니다.

가운데 부분에 체크 아이콘으로 표시된 access token 값을 복사한 뒤 따로 보관해두셔야 합니다.

(저희 굿프렌즈팀은 "goodfriends-from-jenkins-to-spring-repo-access-token.txt" 라는 파일을 생성한 뒤에 복사한 키 값을 보관했습니다)


### 1-2. Add Credential

추후 사용을 위해 2개의 credential을 생성합니다.

#### 첫번째 credential

- `Domain` : Global credentials
- `kind`: Secret text
- `Scope` : Global
- `Secret` : **github에서 발급받은 personal access token 키 값**
- `ID` : **jenkins-credential-secret-text**
- `Description` : (생략)

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-4.png)

#### 두번째 credential

- `Domain` : Global credentials
- `kind`: Username with password
- `Scope` : Global
- `Username` : github organization username → woorifisa-projects
- `ID` : **jenkins-credential-username-password**
- `Description` : 생략

### 1-3. 젠킨스에게 access token을 사용할 수 있도록 적용하기

- Jenkins 관리 → System → 중간 부분 Github 탭 → Add Github Server

- Name: Github 레포지토리 이름: goodfriends

- API URL: 생략

- Credentials: 아래 Add 버튼을 통해 기존에 첫번째 credential로 생성한 `jenkins-credential-secret-text`을 추가합니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-5.png)

## 2.  기본 파이프라인 작성

옵션 - 두번째 탭의 **Pipeline** 선택

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-6.png)

### 2-1. Github 레포지토리에서 clone하기 위한 clone 명령어 파이프라인 구성

#### Configure

pipeline syntax → snippet generate → Steps - Sample Step -  git:Git 선택

https:// github repository url 지정(git clone http 주소)

처음에 에러 떠도 무시
- branch: develop
- credentials: username&password로 생성한 credential 를 추가합니다.

하단 Generate Pipeline Script 버튼 클릭

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-7.png)

그런 다음에 Pipeline - Script 부분에 아래와 같이 추가합니다.

```shell
pipeline {
    agent any
    
    stages {
		stage('Git clone') {
         
            steps {
                git branch: 'develop', credentialsId: 'jenkins-credential-username-password', url: 'https://github.com/woorifisa-projects/GoodFriends'
            }
        }
    }
}
```

젠킨스에서 빌드 클릭후에 clone이 정상적으로 되었는지 확인을 위해 젠킨스 서버가 있는 도커 내부에 접속합니다.

```shell
docker exec -it jenkins /bin/bash # docker 내부 접속
cd / # 최상단 이동
cd /var/jenkins_home/workspace # 경로 이동
ls # 파이프라인 이름 확인: Goodfriends-pipeline 
cd Goodfriends-pipeline # 해당 파이프라인 경로로 이동
ls # 해당 경로에 Github repository 프로젝트 폴더가 clone 되었는지 확인
```

아래와 같이 굿***프렌즈의 Github URL clone이 정상적으로 완료**된 것을 빌드을 통해 확인할 수 있습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-8.png)

## 3.  빌드 파이프라인 작성(CI 구축)

순서: 시크릿 파일 설정 -> 빌드 스크립트 작성 -> 배포 스크립트 작성

### 3-1. 시크릿 파일 설정

빌드 하기 전에 필요한 시크릿 파일(application.yml, application-db.yml, application-oauth.yml)은 **젠킨스** Credential 에 관리하도록 설정했습니다. 

(`해당 위치`: Dashborad > Jenkins 관리 > Credential > System > Global credential)

아래와 같이 시크릿 파일들을 Credential에 보관된 것을 확인할 수 있습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-9.png)

### 3-2. 빌드 트리거 설정

Dashboard > Goodfriends-pipeline > Configuration

**Build Triggers > GitHub hook trigger for GITScm polling** 을 체크합니다. Github의 Webhook을 통해 빌드가 트리거되는 옵션입니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-10.png)

#### Github 저장소에 Webhook을 통한 빌드 자동화

Webhook을 사용하려면 Github 저장소의 Settings > Webhooks에서 Webook URL을 등록해줘야 합니다.

**Payload URL 부분**

```shell
http//{젠킨스 EC2 탄력적 ip 주소}:{포트번호}/github-webhook/
```

위와 같이 URL을 등록해줍니다. 이때 URL의 마지막에 "/"가 들어가지 않으면 오류가 발생하니 반드시 추가해주어야 합니다.

그 외 다른 정보들을 아래와 같이 입력한 뒤 Add webhook 버튼을 클릭합니다.
- `Content type`: application/json
- `Secret`: 생략
- `Which events would you like to trigger this webhook?`: Jush the push event
- `Active`: 체크

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-11.png)

그리고 젠킨스 EC2 인스턴스 서버 - 보안 그룹 - 인바운드 보안 그룹에 6개의 HTTP 유형의 보안 그룹을 추가했습니다.
(해당 보안 그룹은 개인 ip 주소가 포함되어있어서 공개할 수 없다는 점 양해부탁드립니다)

### 3-3. 빌드 스크립트 작성

저희 굿프렌즈팀은 Github 레포지토리안에 프론트와 백엔드 코드가 같이 있기 때문에, 빌드하기 전에 백엔드 코드가 있는 폴더를 이동한 뒤 실행했습니다.

```shell
pipeline {
    agent any
    tools {
        gradle 'gradle'
    }
    triggers {
        githubPush()
    }
    stages {
		stage('저장소 복제') {
            steps {
               git branch: 'develop', credentialsId: 'jenkins-credential-username-password', url: 'https://github.com/woorifisa-projects/GoodFriends'
            }
        }
        stage('백엔드 yml 파일 다운받기') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'secret-application-yml', variable: 'YML'),
                        file(credentialsId: 'secret-application-db-yml', variable: 'DbYML'),
                        file(credentialsId: 'secret-application-oauth-yml', variable: 'OauthYML')
                    ]) {
                        sh 'cp $YML backend/src/main/resources/application.yml'
                        sh 'cp $DbYML backend/src/main/resources/application-db.yml'
                        sh 'cp $OauthYML backend/src/main/resources/application-oauth.yml'
                    }
                }
            }
        }
        stage('백엔드 빌드') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
            }
        }
    }
}
```

#### 저장소 복제

깃허브의 저장소 주소와 브랜치를 설정합니다. 젠킨스는 이 스테이지에 명시된 저장소와 브랜치를 기준으로 코드를 가져옵니다.

#### 벡엔드 yml 파일 다운받기

젠킨스 Credential에 있는 3개의 시크릿 파일을 받아와서 복사한 뒤 붙여넣습니다.

#### 백엔드 빌드

gradlew에 대한 실행 권한을 부여한 뒤 빌드합니다. 이때, dir 지시어를 사용하여 명령을 수행할 디렉터리를 지정할 수 있습니다.

여기서는 backend 폴더로 이동하는 명령어로 해석할 수 있습니다.

## 4.  배포 파이프라인 작성(CD 구축)

### 4-1. 백엔드 EC2에 접근하기 위해 SSH 플러그인 설치

백엔드 EC2에 접근하기 위해 **젠킨스에 SSH 플러그인을 설치**해주어야 합니다.

Jenkins → System Configuration → Plugins 탭 선택

좌측 - **Available plugins 선택 -> SSH Agent** 검색 후 설치

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-12.png)

SSH Agent 플러그인이 정상적으로 설치 되었으면 젠킨스를 재시작해줍니다. (Restart)

(하단에 `설치가 끝나고 실행 중인 작업이 없으면 Jenkins 재시작` 체크박스를 선택합니다)

만약, 자동으로 재실행 되지 않을 경우 젠킨스 컨테이너에 직접 재시작하는 명령어를 입력해서 실행합니다.

```shell
$ docker start jenkins
```

아래와 같이 SSH Agent 설치가 완료된 것을 확인하실 수 있습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-13.png)

### 4-2. Jenkins 서버에서 스프링부트 서버로 접속하기 위한 EC2 SSH 키 추가하기

Jenkins 관리 → Credentials → Stores scoped to Jenkins 탭에서 System 하이퍼링크 클릭

Global credentials 클릭 -> 우측 상단 Add Credentials 선택(Add domain 아님)

- `Kind`: SSH Username with private key
- `Scope`: Global
- `Username`: ubuntu (linux 계정이름)
- `Password`: 스프링 EC2 서버에 접속할 때 사용하던 pem 키의 값(하단 pem 키 조회참조)
- `ID`: from-jenkins-to-aws-ec2-access-key
- `Description`: access-key-for-spring-ec2-server
- `Treat username as secret`:  체크
- `Private Key 탭 하단`: Enter directly 선택 - Key 부분 하단 Add 버튼 누른 후 **스프링 부트 EC2 에 연결할 때 사용되는 pem 키의 내용 입력 후 저장**

pem 키가 있는 폴더에서 shell 에디터 실행 후 cat 명령어로 pem 내부 키 값을 조회합니다.

```shell
cat {key이름}.pem # cat GOODFRIENDS-rsa-kay.pem
```

-BEGIN 부터 -KEY-- 부분까지 전체 복사 후 붙여넣습니다.

### 4-3.  백엔드 EC2 서버 설정

운영 서버(백엔드 서버)에서 실행 시킬 deploy.sh 파일을 작성한 뒤 저장홈(~) 경로에 mydemo 폴더를 생성합니다.

`deploy.sh` 스크립트는 아래와 같이 작성했습니다.

```shell
#!/bin/bash

pid=$(pgrep -f java)

if [ -n "${pid}" ]
then
        kill -15 ${pid}
        echo kill process ${pid}
else
        echo no process
fi
chmod +x ./goodfriends-0.0.1-SNAPSHOT.jar
nohup java -jar ./goodfriends-0.0.1-SNAPSHOT.jar >> application.log 2> /dev/null &
```

#### 인바운드 규칙 편집

젠킨스 서버에서 운영 서버(백엔드 서버)로 접속하기 위해 백엔드 보안 그룹내에 인바운드 규칙을 설정해줘야 합니다.

유형: SSH, 소스에는 젠킨스 Private IP 주소를 넣어서 운영 서버(백엔드 서버) 접속을 가능하게 합니다.

### 4-4. 운영 서버로의 배포를 위한 파이프라인 스크립트 작성

```shell
pipeline {
    agent any
    tools {
        gradle 'gradle'
    }
    stages {
		stage('저장소 복제') {
            steps {
               git branch: 'develop', credentialsId: 'jenkins-credential-username-password', url: 'https://github.com/woorifisa-projects/GoodFriends'
            }
        }
        stage('백엔드 yml 파일 다운받기') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'secret-application-yml', variable: 'YML'),
                        file(credentialsId: 'secret-application-db-yml', variable: 'DbYML'),
                        file(credentialsId: 'secret-application-oauth-yml', variable: 'OauthYML')
                    ]) {
                        sh 'cp $YML backend/src/main/resources/application.yml'
                        sh 'cp $DbYML backend/src/main/resources/application-db.yml'
                        sh 'cp $OauthYML backend/src/main/resources/application-oauth.yml'
                    }
                }
            }
        }
        stage('백엔드 빌드') {
            steps {
                dir("./backend") {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
            }
        }
        stage('백엔드 배포') {
            steps {
                sshagent(credentials: ['from-jenkins-to-aws-ec2-access-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=yes ubuntu@{백엔드 프라이빗 IPv4 주소} uptime
                        scp /var/jenkins_home/workspace/Goodfriends-pipeline/backend/build/libs/goodfriends-0.0.1-SNAPSHOT.jar ubuntu@{백엔드 프라이빗 IPv4 주소}:/home/ubuntu
                        ssh -t ubuntu@{백엔드 프라이빗 IPv4 주소} chmod +x ./deploy.sh
                        ssh -t ubuntu@{백엔드 프라이빗 IPv4 주소} ./deploy.sh
                    '''
                }
            }
        }
    }
}
```

## 백엔드 배포

그림으로 가져오면 아래와 같습니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-backend-14.png)

운영 서버로의 배포는 앞서 설치한 ssh agent 플러그인을 통해 진행했습니다. 배포 과정에서 진행한 내용은 다음과 같습니다.

먼저 젠킨스 서버에서 운영 서버에 접근할 수 있도록 *StrictHostKeyChecking** 를 비활성화 시켜줍니다. 그 후 scp 명령을 통해 빌드된 jar 파일을 운영 서버로 전송시킨 다음, 운영 서버에 미리 작성된 deploy.sh 파일을 실행하여 빌드된 파일을 실행시켜줍니다.

### jar 파일 전송

SCP(Secure Copy)는 SSH 통신 기반으로 원격지에 파일이나 디렉토리를 전송할 수 있는 프로토콜입니다.
리눅스에서는 scp 명령을 통해 SCP 프로토콜을 사용할 수 있습니다.
우리팀은 이 scp 명령를 통해 스프링부트 애플리케이션이 실행되고 있는 EC2 인스턴스로 빌드된 jar 파일을 전송합니다.

> 여기서 IP 주소는 백엔드 프라이빗 IP 주소로 적혀있습니다. 우리FISA에서 제공하는 EC2 인스턴스의 보안 그룹 설정상 상암 IT 타워의 IP로만 SSH(22번 포트) 인바운드가 허용되어 있습니다. 
> 
> 따라서 퍼블릭 IP 대신 프라이빗 IP로 지정해주었습니다. 
> 
> 프라이빗 IP를 사용해도 두 EC2 인스턴스가 같은 VPC에 존재하므로 정상적으로 접근이 가능합니다.

## 트러블 슈팅

### Secret 파일 Jenkins에서 관리 및  권한 부여

OAuth, DB 설정 정보와 같이 민감한 정보들은 Git에 올라가면 안되고 보안 처리를 해야해서 젠킨스에 관리하도록 설정했습니다.

젠킨스에 빌드시 application.yml 과 같은 secret 파일들에 대한 접근이 허용되지 않아서 에러가 발생했습니다.
그래서 젠킨스 서버에 접속한 뒤 해당 시크릿 파일들이 있는 경로로 이동해서 권한을 부여했습니다.

777을 하면 모든 권한을 부여하기 때문에, 이후에 에러가 발생하지 않고 정상적으로 빌드 처리가 되었습니다. 
하지만, 해당 부분은 완벽한 에러 처리 방법이 아닌 것 같아 추후 개선할 예정입니다.

```shell
# jenkins 서버 접속후 cd /var/workspace/Goodfriends-pipeline/backend/src/main/resourecs 
# chmod 777를 해준다. /rwx : 읽기, 쓰기, 실행 권한 부여
jenkins@1e37d4e1c7f0:~/workspace/Goodfriends-pipeline/backend/src/main/resources$ chmod 777 ./application-sms.yml
```