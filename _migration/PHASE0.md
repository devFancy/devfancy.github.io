# Phase 0 — 현황 파악 결과

- 조사일: 2026-09-20
- 조사 범위: 읽기 전용. 저장소 파일을 일절 수정하지 않음
- 기준 커밋: `730a4ff` (main)

---

## 1. `_config.yml`

| 항목 | 값 |
|---|---|
| `title` | `devFancy` |
| `brief-intro` | `BE Developer` |
| `url` / `baseurl` | 둘 다 `""` (빈 값) |
| `permalink` | `/:title/` |
| `markdown` | kramdown, `input: GFM`, `syntax_highlighter: rouge` |
| `sass` | `_sass`, `style: compressed` |
| `category_dir` / `tag_dir` | `category/` / `tag/` |
| `excerpt_separator` | `"\n\n\n"` |
| `plugins` | `[jekyll-paginate]` |
| `paginate` | 5 |
| `future` | `true` |
| `incremental` | `false` |
| `google_analytics_id` | `G-7BMWW1711K` |
| `disqus_shortname` | 주석 처리 |
| `categories_order` | 34개 하드코딩 배열 |

### trailingSlash 판정

`permalink: /:title/` → Jekyll이 `_site/<slug>/index.html`을 생성한다.
Astro 등가 설정:

```js
trailingSlash: 'always',
build: { format: 'directory' }   // 기본값
```

`url`이 빈 값이라 `jekyll serve`로 빌드하면 `site.url`이 `http://localhost:4000`으로 채워진다.
Phase 1에서 URL을 추출할 때 이 접두사를 제거해야 한다.

---

## 2. Gemfile / `_plugins`

- **`_plugins` 디렉터리 없음. 커스텀 플러그인 0건.**
- `jekyll ~> 4.2.0`, `minima ~> 2.5`, `webrick ~> 1.7`
- 플러그인 그룹: `jekyll-feed ~> 0.12`, `jekyll-paginate ~> 1.1.0`

> `jekyll-feed`가 설치돼 있으나 루트에 수동 `feed.xml` Liquid 템플릿도 있다.
> 둘 다 `/feed.xml`을 노리므로 출력이 중복·경합한다. 이관 시 하나로 정리한다.

로컬 환경: Ruby 2.7.3 (arm64-darwin23), Bundler 2.1.4

---

## 3. `_layouts` / `_includes`

### `_layouts`

| 파일 | 줄 | 역할 |
|---|---|---|
| `default.html` | 42 | head + header + content + footer 셸 |
| `post.html` | 94 | 글 본문, 날짜/작성자/카테고리 라벨, Similar Posts, 우측 인덱스 |
| `page.html` | 27 | About 등 정적 페이지 |
| `demo.html` | 10 | 미사용 추정 |

### `_includes` (10개)

`head.html` · `header.html` · `footer.html` · `category.html` · `tag.html` ·
`comments.html` · `previousAndNext.html` · `backToTop.html` · `opinion.html` · `mathjax_support.html`

### 주목할 점

- `post.html`의 **Similar Posts는 `page.tags` 기반**이다. 태그가 0건이므로 실제로 절대 렌더링되지 않는 죽은 코드다.
- `header.html`의 메뉴는 `site.pages` 중 `type == 'page'`를 순회해 자동 생성한다.
- `header.html`에 카카오페이 QR 모달이 인라인으로 들어 있다. (`kakaopay_logo.png`, `kakaopay_qr.png`)
- `index.html` 우측 사이드바의 Categories는 `site.categories_order`를 돌며 `/category/#<이름>` 앵커로 링크한다.
- `page/2category.html`은 `<h2 id="{{ category }}">`로 앵커를 만든다. 기존 `#Kafka` 형태가 여기서 나온다.

---

## 4. `_posts` 전수 조사

대상: `_posts/*.md` **319개** (다른 확장자 파일 없음)

### 4-1. Liquid 태그 — 총 6개 파일

| 패턴 | 파일 수 |
|---|---|
| `{% raw %}` | 2 |
| `{% highlight %}` | **0** |
| `{{ site.* }}` | 3 |
| `{{` 전체 | 6 |
| `{%` 전체 | 3 |

