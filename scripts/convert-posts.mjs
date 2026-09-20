/* NOTE Jekyll _posts 319편을 Astro content collection 으로 옮긴다 (MIGRATION.md 8-3-1)
 * - 수작업 금지. 규칙이 바뀌면 이 파일을 고치고 다시 돌린다
 * - 기본은 dry-run 이다. 실제로 쓰려면 --write 를 준다
 *
 * 한 번 쓰고 버리는 도구다. 아래 규칙표는 옛 Jekyll 분류를 새 분류로 옮기기 위한 것이고,
 * 이관이 끝나면 src/content/posts 가 유일한 원본이 된다.
 * 마이그레이션 PR 이 main 에 병합되면 이 파일과 _posts/ 를 같이 지운다.
 * 그 뒤로 새 글은 프론트매터에 카테고리와 태그를 직접 적는다.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '_posts';
const OUT = 'src/content/posts';
const WRITE = process.argv.includes('--write');

/* NOTE 기존 카테고리 34종을 9개로 묶고, 원래 이름은 태그로 내린다 (4-2)
 * - 고유명사·제품명은 영문, 일반 개념은 한글
 */
const CATEGORY = {
  SpringBoot: '서버', Spring: '서버', JPA: '서버', Java: '서버', Kafka: '서버',
  GoodCode: '서버', AssertJ: '서버', Technology: '서버', Flyway: '서버', Linux: '서버',
  Algorithm: '알고리즘', AlgorithmSkill: '알고리즘', LeetCode: '알고리즘',
  OS: 'CS', Network: 'CS', HTTP: 'CS', DataStructure: 'CS',
  Database: 'CS', SQL: 'CS', MySQL: 'CS',
  'Business-Statistics': '대학교', 'Probability-Statistics': '대학교',
  'Electronic-Finance': '대학교',
  Side_Project: '프로젝트', Woowacourse: '프로젝트',
  'E.T.C': '기타', Workout: '기타', Competition: '기타',
  Git: '도구', IntelliJ: '도구',
  Retrospective: '회고', DevHistory: '회고',
  Essay: '에세이', Book: '에세이',
};

const TAG = {
  SpringBoot: 'Spring Boot', Spring: 'Spring', JPA: 'JPA', Java: 'Java', Kafka: 'Kafka',
  GoodCode: '클린코드', AssertJ: 'AssertJ', Technology: '기술', Flyway: 'Flyway', Linux: '리눅스',
  Algorithm: '알고리즘', AlgorithmSkill: '문제해결', LeetCode: 'LeetCode',
  OS: '운영체제', Network: '네트워크', HTTP: 'HTTP', DataStructure: '자료구조',
  Database: '데이터베이스', SQL: 'SQL', MySQL: 'MySQL',
  'Business-Statistics': '경영통계', 'Probability-Statistics': '확률통계',
  'Electronic-Finance': '전자금융',
  Side_Project: '사이드프로젝트', Woowacourse: '우아한테크코스',
  'E.T.C': '기타', Workout: '운동', Competition: '커리어',
  Git: 'Git', IntelliJ: 'IntelliJ',
  Retrospective: '회고', DevHistory: '개발기록',
  Essay: '에세이', Book: '책',
};

/* NOTE Technology 와 E.T.C 는 주제가 섞인 보관함이라 태그 하나로 줄일 수 없다
 * - 슬러그와 제목에서 주제를 읽어 태그를 정한다. 글 목록을 손으로 적지 않는다
 * - 위에서부터 처음 맞는 규칙을 쓰므로 좁은 주제를 먼저 둔다
 */
