import type {
  NumberFilters,
  NumberStatus,
  OperatorId,
  PhoneNumber,
  RondType,
  Seller,
  SimType,
  SortKey,
} from "@/lib/types";
import { analyzeNumber, VIP_SCORE } from "@/lib/utils";
import { CITIES, OPERATORS } from "./site";

/* ==========================================================================
   Deterministic catalogue.

   Everything below is generated from a fixed seed. That matters for two
   reasons: the server and the client render byte-identical markup (no
   hydration mismatch), and the data stays stable between page navigations
   without needing a store. In phase 2 this module is replaced by fetches to
   the Fastify API — the exported function signatures are the contract.
   ========================================================================== */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260813);

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const digit = () => String(randInt(0, 9));

const SELLER_NAMES = [
  "علی محمدی",
  "رضا شریفی",
  "مریم تهرانی",
  "حسین کریمی",
  "فاطمه نوری",
  "سعید جعفری",
  "نگین رستمی",
  "بهرام صادقی",
  "زهرا افشار",
  "کامران یوسفی",
  "لیلا بهرامی",
  "مهدی اکبری",
];

const SELLERS: Seller[] = SELLER_NAMES.map((name, i) => ({
  id: `slr-${i + 1}`,
  name,
  verified: i % 4 !== 3,
  rating: Number((3.9 + rand() * 1.1).toFixed(1)),
  sales: randInt(6, 480),
  since: `${2019 + (i % 6)}-0${(i % 9) + 1}-1${i % 9}T00:00:00.000Z`,
  avatarSeed: `s${i}`,
}));

/* -------------------------------------------------------------------------
   Tail generators — each returns the 7 digits after the operator prefix.
   ------------------------------------------------------------------------- */

const uniqueDigit = (exclude: string[]): string => {
  let d = digit();
  let guard = 0;
  while (exclude.includes(d) && guard++ < 20) d = digit();
  return d;
};

const TAIL_GENERATORS: { weight: number; make: () => string }[] = [
  // پنج رقم تکراری
  {
    weight: 3,
    make: () => {
      const d = digit();
      const head = uniqueDigit([d]) + uniqueDigit([d]);
      return rand() < 0.5 ? head + d.repeat(5) : d.repeat(5) + head;
    },
  },
  // چهار رقم تکراری
  {
    weight: 12,
    make: () => {
      const d = digit();
      return digit() + digit() + uniqueDigit([d]) + d.repeat(4);
    },
  },
  // سه رقم تکراری
  {
    weight: 18,
    make: () => {
      const d = digit();
      return digit() + digit() + digit() + uniqueDigit([d]) + d.repeat(3);
    },
  },
  // هزاری
  {
    weight: 12,
    make: () => digit() + digit() + digit() + uniqueDigit(["0"]) + "000",
  },
  // صدی
  {
    weight: 10,
    make: () => digit() + digit() + digit() + digit() + uniqueDigit(["0"]) + "00",
  },
  // آینه‌ای (abcdcba)
  {
    weight: 8,
    make: () => {
      const [a, b, c, d] = [digit(), digit(), digit(), digit()];
      return a + b + c + d + c + b + a;
    },
  },
  // ترتیبی
  {
    weight: 8,
    make: () => {
      const len = randInt(4, 6);
      const dir = rand() < 0.6 ? 1 : -1;
      const start = dir === 1 ? randInt(0, 9 - (len - 1)) : randInt(len - 1, 9);
      let run = "";
      for (let i = 0; i < len; i++) run += String(start + dir * i);
      let out = run;
      while (out.length < 7) out = rand() < 0.5 ? digit() + out : out + digit();
      return out.slice(0, 7);
    },
  },
  // جفت جفت
  {
    weight: 9,
    make: () => {
      const a = digit();
      const b = uniqueDigit([a]);
      return digit() + digit() + digit() + a + a + b + b;
    },
  },
  // پله‌ای
  {
    weight: 8,
    make: () => {
      const a = digit();
      const b = uniqueDigit([a]);
      return digit() + digit() + digit() + a + b + a + b;
    },
  },
  // رول
  {
    weight: 5,
    make: () => {
      const a = digit();
      const b = uniqueDigit([a]);
      return digit() + (a + b).repeat(3);
    },
  },
  // تاریخ تولد
  {
    weight: 5,
    make: () => digit() + digit() + digit() + "13" + String(randInt(45, 85)),
  },
  // گفتاری / معمولی‌تر
  {
    weight: 6,
    make: () => {
      let out = "";
      for (let i = 0; i < 7; i++) out += digit();
      return out;
    },
  },
];

const WEIGHTED_TAILS = TAIL_GENERATORS.flatMap((g) => Array(g.weight).fill(g.make) as (() => string)[]);

/* -------------------------------------------------------------------------
   Pricing
   ------------------------------------------------------------------------- */

