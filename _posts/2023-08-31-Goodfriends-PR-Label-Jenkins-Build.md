---
layout: post
title: " [Goodfriends] PR 라벨로 Jenkins Build 유발 구분하기 🏷 "
categories: Side_Project
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/11)에 게시된 글 입니다.

> 저번에 포스팅 했던 젠킨스를 사용하여 CI/CD Pipeline 구축기(프론트엔드편) 에 이어서 이번 글은 프론트엔드/백엔드의 코드가 PR시 병합되었을 때 라벨로 구분하여 젠킨스를 빌드하는 과정을 소개하고자 합니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-1.png)

현재 굿프렌즈팀의 젠킨에서 빌드 트리거로 `Github hook trigger for GITScm polling`을 사용하고 있습니다.

파이프라인 스크립트 부분에서 아래와 같이 빌드 트리거가 동작하기 위한 스크립트 작성 부분입니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-2.png)

## Repository 구성

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-3.png)

현재 굿프렌즈팀의 레포지토리를 보시면, 프론트엔드와 백엔드 코드가 같이 관리되고 있습니다. 
두 개의 코드 중 하나라도 병합(Merge)되었을 때 프론트엔드, 백엔드 같이 빌드 및 배포되고 있습니다.

PR시 Merge되었을 때 각 트랙별로 코드가 빌드 및 배포될 수 있도록 빌드 트리거를 조금 더 세분화하여 Github의 라벨을 기반으로 트리거를 개선하려고 합니다.

## Github 이슈 라벨로 구분하기

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-4.png)

현재 굿프렌즈팀은 라벨을 이용하여 트랙별 작업 구분을 하고 있습니다.

따라서 이를 이용하여 라벨별로 빌드 및 배포를 진행할 수 있도록 구성하였습니다.

## Generic Webhook Trigger 설치

Plugins - Available plugins에서 `Generic Webhook Trigger` 설치후 재시작합니다.

그런 다음 Plugins - Installed plugins - 설치된 `Generic Webhook Trigger`  가 있는지 확인합니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-5.png)

Generic Webhook Trigger는 젠킨스에서 제공하는 플러그인으로 HTTP 요청을 수신하여 JSON, XML 형태의 데이터를 추출하여 트리거를 지정할 수 있는 플러그인입니다.
Generic Webhook Trigger를 사용하여 빌드 유발 상황을 구분하려고 합니다.

플러그인을 설치했다면 젠킨스 파이프라인의 Build Triggers 설정에서 아래와 같이 Generic Webhook Trigger를 확인할 수 있습니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-6.png)

해당 부분을 클릭하면 아래와 같은 설명을 확인하실 수 있습니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-7.png)

`http://JENKINS_URL/generic-webhook-trigger/invoke` 로 오는 요청에 대해 트리거가 수행된다는 말이 적혀 있습니다.

위 설명에 맞춰 GitHub에서 WebHook 설정을 변경해주어야 합니다.

> 위에서 설명한 탭에 대해서는 아직 저장하지 않고 깃허브로 넘어와서 진행합니다.
>
> 젠킨스 설정은 아래에서 설명하는 Github WebHook 설정 이후에 이어서 진행합니다.

## Github WebHook 설정

기존에 설정된 한개의 Webhook을 확인하실 수 있습니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-8.png)

프로젝트 레포지토리 -> Setting -> Webhook 탭에 들어와서 웹훅을 새로 만듭니다. (Add Webhook 버튼 클릭)

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-9.png)

payload URL: `http://{jenkins 퍼블릭 ip 주소}:80/generic-webhook-trigger/invoke`

Payload URL을 위에서 확인한 **Generic Webhook Trigger**의 설정에 맞게 작성합니다.

그리고 트리거가 동작하는 이벤트에 대해서 **Send me everything** 옵션을 체크합니다.

> Webhooks / Manage webhook

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-10.png)

Add webhook을 한 뒤 다시 등록한 웹 훅을 클릭하여 Recent Deliveries 탭을 확인하면,

> Webhooks / Manage webhook (detail)

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-11.png)

내용을 보면 요청을 보낼 때 Payload에 다양한 정보들이 담겨있는 것을 확인할 수 있습니다.

## Generic Webhook Trigger 설정

젠킨스 파이프라인 설정 구성에 들어와서 작업을 이어나갑니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-12.png)

기존에 설정해둔 GitHub hook trigger for GITScm polling 설정을 해제한 다음, **Generic WebHook Trigger** 를 활성화합니다.

## Post content parameters 설정