const TAG_RULES = [
  { tag: '블로그', test: /jekyll|utterances|readme|search console|파비콘|북마크|블로그/i },
  { tag: '글또', test: /geultto|글또/i },
  { tag: 'Git', test: /branch|protection/i },
  { tag: '성능테스트', test: /성능|부하 ?테스트|k6/i },
  { tag: 'Spring Boot', test: /spring.?boot/i },
  { tag: '네트워크', test: /rest|https|쿠키|nginx|dns|프락시/i },
  { tag: '사이드프로젝트', test: /sipe|사이프톤|슬랙 ?봇/i },
  // 공모전·수료증·직업 선택은 각각 1편뿐이라 커리어 하나로 묶는다
  { tag: '커리어', test: /coursera|수료증|공모전|개발자를 선택/i },
  { tag: '후기', test: /후기|리뷰|review|돌아보며|밋업|meet ?up|tech ?talk|테크토크|slash|세레나데|컨퍼런스/i },
];

/* NOTE 카테고리·그룹과 이름이 같은 태그는 칩에 정보가 없다. 구체 태그로 내린다
 * - Technology -> "기술" 은 그룹명, E.T.C -> "기타" 와 Retrospective/Essay 는 카테고리명이었다
 * - 어느 규칙에도 안 걸리면 원래 태그를 그대로 두고 경고를 남긴다
 */
const VAGUE = new Set(['기술', '기타']);

function refineTag(tag, slug, title) {
  const text = `${slug} ${title}`;
  if (tag === '알고리즘') {
    const source = sourceOf(slug);
    if (!source) warnings.push(`${slug}: 출처를 못 읽어 태그 "알고리즘" 을 유지한다`);
    return [source ?? tag];
  }
  if (tag === 'SQL') return /\[Programmers\]/i.test(title) ? [tag, '프로그래머스'] : [tag];
  // 카테고리 "회고" 만으로 충분하다. 주기까지 태그로 나누면 태그가 한 편씩 붙는 꼴이 된다
  if (tag === '회고') return [];
  if (tag === '에세이') return [/생각 ?정리/.test(text) ? '생각정리' : tag];
  if (!VAGUE.has(tag)) return [tag];

  const hit = TAG_RULES.find((r) => r.test.test(text));
  if (!hit) { warnings.push(`${slug}: 규칙에 안 걸려 태그 "${tag}" 를 유지한다`); return [tag]; }
  return [hit.tag];
}

/** 문제풀이 글의 출처를 슬러그에서 읽는다 */
function sourceOf(slug) {
  if (/programmers/i.test(slug)) return '프로그래머스';
  if (/ba[ec]kjoon/i.test(slug)) return '백준';
  return null;
}

/* NOTE "프로젝트" 는 주제가 아니라 맥락이다. 주제 카테고리와 같이 붙으면 주제를 쓴다
 * - Jekyll 의 "Side_Project SpringBoot" 8편이 프로젝트와 서버 양쪽에 걸려 있었다
 * - 그 탓에 /category/ 에서 프로젝트를 고르면 Spring Boot 태그가 딸려 나왔다
 * - 프로젝트라는 맥락은 "사이드프로젝트" 태그로 남으니 정보가 사라지지 않는다
 */
const CONTEXT_CATEGORY = new Set(['프로젝트']);

/* NOTE 태그는 카테고리 한 곳에만 살게 한다
 * - 같은 태그가 두 카테고리에 걸리면 /category/ 에서 같은 칩이 두 번 보인다
 * - 태그가 주제를 더 정확히 말해주면 글을 그 태그의 집으로 보낸다
 * - REST·쿠키·HTTPS·NGINX 는 특정 서버 기술이 아니라 웹 공통 지식이라 CS 다
 */
const TAG_HOME = {
  네트워크: 'CS',
  Git: '도구',
  글또: '회고',
  // BE 미션 회고라 프로젝트가 아니라 서버다
  우아한테크코스: '서버',
};

/* NOTE 보관함 카테고리에 있지만 주제가 드러난 글은 제자리로 보낸다
 * - Technology 는 서버로 가지만 그 안의 블로그 운영 글은 기타다
 * - E.T.C 의 기수 회고는 회고다
 */