| 파일 | 내용 |
|---|---|
| `2023-10-23-Algorithm-Summary.md` | `{{site.url}}` 약 40건 (내부 링크). `site.url`이 빈 값이라 실제 결과는 `/Programmers-150370/` 형태 |
| `2023-02-17-Network-Load-Balancing.md` | `{{site.url}}` 1건 (141행) |
| `2023-02-10-ETC-Liquid-syntax-error.md` | `{% raw %}{{{% endraw %}` — Liquid 이스케이프 자체를 설명하는 글 |
| `2023-02-10-Programmers-64065.md` | 동일 패턴 3건 |
| `2023-02-04-Technology-utterances.md` | HTML 주석(`<!-- -->`) 안의 Disqus 스니펫. 98~122행 |
| `2025-12-12-spring-boot-kotlin-external-api-circuit-breaker.md` | 코드블록 안 로그 출력의 `{{traceId}}`, `{{spanId}}` |

> **Astro는 `.md`에서 `{}`를 해석하지 않는다** (`.mdx`만 해석).
> 따라서 빌드 에러는 발생하지 않고, 대신 문자 그대로 출력된다.
> 변환 스크립트에서 `{{site.url}}`과 `{% raw %}`/`{% endraw %}`만 제거하면 된다.
> `{{traceId}}`는 코드블록 안이라 그대로 두는 것이 맞다.

### 4-2. kramdown 전용 문법 — `_posts` 내 0건

| 패턴 | 건수 |
|---|---|
| `{: .class}` / `{: #id}` | **0** |
| 각주 `[^x]` | **0** |
| 테이블 정렬 `:---` | **0** |

예외: `page/3about.md` 10행에 `{:toc}` 1건. 포스트가 아니라 페이지라 개별 대응한다.

### 4-3. 날 HTML

| 패턴 | 파일 수 |
|---|---|
| `<br` | 1 |
| `<img` | 4 |
| `<details>` / `<summary>` | 0 |
| 기타 블록/인라인 태그 전체 | 4 |

사실상 없다. Astro 컴파일러 리스크는 낮다.

### 4-4. 프론트매터

| 키 | 빈도 |
|---|---|
| `title` | 319 |
| `layout` | 319 |
| `categories` | 319 |
| `author` | 319 |
| `use_math` | 21 |

- **`date` 필드 없음.** 파일명 `YYYY-MM-DD-`에서 파생한다.
  파일명 날짜 형식은 **319개 전부 100% 준수** (위반 0건).
- **`tags` 필드 없음.** 태그 데이터가 아예 존재하지 않는다.

연도별 분포:

| 연도 | 편수 |
|---|---|
| 2021 | 2 |
| 2022 | 68 |
| 2023 | 187 |
| 2024 | 29 |
| 2025 | 28 |
| 2026 | 5 |

가장 오래된 글: `2021-09-06-Linux-basic.md`
가장 최근 글: `2026-07-26-essay-02-note.md`

### 4-5. `categories` 표기 혼재

원시 문자열 **45종** → 정규화하면 **정확히 34개**, 배정 합계 **327**.

```
Algorithm                    ← bare 문자열
[Kafka] / [Technology]       ← YAML 배열
[ Technology ] / [ Essay ]   ← 공백 포함 배열
Side_Project SpringBoot      ← 공백 구분 다중값 (8편)
```

> **319편 vs 327의 정체**: 글은 319편이고, 8편이 카테고리를 2개 가져서 배정 합계가 327이 된다.

정규화 후 분포:

| 카테고리 | 편수 | | 카테고리 | 편수 |
|---|---|---|---|---|
| Algorithm | 70 | | Book | 6 |
| Technology | 22 | | Probability-Statistics | 5 |
| Side_Project | 20 | | IntelliJ | 5 |
| SpringBoot | 17 | | DataStructure | 5 |
| Spring | 15 | | Woowacourse | 4 |
| OS | 14 | | Retrospective | 4 |
| JPA | 13 | | Linux | 4 |
| Electronic-Finance | 13 | | DevHistory | 4 |
| Business-Statistics | 13 | | MySQL | 3 |
| Java | 10 | | AlgorithmSkill | 3 |
| SQL | 9 | | LeetCode | 2 |
| Git | 9 | | Essay | 2 |
| Kafka | 8 | | Flyway | 1 |
| E.T.C | 8 | | Competition | 1 |
| Database | 8 | | AssertJ | 1 |
| Workout | 7 | | | |
| Network | 7 | | | |
| HTTP | 7 | | | |
| GoodCode | 7 | | | |

