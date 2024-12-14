---
layout: post
title: " Kotlin, SpringBoot 기반으로 멀티 모듈 설계와 적용하기 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

> 이 글은 필자 개인의 생각이 담긴 글이며, 틀린 내용이 있다면 언제든 말씀해 주세요 🙂

## Prologue

* IT 회사에서는 서비스 규모가 커질수록 필요한 소프트웨어의 복잡도 역시 증가한다. 특히 단일 모듈로 시작한 프로젝트는 서비스 규모가 커짐에 따라 여러 한계를 드러낼 수밖에 없다.

* 내 경험에 비추어 보면 이런 상황에서는 멀티 모듈 구성이 효과적인 해결책이 될 수 있다.

* B2C 서비스의 경우, 사용자가 많아질수록 늘어나는 트래픽을 감당하기 위해 멀티 모듈 구성이 필요하다.

  * 트래픽뿐만 아니라 새로운 기술을 적용하기 위해서도 모듈을 분리하면 기존 기술을 손쉽게 대체할 수 있다.

  * 또한, 도메인이 점점 세분화되고 코드량이 증가함에 따라 모듈을 분리해 과도한 역할과 책임을 방지할 수 있다.

* B2B 솔루션에서는 고객사의 다양한 요구를 충족하기 위해 멀티 모듈 구성이 유용하다.

  * 예를 들어, 고객사 A에게는 어드민 기능이 필요 없는 경우 어드민 전용 모듈을 제외하고 배포할 수 있다. 반대로, 고객사 B에게는 어드민과 모니터링 기능이 모두 필요한 경우 두 모듈을 조합해 제공할 수 있다.

* 위와 같은 경험이 없더라도 왜 멀티 모듈을 공부해야 하는지 곰곰히 생각해 본 결과, 아래와 같이 정리했다.

  * 회사에 투입되기 이전부터 프로젝트가 멀티 모듈로 구성되어 있는 경우.

  * 현재 프로젝트가 단일 모듈로 관리하기 어려울 정도로 서비스 규모가 커진 경우.

  * 멀티 모듈이 무엇인지 제대로 알고 싶고, 실제로 설계와 적용 과정을 통해 그 장점을 직접 체감하고 싶은 경우.

* 필자는 위 세 가지 중 일부가 겹치긴 하지만, 마지막 세 번째 이유가 가장 와닿아 이 글을 작성하게 되었다.

* 이번 글에서는 멀티 모듈이 무엇인지 개념을 살펴보고, 실제로 제가 어떻게 적용했는지, 그리고 그 결과 어떤 장단점이 있었는지 정리해보고자 한다.

---

## Multi Module 구상하기

> `모듈`은 여러 가지로 정의될 수 있지만, 일반적으로 큰 체계의 구성 요소이고, 다른 구성요소와 독립적으로 운영된다. - wikipedia - 

* 모듈에 대한 공통적인 특징을 정리하면 다음과 같다.

  * 모듈은 독립적인 의미를 갖는다.

  * 모듈은 어떠한 추상화 정도에 대한 계층을 가지고 있다.

  * 계층 간 의존 관계에 대한 규칙이 있다.

* 이러한 특징을 기반으로 시스템 설계를 고민하며 오픈소스 코드, 기술 블로그, 영상 등을 참고했다.

* 참고한 자료마다 멀티 모듈에 대한 세부적인 내용은 다르므로, 본인이 속한 회사에 적합한 설계를 하는 것이 중요하다.

