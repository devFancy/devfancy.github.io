# devfancy.github.io 개편 지시서 v3

Jekyll 블로그를 Astro로 전면 이관하기 위한 작업 지시서다.
저장소 루트에 두고, Claude Code 세션 시작 시 전체를 읽힌 뒤 작업한다.

- v1 작성: 2026-09-20
- v2 갱신: 2026-09-20 (Phase 0 조사 결과 반영)
- v3 갱신: 2026-09-20 (수식/이미지/URL 항목 실측 정정, 브랜치 전략 복원)
- v4 갱신: 2026-09-20 (Phase 1 완료. URL 스냅샷 확정, `/2026-DevHistory/` 미결 해소, 빌드 로케일·css 충돌 신규 기재)
- v5 갱신: 2026-09-20 (Phase 2 완료. 카드 시안 A 확정, Hero 배경 이미지 채용, Recommend 이관 확정, 목차 파리티 기재)
- v6 갱신: 2026-09-20 (검색을 `/category/` 안으로, 이메일 노출 허용, 헤더 네비 3개 확정, `/about/` 선행 구현 기록)
- v7 갱신: 2026-09-20 (파비콘 신설, 태그 칩 형태 확정, 목차 접기 항목 추가)
- v8 갱신: 2026-09-20 (카테고리 34개 → 9개로 재편, 기존 이름은 태그로 이전)
- v9 갱신: 2026-09-20 (카테고리를 2단 계층으로. 기술 아래 서버·알고리즘·CS·프로젝트·도구)
- 대상 저장소: `devfancy.github.io` (GitHub Pages user site, 퍼블릭)

---

## 0. 이 문서 사용법

1. 저장소 루트에서 Claude Code를 실행한다
2. 첫 지시: `MIGRATION.md 를 읽고 Phase 2를 수행해라.` (Phase 0·1은 완료됨)
3. 각 Phase가 끝나면 사람의 승인을 받고 다음으로 넘어간다
4. 확정 내용이 바뀌면 이 문서를 먼저 고치고 코드를 고친다

### 진행 현황

| Phase | 상태 | 산출물 |
|---|---|---|
| Phase 0. 현황 파악 | **완료** | `_migration/PHASE0.md` |
| Phase 1. URL 스냅샷 | **완료** | `_migration/urls-before.txt` (1648 URL) |
| Phase 2. 스캐폴딩 + 파일럿 | **완료** | `feat/astro-01-scaffold` |
| Phase 3. 전체 변환 | 대기 | |
| Phase 4. URL 검증 | 대기 | `_migration/urls-after.txt`, diff 리포트 |
| Phase 5. 배포 | 대기 | |

---

## 1. 목적

Jekyll 탈출 자체가 목적이 아니다.
남의 테마(HyG H2O)에 통째로 올라타 있어서 손대기 어려운 상태를,
읽고 고칠 수 있는 코드로 소유권을 가져오는 것이 목적이다.

작성자는 백엔드 개발자이고 프론트엔드 프레임워크 경험은 적다.
추상화가 적고 표준 HTML/CSS에 가까운 구조를 선호한다.

---

## 2. Phase 0 조사 결과 (확정 사실)

상세 근거는 `_migration/PHASE0.md`에 있다.

### 2-1. 규모

| 항목 | 값 |
|---|---|
| 글 수 | **319편** |
| 카테고리 배정 합계 | 327 (8편이 2개 카테고리) |
| 카테고리 | 원시 문자열 45종 -> 정규화 시 **34개** |
| 목록 페이지 | 64 (`paginate: 5`) |
| 이미지 참조 | 1171건 |
| 이미지 보유 글 | 189 / 319 = **59.2%** |
| `assets/img` | **586MB / 1238개 파일** (v4 정정. png 1174, jpg 43, JPG 8, jpeg 12, gif 1) |

상위 카테고리: Algorithm 70, Technology 22, Side_Project 20, SpringBoot 17, Spring 15, OS 14, JPA 13, Electronic-Finance 13, Business-Statistics 13, Java 10

### 2-2. URL 규칙 (가장 중요)

```yaml
permalink: /:title/     # 날짜 없는 플랫 슬러그, 후행 슬래시
url: ""
baseurl: ""
```

Jekyll이 `/slug/index.html`을 생성한다. Astro 설정은 이것으로 확정한다.

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://devfancy.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },  // 기본값
});
```

**슬러그는 대소문자를 보존한다.** `/Algorithm-Baekjoon-24479/`, `/BS-Analysis-Of-Variance/`처럼 대문자가 섞인 URL이 실재하므로 소문자화하면 전부 깨진다.

### 2-3. 변환 난이도: 예상보다 훨씬 낮음

| 패턴 | 건수 |
|---|---|
| kramdown 전용 문법 (`{: .class}`, 각주, 테이블 정렬) | **0건** |
| `{% highlight %}` | 0건 |
| `{% raw %}` | 2개 파일 |
| `{{ site.* }}` | 3개 파일 |
| 날 HTML | 4개 파일 (`<br>` 1, `<img>` 4) |

Astro는 `.md`에서 `{}`를 해석하지 않는다 (`.mdx`만 해석). 따라서 빌드 에러는 나지 않고 문자 그대로 출력되므로, 변환 스크립트에서 문자열 제거만 하면 된다.

대상 파일:

- `2023-10-23-Algorithm-Summary.md`: `{{site.url}}` 약 40건 (내부 링크). `site.url`이 빈 값이라 제거만 하면 `/Programmers-150370/`로 동작
- `2023-02-17-Network-Load-Balancing.md`: `{{site.url}}` 1건
- `2023-02-10-ETC-Liquid-syntax-error.md`, `2023-02-10-Programmers-64065.md`: `{% raw %}` (본문이 Liquid 이스케이프를 설명하는 글이므로 결과가 깨지지 않게 주의)
- `2023-02-04-Technology-utterances.md`: HTML 주석 안의 Disqus 스니펫
- `2025-12-12-...circuit-breaker.md`: 코드블록 안 로그의 `{{traceId}}` (건드리지 말 것)

`page/3about.md`의 `{:toc}` 1건이 저장소 전체에서 유일한 kramdown 전용 문법이다. `_posts`에는 없다.

### 2-4. 프론트매터 현황

| 키 | 빈도 |
|---|---|
| `title` | 319 |
| `layout` | 319 |
| `categories` | 319 |
| `author` | 319 |
| `use_math` | 21 |

- **`date` 필드가 없다.** 파일명 `YYYY-MM-DD-` 에서 파생하며, 319개 전부 형식을 지킨다
- **`tags` 필드가 아예 없다.** 태그 데이터가 존재하지 않는다
- `author`는 `devFancy` 184 / `devfancy` 135로 갈려 있다. 어차피 제거하므로 정규화하지 않는다

`categories` 표기가 **4가지**로 혼재한다. 변환 시 정규화한다.

```
Algorithm                    # bare
[Kafka] / [Technology]       # YAML 배열
[ Technology ] / [ Essay ]   # 공백 포함 배열
Side_Project SpringBoot      # 공백 구분 다중값 (8편)
```

### 2-5. 수식 현황 (v3에서 추가 조사)

| 항목 | 값 |
|---|---|
| `use_math: true` | 21편 |
| 인라인 수식 `$...$` | 434건 |
| 블록 수식 `$$...$$` | 1건 |
| `\begin{}` 환경 | **0건** |
| KaTeX 미지원 명령 | **0건** |

빈출 명령: `\frac` 97, `\sigma` 56, `\mu` 40, `\cap` 39, `\pi` 35, `\bar` 30, `\sqrt` 30, `\alpha` 29, `\lambda` 23, `\over` 19, `\sum` 17.

MathJax 설정의 `equationNumbers: { autoNumber: "AMS" }`는 `\begin{}` 환경이 0건이라 실제로 동작한 적이 없다. **KaTeX 전환은 안전하다.**

### 2-6. 기타 현황

| 항목 | 상태 |
|---|---|
| 커스텀 플러그인 | 없음 (`_plugins` 디렉터리 부재) |
| Jekyll 플러그인 | `jekyll-feed`, `jekyll-paginate` |
| RSS | `/feed.xml`. 루트의 수동 Liquid 템플릿, 최근 30편. jekyll-feed와 중복 |
| 댓글 | 미사용 (Disqus 주석 처리, utterances 전체 주석) |
| GA4 | `G-7BMWW1711K` (gtag.js) |
| Universal Analytics | `analytics.js` 동시 삽입. 서비스 종료된 죽은 코드 |
| AdSense | `ca-pub-1091577586291045` + 루트 `ads.txt` |
| 조회수 스크립트 | `js/pageCounting.js` 전량 주석 처리된 죽은 코드 |
| 외부 CDN | `cdn.bootcss.com` (font-awesome), `at.alicdn.com` (아이콘) |
| Similar Posts | `post.html`에 있으나 `page.tags` 기반이라 실제로 렌더링되지 않음 |
| 이미지 경로 | 절대 `/assets/...` 1167건 (99.7%), 외부 URL 3, 상대/빈 값 1 |
| `_site` | ~~2026-02-09 빌드~~ **Phase 1에서 삭제·재빌드 완료.** `/2025-Retrospective/` 잔재 사라짐 |
| 빌드 로케일 | **셸 `LANG`이 `en_KR.UTF-8`. 존재하지 않는 로케일이라 Ruby가 `US-ASCII`로 폴백해 빌드가 죽는다** (2-7) |
| `css/main.css` 충돌 | **`css/main.scss`와 체크인된 `css/main.css`가 같은 URL을 만들고, 정적 파일이 이긴다. `_sass`는 죽은 코드** |

### 2-7. 빌드 로케일 (v4에서 추가)

`bundle exec jekyll build`가 다음으로 죽는다.

```
Encoding::UndefinedConversionError: "\xE1" from ASCII-8BIT to UTF-8
  jekyll/url.rb:161:in `unescape_path'
  jekyll/static_file.rb:59:in `destination'
