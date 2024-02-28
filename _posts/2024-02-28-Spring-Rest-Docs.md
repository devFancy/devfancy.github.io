---
layout: post
title:  " [Hibit] Spring Rest Docs 적용기 "
categories: Hibit
author: devFancy
---
* content
{:toc}

## 전환하는 이유

`Swagger`는 **API 동작을 테스트하는 용도**에 더 특화되어 있습니다.

그래서 프론트와 백엔드에서 테스트 유무를 확인할 때는 용이했습니다.

기존 version1 에 개발했던 Hibit은 `Swagger`로 API 문서를 만들었습니다.

그러나 `Swagger`를 적용하면서 **백엔드 코드에 `Swagger`와 관련된 어노테이션이 추가**되는데, 이로 인해 코드 내부에 **기능과 문서가 혼합되어 깔끔하지 않은 코드**가 되었습니다.

예를 들어, 게시글을 등록하는 API 부분의 코드는 다음과 같습니다.

> 기존 version1 - PostController

```java
@Tag(name = "posts", description = "게시글")
@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/api/posts/new")
    @Operation(summary = "/api/posts/new", description = "매칭 게시글 작성")
    @Parameters({
            @Parameter(name = "title", description = "제목", example = "디뮤지엄 전시 보러가요"),
            @Parameter(name = "exhibition", description = "가고싶은 전시회", example = "오스틴리 전시회"),
            @Parameter(name = "exhibitionAttendance", description = "전시 관람 인원", example = "4"),
            @Parameter(name = "possibleTime", description = "관람 희망 날짜", example = "[\"2023-12-25\"]"),
            @Parameter(name = "openChatUrl", description = "오픈 채팅방 URL", example = "http://kakao"),
            @Parameter(name = "togetherActivity", description = "함께 하고싶은 활동", example = "EAT"),
            @Parameter(name = "content", description = "상세 내용", example = "오스린리 전시회 보러가실 분 있나요?"),
            @Parameter(name = "postImages", description = "게시글 이미지 리스트 URL", example = "[\"image1\", \"image2\", \"image3\"]")
    })
    public ResponseEntity<Post> save(@Parameter(hidden = true) @AuthenticationPrincipal final LoginMember loginMember, @RequestBody PostCreateRequest request) {
        Post post = postService.save(request, loginMember.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

}
```

이런 형태의 코드는 `Swagger`를 사용할 때 발생하는 문제를 나타냅니다.

따라서 이러한 이유로 version2 프로젝트에서는 `Swagger` 보다는 **깔끔하고 명료한 문서**를 생성할 수 있는, 주로 **문서 제공 용도**로 사용되는 `Spring Rest Docs`로의 전환을 결정하게 되었습니다.

## Spring Rest Docs 개념

Spring Rest Docs의 특징으로는 다음과 같습니다.

* 테스트 코드를 통한 API 문서 자동화 도구입니다. (제가 만든 api 명세를 테스트 코드를 작성해서 build하면 문서처럼 보여지는 것)

* API 명세를 문서로 만들고 외부에 제공함으로써 협업을 원활하게 합니다.

* 기본적으로 `AsciiDoc`을 사용하여 문서를 작성합니다. (markdown 같은 것)

### Rest Docs vs Swagger

Rest Docs와 Swagger의 장점과 단점을 비교하면 다음과 같습니다.

> Rest Docs

장점

* 테스트를 통과해야 문서가 만들어진다. (신뢰도가 높다)

* 프로덕션 코드에 비침투적이다.

단점

* 코드 양이 많다.

* 설정이 어렵다.

> Swagger

장점

* 적용이 쉽다.

* 문서에서 바로 API 호출을 수행해볼 수 있다.

* (UI에 대해) 알록달록하게 문서를 작성할 수 있다.

단점

* 프로덕션 코드에 침투적이다.

* 테스트와 무관하기 때문에 신뢰도가 떨어질 수 있다. → 실제로 동작하는 것과 문서가 따로 돌 수 있다.

## Spring Rest Docs 적용

### 개발 환경

현재 히빗 version2 프로젝트는 아래와 같은 기술을 사용하고 있습니다.

`Language` - Java 11

`Framework` - Spring Boot 2.7.1, Spring MVC 5.3.2

`ORM` - Spring Data JPA 2.7.1, JPA Hibernate 5.6.1

`Database` - H2, MySQL 7.4

`Build Tool` - Gradle 8.0

`Test` - Junit 5, Mockito 4.5.1

### MockMvc vs Rest Assured

> Rest Assured

`Rest Assured` 는 별도의 구성 없이는 `@SpringBootTest`로 수행해야 합니다.
`@SpringBootTest`는 **스프링의 전체 컨텍스트를 로드하여 빈을 주입하기에 속도가 많이 느립니다.**

즉, `Rest Assured`는 스프링 애플리케이션이 동작하는 실제 환경과 거의 동일한 환경에서 테스트를 진행할 때 사용됩니다.
그래서 `@SpringBootTest`을 적용한 `RestAssured`는 **속도가 느리고, 비용이 많이 듭니다.**

