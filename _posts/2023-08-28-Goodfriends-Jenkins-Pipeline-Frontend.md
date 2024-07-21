---
layout: post
title: " [Goodfriends] 젠킨스를 사용하여 CI/CD Pipeline 구축기(프론트엔드편) "
categories: Side_Project
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/9)에 게시된 글 입니다.

직전 포스팅에서 굿프렌즈팀 백엔드의 CI/CD를 구축한 방법을 소개해드렸습니다. 이번 포스팅에서는 프론트엔드의 CI/CD를 구축하는 방법을 소개하고자 합니다.

## 프론트엔드 CD 다이어그램

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-1.png)

프론트엔드의 지속적 배포 환경은 백엔드와 크게 다른점은 없습니다. PR이 생성되고, 병합되어 Webhook을 통해 젠킨스 서버에 전달됩니다. 
젠킨스 서버는 Webhook을 이용하여 뷰(Vue) 프로젝트를 빌드하고, 
index.html과 관련 js 파일을 생성합니다. 그리고 생성된 정적 파일들을 프론트엔드 EC2 인스턴스에 있는 NGINX 디렉토리를 통해 전송됩니다.

## 파이프라인 작성

### 1) 사전작업

굿프렌즈팀 프론트엔드 팀은 뷰(Vue)를 사용합니다.

젠킨스에는 백엔드 언어인 Java와 다르게 NodeJs의 빌드를 기본적으로 제공하고 있지 않습니다. 하지만 이를 지원하는 NodeJs 플러그인이 존재하여 사용자는 해당 플러그인을 설치하는 과정만으로 NodeJs 프로젝트를 빌드할 수 있는 환경을 구축할 수 있습니다.

이를 위해 굿프레즈팀은 젠킨스에 NodeJs 플러그인을 설치했습니다.

설치하는 과정은 젠킨스 홈페이지에서 **Dashboard - Jenkins 관리 - Plugins - Available plugins → NodeJs** 선택 후 설치해주면 됩니다. 그런 다음 젠킨스를 재시작해줍니다.

다시 Dashboard - Jenkins 관리 - Tools 에서 아래 그림과 같이 설정한 뒤 저장합니다.

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-2.png)

굿프렌즈팀은 개발 환경에서 node.js 18.12.0 버전을 사용하므로 18.12.0 버전을 선택하고 이름을 **`NodeJS 18.12.0`** 으로 지정했습니다.

### 2) Jenkins 서버에서 Nginx 서버에 접속하기 위한 EC2 SSH 키 추가

Jenkins 관리 → Credentials → Stores scoped to Jenkins 탭에서 System 하이퍼링크 클릭

Global credentials 클릭 → 우측 상단 Add Credentials 선택(Add domain 아님)

> Credentials

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-3.png)

> Systyem

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-4.png)

> Global credentials

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-5.png)

- `Kind`: SSH Username with private key
- `Scope`: Global
- `Username`: ubuntu (linux 계정이름)
- `Password`: 프론트엔드 EC2 서버에 접속할 때 사용하던 pem 키의 값(하단 pem 키 조회참조)
- `ID`: from-jenkins-to-aws-nginx-ec2-access-key
- `Description`: access-key-for-nginx-ec2-server
- `Treat username as secret`: 체크
- `Private Key 탭 하단` -> Enter directly 선택 -> Key 부분 하단 Add 버튼 누른 후 프론트엔드 EC2 서버에 연결할 때 사용되는 pem 키의 내용 입력 후 저장

### 3) 프론트엔드(NGINX) 서버 설정

프론트엔드 운영 서버에서 실행시킬 deploy.sh를 작성해줘야 합니다.

프론트엔드 서버에 ssh 연결한 뒤 deploy.sh를 아래와 같이 작성합니다.

```shell
#!/bin/bash
tar -xvf dist.tar
rm -rf dist.tar
sudo rm -rf /var/www/html/dist # remove origin's dist file
sudo mv dist /var/www/html # move new dist file to /var/www/html
sudo service nginx restart
```

### 4) 프론트엔드 인바운드 규칙 편집

젠킨스 서버에서 프론트엔드 운영 서버로 접속하기 위해 프론트엔드 보안 그룹내에 있는 인바운드 규칙을 설정해줘야 합니다.

`유형`: **SSH, 소스에는 젠킨스 Private IP 주소를 넣어서 프론트엔드 서버 접속을 가능**하게 합니다.

