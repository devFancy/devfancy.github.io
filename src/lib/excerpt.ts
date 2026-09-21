const DROP = [
  /```[\s\S]*?```/g,
  /^\s*>.*$/gm, // 인용 줄 통째로. 글 첫머리의 "개인적인 생각임을 감안해 달라" 같은 머리말을 집지 않게 한다
  /^#{1,6}\s+.*$/gm,
  /!\[[^\]]*\]\([^)]*\)/g,
  /<[^>]+>/g,
  /\{:[^}]*\}/g, // Kramdown 잔재
  /[*_`]/g,
];

export function excerptOf(body: string, limit = 90): string {
  let t = body;
  for (const re of DROP) t = t.replace(re, " ");
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  t = t.replace(/\s+/g, " ").trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > limit * 0.6 ? cut.slice(0, sp) : cut).replace(/[,·]$/, "")}...`;
}