const OPERATOR_WEIGHTS: { id: OperatorId; weight: number }[] = [
  { id: "mci", weight: 46 },
  { id: "irancell", weight: 34 },
  { id: "rightel", weight: 12 },
  { id: "shatel", weight: 5 },
  { id: "aptel", weight: 3 },
];

const WEIGHTED_OPERATORS = OPERATOR_WEIGHTS.flatMap((o) => Array(o.weight).fill(o.id) as OperatorId[]);

const PRICE_BANDS: { min: number; lo: number; hi: number }[] = [
  { min: 90, lo: 620_000_000, hi: 3_200_000_000 },
  { min: 82, lo: 180_000_000, hi: 680_000_000 },
  { min: 74, lo: 62_000_000, hi: 210_000_000 },
  { min: 64, lo: 24_000_000, hi: 72_000_000 },
  { min: 54, lo: 9_500_000, hi: 28_000_000 },
  { min: 42, lo: 3_800_000, hi: 11_000_000 },
  { min: 0, lo: 950_000, hi: 4_600_000 },
];

const OPERATOR_PRICE_FACTOR: Record<OperatorId, number> = {
  mci: 1,
  irancell: 0.72,
  rightel: 0.5,
  shatel: 0.42,
  aptel: 0.38,
};

function priceFor(score: number, operator: OperatorId, prefix: string, simType: SimType): number {
  const band = PRICE_BANDS.find((b) => score >= b.min)!;
  const t = rand();
  let price = band.lo + (band.hi - band.lo) * t * t; // skewed toward the low end
  price *= OPERATOR_PRICE_FACTOR[operator];
  if (prefix === "0912") price *= 1.45;
  if (prefix === "0919" || prefix === "0911") price *= 1.12;
  if (simType === "credit") price *= 0.7;
  // Round to a believable price point.
  const magnitude = Math.pow(10, Math.max(4, String(Math.round(price)).length - 3));
  return Math.max(900_000, Math.round(price / magnitude) * magnitude);
}

/* -------------------------------------------------------------------------
   Catalogue
   ------------------------------------------------------------------------- */

const NOW = Date.parse("2026-08-13T09:00:00.000Z");

function buildCatalogue(count: number): PhoneNumber[] {
  const seen = new Set<string>();
  const out: PhoneNumber[] = [];

  while (out.length < count) {
    const operatorId = pick(WEIGHTED_OPERATORS);
    const operator = OPERATORS.find((o) => o.id === operatorId)!;
    // Bias toward the head of the prefix list (0912, 0901 …) — those carry the
    // premium in the real market.
    const prefixIndex = Math.floor(Math.pow(rand(), 1.9) * operator.prefixes.length);
    const prefix = operator.prefixes[prefixIndex];
    const tail = pick(WEIGHTED_TAILS)();
    const msisdn = prefix + tail;

    if (msisdn.length !== 11 || seen.has(msisdn)) continue;
    seen.add(msisdn);

    const { rondTypes, score } = analyzeNumber(msisdn);
    const simType: SimType = rand() < (score > 78 ? 0.86 : 0.58) ? "permanent" : "credit";
    const price = priceFor(score, operatorId, prefix, simType);

    const statusRoll = rand();
    const status: NumberStatus =
      statusRoll > 0.94 ? "sold" : statusRoll > 0.88 ? "reserved" : "available";

    const hasDiscount = rand() < 0.22;
    const seller = pick(SELLERS);
    const ageDays = Math.floor(Math.pow(rand(), 1.6) * 150);

    out.push({
      id: msisdn,
      slug: msisdn,
      msisdn,
      operator: operatorId,
      simType,
      status,
      price,
      oldPrice: hasDiscount ? Math.round((price * (1.12 + rand() * 0.26)) / 100_000) * 100_000 : undefined,
      rondTypes,
      score,
      vip: score >= VIP_SCORE,
      installment: price > 20_000_000 && rand() < 0.55,
      negotiable: rand() < 0.34,
      city: pick(CITIES),
      seller,
      views: randInt(48, 14_800),
      favorites: randInt(0, 640),
      createdAt: new Date(NOW - ageDays * 86_400_000 - randInt(0, 82_800) * 1000).toISOString(),
      description: buildDescription(rondTypes, simType, operator.name),
      guarantee: seller.verified && rand() < 0.9,
    });
  }

  return out;
}

function buildDescription(types: RondType[], simType: SimType, operatorName: string): string {
  const openers = [
    "یک انتخاب شاخص برای کسانی که شماره‌شان بخشی از هویت برندشان است.",
    "خطی تمیز و بدون سابقه انتقال، آماده واگذاری فوری.",
    "از آن شماره‌هایی که یک‌بار می‌شنوی و دیگر فراموش نمی‌کنی.",
    "مناسب کسب‌وکارهایی که روی تماس ورودی مشتری حساب می‌کنند.",
    "شماره‌ای با الگوی کم‌یاب که در بازار به‌سختی جایگزین پیدا می‌کند.",
  ];
  const closers = [
    "تمام مراحل انتقال سند با هماهنگی کارشناس روندیکس انجام می‌شود.",
    "امکان بازدید حضوری و بررسی مدارک پیش از پرداخت وجود دارد.",
    "بدون بدهی و مسدودی؛ استعلام اپراتور در پرونده شماره ثبت شده است.",
    "پس از تسویه، سیم‌کارت با پیک ویژه در سراسر کشور تحویل داده می‌شود.",
  ];
  const simText =
    simType === "permanent"
      ? `سیم‌کارت دائمی ${operatorName} با قابلیت انتقال سند رسمی`
      : `سیم‌کارت اعتباری ${operatorName} با امکان تبدیل به دائمی`;

  return `${pick(openers)} ${simText}. ${pick(closers)}`;
}

