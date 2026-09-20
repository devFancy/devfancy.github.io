---
title: "[Goodfriends] 시스템 장애를 미리 예방하기 위해 Amazon CloudWatch를 활용"
date: 2023-10-13
categories: ["프로젝트"]
tags: ["사이드프로젝트"]
---

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/24)에 게시된 글 입니다.

`Amazon CloudWatch`가 무엇이고 왜 도입해야 하는지 알고 넘어가려고 합니다.

## 도입 배경

> 모니터링 없이 시스템을 운영하게 된다면 마치 계기판을 보지 않고 자동차를 운전하는 것과 같다는 이야기가 있습니다.
시스템 장애는 곧바로 서비스 중지로 이어질 수 있기 때문에 시스템 모니터링은 그만큼 중요합니다.
따라서 시스템 관리자는 지속적으로 시스템의 상태를 모니터링하고 분석하여 미래에 발생할 수 있는 예기치 않는 장애에 대비해야 합니다.

시스템 관리자는 시스템의 다음 요소들을 모니터링할 필요가 있습니다.
- CPU 사용률
- 메모리 사용률
- 디스크 사용률
- 네트워크 부하

`Amazon CloudWatch`은 AWS 리소스와 온프레미스 서버에서 CPU 사용률, 디스크 I/O, 네트워크 부화 등과 같은 기본 지표를 수집하여 모니터링 서비스를 제공하고 있습니다. 

현재 굿프렌즈의 백엔드, 프론트 EC2 인스턴스 유형은 t2.micro입니다. 1GB 메모리, 8GB 디스크 사용량으로 아주 작은 사이즈입니다.

간혹 서비스를 운영하다보면 특히 비즈니스 로직이 많이 들어있는 백엔드 EC2 서버 디스크 용량이 50% 이상 넘길 수도 있습니다.

그래서 인스턴스의 디스크 사용량이 전부 차기전에 미리 알아야 하기 때문에, **EC2 인스턴스의 사용중인 용량이 4GB 넘어가면 (50% 이상) Amazaon Cloudwatch를 통해 모니터링을 하고 알림을 받을 수 있도록 설정**을 하려고 합니다.

아래 글은 백엔드 기준, EC2 인스턴스의 디스크 사용량을 체크하기 위해서 CloudWatch 적용하는 방법을 소개해드리고자 합니다.

## EC2 서버에 Amazon CloudWatch 적용하는 과정

굿프렌즈 백엔드 EC2 애플리케이션 및 OS 이미지는 아래와 같습니다.

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_1.png)


### IAM 역할 설정

먼저 EC2에 CloudWatch 서비스에 대한 엑세스 권한을 부여해야 한다.

1. AWS Management 콘솔에서 IAM 접속
2. 액세스 관리 - 역할 - 역할 만들기 클릭
3. 신뢰할 수 있는 엔터티 선택 설정 및 다음
- 신뢰할 수 있는 엔터티 유형 - AWS 서비스
- 사용 사례 - EC2

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_2.png)

4. 권한 추가
- CloudWatchAgent 검색
- CloudWatchAgentServerPolicy 선택
- 다음 클릭

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_3.png)

5. 이름 지정, 검토 및 생성
- 역할 이름 - ec2-monitoring (원하는 이름으로 해도 상관없다.)
- 역할 이름 지정 후 역할 생성

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_4.png)

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_5.png)

6. EC2 인스턴스에 IAM 적용

- EC2 인스턴스로 이동
- CloudWatch를 붙이고 싶은 인스턴스 클릭
- 작업 - 보안 - IAM 역할 수정

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_6.png)

- IAM 역할에 방금 만들어둔 role 선택후 저장

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_7.png)

### CloudWatch 에이전트 설치

1. ssh를 통해 EC2 인스턴스에 접속
2. CloudWatch 에이전트 다운로드
- 운영체제 별로 패키지 파일이 다르다. 본 글에서는 ubuntu를 사용하기 때문에 ubuntu 20.04 기준으로 작성

```shell
cd /tmp 
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
```

- 실행 결과

```shell
/tmp$ wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
--2023-10-13 08:27:01--  https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
Resolving s3.amazonaws.com (s3.amazonaws.com)... 52.217.44.206, 52.217.161.112, 54.231.171.168, ...
Connecting to s3.amazonaws.com (s3.amazonaws.com)|52.217.44.206|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 98300736 (94M) [application/octet-stream]
Saving to: ‘amazon-cloudwatch-agent.deb’

amazon-cloudwatch-a 100%[===================>]  93.75M  7.72MB/s    in 13s     

2023-10-13 08:27:15 (6.95 MB/s) - ‘amazon-cloudwatch-agent.deb’ saved [98300736/98300736]
```

3. CloudWatch 에이전트 설치

```shell
/tmp$ sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
Selecting previously unselected package amazon-cloudwatch-agent.
(Reading database ... 96276 files and directories currently installed.)
Preparing to unpack ./amazon-cloudwatch-agent.deb ...
create group cwagent, result: 0
create user cwagent, result: 0
Unpacking amazon-cloudwatch-agent (1.300028.4b233-1) ...
Setting up amazon-cloudwatch-agent (1.300028.4b233-1) ...
```

4. CloudWatch 설정 파일 생성