> MockMvc

반면에 `MockMvc`는 `@SpringBootTest` 와 함께 사용할 수 있고, `@WebMvcTest`와 함께 사용할 수도 있습니다.
`@SpringBootTest` 다르게 `@WebMvcTest`는 **Controller Layer(=Presentation Layer) 만 테스트 하기에 속도가 빠릅니다.**
(`@WebMvcTest` 사용할 때는 보통 서비스 계층을 Mocking을 하여 작성하기 때문입니다)

> 결론

만약 통합테스트를 한다면 `Rest Assured`가 좋은 선택이지만, Spring Rest Docs로 문서를 작성하는 데에는 `MockMvc`가 더 나은 선택이라 생각하여 `MockMvc` 기반으로 진행하게 되었습니다.

### Asciidoc vs Markdown

저에게 익숙한 `Markdown` 이 작성하기 더 편할 수 있지만, `Markdown`으로 Rest Docs를 작성하려면 Ruby 프로젝트인 [slate](https://github.com/slatedocs/slate)가 필요합니다. (include가 되지 않아 별도로 설치해야 합니다)

`slate`는 Gradle로 관리되는 프로젝트가 아니기 때문에, 해당 프로젝트를 직접 다운로드 받아서 진행해야 합니다. 

이는 곧, `slate`에 의존해야만 하는 구조가 되고, Ruby 의존성들이 추가로 생성되면서 빌드 시간이 전체적으로 오래 걸리게 됩니다.

또한 개인적으로 `slate`로 만들어진 UI가 저에게 친숙하지 않았습니다.

반면에, `Asciidoc`는 문서를 작성할 수 include 기능을 제공하며(Gradle로 관리됨), 표현할 수 있는 문법들이 많이 있습니다.

그리고 UI도 `slate`에 비해 깔끔하면서 이뻤습니다.

그래서 `Asciidoc`을 사용하기로 했습니다.

### build.gradle

`MockMvc`, `Asciidoc` 기반 Rest Docs 설정 - build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.7.10'
    id 'io.spring.dependency-management' version '1.0.15.RELEASE'
    id 'jacoco'
    id "org.asciidoctor.jvm.convert" version "3.3.2" // (1) plugin 추가
}

group = 'com'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '11'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
    asciidoctorExt // (2) asciidoctor의 Extention에 대한 configuration 추가
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring boot
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    
    // ...

    // spring restdocs (3), (4)
    asciidoctorExt 'org.springframework.restdocs:spring-restdocs-asciidoctor'
    testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc'
}

ext { // (5) 문서 조각들에 대한 경로를 지정
    // 전역 변수
    snippetsDir = file('build/generated-snippets')
}

tasks.named('bootBuildImage') {
    builder = 'paketobuildpacks/builder-jammy-base:latest'
}

test {
    outputs.dir snippetsDir // (6) 테스트에서 테스트가 끝난 결과물을 snippetsDir 에 넣음
    useJUnitPlatform()
    finalizedBy 'jacocoTestReport'
}

// (7) asciidoctor 태스크에 대한 설정
asciidoctor {
    inputs.dir snippetsDir // 불러올 스니펫 위치를 snippetsDir로 설정
    configurations 'asciidoctorExt' // Asciidoctor 확장에 대한 설정
    sources { // 특정 파일만 html로 만듬
        include("**/index.adoc")
    }
    baseDirFollowsSourceFile() // 다른 adoc 파일을 include 할 때 경로를 baseDir로 맞춤
    dependsOn test // test 태스크 이후에 asciidoctor를 실행하도록 설정
}
```

> `Asciidocotor`는 Asci 파일을 html 파일로 변환해주는 도구 입니다.

(1) AsciiDoc 파일을 컨버팅하고 Build 폴더에 복사하기 위한 플러그인을 추가합니다.

(2) asciidoctor의 Extention(확장)에 대한 Configuration 구성을 추가합니다.

(3) `asciidoctorExt`에 spring-restdocs-asciidoctor 의존성을 추가합니다. 이 종속성이 있어야 `build/generated-snippets` 에 있는 `.adoc` 파일을 읽어들여 `.html` 파일로 만들어낼 수 있습니다.

(4) `MockMvc`를 사용하기 위한 spring-restdocs-mockmvc 의존성을 추가합니다.

(5) 생성되는 스니펫들이 생성되는 디렉터리 경로를 설정합니다.

(6) 테스트가 끝난 결과물을 `snippetsDir` 에 넣습니다.

(7) `asciidoctor` 태스크에 대한 설정을 합니다.

---

> Preference - Plugins - `AsciiDoc` 설치

![](/assets/img/hibit/spring-rest-docs-plugin-ascii.png)

### 예제(테스트 코드 작성)

> ControllerTestSupport

```java
@AutoConfigureRestDocs // (1)
@WebMvcTest(controllers = {
        MemberController.class,
        AuthController.class,
        ProfileController.class,
        PostController.class
})
@Import(ExternalApiConfig.class)
@ActiveProfiles("test")
public abstract class ControllerTestSupport {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;
    