문제풀이 3종 합계 = 70 + 3 + 2 = **75편** (지시서와 일치)

---

## 5. 이미지 경로 패턴

본문 이미지 참조 총 **1171건**

| 유형 | 건수 | 비율 |
|---|---|---|
| 절대 `/assets/...` | 1167 | 99.7% |
| 외부 URL | 3 | 0.3% |
| 상대 / 빈 값 | 1 | — |

외부 URL 3건은 전부 README 예시성 이미지다.
(`capsule-render.vercel.app`, `github-readme-stats.vercel.app`, `komarev.com`)

경로 상위: `technology` 224, `os` 110, `goodfriends` 101, `jpa` 67, `spring` 58, `testcode` 51, `network` 46, `db` 46

> `public/assets/`로 그대로 복사하면 본문 수정 없이 전부 살아난다.

### 파일 실측

| 항목 | 값 |
|---|---|
| `assets/img` 총량 | **586MB** |
| 파일 수 | **1238개** (png 1174, jpg 51 = `.jpg` 43 + `.JPG` 8, jpeg 12, gif 1) |
| 10MB 초과 파일 | 13개 |
| 최대 파일 | `book/The-One-Who-Leaves-People-Behind.png` 15MB |

---

## 6. 이미지 포함 글 비율

**189 / 319 = 59.2%**

> 지시서 4-3의 "327편에 이미지가 없어 일관성이 깨진다"는 사실과 다르다.
> 실제 문제는 "이미지가 없다"가 아니라 "59%에만 있고 크기·비율이 제각각"이다.
> 썸네일 미채용 결론 자체는 유지 가능하나 근거를 바꿨다.

---

## 7. RSS 피드 경로

**`/feed.xml`**

- 루트의 수동 Liquid 템플릿 (`layout: null`)
- 최근 **30편** 수록
- 채널 이미지: `https://devfancy.github.io/assets/img/logo.png`
- `head.html` 17행에 `<link rel="alternate" type="application/rss+xml">`로 연결

`sitemap.xml`도 동일하게 루트 수동 템플릿이다. 전체 포스트를 `changefreq: weekly`, `priority: 0.5`로 출력한다.

`search.json`도 루트 수동 템플릿이며 **본문 전문(`post.content | jsonify`)을 포함**한다.
현재 검색은 `js/jekyll-search.js` 기반 전문 검색이다.

---

## 8. 분석 / 광고 스크립트

`_includes/head.html` 기준.

| 항목 | 상태 |
|---|---|
| **GA4** `G-7BMWW1711K` | gtag.js로 정상 삽입 (35~41행) |
| 구형 Universal Analytics | `analytics.js` 동시 삽입 (24~32행). **UA는 서비스 종료됨 → 죽은 코드** |
| **Google AdSense** | `ca-pub-1091577586291045` (44~45행) + 루트 `ads.txt` |
| `js/pageCounting.js` | 조회수 POST 로직이 **전량 주석 처리**된 죽은 코드 |
| 외부 CDN | `cdn.bootcss.com` (font-awesome 4.7), `at.alicdn.com` (아이콘 폰트) |

MathJax는 `{% if page.use_math %}`로 `mathjax_support.html`을 조건부 include한다. 대상 **21편**.

---

## 9. 댓글 시스템

**사용하지 않는다.**

- `_config.yml`의 `disqus_shortname` 주석 처리
- `_includes/comments.html`은 존재하지만 **어떤 레이아웃에서도 include되지 않음**
- 파일 내 utterances 스니펫도 전체 주석 처리 (2024-11-24 작업 기록)

지시서의 "댓글 없음"과 일치한다.

---

## 10. 리스크 목록

### 블로커

