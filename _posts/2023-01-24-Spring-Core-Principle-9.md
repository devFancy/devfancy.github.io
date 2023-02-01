---
layout: post
title: " Spring 핵심원리 - 기본편 : 빈 스코프 "
categories: Spring
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [Spring 핵심원리 - 기본편 : 객체 지향 설계와 스프링](https://fancy96.github.io/Spring-Core-Principle-1/)

2. [Spring 핵심원리 - 기본편 : 스프링으로 전환하기](https://fancy96.github.io/Spring-Core-Principle-2/)

3. [Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈](https://fancy96.github.io/Spring-Core-Principle-4/)

4. [Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회](https://fancy96.github.io/Spring-Core-Principle-4-2/)

5. [Spring 핵심원리 - 기본편 : 싱글톤 컨테이너](https://fancy96.github.io/Spring-Core-Principle-5/)

6. [Spring 핵심원리 - 기본편 : 컴포넌트 스캔](https://fancy96.github.io/Spring-Core-Principle-6/)

7. [Spring 핵심원리 - 기본편 : 의존관계 자동 주입](https://fancy96.github.io/Spring-Core-Principle-7/)

8. [Spring 핵심원리 - 기본편 : 빈 생명주기 콜백](https://fancy96.github.io/Spring-Core-Principle-8/)

9. [Spring 핵심원리 - 기본편 : 빈 스코프](https://fancy96.github.io/Spring-Core-Principle-9/)

## 빈 스코프란

* 스코프는 빈이 존재할 수 있는 범위를 뜻한다.

* 스프링은 다음과 같은 다양한 스코프를 지원한다.

    * `싱글톤` :  **기본 스코프**, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프이다.

    * `프로토타입` : 빈의 생성과 의존관계 주입까지만 관여한다.

    * `웹 관련 스코프`

        * `request` : 웹 요청이 들어오고 나갈때 까지 유지되는 스코프이다.

        * `session` : 웹 세션이 생성되고 종료될 때 까지 유지되는 스코프이다.

        * `application` : 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프이다.

## 프로토타입 스코프

* 프로토타입 빈은 매번 사용할 때마다 의존관계 주입이 완료된 새로운 객체가 필요하면 사용한다.

* 그런데 실무에서 웹 애플리케이션을 개발하다보면, **싱글톤 빈으로 대부분의 문제를 해결**할 수 있기 때문에,

  `프로토타입 스코프`는 실무에서 직접 사용할 일은 거의(99%) 없다.

* 하지만, 프로토타입 스코프가 무엇이고, 왜 사용하는지는 알아야하는 필요성은 있기에 정리는 하고 넘어가자.

* `싱글톤 스코프`의 빈을 조회하면 스프링 컨테이너는 **항상 같은 인스턴스의 스프링 빈을 반환**한다. 

  반면에 `프로토타입 스코프`를 스프링 컨테이너에 조회하면 스프링 컨테이너는 **항상 새로운 인스턴스를 생성해서 반환**한다.

프로토타입 빈 요청1

![](/assets/img/spring/spring-core-principle-9_1.png)


* [1] 프로토타입 스코프의 빈을 스프링 컨테이너에 요청한다. (클라이언트가 요청)

* [2] 스프링 컨테이너는 해당 시점에 프로토타입 빈을 생성하고, 필요한 의존관계를 주입한다. (새로운 빈 생성 + DI)

프로토타입 빈 요청2

![](/assets/img/spring/spring-core-principle-9_2.png)

* [3] 스프링 컨테이너는 생성한 프로토타입 빈을 클라이언트에 반환한다. (반환한 이후에 스프링 컨테이너가 **따로 관리를 하지 않는다**)

* [4] 만약 클라이언트가 같은 요청을 하면, 스프링 컨테이너는 항상 새로운 프로토타입 빈을 생성해서 반환한다. 

* **핵심**은 스프링 컨테이너는 **프로토타입 빈을 생성하고, 의존관계 주입, 초기화까지만 처리하고 따로 관리를 하지 않는다.**

    * **프로토타입 빈을 관리하는 책임**은 프로토타입 빈을 받은 `클라이언트`에 있다.

    * 그래서 `@PreDestory` 같은 **종료 메서드가 호출되지 않는다.** (== 전혀 실행되지 않는다)

    * 만약 `destory()` 같은 종료 메서드가 필요하다면, 수작업을 직접 해줘야한다. 
  
       (프로토타입 스코프 클래스명 : prototypeBean -> `prototypeBean.destory();`)


## 프로토타입 스코프 - 싱글톤 빈과 함께 사용시 문제점

* 스프링 컨테이너에 `프로토타입 스코프`의 빈을 요청하면 항상 새로운 객체 인스턴스를 생성해서 반환하지만, **`싱글톤 빈`과 함께 사용할 때에는 의도한 대로 잘 동작하지 않으므로** 주의해야 한다.

싱글톤에서 프로토타입 빈 사용1

* `clientBean` 은 **싱글톤**이므로 보통 스프링 컨테이너 생성 시점에 함께 생성되고, 의존관계 주입도 발생한다.

![](/assets/img/spring/spring-core-principle-9_3.png)

* [1] `clientBean` 은 **의존관계 자동 주입**을 사용한다. 주입 시점에 스프링 컨테이너에 프로토타입 빈을 요청한다.

* [2] 스프링 컨테이너는 프로토타입 빈을 생성해서 `clientBean` 에게 반환한다. 프로토타입의 빈의 count 필드 값은 0이다.

* 위의 그림처럼 `clientBean`은 프로토타입 빈을 내부 필드에 보관한다. (정확히는 참조값을 보관한다)

싱글톤에서 프로토타입 빈 사용2

![](/assets/img/spring/spring-core-principle-9_4.png)

* **클라이언트 A**는 `clientBean` 을 스프링 컨테이너에 요청해서 받는다. **싱글톤이므로 항상 같은 `clientBean` 이 반환**된다.

* [3] 클라이언트 A는 `clientBean.logic()` 을 호출한다.

* [4] `clientBean` 은 prototypeBean의 `addCount()` 를 호출해서 프로토타입 빈의 count를 증가시킨다. count값이 1이 된다.(0->1)

싱글톤에서 프로토타입 빈 사용3

![](/assets/img/spring/spring-core-principle-9_5.png)

* **클라이언트 B**는 `clientBean`을 스프링 컨테이너에 요청해서 받는다. 클라이언트 B 역시 싱글톤이므로 항상 같은 `clientBean`이 반환된다.

* 여기서 핵심은 `clientBean`이 내부에 가지고 있는 `프로토타입 빈`은 이미 과거에 주입이 끝난 빈이다. **주입 시점에 스프링 컨테이너에 요청해서 프로토타입 빈이 새로 생성된 것이기 때문에, 사용할 때에는 새로 생성이 되지 않는다.**

* [5] 따라서 클라이언트 B가 `clientBean.logic()`을 호출하면,

* [6] `clientBean`은 `prototypeBean`의 `addCount()`를 호출해서 프로토타입 빈의 count를 증가시켜서 2가 된다(1->2)

## 프로토타입 스코프 - 싱글톤 빈과 함께 사용시 Provider로 문제 해결

### ObjectFactory, ObjectProvider

핵심 코드 - SingletonWithPrototypeTest1.java

```java
@Scope("singleton")
static class ClientBean {

    @Autowired
    private ObjectProvider<PrototypeBean> prototypeBeanProvider;
    //private ObjectFactory<PrototypeBean> prototypeBeanProvider;

    public int logic() {
        PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
        prototypeBean.addCount();
        int count = prototypeBean.getCount();
        return count;
    }

}
```

* 지정한 빈을 컨테이너에서 대신 찾아주는 DL 서비스를 제공하는 것이 `ObjectProvider`이다.

    참고) `DL`(Dependency Lookup) : 직접 필요한 의존관계를 찾는 것(<-> DI : 의존관계를 외부에서 주입받는 것) 

* 실행(Run)해보면 알 수 있듯이, `prototypeBeanProvider.getObject()`을 통해 **항상 새로운 프로토타입 빈이 생성되는 것을 확인**할 수 있다.

* `ObjectProvider`의 `getObject`를 호출하면 내부에서 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다(`DL`)

* ObjectFactory 와 ObjectProvider 의 특징

    * 공통점 : 별도의 라이브러리가 필요없고, 스프링에 의존한다.    

    * `ObjectFactory` : 기능이 단순하다.

    * `ObjectProvider` : `ObjectFactory` 상속, 옵션, 스트림 처리 등 편의 기능이 많다.(ObjectFactory 의 상위 버전)

### JSR-330 Provider

* 마지막 방법은 `javax.inject.Provider`라는 JSR-330 **자바 표준**을 사용하는 방법이다.

* 스프링 부트는 `jakarta.inject.Provider`를 사용한다.

* 이 방법을 사용하려면 다음 라이브러리를 통해 gradle(`build.gradle`)에 추가해야 한다.

    * 스프링 부트 3.0 미만 : `javax.inject:javax.inject:1 ` 를 dependencies{} 안에 추가한다.

    * 스프링 부트 3.0 이상 : `jakarta.inject:jakarta.inject-api:2.0.1` 를 dependencies{} 안에 추가한다.

핵심 코드 - SingletonWithPrototypeTest1.java

```java
@Scope("singleton")
    static class ClientBean {

        @Autowired
        private Provider<PrototypeBean> provider;
        //private ObjectFactory<PrototypeBean> prototypeBeanProvider;

        public int logic() {
            PrototypeBean prototypeBean = provider.get();
            prototypeBean.addCount();
            int count = prototypeBean.getCount();
            return count;
        }

    }
```

* 실행(Run)해보면 `provider.get()`을 통해 항상 새로운 프로토타입 빈이 생성되는 것을 확인할 수 있다.

* `provider` 의 `get()` 을 호출하면 내부에서는 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다. (DL)

* 자바 표준이고, 기능이 단순하므로 단위 테스트를 만들거나 mock 코드를 만들기는 훨씬 쉬워진다.

* JSR-330 Provider 의 특징

    * `get()` 메서드 하나로 기능이 매우 단순하지만, 별도의 라이브러리가 필요하다.

    * **자바 표준이므로 스프링이 아닌 다른 컨테이너에서도 사용**할 수 있다.


## 웹 스코프

* 웹 스코프의 특징

    * 웹 스코프는 **웹 환경**에서만 동작한다.

    * 웹 스코프는 프로토타입과 다르게 **스프링이 해당 스코프의 종료시점까지 관리하므로 종료 메서드가 호출된다.**


### 웹 스코프의 종류

* `request` : HTTP 요청 하나가 들어오고 나갈 때 까지 유지되는 스코프로, **각각의 HTTP 요청마다 별도의 빈 인스턴스가 생성되고 관리된다.**

* `session` : **HTTP Session**과 동일한 생명주기를 가지는 스코프이다.

* `application` : **서블릿 컨텍스트**(`ServletContext`)와 동일한 생명주기를 가지는 스코프이다.

* `websocket` : **웹 소켓**과 동일한 생명주기를 가지는 스코프이다.

![](/assets/img/spring/spring-core-principle-9_6.png)

* HTTP request 의 요청이 들어오고 나갈때까지의 lifecycle 동안은 무조건 같은 스코프가 관리가 된다. 

    그래서 클라이언트 A가 `request`(요청)을 하면, A 전용 스프링 빈이 생성되고 운영이 되다가, A의 요청이 나가면 `destroy`(종료)가 된다.

    마찬가지로, 클라이언트 B가 `request`(요청)을 하면, B 전용 스프링 빈이 생성되고 운영이 되다가, B의 요청이 나가면 `destroy`(종료)가 된다.


## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