    // ...

    @MockBean
    protected PostService postService; // (2)
}
```

> PostControllerTest

```java
class PostControllerTest extends ControllerTestSupport {
    private static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    private static final String AUTHORIZATION_HEADER_VALUE = "Bearer aaaaaaaa.bbbbbbbb.cccccccc";

    @DisplayName("등록된 게시글을 모두 조회한다.")
    @Test
    void 등록된_게시글을_모두_조회한다() throws Exception {
        // given
        Member 팬시 = 팬시();
        팬시 = memberRepository.save(팬시);
        List<Post> 게시글_목록 = List.of(프로젝트_해시테크(팬시), 오스틴리_전시회(팬시));
        PostsResponse response = PostsResponse.of(게시글_목록);

        given(postService.findAll()).willReturn(response); // (3)

        // when & then
        mockMvc.perform(get("/api/posts")
                        .header(AUTHORIZATION_HEADER_NAME, AUTHORIZATION_HEADER_VALUE)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andDo(document("posts/find/all/success",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint())
                ))
                .andExpect(status().isOk()); // (4)
    }
}
```

(1) `@AutoConfigureRestDocs` 어노테이션은 Spring REST Docs를 자동 구성해주는 어노테이션입니다. 이를 적용하게 되면 테스트 케이스 실행시 자동으로 API 문서가 생성됩니다.

* `@AutoConfigureRestDocs` 에 uri 정보가 선언되어 있으면 적용하고, 없으면 기본 설정값으로 적용

(2) `PostService`의 구현체를 mocking하기 위해 `@MockBean`을 선언합니다.

(3) 테스트에서 given 메소드를 사용하여 `postService.findAll()` 메소드 호출 시 `PostsResponse` 객체를 반환하도록 설정합니다.

(4) 테스트에서 `mockMvc.perform()` 메소드를 사용하여 실제 HTTP 요청을 모의로 실행하고, 그 결과를 검증합니다. document 메소드를 통해 요청과 응답을 문서화합니다.

이러한 과정을 통해 Spring REST Docs를 활용하여 API 문서를 생성할 수 있습니다.

### 확인 -> 결과

오른쪽 Gradle - Tasks - documentation - asciidoctor 실행하면 성공이 되고,

![](/assets/img/hibit/hibit-spring-rest-docs-1.png)

build 안에 `posts` 폴더가 생기고, `find/all/success` 폴더 안에 문서 조각들이 생깁니다.

![](/assets/img/hibit/hibit-spring-rest-docs-2.png)

이 다음에 해야할 작업은 문서 조각을 하나로 합쳐서 **하나의 문서**로 만드는 작업 입니다.

src 폴더 하위에 docs 라는 폴더를 만든 뒤, 그 안에 asciidoc 폴더를 생성한 뒤에 `index.adoc` 이라는 파일을 만듭니다.

![](/assets/img/hibit/hibit-spring-rest-docs-3.png)

`index.adoc` 파일 안에 아래와 같이 작성하면 미리보기를 통해 확인할 수 있습니다.

![](/assets/img/hibit/hibit-spring-rest-docs-4.png)

오른쪽 Gradle - build (또는 documentation - asciidoctor)를 눌러주면, 왼쪽 docs 폴더 - asciidoc 폴더 안에 `index.html` 파일이 생성됩니다.

![](/assets/img/hibit/hibit-spring-rest-docs-5.png)

그리고 Chrome 창으로 열어보면 아래와 같이 API 문서가 나오게 됩니다.

![](/assets/img/hibit/hibit-spring-rest-docs-6.png)

## 마무리

Spring Rest Docs를 Hibit version2 프로젝트에 통합하는 과정을 통해, 초기 설정부터 실제 적용까지의 단계를 체계적으로 이해하게 되었습니다.

이 과정에서 Asciidoc 문법의 기초를 배웠음에도 불구하고, 아직 배워야 할 내용이 많다는 것을 깨달았습니다.

앞으로는 Spring Rest Docs의 활용 방법에 대해 더욱 개방적인 태도로 접근하며, 이를 통해 지식을 확장하고 실무 경험을 축적해 나가겠습니다.

> 해당 부분에 대한 코드는 [Github(PR)](https://github.com/hibit-team/hibit-backend-improved/pull/57) 에서 확인할 수 있습니다.

지금까지 읽어주셔서 감사합니다.

## Reference

* [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-%EC%8B%A4%EC%9A%A9%EC%A0%81%EC%9D%B8-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B0%80%EC%9D%B4%EB%93%9C)

* [Spring Rest Docs 적용](https://techblog.woowahan.com/2597/)

* [Spring REST Docs를 사용한 API 문서 자동화](https://hudi.blog/spring-rest-docs/)

* [Spring Rest Docs를 Markdown으로 작성하기](https://jojoldu.tistory.com/289)

