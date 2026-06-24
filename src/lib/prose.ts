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

// ── 제목(H1/H2) 변형 ─────────────────────────────────────────────
// 지역명·SEO 키워드(출장마사지·홈타이)는 유지하되 표현을 페이지마다 다르게.
// 옛 사이트와 동일하던 원본 문구는 풀에서 제외해 어느 페이지도 일치하지 않게 함.

/** 시군구/구 H1 */
export function h1Gu(seed: string, r: string): string {
  return pick(seed, "h1.gu", [
    `${r} 출장마사지·홈타이 — 생활권별 방문 예약 안내`,
    `${r} 홈타이·출장마사지 지역 안내`,
    `${r} 방문 출장마사지·홈타이 예약 가이드`,
    `${r} 출장마사지·홈타이 생활권 예약 안내`,
    `${r} 지역별 출장마사지·홈타이 방문 안내`,
  ]);
}

/** 행정동 H1 */
export function h1Dong(seed: string, d: string): string {
  return pick(seed, "h1.dong", [
    `${d} 출장마사지·홈타이 방문 예약 안내`,
    `${d} 홈타이·출장마사지 생활권 안내`,
    `${d} 방문 마사지 예약 — ${d} 출장·홈타이`,
    `${d} 출장마사지·홈타이 동네 예약 가이드`,
    `${d} 생활권 출장마사지·홈타이 안내`,
  ]);
}

/** 역 H1 */
export function h1Station(seed: string, s: string): string {
  return pick(seed, "h1.st", [
    `${s} 인근 출장마사지·홈타이 방문 안내`,
    `${s} 역세권 홈타이·출장마사지 예약 가이드`,
    `${s} 주변 출장마사지·홈타이 안내`,
    `${s} 역 출장마사지·홈타이 방문 예약`,
    `${s} 일대 홈타이·출장마사지 예약 안내`,
  ]);
}

/** "찾을 때 확인할 기준" 류 H2 (지역명만 들어가는 도입 H2) */
export function h2Intro(seed: string, r: string, suffix = "에서"): string {
  return pick(seed, "h2.intro", [
    `${r} 출장마사지·홈타이 예약 전 확인 포인트`,
    `${r}${suffix} 방문 관리를 고를 때 보는 기준`,
    `${r} 출장마사지를 예약하기 전 살펴볼 점`,
    `${r}${suffix} 홈타이·출장마사지를 고를 때 기준`,
    `${r} 방문 예약 전 짚어 둘 확인사항`,
  ]);
}

/** "예약 전 확인사항" H2 */
export function h2Reserve(seed: string, r: string): string {
  return pick(seed, "h2.res", [
    `${r} 방문 예약 전 점검 항목`,
    `${r} 출장마사지 예약 시 확인할 것`,
    `${r} 홈타이 예약 전 챙길 사항`,
    `${r} 방문 전 확인하면 좋은 항목`,
  ]);
}

/** "주변 방문 가능 지역" H2 */
export function h2Access(seed: string, r: string): string {
  return pick(seed, "h2.acc", [
    `${r}에서 방문할 수 있는 인접 지역`,
    `${r} 방문 가능 동선과 인접 생활권`,
    `${r} 주변 방문 가능 범위`,
    `${r}과 이어지는 방문 가능 지역`,
  ]);
}

/** "주변 상권·주거 환경" H2 */
export function h2Commerce(seed: string, r: string): string {
  return pick(seed, "h2.com", [
    `${r}의 상권과 주거 분포`,
    `${r} 생활권 — 상권·주거 구성`,
    `${r} 주변 상권·주거 특성`,
    `${r} 일대 상권과 주거 환경`,
  ]);
}

/** 시군구 "지역별/행정동 안내" 섹션 라벨 H2 */
export function h2AreaSection(seed: string, r: string): string {
  return pick(seed, "h2.areasec", [
    `${r} 대표 지역별 방문 가능 지역 안내`,
    `${r} 행정동별 방문 안내`,
    `${r} 주요 동네별 방문 가능 지역`,
    `${r} 지역별 방문 동선 안내`,
  ]);
}

