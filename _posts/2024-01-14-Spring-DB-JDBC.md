---
layout: post
title: " JDBC 라이브러리를 이용하여 CRUD 구현하기 "
categories: Spring
author: devFancy
---

* content
{:toc}

> 이 글은 [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard) 강의를 듣고 정리한 내용입니다.

## JDBC 이해

### JDBC 등장 이유

애플리케이션을 개발할 때 중요한 데이터는 대부분 `데이터베이스`에 보관한다.

![](/assets/img/spring/Spring-JDBC-1.png)

클라이언트가 애플리케이션 서버를 통해 데이터를 저장하거나 조회하면, `애플리케이션 서버`는 다음 과정을 통해 `데이터베이스`를 사용한다.

일반적으로, 애플리케이션 서버와 DB는 아래와 같은 순서로 진행된다.



---

![](/assets/img/spring/Spring-JDBC-2.png)

1. 커넥션 연결: 주로 TCP/IP를 사용해서 커넥션을 연결한다.

2. SQL 전달: 애플리케이션 서버는 DB가 이해할 수 있는 SQL을 연결된 커넥션을 통해 DB에 전달한다.

3. 결과 응답: DB는 전달된 SQL을 수행하고 그 결과를 응답한다. 애플리케이션 서버는 응답 결과를 활용한다.

![](/assets/img/spring/Spring-JDBC-2-2.png)

하지만 **각각의 데이터베이스 마다 사용법(커텍션 연결, SQL 전달, 결과 응답)이 다르다**는 문제점을 가지고 있다. (참고로 관계형 데이터베이스는 수십개가 있다)

여기에는 2가지 큰 문제점이 있다.

1. 데이터베이스를 **다른 종류의 데이터베이스로 변경**하면 애플리케이션 서버에 개발된 데이터베이스 사용 코드도 **함께 변경**해야 한다.

2. 개발자가 **각각의 데이터베이스마다** 커넥션 연결, SQL 전달, 그리고 그 결과를 응답 받는 방법을 **새로 학습**해야 한다.

이러한 문제를 해결하기 위해 **`JDBC`** 라는 자바 표준이 등장하게 되었다.

### JDBC 표준 인터페이스

> JDBC(Java Database Connectivity)는 자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API다.
> JDBC는 데이터베이스에서 자료를 쿼리하거나 업데이트하는 방법을 제공한다. - 위키백과 -

![](/assets/img/spring/Spring-JDBC-3.png)

대표적으로 다음 3가지 기능을 `표준 인터페이스`로 정의해서 제공한다.

- `java.sql.Connection` - 연결
- `java.sql.Statement` - SQL을 담은 내용
- `java.sql.ResultSet` - SQL 요청 응답

이 JDBC 인터페이스를 각각의 DB 벤더(회사)에서 자신 의 DB에 맞도록 구현해서 라이브러리로 제공하는데, 이를 `JDBC 드라이버`라 한다.

예를 들어서 MySQL DB에 접근 할 수 있는 것은 `MySQL JDBC 드라이버`라 하고, Oracle DB에 접근할 수 있는 것은 `Oracle JDBC 드라이버`라 한다.

`MySQL 드라이버`를 사용하면 아래와 같은 그림을 볼 수 있다.

![](/assets/img/spring/Spring-JDBC-4.png)

정리하면 `JDBC`의 등장으로 두 가지 주요 문제가 해결되었다.

1. 데이터베이스를 다른 종류의 데이터베이스로 변경하면 애플리케이션 서버의 데이터베이스 사용 코드도 함께 변경 해야하는 문제
    * 해결 방안: 애플리케이션 로직은 이제 JDBC 표준 인터페이스에만 의존한다. 따라서 데이터베이스를 다른 종류의 데이터베이스로 변경하고 싶으면 JDBC 구현 라이브러리만 변경하면 된다. 따라서 다른 종류의
      데이터베이스로
      변경해도 애플리케이션 서버의 사용 코드를 그대로 유지할 수 있다.

2. 개발자가 각각의 데이터베이스마다 커넥션 연결, SQL 전달, 그리고 그 결과를 응답 받는 방법을 새로 학습해야하는 문제
    * 해결 방안: 개발자는 JDBC 표준 인터페이스 사용법만 학습하면 된다. 한번 배워두면 수십개의 데이터베이스에 모두 동일하게 적용할 수 있다.

