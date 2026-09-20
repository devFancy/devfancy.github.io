# devfancy.github.io

[Astro](https://astro.build) 로 만든 개인 블로그입니다. 글은 https://devfancy.github.io 에서 볼 수 있습니다.

## 로컬에서 실행하기

Node 버전은 `.nvmrc` 를 따릅니다.

```bash
nvm use
npm ci
npm run dev        # http://localhost:4321
```

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | `dist/` 로 정적 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run check` | `astro check` 타입 검사 |
| `npm run lint` | Biome 검사 |
| `npm run format` | Biome 자동 수정 |

> 로케일이 `C` 면 한글 파일명에서 인코딩 오류가 납니다. CI 는 `LC_ALL=en_US.UTF-8` 을 고정해 두었습니다.

## 글 쓰기

글은 `src/content/posts/*.md` 에 둡니다. **파일명이 곧 URL** 입니다.
`src/content/posts/Spring-Transaction.md` → `/Spring-Transaction/`

```yaml
---
title: "제목"
date: 2026-09-21
categories: ["서버"]
tags: ["Spring", "JPA"]
use_math: true   # 수식이 있을 때만
---
```

- `categories` 는 한 편에 하나입니다. 쓸 수 있는 값은 `src/config.ts` 의 `CATEGORY_GROUPS` 에 있습니다
- 태그 노출 순서는 같은 파일의 `TAG_ORDER` 가 정합니다
- 이미지는 `public/assets/img/` 아래에 두고 `/assets/img/...` 로 참조합니다

## 폴더 구조

```
src/
  components/   Hero, Header, Chip 같은 공용 조각
  layouts/      Base.astro — 모든 페이지의 껍데기
  pages/        라우트. [...slug].astro 가 글 상세를 만든다
  content/      posts/ 아래 마크다운
  styles/       global.css — 색 토큰과 .prose 본문 스타일
  config.ts     사이트 정보, 네비, 카테고리·태그 순서
public/assets/img/    글 본문 이미지
```

## 배포

`main` 에 푸시되면 `.github/workflows/deploy.yml` 이 GitHub Pages 로 배포합니다.
저장소 설정의 Pages → Source 는 **GitHub Actions** 여야 합니다.

---

Jekyll 판은 [HyG](https://github.com/gaohaoyang) 의 [템플릿](https://github.com/Gaohaoyang/gaohaoyang.github.io) 과
[Gid](https://github.com/goodGid) 의 [한국어 판](https://github.com/goodGid/goodGid.github.io) 을 바탕으로 했습니다.