```

셸의 `LANG`이 `en_KR.UTF-8`인데 이런 로케일은 존재하지 않는다. 그래서 Ruby가
`Encoding.default_external`을 `US-ASCII`로 폴백하고, 경로에 비ASCII 바이트가
하나라도 있으면 변환에 실패한다. **저장소 문제가 아니라 머신 환경 문제다.**

```bash
export LC_ALL=en_US.UTF-8
bundle exec jekyll build --trace
```

Jekyll을 부르는 모든 명령에 위 환경변수를 준다. 근본 해결은 셸 프로파일의
`LANG`을 `en_US.UTF-8`이나 `ko_KR.UTF-8`로 고치는 것이며, 이건 사람이 결정한다.

---

## 3. 확정 스택

변경하지 말 것. 3축(유지보수성 / 확장성 / 안정성)으로 비교 검토를 마쳤다.

| 레이어 | 선택 |
|---|---|
| 프레임워크 | Astro 7.x |
| 언어 | TypeScript (strict) |
| 콘텐츠 | Content Layer API + glob loader + Zod 스키마 |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 검색 | 빌드 타임 JSON 인덱스 + 정규화 부분 문자열 매칭 (외부 라이브러리 없음) |
| 수식 | `remark-math` + `rehype-katex` |
| RSS | `@astrojs/rss` |
| Sitemap | `@astrojs/sitemap` |
| 린트/포맷 | Biome |
| 패키지 매니저 | npm |
| 배포 | GitHub Actions -> GitHub Pages |

### 3-0. 선행 조건 (Phase 2 착수 전 필수)

**현재 로컬 Node는 `v20.20.1`이고 Astro 7은 22.12 이상을 요구한다. 지금 이대로는 스캐폴딩이 불가하다.**

| 항목 | 값 |
|---|---|
| 필요 버전 | Node 22.12 이상 |
| 버전 고정 파일 | **`.nvmrc`에 `22` 한 줄.** `.node-version`은 만들지 않는다 |
| GitHub Actions | `actions/setup-node`의 `node-version-file: .nvmrc` |

Phase 2 첫 작업은 `node -v` 확인이다. 22.12 미만이면 거기서 멈추고 사람에게 업그레이드를 요청한다.

### 3-1. 의존성 목표

v1의 "런타임 의존성 3개"는 부정확한 목표였다. 다음으로 대체한다.

| 목표 | 값 |
|---|---|
| **런타임 JS 의존성** | **0개** (아일랜드는 순수 브라우저 JS) |
| 빌드 타임 의존성 | 6개 이내 |

**폰트는 self-host 한다** (v6). Pretendard variable 을 한글+라틴으로 서브셋해 `public/fonts/` 에 둔다
(2.06MB -> 1.77MB). 4-6이 외부 CDN 을 걷어내기로 했으므로 jsDelivr 등을 쓰지 않는다.
`font-display: swap` 이라 폰트 로드 전에도 시스템 폰트로 읽힌다. 더 줄이려면 Pretendard 공식
dynamic subset(unicode-range 분할, 페이지당 100~200KB)을 vendoring 해야 하며 파일이 수백 개가 된다.

Phase 2 실측: 런타임 JS **0개** 달성(`dist`에 `.js` 파일 없음). 빌드 타임은 9개로 목표를 넘었다.
`astro`, `@astrojs/rss`, `@astrojs/sitemap`, `@astrojs/markdown-remark`, `@tailwindcss/vite`,
`tailwindcss`, `remark-math`, `rehype-katex`, `katex`. 이 중 `@astrojs/markdown-remark`는
Astro 7의 프로세서 교체로 새로 필요해진 것이다(8-2-1). 3절이 확정한 스택을 그대로 구현한
결과이므로 "6개 이내" 목표 쪽을 실측에 맞춰 **9개 이내로 정정한다.**

`remark-math`와 `rehype-katex`는 빌드 타임 마크다운 플러그인이며 **런타임 JS를 0바이트 추가한다.** 다만 KaTeX CSS(약 23KB gzip)와 woff2 폰트 20여 개가 정적 자산으로 들어간다. 수식이 있는 페이지에서만 로드되도록 `use_math` 기준으로 CSS를 조건부 삽입한다. 현재 쓰는 MathJax CDN이 런타임에 훨씬 무겁다.

### 3-2. 선택 근거 (요약)

- **Gatsby 제외**: Netlify 인수 이후 활발한 개발 중단. 참고 블로그(wormwlrm)가 Gatsby 4.24.5를 쓰지만 디자인만 참고한다
- **Next.js 제외**: GitHub Pages는 정적 파일만 서빙하므로 `output: 'export'`가 강제되고 SSR / ISR / 서버 액션 / API Routes / `next/image` 최적화가 전부 불가하다. React 런타임 비용과 20개 규모 의존성만 남는다
- **Hugo 차점**: 의존성 0, 안정성 최고. 다만 프론트매터 스키마 검증이 없어 319편 이관 시 깨진 글을 눈으로 찾아야 하고, 인터랙티브 UI를 Go 템플릿 + 바닐라 JS로 짜야 한다
- **Astro 채택**: Zod 스키마로 빌드 타임에 프론트매터 오류를 파일명과 함께 잡아준다. 인터랙티브 요소만 아일랜드로 격리한다. 2026년 1월 Cloudflare 합류로 자금과 인력이 안정됐고 MIT 오픈소스 유지를 명시했다

### 3-3. Pagefind를 쓰지 않는 이유

한국어는 교착어라 조사와 어미가 단어에 붙는다. 단어 경계 색인 방식에서는 "러스트는", "러스트를", "러스트가"가 서로 다른 항으로 들어가고 "러스트" 질의가 그중 아무것도 매칭하지 못한다. 319편 규모에서는 제목 + 카테고리 인덱스에 부분 문자열 매칭이면 충분하다.

### 3-4. Tailwind v4 사용 규칙 (필수)

Tailwind를 토큰 위에 얹힌 얇은 층으로만 쓴다.

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-bg: #ffffff;
  --color-fg: #1a1a1a;
  --color-accent: #2a78d6;
}

:root[data-theme="dark"] {
  --color-bg: #14161a;
  --color-fg: #e8e8e6;
}
```

