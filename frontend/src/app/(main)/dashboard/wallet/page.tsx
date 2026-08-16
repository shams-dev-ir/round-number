import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { CURRENT_USER, WALLET_TX, WALLET_TX_LABELS } from "@/lib/data/account";
import { cn, formatJalali, formatToman } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  CreditCard,
  Landmark,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "کیف پول" };

export default function WalletPage() {
  const deposits = WALLET_TX.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spent = WALLET_TX.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">کیف پول</h1>
        <p className="mt-2 text-sm text-muted">
          موجودی، تسویه‌های فروش و سابقه تراکنش‌های حساب شما.
        </p>
      </header>

      {/* ---------------- balance ---------------- */}
      <section className="hairline relative overflow-hidden rounded-2xl border border-border bg-plate p-6 sm:p-7">
        <div aria-hidden className="grain absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -end-16 size-64 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs text-plate-fg/60">
              <Wallet className="size-3.5" />
              موجودی قابل استفاده
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="foil-plate font-num text-4xl font-extrabold tabular-nums">
                {formatToman(CURRENT_USER.walletBalance)}
              </span>
              <span className="text-sm text-plate-fg/60">تومان</span>
            </p>
            <Badge tone="plate" size="xs" className="mt-4">
              <ShieldCheck className="size-3 text-success" />
              حساب امانی مجزا از موجودی خرید
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="gold">
              <ArrowDownToLine />
              شارژ کیف پول
            </Button>
            <Button variant="outline" className="border-white/20 text-plate-fg hover:bg-white/8 hover:text-plate-fg">
              <ArrowUpFromLine />
              درخواست برداشت
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- stats ---------------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="مجموع واریز" value={formatToman(deposits)} unit="تومان" icon={ArrowDownToLine} tone="success" />
        <StatCard label="مجموع برداشت و خرید" value={formatToman(spent)} unit="تومان" icon={ArrowUpFromLine} tone="danger" />
        <StatCard label="تعداد تراکنش" value={WALLET_TX.length} icon={Banknote} tone="info" />
      </div>

      {/* ---------------- transactions ---------------- */}
      <section className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
        <h2 className="border-b border-border px-5 py-4 font-display text-base font-bold text-foreground">
          سابقه تراکنش‌ها
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-2xl text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas-2/50 text-start">
                <Th>نوع</Th>
                <Th>توضیح</Th>
                <Th>تاریخ</Th>
                <Th className="text-end">مبلغ</Th>
              </tr>
            </thead>
            <tbody>
              {WALLET_TX.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-b-0 hover:bg-elevated/60">
                  <td className="px-5 py-4">
                    <Badge tone={tx.amount > 0 ? "success" : "neutral"} size="xs">
                      {WALLET_TX_LABELS[tx.type]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-[0.8125rem] text-muted">{tx.note}</td>
                  <td className="px-5 py-4 text-[0.8125rem] text-muted whitespace-nowrap">
                    {formatJalali(tx.createdAt)}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-4 text-end font-num text-sm font-bold whitespace-nowrap tabular-nums",
                      tx.amount > 0 ? "text-success" : "text-danger",
                    )}
                  >
                    {tx.amount > 0 ? "+" : "−"} {formatToman(Math.abs(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- payout accounts ---------------- */}
      <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="mb-5 font-display text-base font-bold text-foreground">حساب‌های تسویه</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Landmark, bank: "بانک ملت", iban: "IR•• •••• •••• •••• •••• 6411", primary: true },
            { icon: CreditCard, bank: "بانک سامان", iban: "IR•• •••• •••• •••• •••• 8207", primary: false },
          ].map((acc) => (
            <div
              key={acc.iban}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4",
                acc.primary ? "border-primary/35 bg-primary-tint/40" : "border-border bg-canvas-2/50",
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                <acc.icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{acc.bank}</p>
                  {acc.primary ? (
                    <Badge tone="brand" size="xs">
                      پیش‌فرض
                    </Badge>
                  ) : null}
                </div>
                <p dir="ltr" className="mt-1 truncate text-[0.6875rem] text-subtle tabular-nums">
                  {acc.iban}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.6875rem] leading-relaxed text-subtle">
          برداشت تنها به حساب‌هایی انجام می‌شود که به نام صاحب حساب کاربری باشند.
        </p>
      </section>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn("px-5 py-3 text-start text-xs font-semibold whitespace-nowrap text-subtle", className)}
    >
      {children}
    </th>
  );
}
