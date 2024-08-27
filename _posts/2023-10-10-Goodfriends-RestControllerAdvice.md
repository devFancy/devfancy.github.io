---
layout: post
title: " [Goodfriends] Spring에서 다양한 예외 처리를 위한 @RestControllerAdvice 도입과 적용 "
categories: Side_Project, SpringBoot
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/23)에 게시된 글 입니다.

**예외 처리**는 애플리케이션을 만드는데 있어서 매우 중요한 부분을 차지합니다.

Spring 프레임워크는 다양한 에러 처리 방법을 제공하는데, `굿프렌즈팀`은 기존에 어떻게 처리했고, 이후에 어떻게 개선했는지 과정을 설명해보겠습니다.

## 문제 상황

### @ResponseStatus

이전 굿프렌즈팀(~23.09.04)에서는 비즈니스 로직에 필요한 예외 처리를 exception 이라는 패키지를 만들어서 아래와 같이 처리했습니다. 

`@ResponseStatus`은 스프링 프레임워크에서 사용하는 어노테이션으로 **처리된 요청에 대한 HTTP 응답 상태 코드와 이에 따른 메시지를 설정하는데 사용됩니다.**

```java
package woorifisa.goodfriends.backend.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundTokenException extends RuntimeException {
    public NotFoundTokenException(final String message) {
    super(message);
    }
    public NotFoundTokenException() {
    this("존재하지 않는 Token 입니다.");
    }
}
```

예를 들어, 토큰에 대한 값을 찾지 못할 경우 위와 같이 `@ReponseStatus`을 통해 HTTP 응답 상태 코드인 404 Not Found와 "존재하지 않는 Token 입니다"라는 메시지를 받게 됩니다.
해당 어노테이션을 이용하여 간단하게 상태 코드를 지정할 수 있습니다.
즉, 클라이언트 입장에서 **에러 코드가 무엇인지 확인할 수 있다는 장점**을 가집니다. 

하지만 애플리케이션에 필요한 기능들을 개발하다 보면, **다양한 예외 처리**를 만들어야 합니다. 각 예외 처리 클래스마다 위에 `@ResponseStatus`을 붙여서 상태 코드를 넣어주는 것은 좋지만, **한 눈에 볼 수 없습니다.**

그리고 시간이 지날 수록 본인이 지정한 예외 처리 클래스가 **어떤 상태 코드 값인지 제대로 기억하기 쉽지 않습니다.**
또한 **외부에서 정의한 Exception 클래스에는 `@ResponseStatus`를 붙여줄 수 없습니다.**

### ResponseStatusException

Spring5에는 이러한 @ResponseStatus의 프로그래밍적 대안으로 손쉽게 에러를 반환할 수 있는 `ResponseStatusException`이 추가되었습니다.
`ResponseStatusException`은 HttpStatus와 함께 선택적으로 reason과 cause를 추가할 수 있습니다.

`ResponseStatusException`를 사용하면 다음과 같은 이점을 누릴 수 있습니다.
- 기본적인 예외 처리를 빠르게 적용할 수 있으므로 손쉽게 프로토타이핑을 할 수 있습니다.
- 불필요하게 많은 별도의 예외 클래스를 만들지 않아도 되고, 프로그래밍 방식으로 예외를 직접 생성하므로 예외를 더욱 더 제어할 수 있습니다.

하지만 그럼에도 불구하고 `ResponseStatusException`는 다음과 같은 한계점을 지니고 있습니다.
- 직접 예외 처리를 프로그래밍하므로 일관된 예외 처리가 하기 어렵습니다.
- 예외 처리 코드가 중복될 수 있고, Spring 내부의 예외를 처리하는 것이 어렵습니다.

API 기능을 개발하다보면 각 오류 상황에 맞는 오류 응답 스펙을 정하고, JSON으로 데이터를 내려주어야 합니다.
그리고 같은 예외라고 하더라도 어떤 API에서 발생했는가에 따라 다른 예외 응답을 내려주어야 하는 세밀한 작업이 필요하다.
이러한 API 예외 처리를 해결하기 위해 최근에는 스프링에서 제공하는 `@ExceptionHandler` 어노테이션을 사용하는 방식이 많아졌습니다.

## 해결 방안

### @ExceptionHandler를 통한 예외 처리

스프링 부트가 기본으로 제공하는 `ExceptionResolver`는 다음과 같습니다.

1. `ExceptionHandlerExceptionResolver` -> (우선 순위가 가장 높다)

2. `ResponseStatusExceptionResolver` -> HTTP 응답 코드 변경

3. `DefaultHandlerExceptionResolver` -> 스프링 내부 예외 처리(우선 순위가 가장 낮다)

이때 1번인 `ExceptionHandlerExceptionResolver`가 `@ExceptionHandler`을 처리합니다.

