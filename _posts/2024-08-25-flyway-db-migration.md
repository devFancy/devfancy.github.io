---
layout: post
title: " Flyway와 Hibernate로 변화하는 스키마의 효율적 관리 및 마이그레이션 전략을 적용하기. "
categories: DB
author: devFancy
---
* content
{:toc}

## 문제 상황

- 기존 yml 파일에 `ddl-audo` 를 `update`로 설정했기 때문에, 엔티티에 새로운 필드가 추가될 때 마다, 변경 사항을 자동으로 shema.sql에 적용되고 있습니다.

- 하지만 이 방식에는 치명적인 단점이 있습니다. **스키마 변경 후 기존 데이터와 새 스키마 간의 불일치가 발생하는 것**입니다. 새 필드가 추가되면 기존 데이터는 해당 필드에 값이 없기 때문에 NULL 값이 들어가게 됩니다.

- 뿐만 아니라, 새로운 스키마에 맞지 않는 외래 키나 제약 조건이 발생할 수 있습니다. 이로 인해 **참조 무결성이 깨지고, 운영 환경에서는 심각한 데이터 손실 및 오류를 초래**할 수 있습니다.

## 해결 방안 - 데이터베이스 마이그레이션 전략(Flyway)

- 이 문제를 해결하기 위해서는 데이터베이스 마이그레이션 전략이 필요합니다. 이를 위해 몇 가지 방법을 고려할 수 있습니다.

### 1. 마이그레이션 도구 사용

- 데이터베이스 마이그레이션 도구를 사용하여 버전 관리를 할 수 있습니다. 대표적인 도구로는 `Flyway`, `Liquibase` 등이 있습니다. 이 도구들은 스키마 변경 사항을 버전 관리하고, 각 단계에서 마이그레이션 스크립트를 실행할 수 있게 해줍니다.

### 2. 점진적 마이그레이션

- 기존 테이블에 새로운 컬럼을 추가하거나 수정할 때에는 ALTER TABLE 명령어를 사용합니다. 또한, 새로운 필드에 초기값을 설정해야 하는 경우 데이터 마이그레이션 스크립트를 작성하여 기존 데이터를 새로운 스키마에 맞게 변환할 수 있습니다.

```sql
ALTER TABLE member ADD COLUMN new_column_name VARCHAR(255) DEFAULT 'default_value';
UPDATE member SET new_column_name = 'some_value' WHERE old_column_name = 'specific_condition';
```

- 이와 같은 **수동 작업은 번거롭고, 실수 가능성이 크기 때문에 형상 관리도 어려워집니다.** 따라서 `Flyway`와 같은 마이그레이션 도구를 활용하여 이런 문제를 해결할 수 있습니다.

### Flyway vs Liquibase 개념

#### Flyway

- `Flyway` 는 간단하고 직관적인 SQL 기반의 데이터베이스 마이그레이션 도구로, **SQL 스크립트 파일을 사용해** 데이터베이스 스키마의 버전을 관리합니다. 이를 통해 개발자는 데이터베이스 스키마의 변경 사항을 체계적으로 추적할 수 있으며, 마이그레이션 과정에서 발생하는 문제를 최소화할 수 있습니다.

- `Flyway`는 각 마이그레이션을 순차적으로 적용하며, 필요할 경우 이전 상태로 **롤백**할 수 있어 변경 관리가 용이합니다. 또한, 모든 마이그레이션 기록은 **히스토리 테이블**에 저장되어 데이터베이스의 현재 상태와 이전에 적용된 모든 마이그레이션 내역을 명확하게 파악할 수 있습니다.

#### Liquibase

`Liquibase`는 XML, YAML, JSON, 또는 SQL과 같은 다양한 포맷을 지원하는 유연한 마이그레이션 도구입니다. SQL뿐만 아니라 높은 수준의 추상화된 방식으로 마이그레이션을 작성할 수 있으며, 이를 통해 데이터베이스에 종속되지 않는 방식으로 스키마를 관리할 수 있습니다. Liquibase는 커맨드 라인, Maven, Gradle, Spring Boot 등 다양한 도구와의 통합을 쉽게 지원합니다.

