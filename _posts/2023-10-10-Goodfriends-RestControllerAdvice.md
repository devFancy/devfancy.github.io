---
layout: post
title: " 다양한 예외 처리들을 관리하기 위해 @RestControllerAdvice 도입 "
categories: Goodfriends
author: devFancy
---
* content
{:toc}

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/23)에 게시된 글 입니다.

**예외 처리**는 애플리케이션을 만드는데 있어서 매우 중요한 부분을 차지합니다.

Spring 프레임워크는 다양한 에러 처리 방법을 제공하는데, `굿프렌즈팀`은 기존에 어떻게 처리했고, 이후에 어떻게 개선했는지 과정을 설명해보겠습니다.

## 이전 굿프렌즈 예외 처리 방식

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

즉, 클라이언트 입장에서 에러 코드가 무엇인지 확인할 수 있다는 장점을 가집니다. 

하지만 애플리케이션에 필요한 기능들을 개발하다 보면, 다양한 예외처리를 만들어야 합니다. 각 예외 처리 클래스마다 위에 @ResponseStatus을 붙여서 상태 코드를 넣어주는 것은 좋지만, 한 눈에 볼 수 없습니다. 

그리고 시간이 지날 수록 본인이 지정한 예외 처리 클래스가 어떤 상태 코드 값인지 제대로 기억하기 쉽지 않습니다. 또한 외부에서 정의한 Exception 클래스에는 @ResponseStatus를 붙여줄 수 없습니다.

## ResponseStatusException

외부 라이브러리에서 정의한 코드는 우리가 수정할 수 없기 때문에 @ResponseStatus를 붙여줄 수 없습니다. 
Spring5에는 이러한 @ResponseStatus의 프로그래밍적 대안으로 손쉽게 에러를 반환할 수 있는 `ResponseStatusException`이 추가되었습니다.
`ResponseStatusException`은 HttpStatus와 함께 선택적으로 reason과 cause를 추가할 수 있습니다.


`ResponseStatusException`를 사용하면 다음과 같은 이점을 누릴 수 있습니다.
- 기본적인 예외 처리를 빠르게 적용할 수 있으므로 손쉽게 프로토타이핑을 할 수 있습니다.
- 불필요하게 많은 별도의 예외 클래스를 만들지 않아도 되고, 프로그래밍 방식으로 예외를 직접 생성하므로 예외를 더욱 더 제어할 수 있습니다.

하지만 그럼에도 불구하고 `ResponseStatusException`는 다음과 같은 한계점을 지니고 있습니다.
- 직접 예외 처리를 프로그래밍하므로 일관된 예외 처리가 하기 어렵습니다.
- 예외 처리 코드가 중복될 수 있고, Spring 내부의 예외를 처리하는 것이 어렵습니다.

이러한 이유로 인해 API 에러 처리를 일관성있게 하기 위해서 최근에는 `@ExceptionHandler`를 사용하는 방식이 많아졌습니다.

## @ExceptionHandler

`@ExceptionHandler`는 **매우 유연하게 에러를 처리할 수 있는 방법**을 제공하는 어노테이션입니다. `@ExceptionHandler`은 다음에 어노테이션을 추가함으로써 에러를 손쉽게 처리할 수 있습니다.

- 컨트롤러의 메서드
- @ControllerAdvice나 @RestControllerAdvice가 있는 클래스의 메서드

`@ExceptionHandler`는 @ResponseStatus와 달리 에러 응답(payload)을 자유롭게 다룰 수 있다는 점에서 유연합니다. 예를 들어 응답을 다음고가 같이 정의해서 내려주면 좋을 것 같습니다.
- code: 어떠한 종류의 에러가 발생하는지에 대한 에러 코드
- message: 왜 에러가 발생했는지에 대한 설명

```java
...
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
...
```

위와 같이 Not_FOUND와 같은 HTTP 표준 상태와 같이 가독성좋은 값을 사용하는 것이 클라이언트의 입장에서도 대응하기 좋고, 유지보수하는 입장에서도 좋습니다. 
또한 각 기능별로 예외 처리에 대한 클래스를 `@ExceptionHandler`을 통해 한 곳에 관리할 수 있습니다.


