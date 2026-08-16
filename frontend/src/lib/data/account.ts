import type { Order, PhoneNumber } from "@/lib/types";
import { NUMBERS } from "./numbers";

/** The signed-in demo user. Replaced by the session payload in phase 2. */
export const CURRENT_USER = {
  id: "usr-1024",
  name: "امیر رضایی",
  phone: "09121234567",
  email: "amir.rezaei@example.com",
  nationalId: "0079123456",
  city: "تهران",
  joinedAt: "2024-05-11T00:00:00.000Z",
  walletBalance: 4_800_000,
  verified: true,
};

const pickNumbers = (indices: number[]): PhoneNumber[] => indices.map((i) => NUMBERS[i]).filter(Boolean);

const toLines = (items: PhoneNumber[]) =>
  items.map((n) => ({
    id: n.id,
    msisdn: n.msisdn,
    price: n.price,
    operator: n.operator,
    simType: n.simType,
  }));

export const MY_ORDERS: Order[] = [
  {
    id: "ord-1",
    code: "RX-40518722",
    createdAt: "2026-08-09T11:24:00.000Z",
    status: "transferred",
    items: toLines(pickNumbers([3])),
    total: NUMBERS[3]?.price ?? 0,
    buyer: CURRENT_USER.name,
    paymentMethod: "gateway",
  },
  {
    id: "ord-2",
    code: "RX-40492105",
    createdAt: "2026-08-04T08:02:00.000Z",
    status: "processing",
    items: toLines(pickNumbers([11, 27])),
    total: (NUMBERS[11]?.price ?? 0) + (NUMBERS[27]?.price ?? 0),
    buyer: CURRENT_USER.name,
    paymentMethod: "installment",
  },
  {
    id: "ord-3",
    code: "RX-40410088",
    createdAt: "2026-07-21T15:47:00.000Z",
    status: "paid",
    items: toLines(pickNumbers([42])),
    total: NUMBERS[42]?.price ?? 0,
    buyer: CURRENT_USER.name,
    paymentMethod: "wallet",
  },
  {
    id: "ord-4",
    code: "RX-40355471",
    createdAt: "2026-06-30T09:15:00.000Z",
    status: "cancelled",
    items: toLines(pickNumbers([57])),
    total: NUMBERS[57]?.price ?? 0,
    buyer: CURRENT_USER.name,
    paymentMethod: "gateway",
  },
  {
    id: "ord-5",
    code: "RX-40288930",
    createdAt: "2026-06-12T13:38:00.000Z",
    status: "transferred",
    items: toLines(pickNumbers([64, 71])),
    total: (NUMBERS[64]?.price ?? 0) + (NUMBERS[71]?.price ?? 0),
    buyer: CURRENT_USER.name,
    paymentMethod: "gateway",
  },
];

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال انتقال سند",
  transferred: "تحویل شده",
  cancelled: "لغو شده",
};

export const ORDER_STATUS_TONE: Record<Order["status"], "warning" | "info" | "brand" | "success" | "danger"> = {
  pending: "warning",
  paid: "info",
  processing: "brand",
  transferred: "success",
  cancelled: "danger",
};

export const PAYMENT_LABELS: Record<Order["paymentMethod"], string> = {
  gateway: "درگاه بانکی",
  wallet: "کیف پول",
  installment: "اقساطی",
};

/** Progress of an order through the transfer pipeline, for the tracker UI. */
export const ORDER_TIMELINE: Order["status"][] = ["paid", "processing", "transferred"];

export interface MyListing {
  id: string;
  number: PhoneNumber;
  status: "published" | "review" | "sold" | "rejected";
  askingPrice: number;
  views: number;
  inquiries: number;
  createdAt: string;
}

export const MY_LISTINGS: MyListing[] = [
  {
    id: "lst-1",
    number: NUMBERS[8],
    status: "published",
    askingPrice: NUMBERS[8]?.price ?? 0,
    views: 1_842,
    inquiries: 14,
    createdAt: "2026-07-28T10:00:00.000Z",
  },
  {
    id: "lst-2",
    number: NUMBERS[19],
    status: "review",
    askingPrice: NUMBERS[19]?.price ?? 0,
    views: 0,
    inquiries: 0,
    createdAt: "2026-08-11T16:20:00.000Z",
  },
  {
    id: "lst-3",
    number: NUMBERS[33],
    status: "sold",
    askingPrice: NUMBERS[33]?.price ?? 0,
    views: 6_320,
    inquiries: 41,
    createdAt: "2026-05-03T09:10:00.000Z",
  },
  {
    id: "lst-4",
    number: NUMBERS[50],
    status: "rejected",
    askingPrice: NUMBERS[50]?.price ?? 0,
    views: 12,
    inquiries: 0,
    createdAt: "2026-06-18T12:45:00.000Z",
  },
].filter((l) => Boolean(l.number)) as MyListing[];

export const LISTING_STATUS_LABELS: Record<MyListing["status"], string> = {
  published: "منتشر شده",
  review: "در انتظار کارشناسی",
  sold: "فروخته شده",
  rejected: "رد شده",
};

export const LISTING_STATUS_TONE: Record<MyListing["status"], "success" | "warning" | "info" | "danger"> = {
  published: "success",
  review: "warning",
  sold: "info",
  rejected: "danger",
};

export interface WalletTx {
  id: string;
  type: "deposit" | "withdraw" | "purchase" | "refund" | "settlement";
  amount: number;
  createdAt: string;
  note: string;
}

export const WALLET_TX: WalletTx[] = [
  { id: "tx-1", type: "settlement", amount: 128_000_000, createdAt: "2026-08-10T09:00:00.000Z", note: "تسویه فروش شماره 09122224444" },
  { id: "tx-2", type: "purchase", amount: -42_500_000, createdAt: "2026-08-04T08:05:00.000Z", note: "پرداخت سفارش RX-40492105" },
  { id: "tx-3", type: "deposit", amount: 20_000_000, createdAt: "2026-07-29T18:22:00.000Z", note: "شارژ کیف پول از درگاه بانکی" },
  { id: "tx-4", type: "refund", amount: 8_900_000, createdAt: "2026-07-02T11:40:00.000Z", note: "بازگشت وجه سفارش لغوشده RX-40355471" },
  { id: "tx-5", type: "withdraw", amount: -110_000_000, createdAt: "2026-06-25T14:10:00.000Z", note: "برداشت به حساب بانکی ****۶۴۱۱" },
];

export const WALLET_TX_LABELS: Record<WalletTx["type"], string> = {
  deposit: "شارژ کیف پول",
  withdraw: "برداشت",
  purchase: "خرید",
  refund: "بازگشت وجه",
  settlement: "تسویه فروش",
};