(참고로 JPA(Java Persistence API)를 사용하면 이렇게 각각의 데이터베이스마다 다른 SQL를 정의해야 하는 문제도 많은 부분을 해결할 수 있다)

## JDBC와 최신 데이터 접근 기술

`JDBC`는 1997년에 출시될 정도로 오래된 기술이고, 사용하는 방법도 복잡하다.

그래서 최근에는 `JDBC`를 직접 사용하기 보다는 `JDBC`를 편리하게 사용하는 다양한 기술이 존재한다. 대표적으로 `SQL Mapper`와 `ORM` 기술로 나눌 수 있다.

![](/assets/img/spring/Spring-JDBC-5.png)

SQL Mapper

* 장점: JDBC를 편리하게 사용하도록 도와준다.
    * SQL 응답 결과를 객체로 편리하게 변환해준다.
    * JDBC의 반복 코드를 제거해준다.
* 단점: 개발자가 SQL을 직접 작성해야한다.
* 대표 기술: 스프링 JdbcTemplate, MyBatis

![](/assets/img/spring/Spring-JDBC-6.png)

ORM 기술

* `ORM`은 **객체를 관계형 데이터베이스 테이블과 매핑해주는 기술**이다. 이 기술 덕분에 개발자는 반복적인 SQL을 직접 작성하지 않고, ORM 기술이 개발자 대신에 **SQL을 동적으로 만들어 실행**
  해준다.
  추가로 각각 의 데이터베이스마다 다른 SQL을 사용하는 문제도 중간에서 해결해준다.
* 대표 기술: JPA, 하이버네이트, 이클립스링크
* `JPA`는 **자바 진영의 ORM 표준 인터페이스**이고, 이것을 구현한 것으로 하이버네이트와 이클립스 링크 등의 구현 기술이 있다.

여기서 **중요한 점**은 이런 기술들도 내부에서는 모두 JDBC를 사용한다. 따라서 JDBC를 직접 사용하지 않더라도, JDBC가 어떻게 동작하는지 기본 원리는 알아두어야 한다.

그래야 해당 기술들을 더 깊이있게 이해할 수 있고, 무엇보다 문제가 발생했을 때 근본적인 문제를 찾아서 해결할 수 있다.

`JDBC`는 자바 개발자라면 **꼭 알아두어야 하는 필수 기본 기술**이다. (사실 이 말은 듣고, 이번 강의를 통해 확실히 알고 넘어가기로 마음 먹었다)

## H2 데이터베이스 설정

> H2 데이터베이스는 개발이나 테스트 용도로 사용하기 좋은 가볍고 편리한 DB이다. 그리고 SQL을 실행할 수 있는 웹
> 화면을 제공한다.

