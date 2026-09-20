/* NOTE 프론트매터 thumbnail 에 적힌 사진만 목록·상세용 크기로 줄여 둔다 [대표 이미지]
 * - 본문 첫 이미지를 자동으로 쓰지 않는다. 190편 중 172편이 스크린샷·다이어그램이라
 *   커버로 쓰면 제목을 밀어내고 본문에서 곧 다시 볼 그림을 앞에 한 번 더 보여줄 뿐이다
 * - 원본은 14MB 짜리도 있어 그대로 쓰면 상세 페이지가 그걸 다 받는다
 * - 결과는 public/assets/cover/ 에 두고 gitignore 한다. 저장소를 키우지 않고 CI 가 다시 만든다
 * - npm 이 build/dev 앞에서 자동으로 돌린다 (prebuild, predev)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'assets/cover');
/* 가로 띠에 깔리는 사진이라 미리 16:9 한 장으로 만들어 둔다
 * - 어디를 남길지는 프론트매터 thumbnailPosition 으로 고른다 (top · center · bottom)
 * - 자동 판별(attention)은 밝은 곳을 고르느라 피사체를 놓쳤다. 19편뿐이라 직접 고르는 편이 낫다
 */
const WIDTH = 2000;
const HEIGHT = 1125;

const FRONT_THUMB = /^thumbnail:\s*["']?([^"'\n]+)["']?\s*$/m;
const FRONT_POS = /^thumbnailPosition:\s*["']?(top|center|bottom)["']?\s*$/m;
const GRAVITY = { top: 'north', center: 'center', bottom: 'south' };

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(POSTS).filter((f) => f.endsWith('.md'));
const wanted = new Map(); // 출력 파일명 -> 원본 경로
for (const f of files) {
  const raw = fs.readFileSync(path.join(POSTS, f), 'utf8');
  const src = raw.match(FRONT_THUMB)?.[1];
  if (!src) continue;
  const pos = raw.match(FRONT_POS)?.[1] ?? 'center';
  const abs = path.join(PUBLIC, decodeURIComponent(src));
  if (!fs.existsSync(abs)) continue;
  wanted.set(`${f.replace(/\.md$/, '')}.webp`, { abs, pos });
}

let made = 0, kept = 0, failed = 0, bytesIn = 0, bytesOut = 0;
await Promise.all(
  [...wanted].map(async ([name, { abs, pos }]) => {
    const dest = path.join(OUT, name);
    const src = fs.statSync(abs);
    bytesIn += src.size;
    // 원본이 더 새것일 때만 다시 만든다
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

// 더 이상 필요 없는 결과물은 지운다
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