```shell
/tmp$ sudo vim /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

- 아래 파일처럼 설정하면 / (root)에 대한 disk 사용량을 1시간마다 수집한다.

```shell
{
  "agent": {
    "metrics_collection_interval": 3600
  },
  "metrics": {
    "append_dimensions": {
        "InstanceId": "${aws:InstanceId}"
    },
    "metrics_collected": {
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 3600,
        "resources": [
          "/"
        ]
      }
    }
  }
}
```

5. cloud watch 재시작 및 로그 확인

```shell
// cloud watch 재시작
sudo systemctl restart amazon-cloudwatch-agent

// 로그 확인
tail -f /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log

// 인스턴스 재부팅시에 자동으로 재시작
sudo systemctl enable amazon-cloudwatch-agent
```

- 실행 결과

```shell
ubuntu@{Private Ip Adress}:/tmp$ sudo systemctl restart amazon-cloudwatch-agent
ubuntu@{Private Ip Adress}:/tmp$ tail -f /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log
2023-10-13T08:31:03Z I! creating new logs agent
2023-10-13T08:31:03Z I! [logagent] starting
2023-10-13T08:31:03.943Z	info	service/telemetry.go:96	Skipping telemetry setup.	{"address": "", "level": "None"}
2023-10-13T08:31:03.959Z	info	service/service.go:131	Starting CWAgent...	{"Version": "1.300028.4b233", "NumCPU": 1}
2023-10-13T08:31:03.959Z	info	extensions/extensions.go:30	Starting extensions...
2023-10-13T08:31:03Z I! cloudwatch: get unique roll up list []
2023-10-13T08:31:03.967Z	info	ec2tagger/ec2tagger.go:435	ec2tagger: Check EC2 Metadata.{"kind": "processor", "name": "ec2tagger", "pipeline": "metrics/host"}
2023-10-13T08:31:03Z I! cloudwatch: publish with ForceFlushInterval: 1m0s, Publish Jitter: 31.292800063s
2023-10-13T08:31:03.970Z	info	ec2tagger/ec2tagger.go:411	ec2tagger: EC2 tagger has started, finished initial retrieval of tags and Volumes	{"kind": "processor", "name": "ec2tagger", "pipeline": "metrics/host"}
2023-10-13T08:31:03.971Z	info	service/service.go:148	Everything is ready. Begin running and processing data.
^C
ubuntu@{Private Ip Adress}:/tmp$ sudo systemctl enable amazon-cloudwatch-agent
Created symlink /etc/systemd/system/multi-user.target.wants/amazon-cloudwatch-agent.service → /etc/systemd/system/amazon-cloudwatch-agent.service.
```

- 이제 CloudWatch에서 EC2 디스크 사용량을 확인할 수 있다.

## CloudWatch에서 확인

1. CloudWatch - 지표 - 모든 지표 - 찾아보기 - CWAgent
- 최초 실행시에는 로그 수집까지 5분 정도 소요 될 수 있다.

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_8.png)

- InstanceId, device, fstype, pat - 등록한 인스턴스 클릭
- 이제 상단 그래프에 현재 디스크 사용량이 표시된다.
- 아래 예시의 경우 서비스에 대한 기능을 실제 테스트 하기 전이므로 전체 디스크를 0%를 사용하고 있다.

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_9.png)

## Cloud Watch 알림 설정

1. 경보 생성
- CloudWatch - 경보 - "경보 생성" 버튼 클릭

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_10.png)

- 지표 선택

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_11.png)

- CWAgent - InstanceId, device, fstype, path3 - CloudWatch를 붙여둔 instance

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_12.png)

- 지표 및 조건 지정 
  - 기간 - 1시간으로 변경 
  - 1시간마다 디스크의 사용량을 확인

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_13.png)

- 조건: 디스크의 사용량이 50% 이상일 때 알림을 준다.

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_14.png)

- 작업 구성 
  - 주제가 이미 존재한다면 기존 주제 사용 
  - 주제가 없다면 아래 예시처럼 주제 구성 후 주제 생성

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_15.png)

- 주제 생성 후 기존 SNS 주제 선택 및 “다음” 선택

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_16.png)

- 이름 및 설명 추가

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_17.png)

- 경보 생성
- 위의 주제에서 등록한 이메일에서 confirm (최초만 적용)

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_18.png)

이제 Test 인스턴스의 용량이 50% 이상을 사용한다면 이메일로 알림이 온다.

![](/assets/img/goodfriends/Goodfriends_Aws_CloudWatch_result.png)

이것으로 AWS EC2 인스턴스에 CloudWatch 적용하는 과정을 마치겠습니다.

지금까지 읽어주셔서 감사합니다.

## Reference

- [[AWS] CloudWatch로 EC2 디스크 사용량 모니터링 및 알림 받기](https://systorage.tistory.com/entry/AWS-CloudWatch%EB%A1%9C-EC2-%EB%94%94%EC%8A%A4%ED%81%AC-%EC%82%AC%EC%9A%A9%EB%9F%89-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EB%B0%8F-%EC%95%8C%EB%A6%BC%EB%B0%9B%EA%B8%B0)

- [Amazon CloudWatch를 이용한 효율적인 윈도 서버 모니터링](https://aws.amazon.com/ko/blogs/korea/using-cloudwatch-to-monitor-windows-server-metrics-effectively/)