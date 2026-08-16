import { NUMBERS } from "./data/numbers";
import { OPERATORS } from "./data/site";
import type { OperatorId, PhoneNumber, SimType } from "./types";
import { analyzeNumber, normalizeDigits } from "./utils";

/** Which operator owns a prefix. Returns null for prefixes we don't sell. */
export function detectOperator(msisdn: string): OperatorId | null {
  const prefix = msisdn.slice(0, 4);
  return OPERATORS.find((o) => o.prefixes.includes(prefix))?.id ?? null;
}

export function normalizeMsisdn(input: string): string {
  let digits = normalizeDigits(input).replace(/\D/g, "");
  if (digits.startsWith("98")) digits = `0${digits.slice(2)}`;
  if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  if (digits.length === 10 && digits.startsWith("9")) digits = `0${digits}`;
  return digits;
}

export function isValidMsisdn(msisdn: string): boolean {
  return /^09\d{9}$/.test(msisdn);
}

const BANDS: { min: number; lo: number; hi: number }[] = [
  { min: 90, lo: 620_000_000, hi: 3_200_000_000 },
  { min: 82, lo: 180_000_000, hi: 680_000_000 },
  { min: 74, lo: 62_000_000, hi: 210_000_000 },
  { min: 64, lo: 24_000_000, hi: 72_000_000 },
  { min: 54, lo: 9_500_000, hi: 28_000_000 },
  { min: 42, lo: 3_800_000, hi: 11_000_000 },
  { min: 0, lo: 900_000, hi: 4_600_000 },
];

const OPERATOR_FACTOR: Record<OperatorId, number> = {
  mci: 1,
  irancell: 0.72,
  rightel: 0.5,
  shatel: 0.42,
  aptel: 0.38,
};

export interface Valuation {
  msisdn: string;
  operator: OperatorId | null;
  score: number;
  rondTypes: ReturnType<typeof analyzeNumber>["rondTypes"];
  reasons: string[];
  /** Quick-sale price — what a dealer would pay today. */
  low: number;
  /** Fair market mid-point. */
  mid: number;
  /** Patient-seller ceiling. */
  high: number;
  comparables: PhoneNumber[];
}

function round(value: number): number {
  const magnitude = Math.pow(10, Math.max(4, String(Math.round(value)).length - 3));
  return Math.max(500_000, Math.round(value / magnitude) * magnitude);
}

/**
 * Estimates a fair price band. Deliberately deterministic — the same number
 * must always quote the same range, or sellers lose trust in the tool.
 */
export function valuate(rawInput: string, simType: SimType = "permanent"): Valuation | null {
  const msisdn = normalizeMsisdn(rawInput);
  if (!isValidMsisdn(msisdn)) return null;

  const operator = detectOperator(msisdn);
  const { score, rondTypes, reasons } = analyzeNumber(msisdn);
  const prefix = msisdn.slice(0, 4);

  const band = BANDS.find((b) => score >= b.min)!;
  let base = band.lo + (band.hi - band.lo) * 0.42;

  base *= operator ? OPERATOR_FACTOR[operator] : 0.5;
  if (prefix === "0912") base *= 1.45;
  if (prefix === "0919" || prefix === "0911") base *= 1.12;
  if (simType === "credit") base *= 0.7;

  const comparables = [...NUMBERS]
    .filter((n) => n.msisdn !== msisdn)
    .map((n) => ({
      n,
      rank:
        n.rondTypes.filter((t) => rondTypes.includes(t)).length * 3 +
        (n.operator === operator ? 2 : 0) -
        Math.abs(n.score - score) / 12,
    }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 4)
    .map((x) => x.n);

  return {
    msisdn,
    operator,
    score,
    rondTypes,
    reasons,
    low: round(base * 0.78),
    mid: round(base),
    high: round(base * 1.32),
    comparables,
  };
}
