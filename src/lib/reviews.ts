import reviewsData from "../data/reviews.json";

export interface Review {
  id: string;
  parentSlug: string;
  regionSlug: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
}

export const allReviews = reviewsData as Review[];

/** 문자열 시드 → 32bit 해시 (결정적 셔플용) */
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 시드 기반 결정적 셔플 — 같은 시드면 항상 같은 순서 */
function deterministicShuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  const rng = mulberry32(hashSeed(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 지역 페이지용 후기 선별
 *  - 1순위: 지역(시군구) 정확 매칭 후기
 *  - 2순위: 같은 시도 풀에서 시드 기반으로 채워넣기
 *  - 결과: 항상 count개 (풀이 모자라면 가능한 만큼)
 *  - 시드를 페이지 슬러그로 사용 → 페이지마다 다른 6개가 노출되어 중복/도어웨이 신호 완화
 */
export function reviewsForArea(
  parentSlug: string,
  regionSlug: string | null,
  count = 6
): Review[] {
  const seed = `${parentSlug}/${regionSlug ?? ""}`;

  const exact = allReviews.filter(
    (r) => r.parentSlug === parentSlug && (regionSlug ? r.regionSlug === regionSlug : true)
  );
  const sidoPool = allReviews.filter((r) => r.parentSlug === parentSlug);
  const others = allReviews.filter((r) => r.parentSlug !== parentSlug);

  const shuffled = [
    ...deterministicShuffle(exact, seed),
    ...deterministicShuffle(
      sidoPool.filter((r) => !exact.includes(r)),
      seed + ":sido"
    ),
    ...deterministicShuffle(others, seed + ":all"),
  ];

  // 중복 제거(id)
  const seen = new Set<string>();
  const out: Review[] = [];
  for (const r of shuffled) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
    if (out.length >= count) break;
  }
  return out;
}

/**
 * 표시 후기의 실제 평균을 평점으로 사용한다.
 * 후기 자체가 페이지마다 시드 셔플되므로 평균도 자연스럽게 달라지며,
 * aggregateRating 값이 실제 review[] 배열과 일치해 구글 구조화 데이터
 * 일관성 검사를 통과한다. (인위적 drift 제거)
 */
export function ratingForArea(
  _parentSlug: string,
  _regionSlug: string | null,
  reviews: Review[]
): { avg: number; count: number } {
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const raw =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: Math.round(raw * 10) / 10, count: reviews.length };
}

/**
 * 지역에 묶이지 않는 페이지(프로그램·서비스·생활권 등)용 후기 선별.
 * 전체 후기 풀을 시드 기반으로 결정적 셔플해 count개를 뽑는다.
 * 같은 시드(=같은 슬러그)는 항상 같은 후기 → 빌드 안정성 + 페이지별 변화.
 */
export function reviewsBySeed(seed: string, count = 6): Review[] {
  const shuffled = deterministicShuffle(allReviews, seed);
  const seen = new Set<string>();
  const out: Review[] = [];
  for (const r of shuffled) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
    if (out.length >= count) break;
  }
  return out;
}

/** reviewsBySeed 결과의 실제 평균 평점 (구조화 데이터 일관성 보장) */
export function ratingFor(reviews: Review[]): { avg: number; count: number } {
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const raw = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: Math.round(raw * 10) / 10, count: reviews.length };
}
