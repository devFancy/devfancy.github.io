/* 기본 이미지의 오로라 띠 위치를 슬러그에서 뽑아 글마다 어긋나게 한다. 새로고침해도 늘 같은 자리다 */
export function blankLight(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) % 997;
  return `--au-1:${14 + (h % 22)}%;--au-2:${50 + ((h >> 2) % 18)}%;--au-3:${78 + ((h >> 4) % 16)}%`;
}