| # | 항목 | 내용 |
|---|---|---|
| A | **Node 버전 미달** | 현재 `v20.20.1`. Astro 7은 22.12 이상 요구. Phase 2 전 업그레이드 필요 |

### URL 정합성

| # | 항목 | 내용 |
|---|---|---|
| C | **파일명 공백** | `_posts/2022-05-04-PS- 03-Discrete-Probability-Distributions.md` — `PS-` 뒤에 공백. Jekyll은 `/PS-03-Discrete-Probability-Distributions/`로 슬러그화한다. Astro glob loader는 공백을 그대로 두므로 변환 시 특수 처리 필요 |
| D | **URL 충돌** | `page/1dev.html`의 `permalink: /2026-DevHistory/` 와 `_posts/2026-01-01-2026-DevHistory.md`가 같은 URL을 놓고 경합. 기존부터 있던 문제 |
| E | **`_site` 스테일** | 빌드 시각 2026-02-09. `_site/sitemap.xml`에 `/2025-Retrospective/`("2025년 회고")가 있으나 해당 파일은 `_posts`에도 git 히스토리에도 없다. 커밋되지 않은 로컬 초안의 잔재. **Phase 1은 반드시 새로 빌드할 것** |
| K | robots.txt | sitemap이 `http://devFancy.github.io/sitemap.xml` — http 스킴 + 대소문자 혼용 |

URL 대소문자가 섞여 있다 (`/Algorithm-Baekjoon-24479/`, `/BS-Analysis-Of-Variance/`, `/geultto-10th-Retrospective/`).
슬러그를 소문자화하면 319개가 전부 깨진다.

### 지시서와 현실의 불일치

| # | 항목 | 내용 |
|---|---|---|
| F | **태그 부재** | 지시서 4-3 카드 구성과 부록 A/D의 `tags`를 적용할 데이터가 0건 |
| G | **수식 21편** | `use_math: true` 21편이 MathJax 사용. 지시서에 수식 계획 없음. `remark-math` + `rehype-katex` 도입 시 의존성 +2 |
| H | **광고 존재** | 지시서는 "광고 없음 / 광고 스크립트 추가 금지"인데 현재 AdSense가 실제로 활성 |
| — | 글 수 | 327 → 실제 319편 |
| — | 이미지 수 | "300여 장" → 실제 1238개 / 586MB |

### 저장소 위생

| # | 항목 | 내용 |
|---|---|---|
| I | **`assets/img` 586MB** | GitHub Pages 배포 아티팩트 1GB 제한에 근접. 빌드·클론 시간에 직접 영향 |
| J | `.gitignore` | `*.xml` 규칙이 있으나 `feed.xml`, `sitemap.xml`은 이미 추적 중. Astro 이관 시 규칙 재작성 필요 |
| — | 죽은 코드 | UA `analytics.js`, `pageCounting.js`, `comments.html`, `_layouts/demo.html`, `index.html`의 태그 클라우드 주석 블록 |

---

## 부록. 조사에 사용한 주요 명령

```bash
# 글 수
ls _posts/*.md | wc -l

# 프론트매터 키 빈도
awk 'FNR==1{inf=0} /^---[[:space:]]*$/{inf++; next} \
     inf==1 && /^[A-Za-z_][A-Za-z0-9_-]*:/{split($0,a,":"); print a[1]}' \
  _posts/*.md | sort | uniq -c | sort -rn

# 카테고리 정규화 후 집계
grep -h "^categories:" _posts/*.md \
  | sed 's/^categories:[[:space:]]*//; s/^\[//; s/\]$//; s/,/ /g' \
  | tr ' ' '\n' | grep -v '^$' | sort | uniq -c | sort -rn

# 이미지 경로 분류
grep -ho "!\[[^]]*\]([^)]*)" _posts/*.md | sed 's/.*(\(.*\))/\1/' \
  | awk '{if ($0 ~ /^https?:\/\//) print "EXTERNAL"; \
          else if ($0 ~ /^\/assets\//) print "ABS"; else print "OTHER"}' \
  | sort | uniq -c

# 파일명 날짜 형식 위반
ls _posts/*.md | grep -vE "_posts/[0-9]{4}-[0-9]{2}-[0-9]{2}-.+\.md$"
```