| 규칙 | 이유 |
|---|---|
| 색은 `@theme` 토큰으로만 정의. `bg-zinc-900` 같은 팔레트 클래스 직접 사용 금지 | Tailwind를 걷어내도 토큰이 살아남음 |
| 다크모드는 `dark:` 접두사 대신 `data-theme` 토큰 재정의 | 컴포넌트마다 반복 방지 |
| 3회 이상 반복되는 클래스 뭉치는 컴포넌트로 추출 | HTML 클래스 누적 차단 |

Tailwind v3는 쓰지 않는다. 마지막 기능 릴리스가 2023년 12월(v3.4)이고 어차피 v4 마이그레이션을 나중에 해야 한다.

---

## 4. 확정된 결정 사항

### 4-1. URL

| 항목 | 결정 |
|---|---|
| 도메인 | `devfancy.github.io` 유지 |
| 개별 글 URL | **전부 1:1 보존** (대소문자 포함) |
| `trailingSlash` | `'always'` |
| `build.format` | `'directory'` |
| `/page2` ~ `/page64` | 버린다 |
| `/archive/`, `/category/`, `/search/`, `/about/` | 유지 |
| `/category/#Kafka` 앵커 | 유지. `/category/`에 `id="Kafka"` 형태 앵커를 그대로 둔다 |
| `/category/:slug/` | 신규 추가 (순증) |
| `/solutions/` | 신규 추가 (목록 페이지만) |
| `/feed.xml` | 유지. 단일 소스로 통합 |
| `/resume` | 신규 추가 (2차) |

#### 의도된 URL 변경 (v3에서 신설)

아래 4건은 **의도적으로 바뀌며, 글 URL이 아니므로 허용한다.** Phase 4 diff에서 "누락"으로 잡히지만 수정 대상이 아니다. 대신 후속 조치가 필요하다.

| 기존 | 변경 후 | 후속 조치 |
|---|---|---|
| `/sitemap.xml` | `/sitemap-index.xml` + `/sitemap-0.xml` | `robots.txt`를 새 주소로 고치고 **Search Console에 사이트맵 재등록** |
| `/search.json` | `/search-index.json` | 외부 참조 없음. 내부 검색만 사용 |
| `/page2` ~ `/page64` | 없음 | 무한 스크롤/전체 그리드로 대체. 색인 가치가 낮다 |
| `/search/` | 없음. 기능은 `/category/` 안으로 | **v6에서 신설.** 근거는 4-4-2 |

`robots.txt`는 지금 `http://devFancy.github.io/sitemap.xml`로 되어 있다. 프로토콜(http -> https), 대소문자, 경로 세 가지를 모두 고친다.

`@astrojs/sitemap`의 출력 파일명을 억지로 `/sitemap.xml`로 되돌리지 않는다. 표준 동작을 따르고 Search Console을 한 번 갱신하는 편이 싸다.

#### 4-2-1. 카테고리 재편 (v8에서 신설)

34종은 방문자가 훑기에 너무 많다. 9개로 묶고 **기존 이름을 태그로 내린다.**
`tags` 는 부록 A 에 이미 예약돼 있어 스키마 변경이 없다.

**2단 계층이다** (v9). 위는 성격을 가르고, 아래는 실제로 훑는 단위다.

| 상위 | 하위 | 편수 | 묶은 것 |
|---|---|---|---|
| **기술** (261) | 서버 | 95 | SpringBoot, Spring, JPA, Java, Kafka, GoodCode, AssertJ, Technology, Flyway, Linux |
| | 알고리즘 | 75 | Algorithm, AlgorithmSkill, LeetCode |
| | CS | 53 | OS, Network, HTTP, DataStructure, Database, SQL, MySQL |
| | 프로젝트 | 24 | Side_Project, Woowacourse |
| | 도구 | 14 | Git, IntelliJ |
| **대학교** | — | 31 | Business-Statistics, Probability-Statistics, Electronic-Finance |
| **기타** | — | 19 | E.T.C, Workout, Competition, Technology 중 블로그 운영 글 3편 |
| **회고** | — | 8 | Retrospective, DevHistory |
| **에세이** | — | 8 | Essay, Book |

**프론트매터에는 잎만 적는다.** `categories: ["서버"]` 이지 `["기술", "서버"]` 가 아니다.
부모를 같이 넣으면 카드마다 "기술" 칩이 붙는데, 261편(80%)에 붙는 칩은 정보가 없고
필터로도 거의 전체를 고르는 셈이 된다. 계층은 `src/config.ts` 의 `CATEGORY_GROUPS` 에
선언하고 `/category/` 가 그 순서대로 그룹을 그린다.

4개(개발/에세이/회고/기타)로 줄이는 안은 버렸다. "개발"에 300편 가까이 몰려
카테고리가 사실상 하나가 되기 때문이다.

**Technology 예외 3편**: `Technology-GitHub-Readme`, `Technology-Google-Research-Console-Verification`,
`Technology-utterances` 는 블로그 운영 글이라 기타로 보낸다. 변환 스크립트의 `CATEGORY_OVERRIDE` 에 있다.

**태그 표기**: 고유명사·제품명은 영문, 일반 개념은 한글로 적는다. 나중에 다국어를 넣을 때
한 번에 바꾸기 쉽도록 한글을 기본으로 둔다.

- 영문 — Spring, Spring Boot, JPA, Java, Kafka, AssertJ, SQL, MySQL, Flyway, HTTP, Git, IntelliJ, LeetCode
- 한글 — 알고리즘, 운영체제, 네트워크, 데이터베이스, 자료구조, 리눅스, 확률통계, 경영통계,
  전자금융, 사이드프로젝트, 우아한테크코스, 회고, 개발기록, 책, 에세이, 운동, 공모전, 기술,
  클린코드, 문제해결, 기타

**`/category/#Kafka` 앵커에 영향이 있다.** 4-1이 보존하기로 한 앵커인데 Kafka 가 태그로
내려가면 가리킬 카테고리가 없다. `/category/` 페이지에서 **태그도 같은 방식으로 필터링**되게 만들고
해시를 카테고리와 태그 양쪽에서 찾도록 한다 (4-4-2 와 함께 03-pages 에서 구현).

### 4-2. 콘텐츠 구조

| 항목 | 결정 |
|---|---|
| 카테고리 | **9개로 재편** (v8에서 변경. 4-2-1). 기존 34종은 태그로 내린다 |
| 문제풀이 75편 | 설정 배열로 분리. 프론트매터 변경 없음 |
| 분리 방식 | 메인과 `/posts`에서 제외, `/solutions/`에 모아 표시 |
| `/category/` | 34개 전부 표시 |
| `/archive/` | 전수 표시 |
| 개별 글 URL | 문제풀이도 기존 플랫 슬러그 유지 |

```ts
// src/config.ts
export const SOLUTION_CATEGORIES = ['Algorithm', 'AlgorithmSkill', 'LeetCode'] as const;
```

카테고리 표시 순서는 `_config.yml`의 `categories_order` 34개를 그대로 옮기지 않는다. 글 수 내림차순으로 자동 정렬해 수동 유지보수를 없앤다.

표시 규칙:

- 글 수 내림차순 정렬
- 글 수를 칩에 함께 표기
- 헤더 드롭다운에는 상위 8개 + "전체 보기"

### 4-3. 디자인