### Flyway와 Liquibase의 장단점 비교

#### Flyway

**장점:**

1. **단순함**: SQL 파일 기반의 마이그레이션으로 매우 간단하고 직관적입니다. 따로 학습이 필요하지 않으며, 바로 적용할 수 있습니다.
2. **경량**: 최소한의 설정과 러닝 커브로 빠르게 시작할 수 있어 작은 프로젝트나 단일 개발자에게 적합합니다.
3. **강력한 SQL 기반 마이그레이션**: SQL 명령어를 직접 작성할 수 있어 세밀한 데이터베이스 제어가 가능합니다.
4. **도커 친화적**: Flyway는 도커 이미지가 제공되며, 도커 컨테이너에서 쉽게 실행할 수 있어 현재와 같은 도커 기반 개발 환경에 적합합니다.

**단점:**

1. **SQL 종속적**: 모든 마이그레이션을 SQL로 작성해야 하므로 특정 데이터베이스에 종속적인 코드가 작성될 수 있습니다.
2. **복잡한 스키마 관리 제한**: 복잡한 마이그레이션이나 자동화된 스키마 변경 관리가 필요한 경우 Liquibase에 비해 유연성이 떨어질 수 있습니다.

#### Liquibase

**장점:**

1. **포맷 유연성**: XML, YAML, JSON 등 다양한 포맷을 지원하므로 데이터베이스에 종속되지 않고 더 추상화된 방식으로 마이그레이션을 작성할 수 있습니다.
2. **자동화된 스키마 관리**: 더 복잡한 스키마 변경이나 데이터베이스에 관계없이 일관된 마이그레이션을 쉽게 관리할 수 있습니다.
3. **강력한 도구 통합**: Maven, Gradle, Spring Boot 등 다양한 빌드 도구 및 프레임워크와의 통합이 매우 강력합니다.
4. **리버스 엔지니어링**: Liquibase는 기존 데이터베이스 스키마에서 변경 사항을 자동으로 추출하는 기능도 제공하여 복잡한 스키마 작업을 자동화할 수 있습니다.

**단점:**

1. **러닝 커브**: 다양한 포맷을 지원하고 더 복잡한 기능들을 제공하는 만큼 Flyway에 비해 학습 곡선이 가파릅니다.
2. **설정 복잡성**: 더 많은 기능과 포맷을 지원하기 때문에 설정과 사용법이 Flyway보다 복잡할 수 있습니다.
3. **도커 환경 설정**: 도커 이미지 사용이 가능하지만, Flyway에 비해 설정이 더 복잡할 수 있습니다.

### Flyway로 결정

![](/assets/img/db/flyway.png)

결론적으로 저는 `Flyway` 도구를 사용하기로 했습니다. 프로젝트 상황에 따라 다르지만, 서비스 규모와 백엔드 인원이 적은 소규모 프로젝트에서는 `Flyway` 가 더 적합하다고 판단했습니다. 판단한 이유는 아래와 같습니다.

- **단순하고 직관적**: SQL 파일 기반으로 동작해 학습 곡선이 낮고 빠르게 도입할 수 있습니다.

- **경량성**: Liquibase에 비해 Flyway는 설정이 간단하고 작동 방식이 단순하여 소규모 프로젝트에서 관리 부담이 적습니다.

- **확장 가능성**: 추후 더 많은 테이블이 추가되더라도 Flyway로 충분히 관리가 가능하고, 이후 더 많은 테이블이 추가되어도 문제없이 확장할 수 있습니다. 향후 필요시 Liquibase로 전환하는 것도 고려할 수 있습니다.

## Flyway 적용 방법

### 환경 설정

- Spring Boot 2.7.1
- Spring Data JPA 2.7.1 (Hibernate)
- MySQL 8.0.32
- Flyway 8.5.13

### JPA 엔티티 예시