export const NUMBERS: PhoneNumber[] = buildCatalogue(220);

/* -------------------------------------------------------------------------
   Queries — these are the shapes the API will expose.
   ------------------------------------------------------------------------- */

export const DEFAULT_FILTERS: NumberFilters = {
  q: "",
  operators: [],
  simTypes: [],
  rondTypes: [],
  minPrice: null,
  maxPrice: null,
  minScore: 0,
  vipOnly: false,
  installmentOnly: false,
  availableOnly: false,
  city: null,
  sort: "newest",
};

/**
 * Matches a digit query against a number. Supports `*` and `x` as wildcards,
 * so "0912***11**" behaves the way buyers expect.
 */
function matchesQuery(msisdn: string, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;

  if (/[*x?]/.test(q)) {
    const pattern = q.replace(/[^0-9*x?]/g, "").replace(/[*x?]/g, ".");
    try {
      return new RegExp(pattern).test(msisdn);
    } catch {
      return false;
    }
  }

  const digits = q.replace(/\D/g, "");
  return digits.length > 0 && msisdn.includes(digits);
}

const SORTERS: Record<SortKey, (a: PhoneNumber, b: PhoneNumber) => number> = {
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "score-desc": (a, b) => b.score - a.score || b.price - a.price,
  popular: (a, b) => b.views - a.views,
};

export function queryNumbers(filters: Partial<NumberFilters> = {}): PhoneNumber[] {
  const f = { ...DEFAULT_FILTERS, ...filters };

  const result = NUMBERS.filter((n) => {
    if (!matchesQuery(n.msisdn, f.q)) return false;
    if (f.operators.length && !f.operators.includes(n.operator)) return false;
    if (f.simTypes.length && !f.simTypes.includes(n.simType)) return false;
    if (f.rondTypes.length && !f.rondTypes.some((t) => n.rondTypes.includes(t))) return false;
    if (f.minPrice !== null && n.price < f.minPrice) return false;
    if (f.maxPrice !== null && n.price > f.maxPrice) return false;
    if (n.score < f.minScore) return false;
    if (f.vipOnly && !n.vip) return false;
    if (f.installmentOnly && !n.installment) return false;
    if (f.availableOnly && n.status !== "available") return false;
    if (f.city && n.city !== f.city) return false;
    return true;
  });

  return result.sort(SORTERS[f.sort]);
}

export function getNumber(id: string): PhoneNumber | undefined {
  return NUMBERS.find((n) => n.id === id || n.msisdn === id);
}

export function getFeatured(limit = 8): PhoneNumber[] {
  return [...NUMBERS]
    .filter((n) => n.status === "available" && n.vip)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getLatest(limit = 8): PhoneNumber[] {
  return [...NUMBERS]
    .filter((n) => n.status === "available")
    .sort(SORTERS.newest)
    .slice(0, limit);
}

export function getBudgetPicks(limit = 8): PhoneNumber[] {
  return [...NUMBERS]
    .filter((n) => n.status === "available" && n.price < 12_000_000)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getDiscounted(limit = 8): PhoneNumber[] {
  return NUMBERS.filter((n) => n.oldPrice && n.status === "available")
    .sort((a, b) => (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!)
    .slice(0, limit);
}

export function getSimilar(target: PhoneNumber, limit = 6): PhoneNumber[] {
  return NUMBERS.filter((n) => n.id !== target.id)
    .map((n) => {
      const shared = n.rondTypes.filter((t) => target.rondTypes.includes(t)).length;
      const priceGap = Math.abs(n.price - target.price) / Math.max(target.price, 1);
      const sameOperator = n.operator === target.operator ? 1 : 0;
      return { n, rank: shared * 3 + sameOperator * 2 - priceGap };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map((x) => x.n);
}

export function countByRondType(): Record<RondType, number> {
  const counts = {} as Record<RondType, number>;
  for (const n of NUMBERS) {
    for (const t of n.rondTypes) counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}

export function countByOperator(): Record<OperatorId, number> {
  const counts = {} as Record<OperatorId, number>;
  for (const n of NUMBERS) counts[n.operator] = (counts[n.operator] ?? 0) + 1;
  return counts;
}

export function priceRange(): { min: number; max: number } {
  const prices = NUMBERS.map((n) => n.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