| 항목 | 결정 |
|---|---|
| Hero | 타이포 중심 + **배경 이미지** (v5에서 변경). 프로필 사진은 `/about/`으로 이동 |
| 슬로건 | `흔들리지 않고, 후회 없이 / My path, my pace, no regrets.` |
| 메인 구조 | 헤더 -> Hero -> 대표 포스트 -> 전체 포스트 그리드 -> 푸터 |
| 대표 포스트 | 테마 제목 + 수동 큐레이션 3개 (`curation.yml`) |
| 카드 썸네일 | **없음** |
| 카드 구성 | **카테고리 칩 + 제목 + 날짜** (태그 데이터 부재로 v1에서 변경) |
| 카드 한 줄 설명 | **넣지 않는다** (v5에서 시안 A 확정) |
| 카드 구성 순서 | **제목 -> 날짜 -> 카테고리 칩** (v5에서 확정) |
| OG 이미지 | 공통 1장 |
| 파비콘 | **검정 라운드 사각형 + 흰 펜촉** (v7에서 신설). SVG 우선, `favicon.ico` 폴백, `apple-touch-icon` 180px |
| 태그 칩 | **라운드 사각형**(알약 아님). 흰 배경 + 얇은 테두리 |
| 다크/라이트 | 토큰 재정의 방식 |
| 광고 | **제거** |

**썸네일 미채용 근거**: v1은 "319편에 이미지가 없다"고 썼으나 실제로는 59.2%가 이미지를 가진다. 결론은 유지하되 근거를 바꾼다. 본문 첫 이미지는 대표성이 없다. 알고리즘 글은 문제 스크린샷, 기술 글은 다이어그램이나 에러 로그 캡처이며, 40.8%는 여전히 폴백이 필요하다.

**파비콘 근거 (v7)**: 기존 `favicon.ico` 는 112KB 짜리 달 모양이었고, Astro 쪽에는 파비콘이
아예 없었다(`<link rel="icon">` 과 파일 모두 없음). 16px 탭에서 한글은 획이 뭉쳐 읽히지 않는다.
참고로 재그지그 파비콘도 한글 4글자인데 16px 에서는 파란 얼룩으로만 보인다. 형태가 남는 펜촉을
택했고, 글자가 필요한 큰 크기(`apple-touch-icon`)에서는 다르게 가도 된다.

**태그 처리**: `tags` 데이터가 없으므로 카드에서 태그를 빼고 카테고리 칩이 그 역할을 한다. 8편은 칩이 2개 붙는다. 스키마에는 `tags`를 빈 배열로 예약해 신규 글부터 쓸 수 있게 한다.

**Hero 배경 이미지 (v5에서 신설)**: v1~v4의 "배경 사진 없음"을 뒤집는다. 한강 야경 사진을
`src/assets/hero-hangang.jpg`에 두고 `astro:assets`로 반응형 WebP를 생성한다 (823KB -> 292KB).

| 항목 | 값 |
|---|---|
| `object-position` | **`center`.** 이 사진은 하늘이 중상단이라 `bottom`을 주면 하늘이 잘려 텍스트가 다리 위에 얹힌다 |
| 스크림 | `bg-black/45`. 야경이라도 하늘 밝기가 일정치 않아 대비를 고정한다 |
| 높이 | `min-h` 24rem / sm 32rem |
| 슬로건 | 영문이 위·큰 글씨, 한글이 아래·작은 글씨 |

프로필 사진은 Hero에 넣지 않는다. 배경 사진 + 프로필 + 슬로건이 겹치면 시선이 셋으로 갈린다.
4-5의 방침대로 `/about/`에 원형 프로필과 소셜 링크를 둔다.

### 4-4. 기능

| 항목 | 결정 |
|---|---|
| 검색 | 의존성 0. **`/category/` 페이지 안에 둔다** (v6에서 변경. 4-4-2) |
| 인기순 / 조회수 | 제외. `featured`, `featuredOrder` 필드만 예약 |
| 댓글 | 없음 |
| 통계 | GA4 `G-7BMWW1711K` 이식 |
| 수식 | `remark-math` + `rehype-katex`. **전역 적용** (4-4-1 참조) |
| 뉴스레터 | Stibee. 계정 없음. 컴포넌트 자리만 잡고 iframe 주소는 비워둔다 |
| 후원 | 기존 카카오페이 QR 이미지 재사용, 모달로 표시 |
| 메타 설명 | 본문 첫 문단 자동 추출. 화면 미표시, SEO 전용 |
| 목차 | **이관한다.** 기존 `{:toc}`가 319편 전부에 있다. h2/h3만, lg 이상에서 우측 sticky. **접기/펼치기는 03-pages에서** (4-4-4) |
| Recommend | **이관한다.** 카테고리가 겹치는 최신 글 최대 3개. 없으면 섹션을 그리지 않는다 |
| 소셜 링크 | GitHub / LinkedIn / Instagram. **인라인 SVG** (4-6의 CDN 제거와 짝) |

#### 4-4-1. 수식은 전역 적용된다 (v3에서 정정)

v1·v2는 `use_math: true` 21편만 수식을 처리한다고 썼다. **이 전제는 성립하지 않는다.**

`remark-math`는 `astro.config.mjs`의 `markdown.remarkPlugins`에 등록되며 **모든 `.md`에 적용된다.** 프론트매터로 글마다 켜고 끌 수 없다. Jekyll은 `{% if page.use_math %}`로 MathJax 스크립트 삽입 자체를 제어했지만 Astro에는 대응물이 없다.

결과:

- `use_math`가 없는 298편에서도 `$...$` 쌍이 수식으로 해석된다
- 금액 표기 `$100`처럼 `$`가 두 번 나오면 그 사이가 수식이 된다

실측 결과 **5개 파일 11건**이 깨진다. Phase 3 변환 스크립트에서 `\$`로 이스케이프한다.

| 파일 | 건수 | 예시 |
|---|---|---|
| `2022-04-25-EF-06-Digital-Money.md` | 6 | `$90이 남았고, Bob은 $100 을 예금하였고` |
| `2022-12-05-Git-Commit-Message.md` | 2 | `$location, $compile` |
| `2022-04-21-EF-The-Rise-Of-Fintech_2.md` | 1 | `$1,000 ~ $10,000` |
| `2023-02-20-DB-Transaction-Isolation-Level.md` | 1 | `$100을 ...` |
| `2023-08-31-Goodfriends-PR-Label-Jenkins-Build.md` | 1 | `$MERGED ...` |

**이스케이프하면 안 되는 파일 2개.** `use_math`가 빠졌지만 진짜 수식이 들어 있어, 전역 적용이 오히려 기존 버그를 고쳐준다.

| 파일 | 내용 |
|---|---|
| `2022-06-01-EF-07-Cryptography.md` | `$2^{256}$` |
| `2023-02-05-OS-19-TLB.md` | `$\alpha$` |

`use_math` 필드는 스키마에 남긴다. 수식 렌더링 제어용이 아니라 **KaTeX CSS/폰트를 조건부 로드하는 용도**로 재정의한다. 위 2개 파일에는 `use_math: true`를 추가한다 (총 23편).

Phase 3 완료 후 `$`가 포함된 전체 파일을 렌더링 결과로 재확인한다.

#### 4-4-2. 검색은 `/category/` 안에 둔다 (v6에서 신설)

독립 `/search/` 페이지와 헤더 모달을 두지 않는다. 카테고리를 고르면 같은 화면에서
글 수와 목록이 바로 갱신되고, 검색 입력도 그 자리에 있다. 화면 이동이 한 번 줄어든다.

| 항목 | 내용 |
|---|---|
| 구성 | 카테고리 칩(글 수 표기, 내림차순) + 검색 입력 + 결과 목록 |
| 동작 | 칩 선택과 검색어 입력 모두 그 자리에서 거른다. 페이지 이동 없음 |
| 앵커 | `/category/#Kafka` 를 읽어 초기 선택에 쓴다. 4-1이 보존하기로 한 앵커가 살아난다 |
| 의존성 | 외부 라이브러리 없음. 한국어는 공백 제거 후 부분 문자열 매칭 (3-3) |

**`/search/` 는 사라진다.** 판단 근거는 다음과 같다.