`@ExceptionHandler`는 **매우 유연하게 에러를 처리할 수 있는 방법**을 제공하는 어노테이션입니다. `@ExceptionHandler`은 다음에 어노테이션을 추가함으로써 에러를 손쉽게 처리할 수 있습니다.

- 컨트롤러의 메서드
- @ControllerAdvice나 @RestControllerAdvice가 있는 클래스의 메서드

`@ExceptionHandler`는 @ResponseStatus와 달리 **에러 응답(payload)을 자유롭게 다룰 수 있다는 점**에서 유연합니다. 예를 들어 응답을 다음과 같이 정의해서 내려주면 좋을 것 같습니다.
- code: 어떠한 종류의 에러가 발생하는지에 대한 에러 코드
- message: 왜 에러가 발생했는지에 대한 설명

```java
@RestControllerAdvice
public class ControllerAdvice {
    private static final Logger log = LoggerFactory.getLogger(ControllerAdvice.class);

    @ExceptionHandler({ // 클라이언트 에러: 404
            NotFoundUserException.class,
            // ...
    })
    public ResponseEntity<ErrorResponse> handleNotFoundData(final RuntimeException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
}
```

> @ExceptionHandler의 실행 흐름

1. 애플리케이션 실행 중에 컨트롤러나 서비스 메서드 등에서 특정 예외가 발생할 때, `NotFoundUserException` 와 일치하는 `@ExceptionHandler` 어노테이션이 선언된 메서드가 호출됩니다. (여기서는 `handleNotFoundData` 메소드가 호출됩니다)

2. 예외를 처리하는 메서드(`handleNotFoundData`)에서는 해당 예외에 대한 응답을 생성합니다.

3. 위의 코드에서는 `ErrorResponse` 객체를 생성하고, 해당 응답을 HTTP 상태 코드 404(NOT_FOUND)와 함께 반환합니다.

4. 생성된 응답을 클라이언트에게 전송됩니다. 이 경우, HTTP 상태 코드는 404로 설정되어 클라이언트에게 해당 자원이 발견되지 않았음을 알려줍니다.

이렇게 `@ExceptionHandler` 어노테이션을 사용하면 특정 예외에 대한 처리 로직을 일괄적으로 정의할 수 있으며, 중복 코드를 피하고 통일된 에러 응답을 생성할 수 있습니다.

---

위와 같이 `NOT_FOUND`와 같은 HTTP 표준 상태와 같이 가독성이 좋은 값을 사용하는 것이 클라이언트의 입장에서도 대응하기 좋고, 유지보수하는 입장에서도 좋습니다. 
또한 각 기능별로 예외 처리에 대한 클래스를 `@ExceptionHandler`을 통해 한 곳에 관리할 수 있습니다.

`@ExceptionHandler`를 사용 시에 주의할 점은 `@ExceptionHandler`에 등록된 예외 클래스와 파라미터로 받는 예와 클래스가 동일해야 한다는 것입니다. 
만약 값이 다르다면 스프링은 컴파일 시점에 에러를 내지 않다가 **런타임 시점에 에러를 발생시킵니다.**

```shell
java.lang.IllegalStateException: No suitable resolver for argument [0] [type=...]
HandlerMethod details: ...
```

### @ControllerAdvice

`@ControllerAdvice` 는 대상으로 지정한 여러 컨트롤러에 `@ExceptionHandler` , `@InitBinder` 기능을 부여해주는 역할을 합니다.

`@ControllerAdvice` 에 대상을 지정하지 않으면 모든 컨트롤러에 적용됩니다. (글로벌 적용)

Spring은 전역적으로 `@ExceptionHandler`를 적용할 수 있는 `@ControllerAdvice`와 `@RestControllerAdvice` 을 각각 Spring3.2, Spring4.3부터 제공하고 있습니다. 

두 어노테이션의 차이점은 `@RestControllerAdvice`는 **`@ResponseBody` 가 붙어 있어 응답을 Json 형식으로 내려준다는 점입니다.**

(`@Controller` , `@RestController` 의 차이와 같습니다)

아래와 같이 @ControllerAdvice와 @RestControllerAdvice의 구현의 일부 입니다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ControllerAdvice
@ResponseBody
public @interface RestControllerAdvice {
    //...
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface ControllerAdvice {
    //...
}
```

굿프렌즈팀에서는 @RestControllerAdvice 어노테이션을 적용한 `ControllerAdvice` 클래스를 만들어서 메서드 위에 `@ExceptionHandler`를 적용했습니다.

> 대상 컨트롤러 지정 방법

```java
// Target all Controllers annotated with @RestController
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}

// Target all Controllers within specific packages
@ControllerAdvice("com.goofriends.controllers")
public class ExampleAdvice2 {}

