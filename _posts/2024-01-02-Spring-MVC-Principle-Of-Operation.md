---
layout: post
title:  " [Spring] Spring MVC 구조 이해 "
categories: Spring
author: devFancy
---
* content
{:toc}

> 이 글은 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1) 강의를 바탕으로 정리한 내용입니다.

Spring MVC에 대해서는 [예전 글](https://devfancy.github.io/Spring-MVC-Concept/)에서 배경, 장점, 한계에 대해 어느 정도 정리를 했다.

이번 글은 **HTTP 요청 처리가 왔을 때 `Spring MVC 구조`가 어떻게 동작하는지** 과정을 정리하는 글이다.

동작에 대해 대해 설명하기 전에 MVC에 대해 간단하게 정리하고 넘어가보자.

## MVC

MVC는 하나의 서블릿이나, JSP로 처리하는 것을 Controller와 View라는 영역으로 서로 역할을 나눈 것을 말한다.

* `Controller` : HTTP 요청을 받아서 파라미터를 검증하고, **비즈니스 로직**을 실행한다. 
    그리고 뷰에 전달할 결과 데이터를 조회해서 모델에 담는다.

* `Model` : **뷰에 출력할 데이터**를 담아둔다.
  뷰가 필요한 데이터를 모두 모델에 담아서 전달해주는 덕분에 뷰는 비즈니스 로직이나 데이터 접근을 몰라도 되고, 화면을 렌더링 하는 일에 집중할 수 있다.

* `View` : 모델에 담겨있는 데이터를 사용해서 화면을 그리는 일에 집중한다.
  여기서는 HTML을 생성하는 부분을 말한다.

![](/assets/img/spring/Spring-mvc-1.png)

컨트롤러(Controller)에 비즈니스 로직을 둘 수도 있지만, 그렇게 되면 컨트롤러에 너무 많은 역할을 담당한다.

그래서 일반적으로 비즈니스 로직은 서비스(Service)라는 계층을 별도로 만들어서 처리한다.

그리고 컨트롤러(Controller)는 비즈니스 로직이 이쓴ㄴ 서비스를 호출하는 역할을 담당한다.

## Spring MVC 구조

![](/assets/img/spring/Spring-mvc-2.png)

위 그림에서 `디스패처 서블릿(DispatcherServlet)`이 Spring MVC의 핵심이다.

> DispacherServlet 서블릿 등록

![](/assets/img/spring/Spring-mvc-3.png)

`DispacherServlet` 도 부모 클래스에서 `HttpServlet` 을 상속 받아서 사용하고, 서블릿으로 동작한다.

* DispatcherServlet → FrameworkServlet → HttpServletBean → HttpServlet

스프링 부트는 `DispacherServlet` 을 서블릿으로 자동으로 등록하면서 `모든 경로(urlPatterns="/")`에 대해서 매핑한다.

### 요청 흐름

서블릿이 호출되면 `HttpServlet` 이 제공하는 `serivce()` 가 호출된다.

* Spring MVC는 `DispatcherServlet` 의 부모인 `FrameworkServlet` 에서 `service()` 를 **오버라이드 **해두었다.

> FrameworkServlet 클래스 - `service()`

![](/assets/img/spring/Spring-mvc-4.png)

`FrameworkServlet.service()` 를 시작으로 여러 메서드가 호출되면서 `DispacherServlet.doDispatch()` 가 호출된다.

> `DispacherServlet` 클래스는 1500줄 가까이 되기 때문에 `요청 흐름`에 필요한 부분만 가져왔다.

#### DispacherServlet.doDispatch()

```java
public class DispatcherServlet extends FrameworkServlet {
    @SuppressWarnings("deprecation")
    protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
        HttpServletRequest processedRequest = request;
        HandlerExecutionChain mappedHandler = null;
        boolean multipartRequestParsed = false;

        WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

        try {
            ModelAndView mv = null;
            Exception dispatchException = null;

            try {
                processedRequest = checkMultipart(request);
                multipartRequestParsed = (processedRequest != request);

                // Determine handler for the current request.
                // 1. 핸들러 조회
                mappedHandler = getHandler(processedRequest);
                if (mappedHandler == null) {
                    noHandlerFound(processedRequest, response);
                    return;
                }

                // Determine handler adapter for the current request.
                // 2. 핸들러 어댑터 조회-핸들러를 처리할 수 있는 어댑터
                HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

                // Process last-modified header, if supported by the handler.
                String method = request.getMethod();
                boolean isGet = HttpMethod.GET.matches(method);
                if (isGet || HttpMethod.HEAD.matches(method)) {
                    long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                    if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
                        return;
                    }
                }

                if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                    return;
                }

                // Actually invoke the handler.
                // 3. 핸들러 어댑터 실행 -> 4. 핸들러 어댑터를 통해 핸들러 실행 -> 5. ModelAndView 반환
                mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

                if (asyncManager.isConcurrentHandlingStarted()) {
                    return;
                }

                applyDefaultViewName(processedRequest, mv);
                mappedHandler.applyPostHandle(processedRequest, response, mv);
            }
            catch (Exception ex) {
                dispatchException = ex;
            }
            catch (Throwable err) {
                // As of 4.3, we're processing Errors thrown from handler methods as well,
                // making them available for @ExceptionHandler methods and other scenarios.
                dispatchException = new NestedServletException("Handler dispatch failed", err);
            }
            // processDispatchResult -> 내부 로직
            processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
        }
        
        // 밑 부분은 안봐도 됨
        catch (Exception ex) {
            triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
        }
        catch (Throwable err) {
            triggerAfterCompletion(processedRequest, response, mappedHandler,
                    new NestedServletException("Handler processing failed", err));
        }
        finally {
            if (asyncManager.isConcurrentHandlingStarted()) {
                // Instead of postHandle and afterCompletion
                if (mappedHandler != null) {
                    mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
                }
            }
            else {
                // Clean up any resources used by a multipart request.
                if (multipartRequestParsed) {
                    cleanupMultipart(processedRequest);
                }
            }
        }
    }
}
```

#### DispacherServlet.processDispatchResult()

```java
public class DispatcherServlet extends FrameworkServlet {
    private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
                                       @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv,
                                       @Nullable Exception exception) throws Exception {
        boolean errorView = false;

        // Did the handler return a view to render?
        if (mv != null && !mv.wasCleared()) {
            // 뷰 랜더링 호출
            render(mv, request, response);
            if (errorView) {
                WebUtils.clearErrorRequestAttributes(request);
            }
        } else {
            if (logger.isTraceEnabled()) {
                logger.trace("No view rendering, null ModelAndView returned.");
            }
        }
    }
}
```

#### DispacherServlet.render()

```java
public class DispatcherServlet extends FrameworkServlet {
    protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {

        View view;
        String viewName = mv.getViewName();

        // 6. 뷰 리졸버를 통해서 뷰 찾기
        // 7.View 반환
        view = resolveViewName(viewName, mv.getModelInternal(), locale, request);

        // 8. 뷰 렌더링
        view.render(mv.getModelInternal(), request, response);

    }
}
```

### 동작 순서

![](/assets/img/spring/Spring-mvc-4.png)

Spring MVC 구조를 보면서 **동작 순서**에 대해 다시 한번 확인해보자.

1. **핸들러 조회**: 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 조회한다.
2. **핸들러 어댑터 조회**: 핸들러를 실행할 수 있는 핸들러 어댑터를 조회한다.
3. **핸들러 어댑터 실행**: 핸들러 어댑터를 실행한다.

4. **핸들러 실행**: 핸들러 어댑터가 실제 핸들러를 실행한다.

5. **ModelAndView 반환**: 핸들러 어댑터는 핸들러가 반환하는 정보를 ModelAndView로 **변환**해서 반환한다.

6. **viewResolver 호출**: 뷰 리졸버를 찾고 실행한다.

* JSP의 경우: `InternalResourceViewResolver` 가 자동 등록되고, 사용된다.

7. **View 반환**: 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고,렌더링역할을 담당하는뷰객체를 반환한다.

* JSP의 경우 `InternalResourceView(JstlView)` 를 반환하는데, 내부에 `forward()` 로직이 있다.

8. **뷰 렌더링**: 뷰를 통해서 뷰를 렌더링 한다.

#### 인터페이스 살펴보기

Spring MVC의 큰 강점은 **`DispatcherServlet` 코드의 변경 없이, 원하는 기능을 변경하거나 확장할 수 있다**는 점이다. 
지금까지 설명한 대부분을 확장 가능할 수 있게 인터페이스로 제공한다.

이 인터페이스들만 구현해서 `DispatcherServlet` 에 등록하면 나만의 컨트롤러를 만들 수도 있다.

> 주요 인터페이스 목록

* 핸들러 매핑: `org.springframework.web.servlet.HandlerMapping`

* 핸들러 어댑터: `org.springframework.web.servlet.HandlerAdapter`

* 뷰 리졸버: `org.springframework.web.servlet.ViewResolver`

* 뷰: `org.springframework.web.servlet.View`

## 정리

Spring MVC는 코드 분량도 매우 많고, 복잡해서 내부 구조를 다 파악하기 쉽지 않다.

MVC는 이미 전세계 수 많은 개발자들의 요구사항에 맞추어 기능을 계속 확장했기 때문에 나만의 컨트롤러를 만드는 일은 없다.

그래서 애플리케이션을 만들 때 필요로 하는 대부분의 기능이 이미 다 구현되어 있다.

그래도 이렇게 **핵심 동작방식**을 알아두면 향후 문제가 발생했을 때 어떤 부분에서 문제가 발생했는지 쉽게 파악하고, 문제를 해결할 수 있다.

우선 전체적인 구조가 이렇게 되어있구나 하고 이해하자.

## Reference

* [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)