- 기존 `/search/` 는 `<input>` 과 `/search.json` 을 조회하는 스크립트뿐인 **UI 전용 페이지**다. 고유 콘텐츠가 없다
- 루트 `sitemap.xml` 템플릿은 `{% for post in site.posts %}` 하나뿐이라 **posts만** 담는다. `/search/` 는 색인 제출된 적이 없다
- 다만 헤더 네비에 있어 전 페이지에서 링크됐으므로 크롤링은 됐을 것이다

리다이렉트 스텁은 두지 않는다. GitHub Pages는 서버 리다이렉트가 불가해 `<meta http-equiv="refresh">`
파일이 영구히 남고, 301이 아니라 신호 전달도 약하다. 기능이 사라진 것이 아니라 자리를 옮긴 것이므로
4-1에 "의도된 변경"으로 적고 끝낸다.

#### 4-4-4. 목차 접기 (v7에서 신설, 03-pages에서 구현)

목차를 `>` / `<` 버튼으로 접고 펼 수 있게 한다. 펼치면 목차가 보이고, 접으면 본문만 남는다.
접힘 상태는 다음 글에서도 유지되도록 `localStorage` 에 남긴다.

#### 4-4-3. 헤더 네비게이션은 3개다 (v6에서 신설)

**Archives / Categories / About.** 기존 Jekyll은 `page/` 의 `type: page` 5개로 네비를 자동 생성했다.

| 기존 항목 | v6 처리 |
|---|---|
| Archives (`/archive/`) | 유지. **라벨은 `Archive` 가 아니라 `Archives`** |
| Categories (`/category/`) | 유지 |
| About (`/about/`) | 유지 |
| 2026 Dev (`/2026-DevHistory/`) | **뺀다.** `/2025-`, `/2024-`, `/2023-DevHistory/` 와 나란한 글 하나다. 매년 손봐야 하고 Archives·Categories로 도달 가능하다 |
| Search (`/search/`) | **뺀다.** 4-4-2 |

`/archive/` 는 **연도별로 묶고 최신순**으로 나열한다.

### 4-5. 이력서 (2차)

참고 구조: `https://wormwlrm.github.io/resume`

- 회사와 업무 중심. 개인 신상 최소화
- **이메일을 노출한다** (v6에서 변경). `mailto:` 링크로 GitHub / LinkedIn 과 함께 둔다
- **전화번호는 넣지 않는다.** 이력서에는 있으나 퍼블릭 저장소라 제외한다
- Instagram 은 넣지 않는다 (v6에서 제외)
- JSON 데이터 + Astro 컴포넌트 렌더링
- `@media print` 대응

| 섹션 | 내용 |
|---|---|
| 소개 | 이름, 연차, 커리어 요약, 추구하는 가치, 소셜 링크 |
| Careers | 회사명(링크), 직무, 기간, 총 근속, 회사 한 줄 설명 |
| 프로젝트 | 프로젝트명, 한 줄 설명, 기간, 기술 스택 태그, 요약, 성과 불릿 |
| Open Sources | 개인 프로젝트를 같은 구조로 |
| Activities | 연도별 외부 활동 |
| Educations | 학력 |

**핵심 패턴**: 성과 불릿에 관련 블로그 글을 링크한다. `postSlug` 필드를 두고 빌드 타임에 실재 여부를 검증한다.

### 4-6. 정리 대상 (Phase 2에서 일괄 제거)

| 대상 | 처리 |
|---|---|
| AdSense 스크립트 | 제거 |
| `ads.txt` | 삭제 |
| Universal Analytics `analytics.js` | 제거 (서비스 종료) |
| `js/pageCounting.js` | 제거 (전량 주석) |
| `cdn.bootcss.com` (font-awesome) | 제거. 필요한 아이콘만 인라인 SVG |
| `at.alicdn.com` (아이콘) | 제거. 인라인 SVG |
| 수동 `feed.xml` 템플릿 | 제거. `@astrojs/rss` 단일 생성 |
| 수동 `search.json` | 제거. 빌드 타임 `search-index.json`으로 대체 |
| `demo.html` 레이아웃 | 미사용. 이관 안 함 |
| Similar Posts (태그 기반) | 동작하지 않던 기능. 이관 안 함. **Recommend와 혼동하지 말 것** |
| `robots.txt` | `https://devfancy.github.io/sitemap-index.xml`로 정정 |
| `.gitignore` | Astro 기준 재작성. `dist/`, `.astro/` 추가, `*.xml` 규칙 제거 |
| `css/main.scss` + `_sass` | 이관 안 함. 정적 `css/main.css`에 덮여 렌더링에 쓰인 적이 없다 (2-6) |
| `page/1dev.html` | 이관 안 함. post에 밀려 출력된 적이 없다 (5) |

### 4-7. 기타 확정

| 항목 | 결정 | 근거 |
|---|---|---|
| 마크다운 포맷 | `.md`만. MDX 사용 안 함 | 글이 코드에 종속되면 다음 이사가 비싸진다 |
| 기존 이미지 | `public/assets/img/`에 복사, 경로·파일명 유지 | 319편 본문 무수정 |
| 이미지 압축 | **복사 시점에 수행** (Phase 3) | 별도 커밋으로 하면 저장소가 커진다. 8-3 참조 |
| 신규 글 이미지 | `astro:assets` 최적화 적용 | 하이브리드 |
| 컷오버 | 프리뷰 배포로 확인 후 교체 | |
| 기존 Jekyll 파일 | `jekyll-final` 태그 남기고 삭제 | git 히스토리에 남음 |
| Node | 22.12 이상. `.nvmrc`에 `22` 고정 | Astro 7 요구사항. 3-0 참조 |

---

## 5. 미결 항목

| 항목 | 선택지 | 결정 시점 |
|---|---|---|
| 이미지 압축 수준 | `pngquant` 품질 파라미터 | Phase 3 샘플 확인 후 |

**해소됨 — 카드는 시안 A로 간다.** 한 줄 설명을 넣지 않고 **제목 -> 날짜 -> 카테고리 칩**
순으로 쌓는다. 썸네일(대표 이미지)은 1차에서 넣지 않되 2차에 추가할 예정이므로,
스키마에 `thumbnail` 예약 필드를 두어 319편 재작업을 피한다.

**해소됨 — `/2026-DevHistory/` 충돌은 post가 이긴다.** `page/1dev.html`의
`permalink: /2026-DevHistory/`와 `_posts/2026-01-01-2026-DevHistory.md`가 같은 URL을
만들고, Jekyll이 충돌을 경고한 뒤 **post를 출력했다.** 생성된 `<title>`이 post 제목
`" 2026 Dev History "`와 앞뒤 공백까지 일치한다 (page 제목은 `2026 Dev`). Astro도
post 쪽으로 맞추고 `page/1dev.html`은 이관하지 않는다.

카드 한 줄 설명은 태그 데이터 부재로 **넣는 쪽이 유리해졌다.** 카테고리 칩과 제목만으로는 Algorithm 70편을 구분할 수 없다.

---

## 6. 작업 범위 분할

1차의 완료 조건은 "예쁘다"가 아니라 "안 깨졌다"이다.

| 영역 | 1차 (컷오버까지) | 2차 (컷오버 이후) |
|---|---|---|
| 콘텐츠 | 319편 이관, 글 URL 100% 보존 | |
| 페이지 | 메인, `/posts`, `/category/`, `/category/:slug/`, `/archive/`, `/search/`, `/about/`, `/solutions/` | `/resume` |
| 기능 | 검색, 다크모드, RSS, sitemap, GA4, 수식 | 뉴스레터, 후원 모달 |
| 디자인 | 카드 목록, 토큰 정의, 읽기 화면 | Hero 완성, 대표 포스트 섹션, 애니메이션 |
| 정리 | 광고/죽은 코드/외부 CDN 제거, 이미지 압축 | |
| 검증 | URL diff 0건(의도된 변경 제외), 모바일 375px | |

---

## 7. 브랜치 전략

### 7-1. 원칙

