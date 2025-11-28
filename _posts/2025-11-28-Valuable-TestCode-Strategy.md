---
layout: post
title: " 테스트에 대한 전략과 고찰 "
categories: [ GoodCode ]
author: devFancy
---

* content
{:toc}

> 이 글에서 다루는 모든 코드는 개인 프로젝트를 기반으로 작성되었으며, 아래 Github 를 참고해 주시면 감사하겠습니다.
> 
> - 개인 프로젝트 1 - 깃허브: [springboot-coupon-system](https://github.com/devFancy/springboot-coupon-system)
> 
> - 개인 프로젝트 2 - 깃허브: [hibit-backend-improved](https://github.com/devFancy/hibit-backend-improved)

## Prologue

처음 테스트 코드를 작성하기 시작한 지 약 2년이 되어가는 시점에, 현재 어떤 자세와 고민을 갖고 테스트 코드를 작성하는지 정리하고자 이 글을 작성하게 되었습니다.

> 최범균 저자님이 출간한 [테스트 주도 개발 시작하기](https://product.kyobobook.co.kr/detail/S000001248962) 책과 
> 인프런 플랫폼에서 박우빈님이 판매하는 [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드)
> 강의에서 배운 내용을 기반으로 이전에 Java, Spring Boot 기반으로 테스트와 관련된 글을 작성한 적이 있습니다.

* [Practical Testing: 테스트 코드 작성 방법 - 1부](https://devfancy.github.io/Practical-Testing/)

* [Practical Testing: 테스트 코드 작성 방법 - 2부](https://devfancy.github.io/Practical-Testing2/)

* [[Hibit] 좋은 단위 테스트란?](https://devfancy.github.io/Hibit-SpringBoot-TestCode-Unit/)

* [[Hibit] Gradle 프로젝트에 Jacoco 설정하기: 코드 커버리지 80%](https://devfancy.github.io/Hibit-SpringBoot-Gradle-Test-Jacoco/)

그동안 테스트 코드를 작성해오면서 제 나름의 전략과 기준을 세워왔지만, 여전히 배워나가야 할 부분들이 많다고 느꼈습니다.

그러면서 다른 회사는 어떻게 테스트 전략을 수립하고 실행했는지, 또는 테스트 코드를 작성하면서 겪었던 이슈와 그 이슈를 어떻게 해결했는지가 궁금해졌습니다.

그래서 여러 회사의 기술 블로그 혹은 영상, 컨퍼런스에서 나온 내용을 많이 참고했습니다.

이번 글에는 테스트 코드를 작성하면서 느꼈던 점들과 다른 회사의 글로부터 새롭게 알게 된 점을 공유하고자 합니다.

> 예상 독자

이 글은 Java, Spring Boot 기반으로 단위 및 통합 테스트 코드 작성에 필요한 지식과 경험을 갖춘 사람을 대상으로 작성했습니다.


---

## 테스트 코드에 대한 오해와 진실

> 테스트 코드를 왜 작성해야 할까요 ?

이 질문에 대한 정해진 모범 답안은 없다고 생각합니다. 하지만 개발자라면 누구나 자신만의 Why? 를 가지고 있어야 합니다.
제가 테스트 코드의 필요성을 절실히 느낀 것은 책과 강의를 읽기 전, 팀 프로젝트를 통한 경험 때문이었습니다.

저의 경우 크게 두 가지 상황으로 인해 테스트 코드를 도입한 경험이 있었습니다.

* 첫 번째로 `히빗`이라는 예술 전시회 기반의 웹 서비스 프로젝트를 진행할 때였습니다.
    * QA 작업을 진행할 때마다 많은 에러가 발생했고, 그때마다 노션에 어느 부분에서 예외가 발생했고 어떤 현상이 나왔는지 기록했습니다.
    * 예외가 발생한 케이스에 대해 코드를 개선해나갔지만, 세부 기능들이 많아질수록 배포 전 QA 시간은 늘어났고 매번 같은 과정을 반복하는 불편함이 있었습니다.
    * 이를 어느 정도 자동화해야겠다는 생각에 테스트 코드를 도입하게 되었습니다.
* 두 번째로 실무에서도 비슷한 경험을 했습니다. 
    * 서비스 운영에 배포하기 전에 QA 작업과 도메인별 담당자가 수시로 API를 테스트하거나 사용자 시나리오 기반으로 테스트 작업 과정을 거쳤습니다.
    * 하지만 서비스가 고도화될수록 검증해야 할 작업이 많아졌고, 사람이 수시로 검증하는 시간이 늘어나면서 정작 새로운 기능을 개발하거나 개선하는 시간은 점점 부족해졌습니다. 이로 인해 배포가 급박할수록 어쩔 수 없이 야근을 하게 되는 경우도 생깁니다. 
    * 또한, 기존에는 서비스를 특정 파일로 문서화해서 관리하고 있었는데, 기능이 바뀔 때마다 문서를 수시로 업데이트해야 하는 비효율이 있었습니다.
    * 최신 기능은 결국 코드에 담겨있기 때문에, 테스트 코드를 작성함으로써 문서화 역할까지 해줄 수 있다면 좋겠다는 생각에 도입하게 되었습니다.

이처럼 저마다의 상황과 환경에 따라 테스트 코드를 도입하는 이유는 큰 틀에서는 비슷해 보여도 구체적으로 조금씩 다르다고 생각합니다.

회사를 다니기 전까지는 막연하게 '어느 정도 테스트 코드가 존재하고 규칙이 있겠지?'라고 상상해왔던 것 같습니다. 
하지만 현실에서는 테스트 코드 자체가 없는 상황이 많았고, 그러한 상황에서도 비즈니스는 잘 돌아가는 경우도 많습니다.

현실에서 왜 테스트 코드를 도입하지 않는 회사가 많을까에 대해 나름의 생각과 고민을 정리하자면 다음과 같습니다.

- 운영 중인 서비스의 코드의 절대적인 양이 많고, 이를 테스트해야 하는 양도 많을 경우
- 기존에 잘 돌아가고 있고, 비즈니스에 큰 영향을 주는 에러가 발생하는 확률이 낮은 경우
- 테스트를 위해 기존의 프로덕션 코드를 리팩터링해야 하지만, 그럴 수 없는 환경인 경우
- 더 이상 기존 코드를 수정할 일이 없고, 테스트 케이스 작업도 체계화된 경우
- 사내에 테스트를 작성해본 사람이 없는 경우

위의 사례뿐만 아니라 테스트를 작성할 수 없는 이유를 들자면 너무나 많습니다. 그럼에도 불구하고 테스트가 주는 이점도 명확합니다.

"테스트는 우리 서비스의 **첫 번째 고객**이다"라는 말처럼, 서비스 규모가 확장되고 신규 기능이 추가될수록 사람이 직접 확인하는 QA 작업만으로는 한계가 있습니다.
모든 테스트 케이스를 사람이 검증하는 작업은 비용이 크고 실패할 확률도 커집니다. 이런 경우에 테스트 코드를 도입한다면, 반복되는 노동을 줄이고 시스템의 안정성을 높일 수 있다고 생각합니다.

회사에서 테스트에 대해 열린 생각을 가지고 환경이 갖춰져 있다면 한 번 도입해보는 것이 좋다고 생각합니다.


## 테스트 코드를 가치있게 작성하기 위한 전략

테스트를 작성해보면서 좋은 테스트는 무엇인지 고민하게 되었습니다. 이를 아래와 같이 정리해볼 수 있을 것 같습니다.

* 빠르게 동작해서 검증할 수 있어야 한다. 특히 도메인 정책은 POJO 기반의 형식이면 더욱 좋다.
* 각각의 테스트는 독립적이며 서로 의존적이지 않아야 한다.
* 엣지 케이스를 작성할 때 경계값을 기반으로 작성해야 한다.
* 요구사항과 도메인 정책을 정리했다면, 해당 내용을 기반으로 테스트를 작성하여 문서화 역할을 하도록 작성한다.

이뿐만 아니라 테스트는 읽기 편하도록 간결하게 작성되어야 합니다.

결론적으로 좋은 테스트는 **비즈니스적으로 가치가 있는 테스트**여야 합니다. 
이전에는 커버리지를 높이면 좋다고 막연하게 생각했지만, 그것보다 비즈니스적으로 중요한 가치에 기반한 테스트를 짜는 것이 훨씬 더 중요하다는 걸 느꼈습니다.
우선순위와 시간 배분을 위해 비즈니스적으로 중요한 부분부터 작성하고, 이후에 엣지 케이스 및 나머지 테스트를 작성하면서 커버리지를 점진적으로 높여가는 방식이 좋지 않을까 합니다.

서비스의 모든 테스트를 작성하면 좋겠지만, 현실에서는 시간이 여유롭지 못하고 여러 요구사항이 매번 새롭게 주어지며 예외 처리도 해야 하는 복잡한 상황이 생깁니다. 그래서 테스트를 작성하기 전에,
**'이 테스트가 가치가 있는가?'** 를 먼저 생각해보고, 가치가 있다면 작성하고 아니면 더 우선순위가 높은 곳에 집중하는 사고를 가지게 되었습니다.

> 이러한 저의 생각은 토스 기술 블로그의 [가치있는 테스트를 위한 전략과 구현](https://toss.tech/article/test-strategy-server) 글을 읽으면서 더 확고해졌습니다.
> 해당 글에서는 효율적인 테스트 전략에 대해 파레토 법칙(20:80)을 들어 다음과 같이 설명합니다.
> 
> "작성 가치를 현명하게 고려하면 가치 있는 20%의 테스트로 80% 이상의 신뢰성을 얻을 수 있습니다."

이 문장을 보면서 무작정 테스트 커버리지(수치)를 높이는 것보다 **핵심 비즈니스 로직(가치)을 지키는 20%에 집중**하는 것이 더 중요하다는 것을 다시금 깨달았습니다.

또한, 테스트를 작성하다 보면 **실용성**도 고려해야 한다는 걸 알았습니다. 
테스트 시나리오가 많아질수록 각 계층별로 작성해야 할 양과 겹치는 부분이 많아지게 됩니다. 
테스트 코드 역시 유지보수의 대상이기 때문에, 서비스가 지속적인 성장을 하기 위해서는 테스트의 양을 최소화하고 효율적으로 관리해야 할 필요가 있습니다.

최대한 실용적으로 작성하려면 하나의 테스트로 모든 계층을 커버하여 부담을 최소화하고, **문서화 역할**까지 한다면 일석이조라고 생각합니다. 
이를 위해 많은 계층을 커버할 수 있는 통합 테스트를 작성합니다.

마지막으로 목적에 따라 테스트를 구분하여 작성해야 합니다.

* 도메인 정책 기반 테스트 코드 작성하기
* 사용자 시나리오 기반 테스트 코드 작성하기

아래부터는 실제 경험을 기반으로 위의 테스트를 어떻게 작성했는지 알아보겠습니다.

## 도메인 정책 기반으로 테스트 코드 작성하기

도메인 정책 기반 테스트는 특정 비즈니스 규칙이 코드로 올바르게 구현되었는지 검증하는 과정입니다.

이는 기능을 확인하는 것을 넘어, 테스트 코드 자체가 살아있는 정책 문서 역할을 한다는 점에서 중요한 역할이라고 생각합니다.

### 1. 단위 테스트로 검증 로직 구현하기

여기서 `도메인 정책`이란 도메인 객체 내에 표현되는 비즈니스 정책을 의미합니다.

예를 들어, 쿠폰을 생성할 때 "발급 가능 수량이 1보다 커야 한다"는 정책이 있다고 가정해 보겠습니다. 
이 규칙은 서비스 레이어가 아닌, `Coupon` 도메인 엔티티 내부에서 검증되어야 가장 안전합니다.

불필요한 JPA 어노테이션이나 필드는 생략하고, 검증 로직에만 집중하여 코드를 보면 다음과 같습니다.

``` java
public class Coupon {
    // ... 필드 생략
  
    public Coupon(final int totalQuantity, ...) {
      validateCouponTotalQuantity(totalQuantity);
      // ...
      this.totalQuantity = totalQuantity;
    }
  
    private void validateCouponTotalQuantity(final int totalQuantity) {
      if (totalQuantity < 1) {
        throw new CouponDomainException("쿠폰 발급 수량은 1 이상이어야 합니다.");
      }
    }
}
```

위의 도메인 엔티티에 대한 정책을 검증하기 위해 아래와 같이 단위 테스트를 작성해볼 수 있습니다.

``` java
class CouponTest {

    @DisplayName("쿠폰 생성 시 발급 가능한 총 수량이 1보다 작으면 예외가 발생한다.")
    @Test
    void fail_should_throw_exception_when_coupon_totalQuantity_less_then_1() {
      // given
      int invalidQuantity = 0;
  
      // when & then
      assertThatThrownBy(() -> new Coupon(..., invalidQuantity, ...))
              .isInstanceOf(CouponDomainException.class)
              .hasMessage("쿠폰 발급 수량은 1 이상이어야 합니다.");
    }
}
```

이처럼 도메인 정책 테스트는 Spring Context나 데이터베이스 같은 무거운 설정 없이, 순수한 Java 객체(POJO) 구조로 작성하면 빠르게 검증할 수 있습니다.
이 덕분에 개발 과정에서 가장 빈번하게 실행하며 테스트로부터 피드백을 받아볼 수 있습니다.

위와 같이 정책 기반으로 테스트를 작성할 때 Spring Bean Context와 Infrastructure 관련 코드 없이 순수한 POJO 구조로 작성하면 빠르게 검증이 가능합니다.

### 2. 경계값 테스트 활용하기

단위 테스트를 작성할 때는 성공 케이스보다 실패 케이스, 특히 경계값(Edge Case)을 검증하는 것이 비즈니스적으로 가치가 높은 경우가 많습니다.

예를 들어 "게시글 제목은 1자 이상 30자 이하여야 한다"는 정책이 있다면, 정확히 31자일 때 예외가 발생하는지, 그리고 허용 범위 내의 값들은 정상 처리되는지 확인해야 합니다.

```java
class TitleTest {

    @DisplayName("게시글 제목이 30자를 초과하면 예외를 던진다")
    @Test
    void fail_should_throw_exception_when_title_more_then_30() {
      // given
      String longerThanThirty = "a".repeat(31); // 경계값: 31자
  
      // when & then
      assertThatThrownBy(() -> new Title(longerThanThirty))
              .isInstanceOf(InvalidTitleException.class)
              .hasMessageContaining("제목은 1자 이상 30자 이하여야 합니다.");
    }

    @DisplayName("게시글 제목이 1자 이상 30자 이하이면 성공한다")
    @ParameterizedTest
    @ValueSource(strings = {"한 글자", "30자 꽉 채운 제목...", "일반적인 제목"})
    void success_create_title_when_title_is_valid(String value) {
      // given & when
      Title title = new Title(value);
  
      // then
      assertThat(title.getValue()).isEqualTo(value);
    }
}
```

이처럼 `@ParameterizedTest`를 활용하면 다양한 경계값 케이스를 하나의 테스트 메서드로 깔끔하게 검증할 수 있어 효율적입니다.

## 사용자 시나리오 기반으로 테스트 코드 작성하기

단위 테스트가 도메인 정책을 검증하는 용도로 사용한다면, `사용자 시나리오 테스트`는 사용자의 여정이 올바르게 동작하는지 검증하는 것을 목표로 합니다.
이를 흔히 `유스케이스 테스트`라고 부릅니다.

일반적으로 이러한 시나리오 검증은 인수 테스트(Acceptance Test) 단계에서 수행합니다.
- `인수 테스트`란 사용자(클라이언트)의 관점에서 요구사항이 충족되었는지 확인하는 테스트입니다.

하지만 인수 테스트는 실제 네트워크 통신 비용이 발생하거나 환경 구축 비용이 커서, 실행 속도가 느리고 피드백이 지연된다는 단점이 있습니다.

그래서 저는 빠른 피드백과 검증의 정확성 사이에서 균형을 맞추기 위해 통합 테스트 계층에서 시나리오 테스트를 구현하는 전략을 선택했습니다.
(추후 E2E 레벨의 인수 테스트 경험이 쌓이면 이 포스팅에 내용을 보강할 예정입니다.)
- 통합 테스트란 서로 다른 모듈(Controller, Service, Repository 등)이 상호작용하며 제대로 동작하는지 검증하는 테스트입니다. 데이터베이스와 같은 외부 의존성을 포함하여 시스템의 내부 흐름을 검증합니다.

사용자 시나리오는 복잡한 비즈니스 로직이 포함된 단일 API일 수도 있고, 회원가입부터 주문까지 이어지는 여러 과정일 수도 있습니다.

단순 조회 기능과 달리 실제 비즈니스 가치를 검증해야 하므로, 테스트를 작성하다 보면 입력 데이터의 복잡성이나 환경 격리 등 현실적인 난관에 부딪히게 됩니다. 
이를 해결한 경험을 아래에 공유합니다.

### Given 절에서 반복되는 부분을 Fixtures로 활용하기

서비스 규모가 커지고 연관된 객체가 많아질수록 테스트의 Given 절(준비 단계)이 비대해지는 문제가 발생합니다.
이는 정작 테스트하고자 하는 핵심 로직 보다 데이터를 세팅하는 준비 시간이 더 오래 걸리게 되고, 
이러한 현상이 반복될수록 테스트를 작성하는 사람 입장에서는 테스트 작성에 대한 피로감이 누적되어 결국 최소한의 테스트만 작성하게 되어버리는 악순환으로 이어질 수 있습니다.

또한, Given 절을 재활용하지 않으면 테스트를 작성할수록 동일한 셋업 코드가 중복되고 이는 테스트를 작성하는 핵심 관심사의 양보다 많아져서 나중에는 테스트의 핵심 의도를 파악하기가 어려워지게 됩니다.
이러한 문제를 해결하기 위해, 각 테스트마다 반복되는 객체 생성 로직을 별도의 헬퍼 클래스로 분리하는 Test Fixtures 전략을 도입했습니다.

- `Fixtures`란 고정되어있는 물체를 의미합니다.
- `Test Fixtures`란 Given절을 구성할 때, 테스트를 위해 원하는 상태로 고정시킨 일련의 객체를 의미합니다.

예를 들어, 게시글 관련 통합 테스트를 작성할 때 Given 절에서 반복되는 셋업을 아래와 같이 Fixtures 클래스를 작성해볼 수 있습니다. (이 외에 회원, 프로필 클래스도 마찬가지로 Fixtures 클래스를 작성합니다.)

```java
public class PostFixtures {
    /* 상수 정의 */
    public static final String 게시글_작성한_사용자_닉네임 = "팬시";
    public static final String 게시글제목1 = "프로젝트_해시테크";
    public static final String 게시글내용1 = "프로젝트 해시 태크(http://projecthashtag.net/) 보러가실 분 있으면 아래 댓글 남겨주세요~";
    public static final String 전시회제목1 = "PROJECT HASHTAG 2025 SELECTED ARTISTS";
    public static final int 전시관람인원1 = 3;
    public static final LocalDateTime 전시관람희망날짜1 = LocalDateTime.now();
    public static final String 오픈채팅방Url1 = "http://projecthashtag.net/";
    public static final TogetherActivity 함께하고싶은활동1 = TogetherActivity.EAT;
    public static final String 게시글이미지1 = "postImage1.png";
    public static final PostStatus 모집상태1 = PostStatus.HOLDING;
    
    // 커스텀 Fixture 생성 메서드 (파라미터로 변형 가능)
    public static Post 프로젝트_해시테크(Member member) {
        return Post.builder()
                .member(member)
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
    }
}
```

위의 Fixture 클래스를 활용하면 통합 테스트를 아래와 같이 간결하게 작성할 수 있습니다.

```java
@ActiveProfiles("test")
@SpringBootTest(classes = ExternalApiConfig.class)
class PostServiceTest {
    // ... (Repository 주입 등 생략) ...

    @Test
    void 게시글에_대한_상세_페이지를_반환한다() {
        // given
        // Fixture를 사용하여 복잡한 객체 생성 과정을 한 줄로 단축
        Member 팬시 = memberRepository.save(팬시());
        Profile 팬시_프로필 = profileRepository.save(팬시_프로필(팬시));
        Post post = postRepository.save(프로젝트_해시테크(팬시));

        // when
        PostDetailResponse response = postService.findPost(post.getId(), LOGIN_MEMBER, EMPTY_COOKIE_VALUE);

        // then
        assertAll(
                () -> assertThat(response.getId()).isEqualTo(post.getId()),
                () -> assertThat(response.getTitle()).isEqualTo(post.getTitle()),
                // ... (일부 검증 로직 생략) ...
                () -> assertThat(response.getExhibition()).isEqualTo(post.getExhibition())
        );
    }
}
```

여기서 한 가지 주의할 점은, 공통 셋업 코드를 `@BeforeEach`나 `@BeforeAll` 어노테이션에 몰아넣는 것을 가급적 지양했다는 것입니다.

`@BeforeEach` 어노테이션에 정의된 셋업 코드는 모든 테스트 메서드와 **강한 결합**을 맺게 됩니다. 
만약 비즈니스 로직 변경으로 인해 셋업 코드를 수정해야 한다면, 이 셋업을 공유하는 모든 테스트가 영향을 받게 됩니다. 
또한, 테스트 코드를 읽을 때 위아래를 오가며 문맥을 파악해야 하므로, 테스트 자체가 문서로서 기능하기 어려워집니다.

그렇다면 언제 사용하는 것이 좋을까요?

해당 셋업 코드를 몰라도 테스트 내용을 이해하는 데 문제가 없고, 수정해도 다른 테스트에 영향을 주지 않는 경우라면 사용해도 괜찮다고 생각합니다.

저의 경우, Given 절에 일부 중복이 발생하더라도 **각 테스트가 독립적으로 읽히고 이해될 수 있는 `문서화`의 역할**이 더 중요하다고 판단했기 때문에,
데이터 셋업에는 `@Before... ` 어노테이션 사용을 최소화했습니다.

### 멀티 모듈 환경일 경우 test-fixtures 라이브러리 활용하기

위의 사례는 단일 모듈 환경이었습니다. 하지만 프로젝트가 멀티 모듈(Multi-module)로 구성되어 있다면 어떻게 될까요?

예를 들어, 아래와 같은 구조를 가정해 봅시다.

```markdown
coupon/
├── coupon-api      (API 서버)
├── coupon-consumer (카프카 컨슈머)
├── coupon-domain   (도메인 엔티티)
```

이 경우 `api` 모듈과 `consumer` 모듈 모두 테스트를 위해 `Coupon` 객체를 생성해야 하므로, Given 절 작성 시 중복 코드가 발생하게 됩니다.

이를 해결하기 위해 Gradle의 `java-test-fixtures` 플러그인을 도입했습니다.
이 플러그인을 사용하면 `domain` 모듈의 테스트 헬퍼 코드(`Fixtures` 등)를 `src/testFixtures` 디렉토리로 분리하여 관리할 수 있으며,
이를 다른 모듈(`api`, `consumer`)에서 의존성으로 가져와 재사용할 수 있습니다.

먼저 `domain` 모듈의 `build.gradle` 파일에서 아래와 같이 해당 `java-test-fixtures` 플러그인을 추가합니다.

```groovy
// domain 모듈 - build.gradle(groovy 기준)
plugins {
  id 'java-test-fixtures'
}
dependencies {
  // 테스트 작성을 위해 아래 의존성 추가
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

그런 다음, 도메인 생성에 필요한 객체를 Fixtures 클래스에 작성합니다.

여기서 주의해야 할 점은 아래 사진과 같이 `src/testFixtures`에 위치한 Fixture 클래스는 원본 도메인 클래스와 **동일한 패키지 경로에 위치**시켜야 `protected` 생성자나 메서드에도 접근할 수 있어 유리합니다.
- 예를 들어, Coupon 클래스의 위치가 CouponFixtures 클래스의 **패키지 위치와 같아야 합니다.** (위치: package dev.be.coupon.domain.coupon)

<img src="/assets/img/goodcode/TestCode-Strategy-Consideration-1.png" width="40%" height="40%" alt="TestCode-Strategy-Consideration-1">

Fixture 클래스는 기본적으로 인자 없이 구성할 수도 있으나, 아래와 같이 테스트하고자 하는 요구사항에 따라 필요한 값만 인자로 받아 유연하게 생성할 수 있도록 구성했습니다.

```java
public class CouponFixtures {
  // ... 상수 정의 생략 ...

  public static Coupon 정상_쿠폰(int totalQuantity) {
    return new Coupon(
            쿠폰_이름,
            쿠폰_타입_버거,
            쿠폰_할인_유형,
            쿠폰_할인_금액,
            totalQuantity, // 필요한 값만 인자로 받음
            유효_기간일
    );
  }
}
```

이제 `api`나 `consumer` 모듈의 `build.gradle`에 의존성을 추가하면, `domain` 모듈에 있는 Fixture를 그대로 사용할 수 있습니다.

```groovy
// api 모듈, consumer 모듈 - build.gradle(groovy 기준)
dependencies {
    // domain 모듈의 testFixtures를 가져옴
    testImplementation(testFixtures(project(":coupon:coupon-domain")))
}
```

이를 통해 모듈 간 중복 코드를 제거하고, 일관된 방식으로 테스트 데이터를 생성할 수 있게 되었습니다. (`consumer` 모듈도 이와 비슷하기 때문에, 여기서는 `api` 모듈만 가져왔습니다.)

```java
@ActiveProfiles("test")
@SpringBootTest
class CouponServiceImplTest {
    
    //...
    @DisplayName("사용자가 쿠폰 발급을 요청하면 성공적으로 접수된다.")
    @Test
    void success_issue_request() {
        // given
        // 다른 모듈(domain)의 Fixture를 재사용하여 코드 간결화
        final UUID couponId = createCoupon(100).getId();
        // ...
    }

    private Coupon createCoupon(final int totalQuantity) {
        Coupon coupon = CouponFixtures.정상_쿠폰(totalQuantity);
        return couponRepository.save(coupon);
    }
}
```

### 테스트 격리와 환경 초기화 구상하기

이번에는 테스트를 독립적이고 반복적으로 수행할 수 있도록 격리하고, 그에 필요한 환경을 초기화했던 경험을 공유하고자 합니다.

통합 테스트를 작성하다 보면 필연적으로 데이터베이스를 사용하게 됩니다. 이때 가장 중요한 원칙은 **각 테스트는 독립적이어야 한다**는 것입니다.
(이는 위 섹션인 "테스트 코드를 가치있게 작성하기 위한 전략"에서 언급한 바 있습니다.)
즉, A 테스트가 만든 데이터가 B 테스트에 영향을 주어서는 안 됩니다.

이를 위해 매 테스트가 실행될 때마다 데이터베이스를 깨끗하게 비워줘야 하는데, 저는 `TRUNCATE` 명령어를 활용한 초기화 전략을 선택했습니다.

> 왜 `@Transactional` 롤백 대신 TRUNCATE를 사용했는가?

흔히 테스트 격리를 위해 테스트 메서드에 `@Transactional`을 붙여, 테스트가 끝나면 자동으로 롤백되는 방식을 사용하곤 합니다. 가장 간편한 방법이지만, 저는 다음과 같은 이유로 이 방식을 사용하지 않았습니다.

- Auto Increment(ID)가 초기화되지 않습니다.
  - 롤백은 데이터(Row)만 취소될 뿐, 증가된 ID 값(Sequence)은 초기화되지 않습니다.
  - 이로 인해 테스트 순서에 따라 ID 값이 달라지게 되어, 특정 ID를 검증하는 테스트가 실패할 수 있습니다.
- 비즈니스 로직의 트랜잭션 검증이 어렵습니다.
  - 테스트 메서드 자체에 `@Transactional`이 걸려있으면, 실제 비즈니스 로직의 트랜잭션 경계가 모호해지거나 의도치 않게 전파(Propagation)될 수 있습니다.

따라서 저는 확실한 초기 상태를 만들기 위해 테이블을 비우고 ID 값까지 초기화하는 `TRUNCATE` 방식을 택했습니다.

#### DatabaseCleaner 구현

`TRUNCATE`는 테이블의 모든 행을 삭제하고 스토리지 공간을 반납하는 DDL(Data Definition Language) 명령어입니다.

`DELETE` 명령어보다 속도가 빠르고 ID 값도 1부터 다시 시작하게 해줍니다.

하지만, 테이블 간의 외래 키(Foreign Key) 제약 조건이 걸려있는 경우 무작정 테이블을 지울 수 없습니다. 
그래서 아래와 같이 `DatabaseCleaner` 유틸리티 클래스를 구현했습니다.

```java
@Component
public class DatabaseCleaner {

    private final EntityManager entityManager;

    private final List<String> tableNames;

    public DatabaseCleaner(final EntityManager entityManager) {
        this.entityManager = entityManager;
        // 1. JPA의 EntityMetamodel을 이용하여, @Entity가 붙은 모든 테이블 이름을 추출합니다.
        this.tableNames = entityManager.getMetamodel()
                .getEntities()
                .stream()
                .map(Type::getJavaType)
                .map(javaType -> javaType.getAnnotation(Table.class))
                .map(Table::name)
                .collect(Collectors.toList());
    }

    @Transactional
    public void execute() {
        entityManager.flush();
        // 2. 제약 조건 무효화: 외래 키 체크를 잠시 해제합니다.
        entityManager.createNativeQuery("SET foreign_key_checks = 0").executeUpdate();

        // 3. 전체 테이블 Truncate: 데이터를 비우고 ID를 초기화합니다.
        for(String tableName : tableNames) {
            entityManager.createNativeQuery("TRUNCATE TABLE " + tableName).executeUpdate();
        }

        // 4. 제약 조건 재설정: 외래 키 체크를 다시 활성화합니다.
        entityManager.createNativeQuery("SET foreign_key_checks = 1").executeUpdate();
    }
}
```

위 코드는 JPA의 메타모델을 이용해 테이블 이름을 동적으로 가져오기 때문에, **엔티티가 추가되거나 변경되어도 코드를 수정할 필요가 없다**는 장점이 있습니다.

#### IntegrationTestSupport로 환경 통합하기

환경 초기화만큼이나 중요한 것이 테스트 실행 속도입니다.

`@SpringBootTest`를 사용하면 스프링 컨텍스트(서버)가 로딩되는데, 설정(Configuration)이 달라질 때마다 컨텍스트가 새로 띄워지게 됩니다. 
이는 테스트가 많아질수록 전체 빌드 시간을 기하급수적으로 늘리는 원인이 됩니다.

이를 방지하기 위해, 저는 모든 통합 테스트가 상속받아 사용할 수 있는 상위 추상 클래스인 `IntegrationTestSupport` 추상 클래스를 구현했습니다.

```java
@Import(JpaAuditingConfig.class)
@ActiveProfiles("test")
@SpringBootTest
public abstract class IntegrationTestSupport {

    // 자주 사용되는 Fixture 혹은 유틸리티 클래스
    protected static final LoginMember LOGIN_MEMBER = new LoginMember(FANCY_ID);
    @Autowired
    private DatabaseCleaner databaseCleaner;
    @Autowired
    private TokenRepository tokenRepository;

    @BeforeEach
    void setUp() {
        // 매 테스트 시작 전, DB를 초기화합니다.
        databaseCleaner.execute();
        
        // Redis 등 다른 저장소가 있다면 여기서 함께 초기화합니다.
        tokenRepository.deleteAll();
    }
}
```

이렇게 구성하면 모든 테스트가 동일한 IntegrationTestSupport의 설정을 공유하게 되므로,
스프링 컨텍스트를 최소한의 횟수만 띄우고 계속 재사용할 수 있어 테스트 성능을 높일 수 있습니다.

이를 통해 개발자가 격리된 환경과 개선된 속도 덕분에 비즈니스 로직 검증에만 온전히 집중할 수 있습니다.

### 외부 의존성을 제어 가능한 영역으로 만들기

테스트를 작성하다 보면 외부 서비스를 이용해야 하는 경우가 필연적으로 발생합니다. 
대표적으로 소셜 로그인(OAuth)이나 결제 시스템 등이 있습니다.

만약 테스트를 돌릴 때마다 실제 구글 서버에 네트워크 요청을 보낸다면 어떤 문제가 발생할까요?
- 외부 서버의 상태에 따라 테스트 성공 여부가 달라지는 불확실성이 생깁니다.
- 네트워크 통신으로 인해 테스트 수행 속도가 느려지게 됩니다.
- 마지막으로 실제 외부 서비스에 불필요한 테스트 데이터가 쌓이는 데이터 오염이 발생합니다.

저는 이러한 **제어할 수 없는 외부 의존성을 제어 가능한 영역으**로 가져오기 위해, 
실제 동작과 동일한 결과를 반환하지만 네트워크 요청은 하지 않는 가짜 객체(Stub/Fake)를 활용하는 전략을 활용했습니다.


#### 1. 테스트 전용 설정(@TestConfiguration)으로 빈 교체하기

실제 프로덕션 코드에서는 외부 API를 호출하는 구현체가 동작해야 하지만, 테스트 환경에서는 가짜 객체가 동작하도록 설정을 분리해야 합니다.

이를 위해 `ExternalApiConfig`라는 테스트 전용 설정 클래스를 만들고, 
여기서 `OAuthClient`나 `TokenProvider` 같은 인터페이스의 구현체를 가짜 객체(Stub)로 생성했습니다.

- 여기서 `Stub`이란 상태 검증을 의미하며, 가짜 객체로 요청한 것에 대해 미리 준비한 결과를 제공합니다.

```java
@TestConfiguration
public class ExternalApiConfig {

    // 실제 네트워크 통신 대신, 미리 정의된 값을 반환하는 Stub 객체를 빈으로 등록
    @Bean
    public OAuthClient oAuthClient() {
        return new StubOAuthClient();
    }
    
    @Bean
    public OAuthUri oAuthUri() {
        return new StubOAuthUri();
    }

    // JWT 토큰 생성도 테스트 환경에 맞는 가짜 키와 유효기간을 가진 Provider로 대체
    @Bean
    public TokenProvider tokenProvider() {
        return new StubTokenProvider(더미_시크릿_키);
    }
}
```

그리고 이 설정을 통합 테스트의 공통 부모 클래스인 `IntegrationTestSupport`에 Import 하여, 모든 통합 테스트가 이 가짜 빈들을 사용하도록 구성했습니다.

```java
@ActiveProfiles("test")
@SpringBootTest(classes = ExternalApiConfig.class) // 테스트 설정 적용
public abstract class IntegrationTestSupport {
    // ...
}
```

#### 2. 가짜 객체(Stub)로 구현하기

가짜 객체는 실제 로직처럼 복잡하게 구현할 필요가 없습니다. 테스트 목적에 맞게 "약속된 동작"만 수행하면 됩니다. 
예를 들어 `StubTokenProvider`는 복잡한 암호화 로직 검증보다는, 단순히 토큰을 생성하고 파싱 할 수 있는 최소한의 기능만 갖추도록 구현했습니다.

```java
public class StubTokenProvider implements TokenProvider {
    private final SecretKey key;
    private final long accessTokenValidityInMilliseconds = 0;
    private final long refreshTokenValidityInMilliseconds = 360000;

    // 실제 키가 아닌 테스트용 더미 키를 사용하여 초기화
    public StubTokenProvider(final String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String createAccessToken(final String payload) {
        // 네트워크 통신 없이 즉시 토큰 생성
        return createToken(payload, accessTokenValidityInMilliseconds);
    }

    // ... 검증 및 파싱 로직 ...
}
```

#### 3. 외부 요인 없이 비즈니스 로직 검증하기

이렇게 환경을 구축한 덕분에, `AuthServiceTest`에서는 외부 OAuth 서버의 상태와 상관없이 우리 서비스의 로그인 및 토큰 발급 로직을 안정적으로 검증할 수 있게 되었습니다.

```java
@RecordApplicationEvents
class AuthServiceTest extends IntegrationTestSupport {

    @Autowired
    private AuthService authService;

    @Autowired
    private ApplicationEvents events;
    //...

    @DisplayName("토큰 생성을 하면 OAuth 서버에서 인증 후 토큰을 반환한다")
    @Test
    void 토큰_생성을_하면_OAuth_서버에서_인증_후_토큰들을_반환한다() {
        // given & when
        // StubOAuthClient가 동작하므로 실제 네트워크 요청 없이 즉시 결과 반환
        AccessAndRefreshTokenResponse actual = authService.generateAccessAndRefreshToken(MEMBER.getOAuthMember());

        // then
        assertAll(() -> {
            assertThat(actual.getAccessToken()).isNotEmpty();
            assertThat(actual.getRefreshToken()).isNotEmpty();
            // 외부 요인을 배제하고, 핵심 비즈니스 로직(이벤트 발행 등)만 검증 가능
            assertThat(events.stream(MemberSavedEvent.class).count()).isEqualTo(1);
        });
    }
    // ...
}
```

결과적으로 외부 의존성을 격리함으로써 테스트 속도를 이전보다 더 개선했고, 
외부 이슈로 인해 테스트가 깨지는 일을 방지하여 테스트의 신뢰성을 높일 수 있습니다.

### 테스트 대역을 올바르게 활용하기

앞서 소개한 Stub 방식 외에도 상황에 따라 다양한 테스트 대역을 활용할 수 있습니다.
가짜 객체를 통칭하는 테스트 대역(Test Double)은 크게 다섯 가지로 분류됩니다.

* `Dummy` : 아무것도 하지 않는 깡통 객체. (인자 채우기 용도)

* `Fake` : 단순한 형태로 동일한 기능은 수행하나, 프로덕션에서 쓰기에는 부족한 객체. (예시. 인메모리 DB, HashMap Repository)

* `Stub` : 테스트에서 요청한 것에 대해 미리 준비한 결과를 제공하는 객체. (상태 기반 검증)

* `Spy` : 실제 객체처럼 동작하면서 호출된 내용을 기록하거나 일부만 조작할 수 있는 객체.

* `Mock` : 행위(호출 여부, 횟수 등)에 대한 기대를 명세하고, 그에 따라 동작하도록 만들어진 객체. (행위 기반 검증)

다양한 대역이 존재하지만, 좋은 테스트란 무엇인가?를 다시 생각해보면, 결국 실제 서비스 환경과 **가장 유사하게 검증하는 것**이 중요하다고 생각합니다.

Mocking을 통해 특정 메서드가 호출되었는지(행위)를 검증하게 되면, 테스트가 "어떻게(How) 동작하는지"와 같은 내부 구현에 깊게 의존하게 됩니다. 
이는 비즈니스 로직을 리팩터링할 때 기능은 문제없이 동작함에도 불구하고, 내부 구현 방식이 달라졌다는 이유로 테스트가 깨지는 **강결합 문제**를 야기할 수 있습니다.

실제로 구글 엔지니어링 블로그에서도 과거의 시행착오를 바탕으로 "모의 객체 사용을 줄이고 실제 객체를 활용하여 테스트 충실도를 높이라"고 강조합니다.

(관련해서 구글 공식 기술 블로그에 있는 해당 포스팅을 참고했습니다.)
  
* ["Increase Test Fidelity By Avoiding Mocks" (2024)](https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html)

  > Tests that use mocks are often less faithful to the production system (lower fidelity) because they test the code in isolation from its dependencies. (Mock을 사용하는 테스트는 의존성으로부터 격리된 코드를 테스트하기 때문에, 실제 운영 시스템에 대한 충실도가 떨어지는 경우가 많습니다.)

지나친 Mocking이나 Stubbing은 테스트 구현을 편하게 할 수는 있어도, 실제 운영 환경에서의 동작을 보장하지 못하며 리팩터링 내성을 떨어뜨립니다.

그래서 저는 제어할 수 있는 영역에는 **가능한 실제 객체를 사용**하고, 외부 서비스와 같은 제어할 수 없는 영역은 가짜 객체를 사용한다는 생각이 들었습니다.

이를 정리하면 다음과 같습니다.
- 우리 서비스인 경우(내부), 가급적 실제 객체를 사용합니다.
  - 비즈니스적으로 특정 상태를 재현하기 어려운 경우에만 `Stub`을 사용합니다.
  - 예외 발생 상황 등을 검증할 때 제한적으로 `Spy`를 사용합니다.
- 우리 서비스가 아닌 경우(외부) 제어할 수 없는 영역이므로 `Stub`이나 `Fake` 객체와 같은 가짜 객체를 사용합니다.

#### Spy 객체를 활용하여 예외 상황 검증하기

위 전략 중 "제한적으로 `Spy`를 사용한다"는 부분에 대해 구체적인 사례를 공유하고자 합니다.

`Spy` 객체는 실제 객체를 감싸서 동작하되, 특정 메서드만 원하는 동작으로 변경(Stubbing)하거나, 호출 여부를 감시할 수 있다는 장점이 있습니다.
저는 주로 "대부분 실제 로직을 태우고 싶지만, 특정 구간에서만 강제로 예외를 발생시켜야 할 때" `Spy`를 유용하게 사용했습니다.

예를 들어, 쿠폰 발급 실패를 처리하는 핸들러(FailureHandler)를 테스트한다고 가정해 봅시다. 
DB 연결이 끊어진 치명적인 상황(Fatal Exception)을 재현하려면, 실제 서비스 객체의 로직을 수행하다가 **저장하는 시점에만 강제로 예외를 던져야 합니다.**

```java
@ActiveProfiles("test")
@SpringBootTest
class CouponIssueFailureHandlerTest {

    @Autowired
    private CouponIssueFailureHandler failureHandler;

    // 실제 객체처럼 동작하되, 필요할 때만 동작을 조작하기 위해 @SpyBean 사용
    @SpyBean
    private CouponIssuanceService couponIssuanceService;

    @Test
    @DisplayName("[신규 - 실패] DB 다운 시, 실패 이력 저장을 '시도'하고 예외를 던진다 (ack 안함).")
    void fail_record_failure_and_rethrow_when_fatal_exception_on_handle() {
        // given
        // ... (메시지 생성 로직 생략) ...
        
        // Spy 객체의 recordFailure 메서드가 호출될 때만 강제로 예외를 던지도록 설정 (Stubbing)
        doThrow(new RuntimeException("DB Connection Pool is down"))
                .when(couponIssuanceService).recordFailure(any(), any());

        // when & then
        // 예외가 잡히지 않고 전파되는지 검증 (치명적 오류이므로 Ack를 보내면 안 됨)
        assertThatThrownBy(() -> failureHandler.handle(message, ack, e))
                .isInstanceOf(CouponConsumerException.class); // 예외가 전파되는지 검증

        // 실제 메서드가 호출되었는지(행위) 검증
        verify(couponIssuanceService, times(1)).recordFailure(any(), any());
    }
}
```

위 코드처럼 `Spy`를 사용하면 정상적인 흐름은 실제 객체에 위임하고, 테스트하고 싶은 엣지 케이스를 제대로 검증할 수 있습니다.

이러한 전략이 절대적인 정답은 아니겠지만, 비즈니스 상황과 팀의 환경에 맞춰 가치 있고, 신뢰성 높은 테스트를 작성하기 위한 저만의 기준이 되었습니다.

## 마무리하며

완벽한 테스트는 없겠지만, 매 순간마다 더 나은 테스트를 고민하며 팀의 생산성과 서비스의 안정성에 기여하는 개발자가 되고 싶습니다.

(추후 작성 예정)

## Reference

* [[토스] 기술 블로그 -  가치있는 테스트를 위한 전략과 구현](https://toss.tech/article/test-strategy-server) (발행 날짜: 2024. 10. 24)

* [[카카오페이] 기술 블로그 - 실무에서 적용하는 테스트 코드 작성 방법과 노하우](https://tech.kakaopay.com/tag/test-code/) (발행 날짜: 2023. 07. 10 ~  2025. 02. 26)