* 그 중 개인적으로 공감이 되었던 [spring-boot-kotlin-template](https://github.com/team-dodn/spring-boot-kotlin-template) 코드와 [SpringBoot + Kotlin 멀티 모듈 구성](https://www.youtube.com/watch?v=PdofVTuM-tE&list=PL8RgHPKtjlBh-LU_yUxFfIq_flizPm_vZ) 영상을 기반으로 아래와 같이 멀티 모듈을 구상했다.

  * Core-Api 모듈

  * Domain 모듈

  * Storage 모듈

  * Support 모듈

* 위의 4가지 모듈을 정의함으로써 각 모듈의 역할과 책임을 명확히 구분할 수 있고, 의존 관계를 최소화하여 지속적으로 성장 가능한 프로젝트를 만들 수 있다.

* 이제 각 모듈이 어떤 의미를 가지는지 하나씩 살펴보고자 한다.

### Core-Api 모듈

* `Core-Api` 모듈은 프로젝트 내에서 유일하게 실행 가능한 모듈로, API 관련 로직을 담당한다.

### Domain 모듈

* `Domain` 모듈은 도메인 모델과 비즈니스 로직을 관리하며, 핵심 기능을 담당한다.

### Storage 모듈

* `Storage` 모듈은 서브 모듈로써 데이터베이스 관련 작업과 통합을 담당한다.

#### storage:db-core

* Storage 모듈에 있는 `db-core` 모듈은 Spring Data JPA를 사용하여 데이터베이스와의 상호작용을 담당한다. (데이터베이스의 경우, 예제 코드에는 H2로 되어있지만, 실제 프로젝트에 맞는 DB로 변경한다)

### Support 모듈

`Support` 모듈은 서브 모듈로써 로깅 및 모니터링 같은 보조 기능을 담당한다.

#### support:logging

* Support 모듈에 있는 `logging` 은 애플리케이션의 로깅을 관리하며 다양한 로킹 프레임 워크와의 통합을 지원한다.

#### support:monitoring

* Support 모듈에 있는 `monitoring` 모듈은 서비스의 성능 개선을 위한 모니터링 기능을 제공한다.

## Source Code (실전)

* 위에서 살펴본 4가지 모듈을 그려본 결과, 아래와 같다.

* 아래 그림은 멀티 모듈 프로젝트의 Gradle 의존성 구조를 나타낸다. 화살표는 의존 방향을 의미하며, 각 모듈의 역할과 책임에 따라 설계된 관계를 보여준다.

![](/assets/img/springboot/springboot-multi-module.png)

* 위의 그림을 바탕으로 Kotlin 1.6.21, Spring Boot 2.7.1 기반으로 실제 프로젝트를 구성해보았다.

> 실제 프로젝트에 대한 코드가 궁금하다면 [[Github] kotlin-springboot-multi-module](https://github.com/devFancy/kotlin-springboot-multi-module) 에서 확인한다.

![](/assets/img/springboot/springboot-multi-module-intelliJ.png)

### 프로젝트 설정 파일

* 각 모듈을 살펴보기 전에, 최상위 모듈에 있는 3가지 파일에 대해 정리했다.

* 아래의 3개 파일은 멀티 모듈 프로젝트의 효율적인 관리와 일관성을 유지하는 데 핵심적인 역할을 한다.

> 자세한 내용은 Gradle [공식문서](https://docs.gradle.org/current/userguide/intro_multi_project_builds.html)를 참고한다. (주로 참고할 부분 - Learning the Basics : 2번 ~ 5번)

> gradle.properties

```properties
### Application version ###
applicationVersion=0.0.1

### Project configs ###
projectGroup=demo

### Project dependency versions ###
kotlinVersion=1.6.21
javaVersion=11

### Spring dependency versions ###
springBootVersion=2.7.1
springDependencyManagementVersion=1.0.11.RELEASE
springCloudDependenciesVersion=2021.0.3
```

* 위와 같이 `gradle.properties` 은 프로젝트 전역에서 사용할 **설정값**과 **의존성 버전**을 정의한다. 이를 통해 모든 모듈이 공통된 설정과 버전을 참조하도록 일관성을 유지한다.

  * `applicationVersion`, `projectGroup` 등 프로젝트 메타 정보를 정의한다.

> settings.gradle.kts

```kotlin
rootProject.name = "kotlin-springboot-multi-module"

include(
  "core-api",
  "support:monitoring",
  "support:logging",
  "storage:db-core",
  "domain"
)

pluginManagement {
  val kotlinVersion: String by settings
  val springBootVersion: String by settings
  val springDependencyManagementVersion: String by settings

  resolutionStrategy {
    eachPlugin {
      when(requested.id.id) {
        "org.jetbrains.kotlin.jvm" -> useVersion(kotlinVersion)
        "org.jetbrains.kotlin.plugin.spring" -> useVersion(kotlinVersion)
        "org.springframework.boot" -> useVersion(springBootVersion)
        "io.spring.dependency-management" -> useVersion(springDependencyManagementVersion)
      }
    }
  }
}
```

* 위와 같이 `settings.gradle.kts` 은 프로젝트의 루트 및 서브 모듈 관계를 명확히 정의하여 **멀티 모듈의 구조와 의존성 관리**를 담당한다. Gradle 플러그인 초기화 및 관리 전략을 설정한다.

* 주요 구성 요소를 정리하면 아래와 같다.

* `rootProject.name` : 프로젝트의 루트 이름을 정의한다. 멀티 모듈 프로젝트의 최상위 프로젝트 이름을 설정하며, 빌드 환경에서 이 이름으로 인식된다. 

* `include(...)` : 멀티 모듈 프로젝트에서 사용할 서브 프로젝트를 정의한다. 각 모듈은 프로젝트 내에서 고유한 역할을 담당하며, 계층 구조를 설정할 수 있다.

  * `core-api` : API 관련 로직을 담당하는 모듈

  * `support:~` : 서브 모듈로서 로깅과 모니터링을 담당하는 모듈

  * `storage:~` : 데이터베이스 관련 작업을 담당하는 모듈

  * `domain` : 비즈니스 로직 및 도메인 모듈을 담당하는 모듈

* `pluginManagement` : Gradle에서 사용하는 플러그인의 초기화 및 버전 관리 담당하며, 프로젝트에서 필요한 플로그인 버전을 한곳에 설정함으로써 관리 면에서 일관성을 유지할 수 있다.

  * `resolutionStrategy` : 요청된 플러그인의 ID에 따라 사전에 정의된 버전을 동적으로 할당하며, 플러그인 간 버전 충돌을 방지한다.

> build.gradle.kts

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm")
    kotlin("plugin.spring") apply false
    id("org.springframework.boot") apply false
    id("io.spring.dependency-management")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
}

val projectGroup: String by project
val applicationVersion: String by project

allprojects {
    group = projectGroup
    version = applicationVersion

    repositories {
        mavenCentral()
    }

}

subprojects {
    dependencies {
        apply(plugin = "org.jetbrains.kotlin.jvm")
        apply(plugin = "org.jetbrains.kotlin.plugin.spring")
        apply(plugin = "org.springframework.boot")
        apply(plugin = "io.spring.dependency-management")

        dependencyManagement {
            val springCloudDependenciesVersion: String by project
            imports {
                mavenBom("org.springframework.cloud:spring-cloud-dependencies:${springCloudDependenciesVersion}")
            }
        }

        implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
        implementation("org.jetbrains.kotlin:kotlin-reflect")
        testImplementation("org.springframework.boot:spring-boot-starter-test")
    }

    tasks.getByName("bootJar") {
        enabled = false
    }

    tasks.getByName("jar") {
        enabled = false
    }

}
```

* `build.gradle.kts` 은 멀티 프로젝트의 최상위 **빌드 설정**을 관리하며, 공통된 플러그인, 의존성, 버전 관리 및 버스 모듈 설정을 정의한다. 서브 모듈에 적용할 공통 로직과 의존성 관리도 포함된다.

* 주요 구성 요소를 정리하면 아래와 같다.

  * `plugins` : 프로젝트에서 사용할 플러그인을 선언하며, 최상위 모듈과 서브 모듈에서 플러그인을 관리한다.

  * `java` : Java의 소스 및 대상 버전을 지정할 때 사용하며, 현재는 Java 11 환경에서 동작하도록 설정했다.

  * `allprojects` : 프로젝트의 모든 모듈에 공통적으로 적용할 설정을 정의한다.

  * `subprojects` : 서브 모듈에 공통적으로 적용할 플러그인, 의존성, 의존성 관리 및 작업 설정을 포함한다.

  * 이외에 `bootJar` 와 `jar` 작업을 비활성화해 서브모듈에서 독립 실행 가능한 아카이브 파일을 생성하지 않도록 설정한다. 이를 통해 빌드 시간을 단축하고, 불필요한 결과물을 방지한다.

### 멀티 모듈 의존성 구조

> core-api

* `core-api` 모듈의 `build.gradle.kts` 를 살펴보면 다음과 같은 의존성과 설정이 있다.

![](/assets/img/springboot/springboot-multi-module-core-api.png)

* 빌드 설정에서 `core-api` 모듈은 **실행 가능한 JAR 파일을 생성** 하기 위해 `bootJar` 작업을 활성화했고, 일반적인 라이브러리 JAR 파일 생성은 비활성화했다. 

  * 왜냐하면 `core-api` 모듈은 실행 가능한 애플리케이션으로 설계되었으므로, 일반 Jar 파일을 생성할 필요가 없기 때문이다.

* 의존성 관계에서는 `domain` 모듈과 `support` 모듈을 의존하게 되고, `storage` 모듈은 런타임 시에만 적용되도록 했다.

* 이러한 의존성을 통해 Core-api 모듈은 도메인 로직과 보조 모듈(storage, support) 을 활용하여 API를 제공한다.

### 적용한 결과

* 다시 위에서 보여준 그림을 확인하면 아래와 같다.

![](/assets/img/springboot/springboot-multi-module.png)

* 위와 같이 멀티 모듈을 적용함으로써 이전 단일 모듈에 비해 여러 이점을 아래와 같이 정리했다.

  * **모듈 간 역할과 책임의 명확화** - 각 모듈이 독립적으로 역할과 책임을 가지므로 코드 구조가 명료해졌다. 예를 들어, API 로직은 `core-api` 에서 처리하고, 비즈니스와 도메인 로직은 `domain` 에서, 데이터베이스와의 상호작용은 `storage` 에서, 로깅과 모니터링은 `support` 에서 담당한다.

  * **코드 재사용성 증가** - 공통 기능인 로깅과 모니터링을 `support` 로 분리하여 다른 모듈에서 필요할 때 쉽게 가져다 쓸 수 있다.

  * **기술 변경 및 확장성 강화** - 새로운 기술을 도입하거나 기존 기술을 제거할 때 특정 모듈에만 적용하면 되므로 유연성이 전보다 증가했다. 예를 들어, JPA가 아닌 다른 기술을 사용하려면 기존 `storage` 모듈만 수정하면 된다.

  * **배포의 유연성** - B2B 솔루션 프로젝트에서는 고객사의 요구에 따라 필요한 모듈만 선택적으로 배포할 수 있다.

* 멀티 모듈은 역할과 책임을 명확히 구분할 수 있는 장점도 있지만, 모듈을 분리하면서 코드를 이해하거나 관리하는 데 어려움이 있을 수 있다.

  * 예를 들어, 코드 리뷰 시 단일 모듈에 비해 멀티 모듈에서는 `core-api`, `domain`, `storage`, `support` 등 여러 모듈을 왔다 갔다 하며 검토해야 하므로 리뷰 과정이 번거로워질 수 있다.

* 또한, 서비스 초기 단계에서는 도메인의 세부 내용이 자주 바뀔 가능성이 있어 위 구조가 적합하지 않을 수 있다. 이 경우, `domain` 모듈과 `core-api` 모듈 간 이동이 잦아져 개발 효율이 떨어질 수 있다.

* 따라서 제품 출시 전이나 서비스 초기라면 `domain` 모듈을 `core-api` 모듈에 통합하는 구조로 가는 것이 더 효율적일 수 있다. 이를 그림으로 표현하면 아래와 같다.

![](/assets/img/springboot/springboot-multi-module-domain-in-core-api.png)

* 이 외에도 다양한 상황에 따라 적합한 구조가 달라질 수 있으므로, 아래와 같이 선택 기준을 정리했다.

> 나만의 선택 기준

* [1] 도메인 이해도가 부족한 경우, 또는 회사내 도메인 전문가가 없는 경우

  * Domain 모듈을 Core-api 모듈에 합치는 구조로 간다.

* [2] 도메인 이해도가 높고, 회사 내 도메인 전문가가 있는 경우

  * Domain 모듈과 Core-api 모듈을 분리한다.

---

* 도메인에 대한 이해도가 부족하다고 느낀다면, 개념 설계를 화이트보드나 툴([miro](https://miro.com/ko/), [excalidraw](https://excalidraw.com/))을 활용해 직접 그려보며 정리하는 것도 좋은 방법이다.


### 통제와 제어

[[토스] SLASH 22 - 지속 성장 가능한 코드를 만들어가는 방법](https://www.youtube.com/watch?v=RVO02Z1dLF8) 영상을 보면서 개인적으로 기억에 남았던 문장을 가져왔다.

> 올바른 응집으로 코드를 관리하고 Layer 간의 규칙을 지키며 적절한 Module화로 기술을 격리하여 다양한 변화에 대응할 수 있도록 코드를 통제하려 합니다.
> 
> 그리고 이 통제를 기반으로 하여 소프트웨어를 자유자재로 제어하려 합니다.
> 
> 통제를 기반으로 코드의 제어권을 얻어 '지속 성장 가능한 소프트웨어'를 효과적이고 안정적으로 만들어 내어 산업을 이끌어가는 시스템을 구축하려 합니다.

* 발표자님 말씀처럼, 시간이 지나면서 소프트웨어는 계속 발전하므로 멀티 모듈 구조에도 정답은 없다고 생각한다.

* 중요한 것은 각 모듈의 의존성을 명확히 정의하고, 역할과 책임을 분리하여 변화에 유연하게 대응할 수 있는 코드를 만드는 것이다.

## Review

* 이번 글에서는 멀티 모듈 구조를 왜 공부해야 하는지, 그리고 적용 과정과 결과를 정리했다.

* 멀티 모듈은 단일 모듈의 한계를 넘어서는 좋은 방법이지만, 모든 상황에서 정답은 아니라고 생각한다.

* 서비스 규모, 사용자 수, 팀 구성 등 여러 요소를 고려해 멀티 모듈을 적용할지 결정해야 하며, 적용한 이후에도 상황에 맞게 구조를 계속 다듬는 것이 중요하다.

* (끝으로, 이 글을 작성하는 데 큰 도움을 주신 [geminiKim](https://github.com/team-dodn/spring-boot-kotlin-template/commits?author=geminiKim) 님께 감사의 말씀을 드립니다)

## Reference

* [[우아한 기술블로그] 멀티모듈 설계 이야기 with Spring, Gradle](https://techblog.woowahan.com/2637/)

* [Github: spring-boot-kotlin-template](https://github.com/team-dodn/spring-boot-kotlin-template)

* [[토스] SLASH 22 - 지속 성장 가능한 코드를 만들어가는 방법](https://www.youtube.com/watch?v=RVO02Z1dLF8&ab_channel=토스)

* [지속 성장 가능한 코드를 만들어가는 방법](https://www.youtube.com/watch?v=pimYIfXCUe8&ab_channel=제미니의개발실무)

* [YouTube] SpringBoot + Kotlin 멀티 모듈 구성 관련 영상들

  * [SpringBoot + Kotlin 멀티 모듈 구성 - 단일모듈에서 멀티모듈로 변경해보기 #1](https://www.youtube.com/watch?v=PdofVTuM-tE)

  * [SpringBoot + Kotlin 멀티 모듈 구성 - 의존성 버전 관리 + 로깅 모듈 추가하기 #2](https://www.youtube.com/watch?v=rE89ppAmf_Y)

  * [SpringBoot + Kotlin 멀티 모듈 구성 - DB 모듈 추가하기 #3](https://www.youtube.com/watch?v=ODSFmLdecX0)

  * [SpringBoot + Kotlin 멀티 모듈 구성 - 도메인 모듈 분리 #4](https://www.youtube.com/watch?v=p5ZMF2bpE6A)

  * [모듈 분리 시 의존 관계 설정](https://www.youtube.com/watch?v=nVGV8ag8v7g&ab_channel=제미니의개발실무)

* [[Gradle 공식 문서] Structuring Projects with Gradle](https://docs.gradle.org/current/userguide/multi_project_builds.html)