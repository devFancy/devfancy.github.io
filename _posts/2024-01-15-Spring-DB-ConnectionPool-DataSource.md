---
layout: post
title: " 커넥션 풀과 데이터소스 이해 "
categories: Spring
author: devFancy
---
* content
{:toc}

> 이 글은 [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard) 강의를 듣고 정리한 내용입니다.

## 커넥션 풀 도입 배경

커넥션 풀을 배우기 전에, 먼저 기존 데이터베이스에서 커넥션을 획득하는 과정에 대해 알아보자.

![](/assets/img/spring/Spring-DB-ConnectionPool-DataSource-1.png)

데이터베이스 커넥션을 획득할 때는 다음과 같은 복잡한 과정을 거친다.

1. 애플리케이션 로직은 `DB 드라이버`를 통해 커넥션을 조회한다.
2. DB 드라이버는 DB와 `TCP/IP` 커넥션을 연결한다. 이 과정에서 3 way handshake와 같은 `TCP/IP` 연결을 위한 네트워크 동작이 발생한다.
    * 3 way handshake 에 대한 자세한 내용은 이전에 작성했던 [TCP와 UDP - TCP의 내부동작 원리1: 연결 설정단계](https://devfancy.github.io/Network-Tcp-And-Udp/)를 참고하자
3. DB 드라이버는 `TCP/IP` 커넥션이 연결되면 ID, PW와 같은 부가정보를 DB에 전달한다.
4. DB는 ID, PW를 통해 내부 인증을 완료하고, 내부에 DB 세션을 생성한다.
5. DB는 커넥션 생성이 완료되었다는 응답을 보낸다.
6. DB 드라이버는 커넥션 객체를 생성해서 클라이언트에 반환한다.

이렇게 커넥션을 새로 만드는 것에 대한 과정이 복잡하고 시간도 많이 소모된다.



---

DB는 물론이고, 애플리케이션 서버에서도 `TCP/IP`  **커넥션을 새로 생성하기 위한 리소스를 매번 사용해야 한다.**

이와 같이 데이터베이스 커넥션을 획득하는 과정에서 시간이 많이 소요하기 때문에, 사용자에게 좋지 않는 경험을 줄 수 있다.

그래서 이러한 문제를 해결하기 위해 **커넥션을 미리 생성해두고 사용하는 `커넥션 풀`이라는 방법**이 나오게 되었다.

* `커넥션 풀`이란 이름 그대로 **커넥션을 관리하는 풀**(수영장 풀을 상상하면 된다)이다.

## 커넥션 풀 이해

![](/assets/img/spring/Spring-DB-ConnectionPool-DataSource-2.png)

애플리케이션이 시작하는 시점에 커넥션 풀은 **필요한 만큼 커넥션을 미리 확보해서 풀에 보관**한다.

(기본 값은 보통 10개지만, 서비스의 특서오가 서버 스펙에 따라 다르다)

커넥션 풀에 들어있는 커넥션은 TCP/IP로 DB와 커넥션이 연결되어 있는 상태이기 때문에 언제든지 즉시 SQL을 DB에 전달할 수 있다.

![](/assets/img/spring/Spring-DB-ConnectionPool-DataSource-3.png)

애플리케이션 로직에서는 이제 DB 드라이버를 통해 새로운 커넥션을 획득하는 것이 아니라 **`커넥션 풀`을 통해 이미 생성되어 있는 커넥션을** 객체 참조로 그냥 가져다 쓰면 된다.

커넥션 풀에 커넥션을 요청하면 커넥션 풀은 자신이 가지고 있는 커넥션 중 하나를 반환한다.

커넥션을 모두 사용하고 나면 **커넥션을 종료하는 것이 아니라 다음에 다시 사용할 수 있도록 해당 커넥션을 그대로 커넥션 풀에 반환해야 한다.**

커넥션 풀은 **서버당 최대 커넥션 수를 제한**할 수 있어서 DB에 무한정 연결이 생성되는 것을 막아주어 DB를 보호하는 이점이 있다. (실무에서 항상 **기본**으로 사용한다)

커넥션 풀은 사용도 편리하고 성능도 뛰어난 오픈소스 커넥션 풀이 많지만, 대표적으로 사용하는 오픈소스 커넥션 풀은 `HikariCP`가 있다.

`HikariCP`는 **성능과 사용의 편리함** 측면에서 사용하며, **스프링 부트 2.0 부터는 기본 커넥션 풀이 `HikariCP`를 제공**하고 있다.

## DataSource 이해

커넥션을 얻는 방법은 앞서 학습한 JDBC `DriverManager`를 직접 사용하거나, 커넥션 풀을 사용하는 등 다양한 방법이 존재한다.

![](/assets/img/spring/Spring-DB-ConnectionPool-DataSource-4.png)

하지만 앞서 JDBC로 개발한 애플리케이션처럼 `DriverManager` 를 통해 커넥션 획득하다가 `HikariCP` 같은 커넥 션 풀을 사용하도록 변경하면 **커넥션을 획득하는 애플리케이션 코드도 함께 변경**해야 하는 문제가 생긴다.

의존관계가 `DriverManager` 에서 `HikariCP` 로 변경되기 때문이다.

그래서 이런 문제를 해결하기 위해 `DataSource`가 등장하게 되었다.

![](/assets/img/spring/Spring-DB-ConnectionPool-DataSource-5.png)

`DataSource`는 **커넥션을 획득하는 방법을 추상화**하는 인터페이스로, 자바에서는 `javax.sql.DataSource` 라는 인터페이스를 제공한다.

대부분의 커넥션 풀은 `DataSource` 인터페이스를 이미 구현해두어서, `DataSource` 인터페이스에만 의존하도록 애플리케이션 로직을 작성하면 된다.
커넥션 풀 구현 기술을 변경하고 싶으면 해당 구현체로 갈아끼우면 된다.

예외적으로 `DriverManager` 는 `DataSource` 인터페이스를 사용하지 않는다. 
이 문제를 해결하기 위해 스프링은 `DriverManager` 도 `DataSource`를 통해 사용할 수 있도록 **`DriverManagerDataSource` 라는 `DataSource` 를 구현한 클래스를 제공**한다.

정리하면, 커넥션을 생성하고 가져오는 방식에서는 `DriverManager` 과 여러 가지 오픈소스 커넥션 풀이 있는데 
코드 측면에서는 다를 수 있어도 논리적인, 기능적인 측면에서 보면 커넥션을 생성하고 가져오는 일을 하기 때문에
이 기능을 `DataSource`로 추상화한 것이다.

따라서 코드에서 추상화한 `DataSource` 인터페이스에 의존하도록 작성하고 기술을 교체해야 하는 일이 생기면 구현체만 교체하면 된다.

## DataSource

### DriverManager 와 DriverManagerDataSource

기존에 개발했던 `DriverManager와` 와 `DataSource`의 구현체인 `DriverManagerDataSource`를 통해 커넥션을 획득해보자.

```java
@Slf4j
public class ConnectionTest {
    public static final int DEFAULT_SIZE = 10;

    @Test
    void driverManager() throws SQLException {
        // DriverManager 사용
        // 커넥션을 획득할 때마다 설정 정보를 인자에 넘겨야 한다.
        Connection con1 = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        Connection con2 = DriverManager.getConnection(URL, USERNAME, PASSWORD);

        log.info("connection={}, class={}", con1, con1.getClass());
        log.info("connection={}, class={}", con2, con2.getClass());
    }

    @Test
    void dataSourceDriverManager() throws SQLException {
        // DataSource를 구현한 DriverMangerDataSource 사용 - 항상 새로운 커넥션을 획득
        // 초기 세팅에만 설정값을 넘긴다.
        DataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);// 스프링에서 제공
        useDateSource(dataSource);
    }

    private void useDateSource(DataSource dataSource) throws SQLException {
        Connection con1 = dataSource.getConnection();
        Connection con2 = dataSource.getConnection();
        log.info("connection={}, class={}", con1, con1.getClass());
        log.info("connection={}, class={}", con2, con2.getClass());

    }
}
```

* DriverManager

   * 커넥션을 획득할 때마다 설정 정보(URL, USERNAME, PASSWORD)를 인자에 넘겨야 한다.

* DriverMangerDataSource

   * 내부적으로 DriverManger를 사용하지만, DataSource의 구현체이다.

   * DriverManager에서 사용하는 방식에서 **`설정`과 `사용`을 분리**했다.

   * `설정`은 초기에 한 번만 입력하고, 이후 `사용`하는 곳에서는 `getConnection`만 호출한다.

   * 설정과 사용을 분리함으로써 향후 변경에 더 유연하게 대처할 수 있다. -> 애플리케이션을 개발해보면 보통 `설정`은 **한 곳**에서 사용하지만 `사용`은 **수 많은 곳**에서 하게 된다.

### HikariDataSource

이번에는 `DataSource`의 구현체인 `HikariDataSource`을 통해 커넥션 풀을 사용해서 커넥션을 획득해보자.

```java
@Slf4j
public class ConnectionTest {
    public static final int DEFAULT_SIZE = 10;

    @Test
    void dataSourceConnectionPool() throws SQLException, InterruptedException {
        // 커넥션 풀링: HikariProxyConnection(Proxy) -> JdbcConnection(Target)
        HikariDataSource dataSource = new HikariDataSource(); // 스프링에서 jdbc를 사용하면 자동으로 import 됨
        dataSource.setJdbcUrl(URL);
        dataSource.setUsername(USERNAME);
        dataSource.setPassword(PASSWORD);
        dataSource.setMaximumPoolSize(DEFAULT_SIZE); // 기본 사이즈 10
        dataSource.setPoolName("MyPool");

        useDateSource(dataSource);
        Thread.sleep(1000); // 1초
    }

    private void useDateSource(DataSource dataSource) throws SQLException {
        Connection con1 = dataSource.getConnection();
        Connection con2 = dataSource.getConnection();
        log.info("connection={}, class={}", con1, con1.getClass());
        log.info("connection={}, class={}", con2, con2.getClass());

    }
}
// 커넥션 풀에서 커넥션 획득 2개 - conn0, conn1
// [Test worker] INFO hello.jdbc.connection.ConnectionTest - connection=HikariProxyConnection@1489193907 wrapping conn0: url=jdbc:h2:tcp://localhost/~/test user=SA, class=class com.zaxxer.hikari.pool.HikariProxyConnection
// [Test worker] INFO hello.jdbc.connection.ConnectionTest - connection=HikariProxyConnection@1453606810 wrapping conn1: url=jdbc:h2:tcp://localhost/~/test user=SA, class=class com.zaxxer.hikari.pool.HikariProxyConnection
// 마지막 로그 출력
// 총 10개, 사용중인 커넥션: 2개 / 풀에서 대기 상태인 커넥션: 8개 / 기다리는 커넥션: 0개
// 14:58:55.280 [MyPool connection adder] DEBUG com.zaxxer.hikari.pool.HikariPool - MyPool - After adding stats (total=10, active=2, idle=8, waiting=0)
```

커넥션 풀에서 커넥션을 생성하는 작업은 **애플리케이션 실행 속도에 영향을 주지 않기 위해 별도의 쓰레드에서 작동**한다.
그래서 위와 같이 `Thread.sleep(1000);` 을 통해 대기 시간을 주어야 쓰레드 풀에 커넥션이 생성되는 로그를 확인할 수 있다.

(HikariCP 커넥션 풀에 대한 더 자세한 내용은 다음 공식 사이트를 참고하자 - [HikariCP](https://github.com/brettwooldridge/HikariCP))

## Reference

* [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard)