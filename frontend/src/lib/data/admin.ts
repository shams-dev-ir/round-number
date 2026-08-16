import type { AdminUser, Order, OperatorId } from "@/lib/types";
import { NUMBERS } from "./numbers";
import { CITIES, OPERATORS } from "./site";

/* ==========================================================================
   Admin-side mock data. Deterministic, same reasoning as the catalogue.
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

const rand = mulberry32(778102);
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

/* -------------------------------------------------------- revenue series -- */

const JALALI_MONTHS_SHORT = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** Last 12 months of revenue and order counts, ending at the current month. */
export const REVENUE_SERIES = JALALI_MONTHS_SHORT.map((month, i) => {
  const trend = 1 + i * 0.085;
  const revenue = Math.round((1_800_000_000 * trend + rand() * 900_000_000) / 10_000_000) * 10_000_000;
  const orders = Math.round(48 * trend + rand() * 26);
  return {
    month,
    revenue,
    orders,
    commission: Math.round(revenue * 0.03),
  };
});

/** Sales split by operator, for the donut. */
export const OPERATOR_SALES = OPERATORS.map((op) => {
  const count = NUMBERS.filter((n) => n.operator === op.id).length;
  return {
    id: op.id,
    name: op.name,
    value: count,
    revenue: NUMBERS.filter((n) => n.operator === op.id).reduce((s, n) => s + n.price, 0),
  };
});

/** Views vs. purchases through the funnel, for the conversion panel. */
export const FUNNEL = [
  { stage: "بازدید صفحه شماره", value: 128_400 },
  { stage: "افزودن به سبد", value: 18_620 },
  { stage: "شروع پرداخت", value: 7_940 },
  { stage: "سفارش موفق", value: 5_110 },
];

export const TRAFFIC_SERIES = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  visitors: Math.round(3_200 + rand() * 2_400),
  searches: Math.round(1_400 + rand() * 1_600),
}));

/* ---------------------------------------------------------------- users --- */

const FIRST = ["علی", "رضا", "مریم", "حسین", "فاطمه", "سعید", "نگین", "بهرام", "زهرا", "کامران", "لیلا", "مهدی", "سارا", "امیر", "نرگس", "پویا"];
const LAST = ["محمدی", "شریفی", "تهرانی", "کریمی", "نوری", "جعفری", "رستمی", "صادقی", "افشار", "یوسفی", "بهرامی", "اکبری", "موسوی", "رضایی", "احمدی", "کاظمی"];

export const ADMIN_USERS: AdminUser[] = Array.from({ length: 42 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const orders = randInt(0, 14);
  const roleRoll = rand();
  return {
    id: `usr-${1000 + i}`,
    name,
    phone: `09${randInt(10, 39)}${String(randInt(1000000, 9999999))}`,
    email: `user${1000 + i}@example.com`,
    role: roleRoll > 0.94 ? "admin" : roleRoll > 0.68 ? "seller" : "customer",
    status: rand() > 0.9 ? (rand() > 0.5 ? "suspended" : "pending") : "active",
    orders,
    spent: orders * randInt(4_000_000, 90_000_000),
    joinedAt: new Date(Date.parse("2026-08-13T00:00:00.000Z") - randInt(3, 900) * 86_400_000).toISOString(),
  };
});

export const USER_ROLE_LABELS: Record<AdminUser["role"], string> = {
  customer: "خریدار",
  seller: "فروشنده",
  admin: "مدیر",
};

export const USER_STATUS_LABELS: Record<AdminUser["status"], string> = {
  active: "فعال",
  suspended: "تعلیق شده",
  pending: "در انتظار تأیید",
};

export const USER_STATUS_TONE: Record<AdminUser["status"], "success" | "danger" | "warning"> = {
  active: "success",
  suspended: "danger",
  pending: "warning",
};

/* --------------------------------------------------------------- orders --- */

const STATUSES: Order["status"][] = ["pending", "paid", "processing", "transferred", "cancelled"];
const METHODS: Order["paymentMethod"][] = ["gateway", "wallet", "installment"];

export const ADMIN_ORDERS: Order[] = Array.from({ length: 36 }, (_, i) => {
  const count = rand() > 0.82 ? 2 : 1;
  const items = Array.from({ length: count }, () => {
    const n = NUMBERS[randInt(0, NUMBERS.length - 1)];
    return { id: n.id, msisdn: n.msisdn, price: n.price, operator: n.operator, simType: n.simType };
  });
  const statusRoll = rand();
  const status: Order["status"] =
    statusRoll > 0.72
      ? "transferred"
      : statusRoll > 0.52
        ? "processing"
        : statusRoll > 0.34
          ? "paid"
          : statusRoll > 0.14
            ? "pending"
            : "cancelled";

  return {
    id: `aord-${i + 1}`,
    code: `RX-${40_600_000 - i * randInt(90, 4200)}`,
    createdAt: new Date(Date.parse("2026-08-13T09:00:00.000Z") - randInt(0, 62) * 86_400_000 - randInt(0, 82_800) * 1000).toISOString(),
    status,
    items,
    total: items.reduce((s, l) => s + l.price, 0),
    buyer: `${pick(FIRST)} ${pick(LAST)}`,
    paymentMethod: pick(METHODS),
  };
}).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

void STATUSES;

/* ------------------------------------------------------------ pending ----- */

export interface PendingListing {
  id: string;
  msisdn: string;
  operator: OperatorId;
  seller: string;
  askingPrice: number;
  score: number;
  suggestedPrice: number;
  city: string;
  submittedAt: string;
}

export const PENDING_LISTINGS: PendingListing[] = Array.from({ length: 6 }, (_, i) => {
  const n = NUMBERS[randInt(0, NUMBERS.length - 1)];
  return {
    id: `pend-${i + 1}`,
    msisdn: n.msisdn,
    operator: n.operator,
    seller: `${pick(FIRST)} ${pick(LAST)}`,
    askingPrice: Math.round((n.price * (1 + rand() * 0.5)) / 100_000) * 100_000,
    score: n.score,
    suggestedPrice: n.price,
    city: pick(CITIES),
    submittedAt: new Date(Date.parse("2026-08-13T09:00:00.000Z") - randInt(1, 96) * 3_600_000).toISOString(),
  };
});

/* -------------------------------------------------------------- summary --- */

export const ADMIN_SUMMARY = {
  revenueThisMonth: REVENUE_SERIES.at(-1)!.revenue,
  revenueDelta: 14,
  ordersThisMonth: REVENUE_SERIES.at(-1)!.orders,
  ordersDelta: 9,
  activeListings: NUMBERS.filter((n) => n.status === "available").length,
  listingsDelta: 6,
  users: ADMIN_USERS.length,
  usersDelta: 21,
  pendingReview: PENDING_LISTINGS.length,
  conversionRate: Number(((FUNNEL[3].value / FUNNEL[0].value) * 100).toFixed(1)),
  avgOrderValue: Math.round(
    ADMIN_ORDERS.reduce((s, o) => s + o.total, 0) / Math.max(1, ADMIN_ORDERS.length),
  ),
};

/** Best-performing numbers by views, for the leaderboard table. */
export const TOP_NUMBERS = [...NUMBERS].sort((a, b) => b.views - a.views).slice(0, 8);