/** 시군구 "역세권 안내" 섹션 라벨 H2 */
export function h2StationSection(seed: string, r: string): string {
  return pick(seed, "h2.stsec", [
    `${r} 주요 지하철역별 홈타이 안내`,
    `${r} 역세권별 출장마사지 안내`,
    `${r} 가까운 역 기준 방문 안내`,
    `${r} 지하철역 중심 홈타이 안내`,
  ]);
}

/** 시군구 "인근 생활권" 섹션 라벨 H2 */
export function h2LifeSection(seed: string, r: string): string {
  return pick(seed, "h2.lifesec", [
    `${r} 인근 생활권 예약 기준`,
    `${r} 생활권별 방문 안내`,
    `${r}과 이어지는 생활권 안내`,
    `${r} 주변 생활권 예약 가이드`,
  ]);
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

/**
 * 예약 전 확인 체크리스트 — 시드에 따라 항목 표현이 달라진다.
 * 모든 페이지가 동일한 <li> 목록이던 것을 분산시켜 중복 비율을 낮춘다.
 */
export function checklistItems(seed: string): string[] {
  const slots: string[][] = [
    [
      "방문 가능 주소 확인 (자택·호텔·오피스텔 동·호수)",
      "정확한 방문 주소와 동·호수 (자택·숙소·오피스텔)",
      "방문지 상세 주소 — 건물명·동·호수 확인",
    ],
    [
      "건물 출입 방식(공동현관·프런트) 확인",
      "공동현관 비밀번호 또는 프런트 출입 절차 확인",
      "출입 방법 — 공동현관·프런트·엘리베이터 보안 여부",
    ],
    [
      "예약 가능 시간과 추가 이동비 여부 확인",
      "희망 시간대와 추가 이동비 발생 여부 확인",
      "방문 가능 시간·추가 이동비 기준 확인",
    ],
    [
      "결제 방식·예약 변경 기준 확인",
      "결제 수단과 예약 변경·취소 기준 확인",
      "결제 방법 및 일정 변경 규정 확인",
    ],
    [
      "개인정보 처리 기준 확인 / 불법·선정적 서비스 불가 안내",
      "개인정보 처리 방침 확인 / 합법적 방문 관리만 제공",
      "개인정보 보호 기준 확인 / 불법·선정적 서비스 미제공",
    ],
  ];
  return slots.map((variants, i) => pick(seed, `chk${i}`, variants));
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

  const closing = pick(seed, "gu.close", [
    `방문 위치와 시간대, 이동 거리에 따라 예약 가능 시간과 추가 이동비 기준이 달라질 수 있으므로, 예약 전에 정확한 주소와 건물 출입 방식을 확인하시면 방문이 매끄럽습니다.`,
    `${v.region} 안에서 어디로 방문하든 정확한 주소와 희망 시간을 먼저 정리해 두면, 가능한 동선과 비용 기준을 빠르게 안내받을 수 있습니다.`,
    `자택·호텔·오피스텔 중 어디로 방문할지와 도착 희망 시간을 함께 알려 주시면, ${v.region} 내 가능한 동선을 기준으로 안내가 진행됩니다.`,
  ]);

  return [`${opening} ${areaSentence}`, `${stationSentence} ${closing}`];
}

/** 시군구 지역별(행정동) 섹션 리드 — 시드 변형 */
export function guAreaLead(seed: string, v: GuVars): string {
  return pick(seed, "gu.arealead", [
    `${v.region}의 대표 지역(행정동)을 가나다순으로 정리했습니다. 번호 동은 대표 동으로 통합해 안내합니다.`,
    `${v.region}에 속한 행정동을 가나다순으로 모았습니다. 동을 선택하면 생활권과 인근 역을 볼 수 있습니다.`,
    `${v.region}의 행정동별 안내입니다. 비슷한 번호 동은 대표 동으로 묶어 중복 없이 정리했습니다.`,
  ]);
}

/** 시군구 역세권 섹션 리드 — 시드 변형 */
export function guStationLead(seed: string, v: GuVars): string {
  return pick(seed, "gu.stlead", [
    `역명 기준으로 하나의 안내 페이지를 제공합니다. 환승역도 노선·출구별로 나누지 않습니다.`,
    `${v.region} 주요 역을 역명 단위로 안내합니다. 환승역이라도 페이지를 쪼개지 않습니다.`,
    `${v.region} 인근 역은 역명 하나당 한 페이지로 정리해, 출구·노선별 중복을 두지 않습니다.`,
  ]);
}

/** 시군구 생활권 섹션 리드 — 시드 변형 */
export function guLifeLead(seed: string, v: GuVars): string {
  return pick(seed, "gu.life", [
    `${v.region} 인근 생활권은 지역 페이지와 역 페이지 사이를 잇는 중간 기준점입니다.`,
    `${v.sido}의 생활권을 기준으로 ${v.region} 주변 방문 범위를 가늠할 수 있습니다.`,
    `${v.region}과 이어지는 생활권을 통해 가까운 역·상권 중심으로 방문지를 좁혀 보세요.`,
  ]);
}

/** 시군구 히어로 부제 — 시드 변형 */
export function guHeroSub(seed: string, v: GuVars): string {
  const a = v.areas.slice(0, 3).join(", ");
  return pick(seed, "gu.hero", [
    `${a} 등 ${v.region} 주요 생활권별 방문 가능 지역과 예약 전 확인사항을 안내합니다.`,
    `${v.region}의 ${a}을(를) 비롯한 생활권별 방문 동선과 예약 기준을 정리했습니다.`,
    `${v.region} 안 ${a} 일대를 중심으로, 방문 가능 지역과 이용 전 확인사항을 살펴봅니다.`,
  ]);
}

/** 시군구 "예약 전 확인사항" 도입 문단 — 시드 변형 */
export function guReserveIntro(seed: string, v: GuVars): string {
  return pick(seed, "gu.res", [
    `${v.region} 방문 전 아래 항목을 미리 확인하시면 예약과 방문이 원활합니다. 자택·호텔·오피스텔 등 방문 위치에 따라 출입 방법과 주소 확인 기준이 달라지므로, 예약 시 정확한 정보를 미리 알려 주시면 대기 시간을 줄일 수 있습니다.`,
    `${v.region}에서 방문 예약을 진행하기 전, 아래 항목을 점검하면 도착부터 관리까지 흐름이 매끄럽습니다. 건물 유형에 따라 출입 절차가 달라 미리 확인하는 편이 좋습니다.`,
    `예약 전 확인이 필요한 항목을 ${v.region} 기준으로 정리했습니다. 방문 위치와 건물 형태에 따라 주소·출입 확인 방식이 달라지므로 통화 시 함께 안내드립니다.`,
  ]);
}

/** 시군구 자택·숙소·오피스텔 보강 문단 — 시드 변형 (마무리 문장 포함) */
export function guVisitNote(seed: string, v: GuVars): string {
  const a = pick(seed, "gu.visit", [
    `${v.region}에서 자택은 상세 주소와 출입 동선을, 호텔·숙소는 객실 호수와 프런트 규정을, 오피스텔은 동·호수와 공동현관 출입 방법을 미리 확인하면 방문이 매끄럽습니다.`,
    `${v.region} 내 자택 방문은 주차와 출입 동선 확인이, 호텔은 프런트 규정 확인이, 오피스텔은 공동현관 비밀번호 확인이 중요합니다.`,
    `방문 위치가 ${v.region}의 자택인지 숙소인지 오피스텔인지에 따라 준비할 정보가 다르므로, 예약 시 건물 형태를 함께 알려 주시면 좋습니다.`,
  ]);
  const b = pick(seed, "gu.visit2", [
    `희망 시간과 원하는 관리 종류를 함께 알려 주시면 가능한 동선과 추가 이동비 기준을 안내받기 쉽습니다.`,
    `방문 시간대와 관리 종류를 미리 정해 두면 예약 통화가 한결 빠르게 진행됩니다.`,
    `원하는 시간과 관리 구성을 함께 말씀해 주시면 그에 맞춰 동선과 비용 기준을 안내드립니다.`,
  ]);
  return `${a} ${b}`;
}

/** 시군구 인접 지역 안내 문단 — 시드 변형 */
export function guNeighbor(seed: string, v: GuVars): string {
  return pick(seed, "gu.nb", [
    `${v.sido} 내 인접 지역도 함께 확인해 보세요. ${v.region}과 맞닿은 구·시는 생활권 성격이 이어지는 경우가 많아, 방문 동선과 추가 이동비 기준을 비교해 보면 도움이 됩니다.`,
    `${v.region} 주변 지역도 살펴보면 선택의 폭이 넓어집니다. 인접한 구·시는 ${v.region}과 교통이 이어져, 가까운 생활권을 기준으로 방문 위치를 정하기 좋습니다.`,
    `${v.sido}의 다른 지역과 비교해 보고 싶다면 인접 구·시 페이지를 함께 확인하세요. ${v.region}과 인접한 지역은 역세권과 상권이 연결되는 경우가 많습니다.`,
  ]);
}

/** 서비스 안내 보강 문단 — 시드(슬러그) 변형, 서비스 고유 데이터 결합 */
export function serviceIntro(
  seed: string,
  v: { name: string; short: string; focus: string; point: string }
): string {
  return pick(seed, "sv.intro", [
    `${v.name}은(는) ${v.focus}을(를) 중심으로 진행하며, ${v.point} 점을 함께 고려해 안내합니다. 방문 위치와 희망 시간에 맞춰 구성과 시간을 조정할 수 있습니다.`,
    `${v.short} 관리는 ${v.focus}에 초점을 두고, ${v.point} 부분까지 함께 살펴봅니다. 예약 시 원하는 강도와 부위를 알려 주시면 구성을 맞춰 안내합니다.`,
    `${v.focus}을(를) 기준으로 하는 ${v.name}은(는) ${v.point} 점을 보완하는 방식으로 진행됩니다. 처음이시라면 희망 부위와 강도를 미리 알려 주시면 좋습니다.`,
  ]);
}

/** 서비스 "예약 전 확인" 안내 — 시드 변형 */
export function serviceNotice(seed: string): string {
  return pick(seed, "sv.notice", [
    `방문 위치에 따라 출입·주소 확인 기준이 다릅니다.`,
    `자택·숙소·오피스텔 중 어디로 방문하느냐에 따라 준비할 정보가 달라집니다.`,
    `방문 건물 유형에 따라 출입 절차와 주소 확인 방식이 달라집니다.`,
  ]);
}

interface LifeVars {
  name: string;
  sido: string;
  areas: string[];
  stations: string[];
}

/** 생활권 방문 가능 지역·동선 보강 — 시드 변형 */
export function lifeAccess(seed: string, v: LifeVars): string {
  const a = v.areas.slice(0, 4).join(", ");
  const st = v.stations.slice(0, 3).join(", ");
  return compose(seed, [
    {
      slot: "lf.a",
      variants: [
        `${v.name}은 ${a} 등 행정동과 ${st} 인근 역을 아우르는 생활권입니다.`,
        `${a} 같은 행정동과 ${st} 역세권이 ${v.name} 생활권을 이룹니다.`,
        `${v.name}은 ${st}을 축으로 ${a} 일대를 묶는 생활권으로 볼 수 있습니다.`,
      ],
    },
    {
      slot: "lf.b",
      variants: [
        `같은 생활권 안에서도 업무·상권 구역과 주거 구역의 방문 조건이 달라, 자택·호텔·오피스텔 위치에 따라 가까운 동과 역을 함께 확인하면 동선을 잡기 쉽습니다.`,
        `상권 쪽과 주거 쪽의 방문 여건이 달라, 방문 위치에 맞는 가까운 동·역을 먼저 정하면 동선이 깔끔해집니다.`,
        `생활권이 넓어 구역마다 분위기가 다르므로, 방문 위치를 기준으로 가까운 동과 역을 함께 살펴보는 편이 좋습니다.`,
      ],
    },
  ]);
}

/** 생활권 인접역 보강 — 시드 변형 */
export function lifeStation(seed: string, v: LifeVars): string {
  return pick(seed, "lf.st", [
    `위 역들은 ${v.name}에서 가까운 지하철역으로, 역마다 출구 방향과 주변 상권이 달라 도보·차량 동선이 조금씩 다릅니다. 방문 위치가 역과 가까우면 비교적 빠르게 안내가 가능하고, 역에서 떨어진 주거 단지는 도착 시간이 더 걸릴 수 있습니다.`,
    `${v.name} 인근 역은 출구와 상권 구성이 제각각이라 접근 동선이 조금씩 다릅니다. 역세권은 도착이 빠른 편이고, 외곽 주거 단지는 시간이 더 필요할 수 있어 희망 시간을 넉넉히 알려 주시면 좋습니다.`,
    `위 역들을 기준으로 ${v.name} 방문 동선을 잡을 수 있으며, 역과의 거리에 따라 도보·차량 접근과 도착 시간이 달라집니다.`,
  ]);
}

/** 생활권 이용 전 확인 보강 — 시드 변형 */
export function lifeReserve(seed: string, v: LifeVars): string {
  const st0 = v.stations[0] ?? "인근 역";
  return pick(seed, "lf.res", [
    `${v.name}에서 예약할 때는 방문 위치와 희망 시간, 관리 종류를 먼저 정리해 두면 빠릅니다. ${st0} 인근처럼 역과 가까운 곳은 이동 부담이 적고, 외곽 주거 구역은 거리·시간대에 따라 추가 이동비 기준이 달라질 수 있습니다.`,
    `${v.name} 예약 전 방문 위치(자택·호텔·오피스텔)와 시간대를 정해 두면 안내가 매끄럽습니다. ${st0} 가까운 구역은 부담이 적고, 외곽은 시간대에 따라 기준이 달라집니다.`,
    `${st0}을 기준으로 ${v.name} 방문 위치를 먼저 정하고 희망 시간을 알려 주시면, 가능한 동선과 추가 이동비 기준을 빠르게 안내받을 수 있습니다.`,
  ]);
}

interface StationVars {
  station: string;
  sido: string;
  sigungu: string;
  focus: string;
  areas: string[];
  lines: string[];
  transfer: boolean;
}

/** 역 "찾을 때 확인할 기준" 도입 — 시드 변형 */
export function stationIntro(seed: string, v: StationVars): string {
  const a = v.areas.slice(0, 3).join(", ");
  const open = pick(seed, "st.open", [
    `${v.station} 주변에서 출장마사지·홈타이를 찾을 때는 ${v.focus} 점을 함께 확인하면 좋습니다.`,
    `${v.station} 인근에서 방문 관리를 찾으신다면 ${v.focus} 특성을 먼저 살펴보시는 것이 도움이 됩니다.`,
    `${v.focus} ${v.station} 역세권은 이런 성격을 바탕으로 생활권이 형성되어 있습니다.`,
  ]);
  const area = pick(seed, "st.area", [
    `${a} 등 인접 행정동을 기준으로 방문 가능 지역과 동선을 확인할 수 있습니다.`,
    `방문 동선은 ${a} 같은 인접 행정동을 기준으로 잡으면 정리하기 쉽습니다.`,
    `${a} 일대가 ${v.station} 생활권과 맞닿아 있어 방문 위치를 특정하기 좋습니다.`,
  ]);
  const tr = v.transfer
    ? ` ${v.station}은 ${v.lines.join(", ")}이 지나는 환승역이지만, 안내 페이지는 역명 기준 하나로 제공합니다.`
    : "";
  return `${open} ${area}${tr}`;
}

/** 역 인근 생활권 보강 문단 — 시드 변형 */
export function stationLife(seed: string, v: StationVars): string {
  const a = v.areas.slice(0, 3).join(", ");
  return compose(seed, [
    {
      slot: "stl.a",
      variants: [
        `${v.station} 인근은 ${a} 등 행정동이 맞닿아 있어, 같은 역세권이라도 생활권에 따라 방문 동선과 예약 가능 시간이 달라집니다.`,
        `${a}이(가) ${v.station}을 둘러싸고 있어, 어느 방면이냐에 따라 방문 조건이 갈립니다.`,
        `${v.station} 주변 ${a}은(는) 각기 성격이 달라, 같은 역이라도 방면별로 예약 여건이 다릅니다.`,
      ],
    },
    {
      slot: "stl.b",
      variants: [
        `업무·상업 구역은 평일 낮·저녁 수요가, 주거 구역은 야간·주말 방문 가능 여부 확인이 중요합니다.`,
        `상권 쪽은 평일 수요가 몰리고, 주거 쪽은 야간·주말 방문 조건을 미리 확인하는 편이 좋습니다.`,
        `번화한 구역과 주거 구역의 방문 수요 시간대가 달라, 희망 시간을 먼저 정해 두면 좋습니다.`,
      ],
    },
  ]);
}

/** 역 주변 방문 가능 지역 보강 문단 — 시드 변형 */
export function stationAccess(seed: string, v: StationVars): string {
  const a0 = v.areas[0] ?? v.station;
  const aN = v.areas[v.areas.length - 1] ?? v.sigungu;
  return compose(seed, [
    {
      slot: "sta.a",
      variants: [
        `${v.station}은 ${v.sido} ${v.sigungu}에 위치하며 ${v.lines.join(", ")}이(가) 지나, 인근 지역과 다른 권역으로의 이동이 비교적 수월한 편입니다.`,
        `${v.lines.join(", ")}이(가) 지나는 ${v.station}은 ${v.sigungu} 안팎으로 이동이 편한 위치입니다.`,
        `${v.sigungu}에 자리한 ${v.station}은 ${v.lines.join(", ")} 노선을 통해 주변 권역과 연결됩니다.`,
      ],
    },
    {
      slot: "sta.b",
      variants: [
        `${a0} 방면은 도보 접근이 편한 편이고, ${aN} 방면은 차량 이동이 필요한 경우 추가 이동비 기준을 미리 확인하면 좋습니다.`,
        `${a0} 쪽은 가까워 도보로도 닿지만, ${aN} 방면은 거리·시간대에 따라 이동비 기준을 확인하는 편이 좋습니다.`,
        `가까운 ${a0}과 비교해 ${aN} 방면은 이동 거리가 있어, 예약 시 동선을 함께 확인하면 매끄럽습니다.`,
      ],
    },
  ]);
}

/** 역 추가 이동비 보강 문단 — 시드 변형 */
export function stationFare(seed: string, v: StationVars): string {
  const a0 = v.areas[0] ?? v.station;
  const aN = v.areas[v.areas.length - 1] ?? v.sigungu;
  return pick(seed, "st.fare", [
    `예를 들어 ${a0}처럼 역과 가까운 생활권은 이동 부담이 적은 편이지만, ${aN} 방면이나 ${v.sigungu} 외곽으로 이동하는 경우 거리와 심야 시간대에 따라 기준이 달라질 수 있습니다.`,
    `${a0} 같은 인접 생활권은 이동이 가볍지만, ${aN} 방면이나 ${v.sigungu} 외곽은 거리·시간대에 따라 추가 이동비가 붙을 수 있습니다.`,
    `역과 가까운 ${a0}은 부담이 적고, ${aN} 방면이나 ${v.sigungu} 외곽으로 갈수록 시간대에 따라 기준이 달라집니다.`,
  ]);
}

/** 역 추가 이동비 마무리 문장 — 시드 변형 */
export function stationFareTail(seed: string, v: StationVars): string {
  return pick(seed, "st.faretail", [
    `${v.station}을 기준으로 방문 위치를 먼저 정하고, 자택·호텔·오피스텔 중 어디로 방문할지와 희망 시간을 함께 알려 주시면 가능한 동선과 예상 기준을 안내받기 쉽습니다.`,
    `방문 위치와 희망 시간을 ${v.station} 기준으로 정리해 주시면, 그에 맞는 동선과 비용 기준을 통화에서 안내드립니다.`,
    `${v.station} 인근 어디로 방문할지와 시간대를 먼저 알려 주시면 예상 동선과 기준을 빠르게 확인해 드립니다.`,
  ]);
}

/** 역 방문 위치(자택/숙소/오피스텔) 안내 문단 — 시드 변형 (내부 링크 포함은 페이지에서) */
export function stationVisitLead(seed: string, v: StationVars): string {
  return pick(seed, "st.visit", [
    `방문 위치에 따라 주소·출입 확인 기준이 다릅니다. 예약 전 이용 전 확인사항을 함께 살펴보세요.`,
    `${v.station} 인근에서도 자택·숙소·오피스텔에 따라 출입 절차가 달라, 예약 전 확인이 필요합니다.`,
    `자택인지 숙소인지 오피스텔인지에 따라 준비할 정보가 다르므로 미리 확인해 두시면 좋습니다.`,
  ]);
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

/** 주변 상권·주거 환경 문단 — 시드 변형 */
export function dongCommerce(seed: string, v: DongVars): string {
  const lm0 = v.landmarks[0] ?? `${v.dong} 일대`;
  const adj0 = v.adjacent[0] ?? v.gu;
  return compose(seed, [
    {
      slot: "com.a",
      variants: [
        `${v.dong} 일대는 ${v.character} 특성이 뚜렷해, 오피스텔·아파트·숙소가 혼재한 구간과 주거 전용 구간의 방문 조건이 다릅니다.`,
        `상권과 주거가 섞인 ${v.dong}은 구역에 따라 분위기 차이가 커서, 같은 동 안에서도 방문 환경이 갈립니다.`,
        `${v.dong}의 거리 구성은 ${v.character} 색깔을 띠며, 번화한 구간과 조용한 주거 구간이 가까이 맞물려 있습니다.`,
      ],
    },
    {
      slot: "com.b",
      variants: [
        `${lm0} 인근은 상업·업무 수요가 많고, ${adj0} 방향 주거 구간은 야간·주말 방문 가능 여부 확인이 중요합니다.`,
        `${lm0} 쪽은 유동 인구가 많은 반면, ${adj0} 방면은 주거 밀도가 높아 시간대별 방문 조건을 확인하는 편이 좋습니다.`,
        `낮 시간대 수요는 ${lm0} 주변에, 저녁·심야 수요는 ${adj0} 방향 주거 구간에 몰리는 경향이 있습니다.`,
      ],
    },
    {
      slot: "com.c",
      variants: [
        `위치에 따라 방문 가능 시간과 동선이 달라지므로 개별적으로 확인하는 방식을 권장합니다.`,
        `같은 ${v.dong}이라도 건물 유형과 위치에 따라 출입·주차 조건이 달라, 예약 시 상세 주소를 함께 확인하면 좋습니다.`,
        `방문 전 정확한 위치와 건물 형태를 알려 주시면 가능한 시간대와 동선을 더 빠르게 안내받을 수 있습니다.`,
      ],
    },
  ]);
}

/** 주변 방문 가능 지역 보강 문단 — 시드 변형 */
export function dongAccess(seed: string, v: DongVars): string {
  const st = v.stations.slice(0, 2).join(", ") || "인근 역";
  const adj = v.adjacent.slice(0, 3).join(", ") || v.gu;
  return compose(seed, [
    {
      slot: "acc.a",
      variants: [
        `${st} 인근을 기준으로 접근할 수 있으며, ${adj} 방향 이동은 거리와 시간대에 따라 추가 이동비 기준이 달라질 수 있습니다.`,
        `방문은 주로 ${st} 생활권을 거점으로 이뤄지고, ${adj} 쪽으로 벗어날수록 이동 조건을 미리 확인하는 편이 좋습니다.`,
        `${st}을 출발점으로 ${adj} 방면까지 동선을 잡을 수 있으며, 외곽으로 갈수록 시간대별 기준을 확인하면 좋습니다.`,
      ],
    },
    {
      slot: "acc.b",
      variants: [
        `예약 시 ${v.dong} 내 정확한 방문 주소를 먼저 확인하면 동선 안내가 빠릅니다.`,
        `${v.dong} 안에서도 위치에 따라 도착 시간이 달라지므로, 상세 주소를 미리 알려 주시면 좋습니다.`,
        `정확한 ${v.dong} 주소와 건물 정보를 함께 주시면 가장 빠른 방문 경로를 안내받을 수 있습니다.`,
      ],
    },
  ]);
}

/** 행정동 히어로 부제 — 시드 변형 */
export function dongHeroSub(seed: string, v: DongVars): string {
  const adj = v.adjacent.slice(0, 3).join(", ") || v.gu;
  return pick(seed, "dhero", [
    `${v.character} ${v.dong}의 방문 가능 생활권과 예약 전 확인사항을 안내합니다. ${adj} 인접 지역도 함께 확인하세요.`,
    `${v.dong}의 방문 동선과 예약 기준을 ${v.character} 생활권 특성에 맞춰 정리했습니다. ${adj}까지 함께 살펴보세요.`,
    `${v.character} ${v.dong}을 중심으로 방문 가능 지역과 이용 전 확인사항을 안내합니다. ${adj} 방면도 참고하세요.`,
  ]);
}

/** 인근 지하철역 도입 한 줄 — 시드 변형 */
export function dongStationLine(seed: string, v: DongVars): string {
  const st = v.stations.slice(0, 2).join(", ") || "인근 역";
  return pick(seed, "stline", [
    `${v.dong}과 가까운 지하철역을 기준으로 방문 동선을 확인할 수 있습니다.`,
    `${st} 등 ${v.dong} 인근 역을 거점으로 방문 경로를 잡으면 편리합니다.`,
    `방문 동선은 ${st}을 비롯한 가까운 역을 기준으로 정리하시면 좋습니다.`,
    `${v.dong} 주변에서는 ${st} 접근성이 방문 동선의 기준이 됩니다.`,
  ]);
}

/** 예약 전 확인사항 보강 문단 — 시드 변형 */
export function dongReserve(seed: string, v: DongVars): string {
  const st0 = v.stations[0] ?? "인근 역";
  const adj0 = v.adjacent[0] ?? v.gu;
  return compose(seed, [
    {
      slot: "res.a",
      variants: [
        `${v.dong} 방문 예약 시 ${st0} 기준 동선과 ${adj0} 방면 이동 여부를 함께 확인하면 예약이 빠릅니다.`,
        `예약 단계에서 ${st0} 인근 여부와 ${adj0} 쪽 이동 필요성을 미리 알려 주시면 안내가 매끄럽습니다.`,
        `${st0}을 기준으로 한 접근성과 ${adj0} 방면 동선을 함께 점검하면 ${v.dong} 방문 예약이 수월합니다.`,
      ],
    },
    {
      slot: "res.b",
      variants: [
        `${v.dong}은 ${v.character} 특성을 고려해 방문 가능 시간과 추가 이동비 기준을 예약 시 안내합니다.`,
        `${v.character} ${v.dong}의 특성상 시간대별 방문 여건이 달라, 통화 시 정확한 기준을 확정합니다.`,
        `${v.dong}의 ${v.character} 환경에 맞춰 가능한 시간대와 비용 기준을 예약 통화에서 안내드립니다.`,
      ],
    },
  ]);
}
