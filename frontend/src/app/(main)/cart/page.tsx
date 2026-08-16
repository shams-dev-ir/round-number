"use client";

import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { SIM_TYPE_LABELS } from "@/lib/data/site";
import { formatToman } from "@/lib/utils";
import { cartTotal, COMMISSION_RATE, TRANSFER_FEE, useCart } from "@/store/cart";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { ArrowLeft, ShieldCheck, ShoppingBag, Ticket, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

/** Demo coupons — the real list will come from the API. */
const COUPONS: Record<string, number> = { RONDIX10: 0.1, WELCOME5: 0.05 };

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const mounted = useIsHydrated();
  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);

  const subtotal = cartTotal(lines);
  const commission = Math.round(subtotal * COMMISSION_RATE);
  const transfer = lines.length > 0 ? TRANSFER_FEE * lines.length : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal + commission + transfer - discount);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    const rate = COUPONS[code];
    if (rate) {
      setDiscountRate(rate);
      toast.success(`کد تخفیف اعمال شد — ${rate * 100}٪`);
    } else {
      setDiscountRate(0);
      toast.error("کد تخفیف معتبر نیست");
    }
  };

  if (!mounted) {
    return <div className="container-page py-16" aria-busy />;
  }

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">سبد خرید</h1>
        <p className="mt-2 text-sm text-muted">
          {lines.length > 0
            ? `${lines.length} شماره در سبد شما — تا تأیید انتقال سند، پرداخت در حساب امانی می‌ماند.`
            : "هنوز شماره‌ای انتخاب نکرده‌اید."}
        </p>
      </header>

      {lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag />}
          title="سبد خرید شما خالی است"
          description="از بازار روندیکس شماره دلخواهتان را انتخاب کنید. رزرو رایگان است و هر زمان می‌توانید منصرف شوید."
          action={
            <Button asChild>
              <Link href="/numbers">
                مرور شماره‌ها
                <ArrowLeft />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
          {/* ---------------- lines ---------------- */}
          <div className="min-w-0 space-y-3">
            {lines.map((line) => (
              <div
                key={line.id}
                className="hairline flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <Link href={`/numbers/${line.id}`} className="shrink-0">
                  <NumberPlate msisdn={line.msisdn} size="sm" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <OperatorChip operator={line.operator} />
                  <Badge tone="neutral" size="xs">
                    {SIM_TYPE_LABELS[line.simType]}
                  </Badge>
                </div>

                <div className="text-end">
                  <div className="font-num text-base font-bold text-price tabular-nums">
                    {formatToman(line.price)}
                  </div>
                  <div className="text-[0.625rem] text-subtle">تومان</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    remove(line.id);
                    toast.success("از سبد خرید حذف شد");
                  }}
                  aria-label="حذف از سبد"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-subtle transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/numbers">
                  <ArrowLeft className="rotate-180" />
                  ادامه خرید
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clear();
                  toast.success("سبد خرید خالی شد");
                }}
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 />
                خالی کردن سبد
              </Button>
            </div>
          </div>

          {/* ---------------- summary ---------------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
              <h2 className="border-b border-border px-5 py-4 font-display text-base font-bold text-foreground">
                خلاصه سفارش
              </h2>

              <form onSubmit={applyCoupon} className="border-b border-border p-5">
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="کد تخفیف"
                    icon={<Ticket />}
                    aria-label="کد تخفیف"
                    className="h-10"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                    اعمال
                  </Button>
                </div>
                {discountRate > 0 ? (
                  <p className="mt-2 text-[0.6875rem] text-success">
                    کد تخفیف {formatToman(discountRate * 100)}٪ فعال است.
                  </p>
                ) : null}
              </form>

              <dl className="space-y-3 p-5 text-sm">
                <Row label={`جمع ${lines.length} شماره`} value={formatToman(subtotal)} />
                <Row label="کمیسیون روندیکس (۳٪)" value={formatToman(commission)} />
                <Row label="هزینه انتقال سند" value={formatToman(transfer)} />
                {discount > 0 ? (
                  <Row label="تخفیف" value={`− ${formatToman(discount)}`} tone="success" />
                ) : null}
                <div className="border-t border-border pt-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-bold text-foreground">مبلغ قابل پرداخت</dt>
                    <dd className="text-end">
                      <span className="foil font-num text-xl font-extrabold tabular-nums">
                        {formatToman(total)}
                      </span>
                      <span className="ms-1 text-[0.6875rem] text-muted">تومان</span>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="p-5 pt-0">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    ادامه و پرداخت
                    <ArrowLeft />
                  </Link>
                </Button>
                <p className="mt-3 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-subtle">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
                  مبلغ در حساب امانی نگه داشته می‌شود و پس از تأیید انتقال سند توسط شما به فروشنده
                  پرداخت می‌گردد.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={tone === "success" ? "font-semibold text-success tabular-nums" : "font-semibold text-foreground tabular-nums"}>
        {value}
      </dd>
    </div>
  );
}