### 5) 5) 운영 서버로의 배포를 위한 파이프라인 스크립트 작성

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
		stage('Copy Repository') {
            steps {
               git branch: 'develop', credentialsId: 'jenkins-credential-username-password', url: 'https://github.com/woorifisa-projects/GoodFriends'
            }
        }
        stage('Frontend secret file download') {
            steps {
                dir("./frontend") {
                    sh 'rm -rf .env'
                }
                script {
                    withCredentials([
                        file(credentialsId: 'secret-env', variable: 'ENV')
                    ]) {
                        sh 'cp $ENV frontend/.env'
                    }
                }
            }
        }
        stage('Frontend Build'){
            steps{
                sh "echo '########### FE MODULE INSTALL AND BUILD START ###########'"
                dir("./frontend"){
                nodejs(nodeJSInstallationName: 'nodejs-18.12.0') {
                        sh 'npm install && npm run build'
                    }
                }
            sh "echo '########### FE MODULE INSTALL AND BUILD SUCCESS ###########'"
          }
        }
        stage('Frontend Compression') {
            steps {
                dir("./frontend") {
                    sh '''
                    rm -rf node_modules
                    tar -cvf dist.tar dist
                    '''
                }
            }
        }
        stage('Frontend Deploy') {
            steps {
                sshagent(credentials: ['from-jenkins-to-aws-nginx-ec2-access-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=yes ubuntu@172.31.34.44 uptime
                        scp /var/jenkins_home/workspace/Goodfriends-pipeline/frontend/dist.tar ubuntu@172.31.34.44:/home/ubuntu
                        ssh -t ubuntu@172.31.34.44 chmod +x ./deploy.sh
                        ssh -t ubuntu@172.31.34.44 ./deploy.sh
                    '''
                }
            }
            post {
                success {
                    slackSend (
                        channel: '#jenkins',
                        color: '#00FF00',
                        message: "프론트엔드 배포 성공! 🚀"
                    )
                }
                failure {
                    slackSend (
                        channel: '#jenkins',
                        color: '#FF0000',
                        message: "프론트엔드 배포 실패 🥲"
                    )
                }
            }
        }
        stage('Backend secret file download') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'secret-application-yml', variable: 'YML'),
                        file(credentialsId: 'secret-application-db-yml', variable: 'DbYML'),
                        file(credentialsId: 'secret-application-oauth-yml', variable: 'OauthYML'),
                        file(credentialsId: 'secret-application-sms-yml', variable: 'SmsYML')
                    ]) {
                        sh 'cp $YML backend/src/main/resources/application.yml'
                        sh 'cp $DbYML backend/src/main/resources/application-db.yml'
                        sh 'cp $OauthYML backend/src/main/resources/application-oauth.yml'
                        sh 'cp $SmsYML  backend/src/main/resources/application-sms.yml'
                    }
                }
            }
        }
        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
            }
        }
        stage('Backend Deploy') {
            steps {
                sshagent(credentials: ['from-jenkins-to-aws-backend-ec2-access-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=yes ubuntu@172.31.39.91 uptime
                        scp /var/jenkins_home/workspace/Goodfriends-pipeline/backend/build/libs/goodfriends-0.0.1-SNAPSHOT.jar ubuntu@172.31.39.91:/home/ubuntu
                        ssh -t ubuntu@172.31.34.44 chmod +x ./deploy.sh
                        ssh -t ubuntu@172.31.39.91 ./deploy.sh
                    '''
                }
            }
            post {
                success {
                    slackSend (
                        channel: '#jenkins',
                        color: '#00FF00',
                        message: "백엔드 배포 성공! 🚀"
                    )
                }
                failure {
                    slackSend (
                        channel: '#jenkins',
                        color: '#FF0000',
                        message: "백엔드 배포 실패 🥲"
                    )
                }
            }
        }
    }
}
```

기존 백엔드 파이프라인을 포함하여 프론트엔드 파이프라인 스크립트를 작성했습니다.

이렇게 파이프라인을 작성한 뒤에 배포를 실행하면 아래와 같이 정상적으로 빌드 및 배포가 완료된 것을 확인할 수 있습니다.

>  2023.08.26(이전)

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-6.png)

>  2023.10.14(최근)

![](/assets/img/goodfriends/goodfriends-jenkins-pipeline-frontend-7.png)

위의 pipeline에 맞게 수정된 jenkins 부분입니다!
(9월 말에 우리FISA로부터 지원이 끊겨서 갑작스럽게 모든 서버 구축(프론트, 백엔드, 젠킨스)을 처음부터 다시 하게 되었습니다ㅠㅠ
하지만, 다시 한번 구축하면서 복습도 할 수 있었고, 동작 원리가 머릿 속에 정리되어서 빠르게 구축하게 되었습니다! 😆)

## 마치며

현재 프론트엔드와 백엔드 모두 develop 브랜치에서 작업을 하다보니 둘 중 어느 한쪽의 코드만 병합(Merge)되어도 프론트엔드, 백엔드 두개의 빌드 프로세스가 실행되는 이슈가 존재합니다.

이후에는 빌드 트리거를 조금 더 세분화하여 Github의 라벨을 기반으로 트리거를 개선하려고 합니다.

긴글 읽어주셔서 감사합니다.  😌