Post content parameters의 추가 버튼을 눌러 파라미터를 추가합니다.

> MERGED

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-13.png)

`$.pull_request.merged`를 등록하여 Merge 되었는지 여부를 가져옵니다.

> BRANCH

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-14.png)

`$.pull_request.base.ref`를 등록하여 base 브랜치를 가져옵니다.

원하는 값은 develop 브랜치가 될 것입니다.

> LABELS

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-15.png)

`$.pull_request.labels..name`를 등록하여 라벨들의 이름을 가져옵니다.

원하는 값은 등록된 라벨들 중에 **백엔드**를 포함하는 값이 존재하는 상황이 될 것입니다.

## Optional filter 설정

아래로 내리다 보면 `Optional filter` 탭을 볼 수 있습니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-16.png)

- Expression: (?=.true)(?=.develop)(?=.백엔드).*
- Text: $MERGED $BRANCH $LABELS

Expression에 다음과 같은 정규표현식을 작성했습니다.

`(?=.*true)(?=.*develop)(?=.*백엔드).*`

또한 Text 부분에는 위에서 파라미터로 선언한 값들을 사용했습니다.

위 표현식으로 다음과 같은 효과를 기대할 수 있다.

merge가 **true**이고, 브랜치가 **develop**이고, 라벨에 **백엔드**가 존재하는 작업에 대해 트리거를 수행하는 것을 기대할 수 있습니다.

## Token 설정

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-17.png)

`Token`: goodfriends_build_webhook_token

Token 탭에 토큰 이름을 작성합니다.

그리고 다시 Github - Webhooks로 이동합니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-18.png)

이때 GitHub WebHook 설정에 들어가서 `Payload URL`에 token 파라미터를 포함하도록 수정합니다.

`Payload URL`: http://{jenkins 퍼블릭 ip 주소}:80/generic-webhook-trigger/invoke?token=goodfriends_build_webhook_token

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-19.png)

바로 아래 탭에서 TokenCredential에 토큰에 대한 Secret Key를 추가해주어야 합니다.

외부에서 빌드를 유발하기 위해서는 token을 확인하는 방식이 존재하는데 이때 Jenkins의 Credential에 있는 정보를 기반으로 수행합니다.

> token을 사용하지 않는 경우 계정정보를 입력할 수도 있지만 해당 과정에서는 token을 등록하는 방식을 사용합니다.

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-20.png)

- `Domain`: Global credentials
- `Kind`: Secret text
- `Secret`: goodfriends_build_webhook_token
- `ID`: GoodFriends_Web_Hook_Token
- `Description`: GoodFriends Web Hook Token입니다.

위와 같은 정보로 Secret text를 작성하고 등록하고 적용합니다

## 응답 확인하기

![](/assets/img/goodfriends/goodfriends-pr-label-jenkins-build-21.png)

GitHub의 WebHook 탭의 Recent Deliveries 탭으로 가서 확인해 보면 **Response Body** 값에 응답이 담겨있는 것을 확인할 수 있습니다.

## 트러블 슈팅

젠킨스 - General 부분의 Generic Webhook Trigger 설정 - Token 설정하는 부분에서 많은 시간을 할당했습니다.

```shell
{
  "jobs":null,"message":"Did not find any jobs with GenericTrigger configured! If you are using a token, you need to pass it like ...trigger/invoke?token=TOKENHERE. If you are not using a token, you need to authenticate like http://user:passsword@example.org/generic-webhook... "
} 
```

404 에러와 함께 위 메시지가 반환되었는데, 젠킨스에서 Token에 대해 이해를 하지 못해서 생긴 문제였습니다.

> "외부에서 빌드를 유발하기 위해서는 token을 확인하는데 이때, 젠킨스의 Credential에 있는 정보를 기반으로 수행한다"

즉, Jenkins의 Credential에서 token에 대한 Credential를 추가해 주고, 이를 적용해야 한다는 의미였습니다.

## 마치며

젠킨스의 Generic Webhook Trigger 플러그인을 이용하여 Merge 여부, target branch, label 값을 비교하고 빌드를 유발하는 설정을 했습니다. 
이후에는 백엔드를 기준으로 했기 때문에, 백엔드의 코드가 병합했을 경우에만 젠킨스에서 빌드 및 배포 처리가 됩니다.

경우에 따라 세부적인 검증을 추가할 수 있습니다.

## Reference

- [PR 라벨로 젠킨스 빌드유발을 구분하기](https://blog.pium.life/jenkins-hook-by-label/)