import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RondType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================================
   Money
   ========================================================================== */

const TOMAN_GROUP = /\B(?=(\d{3})+(?!\d))/g;

/** 12500000 → "12,500,000" */
export function formatToman(value: number): string {
  return Math.round(value).toString().replace(TOMAN_GROUP, ",");
}

/** 12500000 → "12.5 میلیون" — for tight spots like cards and chips. */
export function formatTomanCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${trimZero(value / 1_000_000_000)} میلیارد`;
  }
  if (value >= 1_000_000) {
    return `${trimZero(value / 1_000_000)} میلیون`;
  }
  if (value >= 1_000) {
    return `${trimZero(value / 1_000)} هزار`;
  }
  return formatToman(value);
}

function trimZero(n: number): string {
  const fixed = n >= 100 ? n.toFixed(0) : n.toFixed(1);
  return fixed.replace(/\.0$/, "");
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/* ==========================================================================
   Phone number formatting
   ========================================================================== */

/** "09121110000" → ["0912", "111", "0000"] (the Iranian 4-3-4 convention). */
export function numberGroups(msisdn: string): [string, string, string] {
  const d = msisdn.replace(/\D/g, "").padStart(11, "0");
  return [d.slice(0, 4), d.slice(4, 7), d.slice(7, 11)];
}

/** "09121110000" → "0912 111 0000" */
export function formatMsisdn(msisdn: string): string {
  return numberGroups(msisdn).join(" ");
}

export function msisdnPrefix(msisdn: string): string {
  return msisdn.replace(/\D/g, "").slice(0, 4);
}

/** Digits after the operator prefix — the part that makes a number "rond". */
export function msisdnTail(msisdn: string): string {
  return msisdn.replace(/\D/g, "").slice(4);
}

/**
 * Marks which digits participate in a rond pattern, so the plate can gild
 * exactly those and leave the rest plain. Operates on the 7-digit tail.
 */
export function highlightFlags(tail: string): boolean[] {
  const flags = new Array<boolean>(tail.length).fill(false);

  // Runs of the same digit (2 or more).
  for (let i = 0; i < tail.length; ) {
    let j = i;
    while (j + 1 < tail.length && tail[j + 1] === tail[i]) j++;
    if (j - i + 1 >= 2) {
      for (let k = i; k <= j; k++) flags[k] = true;
    }
    i = j + 1;
  }

  // Ascending / descending runs of 3 or more.
  for (let i = 0; i < tail.length - 2; ) {
    const step = Number(tail[i + 1]) - Number(tail[i]);
    if (step === 1 || step === -1) {
      let j = i + 1;
      while (j + 1 < tail.length && Number(tail[j + 1]) - Number(tail[j]) === step) j++;
      if (j - i + 1 >= 3) {
        for (let k = i; k <= j; k++) flags[k] = true;
        i = j;
        continue;
      }
    }
    i++;
  }

  // Alternating blocks — ABAB (ladder) and ABABAB (roll). Neither rule above
  // catches them, yet both are patterns we badge and charge for.
  for (let i = 0; i + 4 <= tail.length; i++) {
    if (tail[i] === tail[i + 2] && tail[i + 1] === tail[i + 3] && tail[i] !== tail[i + 1]) {
      for (let k = i; k < i + 4; k++) flags[k] = true;
    }
  }

  // Mirrored numbers earn their value from the whole run, so gild the whole run.
  if (isPalindrome(tail)) {
    flags.fill(true);
  } else if (isPalindrome(tail.slice(-5))) {
    for (let k = tail.length - 5; k < tail.length; k++) flags[k] = true;
  }

  // A Jalali year in the last four digits is the pattern being sold.
  if (isJalaliYear(tail.slice(-4))) {
    for (let k = tail.length - 4; k < tail.length; k++) flags[k] = true;
  }

  return flags;
}

/* ==========================================================================
   Rond detection + valuation
   ========================================================================== */

const LOW_CODE_PREFIXES = new Set(["0912", "0911", "0913", "0919"]);

function longestRepeatRun(s: string): number {
  let best = 1;
  let run = 1;
  for (let i = 1; i < s.length; i++) {
    run = s[i] === s[i - 1] ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

function longestMonotonicRun(s: string): number {
  let best = 1;
  let run = 1;
  let dir = 0;
  for (let i = 1; i < s.length; i++) {
    const step = Number(s[i]) - Number(s[i - 1]);
    if (step === dir && (step === 1 || step === -1)) {
      run += 1;
    } else if (step === 1 || step === -1) {
      dir = step;
      run = 2;
    } else {
      dir = 0;
      run = 1;
    }
    if (run > best) best = run;
  }
  return best;
}

function isPalindrome(s: string): boolean {
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}

/** Four digits that read as a plausible Jalali birth year (1300–1429). */
function isJalaliYear(last4: string): boolean {
  return /^13\d{2}$/.test(last4) || /^14[0-2]\d$/.test(last4);
}

function digitSum(s: string): number {
  let total = 0;
  for (const ch of s) total += Number(ch);
  return total;
}

/** Score at or above which a number is marketed as VIP and gilded gold. */
export const VIP_SCORE = 70;
/** Score at or above which a number is considered a solid rond. */
export const GOOD_SCORE = 56;

export type ScoreTier = "vip" | "good" | "fair";

export function scoreTier(score: number): ScoreTier {
  if (score >= VIP_SCORE) return "vip";
  if (score >= GOOD_SCORE) return "good";
  return "fair";
}

export interface NumberAnalysis {
  rondTypes: RondType[];
  score: number;
  /** Human-readable reasons, shown on the detail page. */
  reasons: string[];
}

/**
 * Classifies a number and scores its desirability 0–100. Used both to build
 * the catalogue and to power the public "value my number" tool.
 */
export function analyzeNumber(msisdn: string): NumberAnalysis {
  const digits = msisdn.replace(/\D/g, "").padStart(11, "0");
  const prefix = digits.slice(0, 4);
  const tail = digits.slice(4);
  const types = new Set<RondType>();
  const reasons: string[] = [];
  let score = 20;

  if (LOW_CODE_PREFIXES.has(prefix)) {
    types.add("code-low");
    reasons.push(`کد ${prefix} از کدهای قدیمی و کم‌یاب است`);
    score += prefix === "0912" ? 16 : 9;
  }

  const repeat = longestRepeatRun(tail);
  if (repeat >= 5) {
    types.add("repeat-5");
    reasons.push(`${repeat} رقم تکراری پشت سر هم`);
    score += 38;
  } else if (repeat === 4) {
    types.add("repeat-4");
    reasons.push("چهار رقم تکراری پشت سر هم");
    score += 30;
  } else if (repeat === 3) {
    types.add("repeat-3");
    reasons.push("سه رقم تکراری پشت سر هم");
    score += 18;
  }

  if (tail.endsWith("000")) {
    types.add("thousand");
    reasons.push("پایان هزاری (۰۰۰)");
    score += 16;
  } else if (tail.endsWith("00")) {
    types.add("hundred");
    reasons.push("پایان صدی (۰۰)");
    score += 9;
  }

  const mono = longestMonotonicRun(tail);
  if (mono >= 4) {
    types.add("sequential");
    reasons.push(`${mono} رقم ترتیبی`);
    score += mono >= 5 ? 26 : 17;
  }

  if (isPalindrome(tail)) {
    types.add("mirror");
    reasons.push("کل شماره آینه‌ای است");
    score += 24;
  } else if (isPalindrome(tail.slice(-5))) {
    types.add("mirror");
    reasons.push("پنج رقم آخر آینه‌ای است");
    score += 13;
  }

  const last4 = tail.slice(-4);
  if (last4[0] === last4[1] && last4[2] === last4[3] && last4[0] !== last4[2]) {
    types.add("pair");
    reasons.push("جفت‌جفت در چهار رقم آخر");
    score += 14;
  }
  if (last4[0] === last4[2] && last4[1] === last4[3] && last4[0] !== last4[1]) {
    types.add("ladder");
    reasons.push("پله‌ای در چهار رقم آخر");
    score += 13;
  }

  const last6 = tail.slice(-6);
  if (last6.length === 6) {
    const block = last6.slice(0, 2);
    if (block[0] !== block[1] && last6 === block.repeat(3)) {
      types.add("roll");
      reasons.push("رول (تکرار یک جفت رقم)");
      score += 22;
    }
    if (digitSum(last6.slice(0, 3)) === digitSum(last6.slice(3))) {
      types.add("balance");
      reasons.push("ترازویی (تعادل مجموع ارقام)");
      score += 7;
    }
  }

  if (isJalaliYear(last4)) {
    types.add("birthdate");
    reasons.push("چهار رقم آخر یک سال شمسی است");
    score += 6;
  }

  if (types.size === 0) {
    types.add("speakable");
    reasons.push("خوش‌آهنگ و راحت برای گفتن");
  }

  return {
    rondTypes: [...types],
    score: Math.max(8, Math.min(99, Math.round(score))),
    reasons,
  };
}

/* ==========================================================================
   Jalali dates — implemented locally so the server and the client always
   agree (no Intl / ICU version drift, therefore no hydration mismatch).
   ========================================================================== */

const JALALI_MONTHS = [
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

const GREGORIAN_MONTH_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function toJalali(gy: number, gm: number, gd: number) {
  const div = (a: number, b: number) => Math.floor(a / b);
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    GREGORIAN_MONTH_DAYS[gm - 1];
  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

/** "2026-03-21T…" → "۱ فروردین ۱۴۰۵" style, with Latin digits. */
export function formatJalali(iso: string, opts?: { withMonthName?: boolean }): string {
  const d = new Date(iso);
  const { jy, jm, jd } = toJalali(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  if (opts?.withMonthName === false) {
    return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
  }
  return `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`;
}

export function formatJalaliShort(iso: string): string {
  return formatJalali(iso, { withMonthName: false });
}

/**
 * Relative time in Persian. `now` is injectable so server-rendered output can
 * be made stable in tests.
 */
export function timeAgo(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "همین حالا";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ماه پیش`;
  return `${Math.floor(months / 12)} سال پیش`;
}

/* ==========================================================================
   Misc
   ========================================================================== */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Normalises Persian/Arabic digits typed into inputs to ASCII. */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");
}
