---
layout: post
title: " 좋은 단위 테스트란? (feat. 히빗) "
categories: TestCode
author: devFancy
---
* content
{:toc}

> 이 글은 [히빗 프로젝트(ver.2)](https://github.com/hibit-team/hibit-backend-improved)를 혼자서 개발하면서 경험한 내용을 정리한 글입니다.

## Introduction

이전 [히빗 프로젝트(ver.1)](https://github.com/hibit-team/hibit-backend)에서는 테스트 코드를 도입하지 못했다. 정확하게 말하면 안했다.

작년 4월부터 11월까지 진행했던 팀 프로젝트인 히빗(ver.1) 을 진행하면서, 초반에는 테스트 코드를 작성하려고 노력했다.

그 당시에 소셜 로그인 기능에 대한 단위 테스트와 통합 테스트를 작성하면서 배운 내용을 정리해서 팀원들에게 공유했지만, 팀원마다 팀 프로젝트 뿐만 아니라 다른 곳에도 시간을 투자해야했기 때문에, 이행하지 못했다.

그리고 나 역시 히빗 프로젝트 뿐만 아니라 다른 활동들을 하고 있었기 때문에, 시간이 갈 수록 테스트 코드를 작성하는 것에 대한 손이 가질 않았다.

하지만, 9월부터 QA 작업을 진행하면서 정말 많은 에러들이 발생했다.

어느 부분에서 예외가 발생하였고, 어떤 현상이 발생했는지 아래와 같이 세부 기능별로 작성했다.

![](/assets/img/testcode/SpringBoot-TestCode-Unit-Error.png)

9월부터 시작한 QA 작업은 11월까지 이어져갔고, 에러가 발생한 부분들이 많아서 QA Note Ver1, QA Note Ver2 로 나눠서 정리했다.

![](/assets/img/testcode/SpringBoot-TestCode-Unit-Error.png)

QA 작업을 하면서 정말 불편한 부분이 서비스에 따라 다르겠지만, 해당 서비스를 이용하기 위해선 필수적인 단계들을 매번 반복해야 하는 점이다.

우리 서비스는 서비스를 이용하기 위해서는 `소셜 로그인 -> 회원가입 -> 프로필 작성` 까지 해야한다. (이 과정은 진심으로 정말 100번 넘게 돌린 것 같다..)

그렇기 때문에, 해당 과정을 매번 반복해야 하는 점이 있고, 기능이 너무 많다보니 테스트 하는데 시간이 오래 걸린다는 점이다.

그래서 이러한 과정을 다음부턴 **자동화**해야겠다는 생각이 들었고, 이후의 `히빗 ver.2` 에서는 단위 테스트를 적극 사용하고자 도입하게 되었다.

## 단위 테스트란?

> `단위 테스트`는 작은 코드 단위를 독립적으로 검증하는 테스트이다. 여기서 작은 코드는 클래스 혹은 메서드를 의미한다.
>
>  여기서 작은 코드는 클래스 혹은 메서드를 의미한다.

작년 11월부터 12월까지 [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard) 강의를 듣고 정리한
[Practical Testing: 테스트 코드 작성 방법](https://devfancy.github.io/Practical-Testing/) 을 바탕으로 단위 테스트를 작성하였다.

구조적으로 보면, 단위 테스트는 서비스와 모델에 가깝다고 볼 수 있다.

![](/assets/img/testcode/SpringBoot-TestCode-Unit-1.png)

## 단위 테스트 도입

기존 `회원`에 대한 엔티티 클래스는 다음과 같다.

```java
@Entity
public class Member extends BaseEntity {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-z0-9._-]+@[a-z]+[.]+[a-z]{2,3}$");
    private static final int MAX_DISPLAY_NAME_LENGTH = 20;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;
    
    @Column(name = "email", nullable = false)
    private String email; // 이메일

    @Column(name = "display_name", nullable = false)
    private String displayName; // 닉네임

    @Enumerated(value = EnumType.STRING)
    @Column(name = "social_type", nullable = false)
    private SocialType socialType; // 소셜 로그인 유형
    
    protected Member() {
    }

    @Builder
    public Member(final String email, final String displayName, final SocialType socialType) {
        super();
        validateEmail(email);
        validateDisplayName(displayName);

        this.email = email;
        this.displayName = displayName;
        this.socialType = socialType;
    }

    private void validateEmail(final String email) {
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        if (!matcher.matches()) {
            throw new InvalidMemberException("이메일 형식이 올바르지 않습니다.");
        }
    }

    /**
     * isEmpty() 는 "" 에 대한 문자열을 확인 -> 비어있는 경우 true 반환
     * isBlank() "", " " 에 대한 문자열을 확인 -> 비어있는 경우 true 반환
    */
    private void validateDisplayName(final String displayName) {
        if (displayName.isBlank() || displayName.length() > MAX_DISPLAY_NAME_LENGTH) {
            throw new InvalidMemberException(String.format("이름은 1자 이상 20자 %d이하여야 합니다.", MAX_DISPLAY_NAME_LENGTH));
        }
    }
    // getter 생략
}
```

`회원` 엔티티 클래스 내부에는 `이메일`, `닉네임`, `소셜 로그인 유형`에 대한 필드값이 있고, Builder 어노테이션이 적용된 Member 메서드가 있다.

해당 엔티티 클래스에 대해 단위 테스트 코드를 작성한 코드는 아래와 같다.

```java
class MemberTest {
    @DisplayName("회원을 생성한다.")
    @Test
    void 회원을_생성한다() {

        // given & when & then
        assertDoesNotThrow(() -> new Member(팬시_이메일, 팬시_닉네임, SocialType.GOOGLE));
    }

    @DisplayName("회원의 email 형식이 맞지 않으면 예외가 발생한다.")
    @ParameterizedTest
    @ValueSource(strings = {"fancy.junyongmoon@", "fancy.junyongmoon@amail", "fancy.junyongmoon"})
    void 회원의_email_형식이_맞지_않으면_예외가_발생한다(final String email) {

        // given & when & then
        assertThatThrownBy(() -> new Member(email, 팬시_닉네임, SocialType.GOOGLE))
                .isInstanceOf(InvalidMemberException.class);
    }

    @DisplayName("회원의 닉네임 형식이 빈칸이거나 공백이면 예외가 발생한다.")
    @ParameterizedTest
    @ValueSource(strings = {"", " "})
    void 회원의_닉네임_형식이_빈칸이거나_공백이면_예외가_발생한다(final String displayName) {

        // given & when & then
        assertThatThrownBy(() -> new Member(팬시_이메일, displayName, SocialType.GOOGLE))
                .isInstanceOf(InvalidMemberException.class);
    }

    @DisplayName("회원의 닉네임 글자가 20자 초과하면 예외가 발생한다.")
    @ParameterizedTest
    @ValueSource(strings = {"일이삼사오육칠팔구십일이삼사오육칠팔구십일", "일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십"})
    void 회원의_닉네임_글자가_20자_초과하면_예외가_발생한다(final String displayName) {

        // given & when & then
        assertThatThrownBy(() -> new Member(팬시_이메일, displayName, SocialType.GOOGLE))
                .isInstanceOf(InvalidMemberException.class);
    }
}
```

좋은 단위 테스트란 무엇인지에 대해 나는 아래와 같이 핵심 기준을 두고 작성했다.

1. 테스트 케이스 세분화하기

2. DisplayName을 섬세하게

3. BDD 스타일로 작성하기

4. 한 눈에 들어오는 Test Fixture 구성하기 (선택)

위 4가지 기준에 대해서 하나씩 살펴보고자 한다.

### 1. 테스트 케이스 세분화하기

나는 `해피 케이스`와 `예외 케이스`, 이 두 가지 케이스를 가지고 경계값 테스트를 도출했다.

* `해피 케이스` - 회원을 생성한다.

* `예외 케이스` - 회원의 email 형식이 맞지 않으면 예외가 발생한다. / 회원의 닉네임 형식이 빈칸이거나 공백이면 예외가 발생한다. / ...

```java
class MemberTest {
    @Test
    void 회원을_생성한다() { // 내부는 생략
    }
    
    @Test
    void 회원의_email_형식이_맞지_않으면_예외가_발생한다(final String email) {
    }
    
    @Test
    void 회원의_닉네임_형식이_빈칸이거나_공백이면_예외가_발생한다(final String displayName) {
    }
}
```

예외 케이스는 필드값이 많아질 수록 더 많아질거라고 생각한다.

### 2. DisplayName을 섬세하게

Junit5에서 추가된 `@DisplayName` 이라는 어노테이션을 통해 테스트에 대한 설명을 한글로 작성해서 어떤 테스트를 의미하는지 쉽게 알 수 있다.

나의 경우, 메서드 명을 영어로 작성해도 되지만, 매번 생각해야 하는 번거로움이 있어서 단순하게 `@DisPlayName`에 있는 설명과 동일하게 작성했다.

```java
class MemberTest {
    @DisplayName("회원을 생성한다.")
    @Test
    void 회원을_생성한다() {

        // given & when & then
        assertDoesNotThrow(() -> new Member(팬시_이메일, 팬시_닉네임, SocialType.GOOGLE));
    }

    @DisplayName("회원의 email 형식이 맞지 않으면 예외가 발생한다.")
    @ParameterizedTest
    @ValueSource(strings = {"fancy.junyongmoon@", "fancy.junyongmoon@amail", "fancy.junyongmoon"})
    void 회원의_email_형식이_맞지_않으면_예외가_발생한다(final String email) {

        // given & when & then
        assertThatThrownBy(() -> new Member(email, 팬시_닉네임, SocialType.GOOGLE))
                .isInstanceOf(InvalidMemberException.class);
    }
}
```

### 3. BDD 스타일로 작성하기

`BDD` (Behavior Driven Development)란

* TDD에서 파생된 개발 방법으로 함수 단위의 테스트에 집중하기 보다, **시나리오에 기반한 테스트 케이스(TC)** 자체에 집중하여 테스트를 한다.

* 개발자가 아닌 사람이 봐도 이해할 수 있을 정도의 추상화 수준(레벨)을 권장한다.

Given / When / Then

* Given: 시나리오 진행에 필요한 모든 준비 과정(객체, 값, 상태)

* When: 시나리오 행동 진행

* Then: 시나리오 진행에 대한 결과 명시, 검증(AssertJ)

정리하면, 어떤 환경에서(Given) 어떤 행동을 진행했을 때(When), 어떤 상태 변화가 일어난다(Then)와 같이 3단계를 기반으로 작성하면 DisplayName에 문장을 명확하게 작성할 수 있다.

간혹, 단위 테스트에 대한 리팩터링을 진행하다보면 Given & When & Then을 묶어주는 경우도 있다.

> `회원` 엔티티에 대한 단위 테스트 코드 (MemberTest.class)

```java
class MemberTest {
    @DisplayName("회원을 생성한다.")
    @Test
    void 회원을_생성한다() {

        // given & when & then
        assertDoesNotThrow(() -> new Member(팬시_이메일, 팬시_닉네임, SocialType.GOOGLE));
    }

    @DisplayName("회원의 email 형식이 맞지 않으면 예외가 발생한다.")
    @ParameterizedTest
    @ValueSource(strings = {"fancy.junyongmoon@", "fancy.junyongmoon@amail", "fancy.junyongmoon"})
    void 회원의_email_형식이_맞지_않으면_예외가_발생한다(final String email) {

        // given & when & then
        assertThatThrownBy(() -> new Member(email, 팬시_닉네임, SocialType.GOOGLE))
                .isInstanceOf(InvalidMemberException.class);
    }
}
```

> 회원 조회에 대한 테스트 코드 (MemberRepositoryTest.class)

```java
@DataJpaTest
class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @DisplayName("이메일을 통해 회원을 찾는다.")
    @Test
    void 이메일을_통해_회원을_찾는다() {
        // given
        Member 팬시 = memberRepository.save(팬시());

        // when
        Member actual = memberRepository.getByEmail(팬시_이메일);

        // then
        assertThat(actual.getId()).isEqualTo(팬시.getId());
    }
}
```

Given / When / Then 에 대한 과정을 나눠서 정리해보면 아래와 같다.

* Given: `MemberRepository`의 `save` 메서드를 사용하여 팬시 회원을 저장한다.

* When: `getByEmail` 메서드를 사용하여 이전에 저장한 팬시 회원의 이메일을 조회한다.

* Then: `actual` 객체의 ID와 이전에 저장한 팬시 회원의 ID가 일치하는지를 검증한다.

### 4. 한 눈에 들어오는 Test Fixture 구성하기

`Test Fixture`란 Given절을 구성할 때, 테스트를 위해 원하는 상태로 고정시킨 일련의 객체를 의미한다.

> Fixture 구성할 때 유의해야 할 점

1. 미리 셋업하는 data.sql과 같은 파일은 되도록 지양하자!

    * 애플리케이션이 점점 고도화될 수록 해당 파일에 들어가는 데이터 양이 증가하면 하나의 클래스, 혹은 문서를 볼때 테스트의 목적을 파악하기 힘들고, sql의 파일의 수가 늘어나 관리가 힘들어 질 수 있다.

2. given 절을 구성할 때 필요한 파라미터만 구성하자!

    * **테스트 클래스마다 필요한 파라미터를 넣어서 구분**하는게 관리면에서 중요하다고 생각한다.

나는 위의 2가지 유의점을 지키면서 `회원` 엔티티에 대한 단위 테스트 코드를 작성할 때, `팬시_이메일`, `팬시_닉네임` 과 같은 Test Fixture를 사용했다.

해당 값들은 해당 클래스 이외에도 여러 클래스에도 반복적으로 사용하기 때문에 `MemberFixtures` 클래스로부터 import해서 가져왔다.

이러한 Test Fixture를 사용하면 여러 테스트에서 **동일한 데이터를 사용할 때 중복을 방지하고, 데이터 변경이 필요한 경우 한 곳에서 수정**할 수 있는 이점이 있다.

또한 Test Fixture을 적용한 테스트 코드는 더 간결하고 일관성 있게 작성될 수 있어서 테스트 코드를 효율적으로 관리할 수 있다.

## 단위 테스트의 장점

단위 테스트 코드를 작성하면 다음과 같은 장점을 얻을 수 있다.

* 단위 테스트를 통해 코드의 각 부분이 **예상대로 작동하는지 시나리오를 작성하고 확인**함으로써 버그를 조기에 감지할 수 있다.

* 또한 코드를 리팩터링할 때에도 단위 테스트가 있다면 변경된 코드가 여전히 **예상대로 동작**하는지 확인할 수 있어서 안전한 리팩터링을 지원해준다.

* 그리고 코드의 동작 방식을 문서화하는 역할을 가지고 있어 **문서**라고 표현할 수 있다. 이는 과거에 했던 고민의 결과물을 새로운 개발자나 유지보수를 위해 활용될 수 있다.

이처럼 단위 테스트를 통해 소프트웨어 개발 및 유지보수의 효율성을 높일 수 있으며 코드의 신뢰성과 안정성을 확보하는데 기여를 준다.

## Review

이번 글에서는 왜 테스트 코드를 도입하게 되었고, 단위 테스트는 무엇인지, 그리고 실제 프로젝트를 진행하면서 `회원` 엔티티에 대한 단위 테스트를 예시로 가져와서 설명했다.

나는 단위 테스트를 작성할 때 4가지 기준을 적용했지만, 이 외에도 다양한 기법들이 존재할 거라 생각한다.

우선은 이 4가지를 기준으로 삼아 단위 테스트를 작성해보고, 이후에 추가적인 기준이 있다면, 적용해보고 괜찮다 싶으면 해당 포스팅을 업로드할 예정이다.

'Practical Testing: 실용적인 테스트 가이드' 강의를 들으면서 기억에 남는 말이 있는데,

**`가까이 보면 느리지만, 멀리 보면 가장 빠르다`**

이 말은 테스트 작성은 초기에는 시간이 오래 걸리고 귀찮은 작업일 수 있지만, 시간이 흐를수록 서비스가 고도화되면서 테스트 코드가 내 미래의 시간을 절약해줄 수 있다는 것을 의미한다고 느껴졌다.

다음 글에서는 `통합 테스트`에 대해 살펴보고, 실제 예시를 통해 어떻게 구성했는지 기억과 경험을 기록해보자. ✍🏻

## Reference

* [테스트 주도 개발 시작하기](https://product.kyobobook.co.kr/detail/S000001248962)

* [Practical Testing: 실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-실용적인-테스트-가이드/dashboard)