- `main`은 **컷오버 전까지 라이브 Jekyll 사이트**다. Astro 코드를 섞지 않는다.
- `feat/astro`를 장수 통합 브랜치로 두고, 모든 Astro 작업을 그 위에 쌓는다.
- 문서·검증 산출물처럼 Jekyll 빌드에 영향이 없는 것만 `main`에 직접 PR한다.
- 검증 산출물은 `_migration/`에 둔다. 밑줄 시작 디렉터리라 Jekyll이 자동으로 무시한다. 루트에 두면 `_site`로 그대로 배포된다.

### 7-2. 구조

```
main  (라이브 Jekyll. Phase 5까지 Astro 코드 없음)
│
├── docs/migration-plan ─────────► main     MIGRATION.md + _migration/PHASE0.md
├── chore/url-baseline ─────────► main     _migration/urls-before.txt
│
└── feat/astro  (장수 통합 브랜치. Phase 5에서만 main으로)
    │
    ├── feat/astro-01-scaffold   Astro 골격, 토큰, 레이아웃, 파일럿 5편
    ├── feat/astro-02-content    변환 스크립트 + 319편 + 이미지 (01 위에 스택)
    ├── feat/astro-03-pages      목록/카테고리/아카이브/solutions (02 위)
    ├── feat/astro-04-search     검색 인덱스 + 모달 (03 위)
    └── feat/astro-05-deploy     GitHub Actions + RSS/sitemap (04 위)
```

### 7-3. Stacked PR 운용

**언제 쌓는가**: 아래 브랜치의 코드가 없으면 리뷰가 불가능할 때만.
`01-scaffold` 없이는 `02-content`를 읽을 수 없으므로 스택이 맞다.

**언제 쌓지 않는가**: 서로 파일이 겹치지 않고 독립적으로 이해되는 작업.

운용 규칙:

| 규칙 | 내용 |
|---|---|
| PR base | 각 PR의 base는 **바로 아래 브랜치**로 지정한다. `02-content`의 base는 `01-scaffold` |
| 머지 순서 | 아래부터 위로. `01` 머지 -> GitHub가 `02`의 base를 `feat/astro`로 자동 조정 |
| 리베이스 | 아래 브랜치가 수정되면 위 브랜치는 `git rebase --onto`로 따라 올린다 |
| PR 크기 | 리뷰 가능한 단위로 자른다. 319편 일괄 변환은 diff가 크므로 **스크립트 커밋과 생성물 커밋을 분리**한다 |
| 승인 게이트 | Phase 경계 = PR 경계. 승인 없이 다음 브랜치를 만들지 않는다 |

**스택 리베이스 예시**

```bash
# 01-scaffold에 리뷰 반영이 들어간 뒤
git checkout feat/astro-02-content
git rebase --onto feat/astro-01-scaffold <이전_01_HEAD> feat/astro-02-content
git push --force-with-lease
```

`--force-with-lease`를 쓴다. `--force`는 쓰지 않는다.

### 7-4. 커밋 규칙

- 커밋 메시지는 **제목 1줄**로 간결하게. 본문은 꼭 필요할 때만, 핵심만
- `feat:` / `fix:` / `chore:` / `docs:` 접두사
- 비슷한 성격의 작업은 묶는다. 과도하게 쪼개지 않는다
- 예외: **변환 스크립트와 그 대량 생성물은 별도 커밋** (diff 성격이 다르다)
- `Co-Authored-By` 트레일러를 넣지 않는다

---

## 8. Phase별 작업

Phase 0은 완료됐다. 각 Phase가 끝나면 멈추고 보고한다.

### Phase 0. 현황 파악 (읽기 전용) — 완료

결과는 `_migration/PHASE0.md`. 브랜치 `docs/migration-plan`.

### Phase 1. 기존 URL 스냅샷 — 완료

브랜치: `chore/url-baseline` (base `main`). 커밋 `6c11484`.

수행한 것:

- `_site`와 `.jekyll-cache`를 삭제하고 `LC_ALL=en_US.UTF-8 bundle exec jekyll build --trace`로 재빌드 (2-7)
- 전체 URL 목록을 정렬해 **`_migration/urls-before.txt`**로 커밋. **1648줄**
- `/2026-DevHistory/` 판정 완료

**스냅샷 구성 1648건**

| 구분 | 건수 |
|---|---|
| 글 (`_posts/*.md` 319편과 일치) | 319 |
| 고정 페이지 `/about/` `/archive/` `/category/` `/search/` | 4 |
| 페이지네이션 `/page2/` ~ `/page64/` | 63 |
| 루트 `/` | 1 |
| 정적 파일 (css · js · xml · txt · 소유권 인증 html) | 23 |
| 이미지 (png 1174 · jpg 43 · jpeg 12 · JPG 8 · gif 1) | 1238 |

이미지까지 전부 포함했다. 11절이 이미지 경로 변경을 금지하므로 Phase 4 diff가 이를 함께
검증한다. 삭제 전 `_site`에 있던 `/2025-Retrospective/`는 재빌드 후 사라져, 미커밋 초안
잔재라는 전제가 확인됐다.

**빌드가 경고한 destination 충돌 2건**

| 충돌 URL | 소스 | 출력된 쪽 |
|---|---|---|
| `/2026-DevHistory/` | `page/1dev.html` · `_posts/2026-01-01-2026-DevHistory.md` | **post** (5절) |
| `/css/main.css` | `css/main.scss` · `css/main.css` | **정적 `css/main.css`** (2-6) |

### Phase 2. 스캐폴딩 + 파일럿 5편 + 시안 비교 — 완료

브랜치: `feat/astro-01-scaffold` (base `feat/astro`)

- `main`은 건드리지 않는다. 기존 Jekyll 파일도 아직 지우지 않는다
- **`node -v`로 22.12 이상 확인. 미달이면 멈추고 사람에게 요청한다**
- `.nvmrc` 생성 (`22`)
- Astro 공식 blog 스타터 기준으로 구성
- **`site`, `trailingSlash: 'always'`, `build.format: 'directory'`를 가장 먼저 설정한다**
- Content Layer 스키마 정의 (부록 A)
- `remark-math` + `rehype-katex` 설정, KaTeX CSS 조건부 로드
- 4-6의 정리 대상 일괄 제거

파일럿 5편:

1. 코드 블록이 많은 글
2. 이미지가 많은 글
3. **`use_math: true` 글 1편** (수식 렌더링 확인)
4. **`$` 충돌이 있는 글 1편** (`2022-04-25-EF-06-Digital-Money.md`, 이스케이프 검증)
5. 가장 오래된 글

**시안 A/B**: 카드 목록을 두 벌 만든다.

- A: 카테고리 칩 + 제목 + 날짜
- B: A + 한 줄 설명

**결과: 시안 A 채택.** 비교 페이지(`/proto/`)와 `variant` prop은 결정 후 제거했다.

선정한 파일럿 5편 (데이터로 골랐다)

| 글 | 선정 근거 |
|---|---|
| `MySQL-DML-Practice-2` | 코드블록 최다 (40개) |
| `spring-boot-coupon-system-performance-improvement` | 이미지 최다 (43장) |
| `PS-02-Random-Variable` | 수식 최다 (`$` 160개), `use_math: true` |
| `EF-06-Digital-Money` | `$` 충돌 (지시서 지정) |
| `Linux-basic` | 최古 (2021-09-06) |

#### 8-2-1. Phase 2에서 드러난 함정 (v5에서 신설)

Astro 7과 Tailwind v4에서 지시서 작성 시점과 달라진 것들이다. Phase 3 이후에도 적용된다.

