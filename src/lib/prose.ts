// 문장 변형 시스템 — 시드(지역 슬러그)로 여러 문장 변형 중 하나를 결정적으로
// 선택한다. 같은 시드는 항상 같은 결과를 내므로 빌드가 재현 가능하면서도,
// 지역마다 문장 구조 자체가 달라져 지역명만 치환된 중복 본문을 피한다.

/** 문자열 → 32bit 해시 (reviews.ts와 동일 알고리즘) */
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 시드 + 슬롯 키로 variants 중 하나를 결정적으로 고른다 */
export function pick(seed: string, slot: string, variants: string[]): string {
  if (variants.length === 0) return "";
  const h = hashSeed(`${seed}::${slot}`);
  return variants[h % variants.length];
}

/** 여러 슬롯에서 변형을 골라 이어붙인다 (문단 조립) */
export function compose(
  seed: string,
  blocks: Array<{ slot: string; variants: string[] }>
): string {
  return blocks
    .map((b) => pick(seed, b.slot, b.variants))
    .filter(Boolean)
    .join(" ");
}

interface GuVars {
  region: string; // 지역명 (예: 강남구)
  sido: string; // 시도명 (예: 서울)
  focus: string; // contentFocus 문장
  areas: string[]; // nearbyAreas
  stations: string[]; // nearbyStations
}

/**
 * 시군구 "찾을 때 확인할 기준" 도입부 — 시드에 따라 도입 문장과
 * 강조점이 달라진다. contentFocus·실제 동/역명을 결합해 고유성을 높인다.
 */
export function guIntro(seed: string, v: GuVars): string[] {
  const a = v.areas.slice(0, 3).join(", ");
  const st = v.stations.slice(0, 3).join(", ");
  const st2 = v.stations[0] ?? "인근 역";

  const opening = pick(seed, "gu.open", [
    `${v.region}는 ${v.focus} 이런 특성 때문에 출장마사지·홈타이를 찾을 때도 생활권에 따라 방문 동선이 달라집니다.`,
    `${v.region}에서 출장마사지·홈타이를 찾으신다면, 먼저 ${v.region}의 지역 성격을 이해하는 것이 도움이 됩니다. ${v.focus}`,
    `${v.focus} ${v.region}는 이런 환경 위에서 상권과 주거지가 맞물려 있어, 방문 위치에 따라 예약 조건이 조금씩 달라집니다.`,
    `${v.region}는 ${v.sido} 안에서도 고유한 생활권을 가진 지역입니다. ${v.focus}`,
  ]);

  const areaSentence = pick(seed, "gu.area", [
    `대표 생활권으로는 ${a} 등이 있어, 이들 행정동을 기준으로 가까운 역과 방문 동선을 함께 확인하면 예약이 수월합니다.`,
    `${a} 같은 행정동이 ${v.region}의 중심 생활권을 이루며, 각 동마다 상권과 주거 비중이 달라 방문 가능 시간대도 차이가 납니다.`,
    `방문이 잦은 ${a} 일대를 기준으로 보면, 같은 ${v.region} 안에서도 생활권별 동선과 추가 이동비 기준이 달라질 수 있습니다.`,
    `${a} 등 주요 행정동은 ${st2} 생활권과 맞닿아 있어, 자택·호텔·오피스텔 위치에 따라 가까운 동을 기준으로 방문 위치를 정하면 편리합니다.`,
  ]);

  const stationSentence = pick(seed, "gu.station", [
    `${v.region}과 가까운 지하철역으로는 ${st} 등이 있어, 역세권 생활권과 주거지 생활권의 방문 동선이 구분됩니다.`,
    `교통 면에서는 ${st} 등이 ${v.region}의 주요 접근 축이 되며, 역에서 떨어진 주거 구역은 심야·주말 방문 가능 여부를 미리 확인하는 편이 좋습니다.`,
    `${st} 같은 역을 기준으로 동선을 잡으면, ${v.region} 안에서 업무 구역과 주거 구역의 서로 다른 예약 조건을 구분하기 쉽습니다.`,
    `${v.region}는 ${st} 인근을 중심으로 접근성이 좋은 편이며, 역과의 거리에 따라 도보·차량 동선과 추가 이동비 기준이 달라집니다.`,
  ]);

  return [`${opening} ${areaSentence}`, stationSentence];
}

interface DongVars {
  dong: string;
  gu: string;
  character: string;
  landmarks: string[];
  adjacent: string[];
  stations: string[];
}

/** 행정동 생활권 소개 보강 문단 — 시드에 따라 문장이 달라진다 */
export function dongIntro(seed: string, v: DongVars): string {
  const lm = v.landmarks.slice(0, 2).join(", ") || `${v.dong} 일대`;
  const adj = v.adjacent.slice(0, 3).join(", ") || v.gu;
  const st = v.stations.slice(0, 2).join(", ") || "인근 역";

  return compose(seed, [
    {
      slot: "dong.a",
      variants: [
        `${v.dong}은 ${lm} 일대를 중심으로 ${v.character} 생활권을 형성합니다.`,
        `${lm}을 끼고 있는 ${v.dong}은 ${v.character} 분위기가 두드러지는 지역입니다.`,
        `${v.dong}의 생활권은 ${lm}을 축으로 ${v.character} 특성을 띱니다.`,
      ],
    },
    {
      slot: "dong.b",
      variants: [
        `${v.gu} 안에서도 ${v.dong}은 상권과 주거지가 만나는 위치라, 방문 가능 지역과 동선을 함께 확인하면 예약이 수월합니다.`,
        `${v.gu}의 다른 동과 비교하면 ${v.dong}은 ${st} 접근성과 생활 편의가 균형을 이루는 편입니다.`,
        `${v.dong}은 ${v.gu} 생활권의 한 축으로, 방문 위치에 따라 예약 가능 시간과 추가 이동비 기준이 달라질 수 있습니다.`,
      ],
    },
    {
      slot: "dong.c",
      variants: [
        `${st} 등 가까운 역과 ${adj} 인접 지역을 함께 고려하는 방식을 권장합니다.`,
        `방문 동선은 ${st} 기준으로 잡되, ${adj} 방면 이동 여부도 함께 확인하면 좋습니다.`,
        `${adj}과 맞닿아 있어, ${st} 인근을 기준으로 방문 위치를 정하면 동선을 정리하기 쉽습니다.`,
      ],
    },
  ]);
}
