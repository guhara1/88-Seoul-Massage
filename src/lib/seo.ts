import { SITE } from "./site";

/** 80자 이내로 메타 디스크립션을 자른다 (단어 잘림 최소화) */
export function clampDescription(text: string, max = 80): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  if (!path.startsWith("/")) path = "/" + path;
  return base + path;
}

interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList JSON-LD */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** 사이트 전역 LocalBusiness 스키마 (상호/전화/서비스 지역) */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    alternateName: SITE.brandEn,
    url: SITE.url,
    image: absoluteUrl(SITE.ogImage),
    telephone: SITE.phone,
    priceRange: "₩₩",
    description: clampDescription(SITE.tagline),
    areaServed: [
      { "@type": "City", name: "서울특별시" },
      { "@type": "AdministrativeArea", name: "경기도" },
      { "@type": "City", name: "인천광역시" },
      { "@type": "City", name: "부산광역시" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "05:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "reservations",
      areaServed: "KR",
      availableLanguage: ["Korean"],
    },
  };
}

/** WebSite 스키마 (사이트명 + 검색) */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.name,
    description: clampDescription(SITE.tagline),
    inLanguage: "ko-KR",
    publisher: { "@id": absoluteUrl("/#business") },
  };
}

interface FaqItem {
  q: string;
  a: string;
}

/** FAQPage 스키마 */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** 서비스 지역 안내 페이지용 Service 스키마 */
export function serviceAreaSchema(areaName: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "출장마사지·홈타이 방문 관리 안내",
    provider: { "@id": absoluteUrl("/#business") },
    areaServed: { "@type": "Place", name: areaName },
    url: absoluteUrl(path),
  };
}

interface ReviewItem {
  rating: number;
  author: string;
  date: string;
  title: string;
  content: string;
}

/** 고객 후기 및 평점 스키마 */
export function aggregateRatingSchema(
  areaName: string,
  reviews: ReviewItem[]
) {
  if (reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: parseFloat(avgRating.toFixed(1)),
    ratingCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}
