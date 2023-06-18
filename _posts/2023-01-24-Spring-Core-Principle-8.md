---
layout: post
title: " Spring 핵심원리 - 기본편 : 빈 생명주기 콜백 "
categories: Spring
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 강의를 들으며 정리한 내용을 토대로 작성하였습니다.

## Contents

* 다음 순서에 맞게 보시는 것을 권장해드립니다.

1. [Spring 핵심원리 - 기본편 : 객체 지향 설계와 스프링](https://devfancy.github.io/Spring-Core-Principle-1/)

2. [Spring 핵심원리 - 기본편 : 스프링으로 전환하기](https://devfancy.github.io/Spring-Core-Principle-2/)

3. [Spring 핵심원리 - 기본편 : 스프링 컨테이너와 스프링 빈](https://devfancy.github.io/Spring-Core-Principle-4/)

4. [Spring 핵심원리 - 기본편 : 스프링 컨테이너에 등록된 빈 조회](https://devfancy.github.io/Spring-Core-Principle-4-2/)

5. [Spring 핵심원리 - 기본편 : 싱글톤 컨테이너](https://devfancy.github.io/Spring-Core-Principle-5/)

6. [Spring 핵심원리 - 기본편 : 컴포넌트 스캔](https://devfancy.github.io/Spring-Core-Principle-6/)

7. [Spring 핵심원리 - 기본편 : 의존관계 자동 주입](https://devfancy.github.io/Spring-Core-Principle-7/)

8. [Spring 핵심원리 - 기본편 : 빈 생명주기 콜백](https://devfancy.github.io/Spring-Core-Principle-8/)

9. [Spring 핵심원리 - 기본편 : 빈 스코프](https://devfancy.github.io/Spring-Core-Principle-9/)


## 빈 생명주기 콜백 개념

* 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 안전상 연결을 모두 종료하는 작업을 하기 위해서는 객체의 초기화와 종료 작업이 필요하다.

* 이러한 객체의 초기화와 종료 작업이 필요한 경우 `빈 생명주기 콜백`을 사용한다.

## 스프링 빈의 이벤트 lifecycle

* 스프링 빈은 다음과 같은 lifecycle을 가진다.

> 스프링 컨테이너 생성 -> 스프링 빈 생성 -> 의존관계 주입 -> **초기화 콜백** -> 사용 -> **소멸전 콜백** -> 스프링 종료

* `초기화 콜백` : 빈이 생성되고, 빈의 의존관계 주입이 완료된 후에 호출된다.

* `소멸전 콜백` : 빈이 소멸되기 직전에 호출된다.

* 참고로 **객체의 생성과 초기화 작업을 분리**하는 것이 좋다. 

  * 생성자는 필수 정보(파라미터)를 받고, 메모리를 할당해서 객체를 생성하는 책임을 가진 반면에 초기화는 이렇게 생성된 값들을 활용해서 외부 커넥션을 연결하는 등 무거운 동작을 수행한다.

  * 무거운 작업을 하는 경우에는 생성과 초기화 하는 부분을 명확하게 나누는 것이 유지보수 관점에서 좋다.

  * 단순한 작업을 하는 경우에는 생성자에서 한번에 다 처리해도 된다.

* 스프링은 크게 3가지 방법으로 빈 생명주기 콜백을 지원한다.

## 인터페이스 (InitializingBean, DisposableBean)

```java
import org.springframework.beans.factory.InitializingBean;
public class NetworkClient implements InitializingBean, DisposableBean {
private String url;
public NetworkClient() {
    System.out.println("생성자 호출, url = " + url); }
    public void setUrl(String url) {
        this.url = url;
    }
    
    //서비스 시작시 호출
    public void connect() {
        System.out.println("connect: " + url);
    }
    public void call(String message) {
        System.out.println("call: " + url + " message = " + message);
    }
    
    //서비스 종료시 호출
    public void disConnect() {
        System.out.println("close + " + url);
    }
    
    //의존관계 주입이 끝나면 호출 - 초기화를 지원한다.
    @Override
    public void afterPropertiesSet() throws Exception {
    connect();
    call("초기화 연결 메시지");
    }
    
    ///종료전에 콜백 호출 - 소멸을 지원한다.
    @Override
    public void destroy() throws Exception {
        disConnect();
    }
}
```

* `InitializingBean` 은 `afterPropertiesSet()` 메서드로 초기화를 지원한다. 

* `DisposableBean` 은 `destroy()` 메서드로 소멸을 지원한다.

**출력 결과**

```text
생성자 호출, url = null
connect :null
call : null message = 초기화 연결 메시지
NetworkClient.afterPropertiesSet
connect :http://hello-spring.dev
call : http://hello-spring.dev message = 초기화 연결 메시지
17:52:32.252 [Test worker] DEBUG org.springframework.context.annotation.AnnotationConfigApplicationContext - Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@7cf6a5f9, started on Sun Jan 29 17:52:32 KST 2023
NetworkClient.destroy
close : http://hello-spring.dev
```

* 출력 결과를 보면 초기화 메서드(`afterPropertiesSet()`)가 주입 완료 후에 호출 되었고,

* 스프링 컨테이너의 종료가 호출되자 소멸 메서드(`destroy()`)가 호출 된 것을 확인할 수 있다.

* **초기화, 소멸 인터페이스 단점**

    * 이 인터페이스는 스프링 전용 인터페이스다. 해당 코드가 스프링 전용 인터페이스에 의존한다.

    * 초기화, 소멸 메서드의 이름을 변경할 수 없다.
    
    * 내가 코드를 고칠 수 없는 외부 라이브러리에 적용할 수 없다.

* 이러한 초기화, 종료 방법은 **스프링 초창기(2003.12.08)에 나온 방법들이고 현재는 거의 사용하지 않는다.** (이보다 더 좋은 방법이 있기 때문)

## 빈 등록 초기화, 소멸 메서드 지정

* 설정 정보에 `@Bean(initMethod = "init", destroyMethod = "close")` 처럼 초기화, 소멸 메서드를 지정할 수 있다.

NetworkClient 클래스

```java
package hello.core.lifecycle;
public class NetworkClient {
    public void init() { System.out.println("NetworkClient.init"); connect();
      call("초기화 연결 메시지");
    }
    public void close() {
      System.out.println("NetworkClient.close");
      disConnect();
    }
}
```

* NetworkClient 클래스에서 init(), close() 메서드로 수정한다.


BeanLifeCycleTest 클래스

```java
public class BeanLifeCycleTest {

    @Test
    public void lifeCycleTest() {
        ConfigurableApplicationContext ac = new AnnotationConfigApplicationContext(LifeCycleConfig.class);
        NetworkClient client = ac.getBean(NetworkClient.class);
        ac.close();
    }

    @Configuration
    static class LifeCycleConfig {

        @Bean(initMethod =  "init", destroyMethod = "close")
        public NetworkClient networkClient() {
            NetworkClient networkClient = new NetworkClient();
            networkClient.setUrl("http://hello-spring.dev");
            return networkClient;
        }
    }
}

```

* BeanLifeCycleTest 클래스에서 설정 정보에 `@Bean(initMethod =  "init", destroyMethod = "close")` 으로 수정한다.

### 설정 정보 사용 특징

* 메서드 이름을 자유롭게 줄 수 있다.

* 스프링 빈이 스프링 코드에 의존하지 않는다.

* 외부 라이브러리에도 초기화, 종료 메서드를 적용할 수 있다.

* Tip : `@Bean의 destroyMethod` 속성에는 기본값이 `(inferred)` 추론으로 등록되어 있고 이 추론 기능이 `close`, `shutdown` 이름의 메서드를 자동으로 호출해준다.

  * 추론 기능을 사용하기 싫으면 `destroyMethod=""` 처럼 빈 공백으로 지정하면 된다.

## 애노테이션 @PostConstruct, @PreDestroy

* **결론적으로 세가지 방법중에 `@PostConstruct, @PreDestroy` 애노테이션 방법을 가장 많이 사용한다.** (최신 스프링에서 가장 권장하는 방법이다)

```java
public class NetworkClient {
    @PostConstruct
    public void init() {
        System.out.println("NetworkClient.init");
        connect();
        call("초기화 연결 메시지");
    }

    @PreDestroy
    public void close(){
        System.out.println("NetworkClient.close");
        disConnect();
    }
}
```

```java
public class BeanLifeCycleTest {
    @Configuration
    static class LifeCycleConfig {
  
        @Bean
        public NetworkClient networkClient() {
            NetworkClient networkClient = new NetworkClient();
            networkClient.setUrl("http://hello-spring.dev");
            return networkClient;
          }
    }
}
```

### @PostConstruct, @PreDestroy 애노테이션 특징

* `@PostConstruct` , `@PreDestroy` 이 두 애노테이션을 사용하면 **가장 편리하게 초기화와 종료를 실행**할 수 있다.

* 유일한 단점은 `외부 라이브러리`에는 적용하지 못한다.

* 만약 초기화, 종료를 해야 한다면, `@Bean`의 `initMethod`, `destroyMethod`(빈 등록 초기화, 소멸 메서드 지정 방법)을 사용한다.

## Reference

* [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)
