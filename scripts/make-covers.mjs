/* 프론트매터 thumbnail 을 적은 글만 대상이다. 본문 첫 이미지는 190편 중 172편이 스크린샷이라 커버로 쓰지 않는다
 * - 결과는 gitignore 하고 CI 가 다시 만든다. npm 이 build/dev 앞에서 자동으로 돌린다
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'assets/cover');
/* 어디를 남길지는 프론트매터 thumbnailPosition 으로 고른다. 자동 판별(attention)은 밝은 곳을 고르느라 피사체를 놓쳤다 */
const WIDTH = 2000;
const HEIGHT = 1125;

const FRONT_THUMB = /^thumbnail:\s*["']?([^"'\n]+)["']?\s*$/m;
const FRONT_POS = /^thumbnailPosition:\s*["']?(top|center|bottom)["']?\s*$/m;
const GRAVITY = { top: 'north', center: 'center', bottom: 'south' };

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(POSTS).filter((f) => f.endsWith('.md'));
const wanted = new Map();
const missing = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(POSTS, f), 'utf8');
  const src = raw.match(FRONT_THUMB)?.[1];
  if (!src) continue;
  const pos = raw.match(FRONT_POS)?.[1] ?? 'center';
  const abs = path.join(PUBLIC, decodeURIComponent(src));
  /* 사진 파일을 지우고 프론트매터를 안 고치면 커버가 조용히 사라지므로 알린다 */
  if (!fs.existsSync(abs)) {
    missing.push(`${f} -> ${src}`);
    continue;
  }
  wanted.set(`${f.replace(/\.md$/, '')}.webp`, { abs, pos });
}
if (missing.length) {
  console.warn(`[대표 이미지] 사진을 찾지 못해 건너뜁니다 (${missing.length}건)`);
  for (const m of missing) console.warn(`  ${m}`);
}

let made = 0, kept = 0, failed = 0, bytesIn = 0, bytesOut = 0;
await Promise.all(
  [...wanted].map(async ([name, { abs, pos }]) => {
    const dest = path.join(OUT, name);
    const src = fs.statSync(abs);
    bytesIn += src.size;
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= src.mtimeMs) {
      bytesOut += fs.statSync(dest).size;
      kept++;
      return;
    }
    try {
      await sharp(abs)
        .rotate()
        .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: GRAVITY[pos] })
        .webp({ quality: 80 })
        .toFile(dest);
      bytesOut += fs.statSync(dest).size;
      made++;
    } catch {
      failed++;
    }
  }),
);

let removed = 0;
for (const f of fs.readdirSync(OUT)) {
  if (!wanted.has(f)) { fs.rmSync(path.join(OUT, f)); removed++; }
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(
  `대표 이미지 ${wanted.size}장 · 새로 ${made} · 유지 ${kept}` +
    (failed ? ` · 실패 ${failed}` : '') + (removed ? ` · 정리 ${removed}` : '') +
    ` · ${mb(bytesIn)}MB -> ${mb(bytesOut)}MB`,
);
