/**
 * Domain types for the marketplace.
 *
 * These mirror the shape the Fastify API will return in phase 2, so the mock
 * data layer in `lib/data` can be swapped for `fetch` calls without touching
 * a single component.
 */

export type OperatorId = "mci" | "irancell" | "rightel" | "shatel" | "aptel";

export type SimType = "permanent" | "credit";

export type NumberStatus = "available" | "reserved" | "sold";

/** The taxonomy Iranian buyers actually shop by. */
export type RondType =
  | "code-low" // کد پایین
  | "repeat-5" // پنج رقم تکراری
  | "repeat-4" // چهار رقم تکراری
  | "repeat-3" // سه رقم تکراری
  | "pair" // جفت جفت
  | "ladder" // پله‌ای
  | "mirror" // آینه‌ای
  | "sequential" // ترتیبی
  | "thousand" // هزاری
  | "hundred" // صدی
  | "roll" // رول
  | "balance" // ترازویی
  | "birthdate" // تاریخ تولد
  | "speakable"; // گفتاری

export interface Operator {
  id: OperatorId;
  name: string;
  shortName: string;
  prefixes: string[];
  colorVar: string;
  logo: string;
}

export interface Seller {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  sales: number;
  since: string;
  avatarSeed: string;
}

export interface PhoneNumber {
  id: string;
  slug: string;
  msisdn: string;
  operator: OperatorId;
  simType: SimType;
  status: NumberStatus;
  price: number;
  oldPrice?: number;
  rondTypes: RondType[];
  /** 0–100 desirability score, drives sorting and the score meter. */
  score: number;
  vip: boolean;
  installment: boolean;
  negotiable: boolean;
  city: string;
  seller: Seller;
  views: number;
  favorites: number;
  createdAt: string;
  description: string;
  guarantee: boolean;
}

export interface CartLine {
  id: string;
  msisdn: string;
  price: number;
  operator: OperatorId;
  simType: SimType;
}

export type SortKey =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "score-desc"
  | "popular";

export interface NumberFilters {
  q: string;
  operators: OperatorId[];
  simTypes: SimType[];
  rondTypes: RondType[];
  minPrice: number | null;
  maxPrice: number | null;
  minScore: number;
  vipOnly: boolean;
  installmentOnly: boolean;
  availableOnly: boolean;
  city: string | null;
  sort: SortKey;
}

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  status: "pending" | "paid" | "processing" | "transferred" | "cancelled";
  total: number;
  items: CartLine[];
  buyer: string;
  paymentMethod: "gateway" | "wallet" | "installment";
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "customer" | "seller" | "admin";
  status: "active" | "suspended" | "pending";
  orders: number;
  spent: number;
  joinedAt: string;
}