예를 들어 member 테이블에 대한 JPA 엔티티는 아래와 같이 구성됩니다.

```java
@Table(name = "member")
@Entity
public class Member extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

}
```

---

**Spring Boot는 기본적으로 Flyway 같은 고수준의 데이터베이스 마이그레이션 도구를 지원합니다.** 이러한 도구들은 데이터베이스 스키마를 효과적으로 관리하고 자동으로 초기화할 수 있게 도와줍니다.
([참고](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/howto-database-initialization.html#howto-use-a-higher-level-database-migration-tool))

### MySQL 컨테이너 띄우기

저는 현재 서비스 환경에서 Docker를 사용하고 있지만, 반드시 Docker를 사용할 필요는 없습니다. Docker를 통해 MySQL 컨테이너를 띄우려면 아래와 같은 명령어를 사용할 수 있습니다.

```shell
docker run --name test -e MYSQL_ROOT_PASSWORD=1234 -d mysql:8.0.32
```

위 명령어로 MySQL 8.0.32 버전을 실행하면 컨테이너가 생성되고, 다음과 같은 상태를 확인할 수 있습니다.

- 명령어: docker ps

```shell
CONTAINER ID   IMAGE         COMMAND                  CREATED       STATUS       PORTS                   NAMES
57c250407728   mysql:8.0.32  "docker-entrypoint.s…"   5 weeks ago   Up 5 weeks   0.0.0.0:3306->3306/tcp  test
```

### 의존성 추가

Flyway를 프로젝트에 적용하기 위해 `build.gradle` 파일에 Flyway와 MySQL 의존성을 추가합니다.

```gradle
dependencies {
    // flyway
	implementation 'org.flywaydb:flyway-core'
	implementation 'org.flywaydb:flyway-mysql' // MySQL 8.X 버전이거나, MariaDB를 사용하는 경우
}
```

### DataSource, JPA, Flyway 설정

Flyway를 제대로 사용하려면 Spring Boot의 `application-{}.yml` 파일에 다음과 같이 설정을 추가해야 합니다.

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://{Private IP}:3306/test
    username: root
    password: 1234

  jpa:
    # ...
    hibernate:
      ddl-auto: validate # Hibernate가 스키마 검증만 수행
    defer-datasource-initialization: false # Flyway 마이그레이션 후 JPA 초기화

  flyway:
    enabled: true # Flyway 활성화
    baseline-on-migrate: true # 기존 스키마가 있을 때 기준을 설정
    locations: classpath:db/migration # 마이그레이션 파일 경로
```

기존 데이터베이스에 Flyway를 도입하는 경우 `baseline-on-migrate: true` 옵션이 중요합니다. 이 옵션은 Flyway가 마이그레이션 기록을 관리하는 테이블(`flyway_schema_history`)을 처음으로 생성할 때 사용됩니다.

저의 경우, 프로젝트를 진행하는 중간에 `flyway`를 도입하기 때문에 해당 옵션을 **true**로 설정했습니다.

### V1. 처음으로 마이그레이션 스크립트 작성

마이그레이션 스크립트는 resources/db/migration 디렉토리에 저장되며, 파일명은 `V1__init.sql`처럼 버전과 설명을 포함합니다. 첫 번째 마이그레이션 파일을 다음과 같이 작성합니다.

파일 경로는 `resources/db/migration` 이며 파일명은 `V1__init.sql` 로 생성해주세요.

```sql
-- member 테이블 생성
CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
    );
```

Flyway는 스크립트를 순차적으로 실행하므로, 마이그레이션 파일명은 버전을 포함해야 하며, 파일 이름에서 **언더스코어(\_)를 두 개 사용하는 규칙**을 지켜야 합니다.

### 결과

애플리케이션을 실행하면 `Flyway`가 정상적으로 마이그레이션 스크립트를 실행하고, 스키마 변경이 적용됩니다.

![](/assets/img/db/flyway-db-migration-1.png)

> 로그에서 Flyway의 실행 상태를 확인할 수 있습니다.

```bash
INFO org.flywaydb.core.internal.command.DbMigrate - Current version of schema test: 1
INFO org.flywaydb.core.internal.command.DbMigrate - Schema test is up to date. No migration necessary.
```

### 마이그레이션 스크립트 명명 규칙

![](/assets/img/db/flyway-db-migration-script-name.png)

Flyway의 마이그레이션 스크립트는 버전 순서대로 실행됩니다. 숫자가 작은 파일부터 순서대로 실행되며, 숫자가 동일한 경우 파일명이 알파벳순으로 실행됩니다. 버전 관리가 중요하므로 명명 규칙을 지키는 것이 중요합니다.

버전은 정수로 처리되므로 V3.10과 V3.2 중 V3.2가 먼저 실행될 수 있음을 주의해야 합니다.

### 주의사항

**Flyway를 사용할 때는 Spring Boot의 `schema.sql`과 `data.sql`을 사용해 데이터베이스를 초기화하지 않아야 합니다.** Flyway가 스키마를 관리하므로, 수동으로 스키마를 정의하는 것은 오류를 일으킬 수 있습니다.

또한, **새로운 엔티티가 추가될 때마다 마이그레이션 스크립트를 작성하는 습관을 들이는 것이 중요**합니다. 일반적으로 프로덕션 환경에서는 `ddl-auto`를 `validate`로 설정하여 JPA가 자동으로 스키마를 수정하지 못하도록 합니다.
([참고](https://docs.spring.io/spring-boot/how-to/data-initialization.html#howto.data-initialization.using-basic-sql-scripts))

## 트러블 슈팅

### 1. Flyway 스키마 히스토리 테이블이 없을 때

기존 스키마에 Flyway를 도입할 때 flyway_schema_history 테이블이 없으면 오류가 발생할 수 있습니다.

> 에러 내용

```bash
Error creating bean with name 'flywayInitializer': Invocation of init method failed; nested exception is org.flywaydb.core.api.FlywayException: Found non-empty schema(s) test but no schema history table.
```

이 에러는 Flyway가 데이터베이스에 접속했을 때, 이미 존재하는 **비어 있지 않은 스키마**를 발견했지만, **Flyway의 스키마 히스토리 테이블(`flyway_schema_history`)이 없어서 발생한 문제**입니다. Flyway는 마이그레이션 이력을 추적하기 위해 이 히스토리 테이블을 사용합니다. 따라서 이미 데이터가 있는 기존 데이터베이스에 Flyway를 처음 적용하려고 할 때 이러한 문제가 발생할 수 있습니다.

> 해결방안

기존 데이터베이스에 Flyway를 적용할 때, Flyway가 기존의 데이터베이스 스키마를 무시하고 히스토리 테이블을 생성하도록 해야 합니다. 이 작업을 위해 Flyway의 `baselineOnMigrate: true` 설정을 사용하면 됩니다.

이 설정을 추가하면, Flyway는 기존에 비어 있지 않은 데이터베이스에서 첫 마이그레이션을 실행할 때 히스토리 테이블을 생성하고 이를 기준으로 마이그레이션을 진행합니다.

> application.{dev/local}.yml에 추가

```yaml
spring:
  flyway:
    enabled: true
    baselineOnMigrate: true # 이 옵션은 기존 데이터베이스가 있고, 그 위에 처음으로 Flyway를 적용할 때 사용됨
    locations: classpath:db/migration
```

### 2. 엔티티 필드 추가 시 발생하는 문제

새로운 필드를 엔티티에 추가했지만, 이를 반영한 마이그레이션 스크립트를 작성하지 않으면 JPA에서 에러가 발생할 수 있습니다.

> Member 엔티티 클래스 - cellphone 컬럼 추가

```java
@Table(name = "member")
@Entity
public class Member extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "cellphone")
    private String cellphone;  // 추가된 필드
}
```

에러 내용은 아래와 같습니다.

```bash
Schema-validation: missing column [cellphone] in table [member]
```

이 문제를 해결하기 위해 새로운 마이그레이션 스크립트를 생성해야 합니다. 예를 들어 `V2__member_add_cellphone.sql` 파일을 생성하고, 다음과 같이 컬럼을 추가합니다.

예를 들어, `V2__member_add_cellphone.sql` 파일을 생성하고, 다음과 같이 컬럼을 추가합니다.

```sql
ALTER TABLE member ADD COLUMN cellphone VARCHAR(255);
```

이 스크립트는 기존 테이블에 새로운 cellphone 컬럼을 추가합니다. 파일을 적용하고 애플리케이션을 다시 실행하면, 스키마 버전이 업데이트됩니다.

> 마이그레이션 적용 로그 예시

해당 파일을 적용한 뒤, 애플리케이션을 다시 실행하면 아래와 같이 Version이 1 에서 2로 바뀐 것을 아래 로그를 통해 확인할 수 있습니다.

```bash
Migrating schema `{데이터베이스 내의 스키마 이름}` to version "2 - member add cellphone"
```

#### flyway schema history

![](/assets/img/db/flyway-db-migration-2.png)

위와 같이 데이터베이스를 확인해보면, 새로운 테이블이 하나 생성된 것을 확인할 수 있습니다. `flyway_schema_history` 라는 테이블을 통해 Flyway는 마이그레이션에 대한 버전 관리를 합니다.

#### 주의 사항: 기존 마이그레이션 파일 수정 시 발생하는 문제

이미 적용된 마이그레이션 파일을 수정하는 것은 매우 위험할 수 있습니다. Flyway는 **각 마이그레이션 파일의 체크섬(무결성)을 관리하므로, 파일을 수정하면 아래와 같은 오류가 발생**할 수 있습니다.

> 예시: V1\_\_init.sql 파일에 cellphone 컬럼을 추가하려고 하면

```sql
-- member 테이블 생성
CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    cellphone VARCHAR(255) NOT NULL, // // 새로운 필드 추가
    created_date_time DATETIME(6) NOT NULL,
    updated_date_time DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
    );
