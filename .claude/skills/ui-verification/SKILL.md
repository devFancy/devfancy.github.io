---
name: ui-verification
description: 화면을 고친 뒤 눈이 아니라 숫자로 확인하고, 결과를 사람이 하나씩 짚어볼 수 있는 테스트 트리로 내놓는다. 색·간격·호버·상태처럼 "적용했다"로 끝내면 안 되는 변경에 쓴다.
---

# 화면 변경을 실측으로 검증하기

**"적용했습니다"는 결과가 아니다.** 코드가 바뀐 것과 화면이 바뀐 것은 다른 문제다.
캐시, 상속, 선택자 우선순위, 낡은 dev 서버가 그 사이에 끼어 있다.

이 스킬은 두 가지를 만든다.

1. CDP 로 잰 **숫자** (색·크기·상태)
2. 사람이 순서대로 짚어볼 수 있는 **테스트 트리**

## 언제 쓰나

- 색·간격·정렬·호버·선택 상태를 고쳤을 때
- 공통 컴포넌트나 공통 CSS 를 고쳐 **여러 페이지가 같이 바뀔 때**
- "어떤 페이지는 되는데 어떤 페이지는 안 된다"는 말을 들었을 때

## 절차

### 1. 대상을 먼저 전부 찾는다

고친 클래스나 컴포넌트가 **쓰이는 자리를 모두** 찾고 나서 측정 계획을 세운다.
한 군데만 보고 "고쳤다"고 하면, 같은 것이 두 가지 구현으로 존재할 때 반드시 틀린다.

```bash
grep -rn 'link-title\|chip' src/ --include='*.astro' --include='*.css'
grep -rl "from '.*Chip.astro'" src/    # 컴포넌트를 쓰는 곳
```

브라우저가 `innerHTML` 로 다시 그리는 자리는 서버 렌더 결과에 안 나온다. 따로 찾는다.

### 2. 로컬을 믿을 수 있게 만든다

```bash
pkill -f 'astro.mjs dev'; pkill -f 'astro.mjs preview'
rm -rf .astro node_modules/.astro
npx astro dev --port 4321        # 사람이 볼 것
npx astro preview --port 4399 &  # 측정용 (빌드 결과)
```

`astro dev` 는 데몬이라 **새로 띄운 것이 포트를 뺏기고 옛 프로세스가 계속 응답**할 수 있다.
`astro dev status` 로 실제 포트를 확인한다. 측정은 `preview`(빌드 결과)로 한다.

### 3. 잰다

**항목이 많으면 러너를 쓴다.** spec 만 적으면 뷰포트 x 테마 x 상태를 전부 돌아 표로 낸다.

```bash
bash scripts/chrome.sh                 # 헤드리스 크롬 9333
node scripts/measure.mjs spec.json     # reference/spec.example.json 참고
```

한두 가지만 볼 때나 스크린샷이 필요하면 `reference/cdp-recipes.md` 의 조각을 붙여 쓴다. 규칙 셋.

- 뷰포트는 `Emulation.setDeviceMetricsOverride` 로 폭·높이·DPR 을 **명시**한다
- 호버는 **진짜 마우스 이벤트**(`Input.dispatchMouseEvent`)로 만든다. 클래스를 손으로 붙이지 않는다
- 값을 읽을 때 **`e.matches(':hover')` 를 같이 읽는다.** 안 그러면 기본값을 호버값으로 착각한다

라이트와 다크를 둘 다 잰다.

### 4. 트리로 옮긴다

`reference/template.md` 를 쓴다. 핵심은 **잰 것과 안 잰 것을 구분**하는 것이다.

- `[실측 OK]` - 숫자로 확인함
- `[확인 필요]` - 측정 실패했거나 사람 눈이 필요함
- `★` - 이번에 실제로 바꾼 곳

측정이 실패했으면 **성공한 척하지 않는다.** 실패했다고 적고 사람에게 넘긴다.

### 5. 되돌릴 근거도 같이 낸다

바꾸기 전 값과 바꾼 뒤 값을 같은 표에 놓는다. 그래야 "이게 나아졌나"를 판단할 수 있다.
시각적 선택이 두 갈래로 갈리면 **시안을 렌더해서 고르게 한다.** 숫자로 설득하지 않는다.

## 함정

측정이 거짓말하는 경우가 코드가 틀린 경우보다 많았다.
**`reference/pitfalls.md` 를 측정 전에 읽는다.**

잴 대상 자체를 빠뜨려서 틀린 경우도 많다. 계획을 세울 때 `reference/coverage.md` 를 훑는다.

## 파일

| 파일 | 내용 |
| --- | --- |
| `scripts/chrome.sh` | 측정용 헤드리스 크롬 띄우기 |
| `scripts/measure.mjs` | spec 을 받아 뷰포트 x 테마 x 상태를 전부 돌아 표로 낸다 |
| `reference/spec.example.json` | spec 형식 |
| `reference/template.md` | 테스트 트리와 요약표 틀 |
| `reference/coverage.md` | 잴 대상을 빠뜨리지 않는 다섯 가지 점검 |
| `reference/cdp-recipes.md` | 손으로 붙여 쓰는 측정 조각 |
| `reference/pitfalls.md` | 측정이 거짓말한 실제 사례 |

## 다른 프로젝트에서 쓸 때

`scripts/` 와 `reference/` 는 프레임워크와 무관하다. 갈아 끼울 것은 둘뿐이다.

- **로컬 서버 띄우는 명령** (2단계). 예시는 Astro 기준이다
- **테마 전환 방식**. 이 프로젝트는 `document.documentElement.dataset.theme` 를 쓴다.
  `class="dark"` 를 쓰는 프로젝트면 러너의 테마 전환 한 줄을 고친다
