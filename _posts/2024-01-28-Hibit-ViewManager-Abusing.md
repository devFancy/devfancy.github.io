---
layout: post
title: " 조회수 어뷰징 방지를 위한 쿠키 기반 로그 관리 "
categories: Hibit
author: devFancy
---
* content
{:toc}

> 이 글은 실제 [히빗 프로젝트(ver.2)](https://github.com/hibit-team/hibit-backend-improved)를 혼자서 개발하면서 경험한 내용을 정리한 글입니다.

> [해당 이슈](https://github.com/hibit-team/hibit-backend-improved/issues/38)에서 고민했던 주제입니다.

아래 부터는 '히빗 프로젝트(ver.2)'를 `히빗2` 라고 줄여서 작성했습니다.

## 문제 상황

일반적으로 **조회수의 의미와 중요성**에 대해 고민과 여러 검색을 통해 알아본 결과, 몇 가지 핵심적인 질문들을 정리해보았다.

* 한 사용자가 게시글을 여러 번 접속할 때, 그때마다 조회수를 증가시켜야 할까요?

* 같은 사용자가 여러 번 접속해도 조회수는 단 한 번만 카운트해야 할까요?

* 사용자가 하루에 한 번만 조회수를 증가시킬 수 있어야 할까요?

* 비회원이 게시글을 열람할 경우에도 조회수를 카운트해야 할까요?

* 회원만이 게시글을 열람할 수 있도록 하고, 그 후에만 조회수를 카운트해야 할까요?

* 한 사용자가 다양한 장소(다른 IP)에서 접속했을 때, 조회수를 어떻게 처리해야 할까요?

조회수가 높다는 것은 게시글의 가치나 정보의 중요성을 나타낼 수 있기 때문에, 특히 커뮤니티 서비스에서는 이 주제에 대해 심도 있게 고민해볼 필요가 있다.
예를 들어, YouTube 같은 서비스에서는 조회수가 수익 창출과 밀접한 관련이 있어 조회수 관리가 매우 중요하다.

히빗2 서비스의 이전 버전(ver.1)에서는 조회수와 관련된 API를 아래와 같이 구현했다.

> 적용전: PostController

```java
@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }
    // ...
    
    @GetMapping("api/posts/{id}")
    @Operation(summary = "/api/posts/{id}", description = "게시글에 대한 상세 페이지를 조회한다.")
    public ResponseEntity<PostDetailResponse> findPost(@PathVariable(name = "id") Long postId) {
        PostDetailResponse response = postService.findPost(postId);
        return ResponseEntity.ok(response);
    }
}
```

이 구현 방식은 조회수 중복 방지에 대해 고려하지 않았기 때문에 다음과 같은 문제가 있었다.

* 비회원도 조회할 때마다 조회수가 증가, 하루에 여러 번 조회 가능

* 한 사용자가 여러 장소(다른 IP)에서 접속해도 조회수가 접속한 수만큼 증가

* 조회수가 증가할 때마다 데이터베이스에 업데이트, 이는 많은 사용자들이 특정 게시글을 자주 조회할 경우 데이터베이스에 큰 부하를 유발할 수 있음

이러한 문제를 인식하고,  조회수의 어뷰징을 방지하기 위한 새로운 접근 방식이 필요했다.

> `어뷰징(Abusing)`이란 의도적인 조작을 통해 조회수나 클릭수를 높이기 위한 일련의 행위

이에 따라 히빗2 서비스에서는 조회수 증가에 대한 새로운 기준을 다음과 같이 설정했다.

* 조회수 증가는 로그인한 회원에게만 허용된다.

* 한 회원은 하루에 한 번만 조회수를 증가시킬 수 있다.

## 어뷰징을 막는 방법

조회수 증가에 대한 어뷰징을 막는 방법을 스스로도 고민해보고, 구글링을 해보면서 대략 4가지 방법으로 추리게 되었다.

1. 전체 게시글 조회 페이지에서 클릭

    * 사용자가 게시글을 클릭할 때마다 조회수가 증가하되, 직접 URL로 접근하는 경우에는 증가하지 않음.

2. 쿠키 사용

    * 사용자가 페이지에 접속할 때마다 쿠키를 통해 조회수 증가 로직이 실행됨. 하지만 악의적인 사용자가 쿠키를 삭제하여 어뷰징할 가능성 있음.

3. IP 또는 Mac Address 사용

    * IP는 장소에 따라 변할 수 있으며, Mac Address를 가져오는 것은 기술적으로 쉽지 않음. 또한, 이들의 긴 길이는 데이터 저장에 부담을 줄 수 있음.

4. DB 이용

    * 조회수 증가를 위해 매번 데이터베이스에 쿼리를 날려야 하며, 많은 사용자들이 동시에 조회할 경우 데이터베이스에 큰 부하를 주게 됨.

결론적으로 `히빗2` 서비스에서는 **쿠키를 사용**하기로 했다. 
HTTP 요청마다 쿠키를 보내주는데, 만약 쿠키값이 커질 경우 네트워크 트래픽에 부담을 줄 수 있다.

하지만 쿠키 표준안인 RFC 2109에 따르면 쿠키는 300개까지 만들 수 있으며, 최대 크기는 4,096바이트(4KB)이고, 하나의 호스트나 도메인에서 **최대 20개**까지 만들 수 있다고 한다.
대부분의 브라우저는 표준안보다 더 적은 개수의 쿠키만을 지원한다.

악의적인 사용자가 쿠키를 삭제하여 어뷰징을 할 수 있지만, 히빗2에서는 조회수가 수익 창출이나 주요 비즈니스에 큰 영향을 미치지 않기 때문에 이 방법을 선택했다.
또한, 이 프로젝트가 학습 목적이기 때문에 쿠키를 사용하는 경험도 유용하다고 생각했다.

## 해결 : 조회수 관리, 쿠키 사용

히빗2 서비스에서는 조회수 관리의 정확성을 높이기 위해 `ViewCountManager`라는 새로운 클래스를 도입했다.
이 클래스는 쿠키에 저장된 게시글 조회 로그를 파싱하는 역할이다.

쿠키에는 한 도메인당 최대 20개의 항목만 저장할 수 있는 제한이 있다.
이를 극복하기 위해, `ViewCountManager`는 하나의 쿠키에 여러 게시글의 ID를 기록하는 방식으로 조회수 관리 로직을 구현했다.

> 조회수 관리 : `ViewCountManager`

```java
@Component
public class ViewCountManager {
    private static final String DATE_LOG_DELIMITER = "&";
    private static final String DATE_AND_ID_DELIMITER = ":";
    private static final String ID_DELIMITER = "/";
    private static final int DATE_INDEX = 0;
    private static final int LOG_INDEX = 1;

    // <DATE>:1/2/3&
    public boolean isFirstAccess(String logs, Long postId) {
        Map<Integer, String> dateLogs = extractDateLogs(logs);
        int today = LocalDateTime.now().getDayOfMonth();
        String todayLog = dateLogs.get(today);
        if (Objects.isNull(todayLog)) {
            return true;
        }
        return isLogNonExist(todayLog, postId);
    }

    private Map<Integer, String> extractDateLogs(String logs) {
        Map<Integer, String> dateLogs = new HashMap<>();
        String[] logsPerDate = logs.split(DATE_LOG_DELIMITER);
        for (String logPerDate : logsPerDate) {
            dateLogs.putAll(divideDateAndLog(logPerDate));
        }
        return dateLogs;
    }

    private boolean isLogNonExist(String log, Long postId) {
        List<Long> loggedPostIds = Arrays.stream(log.split(ID_DELIMITER))
                .map(Long::parseLong)
                .collect(Collectors.toList());
        return !loggedPostIds.contains(postId);
    }

    private Map<Integer, String> divideDateAndLog(String logPerDate) {
        if (logPerDate.isEmpty()) {
            return Collections.emptyMap();
        }
        String[] dateAndLog = logPerDate.split(DATE_AND_ID_DELIMITER);
        int date = Integer.parseInt(dateAndLog[DATE_INDEX]);
        String log = dateAndLog[LOG_INDEX];
        return Map.of(date, log);
    }

    public String getUpdatedLog(String logs, Long postId) {
        if (!isFirstAccess(logs, postId)) {
            return logs;
        }
        Map<Integer, String> dateLogs = extractDateLogs(logs);
        int today = LocalDateTime.now().getDayOfMonth();
        String updatedLog = appendLog(dateLogs.get(today), postId);
        return today + DATE_AND_ID_DELIMITER + updatedLog;
    }

    private String appendLog(String log, Long postId) {
        if (Objects.isNull(log) || log.isEmpty()) {
            return Long.toString(postId);
        }
        return log + ID_DELIMITER + postId;
    }
}
```

이 방식을 사용하면, 로그 문자열은 다음과 같은 형태를 갖는다.

```
<날짜>:<PostID>/<PostID>/<PostID>&<날짜>:<PostID>/<PostID>&...
```

이를 통해 날짜에 어떤 포스트가 조회되었는지 추적할 수 있다.
예를 들어, 쿠키에 "27:1/2/3&28:4/5"라는 값이 저장되어 있다면, 이는 27일에 게시글 1, 2, 3이 조회되었고, 28일에는 게시글 4, 5가 조회되었음을 나타낸다.

PostService는 이전에 해당 게시글을 조회하지 않았던 경우에만 조회수를 데이터베이스에 업데이트하는 로직을 구현했다.

> 적용후: `PostService`

```java
@Service
@Transactional(readOnly = true)
public class PostService {
    private final PostRepository postRepository;
    private final ViewCountManager viewCountManager;
    
    // ...

    @Transactional
    public PostDetailResponse findPost(final Long postId, final LoginMember loginMember, final String cookieValue) {
        if (viewCountManager.isFirstAccess(cookieValue, postId)) { // 해당 게시글에 처음 방문했다면
            postRepository.updateViewCount(postId);
        }
        Post foundPost = findPostObject(postId);
        return PostDetailResponse.of(foundPost, loginMember);
    }

    public String updatePostLog(final Long postId, final String cookieValue) { // 다른 게시글ID를 포함한 로그를 쿠키에 저장
        return viewCountManager.getUpdatedLog(cookieValue, postId);
    }

    private Post findPostObject(final Long postId) {
        List<Post> posts = postRepository.findPostById(postId);
        if (posts.isEmpty()) {
            throw new NotFoundPostException();
        }
        return posts.get(0);
    }
}
```

`PostService`에 대한 테스트 코드로 검증한 결과 정상적으로 나오는 걸 확인할 수 있다.

![](/assets/img/hibit/Hibit-ViewManager-Abusing-2.png)

`PostController`에서는 `PostService`를 통해 게시글 상세 정보를 가져오고, 쿠키를 업데이트하여 조회 로그를 관리한다.

> 적용후: `PostController`

```java
@Tag(name = "posts", description = "매칭 게시글")
@RestController
public class PostController {

    private final PostService postService;

    @GetMapping("api/posts/{id}")
    @Operation(summary = "/api/posts/{id}", description = "게시글에 대한 상세 페이지를 조회한다.")
    public ResponseEntity<PostDetailResponse> findPost(@PathVariable(name = "id") final Long postId,
                                                       @AuthenticationPrincipal final LoginMember loginMember,
                                                       @CookieValue(value = "viewedPost", required = false, defaultValue = "") final String postLog) {
        PostDetailResponse response = postService.findPost(postId, loginMember, postLog);
        String updatedLog = postService.updatePostLog(postId, postLog);
        ResponseCookie responseCookie = ResponseCookie.from("viewedPost", updatedLog).maxAge(86400L).build(); // 86400L: 1일(24시간)
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(response);
    }
}
```

추가적으로 쿠키에 대한 maxAge를 설정하지 않으면 브라우저가 종료될 때 쿠키가 사라지는 문제가 생긴다.
따라서 이를 방지하기 위해 쿠키의 maxAge를 1일(24시간)으로 설정했다.

특정 게시글에 대한 조회 API를 `Postman`으로 확인한 결과 아래와 같이 `viewedPost` 값이 제대로 나오는 것을 확인할 수 있다.

![](/assets/img/hibit/Hibit-ViewManager-Abusing-1.png)

## 마무리

어뷰징 방지를 위해 조회수 증가 기준을 설정하고, 이를 쿠키를 통해 구현하는 과정을 진행했다.
악의적인 사용자가 쿠키를 삭제하여 어뷰징을 할 수 있으나, 현재 히빗2 서비스에서는 조회수가 수익이나 비즈니스에 큰 영향을 미치지 않아 문제가 되지 않는다.
또한, 쿠키에 저장된 정보는 날짜와 게시글 ID에 불과하므로, 정보가 탈취되어도 큰 문제가 없다.

쿠키의 표준에 따라 하나의 도메인에 최대 20개의 쿠키만 저장할 수 있으므로, 대안으로 하나의 쿠키에 `"<DATE>/1/2/3/"` 같은 형식으로 여러 게시글 ID를 문자열로 저장하고 분할하는 방식을 선택했다.
하지만, 사용자 수가 증가하면 쿠키의 한계에 부딪힐 수 있다.
이를 해결하기 위해 인메모리 데이터 저장소인 Redis를 활용하여 IP나 MAC 주소와 게시글을 key-value 구조로 저장하는 방법을 고려할 수 있으나, 조회수가 현재 서비스에 큰 영향을 주지 않아 이 방법은 채택하지 않았다.

이후에 조회수가 현재보다 더 중요한 가치로 생긴다면, 그때가서 다시 한번 고민해보고 더 나은 개선 방안을 생각해보자.

## Reference

* [조회수 어뷰징은 어떻게 막아야 할까?](https://ssdragon.tistory.com/118)

* [커뮤니티 서비스 조회수 구현하기](https://velog.io/@hyunrrr/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A1%B0%ED%9A%8C%EC%88%98-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)