function refineCategory(cat, tags, slug) {
  // SQL 문제풀이도 문제풀이다. 출처 태그가 붙었으면 알고리즘으로 보낸다
  if (cat === 'CS' && tags.includes('프로그래머스')) return '알고리즘';
  if (cat === '서버' && tags.includes('블로그')) return '기타';
  for (const t of tags) if (TAG_HOME[t]) return TAG_HOME[t];
  // 사이드프로젝트만 걸린 글은 프로젝트다 (SIPE 슬랙봇)
  if (cat === '기타' && tags.includes('사이드프로젝트')) return '프로젝트';
  return cat;
}

/* NOTE Jekyll 본문의 이미지 경로 오타를 바로잡는다
 * - tech_insight 폴더는 존재한 적이 없다. 같은 글의 다른 이미지는 전부 woowabros 에 있다
 * - 원본 블로그에서도 깨져 있던 이미지다
 */
const IMAGE_PATH_FIX = [
  ['/assets/img/tech_insight/', '/assets/img/technology/woowabros/'],
];

/* NOTE 2026 Dev History 의 Gist 임베드를 걷어낸다
 * - <script> 로 넣은 Gist 는 프레임으로 그려진다. 아직 공개할 단계가 아니다
 * - 링크도 함께 지우고 문구만 남긴다
 */
const EMBED_REMOVE = [
  ['* [2026 Plan Note](https://gist.github.com/devFancy/c6724b137755ac8c655008469d9e32e8)\n\n<script src="https://gist.github.com/devFancy/c6724b137755ac8c655008469d9e32e8.js"></script>\n\n', ''],
];

/* NOTE 본문에 남은 Jekyll 개발 서버 주소를 실제 경로로 바꾼다
 * - 127.0.0.1:4000 은 글쓴이 컴퓨터에서만 열린다. 배포본에서 깨져 있었다
 * - #Side_Project 는 4-2-1 재편으로 "사이드프로젝트" 태그가 됐다
 */
const LINK_FIX = [
  ['http://127.0.0.1:4000/category/#Side_Project', '/category/#사이드프로젝트'],
  ['http://127.0.0.1:4000/', '/'],
];

/* NOTE 약어 폴더는 무엇인지 알아볼 수 없어 이름을 편다 (이미지 이관 B안)
 * - 나머지 34개 폴더는 그대로 둔다. 전면 재편은 이관이 끝난 뒤 따로 한다
 */
const IMAGE_DIR_RENAME = [
  ['/assets/img/bs/', '/assets/img/business-statistics/'],
  ['/assets/img/ef/', '/assets/img/electronic-finance/'],
  ['/assets/img/ps/', '/assets/img/probability-statistics/'],
  ['/assets/img/goodcode/', '/assets/img/clean-code/'],
  ['/assets/img/record/', '/assets/img/dev-history/'],
];

/* NOTE use_math 가 빠졌지만 진짜 수식이 있는 글. 전역 적용이 기존 버그를 고쳐준다 (4-4-1) */
const ADD_USE_MATH = new Set([
  '2022-06-01-EF-07-Cryptography.md',
  '2023-02-05-OS-19-TLB.md',
]);

const warnings = [];
const stats = {
  total: 0, cats: new Map(), useMath: 0, escaped: 0, escapedFiles: 0,
  siteUrl: 0, imgFix: 0, raw: 0, toc: 0, rawHtml: 0, spaces: 0, tags: new Map(), unmapped: new Set(),
};

