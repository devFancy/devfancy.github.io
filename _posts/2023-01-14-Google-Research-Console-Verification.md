---
layout: post
title:  " Google Search Console에 GitHub 블로그 등록하기 "
categories: ETC
author: fancy96
---
* content
{:toc}

*  Google 서치 콘솔(구글 웹마스터 도구)을 사용해 내 사이트의 검색 트래픽 및 실적을 측정하고, 문제를 해결하며, Google 검색결과에서 내 사이트가 돋보이게 할 수 있다.

* `Jekyll` 테마에서 구글 검색엔진에 포스트 글들이 검색되도록 설정해보려고 한다.

> 사전에 Google 계정을 만들어야 한다.

## 1단계 : Google Search Console에 URL 등록

* Google 서치 콘솔(Search Console)에 접속한다.

![](/assets/img/etc/Google-Research-Console-Verification_1.png)

* (Google 계정으로 로그인하고)`시작하기` 버튼을 클릭한다.

![](/assets/img/etc/Google-Research-Console-Verification_2.png)

* 속성 유형 선택에서 URL 접두어 유형에서 URL 입력 칸에 내 사이트 도메인(URL)주소를 입력하고 계속 버튼을 클릭한다.

* 여기서 나는 `https://fancy96.github.io/`을 입력했다.

## 2단계 : HTML 파일 github.io 폴더안에 추가

![](/assets/img/etc/Google-Research-Console-Verification_3.png)

* 왼쪽 아래에 설정을 클릭한 다음 우측에 있는 소유권 인증을 클릭한다.

![](/assets/img/etc/Google-Research-Console-Verification_4.png)

![](/assets/img/etc/Google-Research-Console-Verification_4_2.png)

* 여기서 `HTML 파일`을 클릭한 후 아래의 `google~~~.html`파일을 다운로드 하고 내 github.io 폴더안에 추가한다.

![](/assets/img/etc/Google-Research-Console-Verification_5.png)

* 그리고 몇분정도 지나고 새로고침을 하면, "확인이 완료되었습니다." 라는 문구가 뜨게 된다.

## 3단계 : sitemap.xml 파일

* Sitemap.xml(사이트 맵) 파일은 검색 엔진 크롤링 로봇에게 웹 사이트에서 크롤링 해야 할 URL 을 전달한다.

* 사이트 맵을 지원하는 검색 엔진은 이 정보를 사용하여 웹 사이트 크롤링을 보다 효율적으로 할 수 있게 된다.

### sitemap 자동 생성

* _config.yml 파일의 plugins에 아래 코드와 같이  `jekyll-sitemap`이 적혀져 있으면, github 가 자동으로 sitemap.xml 을 생성해주므로 별도의 작업을 안해도 된다.

``` yml
...
plugins:
    - jekyll-paginate
    - jekyll-sitemap
...
```

### sitemap 등록(수동 생성 기준)

![](/assets/img/etc/Google-Research-Console-Verification_6.png)

* 왼쪽 Sitemaps 클릭하여 새 사이트 URL 입력칸에 `sitemap.xml`을 입력한 후에 제출 버튼을 클릭하면 성공이라는 표시가 뜨게 된다.

## 4단계 : robots.txt 파일 생성

* Robots.txt는 검색의 크롤링 로봇이 웹에 접근할 때 로봇이 지켜야하는 규칙과 사이트맵(sitemap) 파일의 위치를 알려주는 역할을 하는 파일이다.

* Robots.txt 파일을 설정하지 않으면 구글 검색엔진 로봇들이 웹 사이트에서 찾을 수 있는 모든 정보를 크롤링하여 검색엔진 검색결과에 노출시키기 때문에, 내 특정 페이지가 검색엔진에 노출되지 않으려면 robots.txt 파일을 설정하여 이를 제어할 수 있다.

* Robots.txt 파일 역시 내 github.io 폴더안에(루트 폴더)에 위치시켰다(sitemap.xml 위치와 동일)

* 나는 다음과 같이 robotx.txt를 설정하였다.

```
User-agent: *
Allow: /

Sitemap: http://fancy96.github.io/sitemap.xml
```

* 이 robots.txt 파일의 의미는 "모든 사용자 에이전트는 전체 사이트를 크롤링할 수 있다" 입니다.

* `Sitemap` 뒤의 URL은 3단계에서 본인이 sitemaps에 등록한 URL 주소를 입력하면 된다.

* 1~2시간 정도 있다가 검색을 하게 되면, 제대로 나오는 것을 확인할 수 있다.

## 추가) rss 등록

* rss는 사이트 내의 새로운 컨텐츠를 정리해놓은 목록이다.

* 유튜브로 비유하자면, 내가 구독한 크리에이터의 새로운 컨텐츠가 나오면 나에게 알림이 오는 기능이다.

* 즉, rss는 직접 사이트를 방문하지 않아도 추가된 내용을 확인할 수 있게 해주는 것이다.

* rss 등록하는 방법은 sitemap 등록하는 것과 같다.


## Reference

* [Github blog를 Google 검색 엔진에 노출시키기](https://burningfalls.github.io/blog/google-search-console/)

* [Robots.txt 파일 작성 및 제출 방법](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=ko)

* [Jekyll 블로그 검색엔진에 등록하기 - NAVER](https://sanghyuk.dev/blog/2/)