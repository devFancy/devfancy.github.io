---
layout: post
title:  " 1편. Spring Boot 환경의 Multi Module에서 logback 환경별 설정하기 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

## Prologue

* 멀티 모듈 프로젝트로 전환하면서 환경별 로그 설정의 필요성을 절실히 느꼈습니다.

* 운영 환경에서는 로그의 형식과 수준이 서비스 안정성과 직결되기 때문에 더욱 중요합니다.

* 이번 글은 실제 운영 환경에서 적용하는 것 보다는 멀티 모듈 구조에서 환경별로 `logback.xml`을 구성한 경험을 공유하기 위해 작성했습니다.

> 관련 포스팅

* [2편. Spring Boot에서 요청 흐름 추적: Logging Filter와 traceId 적용기](https://devfancy.github.io/SpringBoot-Logging-Filter/)

---


## 환경 구성

> 이 글에서 다루는 모든 코드는 [Github](https://github.com/devFancy/kotlin-java-playground/tree/main/springboot-java-practice) 에서 확인하실 수 있습니다.
> 
> 멀티 모듈 구성에 대한 자세한 설명은 [README.md](https://github.com/devFancy/kotlin-java-playground/blob/main/springboot-java-practice/README.md) 를 참고해 주시기 바랍니다.

### 기술 스택

* Spring Boot: 3.2.5
* Java: 21
* Logback: Spring Boot 내장 로깅 프레임워크 사용
* Gradle 8.1

### 멀티 모듈 구조

(시간이 지남에 따라 모듈 구조가 변할 수 있습니다)

* `core:core-api`: 애플리케이션 실행 및 API 계층을 담당하는 메인 모듈입니다. 다른 내부 모듈들과 연결되어 실제 서비스를 구동합니다.

* `core:core-enum`: core-api 전반에서 공통으로 사용하는 Enum(열거형) 을 정의한 모듈입니다. 도메인 간 중복을 방지하고 일관된 값을 유지하기 위해 별도로 분리하여 관리합니다.

* `support:logging`: 공통적인 로깅 설정을 담당하는 모듈이다. 공통적인 로깅 설정을 담당하는 모듈입니다. 여러 서비스에서 일관된 로그 포맷을 적용할 수 있으며, 필요 시 Sentry 연동도 고려할 수 있습니다.

### 모듈 연동 설정

멀티 모듈 프로젝트에서 `support:logging` 모듈의 설정을 core-api 모듈에 적용하기 위해 다음 설정이 필요합니다.

`core-api` 모듈의 `resources/application.yml`에 `logging.yml`을 import 합니다.

```yaml
spring:
  config:
    import:
      - logging.yml
```

그리고 core-api 모듈의 build.gradle에 support:logging 모듈을 의존성으로 추가합니다.

```groovy
dependencies {
    implementation project(":support:logging")
}
```

이렇게 설정하면 `support:logging` 모듈에서 정의한 `logback.xml` 파일이 core-api 모듈에서 적용됩니다.

## logback.xml 구성

환경별 로깅 설정은 다음과 같이 별도의 XML 파일로 분리되어 있습니다.

> 배포 단계 흐름: `local` (개인 개발) -> `dev` (통합 개발) -> `staging` (운영 전 최종 점검) -> `live` (=prod, 실제 서비스 운영)

```markdown
support/logging/src/main/resources/logback/
├── logback-dev.xml
├── logback-live.xml
├── logback-local.xml
└── logback-staging.xml
```

그리고 `logging.yml` 파일에서 다음처럼 설정되어 있어, `spring.profiles.active` 에 따라 자동으로 해당 설정 파일을 불러오게 됩니다.

```yaml
logging.config: classpath:logback/logback-${spring.profiles.active}.xml
```

이 구조를 통해 각 환경의 로그 패턴, 출력 대상(Appender), 로깅 레벨 등을 유연하게 관리할 수 있습니다.


## logback.xml 구체적으로 살펴보기

### 공통 구조

모든 환경은 아래 공통 구성을 따릅니다.

```xml
<include resource="org/springframework/boot/logging/logback/defaults.xml"/>
```

* Spring Boot가 제공하는 기본 색상 설정과 변수(%clr, ${level:-%5p} 등)를 포함합니다.

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>...</pattern>
        <charset>utf8</charset>
    </encoder>
</appender>
```

* 콘솔 출력용 Appender
* UTF-8 인코딩 사용
* 각 환경에서 동일한 패턴을 사용하며 Appender만 다르게 구성할 수도 있습니다.

### 로그 출력 패턴 예시

아래는 `logback-local.xml`에서 사용한 로그 출력 패턴입니다.

```xml
<pattern>
  %clr(%d{HH:mm:ss.SSS}){faint}|
  %clr(${level:-%5p})|
  %32X{traceId:-},
  %16X{spanId:-}|
  %clr(%-40.40logger{39}){cyan}
  %clr(|){faint}
  %m%n
  ${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}
</pattern>
```

* `%clr(...)`: Spring Boot에서 지원하는 색상 강조 기능으로 `<include ...logback/defaults.xml>` 을 통해 정의됩니다.

* `{faint}`: 회색빛(faint) 으로 출력되며, 로그 가독성을 높이기 위한 장식적 용도이다. 중요도가 낮은 항목 (예: 시간, 구분자 등)에 자주 사용됩니다.

* `%d{HH:mm:ss.SSS}`: 로그 발생 시간 (시:분:초.밀리초). 운영 환경에서는 날짜를 생략했습니다.

* `${level:-%5p}`: 로그 레벨(DEBUG, INFO, WARN, ERROR 등) 을 왼쪽 정렬 기준으로 **최소 너비 5칸**으로 출력합니다. 가장 긴 로그 레벨인 ERROR(5자)에 맞춰 가독성을 높이기 위해 보통 5자 폭으로 설정합니다.

* `%X{traceId}, %X{spanId}`: MDC에 저장된 `traceId`와 `spanId`를 각각 32칸, 16칸 너비로 출력한다. 값이 없을 경우 빈 값으로 대체됩니다.
  주로 Spring Cloud Sleuth, Zipkin 등과 연동할 때 사용되며, 분산 트레이싱을 위한 정보로 활용된다.

* `%logger{39}`: 로그를 발생시킨 클래스명을 최대 39자까지 출력합니다. 너무 긴 클래스명은 생략되고, 필요한 경우 패키지명 없이 `logger{0}`과 같이도 설정할 수 있습니다.

* `%m%n`: 로그 메시지를 출력하고 줄 바꿈을 수행합니다.

* `%wEx`: 예외가 있을 경우, 간략한 요약 정보만 1~2줄로 출력한다. 전체 stack trace는 출력하지 않아 운영 환경에서 로그를 깔끔하게 유지하는 데 유리합니다.

## 실행 및 로그 확인

`local` 환경에서 애플리케이션을 실행하면, 아래와 같은 로그를 확인할 수 있습니다.

> 실행 결과 예시

![](/assets/img/springboot/springboot-multi-module-logback-xml.png)

위 로그에서 traceId, spanId 값이 비어 있는 이유는 **Spring Cloud Sleuth 등 분산 추적 라이브러리를 적용하지 않았기 때문**입니다.

이 값을 출력하고 싶다면 Sleuth 또는 Micrometer Tracing 등의 설정이 필요합니다.

또한 `/api/log` API 요청을 통해 다양한 로그 레벨의 로그를 출력해볼 수 있습니다.

> ExamplePostController

```java
@RequestMapping("/api")
@RestController
public class ExamplePostController implements ExamplePostControllerDocs { 
    private final Logger log = LoggerFactory.getLogger(getClass());

    @GetMapping("/log")
    @Override
    public ResponseEntity<CommonResponse<?>> logTest() {
      log.debug("DEBUG 레벨 로그입니다.");
      log.info("INFO 레벨 로그입니다.");
      log.warn("WARN 레벨 로그입니다.");
      log.error("ERROR 레벨 로그입니다.");
      return ResponseEntity.ok(CommonResponse.success());
    }
}
```

> API 실행 결과

![](/assets/img/springboot/springboot-multi-module-logback-xml-loglevel.png)

## Summary

이번 글에서는 멀티 모듈 기반의 Spring Boot 프로젝트에서 환경별 `logback.xml` 을 어떻게 구성하고 적용할 수 있는지 정리해보았습니다.

특히 `%clr`, `${level:-%5p}`, `%X{traceId}` 등 로그 패턴 설정에 사용되는 문법을 하나씩 설명하고, 실제 로그 출력 결과를 통해 그 효과를 확인하실 수 있었습니다.

다음 포스팅에서는 Spring Filter를 활용한 HTTP 요청/응답 로그 수집에 대해 작성해볼 예정입니다.

지금까지 읽어주셔서 감사합니다.

## References

* [[Github] spring-boot-java-template](https://github.com/team-dodn/spring-boot-java-template)

* [Docs] https://logback.qos.ch/manual/appenders.html
