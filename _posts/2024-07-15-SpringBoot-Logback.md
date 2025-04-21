---
layout: post
title:  " Spring Boot에서 로그를 관리하는 방법 - Logback 구조와 설정 정리 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

## Prologue

* 실무에서 자주 사용하는 로깅에 대해 간단히 정리하고자 이 글을 작성하게 되었다.

* 현업에서 로깅을 적용하는 이유와 그 개념에 대해 한 번 정리해보려고 한다.


---

## 로깅을 하는 이유

로깅은 시스템이 동작할 때 시스템의 상태 및 동작 정보를 시간 순으로 기록하는 것을 의미한다.

이를 통해 개발자는 다음과 같은 장점을 얻을 수 있다.

* 개발 중 혹은 운영 중 발생할 수 있는 예상치 못한 문제를 진단할 수 있다.

* 다양한 정보를 수집하고 기능 개선이나 문제 추적에 활용할 수 있다.

* 사용자 로그는 유의미한 분석 데이터로도 확장될 수 있다.

하지만 로그를 무분별하게 남기면

* 과도한 로그 데이터로 저장 공간이 낭비되거나

* 중요한 로그를 찾기 어려워지는 문제가 발생할 수 있다.

따라서 로그를 **적절한 레벨로 필터링하고, 목적에 맞는 형식으로 기록하는 전략**이 필요하다.

## Logback 이란

Slf4j의 구현체로, Spring Boot 환경이라면 별도 의존성 추가 없이 기본 내장되어 있다.

Logback은 Log4j에 비해 다음과 같은 장점을 가진다.

* 로그 설정 변경 시 서버 재시작 없이 자동으로 리로딩된다.

* 필터링 정책과 레벨 제어가 유연하다.

* 성능 또한 안정적으로 검증되었다.

## 로그 레벨

Logback은 총 5가지 로그 레벨을 지원한다.
* `Error` : 시스템에 심각한 장애나 예외가 발생했을 때

* `Warn` : 유효성 실패나 경고성 메시지 등 예상 가능한 이슈

* `Info` : 주로 **운영 환경**에서 사용되는 레벨로, 비즈니스 흐름 상의 주요 이벤트 (예: 주문 완료, 로그인 성공 등)

* `Debug` : 개발 중 내부 상태나 SQL 등 디버깅용

* `Trace` : 가장 상세한 로깅, 메서드 단위 호출까지 추적할 때

로그 레벨의 우선순위는 다음과 같다.

* ERROR > WARN > INFO > DEBUG > TRACE

* 만약 로그 레벨을 `INFO`로 설정했다면, INFO, WARN, ERROR 수준의 로그만 출력되며 DEBUG, TRACE 로그는 무시된다.

## Logback 구조 살펴보기

Logback은 기본적으로 세 가지 주요 구성 요소로 이루어져 있다.

### Logger

* 로그를 기록하는 핵심 객체

* 보통 패키지명 또는 클래스명을 기반으로 정의된다.

*  Logger는 계층 구조를 가지며, 최상위에는 루트 로거(`ROOT`)가 존재한다.

![](/assets/img/spring/spring-logback-structure-1.png)

### Appender

* 로그를 어떤 대상에 출력할지를 결정한다. (예: 콘솔, 파일, DB, 네트워크 등)

* 하나의 Logger는 여러 Appender를 가질 수 있다.

![](/assets/img/spring/spring-logback-structure-2.png)

### Layout

* 로그 메시지를 어떤 형식으로 출력할지 정의한다.

* 자바의 `String.format()`과 유사하게 로그 포맷을 커스터마이징할 수 있다.

![](/assets/img/spring/spring-logback-structure-3.png)


## Logback 설정 방법

Spring Boot에서는 Logback이 기본 설정되어 있어 별도 설정 없이도 사용할 수 있다.  

보다 세부적인 설정이 필요한 경우에는 `application.yml` 또는 `logback-spring.xml` 파일을 통해 로그 형식, 출력 대상, 로그 레벨 등을 조정할 수 있다.

* `application.yml`은 단순한 설정에는 적합하지만, 복잡한 구성에는 한계가 있다.

