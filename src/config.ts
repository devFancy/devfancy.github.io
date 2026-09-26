// NOTE: Jekyll 이 쓰던 ID 그대로다. 바꾸면 지금까지 쌓인 데이터와 끊긴다
export const GA_MEASUREMENT_ID = "G-7BMWW1711K";

export const SITE = {
  title: "devfancy",
  description: "백엔드 개발자 문준용의 기록",
  hero: {
    title: "나답게, 후회 없이",
    subtitle: "My path, my pace, no regrets.",
  },
} as const;

export const NAV = [
  { label: "Archives", href: "/archive/" },
  { label: "Categories", href: "/category/" },
  { label: "About", href: "/about/" },
] as const;

/* 프론트매터에는 잎만 적는다. 부모까지 넣으면 카드마다 정보 없는 "기술" 칩이 붙는다 */
export const CATEGORY_GROUPS = [
  { name: "기술", children: ["서버", "CS", "알고리즘", "도구", "프로젝트"] },
  { name: "에세이", children: ["생각", "회고", "서평"] },
  { name: "기타", children: [] },
  { name: "대학교", children: [] },
] as const;

/* 여기 적힌 순서가 먼저다. 가나다순은 Spring 과 JPA 사이에 한글이 끼어 읽기 나쁘다 */
export const TAG_ORDER = [
  "Spring",
  "Spring Boot",
  "JPA",
  "Java",
  "Kafka",
  "성능테스트",
  "클린코드",
  "리눅스",
  "Flyway",
  "우아한테크코스",
  "AssertJ",
  "후기",
  "자료구조",
  "운영체제",
  "네트워크",
  "HTTP",
  "데이터베이스",
  "MySQL",
  "확률통계",
  "경영통계",
  "전자금융",
  "블로그",
  "운동",
] as const;

/* 손으로 고른 차례가 곧 화면 순서다. 날짜로 다시 세우지 않는다
 * - 모두 thumbnail 이 있어야 한다. 오타는 빌드 경고로 알려준다 (src/pages/index.astro)
 */
export const FEATURED = [
  "Book-Interview-Questions",
  "springboot-test-strategy",
  "SpringBoot-Logging-Filter",
  "Book-The-One-Who-Leaves-People-Behind",
  "DDD-Week1-Review-And-EventStorming",
] as const;

// NOTE: 문제풀이는 메인/목록에서 빼고 /solutions/ 에 모은다. 글 URL 은 그대로 [문제풀이 분리]
export const SOLUTION_CATEGORIES = ["알고리즘"] as const;

/* NOTE: 좋아요 카운터가 사는 Realtime Database. 비어 있으면 버튼이 렌더되지 않는다
 * - 규칙은 firebase/database.rules.json 에 있다
 */
export const LIKES_DB = "https://devfancy-f3614-default-rtdb.asia-southeast1.firebasedatabase.app";

export const SOCIAL = [
  { name: "GitHub", url: "https://github.com/devFancy" },
  { name: "Mail", url: "mailto:fancy.junyongmoon@gmail.com" },
] as const;

export const PROFILE = {
  name: "문준용",
} as const;
