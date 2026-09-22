# ui-verification

화면을 고친 뒤 눈이 아니라 숫자로 확인하고, 사람이 하나씩 짚어볼 수 있는
테스트 트리로 내놓는 스킬이다.

```
SKILL.md                      절차 5단계. 여기부터 읽는다
scripts/chrome.sh             측정용 헤드리스 크롬 띄우기
scripts/measure.mjs           spec 을 받아 뷰포트 x 테마 x 상태를 돌아 표로 낸다
reference/spec.example.json   spec 형식
reference/template.md         테스트 트리와 요약표 틀
reference/coverage.md         잴 대상을 빠뜨리지 않는 다섯 가지 점검
reference/cdp-recipes.md      손으로 붙여 쓰는 측정 조각
reference/pitfalls.md         측정이 거짓말한 실제 사례 11가지
```

## 빨리 써보기

```bash
bash scripts/chrome.sh
cp reference/spec.example.json spec.json     # base 와 cases 를 고친다
node scripts/measure.mjs spec.json
```

Node 22 이상, 크롬이 필요하다. 프레임워크에는 매여 있지 않다.
갈아 끼울 것은 로컬 서버 명령과 테마 전환 방식 둘뿐이다 (SKILL.md 맨 아래 참고).

## 어디서 왔나

Jekyll 블로그 319편을 Astro 로 옮기고 화면을 다듬으면서, 같은 실수를 반복하다 만들었다.
`reference/pitfalls.md` 는 전부 실제로 겪은 것이다.