* `logback-spring.xml`은 구조화된 설정이 가능하며, `<springProfile>`을 사용한 프로파일별 설정도 유연하게 지원한다.

Spring Boot에서는 반드시 `logback-spring.xml` 또는 `logback-xxx-spring.xml` 형식의 파일명을 사용해야  
`<springProfile>`이나 `${spring.profiles.active}` 같은 Spring Boot 전용 기능이 정상적으로 동작한다.

해당 파일은 `resources` 디렉터리에 위치시키면 된다.

> 📁 파일 구조 예시

```markdown
src/
└── main/
    └── resources/
        └── logback-spring.xml
```

### logback-spring.xml 구성 예시

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!-- Spring Boot의 기본 로깅 설정 포함 (색상, 기본 변수 등 사용 가능) -->
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- 콘솔 로그 포맷 -->
    <property name="CONSOLE_LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %clr(%5level) %cyan(%logger) - %msg%n"/>
    <!-- 파일 로그 포맷 -->
    <property name="FILE_LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %5level %logger - %msg%n"/>

    <!-- 콘솔 로그 Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>
		
	<!-- 파일 로그 Appender --> 
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <encoder>
            <pattern>${FILE_LOG_PATTERN}</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>./logs/%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <!-- 로거 설정 -->
    <logger name="org.springframework" level="WARN"/>
    <logger name="com.example" level="INFO"/>
    
    <!-- 루트 로거 설정 -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

</configuration>
```

파일 로그는 시스템 운영에 있어 핵심적인 정보 기록 수단이다.

특히 운영 환경에서는 **운영 환경에서는 로그 파일이 무한히 누적되는 것을 방지**하기 위해, **시간 및 크기 기준의 롤링 전략을 적용**하는 것이 중요하다.

> 주요 구성 요소

* `RollingPolicy`: 로그 파일을 일정 기준으로 분할해 가독성과 유지 관리성을 확보하는 전략

* `SizeAndTimeBasedRollingPolicy`: 시간(%d)과 크기(%i)를 기준으로 로그 파일을 순차적으로 분할 및 보관

  * `fileNamePattern`: 로그 파일 이름 형식. 날짜별(`%d`)로 생성되며, 크기 초과 시 인덱스(`%i`)를 붙여 분할 (e.g. 2024-07-15.0.log) (운영 환경에서는 **절대 경로**를 권장한다.)

  * `maxFileSize`: 단일 로그 파일의 최대 크기 (초과 시 새로운 파일 생성)

  * `maxHistory`: 로그 파일의 최대 보관 기간 (지정 일수 초과 시 자동 삭제)

예를 들어 `./logs/2024-07-15.0.log`, `./logs/2024-07-15.1.log` 와 같은 형태로 저장되며,

**100MB** 단위로 분할되고, **30일간** 보관된 후 자동으로 삭제된다.

이러한 설정을 통해 효율적인 로그 관리로 시스템 안정성과 운영 편의성을 함께 확보할 수 있다.

## 마무리

이와 같은 방식으로 `logback-spring.xml` 한 개의 파일만으로도
환경(profile)에 따라 유연한 설정이 가능하고, 콘솔 및 파일 로그를 분리해 효율적으로 관리할 수 있다.

특히 `RollingPolicy`를 적용하면 로그가 일정 크기 이상 쌓이는 것을 방지하면서, 가독성과 유지 관리 측면에서도 유리하다.

로그는 단순 기록이 아니라 시스템 운영과 문제 해결의 핵심 도구이기 때문에, 상황에 맞는 구조와 설정을 잘 갖추는 것이 중요하다.

## References

* [Logback 으로 쉽고 편리하게 로그 관리를 해볼까요? ⚙️](https://tecoble.techcourse.co.kr/post/2021-08-07-logback-tutorial/)

* [LogBack을 통한 효율적인 로그 관리](https://velog.io/@pgmjun/LogBack%EC%9D%84-%ED%86%B5%ED%95%9C-%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8-%EB%A1%9C%EA%B7%B8-%EA%B4%80%EB%A6%AC)
