export const SITE = {
  title: "devfancy",
  description: "백엔드 개발자 문준용의 기록",
  /* NOTE Hero 는 한글 문구가 제목, 영문 슬로건이 부제목이다
   * - 문구를 바꾸려면 여기만 고치면 된다
   */
  hero: {
    title: "팬시의 개발 블로그에 와주셔서 감사합니다",
    subtitle: "My path, my pace, no regrets.",
  },
} as const;

// NOTE: 문제풀이 글은 메인/목록에서 빼고 /solutions/에 모은다. 개별 글 URL은 그대로 (4-2)
export const SOLUTION_CATEGORIES = ["Algorithm", "AlgorithmSkill", "LeetCode"] as const;

/* NOTE 연락 수단. 이메일은 사용자 요청으로 포함한다
 * - 4-5 는 "이메일 직접 노출 안 함" 이었다. 이 결정은 MIGRATION.md 에 반영해야 한다
 * - 전화번호는 넣지 않는다
 */
export const SOCIAL = [
  { name: "GitHub", url: "https://github.com/devFancy" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/junyong-moon-479385264" },
  { name: "Mail", url: "mailto:fancy.junyongmoon@gmail.com" },
] as const;

export const PROFILE = {
  name: "문준용",
  intro:
    "사용자에게 즐거운 경험을 주고 비즈니스 가치를 높이는 일에 관심 있는 소프트웨어 개발자입니다. 배운 것과 실패·성공의 과정을 함께 기록합니다.",
} as const;
