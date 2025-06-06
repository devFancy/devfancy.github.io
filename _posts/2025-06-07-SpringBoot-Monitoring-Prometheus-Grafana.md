---
layout: post
title:  " 3편. Prometheus와 Grafana로 Spring Boot 모니터링 대시보드 구축하기 "
categories: [SpringBoot, Technology]
author: devFancy
---
* content
{:toc}

## 1. Prologue

이번 포스팅에서는 제가 성능 테스트와 시스템 운영 환경에서 어떤 지표를 주시해야 하는지, 그리고 Spring Boot 환경에서 Prometheus와 Grafana를 활용해 직접 모니터링 환경을 구축한 경험을 공유하고자 합니다.

이전 포스팅이었던 “[2편. Spring Boot 요청 흐름 추적: Logging Filter와 traceId 적용기](https://devfancy.github.io/SpringBoot-Logging-Filter/)” 이어, 이번 글에서는 3편을 작성해보고자 합니다.

이 글은 제가 쌓아온 경험을 바탕으로 한 하나의 접근법이며, 정답이라기보다는 여러분이 각자의 상황에 맞는 최적의 방법을 찾아가는 데 도움이 되기를 바라는 마음으로 작성했습니다.

성능 테스트나 Prometheus, Grafana에 대한 기본적인 개념을 알고 계신다면 이 글을 수월하게 읽으실 수 있을 겁니다.


---

### 예상 독자

이 글은 아래에 해당하는 분들께 도움이 될 것입니다.

* 성능 테스트 시 어떤 지표를 봐야 할지 막막하신 분

* Prometheus가 수집하는 핵심 지표의 의미가 궁금하신 분

* Spring Boot 애플리케이션의 지표를 Grafana 대시보드로 직접 만들어보고 싶으신 분

> `참고`: 본 글에서 소개되는 코드 예시는 현재 시점의 구현을 바탕으로 작성되었으며, 프로젝트가 발전함에 따라 내용이 변경되거나 개선될 수 있음을 미리 알려드립니다.
> 
> 이 글에서 다루는 모든 코드는 [깃허브](https://github.com/devFancy/springboot-coupon-system)에서 확인하실 수 있습니다.

그럼 제가 어떤 과정을 거쳤는지 차근차근 보여드리겠습니다.

---

## 2. 핵심 성능 지표와 Prometheus 원시 데이터 이해하기

제가 생각하는 좋은 대시보드를 만들기 전에, 먼저 어떤 핵심 성능 지표를 주시해야 하는지,
그리고 이를 계산하기 위한 Prometheus의 원시 데이터(Raw Metrics)가 무엇인지 정리해 보았습니다.

저는 주로 다음 5가지 핵심 영역에 집중합니다.

### 처리량(TPS) 및 에러율 지표

> 얼마나 많은 요청을, 얼마나 안정적으로 처리하는가?

* 필요한 원시 지표: `http_server_requests_seconds_count`

* 타입: Counter (누적 계수기)

* 의미: HTTP 요청이 발생할 때마다 1씩 증가하는 누적 카운터입니다.
  `uri`, `method`, `status` 등 다양한 레이블을 통해 요청을 세분화할 수 있습니다.
  이 단일 지표와 `rate()` 함수를 통해 초당 처리량(TPS)과 에러율을 모두 계산합니다.

### 응답 시간(Latency) 지표

> 요청 하나를 처리하는 데 시간이 얼마나 걸리는가?

* 필요한 원시 지표: `http_server_requests_seconds_sum`

* 타입: Counter

* 의미: 각 HTTP 요청의 처리 시간을 초(seconds) 단위로 모두 합산한 누적값입니다. 바로 위 `_count` 지표와 함께 **평균 응답 시간**을 계산하는 데 필수적입니다.

### CPU 사용량 지표

> 애플리케이션이 시스템의 CPU를 얼마나 사용하는가?

* 필요한 원시 지표: `process_cpu_usage`

* 타입: Gauge (현재 상태 값)

* 의미: 해당 JVM 프로세스가 최근 사용한 CPU 시간의 비율(0.0 ~ 1.0)입니다. 시스템 전체 CPU 자원 중 **얼마나 점유했는지**를 나타냅니다.

### JVM 메모리 사용량 지표

> 애플리케이션의 메모리 상태는 건강한가?

* 필요한 원시 지표:
  * `jvm_memory_used_bytes`: 실제 사용 중인 힙 메모리
  * `jvm_memory_max_bytes`: 설정된 최대 힙 메모리

* 타입: Gauge

* 의미: 이 두 지표를 통해 현재 메모리 사용량과 최대치 대비 사용률을 파악하여 **메모리 누수나 부족 현상**을 감지합니다.

이 외에도 `jvm_threads_...` (스레드 상태), `jvm_gc_pause_seconds_...` (GC 성능) 등의 지표도 중요하며, GitHub의 대시보드 JSON(coupon-prometheus-dashboard.json, coupon-kafka-dashboard.json) 파일에서 제가 활용한 더 다양한 지표를 확인하실 수 있습니다.


## 3. Grafana 대시보드 구성

이제 2장에서 다룬 원시 지표들을 조합하여, 제가 개인프로젝트에서 실제로 사용했던 `coupon-prometheus-dashboard.json`의 핵심 패널들을 어떻게 구성했는지 보여드리겠습니다.


### [Panel 1] TPS (req/s)

> 초당 얼마나 많은 요청을 처리하는지 보여주는 처리량 지표입니다.

* PromQL 쿼리:

    ```
    rate(http_server_requests_seconds_count{uri=~"/api/coupon/.*/issue/test"}[1m])
    ```

* 쿼리 설명: `http_server_requests_seconds_count` 카운터의 1분간 평균 초당 증가율을 계산하여 TPS를 구합니다.

### [Panel 2] Average Response Time (ms)

> 요청 1건을 처리하는 데 평균적으로 얼마나 걸리는지 보여주는 지연 시간 지표입니다.

* PromQL 쿼리:

    ```
    (rate(http_server_requests_seconds_sum{uri=~"/api/coupon/.*/issue/test"}[1m]) / rate(http_server_requests_seconds_count{uri=~"/api/coupon/.*/issue/test"}[1m])) * 1000
    ```

* 쿼리 설명: `(초당 총 소요 시간 / 초당 총 요청 수)` 공식을 이용해 1건당 평균 응답 시간(초)을 구하고, `1000`으로 밀리초(ms) 단위로 변환합니다.

### [Panel 3] 5xx Error Rate (%)

> 전체 요청 중 서버 측 오류가 얼마나 발생하는지 보여주는 안정성 지표입니다.

* PromQL 쿼리

  ```
  100 * sum(rate(http_server_requests_seconds_count{uri=~"/api/coupon/.*/issue/test", status=~"5.."}[1m])) by (job) / sum(rate(http_server_requests_seconds_count{uri=~"/api/coupon/.*/issue/test"}[1m])) by (job)
  ```

* 쿼리 설명: `(초당 에러 발생 수 / 초당 총 요청 수) * 100`으로 백분율(%) 에러율을 계산합니다.

### [Panel 5] App Server Process CPU Usage (%)

> 제 애플리케이션이 시스템의 CPU를 얼마나 점유하고 있는지 보여주는 리소스 지표입니다.

* PromQL 쿼리

  ```
  process_cpu_usage{instance="http://{server_ip}:{server_port}"} * 100
  ```

* 쿼리 설명: `process_cpu_usage` 값(0.0~1.0)에 `100`을 하여 백분율(%)로 변환합니다.

### [Panel 6] App Server JVM Heap Memory (MB)

> JVM 힙 메모리의 현재 상태를 파악하여 메모리 관련 문제를 진단하는 리소스 지표입니다.

* PromQL 쿼리 (Used Heap)

    ```
    sum without (id) (jvm_memory_used_bytes{area="heap", instance="http://{server_ip}:{server_port}"}) / (1024*1024)
    ```

* 쿼리 설명: `jvm_memory_used_bytes`를 MB 단위로 변환하여 현재 사용 중인 힙 메모리를 보여줍니다. 이 값을 최대 힙 메모리(`jvm_memory_max_bytes`)와 함께 그래프에 표시하면 상황을 직관적으로 파악하기 좋습니다.

> 참고: 제 대시보드에는 이 외에도 Redis 성능 지표 등도 포함되어 있습니다. 이는 애플리케이션의 주요 의존성을 함께 모니터링하는 좋은 습관이라 생각합니다. 전체 구성은 GitHub의 coupon-prometheus-dashboard.json 파일에서 확인하실 수 있습니다.
> 
> 해당 파일 위치: /support/monitoring/infra/grafana/dashboards/coupon


## 4. 실전. 쿠폰 시스템 모니터링 환경 구축하기

위의 이론을 바탕으로, 제가 '쿠폰 시스템'의 모니터링 환경을 어떻게 구축했는지 그 과정을 공유해 보겠습니다. 참고로 저는 Java 17, Spring Boot 3.x 버전을 기반으로 프로젝트 환경을 구성했습니다.

### 4.1 전체 아키텍처 한눈에 보기

[Spring Boot App] -> [Prometheus Scrapes] -> [Grafana Visualizes] -> [Developer]

(그림)

먼저 제가 구성한 모니터링 관련 디렉토리 구조는 다음과 같습니다.

```yaml
├── infra
│ ├── grafana
│ │ ├── dashboards # Grafana가 특정 대시보드(JSON)를 자동 로드
│ │ │ ├── coupon
│ │ │ │ ├── coupon-kafka-dashboard.json
│ │ │ │ └── coupon-prometheus-dashboard.json
│ │ │ └── dashboard.yml
│ │ └── datasources # Grafana가 Prometheus와 연결
│ │     └── datasource.yml
│ ├── k6 # 부하테스트시 사용할 스크립트 파일
│ │ ├── coupon-create-test.js
│ │ ├── coupon-health.js
│ │ └── coupon-issue-test.js
│ └── prometheus
│     └── prometheus.yml # Prometheus가 애플리케이션 서버의 메트릭 수집
└── src
    └── main
        └── resources
            └── monitoring.ym # Spring Boot가 메트릭 노출
```

### 4.2 Spring Boot 애플리케이션 설정

`monitoring` 모듈의 `build.gradle`에 다음 두 의존성을 추가하여 Actuator와 Prometheus 연동 기능을 활성화했습니다.

* `spring-boot-starter-actuator`

* `micrometer-registry-prometheus`

![](/assets/img/technology/technology-monitoring-build-gradle.png)

그리고 `monitoring.yml` 파일에서 Prometheus가 지표를 수집할 엔드포인트를 노출시켰습니다.

![](/assets/img/technology/technology-monitoring-yml.png)

### 4.3 Prometheus 서버 설정 및 연동

`prometheus.yml`에 제 애플리케이션들을 수집 대상으로 등록했습니다. 쿠폰 발급 요청을 비동기로 처리하기 위해 Kafka 컨슈머 애플리케이션도 함께 추가했습니다.

![](/assets/img/technology/technology-prometheus-yml.png)

* **참고:** 실제 운영 환경에서는 `targets`에 `['{server_ip}:{server_port}']`와 같이 서버의 실제 IP 주소를 기입해야 합니다. 이 글의 로컬 Docker 테스트 환경에서는 Prometheus 컨테이너가 호스트 머신에서 실행 중인 애플리케이션에 접근할 수 있도록 특별한 주소인 `host.docker.internal`을 사용했습니다.

Prometheus UI(`http://localhost:9090`)의 `Status > Targets` 메뉴에서 두 서비스가 `UP` 상태로 잘 연결되었는지 확인합니다.

![](/assets/img/technology/technology-prometheus-target-up.png)

### 4.4 Grafana 대시보드 만들기

`docker-compose.yml`의 `volumes` 설정을 통해 Grafana 컨테이너가 시작될 때 데이터소스와 대시보드를 자동으로 로드하도록 구성했습니다. 이를 통해 수동 설정의 번거로움을 줄일 수 있습니다.

![](/assets/img/technology/technology-docker-compose-yml-grafana.png)

제가 직접 작성한 대시보드 파일은 다음과 같습니다.

* `coupon-prometheus-dashboard.json`: 쿠폰 발급 API의 핵심 지표
  - 쿠폰 발급 API에 대한 TPS, 평균 응답 시간, 에러율, CPU 및 JVM 메모리 사용량 등 주요 지표

* `coupon-kafka-dashboard.json`: Kafka 컨슈머의 처리 관련 지표
  - 쿠폰 발급 API에 대한 컨슈머 처리량, 처리 시간, CPU 및 JVM 메모리 사용량 등 주요 지표

### 4.5 부하 테스트 및 결과 확인

사전에 docker-compose 를 이용하여 외부 도구를 모두 실행시켜줍니다.

* 명령어: docker compose up -d

그런 다음, 애플리케이션 2개(coupon-api, coupon-kafka-consumer) 를 실행시켜줍니다.

docker container와 애플리케이션이 모두 정상적으로 동작되면, localhost:3000으로 접속하면 Grafana 화면이 나오게 됩니다. (default - id/pw: admin)

이제 `k6`를 이용해 시스템에 부하를 주어 대시보드에 데이터가 잘 그려지는지 확인해 보겠습니다.

(k6 개념에 대해 잘모르겠다면, 공식 문서 및 “[부하테스트 - K6 도구 소개](https://devfancy.github.io/Spring-Performance-K6/)” 를 참고해 주시면 감사하겠습니다)

##### 1. 사전 데이터 생성

부하 테스트에 사용할 쿠폰을 미리 생성합니다.

참고로, 부하 테스트의 요청 수보다 발급할 쿠폰 총 수량값이 커야 4xx 에러 없이 성공률 100%를 확인할 수 있습니다.

* coupon-create-test.js 내의 `totalQuantity` 가 발급할 쿠폰 총 수량을 의미합니다.

* 명령어: k6 run --out influxdb=http://localhost:8086/k6 coupon-create-test.js

![](/assets/img/technology/technology-k6-coupon-create-test-js.png)

##### 2. 부하 테스트 실행

생성된 쿠폰 ID를 `coupon-issue-test.js` 파일에 넣고, 스크립트를 실행합니다. 저는 가상 사용자 1000명이 10분간 부하를 주도록 설정했습니다.

해당 쿠폰 생성의 결과에서 생성된 쿠폰 ID를 가져와 coupon-issue-test.js 파일에서 아래와 같이 couponId 부분에 넣어준 뒤, 명령어를 입력합니다.

* `const couponId = '53dfea31-6baf-48c4-ba10-2a721edff20b'; // 쿠폰 ID`

* 명령어: k6 run --out influxdb=http://localhost:8086/k6 coupon-issue-test.js

![](/assets/img/technology/technology-k6-coupon-issue-test-js.png)

그러면 아래와 같이 coupon-api 와 coupon-kafka-consumer 애플리케이션으로부터 수집된 지표를 Grafana 대시보드(`http://localhost:3000`)에서 실시간으로 변화하는 지표들을 확인할 수 있습니다.

> 부하 테스트 중인 `coupon-api` 애플리케이션 대시보드 예시

![](/assets/img/technology/technology-grafana-coupon-api-dashboard.png)

> 부하 테스트 중인 `coupon-kafka-consumer` 애플리케이션 대시보드 예시

![](/assets/img/technology/technology-grafana-coupon-kafka-consumer-dashboard.png)


## 5. 성능 분석 노하우 및 결론

제가 경험을 통해 얻은 성능 분석 노하우 몇 가지를 정리하며 글을 마무리하려 합니다.

* 종합적 판단: 단일 지표가 아닌 여러 지표를 연관 지어 종합적으로 판단하려고 노력합니다.

* 추이 분석: 순간의 값보다는 시간 흐름에 따른 변화 추이를 통해 문제의 패턴을 읽습니다.

* 기준선 설정: 부하 테스트 전후의 기준선(Baseline)을 설정하고 변화를 비교 분석하는 것이 중요합니다.

* 자동화: 주요 지표에 임계치를 설정하고 알림 시스템을 활용하여 선제적으로 대응합니다.


## Summery

이번 포스팅에서는 Prometheus와 Grafana를 중심으로 **애플리케이션 관점**의 지표를 살펴보고 모니터링 환경을 직접 구축한 경험을 공유했습니다. 이로써 제 애플리케이션 내부에서 무슨 일이 일어나는지 손금 보듯 들여다볼 수 있게 되었습니다.

하지만 이것이 이야기의 전부는 아닙니다. 예를 들어, 은행 간 송금 API가 지연된다는 알림을 받았지만 Grafana의 CPU와 JVM 메모리 지표는 너무나 평온했던 경우가 있기도 합니다. 이런 경우 저는 범인이 애플리케이션 너머, 즉 **시스템 레벨**에 숨어있다고 의심합니다.

이처럼 애플리케이션 지표만으로는 해결되지 않는 문제의 병목을 찾는 이야기는, 향후 다른 포스팅에서 다루어보고자 합니다.

지금까지 읽어주셔서 감사합니다.


## References

* [공식문서 - Prometheus](https://prometheus.io/docs/introduction/overview/)
  * [공식문서 - prometheus 지표수집](https://prometheus.github.io/client_java/getting-started/metric-types/#counter)

* [공식문서 - Grafana](https://grafana.com/docs/grafana/latest/)
  * [grafana - datasource](https://grafana.com/docs/grafana/latest/datasources/)
  * [grafana - dashboard](https://grafana.com/docs/grafana/latest/dashboards/)

* [공식문서 - K6](https://grafana.com/docs/k6/latest/)

* [성능 개념 및 주요 병목 지점, 성능 테스트 학습](https://devfancy.github.io/Performance-Concept/)

* [부하테스트 - K6 도구 소개](https://devfancy.github.io/Spring-Performance-K6/)
