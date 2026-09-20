/* NOTE Jekyll _posts 319편을 Astro content collection 으로 옮긴다 (MIGRATION.md 8-3-1)
 * - 수작업 금지. 규칙이 바뀌면 이 파일을 고치고 다시 돌린다
 * - 기본은 dry-run 이다. 실제로 쓰려면 --write 를 준다
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
  'E.T.C': '기타', Workout: '운동', Competition: '공모전',
  Git: 'Git', IntelliJ: 'IntelliJ',
  Retrospective: '회고', DevHistory: '개발기록',
  Essay: '에세이', Book: '책',
};

/* NOTE Technology 안에 블로그 운영 글이 섞여 있다. 이 3편만 기타로 보낸다 */
const CATEGORY_OVERRIDE = {
  'Technology-GitHub-Readme': '기타',
  'Technology-Google-Research-Console-Verification': '기타',
  'Technology-utterances': '기타',
};

/* NOTE use_math 가 빠졌지만 진짜 수식이 있는 글. 전역 적용이 기존 버그를 고쳐준다 (4-4-1) */
const ADD_USE_MATH = new Set([
  '2022-06-01-EF-07-Cryptography.md',
  '2023-02-05-OS-19-TLB.md',
]);

const warnings = [];
const stats = {
  total: 0, cats: new Map(), useMath: 0, escaped: 0, escapedFiles: 0,
  siteUrl: 0, raw: 0, toc: 0, rawHtml: 0, spaces: 0, tags: new Map(), unmapped: new Set(),
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
    const cat = CATEGORY[c] ?? '기타';
    if (!mapped.includes(cat)) mapped.push(cat);
    const tag = TAG[c] ?? c;
    if (!tags.includes(tag)) tags.push(tag);
    stats.tags.set(tag, (stats.tags.get(tag) ?? 0) + 1);
  }
  const categories = CATEGORY_OVERRIDE[slug] ? [CATEGORY_OVERRIDE[slug]] : mapped;
  for (const c of categories) stats.cats.set(c, (stats.cats.get(c) ?? 0) + 1);

  const useMath = data.use_math?.toLowerCase() === 'true' || ADD_USE_MATH.has(file);
  if (useMath) stats.useMath++;

  // {{site.url}} 제거. site.url 이 빈 값이라 지우면 그대로 동작한다 (2-3)
  let n = (body.match(/\{\{\s*site\.url\s*\}\}/g) ?? []).length;
  if (n) { body = body.replace(/\{\{\s*site\.url\s*\}\}/g, ''); stats.siteUrl += n; }

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
console.log(`  {% raw %}     ${stats.raw}건`);
console.log(`  {:toc} 제거   ${stats.toc}건`);
console.log(`  날 HTML 포함  ${stats.rawHtml}편`);
console.log(`  파일명 공백   ${stats.spaces}건`);
console.log(`\n경고 ${warnings.length}건`);
for (const w of warnings) console.log(`  - ${w}`);
