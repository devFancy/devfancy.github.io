---
layout: post
title: " 나만의 GitHub README.md 꾸미기 "
categories: Technology
author: fancy96
---
* content
{:toc}

## Prologue

* 누군가가 나의 GitHub 주소를 방문할 때

    내가 어떤 **분야**에 공부하고 있고, 어떤 **기술**을 가졌는지 

    **보다 쉬운 이해**를 위해서 (+나의 프로필을 꾸미고 싶어서) 만들게 되었다.

(현재) 결과물 : 나의 GitHub README.md(2023.02.06)

![](/assets/img/technology/technology-github-readme_main.png)

## README repo 생성

![](/assets/img/technology/technology-github-readme_1.png)

* repository name을 github user name(본인의 계정 이름)으로 입력하면, `special` repository를 확인할 수 있다.

* Github 접속 -> `Repository` -> `New` 클릭한 후 `Repository name`밑에 **본인의 계정 이름**을 입력하면 된다.

* 그 밑에 `Public` 부분과 `Add a README file` 클릭하고 확인 버튼을 누른다. (README.md 파일은 직접 만들어도 된다)

![](/assets/img/technology/technology-github-readme_2.png)

* 확인 버튼을 클릭하게 되면 다음과 같이 새로운 repository가 생성되고 README.md 파일에 **Hi there 👋**이 보인다.

* 이제 이 `README.md` 파일에서 본인이 원하는 대로 수정해서 **프로필 영역**을 만들어 나가면 된다.

## README Header

![](/assets/img/technology/technology-github-readme_header.png)

* [Readme Header : capsule-render](https://github.com/kyechan99/capsule-render)에 가서 `Markdown` 아래에 있는 코드를 복사한다.

* 복사한 코드 : `![header](https://capsule-render.vercel.app/api?type=wave&color=auto&height=300&section=header&text=capsule%20render&fontSize=90)`

* 해당 코드를 본인의 `README.md` 파일에 붙여넣기를 하는데, `text=`뒤에 하고 싶은 이름 혹은 제목을 써주면 된다.

* 그 밖에 본인에게 맞는 `type`, `color`, `height`, `fontSize`, `fontAlign` 등등 값을 지정해주면 된다.


## GitHub Profile Views Counter

![](/assets/img/technology/technology-github-readme_profile_view.png)

* [GitHub Profile Views Counter](https://github.com/antonkomarev/github-profile-views-counter)에 가서 `Named color` 아래에 있는 코드를 복사해서 나의 `README.md`파일로 가져왔다.

* 복사한 코드 : `![](https://komarev.com/ghpvc/?username=your-github-username&color=green)`

* 여기서 `your-github-username&color` 부분을 `Fancy96&color=blue`으로 수정했다.(나의 계정 이름과 내가 좋아하는 색깔로 바꿨다)

* `Named color` 아래에 있는 코드뿐만 아니라 다른 코드들도 확인해서 본인에게 맞는 코드를 가져와서 응용하면 된다.


## Languages and Tech stack

![](/assets/img/technology/technology-github-readme_5.png)

* [Shields.io](https://shields.io/)에 가서 본인이 직접 입력해서 사용하는 방법이 있다. 

* `https://img.shields.io/badge/<LABEL>-<MESSAGE>-<COLOR>` 형태로 파라미터를 넣어주면, **배경 이미지**가 생성된다. 

    * 추가적으로 `logo`, `logoColor`, `lableColr`등의 여러 쿼리를 함께 사용할 수 있다.

* 하지만, 해당 사이트에 들어가 보면 전부 영어이고, 처음 하는 사람이라면 어떤 것부터 해야 할지 모를 수도 있다.

* 그래서 추천하는 방법은 미리 작성된 코드에서 **특정 부분만 본인이 원하는 대로 수정**해서 사용하면 된다.

* <img src="https://img.shields.io/badge/Spring-6DB33F?style=flat-square&logo=Spring&logoColor=white"/>

* 예를 들어 위처럼 스프링 로고와 'Spring' 문구가 들어간 색상의 배지를 생성하려면 아래의 형식으로 만들 수 있다.

```html
<img src="https://img.shields.io/badge/Spring-6DB33F?style=flat-square&logo=Spring&logoColor=white"/>
```

* `6DB33F`은 Spring의 색상 코드를 의미하고, `logo=` 뒤에 `Spring`은 로고 이름을 의미한다.

* 색상 코드와 사용 가능한 로고의 목록은 [Simpleicons.org](https://simpleicons.org/)에서 확인할 수 있다.


## GitHub Stats 노출하기

* 여러 구글링을 한 결과, 아주 간단하게 만드는 방법을 알았다.

    기존에는 Public Gist를 생성해서 토큰을 발급받아서 이런저런 과정을 거쳐야 하는데, 다행히도 그러한 과정들을 코드로 구현한 오픈소스가 있었다)

* [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)에 가면, 다양한 번역이 있다.

![](/assets/img/technology/technology-github-readme_github_stats.png)

* 영어가 불편하면 `한국어` 버전을 클릭한 다음에 `GitHub 통계` 아래에 있는 코드를 복사 해준다. (기본 값)

* 복사한 코드 : `[![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=anuraghazra)](https://github.com/anuraghazra/github-readme-stats)`

* 여기서 `username=` 뒤에 값을 GitHub 계정의 사용자 명(닉네임 또는 본인의 계정 이름)으로 바꾸고 나의 `README.md`파일에 붙여주면 된다.

* 그 밖에 다양한 설정값(개별 통계 숨기기, 비공개 기여도 수 추가하기, 아이콘 표시하기, 테마 설정하기 등등)들이 있으므로 본인에 맞게 설정해 주면 된다.

* 여기서 나는 **아이콘 표시하기 기능**을 추가로 설정했다. (`아이콘 표시하기` 아래에 코드가 적혀져 있다.)


## Result

최종 결과

![](/assets/img/technology/technology-github-readme_result.png)

* 이렇게 해서 나만의 **GitHub README.md**를 만들었다.

* 처음이라 익숙지 않은 부분들이 있기 때문에, 개발 공부를 하면서 추가적으로 나만의 GitHub README.md를 업데이트하자!


## Reference

* [Readme Header : capsule-render](https://github.com/kyechan99/capsule-render)

* [GitHub Profile Views Counter](https://github.com/antonkomarev/github-profile-views-counter)

* [Shields.io](https://shields.io/)

* [Simpleicons.org](https://simpleicons.org/)

* [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)