/** 코드 펜스와 인라인 코드를 분리한다. 짝수 인덱스만 본문이다. */
function splitCode(body) {
  return body.split(/(```[\s\S]*?```|`[^`\n]*`)/);
}

/** 표기 4종을 배열로 정규화한다 (2-4) */
function normalizeCategories(raw) {
  const v = (raw ?? '').trim();
  if (!v) return [];
  if (v.startsWith('[')) {
    return v.slice(1, -1).split(',').map((x) => x.trim()).filter(Boolean);
  }
  return v.split(/\s+/).filter(Boolean); // bare + 공백 구분 다중값
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2] };
}

function convert(file) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) { warnings.push(`${file}: 프론트매터를 읽지 못했다`); return null; }
  let { data, body } = parsed;

  const date = file.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { warnings.push(`${file}: 파일명에서 날짜를 못 얻었다`); return null; }

  // NOTE: 슬러그는 대소문자를 보존하고 공백만 없앤다 (2-2, 8-3-1)
  const stem = file.slice(11).replace(/\.md$/, '');
  const slug = stem.replace(/\s+/g, '');
  if (stem !== slug) { stats.spaces++; warnings.push(`${file}: 파일명 공백 제거 -> ${slug}`); }

  const title = (data.title ?? '').trim().replace(/^["']|["']$/g, '').trim();
  if (!title) warnings.push(`${file}: title 이 비었다`);

  const legacy = normalizeCategories(data.categories);
  if (legacy.length === 0) warnings.push(`${file}: categories 가 비었다`);

  const tags = [];
  const mapped = [];
  for (const c of legacy) {
    if (!CATEGORY[c]) { stats.unmapped.add(c); warnings.push(`${file}: 매핑 없는 카테고리 "${c}"`); }
    if (!mapped.includes(CATEGORY[c] ?? '기타')) mapped.push(CATEGORY[c] ?? '기타');
    for (const tag of refineTag(TAG[c] ?? c, slug, title)) {
      if (!tags.includes(tag)) tags.push(tag);
      stats.tags.set(tag, (stats.tags.get(tag) ?? 0) + 1);
    }
  }
  // 주제 카테고리가 있으면 맥락 카테고리는 떨어뜨린다. 글마다 카테고리는 하나다
  const topic = mapped.filter((c) => !CONTEXT_CATEGORY.has(c));
  const categories = [...new Set((topic.length ? topic : mapped).map((c) => refineCategory(c, tags, slug)))];

  /* NOTE "사이드프로젝트" 는 프로젝트 카테고리에서만 뜻이 있다
   * - 기술 글로 분류된 Goodfriends·Hibit 8편에서 빼야 태그가 한 카테고리에만 남는다
   * - 그 8편은 Spring Boot·성능테스트 같은 기술 태그로 이미 찾을 수 있다
   */
  if (!categories.includes('프로젝트')) {
    const i = tags.indexOf('사이드프로젝트');
    if (i >= 0) tags.splice(i, 1);
  }
  for (const c of categories) stats.cats.set(c, (stats.cats.get(c) ?? 0) + 1);

  const useMath = data.use_math?.toLowerCase() === 'true' || ADD_USE_MATH.has(file);
  if (useMath) stats.useMath++;

  // {{site.url}} 제거. site.url 이 빈 값이라 지우면 그대로 동작한다 (2-3)
  let n = (body.match(/\{\{\s*site\.url\s*\}\}/g) ?? []).length;
  if (n) { body = body.replace(/\{\{\s*site\.url\s*\}\}/g, ''); stats.siteUrl += n; }

  // 이미지 경로 오타, 약어 폴더명, 개발 서버 주소를 바로잡는다
  for (const [from, to] of [...IMAGE_PATH_FIX, ...IMAGE_DIR_RENAME, ...LINK_FIX, ...EMBED_REMOVE]) {
    if (body.includes(from)) { body = body.split(from).join(to); stats.imgFix++; }
  }

  // {% raw %} / {% endraw %} 제거. 본문이 Liquid 를 설명하는 글이라 결과 확인이 필요하다
  n = (body.match(/\{%\s*(?:end)?raw\s*%\}/g) ?? []).length;
  if (n) {
    body = body.replace(/^[ \t]*\{%\s*(?:end)?raw\s*%\}[ \t]*\r?\n?/gm, '').replace(/\{%\s*(?:end)?raw\s*%\}/g, '');
    stats.raw += n;
    warnings.push(`${file}: {% raw %} ${n}건 제거. 렌더 결과 확인 필요`);
  }

  // kramdown 목차. 기능은 Toc 컴포넌트가 대체한다 (4-4)
  n = (body.match(/^\* content\r?\n\{:toc\}\r?\n?/gm) ?? []).length;
  if (n) { body = body.replace(/^\* content\r?\n\{:toc\}\r?\n?/gm, ''); stats.toc += n; }

  /* NOTE 수식이 전역 적용되므로 비수식 글의 $ 를 이스케이프한다 (4-4-1)
   * - 코드 블록 밖에서만 바꾼다. 코드 안 {{traceId}} 같은 것은 건드리지 않는다
   */
  if (!useMath) {
    const parts = splitCode(body);
    // $ 가 하나뿐이면 쌍이 안 되므로 수식으로 해석되지 않는다. 건드리지 않는다
    let total = 0;
    for (let i = 0; i < parts.length; i += 2) total += (parts[i].match(/\$/g) ?? []).length;
    if (total >= 2) {
      for (let i = 0; i < parts.length; i += 2) parts[i] = parts[i].replace(/\$/g, '\\$');
      body = parts.join('');
      stats.escaped += total;
      stats.escapedFiles++;
    }
  }

  if (/<(br|img|div|span|a|table)\b/i.test(body)) stats.rawHtml++;

  const fm = ['---', `title: ${JSON.stringify(title)}`, `date: ${date}`,
    `categories: [${categories.map((c) => JSON.stringify(c)).join(', ')}]`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`];
  if (useMath) fm.push('use_math: true');
  fm.push('---');

  stats.total++;
  return { slug, content: `${fm.join('\n')}\n\n${body.replace(/^\n+/, '')}` };
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md')).sort();
/* NOTE 출력 폴더를 통째로 지우지 않는다
 * - 이 저장소는 iCloud 동기화 폴더 안에 있다. 대량 삭제 후 즉시 재생성하면
 *   iCloud 가 충돌로 보고 "파일 2.md" 같은 사본을 만든다
 * - 덮어쓰고, 더 이상 생성되지 않는 파일만 골라서 지운다
 */
if (WRITE) fs.mkdirSync(OUT, { recursive: true });
const produced = new Set();

const seen = new Map();
for (const f of files) {
  const r = convert(f);
  if (!r) continue;
  if (seen.has(r.slug)) warnings.push(`슬러그 충돌: ${r.slug} (${seen.get(r.slug)} vs ${f})`);
  seen.set(r.slug, f);
  if (WRITE) {
    produced.add(`${r.slug}.md`);
    const dest = path.join(OUT, `${r.slug}.md`);
    const prev = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
    if (prev !== r.content) fs.writeFileSync(dest, r.content);
  }
}

if (WRITE) {
  for (const f of fs.readdirSync(OUT)) {
    if (f.endsWith('.md') && !produced.has(f)) {
      fs.rmSync(path.join(OUT, f));
      warnings.push(`더 이상 생성되지 않아 삭제: ${f}`);
    }
  }
}

console.log(`${WRITE ? '변환' : 'DRY-RUN'}  입력 ${files.length}편 → 출력 ${stats.total}편`);
console.log(`  카테고리      ${stats.cats.size}종  ${[...stats.cats.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(' · ')}`);
console.log(`  태그          ${stats.tags.size}종`);
if (stats.unmapped.size) console.log(`  ** 매핑 없음  ${[...stats.unmapped].join(', ')} **`);
console.log(`  use_math      ${stats.useMath}편`);
console.log(`  $ 이스케이프  ${stats.escaped}건 / ${stats.escapedFiles}개 파일`);
console.log(`  {{site.url}}  ${stats.siteUrl}건`);
console.log(`  이미지 경로 교정 ${stats.imgFix}건`);
console.log(`  {% raw %}     ${stats.raw}건`);
console.log(`  {:toc} 제거   ${stats.toc}건`);
console.log(`  날 HTML 포함  ${stats.rawHtml}편`);
console.log(`  파일명 공백   ${stats.spaces}건`);
console.log(`\n경고 ${warnings.length}건`);
for (const w of warnings) console.log(`  - ${w}`);
