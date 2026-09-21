/* NOTE 목록 카드에 붙일 본문 미리보기를 만든다 [홈 격자]
 * - 프론트매터 summary 가 있으면 그것을 쓰고, 없으면 본문 첫 문단에서 뽑는다
 * - 319편 대부분이 summary 가 없다. 글마다 손으로 적게 하면 새 글에서 또 빠진다
 */
const DROP = [
  /```[\s\S]*?```/g, // 코드 블록
  /^\s*>.*$/gm, // 인용 줄 통째로. 글 첫머리의 "개인적인 생각임을 감안해 달라" 같은 머리말을 집지 않게 한다
  /^#{1,6}\s+.*$/gm, // 제목 줄
  /!\[[^\]]*\]\([^)]*\)/g, // 이미지
  /<[^>]+>/g, // HTML 태그
  /\{:[^}]*\}/g, // Kramdown 잔재
  /[*_`]/g, // 강조 기호
];

export function excerptOf(body: string, limit = 90): string {
  let t = body;
  for (const re of DROP) t = t.replace(re, ' ');
  // 링크는 글자만 남긴다
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length <= limit) return t;
  /* 자를 자리는 마지막 공백이다. 낱말 가운데서 끊으면 읽다 만 것처럼 보인다 */
  const cut = t.slice(0, limit);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > limit * 0.6 ? cut.slice(0, sp) : cut).replace(/[,·]$/, '')}...`;
}
