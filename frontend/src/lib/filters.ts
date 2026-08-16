import type { NumberFilters, OperatorId, RondType, SimType, SortKey } from "./types";
import { DEFAULT_FILTERS } from "./data/numbers";
import { OPERATORS, ROND_TYPES, SORT_OPTIONS } from "./data/site";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const OPERATOR_IDS = new Set(OPERATORS.map((o) => o.id));
const ROND_IDS = new Set(ROND_TYPES.map((t) => t.id));
const SORT_KEYS = new Set(SORT_OPTIONS.map((o) => o.value));

function csv(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const flat = Array.isArray(value) ? value.join(",") : value;
  return flat
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function num(value: string | string[] | undefined): number | null {
  const raw = one(value);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

const truthy = (value: string | string[] | undefined) => ["1", "true", "yes"].includes(one(value));

/** URL → filters. Unknown or malformed values fall back to the default. */
export function parseFilters(params: RawSearchParams): NumberFilters {
  return {
    q: one(params.q),
    operators: csv(params.operator).filter((v): v is OperatorId => OPERATOR_IDS.has(v as OperatorId)),
    simTypes: csv(params.sim).filter((v): v is SimType => v === "permanent" || v === "credit"),
    rondTypes: csv(params.rond).filter((v): v is RondType => ROND_IDS.has(v as RondType)),
    minPrice: num(params.min),
    maxPrice: num(params.max),
    minScore: num(params.score) ?? 0,
    vipOnly: truthy(params.vip),
    installmentOnly: truthy(params.installment),
    availableOnly: truthy(params.available),
    city: one(params.city) || null,
    sort: SORT_KEYS.has(one(params.sort) as SortKey) ? (one(params.sort) as SortKey) : "newest",
  };
}

export function parsePage(params: RawSearchParams): number {
  const page = num(params.page);
  return page && page > 0 ? Math.floor(page) : 1;
}

/** Filters → query string. Defaults are omitted so URLs stay short and shareable. */
export function serializeFilters(filters: NumberFilters, page = 1): string {
  const p = new URLSearchParams();
  if (filters.q) p.set("q", filters.q);
  if (filters.operators.length) p.set("operator", filters.operators.join(","));
  if (filters.simTypes.length) p.set("sim", filters.simTypes.join(","));
  if (filters.rondTypes.length) p.set("rond", filters.rondTypes.join(","));
  if (filters.minPrice !== null) p.set("min", String(filters.minPrice));
  if (filters.maxPrice !== null) p.set("max", String(filters.maxPrice));
  if (filters.minScore > 0) p.set("score", String(filters.minScore));
  if (filters.vipOnly) p.set("vip", "1");
  if (filters.installmentOnly) p.set("installment", "1");
  if (filters.availableOnly) p.set("available", "1");
  if (filters.city) p.set("city", filters.city);
  if (filters.sort !== "newest") p.set("sort", filters.sort);
  if (page > 1) p.set("page", String(page));
  return p.toString();
}

export function activeFilterCount(filters: NumberFilters): number {
  let n = 0;
  if (filters.q) n++;
  n += filters.operators.length + filters.simTypes.length + filters.rondTypes.length;
  if (filters.minPrice !== null || filters.maxPrice !== null) n++;
  if (filters.minScore > 0) n++;
  if (filters.vipOnly) n++;
  if (filters.installmentOnly) n++;
  if (filters.availableOnly) n++;
  if (filters.city) n++;
  return n;
}

export const isDefaultFilters = (filters: NumberFilters) => activeFilterCount(filters) === 0;

export { DEFAULT_FILTERS };