```

에러 메시지는 아래와 같습니다.

```bash
ERROR org.springframework.boot.SpringApplication - Application run failed
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Invocation of init method failed; nested exception is org.flywaydb.core.api.exception.FlywayValidateException: Validate failed: Migrations have failed validation
Migration checksum mismatch for migration version 1
-> Applied to database : 1825070444
-> Resolved locally    : 702378192
Either revert the changes to the migration, or run repair to update the schema history.
Need more flexibility with validation rules? Learn more: https://rd.gt/3AbJUZE
```

이 오류는 Flyway가 이미 적용된 마이그레이션 파일을 다시 체크했을 때, 원본 파일과 변경된 파일의 체크섬이 달라지기 때문에 발생합니다.

따라서, 스키마에 대한 모든 변경은 **반드시 새로운 버전의 마이그레이션 스크립트를 추가하는 방식**으로 처리해야 합니다. 이미 적용된 마이그레이션 파일을 수정하지 않고, 새로운 파일을 생성하여 변경 사항을 적용하는 것이 올바른 방법입니다.

## 참고자료

- [토스ㅣSLASH 22 - 토스뱅크의 완전히 새로운 대출 시스템](https://www.youtube.com/watch?v=SLamxuykpnw) 4분 40초 ~ 11분 55초

- [Spring Boot Flyway DB Migration Integration Example](https://www.code4copy.com/java/spring-boot-flyway-db-migration-integration-example/)

- [Flyway 공식 문서](https://www.techgeeknext.com/spring-boot/spring-boot-flyway-example)

- [Flyway Redgate 문서](https://documentation.red-gate.com/fd/)

- [Simplifying Database Migrations in Spring Boot with Flyway: A Comprehensive Guide](https://medium.com/@bereketberhe27/simplifying-database-migrations-in-spring-boot-with-flyway-a-comprehensive-guide-c778b5dbb922)

- [달록의 데이터베이스 마이그레이션을 위한 Flyway 적용기](https://hudi.blog/dallog-flyway/)
