---
layout: post
title: " JMeter를 활용한 성능 테스트 도입 "
categories: Hibit
author: devFancy
---
* content
{:toc}

> 이 글은 실제 [히빗 프로젝트(ver.2)](https://github.com/hibit-team/hibit-backend-improved)를 혼자서 개발하면서 경험한 내용을 정리한 글입니다.

* 예상 독자: 성능 테스트에 대한 도구와 설치 과정에 대해 궁금한 개발자

* 아래 글부터는 히빗 프로젝트(ver.2) 를 `히빗2`로 줄여서 작성했습니다.

## 도입 배경

히빗2 서비스에서 특정 게시글에 대한 조회를 할 때마다 조회수 1이 증가되도록 했다.

사용자 1명이 특정 게시글에 대한 조회를 할 때 1이 증가하는 것을 확인하기 위해 테스트 코드를 작성했다.

```java
class PostServiceTest extends IntegrationTestSupport {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PostService postService;

    @AfterEach
    void tearDown() {
        postRepository.deleteAll();
        profileRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @DisplayName("특정 게시글을 조회하면 조회수를 1 증가시킨다.")
    @Test
    void 특정_게시글을_조회하면_조회수를_1_증가시킨다() {
        // given
        Member 팬시 = 팬시();
        memberRepository.save(팬시);
        Member member = memberRepository.getById(팬시.getId());

        Profile 팬시_프로필 = 팬시_프로필(member);
        Profile profile = profileRepository.save(팬시_프로필);
        memberRepository.save(팬시);

        Post post = 프로젝트_해시테크(profile.getMember());
        postRepository.save(post);

        // when
        int viewCount = post.getViewCount();
        postService.findPost(post.getId());
        int updatedViewCount = postRepository.findById(post.getId()).get().getViewCount();

        // then
        Assertions.assertThat(viewCount + 1).isEqualTo(updatedViewCount);
    }
}
```

이런 경우에는 문제 없이 잘 동작하는 것을 확인했다.

여기서 만약 동시 사용자가 100명이 10초동안 5번 반복했을 때, 오류 없이 조회수 증가가 제대로 처리되고 있는지 확인하고 싶었다.

그래서 성능 테스트를 도입하게 되었고, 이번 글에서는 성능 테스트를 위한 서버 환경을 구축하고 재연하는 과정을 시도했다.

> 성능 테스드에 대한 개념을 학습한 과정은 이전에 [성능 테스트, 부하 테스트, 스트레스 테스트란](https://devfancy.github.io/Technology-Performance-Testing/)에 정리했다.

## 성능 테스트 도구

### JMeter (Star 7.7K)

[Jmeter](https://github.com/apache/jmeter) 는 아파치 소프트웨어 재단에서 개발한 성능 테스트를 위한 도구로 순수 100% Java로 개발한 웹 애플리케이션이다.

웹 애플리케이션 서버 성능 테스트를 위해 개발했지만, 현재는 데이터베이스, 파일 시스템, FTP, TCP 등 다양한 애플리케이션/서버/프로토콜 유형의 성능을 테스트할 수 있게 발전되었다.

![](/assets/img/hibit/Hibit-Performance-Testing-1.png)

`Jmeter`은 [최근 2주전](https://github.com/apache/jmeter/releases/tag/rel%2Fv5.6.3)까지 릴리즈하는 만큼 많은 릴리즈와 개선 사항을 통해 고도로 유지 및 관리하고 있다.
그리고 스프링과 통합하기 위한 여러가지 다양한 플러그인을 제공한다. 

하지만, 애플리케이션 자체가 오래되어서 복잡한 스크립트와 문서가 가독성이 좋지 않다.  

또한 `Jmeter`는 단계별 스레드 할당 방식이라고 해서 스레드가 하나 생성될 때마다 리소스를 새로 할당해야 한다. 
그래서 하나의 Worker에서 1000개 이상의 스레드를 할당하게 되면 조금 무리가 있을 수 있다. 즉, 한 대의 Wokrer에서 사용할 수 있는 사용자 수가 **매우 한정적**이라는 말이다.

![](/assets/img/hibit/Hibit-Performance-Testing-2.png)

그리고 실제로 `Jmeter`를 설치해서 사용해봤지만, 위에 나온 그림처럼 기본적으로 제공되는 그래프가 나한테는 그렇게 이쁘지 않는 것 같다는 생각이 들었다.

### nGrinder (Star. 1.9K)

[nGrinder](https://github.com/naver/ngrinder) 는 서버 성능 테스트를 위해 Naver가 'The Grinder'를 기반으로 개발한 오픈소스 성능 테스트 도구이며 국내 개발자들이 많이 사용한다.

성능 측정 도구로 `nGrinder`는 `groovy` 스크립트로 테스트 시나리오를 작성할 수 있다는 것이다.
그래서 기존에 Junit 테스트에 관심이 있는 개발자라면 거부감 없게 쓸 수 있을 정도로 비슷하다는 평을 받고 있다.

한국 기업인 네이버가 개발하고 유지보수하는 만큼 도구 자체에서 한국어를 지원한다. (물론, 나는 찾지 못했지만) 한국어로 작성된 문서는 못본 것 같다.

또한 완성도 높은 뼈대 코드를 지원해준다. (스크립트 이름 + 도메인 주소 + 요청을 보낼 API)
실제로 스크립트 이름과 도메인 주소, API 주소만 입력하면 완성도 높은 뼈대를 지원해준다.

`nGrinder`는 Controller, Agent, Target으로 구성된다.
* `Controller`는 WAS 기반으로 웹 브라우저에 접속하여 테스트를 위한 웹 인터페이스를 제공하며, `Agent`에게 신호를 보내 테스트 스크립트를 실행 및 `nGrinder`에 대한 전반적인 기능 관리를 제공한다.

* `Agent`는 직접 부하를 발생시키는 머신이고, `Controller`로부터 신호를 받아 동작한다.

* `Target`은 부하가 발생할 대상 서버를 의미한다.

WAS 기반으로 동작하기 때문에 젠킨스 같이 개발자 각각의 계정을 가질 수 있고, 계정별 부하 테스트 히스토리를 관리할 수 있는 장점이 있다.
반면, `nGrinder` 자체가 프로세스가 분리되어 있어서 `Controller`와 `Agent`를 각각 따로 실행해줘야 한다는 단점이 있다.

그리고 `groovy`라는 문법이 흔하지 않아서 IDE를 지원해주지 않는 경우가 많다. 그래서 `nGrinder` 내부에 직접 작성해야 한다는 불편함이 있다.

## JMeter로 선택

두 도구를 비교하여 초기에는 `nGrinder`를 먼저 사용해보았으나, 설치하는 과정이 생각보다 번거로웠고, 참고할 레퍼런스 자료가 많지 않았다.
또한, `Jmeter`는 최근까지(2주전) 릴리즈가 이루어져 활발하게 업데이트가 이루어지고 있었지만, `nGrinder`는 [마지막 릴리즈](https://github.com/naver/ngrinder/releases/tag/ngrinder-3.5.8-20221230) 날짜가 2022년 12월 30일 정도로 1년 가까이 최신화가 잘되어 있지 않았다.
`nGrinder`를 활용하려면 Controller, Agent 각각 별도의 서버를 구축하고 실행해야 하는데, 현재 히빗2는 백엔드 서버 EC2 서버 한개만 있었고, 추가 서버를 두는 것이 번거로웠고 비용적인 측면에서도 조금은 부담이 되었다.

반면에 `Jmeter`는 기본적으로 GUI로 제공되고 있고, 학습 비용이 낮고 빠르게 테스트 시나리오를 작성할 수 있다.
만약 히빗2 프로젝트가 개인 프로젝트가 아닌 팀 프로젝트이고 실제 서비스를 해야하는 상황이라면 `nGrinder`를 사용할텐데, 지금은 **게시글 조회에 대한 성능 테스트만 하는게 주 목적**이였다.

또한 `Jmeter`는 자체적으로 Plugin Manager를 내장하고 있어서 별도의 설정 없이 플러그인을 설치할 수 있다.

이러한 이유로 히빗2에서는 **높은 점유율과 확장성, 풍부한 레퍼런스, 낮은 초기 학습 비용 등을 고려하여 `Jmeter`를 사용**하게 되었다.

## JMeter 설치

![](/assets/img/hibit/Hibit-Performance-Testing-3.png)

Apache JMeter 공식 웹 사이트에서 Binaries 부분 아래에 `apache.jmeter-5.6.3.zip`를 다운받는다.

해당 파일을 다운로드 받은 뒤 압축을 풀고, `bin` 디렉터리에서 아래와 같은 명령어를 입력한다.

```shell
$ ./jmeter.sh
```

![](/assets/img/hibit/Hibit-Performance-Testing-4.png)

그러면 `Jmeter`가 실행되면서 위와 같은 창이 나오게 된다.

## JMeter 테스트하기

[1] Jmeter = Thread Group 생성

> 테스트 계획 우클릭 -> 추가 -> 쓰레드들 -> 쓰레드 그룹 선택

![](/assets/img/hibit/Hibit-Performance-Testing-5.png)

* 쓰레드들의 수(사용자 수, Number of Threads) : 모든 Thread 개수(가상의 사용자 수)

* Ramp-up 시간(단위: 초, Ramp-Up Period) : 쓰레드 수들을 얼마 시간 동안 테스트할지에 대한 설정

* Loop Count: 한 Thread당 모두 몇 번의 테스트를 수행하는 지 정의

ex. `쓰레드들의 수`가 1000이고, `Ramp-up 시간`이 10이라면 동시의 사용자 1000명이 10초 안에 실행한다는 걸 의미한다.

    만약 `쓰레드들의 수`가 1000, `Loop Count`이 5이라면, 1000명이 5번 요청해서 총 10,000번의 요청이 전송되는 걸 의미한다.

    그래서 `쓰레드들의 수`가 1000이고, `Ramp-up 시간`이 10, `Loop Count`이 5이면 동시의 사용자 1000명이 10초 안에 실행하는 것을 5번 반복한다는 걸 말한다. (총 5,000번의 요청이 전송됨)

나는 100, 10, 5 순으로 입력했다. -> 동시 사용자 100명이 10초동안 5번 반복하도록 실행한다. (500번)

[2] Jmeter - HTTP Request 생성

> 쓰레드 그룹 우클릭 -> 추가 -> 표본추출기 -> HTTP 요청(Request) 선택

![](/assets/img/hibit/Hibit-Performance-Testing-6.png)

[+] HTTP 헤더 관리자 추가

> HTTP 요청(Request) 우클릭 -> 추가 -> 설정 엘리먼트 -> HTTP 헤더 관리자

![](/assets/img/hibit/Hibit-Performance-Testing-7.png)

필자는 히빗2 서비스에 구글 소셜 로그인을 이용했기 때문에 Header 이름에 `Authorization`을 넣고, 값에는 액세스 토큰/리프레시 토큰 값을 넣었다.

[3] Jmeter - `요약 보고서`, `결과 그래프`, `결과들의 트리 보기` 추가

> 쓰레드 그룹(히빗2 테스트) -> 추가 -> 리스너 -> 원하는 형태의 결과창 선택

[4] 실행 후 결과 확인

![](/assets/img/hibit/Hibit-Performance-Testing-8.png)

요약 보고서를 통해 결과를 확인해보니, 다행히 오류없이 정상적으로 처리가 되었다.

여기서 처리량은 `TPS`(초당 처리한 요청 수)를 의미한다.

`TPS`는 Transaction Per Seconds의 약자로 **요청 단위로 초당 얼마나 많은 요청을 처리할 수 있는지에 대한 수치**이다. (= 초당 처리된 트랜잭션 수)

**`TPS`가 높을수록 시스템이 더 많은 요청을 처리할 수 있음**을 의미하기 때문에 성능 테스트에 있어 **중요한 지표**로 여겨진다.

`JMeter` 도구에서 측정하는 `TPS`는 우리가 설정한 테스트 구성을 가지고 결과를 측정하기 때문에 설정값을 가지고 해당 테스트 상에서 최대 TPS 값을 구할 수 있다.

앞으로 이 TPS라는 지표를 활용하여 서비스의 성능이 개선되었음을 판단할 예정이다.

> 24.01.24 추가) JMeter Plugins 설치 - Transactions Per Second

[Custom Plugins for Apache JMeter](https://jmeter-plugins.org/?search=jpgc-graphs-basic) 사이트에서 `Download Version` 아래 2.0 부분 클릭해서 다운로드 후 압축 해제한다.

![](/assets/img/hibit/Hibit-Performance-Testing-9.png)

압축 해제한 이후에 jar 파일들을 jmeter 폴더(`apache-jmeter-5.6.3/lib/ext/`)안에 넣는다.

그리고 jmeter을 재실행후 왼쪽 메뉴 영역에서 `히빗2` 우클릭으로 `jp@gc 관련 플러그인이 잘 포홤되었는지 확인한다`

그러면 아래와 같이 플러그인 옵션이 생기는 걸 확인할 수 있다.

![](/assets/img/hibit/Hibit-Performance-Testing-10.png)

## Reference

* [Apache JMeter를 이용한 부하 테스트 및 리포트 생성](https://creampuffy.tistory.com/209)

* [Performance Testing with JMeter](https://medium.com/geekculture/performance-testing-with-jmeter-af94a397cd0b)

* https://www.youtube.com/watch?v=YGYQ-f01TjE