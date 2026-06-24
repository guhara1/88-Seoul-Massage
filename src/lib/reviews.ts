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

/** 페이지마다 평점이 살짝 달라지도록 시드 기반 미세 조정 (4.6 ~ 4.9 범위) */
export function ratingForArea(
  parentSlug: string,
  regionSlug: string | null,
  reviews: Review[]
): { avg: number; count: number } {
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const raw =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const seed = hashSeed(`${parentSlug}/${regionSlug ?? ""}:rating`);
  // ±0.15 범위 변동
  const drift = ((seed % 31) - 15) / 100;
  const adjusted = Math.min(5, Math.max(4.5, raw + drift));
  return { avg: Math.round(adjusted * 10) / 10, count: reviews.length };
}
