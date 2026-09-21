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
