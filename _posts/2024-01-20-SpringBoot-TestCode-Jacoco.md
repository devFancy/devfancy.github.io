---
layout: post
title: " 히빗 프로젝트(ver.2)에 Jacoco 설정하기: 코드 커버리지 높이기 "
categories: Hibit
author: devFancy
---
* content
{:toc}

> 이 글은 실제 [히빗 프로젝트(ver.2)](https://github.com/hibit-team/hibit-backend-improved)를 혼자서 개발하면서 경험한 내용을 정리한 글입니다.

* 예상 독자: Spring Boot 기반 테스트 코드를 작성하는 개발자

* 이 글은 히빗 프로젝트(ver.2)에 `Jacoco`를 설정한 과정에 대해 공유하고자 합니다.
아래 글부터는 히빗 프로젝트(ver.2) 를 `히빗2`로 줄여서 작성했습니다.

---

## 도입 배경

히빗 프로젝트(ver.1)에서는 테스트 코드가 거의 없어서 QA 작업때 정말 많은 시간을 할애했다. (QA 작업에 대한 내용과 테스트 코드를 도입하게된 배경은 [좋은 단위 테스트란? (feat. 히빗)](https://devfancy.github.io/SpringBoot-TestCode-Unit/) 글에서 확인할 수 있습니다.)

그래서 이번에 [히빗2](https://github.com/hibit-team/hibit-backend-improved) 에서는 테스트 코드를 도입하게 되면서, 테스트 커버리지도 신경써야 한다고 생각했다.

(여기서 말하는 `테스트 커버리지`란 시스템 및 소프트웨어 대해 충분한 테스트가 되었는지를 나태내는 정도를 말한다.)

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-1.png)

토스 유튜브 채널에서 토스뱅크 이응준님이 발표하신 [SLASH21 - 테스트 커버리지 100%](https://toss.im/slash-21/sessions/1-6) 영상을 우연히 보게 되었다.

이응준님은 "클린 코더" 책을 읽다가 **'테스트 커러비지 100%를 강력히 요구한다'** 는 글을 보고서 실제로 적용해보셨다고 한다. 
토스 홈 리뉴얼 프로젝트에 2개월 동안 9천 라인의 테스트 코드를 작성하여 달성하였고, 커버리지 100%가 아니면 배포가 안되게 설정하셨다고 한다.

이응준님이 발표하신 내용에 따르면 높은 테스트 커버리지에는 다음과 같은 **이점**이 존재한다고 하셨다.

* 자신있게 누를 수 있는 배포 버튼

* 거침없는 리팩터링을 할 수 있음

* 전체 코드의 10% 이상을 수정하는 리팩터링을 master 브랜치에 걱정없이 merge하여 괜찮은 수준의 코드 가독성을 유지할 수 있음

* 불필요한 프로덕션 코드가 사라짐

* 시간이 갈수록 점점 쉬워지는 테스트 작성 (이미 작성한 테스트를 참조해서 새 테스트를 작성할 수 있음)

테스트가 없으면 리팩터링을 할 수 없고, 리팩터링을 하지 않는 코드는 이해할 수 없게 되며, 이러한 코드는 수정할 수 없다는 확신이 없다는 말씀을 들으면서 많은 공감이 되었다.

이로 인해 테스트의 중요성을 새롭게 깨달았고,  이번 프로젝트에서는 `코드 커버리지`를 적극적으로 도입하기로 결정하게 되었다.

> `코드 커버리지`란 소프트웨어의 테스트 케이스가 얼마나 충족되었는지를 나타내는 지표 중 하나이다.
> 테스트를 진행하였을 때 **‘코드 자체가 얼마나 실행되었느냐’** 는 것이고, 이는 수치를 통해 확인할 수 있다.

## Jacoco란

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-2.png)

[Jacoco](https://www.jacoco.org/jacoco/) 는 Java 코드의 커버리지를 체크하는 라이브러리이다. 
테스트 코드를 돌리고 그 커버리지 결과를 눈으로 보기 좋도록 html이나 xml, csv와 같은 리포트로 생성한다.

그리고 테스트 결과가 내가 설정한 커버리지 기준을 만족하는지 확인하는 기능도 있다.

여기서는 Java 코드가 섞인 Gradle 기준의 **히빗2에 `Jacoco`를 도입하여 코드 커버리지를 분석하고, 코드 커버리지가 80% 미만일 경우에 빌드가 실패되도록 설정**했다.

## JaCoCo 플러그인 추가하기

아래 `build.gradle` 파일에 jacoco 플러그인을 가져오고 버전을 설정한다.

```groovy
plugins {
    // ...
    id 'jacoco'
}

jacoco {
    // JaCoCo 버전
    toolVersion = '0.8.7'
}
```

jacoco에 플러그인을 불러왔다면, 프로젝트의 테스트 코드를 한번 실행시켜보면 아래와 같이 `test.exec` 파일이 생성된 것을 확인할 수 있다.
해당 파일은 jacoco가 테스트 코드를 실행하고, 코드 커버리지를 분석하여 만들어준 보고서 파일이다.

> jacoco 폴더 안에 indext.html, index.csv, index.xml 파일은 밑에서 설명할 `jacocoTestReport` 을 이미 실행했기 때문에 생긴 파일이다.

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-3.png)

Jacoco Gradle 플러그인에는 `jacocoTestReport` 와 `jacocoTestCoverageVerification` task가 있다.

### jacocoTestReport

`jacocoTestReport` : 바이너리 커버리지 결과를 사람이 **읽기 좋은 형태의 리포트로 저장**한다.
    html 파일로 생성해 사람이 쉽게 눈으로 확인할 수 있고, SonarQube 등으로 연동하기 위해 html, csv, xml 같은 형태로도 리포트를 생성할 수 있다.

Jacoco는 위에 생성한 바이너리 커버리지(`test.exec`) 파일을 사람이 읽을 수 있는 html, csv, xml 파일로 생성하는 기능을 제공한다.

```groovy
jacocoTestReport {
    reports {
        // 원하는 리포트를 켜고 끌 수 있습니다.
        html.enabled true
        xml.enabled true
        csv.enabled true

        //  각 리포트 타입마다 리포트 저장 경로를 설정할 수 있습니다.
        html.destination file("${buildDir}/jacoco/index.html")
        xml.destination file("${buildDir}/jacoco/index.xml")
        csv.destination file("${buildDir}/jacoco/index.csv")
    }
}
```

> 위에 있는 `${buildDir}`는 디렉터리 경로를 의미한다.

위에 이미 실행되어 `test.exec` 파일이 생성되었다고 가정하고 아래 명령어를 통해 `jacocoTestReport` 태스크를 실행하면 html, csv, xml 파일이 생기게 된다.

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-4.png)

build.gradle -> jacoco에서 `index.html` 폴더와 `index.csv`, `index.xml` 파일이 생성된 것을 확인할 수 있다.

`html` 파일은 `index.html` 폴더 내부에 존재한다.

> `jacocoTestReport`에 대한 자세한 내용은 [JacocoReport](https://docs.gradle.org/current/dsl/org.gradle.testing.jacoco.tasks.JacocoReport.html) 참고하자

### jacocoTestCoverageVerification

`jacocoTestCoverageVerification` : **내가 원하는 `커버리지 기준`을 만족하는지 확인해주는 task**이다.
    예를 들어, 브랜치 커버리지를 최소한 80% 이상으로 유지하고 싶다면, 이 task에 설정하면 된다. `test` task 처럼 Gradle 빌드의 성공/실패로 결과를 보여준다.

아래는 Hibit2에서 설정한 `jacocoTestCoverageVerification` 이다.

```groovy
jacocoTestCoverageVerification {
    violationRules {
        rule {
            enabled = true
            element = 'CLASS'

            limit {
                counter = 'LINE'
                value = 'COVEREDRATIO'
                minimum = 0.80
            }
        }
        rule {
            // 규칙을 여러개 추가할 수 있다.
        }
    }
}
```

* enabled : 규칙의 활성화 여부를 나타낸다. 기본값은 `true`이다.

* element : 커버리지를 체크할 단위를 설정한다. 아래와 같은 옵션이 있다. (Default값은 `BUNDLE`)

    * `BUNDLE` : 패키지 번들(프로젝트 모든 파일을 합친 것)
    
    * `CLASS` : 클래스
    
    * `GROUP` : 논리적 번들 그룹
    
    * `METHOD` : 메서드
    
    * `PACKAGE` : 패키지
    
    * `SOURCEFILE` : 소스 파일

* counter : 코드 커버리지를 측정할 때 사용되는 지표이다. (Default값은 `INSTRUCTION`)

    * `LINE` : 빈 줄을 제외한 실제 코드의 라인 수, 라인이 한 번이라도 실행되면 실행된 것으로 간주

    * `BRANCH` : 조건문 등의 분기 수

    * `CLASS` : 클래스 수, 내부 메서드가 한 번이라도 실행된다면 실행된 것으로 간주

    * `METHOD` : 메서드 수, 메서드가 한 번이라도 실행된다면 실행된 것으로 간주

    * `COMPLEXITY` : 복잡도

    * `INSTRUCTION` : Java 바이트코드 명령 수

* value : limit 메서드를 통해 지정할 수 있으며 측정한 커버리지를 어떠한 방식으로 보여줄 것인지를 말한다. (Default 값은 `COVEREDRATIO`)

    * `COVEREDRATIO` : 커버된 비율, 0부터 1사이의 숫자로 1이 100%

    * `COVEREDCOUNT` : 커버된 개수
    
    * `MISSEDCOUNT` : 커버되지 않은 개수
    
    * `MISSEDRATIO` : 커버되지 않은 비율, 0부터 1사이의 숫자로 1이 100%
    
    * `TOTALCOUNT` : 전체 개수

* minimum :  limit 메서드를 통해 지정할 수 있으며 counter 값을 value 에 맞게 표현했을 때 최솟값을 말한다.
  이 값을 통해 `jacocoTestCoverageVerification` 의 성공 여부가 결정된다. (Default 값이 존재하지 않는다)

    * 80%를 최소값으로 잡고 싶다면 0.80을 입력해야 한다.

> `jacocoTestReport`에 대한 자세한 내용은 [JacocoCoverageVerification](https://docs.gradle.org/current/dsl/org.gradle.testing.jacoco.tasks.JacocoCoverageVerification.html) 참고하자


## 태스크 순서 결정하기

test 태스크가 끝난 다음에 `jacocoTestReport`를 바로 실행하려면 아래와 같이 test 태스크에 추가하면 된다.

```groovy
test {
    // ...
    finalizedBy 'jacocoTestReport'
}
```

Gradle에서 `finalizedBy` 를 사용하면, 해당 태스트가 끝나고 성공 여부와 관계 없이 명시한 태스크를 이어서 실행하도록 설정할 수 있다.

이어서 `jacocoTestReport` 태스크가 실행된 이후에 `jacocoTestCoverageVerification`가 바로 실행되어 테스트가 실행하려면 아래와 같이 `jacocoTestReport` 맨 마지막 라인에 작성하면 된다.

```groovy
jacocoTestReport {
    // ...

    finalizedBy 'jacocoTestCoverageVerification'
}
```

결과적으로 test -> jacocoTestReport -> jacocoTestCoverageVerification 순서로 태스크를 실행하게 된다.

## Jacoco 테스트에서 제외하기

Application, 예외 클래스, DTO 클래스, config에 있는 클래스 등 테스트를 하지 않아도 되는 클래스들이 있다. 이런 클래스까지 포함하여 
코드 커버리지를 계산하면 코드 커버리지가 낮게 측정될 것이다. 이런 클래스들은 분석 대상에서 제외할 수 있다.

### jacocoTestReport

`jacocoTestReport` 태스크에는 보고서에 표시되는 클래스 중 일부를 제외할 수 있다.

제외 대상 파일의 경로는 [Ant 스타일](https://ant.apache.org/manual/dirtasks.html)로 작성한다.

```groovy
jacocoTestReport {
    // ...
    afterEvaluate {
        classDirectories.setFrom(
                files(classDirectories.files.collect {
                    fileTree(dir: it, excludes: [
                            '**/*Application*',
                            '**/*Exception*',
                            '**/dto/**',
                            '**/common/**',
                            // ...
                    ])
                })
        )
    }
}
```

### jacocoTestCoverageVerification

`jacocoTestCoverageVerification` 에서는 코드 커버리지를 만족하는지 확인할 대상 중 일부를 제외할 수 있다.
`jacocoTestReport` 에서 작성한 것과 다르게 파일의 경로가 아닌 **패키지 + 클래스명**을 적어줘야 한다.
와일드 카드로 `*`(여러 글자) 와 `?`(한 글자)를 사용할 수 있다.

```groovy
jacocoTestCoverageVerification {
    violationRules {
        rule {
            // ...
            excludes = [
                    '*.*Application',
                    '*.*Exception',
                    '*.dto.*',
                    '*.common.*',
                    // ...
            ]
        }
    }
}
```

## Result

test를 실행하여 총 155개의 단위 테스트에 대한 성공 결과를 보여줬다.

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-5.png)

그리고 코드 커버리지 80%를 달성하게 되었다.

![](/assets/img/testcode/SpringBoot-TestCode-Jacoco-6.png)

최종적으로 작성된 `build.gradle` 파일은 아래와 같다.

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.7.10'
    id 'io.spring.dependency-management' version '1.0.15.RELEASE'
    id 'jacoco'
}

group = 'com'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '11'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring boot
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    // ConfigurationProperties annotation
    annotationProcessor "org.springframework.boot:spring-boot-configuration-processor"

    // test
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    //테스트에서 lombok 사용
    testCompileOnly 'org.projectlombok:lombok'
    testAnnotationProcessor 'org.projectlombok:lombok'

    // lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // h2
    runtimeOnly 'com.h2database:h2'
    runtimeOnly 'com.mysql:mysql-connector-j'

    // jwt
    implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'
}

tasks.named('bootBuildImage') {
    builder = 'paketobuildpacks/builder-jammy-base:latest'
}

test {
    useJUnitPlatform()
    finalizedBy 'jacocoTestReport'
}

jacoco {
    // JaCoCo 버전
    toolVersion = '0.8.7'
}

jacocoTestReport {
    reports {
        // 원하는 리포트를 켜고 끌 수 있습니다.
        html.enabled true
        xml.enabled true
        csv.enabled true

        //  각 리포트 타입마다 리포트 저장 경로를 설정할 수 있습니다.
        html.destination file("${buildDir}/jacoco/index.html")
        xml.destination file("${buildDir}/jacoco/index.xml")
        csv.destination file("${buildDir}/jacoco/index.csv")
    }
    afterEvaluate {
        classDirectories.setFrom(
                files(classDirectories.files.collect {
                    fileTree(dir: it, excludes: [
                            '**/*Application*',
                            '**/*Exception*',
                            '**/auth/event/**',
                            '**/dto/**',
                            '**/common/**',
                            '**/global/**',
                            '**/infrastructure/**',
                            '**/BaseEntity**',
                            '**/AuthorizationExtractor*',
                            '**/AuthenticationPrincipal*'
                    ])
                })
        )
    }

    finalizedBy 'jacocoTestCoverageVerification'
}

jacocoTestCoverageVerification {
    violationRules {
        rule {
            enabled = true
            element = 'CLASS'

            limit {
                counter = 'LINE'
                value = 'COVEREDRATIO'
                minimum = 0.80
            }

            excludes = [
                    '*.*Application',
                    '*.*Exception',
                    '**.auth.event.*',
                    '*.dto.*',
                    '*.common.*',
                    '*.global.*',
                    '*.infrastructure.*',
                    '*.global.config.*',
                    '*.BaseEntity',
                    '*.ControllerAdvice',
                    '*.AuthorizationExtractor',
                    '*.AuthenticationPrincipal.*'
            ]
        }
    }
}
```

## 마무리

코드 커버리지를 80%로 높이기 위해 Jacoco를 도입하기 전, 테스트 코드의 갯수는 80개 정도였다. 그러나 안정성을 강화하기 위해 80개에 더해져 155개의 테스트 코드를 작성하는 노력을 통해 Jacoco의 도입 전과 후의 변화를 확인할 수 있었다.

Jacoco를 사용하면 프로덕션 코드에서 어떤 부분이 아직 테스트되지 않았는지를 확인하는 보고서를 통해 시각적으로 파악할 수 있어, 추가로 어떤 부분에 테스트 코드를 작성해야 하는지 정확히 인지할 수 있었다.

현재 테스트를 실행하는 데 걸리는 시간이 0.76초 정도이지만, 이를 더 개선하기 위한 방법에 대한 모색을 고려하고 있다.

또한, 코드 커버리지가 100%라고 해도 모든 부분을 완벽하게 커버하지는 못한다는 사실을 감안하면서도, 테스트 코드 작성이 프로덕션 코드 검증에 효과가 있다는 사실을 강조하고 싶다.

테스트 코드 작성은 버그를 방지하고 코드 품질을 향상시키는 데 기여하는 중요한 과정이라고 생각한다.

## Reference

* [SLASH21 - 테스트 커버리지 100%](https://toss.im/slash-21/sessions/1-6)

* [우아한 기술블로그 - Gradle 프로젝트에 JaCoCo 설정하기](https://techblog.woowahan.com/2661/)

* [[Tecoble] 코드 커버리지(Code Coverage)가 뭔가요?](https://tecoble.techcourse.co.kr/post/2020-10-24-code-coverage/)

* [달록의 Jacoco 적용기 (feat. Gradle)](https://hudi.blog/dallog-jacoco/)

* [Jacoco (Java Code Coverage Library)](https://www.jacoco.org/jacoco/)

* [Gradle 공식문서 - JacocoReport](https://docs.gradle.org/current/dsl/org.gradle.testing.jacoco.tasks.JacocoReport.html)

* [Gradle 공식문서 - JacocoCoverageVerification ](https://docs.gradle.org/current/dsl/org.gradle.testing.jacoco.tasks.JacocoCoverageVerification.html)