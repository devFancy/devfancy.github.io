/* NOTE 글의 대표 이미지 경로를 돌려준다 [대표 이미지]
 * - 파일은 scripts/make-covers.mjs 가 빌드 전에 만든다. 이름은 글 슬러그를 따른다
 * - 프론트매터에 thumbnail 을 적은 글만 대상이다. 본문 이미지를 자동으로 쓰지 않는다
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public/assets/cover");

/* 빌드 한 번에 수백 번 불리므로 폴더를 한 번만 읽는다 */
let made: Set<string> | null = null;
function available(): Set<string> {
  if (!made) {
    try {
      made = new Set(fs.readdirSync(DIR));
    } catch {
      made = new Set();
    }
  }
  return made;
}

export function coverOf(entry: { id: string }): string | undefined {
  const file = `${entry.id}.webp`;
  return available().has(file) ? `/assets/cover/${encodeURIComponent(file)}` : undefined;
}