| 항목 | 내용 |
|---|---|
| 마크다운 프로세서 | Astro 7의 기본은 **Sätteri**다. `markdown.remarkPlugins`는 deprecated이며 `@astrojs/markdown-remark`를 설치하고 `processor: unified({...})`로 넘겨야 한다. Sätteri에 내장 math는 없으므로 확정 스택은 유지된다 |
| 슬러그 대소문자 | glob loader의 **기본 `generateId`가 소문자화한다.** 커스텀 `generateId`가 없으면 319편 URL이 전부 깨진다 (2-2) |
| Tailwind v4 문법 | `@theme` 토큰이 유틸리티를 자동 생성한다 (`--color-rule` -> `border-rule`). v3의 `border-[--color-rule]` 임의값 문법은 **조용히 무시된다** |
| 본문 타이포 | Preflight가 `h1~h6`를 `font-size:inherit`으로 리셋한다. `.prose` 규칙을 직접 쓰지 않으면 제목과 본문이 구분되지 않는다 |
| 표 가로 스크롤 | `<table>`에 `overflow-x:auto`만 주면 스크롤 컨테이너가 생기지 않는다. **`display:block`을 함께** 줘야 375px에서 페이지가 안 밀린다 (9-3) |
| 그리드 아이템 | `justify-self`를 쓰면 아이템 폭이 `max-content`가 되어 `minmax(0,1fr)` 트랙을 넘는다. `margin-*: auto`로 정렬한다 |
| Biome | `.astro` 템플릿을 읽지 못해 템플릿에서만 쓰는 변수를 미사용으로 오탐한다. **Biome는 `.ts`/`.mjs`, `.astro`와 타입은 `astro check`**로 나눈다. `biome migrate`가 `recommended: true`를 `preset: "none"`(전체 비활성)으로 바꾸므로 확인이 필요하다 |

#### 8-2-2. 범위를 넘어 먼저 만든 것 (v6에서 기록)

아래는 6절·8절 기준으로 `feat/astro-03-pages` 작업인데 Phase 2 브랜치에서 먼저 만들었다.
사진과 문구를 화면으로 확인하려면 페이지가 있어야 했기 때문이다. **문서보다 코드가 앞선 사례다.**

| 대상 | 상태 |
|---|---|
| `/about/` | 구현 완료. Hero 배경(파리) + 프로필 카드 + Who am I + Introduce |
| `/archive/`, `/category/` | **미구현.** 헤더에 링크만 있어 현재 404다. 03-pages 에서 해소한다 |

`/category/` 구현안(칩 + 검색 + 즉시 필터, 4-4-2)은 설계를 마쳤고 03-pages 에서 넣는다.

#### 8-2-3. 이미지 임시 서빙

`assets/img`는 Phase 3에서 복사한다. 그전까지 파일럿 확인용으로 dev 서버에서만
기존 경로를 서빙하는 Vite 플러그인(`legacyJekyllImages`)을 `astro.config.mjs`에 두었다.
**Phase 3에서 이 플러그인과 `vite.plugins` 등록을 함께 지운다.**

### Phase 3. 전체 변환 + 이미지 이관

브랜치: `feat/astro-02-content` (base `feat/astro-01-scaffold`)

변환 스크립트를 작성해 319편을 일괄 변환한다. 수작업 금지.

#### 8-3-1. 프론트매터 / 본문 처리

| 항목 | 규칙 |
|---|---|
| `date` | 파일명 `YYYY-MM-DD-`에서 파생 |
| `categories` | 4종 표기 정규화. 공백 구분 다중값(8편)은 배열로 분해 |
| `tags` | 빈 배열로 생성 |
| `layout`, `author` | 제거 (Astro 레이아웃이 대체) |
| `use_math` | 유지 + 2편 추가 (4-4-1). CSS 로드 제어용으로 의미 재정의 |
| `$` 이스케이프 | **5개 파일 11건을 `\$`로.** 대상은 4-4-1 표. 나머지 2개 파일은 건드리지 않는다 |
| `{{site.url}}` | 문자열 제거 |
| `{% raw %}` / `{% endraw %}` | 제거. 단 2편은 본문이 Liquid를 설명하는 글이므로 결과 확인 필수 |
| 코드블록 안 `{{traceId}}` | **건드리지 않는다** |
| 파일명 공백 1건 | `2022-05-04-PS-␣03-...`. 슬러그 생성 시 공백 제거해 `/PS-03-.../`로 Jekyll과 동일하게 |
| 날 HTML 4개 파일 | Astro 7 컴파일러 통과하는지 확인 |
| `* content` + `{:toc}` | **제거하되 기능은 대체한다.** 319편 전부에 있다. Astro는 목차 컴포넌트가 렌더 결과의 heading에서 만든다 (4-4) |
| 슬러그 대소문자 | **보존.** 소문자화 금지. 기본 `generateId`가 소문자화하므로 커스텀 필수 (8-2-1) |

Zod 스키마 검증 에러를 전부 해소한다. 변환 경고는 리포트로 남긴다.

#### 8-3-2. 이미지 이관 + 압축 (v3에서 Phase 1.5를 흡수)

**`assets/img` -> `public/assets/img` 복사 시점에 압축한다.** 별도 Phase로 분리하지 않는다.

이유: `main`에서 1238개 파일을 압축해 커밋하면 1238개 blob이 **새로** 생긴다. 기존 586MB는 히스토리에 그대로 남으므로 `clone` 크기가 줄기는커녕 900MB 규모로 **늘어난다.** 복사본에만 압축을 적용하면 신규 blob은 압축된 것 하나뿐이다.

| 항목 | 내용 |
|---|---|
| 대상 | **1238개 파일** / 586MB |
| 도구 | **`pngquant`** (팔레트 양자화) + `jpegoptim` |
| 손실 여부 | **손실 압축이다.** v2의 "무손실" 표기는 오류 |
| 기대 절감 | 스크린샷 PNG 기준 60~80% |
| 파일명·확장자 | **유지.** 본문 319편 무수정이 목적 |
| 확장자 대소문자 | **`.JPG` 8개가 있다.** 압축 스크립트의 glob을 대소문자 무시로 짠다. 대소문자 구분 glob이면 8개를 조용히 건너뛴다 |
| WebP | **쓰지 않는다.** 확장자가 바뀌어 본문을 고쳐야 한다 |

`oxipng` 같은 무손실 도구는 스크린샷에서 10~30%밖에 줄지 않아 목적에 미달한다.

절차:

1. 10MB 초과 PNG 13개(최대 15MB)를 먼저 처리해 품질 파라미터를 정한다
2. 샘플 10장을 육안 비교하고 승인을 받는다
3. 전체 적용, 압축 전후 용량과 파일 수를 보고한다

git 히스토리는 재작성하지 않는다. 퍼블릭 저장소라 위험 대비 이득이 적다.

### Phase 4. URL 검증

브랜치: `feat/astro-04-search` 이후 또는 별도 검증 커밋

- `astro build` 결과에서 `_migration/urls-after.txt` 추출
- `_migration/urls-before.txt`와 diff
- **글 URL 누락 0건**까지 수정
- 4-1 "의도된 URL 변경" 3건과 `/page2`~`/page64`는 누락 허용. 표시만 한다
- diff 결과를 보고하고 멈춘다

### Phase 5. 배포

브랜치: `feat/astro-05-deploy` -> `feat/astro` -> `main`

- GitHub Actions 워크플로 작성 (`node-version-file: .nvmrc`)
- 프리뷰 배포로 확인
- 컷오버 전 승인
- 컷오버 후 `jekyll-final` 태그를 남기고 Jekyll 파일 삭제
- **Search Console에 `sitemap-index.xml` 재등록**
- 색인 변화 2주 모니터링

---

## 9. 제약 조건

### 9-1. URL

개별 글 퍼머링크를 1:1로 보존한다. 검색 유입 319편이 걸려 있다.

### 9-2. 한국어 본문

```css
word-break: keep-all;
overflow-wrap: break-word;
```

### 9-3. 모바일

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- 안전 영역: `env(safe-area-inset-*)`
- `100vh` 대신 `100dvh`
- 터치 타깃 최소 44x44px
- 코드 블록, 표, **KaTeX 수식 블록**은 래퍼에 `overflow-x: auto`

### 9-4. 다크모드