@ExceptionHandler를 사용 시에 주의할 점은 **@ExceptionHandler에 등록된 예외 클래스와 파라미터로 받는 예와 클래스가 동일해야 한다는 것입니다. 
만약 값이 다르다면 스프링은 컴파일 시점에 에러를 내지 않다가 런타임 시점에 에러를 발생시킵니다.**

```shell
java.lang.IllegalStateException: No suitable resolver for argument [0] [type=...]
HandlerMethod details: ...
```

## @RestControllerAdvice을 적용한 굿프렌즈팀의 예외 처리 방식

Spring은 전역적으로 @ExceptionHandler를 적용할 수 있는 @ControllerAdvice와 @RestControllerAdvice 어노테이션을 각각 Spring3.2, Spring4.3부터 제공하고 있습니다. 
두 어노테이션의 차이점은 @ResponseBody가 붙어 있어 응답을 Json 형식으로 내려준다는 점입니다.  

굿프렌즈팀에서는 ControllerAdvice 클래스를 만들어서 @ExceptionHandler를 적용했습니다.

ControllerAdvice 클래스는 여러 컨트롤러에 대해 전역적으로 ExceptionHandler를 적용해줍니다. 
그러므로 다음과 같이 전역적으로 에러를 핸들링하는 클래스를 만들어 ExceptionHandler 어노테이션을 붙여주면 에러 처리를 위임할 수 있습니다.

(아래의 ControllerAdvice는 여러 컨트롤러에 적용하기 때문에 굿프렌즈팀의 global - error 패키지 안에 만들었습니다)

```java
@RestControllerAdvice
public class ControllerAdvice {
    private static final Logger log = LoggerFactory.getLogger(ControllerAdvice.class);
    ...
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
    ...
}
```

그리고 추가적으로 **(1)** 에러 메시지를 반환해주는 ErrorResponse dto 클래스 생성과 

**(2)** 서버에서 예상치 못한 에러가 발생할 때(에러코드: 500) 에러에 대한 내용을 로그로 정확히 보여주기 위해 ErrorReportRequest dto 클래스 생성했습니다.


### ErrorResponse

```java
package woorifisa.goodfriends.backend.global.error.dto;

public class ErrorResponse {
    private final String message;

    public ErrorResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

### ErrorReportRequest

```java
package woorifisa.goodfriends.backend.global.error.dto;

import javax.servlet.http.HttpServletRequest;

public class ErrorReportRequest {

    private static final String ERROR_REPORT_FORMAT = "[%s] %s";

    private final HttpServletRequest request;
    private final Exception exception;

    public ErrorReportRequest(final HttpServletRequest request, final Exception exception) {
        this.request = request;
        this.exception = exception;
    }

    public String getLogMessage() {
        String requestUri = request.getRequestURI();
        String requestMethod = request.getMethod();

        return String.format(ERROR_REPORT_FORMAT, requestMethod, requestUri);
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public Exception getException() {
        return exception;
    }
}

```

## ContorllerAdvice 이점 및 주의할 점

ContorllerAdvice는 전역적으로 적용되는데, 지금과 같이 특정 클래스에만 제한적으로 적용하기 위해 @RestControllerAdvice의 basePackages 등을 설정함으로써 제한할 수 있습니다.

이러한 ControllerAdvice를 이용함으로써 다음과 같은 이점을 누릴 수 있습니다.

1. 하나의 클래스로 모든 컨트롤러에 대해 전역적으로 예외 처리가 가능함
2. 직접 정의한 에러 응답을 일관성있게 클라이언트에게 내려줄 수 있음
3. 별도의 try-catch문이 없어 코드의 가독성이 높아짐

이러한 이유로 API에 의한 예외 처리를 하는 경우 ControllerAdvice 클래스를 이용하면 됩니다. 
하지만 ControllerAdvice 클래스를 사용할 때는 항상 주의해야할 점이 있습니다. 
여러 ControllerAdvice가 있는 경우 @Order 으로 순서를 지정하지 않는다면 Spring은 ControllerAdvice를 임의의 순서로 처리할 수 있기 때문에 일관된 예외 응답을 처리하기 위해서는 이러한 점을 주의해야 합니다.

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

- [Annotation Interface ExceptionHandler](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html)
- [[Spring] 스프링의 다양한 예외 처리 방법(ExceptionHandler, ControllerAdvice 등) 완벽하게 이해하기](https://mangkyu.tistory.com/204)