사전에는 H2 데이터베이스를 위한 [다운로드 및 설치](https://www.h2database.com)를 해줘야 한다.

* H2 데이터베이스는 스프링 부트 버전에 맞춘다. - [H2 다운로드 버전](https://www.h2database.com/html/download-archive.html)

    * 스프링 부트 2.x를 사용하면 **1.4.200 버전**을 다운로드 받으면 된다.

    * 스프링 부트 3.x를 사용하면 **2.1.214 버전 이상** 사용해야 한다.

MAC, 리눅스 사용자 기준으로 아래와 같은 순서로 진행하면 된다.

```shell
cd bin #1. 디렉토리 이동
chmod 755 h2.sh #2. 권한 주기
./h2.sh #3. 실행
```

![](/assets/img/spring/Spring-JDBC-7.png)

그런 다음, 데이터베이스 파일을 생성한다. (참고로, 주소 맨 앞에 `localhost` 가 아니라면, `localhost`로 입력하고 Enter를 입력한다, 나머지 부분은 변경해선 안된다)

* 사용자명은 `sa`를 입력한다.
* JDBC URL 에는 최초로 `jdbc:h2:~/test` 입력하고, **`연결`** 버튼을 직접 눌러야 한다. (`연결 시험`을 클릭하면 오류가 발생한다)
* 연결이 성공되었으면, 이후부터는 `jdbc:h2:tcp://localhost/~/test` 이렇게 접속한다.

H2 데이터베이스가 연결되면, 테스트를 위한 Member 테이블을 생성한다.

H2 데이터베이스 웹 콘솔에 아래와 같은 SQL 문을 입력하고, 실행한다.

```sql
drop table member if exists cascade;
create table member
(
    member_id varchar(10),
    money     integer not null default 0,
    primary key (member_id)
);

insert into member(member_id, money)
values ('memberV1', 10000);
insert into member(member_id, money)
values ('memberV2', 20000);
```

```sql
select *
from member;
```

그런 다음, 쿼리를 실행해서 저장한 데이터가 잘 나오는지 결과를 확인한다.

![](/assets/img/spring/Spring-JDBC-8.png)

## 데이터베이스 연결하기

먼저 H2 데이터베이스 서버를 실행시켜주고, 아래와 같이 데이터베이스에 접속하는데 필요한 기본 정보를 입력한다.

jdbc > connection 패키지

* ConnectionConst
* DBConnectionUtil

> ConnectionConst 추상 클래스

```java
package hello.jdbc.connection;

public abstract class ConnectionConst {
    public static final String URL = "jdbc:h2:tcp://localhost/~/test";
    public static final String USERNAME = "sa";
    public static final String PASSWORD = "";
}
```

그리고 JDBC를 사용해서 실제 데이터베이스에 연결하는 코드를 작성한다.

> DBConnectionUtil 클래스

```java

@Slf4j
public class DBConnectionUtil {

    public static Connection getConnection() {
        try {
            Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            log.info("get connection={}, class={}", connection, connection.getClass());
            return connection;
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }
}
```

데이터베이스에 연결하려면 JDBC가 제공하는 `DriverManager.getConnection(...)`를 사용하면 된다.

이렇게 하면 라이브러리에 있는 데이터베이스 드라이버를 찾아서 해당 드라이버가 제공하는 커넥션을 반환해준다.

여기서는 `H2 데이터베이스 드라이버`가 작동해서 실제 데이터베이스와 커넥션을 맺고 그 결과를 반환해준다.

> DBConnectionUtilTest 클래스(테스트 코드)

```java

@Slf4j
class DBConnectionUtilTest {

    @Test
    void connection() {
        Connection connection = DBConnectionUtil.getConnection();
        assertThat(connection).isNotNull();
    }
}
```

![](/assets/img/spring/Spring-JDBC-9.png)

실행 결과를 보면, `class=class org.h2.jdbc.JdbcConnection` 부분을 확인할 수 있다. 이것이 바로 H2 데이터베이스 드라이버가 제공하는 H2 전용 커넥션이다.
물론 이 커넥션은 JDBC 표준 커넥션 인터페이스인 `java.sql.Connection` 인터페이스를 구현하고 있다.

(만약 오류가 발생하면 H2 데이터베이스가 실행되지 않거나 설정에 오류가 있으므로, H2 데이터베이스 설정 부분을 확인한다)

### JDBC DriverManager 연결 이해

![](/assets/img/spring/Spring-JDBC-10.png)

JDBC는 `java.sql.Connection` 표준 커넥션 인터페이스를 정의한다.

H2 데이터베이스 드라이버는 JDBC Connection 인터페이스를 구현한 `org.h2.jdbc.JdbcConnection` 구현체를 제공한다.

### DriverManager 커넥션 요청 흐름

![](/assets/img/spring/Spring-JDBC-11.png)

JDBC가 제공하는 `DriverManager`는 라이브러리에 등록된 DB 라이브러리를 관리하고, 커넥션을 획득하는 기능을 제공한다.

1. 애플리케이션 로직에서 커넥션이 필요하면 `DriverManager.getConnection()` 을 호출한다.
2. `DriverManager` 는 라이브러리에 등록된 드라이버 목록을 자동으로 인식한다. 이 드라이버들에게 순서대로 다음 정보를 넘겨서 커넥션을 획득할 수 있는지 확인한다.
    * URL: 예) `jdbc:h2:tcp://localhost/~/test`
    * 이름, 비밀번호 등 접속에 필요한 추가 정보
    * 여기서 각각의 드라이버는 URL 정보를 체크해서 본인이 처리할 수 있는 요청인지 확인한다.
3. 이렇게 찾은 커넥션 구현체가 클라이언트에 반환된다.

여기서는 H2 데이터베이스 드라이버만 라이브러리에 등록했기 때문에 H2 드라이버가 제공하는 H2 커넥션을 제공받는다.

## JDBC로 CRUD 구현하기

이제 본격적으로 JDBC를 사용해서 애플리케이션을 개발해보자.

여기서는 JDBC를 사용해서 회원(Member) 데이터를 데이터베이스에 관리하는 기능을 개발해보자.

### JDBC 개발 - 등록

> H2 데이터베이스 설정 마지막에 테이블과 샘플 데이터 만들기를 통해 `member` 테이블을 미리 만들어두어야 한다.

관련 커밋 - [등록](https://github.com/devFancy/Inflearn/commit/455a4345ffc6d03ac15a8d1aba6fa5cbbda003a6)

```sql
drop table member if exists cascade;
create table member
(
    member_id varchar(10),
    money     integer not null default 0,
    primary key (member_id)
);
```

> Member 클래스

```java

@Data
public class Member {
    private String memberId;
    private int money;

    public Member() {
    }

    public Member(String memberId, int money) {
        this.memberId = memberId;
        this.money = money;
    }
}
```

> MemberRepositoryV0 클래스

```java
/**
 * JDBC - DriverManager 사용
 */
@Slf4j
public class MemberRepositoryV0 {
    public Member save(Member member) throws SQLException {
        String sql = "insert into member(member_id, money) values (?, ?)";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, member.getMemberId());
            pstmt.setInt(2, member.getMoney());
            pstmt.executeUpdate();
            return member;
        } catch (SQLException e) {
            log.error("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    private void close(Connection con, Statement stmt, ResultSet rs) {

        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }

        if (stmt != null) {
            try {
                stmt.close(); // Exception
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
        if (con != null) {
            try {
                con.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
    }

    private static Connection getConnection() {
        return DBConnectionUtil.getConnection();
    }
}
```

* 커넥션 획득 - `getConnection()` : 이전에 만들어둔 `DBConnectionUtil` 를 통해서 데이터베이스 커넥션을 획득한다.

* `save()` - SQL 전달

   * `sql` : 데이터베이스에 전달할 SQL을 정의한다. 여기서는 데이터를 등록해야 하므로 `insert sql` 을 준비했다.

* `con.prepareStatement(sql);` : 데이터베이스에 전달할 SQL과 파라미터로 전달할 데이터들을 준비한다.

    * `pstmt.setString(1, member.getMemberId());` : SQL의 첫번째 `?` 에 값을 지정한다. 문자이므 로 `setString` 을 사용한다.

    * `pstmt.setInt(2, member.getMoney());` : SQL의 두번째 `?` 에 값을 지정한다. `Int` 형 숫자이므로 `setInt` 를 지정한다.

    * `pstmt.executeUpdate();` : `Statement`를 통해 준비된 SQL을 커넥션을 통해 실제 데이터베이스에 전달한다. 참고로 `executeUpdate()` 은 `int` 를 반환하는데 영향받은 DB row 수를 반환한다. 여기서는 하나의 row 를 등록했으므로 1을 반환한다.

* `close()` - 리소스 정리

    * 쿼리를 실행하고 나면 리소스를 정리해야 한다. 여기서는 `Connection`, `PreparedStatement`를 사용했으므로, 리소스를 정리할 때는 **항상 역순**으로 정리해준다.

    * 예외가 발생하든, 하지 않든 항상 수행되어야 하므로 `finally` 구문에 주의해서 작성해야 한다.

    * 만약 이 부분을 놓치게 되면 **커넥션이 끊어지지 않고 계속 유지되는 문제가 발생**할 수 있다.

    * 이런 것을 **`리소스 누수`** 라고 하는데, 결과적으로 **커넥션 부족으로 장애가 발생**할 수 있다.

> 참고: `Statement` 는 sql에 직접 넣는 것이고, `PrepareStatement` 는 파라미터에 직접 바인딩해서 sql에 넣는 것이다.
> 
> `PrepareStatement` 는 `Statement` 를 상속받아서 `close()` 메서드를 호출할 때, 파라미터로 넘길 수 있는 것이다.
> 추가적으로 SQL Injection 공격을 예방하려면 `PreparedStatement` 를 통한 파라미터 바인딩 방식을 사용해야 한다.

![](/assets/img/spring/Spring-JDBC-12.png)

이제 테스트 코드를 통해 JDBC로 회원을 데이터베이스에 등록하는 코드를 작성하면 아래와 같다.

> MemberRepositoryV0Test - 회원 등록

```java
@Slf4j
class MemberRepositoryV0Test {

    MemberRepositoryV0 repository = new MemberRepositoryV0();

    @Test
    void crud() throws SQLException {
        //save
        Member member = new Member("memberV100", 10000);
        repository.save(member);
    }
}
```

실행 결과, 데이터베이스에 `select * from member` 쿼리를 실행하면 데이터가 저장된 것을 확인할 수 있다.

참고로, 이 테스트는 2번 실행하면 PK 중복 오류가 발생하기 때문에, 이 경우 PK 값을 바꾸거나 혹은 `delete from member` 쿼리로 데이터를 삭제한 다음에 다시 실행하면 된다.

아래는 PK 중복 오류에 관한 내용이다.

```
org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException: Unique index or
 primary key violation: "PUBLIC.PRIMARY_KEY_8 ON PUBLIC.MEMBER(MEMBER_ID) VALUES
 9"; SQL statement:
```

### JDBC 개발 - 조회

관련 커밋 - [조회](https://github.com/devFancy/Inflearn/commit/64b3b8b8f3cfdf41efe6ab5beb9466abae8b26f5)

> MemberRepositoryV0 클래스 - findById()

```java
/**
 * JDBC - DriverManager 사용
 */
@Slf4j
public class MemberRepositoryV0 {
    public Member save(Member member) throws SQLException {
        String sql = "insert into member(member_id, money) values (?, ?)";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, member.getMemberId());
            pstmt.setInt(2, member.getMoney());
            pstmt.executeUpdate();
            return member;
        } catch (SQLException e) {
            log.error("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    public Member findById(String memberId) throws SQLException {
        String sql = "select * from member where member_id = ?";

        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);

            rs = pstmt.executeQuery();
            if (rs.next()) {
                Member member = new Member();
                member.setMemberId(rs.getString("member_id"));
                member.setMoney(rs.getInt("money"));
                return member;
            } else {
                throw new NoSuchElementException("member not found memberId =" + memberId);
            }

        } catch (SQLException e) {
            log.error("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }
    
    private static Connection getConnection() {
        return DBConnectionUtil.getConnection();
    }
}
```

* `finById()` - 쿼리 실행

  * `sql` : 데이터 조회를 위한 select SQL을 준비한다.

  * `rs = pstmt.executeQuery()` 데이터를 변경할 때는 `executeUpdate()` 를 사용하지만, 데이터를 **조회** 할 때는 **`executeQuery()`** 를 사용한다. `executeQuery()` 는 결과를 `ResultSet` 에 담아서 반환한다.

* ResultSet

    * `ResultSet` 은 다음과 같이 생긴 데이터 구조이다. 보통 select 쿼리의 결과가 순서대로 들어간다.

        * 예를 들어서 `select member_id, money` 라고 지정하면 `member_id` , `money` 라는 이름으로 데이터 가 저장된다.
    
        * 참고로 `select *` 을 사용하면 테이블의 모든 컬럼을 다 지정한다.

    * `ResultSet` 내부에 있는 커서( `cursor` )를 이동해서 다음 데이터를 조회할 수 있다.

    * `rs.next()` : 이것을 호출하면 커서가 다음으로 이동한다. 참고로 최초의 커서는 데이터를 가리키고 있지 않기 때문에  `rs.next()` 를 **최초 한번은 호출해야 데이터를 조회**할 수 있다.

        * `rs.next()` 의 결과가 `true` 면 커서의 이동 결과 데이터가 있다는 뜻이다.
    
        * `rs.next()` 의 결과가 `false` 면 더이상 커서가 가리키는 데이터가 없다는 뜻이다.

![](/assets/img/spring/Spring-JDBC-13.png)

참고로 이 `ResultSet`의 결과 예시는 **회원이 2명 조회되는 경우**이다.

* 1-1 에서 `rs.next()`를 호출할 때 1-2의 결과로 cursor가 다음으로 이동하고, 이 경우 cursor가 가리키는 데이터가 있으므로 `true`를 반환한다.

* 2-1 역시 1-1과 마찬가지로 cursor가 가리키는 데이터가 있으므로 `true`를 반환한다.

* 3-1 에서는 3-2의 결과로 cursor가 가리키는 데이터가 없으므로 `false`를 반환한다.

`findById()` 에서는 회원 하나를 조회하는 것이 목적이다. 그래서 조회 결과가 항상 1건이므로 `if` 절을 사용한 것이다.

> MemberRepositoryV0Test - 회원 조회

```java
@Slf4j
class MemberRepositoryV0Test {

    MemberRepositoryV0 repository = new MemberRepositoryV0();

    @Test
    void crud() throws SQLException {
        //save
        Member member = new Member("memberV100", 10000);
        repository.save(member);

        //findById
        Member findMember = repository.findById(member.getMemberId());
        log.info("findMember={}", findMember);
        assertThat(findMember).isEqualTo(member);
    }
}
```

실행 결과, member 객체의 참조 값이 아니라 **실제 데이터가 보이는 이유는 lombok의 `@Data` 가 `toString()`을 적절히 오버라이딩해서 보여줬기 때문**이다.

![](/assets/img/spring/Spring-JDBC-14.png)

* `isEqualTo()` : `findMember.equals(member)` 를 비교한다. 

    결과가 참인 이유는 롬복의 `@Data` 는 해당 객체의 모든 필드를 사용하도록 `equals()` 를 오버라이딩 하기 때문이다.

### JDBC 개발 - 수정, 삭제

관련 커밋 - [수정, 삭제](https://github.com/devFancy/Inflearn/commit/49c29c23bb2759f3e1f145090e57bcfa4de0850a)

수정과 삭제는 등록과 비슷하다. 따라서 데이터를 변경하는 쿼리는 `executeUpdate()` 를 작성하면 된다. 

> MemberRepositoryV0 클래스 - update(), delete()

```java
package hello.jdbc.repository;

import hello.jdbc.connection.DBConnectionUtil;
import hello.jdbc.domain.Member;
import lombok.extern.slf4j.Slf4j;

import java.sql.*;
import java.util.NoSuchElementException;

/**
 * JDBC - DriverManager 사용
 */
@Slf4j
public class MemberRepositoryV0 {
    public void update(String memberId, int money) throws SQLException {
        String sql = "update member set money=? where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, money);
            pstmt.setString(2, memberId);
            int resultSize = pstmt.executeUpdate();
            log.info("resultSize={}", resultSize);
        } catch (SQLException e) {
            log.info("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    public void delete(String memberId) throws SQLException {
        String sql = "delete from member where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            log.info("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    private void close(Connection con, Statement stmt, ResultSet rs) {

        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }

        if (stmt != null) {
            try {
                stmt.close(); // Exception
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
        if (con != null) {
            try {
                con.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
    }

    private static Connection getConnection() {
        return DBConnectionUtil.getConnection();
    }
}
```

* `executeUpdate()` 는 쿼리를 실행하고 영향받은 **row 수**를 반환한다. 여기서 하나의 데이터만 변경하기 때문에 결과로 1이 반환된다.

    만약 회원이 100명이고, 모든 회원의 데이터를 한 번에 수정하는 update sql을 실행하면 결과는 100이 되낟.

> MemberRepositoryV0Test - CRUD(회원 수정, 삭제 포함)

```java
@Slf4j
class MemberRepositoryV0Test {

    MemberRepositoryV0 repository = new MemberRepositoryV0();

    @Test
    void crud() throws SQLException {
        //save
        Member member = new Member("memberV100", 10000);
        repository.save(member);

        //findById
        Member findMember = repository.findById(member.getMemberId());
        log.info("findMember={}", findMember);
        assertThat(findMember).isEqualTo(member);

        //update: money: 10000 -> 20000
        repository.update(member.getMemberId(), 20000);
        Member updateMember = repository.findById(member.getMemberId());
        assertThat(updateMember.getMoney()).isEqualTo(20000);

        //delete
        repository.delete(member.getMemberId());
        Assertions.assertThatThrownBy(() -> repository.findById(member.getMemberId()))
                .isInstanceOf(NoSuchElementException.class);
    }
}
```

회원을 삭제한 다음, `findById()`를 통해서 조회한다. 회원이 없기 때문에 `NoSuchElementException` 이 발생한 것이다.

(참고로 `assertThatThrownBy` 는 해당 예외가 발생해야 검증이 성공한다)

사실 마지막에 회원을 삭제하기 때문에 테스트가 정상 수행하지만, **테스트 중간에 오류가 발생해서 삭제 로직을 수행할 수 없다면** 테스트를 반복해서 실행할 수 없다.

트랜잭션을 활용해서 이 문제를 해결할 수 있지만, 자세한 내용은 다음 강의(트랜잭션)에서 나올 예정이다.

### 최종

아래 코드는 이제까지 JDBC 라이브러리를 이용하여 CRUD 개발을 작업한 결과이다.

> MemberRepositoryV0(등록, 조회, 수정, 삭제)

```java
package hello.jdbc.repository;

import hello.jdbc.connection.DBConnectionUtil;
import hello.jdbc.domain.Member;
import lombok.extern.slf4j.Slf4j;

import java.sql.*;
import java.util.NoSuchElementException;

/**
 * JDBC - DriverManager 사용
 */
@Slf4j
public class MemberRepositoryV0 {
    public Member save(Member member) throws SQLException {
        String sql = "insert into member(member_id, money) values (?, ?)";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, member.getMemberId());
            pstmt.setInt(2, member.getMoney());
            pstmt.executeUpdate();
            return member;
        } catch (SQLException e) {
            log.error("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    public Member findById(String memberId) throws SQLException {
        String sql = "select * from member where member_id = ?";

        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);

            rs = pstmt.executeQuery();
            if (rs.next()) {
                Member member = new Member();
                member.setMemberId(rs.getString("member_id"));
                member.setMoney(rs.getInt("money"));
                return member;
            } else {
                throw new NoSuchElementException("member not found memberId =" + memberId);
            }

        } catch (SQLException e) {
            log.error("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    public void update(String memberId, int money) throws SQLException {
        String sql = "update member set money=? where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, money);
            pstmt.setString(2, memberId);
            int resultSize = pstmt.executeUpdate();
            log.info("resultSize={}", resultSize);
        } catch (SQLException e) {
            log.info("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    public void delete(String memberId) throws SQLException {
        String sql = "delete from member where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            log.info("db error", e);
            throw e;
        } finally {
            close(con, pstmt, null);
        }
    }

    private void close(Connection con, Statement stmt, ResultSet rs) {

        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }

        if (stmt != null) {
            try {
                stmt.close(); // Exception
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
        if (con != null) {
            try {
                con.close();
            } catch (SQLException e) {
                log.info("error", e);
            }
        }
    }

    private static Connection getConnection() {
        return DBConnectionUtil.getConnection();
    }
}
```

## Review

JDBC에 대한 개념을 처음부터 학습하고 JDBC 라이브러리를 활용하여 CRUD(등록, 조회, 수정, 삭제) 작업을 직접 구현해보는 경험을 쌓아보았다.

주로 기초적인 부분에 중점을 두어 다루었기 때문에, 더 깊은 내용은 다른 참고서를 참조해야 할 것 같다. 그러나 이 강의를 통해 JDBC의 핵심 개념과 동작 원리를 이해할 수 있었다.

이전에도 JDBC를 이용한 CRUD 개발을 시도해봤지만, 제대로 된 복습 없이 넘어간 부분이 있었다. 따라서 이 강의를 통해 그 과정을 제대로 되짚어 볼 수 있게 되었다.

## Reference

* [스프링 DB 1편 - 데이터 접근 핵심 원리](https://www.inflearn.com/course/스프링-db-1/dashboard)