- FOUC 방지용 인라인 스크립트
- `<meta name="theme-color">`를 라이트/다크 각각 지정
- KaTeX 렌더링이 다크 배경에서 읽히는지 확인

### 9-5. 보안

- 퍼블릭 저장소다. 토큰, 키를 절대 커밋하지 않는다
- 광고 스크립트, 임의의 트래킹 스크립트를 추가하지 않는다

### 9-6. 작업 방식

- 단계별로 커밋한다 (7-4 규칙)
- 루트에 `CLAUDE.md`를 만들어 확정 스택과 제약을 기록한다

---

## 10. 완료 기준

1. `_migration/urls-before.txt` 대비 **글 URL 누락 0건** (페이지네이션·의도된 변경 제외)
2. 319편 전부 렌더링 깨짐 없음
3. Zod 스키마 검증 에러 0건
4. `use_math: true` 23편의 수식이 정상 렌더링
5. **`$`가 포함된 비수식 글에서 수식 오인식 0건**
6. 한국어 검색에서 "러스트" 입력 시 "러스트는"이 포함된 글이 검색됨
7. 모바일 375px 폭에서 가로 스크롤 발생 안 함
8. 다크/라이트 전환 시 깜빡임 없음
9. 런타임 JS 의존성 0개
10. `/search/`, `/archive/`, `/category/`, `/about/`, `/feed.xml`이 기존 URL로 접근 가능
11. 페이지 소스에 AdSense, UA, 외부 CDN 참조가 남아 있지 않음
12. `robots.txt`가 `https://devfancy.github.io/sitemap-index.xml`를 가리킴

---

## 11. 금지 사항

- 승인 없이 Phase를 건너뛰지 않는다
- 확정 스택을 다른 것으로 바꾸자고 제안하지 않는다
- `main` 브랜치에 직접 커밋하지 않는다
- Phase 5 승인 전까지 기존 Jekyll 파일을 삭제하지 않는다
- 오픈소스 테마를 통째로 가져오지 않는다
- Pagefind를 도입하지 않는다
- MDX를 도입하지 않는다
- 개별 글의 URL을 바꾸지 않는다 (문제풀이 글 포함, 대소문자 포함)
- 이미지 파일명과 경로를 바꾸지 않는다 (WebP 변환 포함)
- 319편의 프론트매터를 손으로 일괄 편집하지 않는다. 반드시 스크립트로
- git 히스토리를 재작성하지 않는다
- `--force` push를 쓰지 않는다 (`--force-with-lease`만)

---

## 부록 A. Content Layer 스키마

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),            // 파일명에서 파생해 주입
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).default([]),   // 현재 데이터 없음. 신규 글용 예약
    use_math: z.boolean().default(false),    // KaTeX CSS 조건부 로드용

    // 예약 필드
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    thumbnail: z.string().optional(),       // 카드 대표 이미지. 2차에서 사용 (4-3)

    // 선택
    summary: z.string().optional(),   // 없으면 본문 첫 문단 자동 추출
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

`layout`과 `author`는 스키마에 없다. 변환 스크립트에서 제거한다.

## 부록 B. curation.yml

```yaml
theme: "장애를 견디는 시스템은 어떻게 만드나"
posts:
  - spring-boot-kafka-dlq
  - spring-boot-kotlin-external-api-circuit-breaker
  - spring-boot-coupon-system-performance-improvement
```

빌드 타임에 슬러그 실재 여부를 검증한다. 오타가 있으면 빌드를 세운다.

## 부록 C. resume.json 구조

```jsonc
{
  "name": "문준용",
  "headline": "백엔드 개발자",
  "intro": ["...", "..."],
  "links": [
    { "label": "GitHub", "url": "https://github.com/devFancy" },
    { "label": "LinkedIn", "url": "https://www.linkedin.com/in/junyong-moon-479385264" }
  ],
  "careers": [
    {
      "company": "포스타입",
      "role": "Backend Engineer",
      "period": { "from": "2026-03", "to": null },
      "summary": "콘텐츠 플랫폼",
      "projects": [
        {
          "name": "",
          "summary": "",
          "period": { "from": "", "to": null },
          "stack": ["Kotlin", "Spring Boot", "MySQL"],
          "highlights": [
            { "text": "", "postSlug": "spring-boot-kafka-dlq" }
          ]
        }
      ]
    }
  ],
  "openSources": [],
  "activities": [],
  "educations": [],
  "updatedAt": "2026-09"
}
```

## 부록 D. 검색 인덱스 설계

```
빌드 타임:
  319편 -> { slug, title, categories, date } 배열 -> public/search-index.json

런타임:
  질의 정규화 (NFC 통일, 공백 제거, 소문자화)
  대상 정규화 후 부분 문자열 매칭
  카테고리 필터와 조합 가능
```

- 외부 라이브러리를 쓰지 않는다
- 본문 전문 검색은 범위 밖이다
- `tags`는 현재 비어 있으므로 인덱스에서 제외한다. 데이터가 생기면 추가한다
- 인덱스 크기를 측정해 보고한다. 300KB를 넘으면 필드를 줄인다
- 기존 루트 `search.json`(Liquid 생성)은 제거한다

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|---|---|---|
| v1 | 2026-09-20 | 최초 작성 |
| v2 | 2026-09-20 | Phase 0 결과 반영. 글 수 327 -> 319 정정, 썸네일 근거 정정, 태그 부재 반영, KaTeX 도입, AdSense 제거, 이미지 압축 Phase 추가, 의존성 목표 재정의 |
| v9 | 2026-09-20 | 카테고리를 2단 계층으로 정리(4-2-1). 기술 아래 서버·알고리즘·CS·프로젝트·도구를 두고, 프론트매터에는 잎만 적는다. 계층은 `CATEGORY_GROUPS` 에 선언 |
| v8 | 2026-09-20 | 카테고리 34개 → 9개 재편(4-2-1), 기존 이름을 태그로 이전, 태그 표기 규칙(고유명사 영문/일반 개념 한글) 신설, `/category/#Kafka` 앵커를 태그에서도 찾도록 기재 |
| v7 | 2026-09-20 | 파비콘 신설(4-3, 검정 배경 + 흰 펜촉), 태그 칩을 라운드 사각형으로 확정, 목차 접기/펼치기를 03-pages 항목으로 추가(4-4-4) |
| v6 | 2026-09-20 | 검색을 `/search/` 페이지에서 `/category/` 안으로 이동(4-4-2), `/search/` 를 의도된 URL 변경 4번째로 추가, 헤더 네비 3개 확정(4-4-3), 이메일 노출 허용·전화번호 제외·Instagram 제외(4-5), `/about/` 선행 구현과 `/archive/`·`/category/` 404 상태 기록(8-2-2), 폰트 self-host 방침 기재(3-1) |
| v5 | 2026-09-20 | Phase 2 완료 반영. 카드 시안 A 확정(제목-날짜-칩), Hero 배경 이미지 채용(4-3 "배경 사진 없음" 뒤집음), 목차·Recommend·소셜 인라인 SVG를 이관 대상으로 확정, Astro 7/Tailwind v4 함정 8-2-1 신설, 빌드 타임 의존성 목표 6 -> 9 정정 |
| v4 | 2026-09-20 | Phase 1 완료 반영. URL 스냅샷 1648건 구성 확정, `/2026-DevHistory/` 미결 해소(post 우선), 빌드 로케일(2-7) 신설, `css/main.css` 충돌과 `page/1dev.html` 정리 대상 추가, **이미지 파일 수 1230 → 1238 정정**(PHASE0 합계 산술 오류. `.JPG` 대소문자 주의 추가) |
| v3 | 2026-09-20 | 수식 전역 적용 정정(`$` 이스케이프 11건 명시), Phase 1.5를 Phase 3에 흡수(`pngquant`, 손실 압축), 의도된 URL 변경 목록 신설, 브랜치 전략(§7) 복원, Node 22.12 선행 조건 명시, 카테고리 표기 4종 정정 |
