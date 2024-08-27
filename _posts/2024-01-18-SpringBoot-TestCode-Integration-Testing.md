---
layout: post
title: " Spring Boot 기반 통합 테스트와 슬라이스 테스트: 효과적인 레이어별 코드 검증 방법 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

> 이 글은 실제 [히빗 프로젝트(ver.2)](https://github.com/hibit-team/hibit-backend-improved)를 혼자서 개발하면서 경험한 내용을 정리한 글입니다.

* 예상 독자: Spring Boot 기반 통합 테스트와 슬라이드 테스트 코드를 작성하는 개발자

---

이전에 작성한 [좋은 단위 테스트란? (feat. 히빗)](https://devfancy.github.io/SpringBoot-TestCode-Unit/) 글에 이어서 이번에는 통합 테스트와 슬라이드 테스트에 대한 글을 작성했다.

결론부터 말하면 나는 통합 테스트와 슬라이드 테스트를 각각의 레이어에 맞게 적용했다.

* 통합 테스트 

  * Business Layer(Service) - `@SpringBootTest` 적용

* 슬라이스 테스트

  * Presentation Layer(Controller)  - `@WebMvcTest` 적용 
  
  * Persistence Layer(Repository) - `@DataJpaTest` 적용

아래에는 Spring Boot 기반으로 통합 테스트와 슬라이스 테스트가 무엇이고, 어떻게 적용했는지 작성했다.

## 통합 테스트

`통합 테스트` (Integration Testing)는 **시스템의 각 구성 요소가 올바르게 연동되는지 확인하는 것**을 의미한다.

`기능 테스트`가 사용자 입장에서 테스트하는 반면, `통합 테스트`는 **소프트웨어 코드를 직접 테스트**한다.
웹을 예로 들면 기능 테스트는 웹을 통해 게시글 기능을 테스트한다면, 통합 테스트는 게시글 기능에서 등록, 수정, 조회, 삭제를 직접 테스트하는 식이다.

요즘에는 기능 테스트를 `인수 테스트`로 더 자주 부르는 경향이 있다. (`인수 테스트`는 사용자 스토리(시나리오)에 맞춰 수행하는 테스트이다.)

일반적인 웹 애플리케이션은 프레임워크, 라이브러리, 데이터베이스, 구현한 코드가 주요 통합 테스트 대상이다.
게시글의 세부 기능에 대한 통합 테스트를 수행하면 스프링 프레임워크나 JPA 설정이 올바른지, SQL 쿼리가 맞는지, DB 트랜잭션이 잘 동작하는지 검증할 수 있다.

통합 테스트의 장점은 **실제 환경에서 시스템이 어떻게 동작할지를 보다 정확하게 확인**할 수 있다는 점이다.
비록 완벽하게는 아니지만, 통합 테스트는 **거의 유사한 조건**에서 시스템이 동작하는 것을 확인할 수 있다.

그러나 통합 테스트는 단위 테스트보다 여러 구성 요소를 포함하므로 단위 테스트보다 **비용과 시간**이 더 많이 소요된다.
여러 구성 요소가 함께 작동하기 때문에 **문제 발생시 디버깅이 어려울 수 있다.**

통합 테스트를 실행하려면 준비할 것이 많고 단위 테스트에 비해 실행 시간도 길지만, 그럼에도 불구하고 필요한 부분이라고 생각한다.

**각 구성 요소가 올바르게 연동되는 것을 확인해야 하는데 이를 `자동화`하기 좋은 수단이 통합 테스트 코드** 이기 때문이다.

Spring Boot 에서는 클래스 상단에 `@SpringBootTest` 어노테이션을 붙여 통합 테스트를 수행할 수 있다.

### @SpringBootTest

`@SpringBootTest` 어노테이션을 사용하면 스프링 애플리케이션을 통해 테스트에 사용되는 ApplicationContext를 생성함으로써 작동한다.

이러한 어노테이션을 사용하면 우리 애플리케이션에서 사용하고 있는 **모든 빈을 등록한 뒤 간편하게 테스트를 진행**할 수 있다.

하지만 모든 빈을 등록하기 때문에 아래와 같은 **단점**을 가질 수 있다.

* 모든 빈을 등록하기 때문에 비교적 오랜 시간이 걸린다

* 모든 빈을 등록하기 대문에 의존성을 고려하지 않고 테스트를 진행할 수 있다. -> 테스트하고자 하는 객체의 의존성을 무시한채 테스트하게 된다.

* 결과적으로 웹을 실행시키지 않고 테스트 코드를 통해 빠른 피드백을 받을 수 있다는 장점이 희석된다.

이러한 `@SpringBootTest` 는 모든 빈을 등록한 채 테스트를 진행하는 통합 테스트에 적합한 어노테이션이다.

모든 빈을 등록하지 않으려면, `classes 속성`을 통해 빈을 생성할 클래스를 지정하면 해당 클래스와 관련된 빈만 등록하게 된다.

`@SpringBootTest`는 주로 **`Business Layer`** 에 사용된다.

`Business Layer`(Service) 는 **비즈니스 로직을 구현하는 역할**로 `Persistence Layer`와의 상호작용(Data를 읽고 쓰는 행위)를 통해 비즈니스 로직을 전개시키는 레이어이다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_1.png)

아래는 `@SpringBootTest`을 이용하여 실제 프로젝트에 작성한 테스트 중 일부를 가져왔다.

> PostServiceTest

```java
@ActiveProfiles("test")
@SpringBootTest
class PostServiceTest {
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

    @DisplayName("게시글을 등록한 페이지를 반환한다.")
    @Test
    void 게시글을_등록한_페이지를_반환한다() {
      // given
      Member 팬시 = 팬시();
      memberRepository.save(팬시);
      Profile 팬시_프로필 = 팬시_프로필(팬시);
      profileRepository.save(팬시_프로필);
    
      PostCreateRequest request = PostCreateRequest.builder()
              .title(게시글제목1)
              .content(게시글내용1)
              .exhibition(전시회제목1)
              .exhibitionAttendance(전시관람인원1)
              .possibleTime(전시관람희망날짜1)
              .openChatUrl(오픈채팅방Url1)
              .togetherActivity(함께하고싶은활동1)
              .imageName(게시글이미지1)
              .postStatus(모집상태1)
              .build();
    
      // when
      Long newPostId = postService.save(팬시_프로필.getMember().getId(), request);
      Post savedPost = postRepository.findByMemberId(팬시.getId()).orElse(null);
    
      // then
      assertThat(newPostId).isNotNull();
      assertEquals("프로젝트_해시테크", savedPost.getTitle());
    }
}
```

통합 테스트 코드를 작성할 때 보통은 2가지 입장(관점)으로 작성하는 경우가 있다.

1. `Classicist` - 진짜 객체로 테스트를 하자. -> **상태 검증**을 통한 의존 객체의 구현보다는 **실제 입/출력 값**을 통해 검증하는 테스트이다.

2. `Mockist` - 모든 걸 **mocking 위주(가짜 객체)** 로 테스트를 하자. -> **행위 검증**을 통해 의존 객체의 특정 행동이 이루어졌는지를 검증하는 테스트이다.

나의 경우 `Business Layer`에 대해 테스트 할 때, Repository의 **실체 객체를 사용**하여 통합 테스트를 진행하였다. 즉, `Classicist` 관점으로 작성했다.

* 메일 전송 혹은 AWS S3 같은 외부 시스템을 요청하거나 연결할 때는 Mocking을 사용한다. 왜냐하면 이런 외부 시스템은 우리가 개발한 게 아니기 때문이다.

* Mocking 위주로 테스트를 작성한다면 과연 **실제 프로덕션 코드에서 런타임 시점에 일어날 일을 정확하게 Mocking 했다고 단언할 수 있을까**에 대한 의구심이 들었다.

* 테스트를 했다고 실제 프로덕션과 100% 재현한다고 보장은 할 수 없다. 그런 리스크를 감당할 바에는 비용을 조금 들여서 실제 객체를 가져와서 테스트를 하는게 더 좋을 것 같다는 생각이 들어서 나는 이 방식을 택했다.

## 슬라이스 테스트

`슬라이드 테스트`는 스프링에서 특정 영역의 레이어를 테스트하는 방법 중 하나이다.

즉, 특정 계층은 다른 계층에 의존하지 않기 때문에 필요한 빈들만 주입받아 독립적으로 테스트를 수행할 수 있다.

이를 통해 전체 Application Context를 로드하는 것보다 더 가볍고 빠른 테스트를 작성할 수 있다. 

아래는 대표적인 슬라이드 테스트 어노테이션이다.

* `@WebMvcTest`

* `@DataJpaTest`

### @WebMvcTest

`@WebMvcTest` 는 웹 컨트롤러 관련 빈들만 테스트하는 어노테이션으로 주로 웹 계층의 테스트에 사용된다.

`@WebMvcTest` 어노테이션이 사용되면 웹 계층의 테스트를 위한 빈들이 주입되는데, 주로 주입되는 빈들로는 다음과 같은 것들이 있다.

* Controller

* Interceptor

* ViewResolver

* Converter, Formatter

* MessageConverter

* HandlerMapping

* ExceptionHandler

* ResourceHandler

이 빈들을 사용하여 웹 레이어의 동작을 테스트하고, 의존성 주입 및 상호 작용을 확인할 수 있다.

`@WebMvcTest`는 주로 `Presentation Layer`에 사용된다.

`Presentation Layer`(Controller)는 **외부 세계의 요청을 가장 먼저 받는 계층** 으로 파라미터에 대한 최소한의 검증을 수행한다.

![](/assets/img/testcode/Practical_Testing_Presentation_Layer_1.png)

아래는 `@WebMvcTest` 를 이용한 실제 프로젝트의 일부 테스트 코드를 가져왔다.

> PostControllerTest

```java
@WebMvcTest(controllers = PostController.class)
class PostControllerTest {
    private static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    private static final String AUTHORIZATION_HEADER_VALUE = "Bearer aaaaaaaa.bbbbbbbb.cccccccc";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostService postService;

    @MockBean
    private AuthService authService;

    @DisplayName("신규 게시글을 등록한다.")
    @Test
    void 신규_게시글을_등록한다() throws Exception {
        // given
        PostCreateRequest request = PostCreateRequest.builder()
                .title(게시글제목1)
                .content(게시글내용1)
                .exhibition(전시회제목1)
                .exhibitionAttendance(전시관람인원1)
                .openChatUrl(오픈채팅방Url1)
                .togetherActivity(함께하고싶은활동1)
                .possibleTime(전시관람희망날짜1)
                .openChatUrl(오픈채팅방Url1)
                .togetherActivity(함께하고싶은활동1)
                .imageName(게시글이미지1)
                .postStatus(모집상태1)
                .build();

        // when & then
        mockMvc.perform(post("/api/posts/new")
                        .header(AUTHORIZATION_HEADER_NAME, AUTHORIZATION_HEADER_VALUE)
                        .content(objectMapper.writeValueAsString(request))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isCreated());
    }
}
```

사실상 비즈니스 로직 보다는 넘겨온 값이 중요하기 때문에 하위 2개의 Layer를 `Mocking`(가짜 객체로 대신)하고 테스트를 진행했다.

여기서 `MockMvc`이란 Mock(가짜) 객체를 이용해서 Spring MVC 동작을 재현할 수 있는 테스트 프레임워크이다.

### @DataJpaTest

Spring Data JPA를 사용했기 때문에, 테스트를 위해 `DataJpaTest`를 활용할 수 있다.
`@Entity`, `JpaRepository` 등 JPA 사용에 필요한 빈들을 등록하여 테스트할 때 사용된다.

`@DataJpaTest`는 주로 **`Persisence Layer`** 에 사용된다. 

`Persistence Layer`(Repository)는 **Data Access의 역할**로 비즈니스 가공 로직이 포함되어서는 안된다. **Data에 대한 CRUD 작업**에만 집중한 레이어이다.

![](/assets/img/testcode/Practical_Testing_Persistence_Layer_1.png)

아래는 `@DataJpaTest` 를 실제 프로젝트의 일부 테스트 코드를 가져왔다.

> PostRepositoryTest

```java
@ActiveProfiles("test")
@DataJpaTest
class PostRepositoryTest {
    
    @Autowired
    private MemberRepository memberRepository;
  
    @Autowired
    private ProfileRepository profileRepository;
  
    @Autowired
    private PostRepository postRepository;
  
    private Member member;
  
    private Profile profile;
  
    private Post post;
  
    @BeforeEach
    void setUp() {
        member = 팬시();
        memberRepository.save(member);
        profile = 팬시_프로필(member);
        profileRepository.save(profile);
        post = 프로젝트_해시테크(member);
        postRepository.save(post);
    }
  
    @DisplayName("게시글과 회원 테이블이 정상적으로 매핑이 된다.")
    @Test
    void 게시글과_회원_테이블이_정상적으로_매핑이_된다() {
        // given
        Post foundPost = postRepository.getById(post.getId());
    
        // when & then
        Assertions.assertThat(foundPost.getMember().getId()).isNotNull();
    }
  
    @DisplayName("특정 회원 ID에 해당하는 게시글을 찾는다.")
    @Test
    void 특정_회원_ID에_해당하는_게시글을_찾는다() {
        // given
        Long memberId = post.getMember().getId();
    
        // when
        Optional<Post> actual = postRepository.findByMemberId(memberId);
    
        // then
        assertThat(actual).isPresent();
        Post foundPost = actual.get();
        assertThat(foundPost.getMember().getId()).isEqualTo(memberId);
    }
}
```

`@DataJpaTest` 는 스프링 서버를 띄어서 테스트를 하는데, `@SpringBootTest`보다 가볍다(속도가 빠르다). 
JPA 관련된 Bean 들만 주입을 해줘서 서버를 띄어준다.

또한 `@DataJpaTest`는 기본적으로 `@Transactional` 어노테이션이 있기 때문에 **테스트가 완료되면 자동으로 롤백된다.**

`@DataJpaTest` 내부에 들어가서 확인해보면, `@Transactional` 이 있다.

![](/assets/img/testcode/Practical_Testing_Business_Layer_4.png)

`PostRepositoryTest`의 경우 `@DataJpaTest` 로 인해 트랜잭션 롤백이 자동으로 이루어지므로 테스트가 데이터베이스에 영향을 미치지 않는다.

그래서 `@DataJpaTest` 내부에 `@Transactional` 어노테이션이 있어서 `PostRepositoryTest`에는 수동으로 삭제하는 tearDown() 메서드의 필요가 없어지게 된다.

## 정리

통합 테스트와 슬라이드 테스트의 어노테이션을 적용함으로써 전보다 테스트 코드에 대한 이해를 높일 수 있게 되었다.

테스트 코드는 상대적으로 운영 코드에 비해 관심이 덜 받는 편이지만, 이는 실제로 **안정성과 효율성, 그리고 확장성을 유지하기 위해 필수적으로 작성해야하는 부분**이라고 생각한다.

**`테스트의 목적`과 `필요한 빈`들에 대한 고민**을 통해 적절한 어노테이션을 선택하는 것이 효과적인 테스트 코드 작성의 핵심이지 않을까 한다.

이를 통해 불필요한 리소스를 최소화하고, 운영 코드의 변화에 유연하게 대응할 수 있게 되었다.

테스트 코드를 관리하는 것은 **`운영 코드`의 안정성과 효율성을 높이는 핵심 요소**임을 다시 한번 강조하고 싶다.

## Reference

* [[Spring 공식문서] Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)

    * [Spring MVC Tests](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing.spring-boot-applications.spring-mvc-tests)

    * [Data JPA Tests](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing.spring-boot-applications.autoconfigured-spring-data-jpa)

* [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard)

* [[Tecoble] Spring Boot 슬라이스 테스트](https://tecoble.techcourse.co.kr/post/2021-05-18-slice-test/)