// Target all Controllers assignable to specific classes
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```

(스프링 공식 문서 참고 - https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-controller-advice)

스프링 공식 문서 예제에서 보는 것 처럼 특정 어노테이션이 있는 컨트롤러를 지정할 수 있고, 특정 패키지를 직접 지정할 수도 있습니다.

패키지 지정의 경우 해당 패키지와 그 하위에 있는 컨트롤러가 대상이 됩니다.

그리고 특정 클래스를 지정할 수 있습니다.

만약 대상 컨트롤러 지정을 생략하면 **모든 컨트롤러에 적용**됩니다.

## HTTP 상태코드별 에러 클래스 정의

굿프렌즈팀은 400, 401, 403, 404, 405, 500 를 사용하였고, 이에 따라 에러 클래스를 정의해봤습니다.

> 400 BAD_REQUEST

* 설명: 서버는 클라이언트의 오류로 인해 요청을 처리할 수 없거나 하지 않을 것입니다. 

    * **잘못된 요청 문법**이나 **유효하지 않은 요청 메시지 구조**와 같은 경우에 사용됩니다.

* 예시) `InvalidUserException.class` : 잘못된 회원 정보입니다.

> 401 UNAUTHORIZED

* 설명: 403 Forbidden과 유사하지만 구체적으로 인증이 필요하며 실패하거나 제공되지 않은 경우에 사용됩니다.

* 예시) `EmptyAuthorizationHeaderException.class`: Header에 Authorization이 존재하지 않습니다. / `InvalidTokenException.class` : 유효하지 않은 토큰입니다.

    * **인증되지 않은(unauthenticated) 요청이 들어왔을 때 사용**합니다. 

    * 클라이언트에서 해당 요청을 보내기 위해서는 자신이 누구인지 알려주는 인증 정보가 필요한데, 인증 정보가 누락된 경우에 사용합니다.

> 403 FORBIDDEN

* 설명: 인가되지 않은(unauthorization) 요청이 들어왔을 때 사용합니다.

* 예시) `AuthorizationException.class` : 권한이 없습니다. / `InactiveUserAccessException.class` : 비활성화 상태인 유저로 해당 페이지에 접근이 불가능합니다.

    * 서버는 요청을 이해했지만 권한이 없어 이를 거부합니다. 요청이 거부된 이유를 공개하려는 서버는 응답에서 해당 이유를 설명할 수 있습니다.

    * => **필요한 권한을 갖고 있지 않는 경우**에 사용됩니다.

> 404 NOT_FOUND

* 설명: 서버에서 요청한 리소스를 찾을 수 없습니다.

* 예시) `NotFoundProductException.class` : 존재하지 않는 물품입니다. / `NotFoundOrderException` : 주문서가 존재하지 않습니다.

    * 클라이언트가 **존재하지 않는 리소스를 요청한 경우**에 일반적으로 사용됩니다.

> 405 METHOD_NOT_ALLOWED

* 설명: 요청 라인에서 수신한 메서드는 원본 서버에서 알고 있지만 대상 리소스에서는 지원되지 않습니다.

* 예시) `HttpRequestMethodNotSupportedException.class` : 지원하지 않는 HTTP 메서드 요청입니다.

    * 클라이언트가 요청한 리소스에 대해 **허용되지 않는 HTTP 메서드를 사용한 경우**에 발생합니다.

> 500 INTERNAL_SERVER_ERROR

* 설명: 서버 측에서 오류가 발생했음을 나타냅니다. 이는 클라이언트의 요청을 처리하는 동안 서버가 예기치 않은 상황에 직면하여 요청을 완료할 수 없는 경우에 사용됩니다.

* 예시) `Exception.class` : 서버에서 예상치 못한 에러가 발생했습니다. / `OAuthException.class` : Oauth 서버와의 통신 과정에서 문제가 발생했습니다.

## 결과

아래의 `ControllerAdvice`는 여러 컨트롤러에 적용하기 때문에 굿프렌즈팀의 global - error 패키지 안에 만들었습니다.

```java
@RestControllerAdvice
public class ControllerAdvice {
    private static final Logger log = LoggerFactory.getLogger(ControllerAdvice.class);
    @ExceptionHandler(MethodArgumentNotValidException.class)  // 클라이언트 에러: 400
    public ResponseEntity<ErrorResponse> handleMethodArgumentException(BindingResult bindingResult) {
        String errorMessage = bindingResult.getFieldErrors()
                .get(0)
                .getDefaultMessage();
        ErrorResponse errorResponse = new ErrorResponse(errorMessage);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler({ // 클라이언트 에러: 400
            InvalidNicknameException.class,
            InvalidUserException.class,
            InvalidDescriptionException.class,
            ReportException.class
    })
    public ResponseEntity<ErrorResponse> handleInvalidData(final RuntimeException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }
    @ExceptionHandler({ // 클라이언트 에러: 401
    EmptyAuthorizationHeaderException.class,
    InvalidTokenException.class,
    })
    public ResponseEntity<ErrorResponse> handleInvalidAuthorization(final RuntimeException e) {
    ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler({ // 클라이언테 에러: 403
            NotFoundProfile.class,
            NotAccessThisProduct.class,
            AuthorizationException.class,
            NotAccessProduct.class,
            AlreadyExitPhoneProfile.class,
            OwnProductException.class,
            NotOwnProductException.class
    })
    public ResponseEntity<ErrorResponse> handleForbidden(final RuntimeException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler({ // 클라이언트 에러: 404
            NotFoundAdminException.class,
            NotFoundOAuthTokenException.class,
            NotFoundTokenException.class,
            NotFoundProductException.class,
            NotFoundImageFileException.class,
            NotFoundUserException.class,
            NotFoundOrderException.class
    })
    public ResponseEntity<ErrorResponse> handleNotFoundData(final RuntimeException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class) //  클라이언트 에러: 405
    public ResponseEntity<ErrorResponse> handleNotSupportedMethod() {
        ErrorResponse errorResponse = new ErrorResponse("지원하지 않는 HTTP 메서드 요청입니다.");
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @ExceptionHandler(OAuthException.class) // 서버 에러: 500
    public ResponseEntity<ErrorResponse> handleOAuthException(final RuntimeException e) {
        log.error(e.getMessage(), e);
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
        return ResponseEntity.internalServerError().body(errorResponse);
    }

    @ExceptionHandler(Exception.class) // 서버 에러: 500
    public ResponseEntity<ErrorResponse> handleUnexpectedException(final Exception e,
                                                                   final HttpServletRequest request) {
        ErrorReportRequest errorReportRequest = new ErrorReportRequest(request, e);
        log.error(errorReportRequest.getLogMessage(), e);

        ErrorResponse errorResponse = new ErrorResponse("서버에서 예상치 못한 에러가 발생했습니다.");
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}
```

## `ControllerAdvice` 이점 및 주의할 점

`ControllerAdvice`는 전역적으로 적용되는데, 지금과 같이 특정 클래스에만 제한적으로 적용하기 위해 @RestControllerAdvice의 basePackages 등을 설정함으로써 제한할 수 있습니다.

이러한 `ControllerAdvice`를 이용함으로써 다음과 같은 이점을 누릴 수 있습니다.

1. 하나의 클래스로 모든 컨트롤러에 대해 전역적으로 예외 처리가 가능함

2. 직접 정의한 에러 응답을 일관성있게 클라이언트에게 내려줄 수 있음

3. 별도의 try-catch문이 없어 코드의 가독성이 높아짐

이러한 이유로 API에 의한 예외 처리를 하는 경우 `ControllerAdvice` 클래스를 이용하면 됩니다. 
하지만 `ControllerAdvice` 클래스를 사용할 때는 항상 주의해야할 점이 있습니다. 

여러 `ControllerAdvice`가 있는 경우 `@Order` 어노테이션 으로 순서를 지정하지 않는다면 Spring은 `ControllerAdvice`를 임의의 순서로 처리할 수 있기 때문에 일관된 예외 응답을 처리하기 위해서는 이러한 점을 주의해야 합니다.

- 한 프로젝트당 하나의 ControllerAdvice만 관리하는 것이 좋습니다.

- 만약 여러 ControllerAdvice가 필요하다면 basePackages나 annotations 등을 지정해야 합니다.

- 직접 구현한 Exception 클래스들은 한 공간에서 관리합니다.

## 정리

![](/assets/img/goodfriends/Goodfriends_RestController_result.png)

Spring은 매우 다양한 예외 처리 방법을 제공하고 있어 어떻게 에러를 처리하는 것이 최선의 방법인지 파악하기 어려울 수 있습니다. 
여러 스프링의 다양한 예외 처리 방법들 중에 현 프로젝트에 ControllerAdvice를 이용하는 것이 가장 좋은 방식인 것 같아 적용해보았습니다.
이후에 팀원들과 프로젝트를 진행하면서 혹시 이보다 더 좋은 방안이 떠오른다면, 다른 포스팅으로 찾아뵙겠습니다.

지금까지 읽어주셔서 감사합니다. 😌

## Reference

- [Spring MVC 2편 - 웹 개발 활용 기술: 섹션9. API 예외 처리](https://www.inflearn.com/course/스프링-mvc-2/dashboard)

- [Tecoble: ExceptionHandler와 ControllerAdvice를 알아보자](https://tecoble.techcourse.co.kr/post/2023-05-03-ExceptionHandler-ControllerAdvice/)

- [Annotation Interface ExceptionHandler](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html)

- [[Spring] 스프링의 다양한 예외 처리 방법(ExceptionHandler, ControllerAdvice 등) 완벽하게 이해하기](https://mangkyu.tistory.com/204)


