import { NumberPlate } from "@/components/numbers/number-plate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  CURRENT_USER,
  MY_LISTINGS,
  MY_ORDERS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  ORDER_TIMELINE,
} from "@/lib/data/account";
import { cn, formatJalali, formatToman, timeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Eye,
  Gauge,
  ShoppingBag,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "پنل کاربری" };

export default function DashboardPage() {
  const active = MY_ORDERS.find((o) => o.status === "processing" || o.status === "paid");
  const totalSpent = MY_ORDERS.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const totalViews = MY_LISTINGS.reduce((s, l) => s + l.views, 0);

  return (
    <div className="space-y-6">
      {/* ---------------- greeting ---------------- */}
      <header className="hairline relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -end-10 size-48 rounded-full bg-primary/12 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              سلام {CURRENT_USER.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-sm text-muted">
              عضو روندیکس از {formatJalali(CURRENT_USER.joinedAt)} — خوشحالیم که همراه ما هستید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/numbers">
                <ShoppingBag />
                خرید شماره
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/sell">
                <Store />
                ثبت آگهی فروش
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------------- stats ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="سفارش‌های من"
          value={MY_ORDERS.length}
          icon={ShoppingBag}
          tone="brand"
          hint={`${MY_ORDERS.filter((o) => o.status === "transferred").length} سفارش تحویل شده`}
        />
        <StatCard
          label="مجموع خرید"
          value={formatToman(totalSpent)}
          unit="تومان"
          icon={Gauge}
          tone="gold"
          delta={18}
        />
        <StatCard
          label="موجودی کیف پول"
          value={formatToman(CURRENT_USER.walletBalance)}
          unit="تومان"
          icon={Wallet}
          tone="success"
          hint="قابل استفاده برای خرید یا برداشت"
        />
        <StatCard
          label="بازدید آگهی‌ها"
          value={formatToman(totalViews)}
          icon={Eye}
          tone="info"
          delta={9}
        />
      </div>

      {/* ---------------- active order tracker ---------------- */}
      {active ? (
        <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">سفارش در جریان</h2>
              <p dir="ltr" className="mt-1 text-xs text-subtle tabular-nums">
                {active.code}
              </p>
            </div>
            <Badge tone={ORDER_STATUS_TONE[active.status]} size="xs">
              {ORDER_STATUS_LABELS[active.status]}
            </Badge>
          </div>

          {/* pipeline */}
          <ol className="flex items-center">
            {ORDER_TIMELINE.map((stage, i) => {
              const currentIndex = ORDER_TIMELINE.indexOf(active.status);
              const done = i <= currentIndex;
              const labels = ["پرداخت تأیید شد", "در حال انتقال سند", "تحویل و تکمیل"];
              const icons = [Check, Gauge, Truck];
              const Icon = icons[i];
              return (
                <li key={stage} className="flex flex-1 items-center">
                  <div className="flex min-w-0 flex-col items-center gap-2 text-center">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                        done
                          ? "border-primary bg-primary text-primary-fg"
                          : "border-border bg-elevated text-subtle",
                      )}
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <span
                      className={cn(
                        "text-[0.6875rem] leading-[1.55]",
                        done ? "font-medium text-foreground" : "text-subtle",
                      )}
                    >
                      {labels[i]}
                    </span>
                  </div>
                  {i < ORDER_TIMELINE.length - 1 ? (
                    <span
                      className={cn(
                        "mx-2 h-0.5 flex-1 rounded-full transition-colors",
                        i < currentIndex ? "bg-primary" : "bg-border",
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="mt-6 space-y-2.5 border-t border-border pt-5">
            {active.items.map((line) => (
              <div
                key={line.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-canvas-2/60 p-3"
              >
                <NumberPlate msisdn={line.msisdn} size="xs" />
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatToman(line.price)} تومان
                </span>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="mt-5">
            <Link href="/dashboard/orders">
              جزئیات سفارش
              <ArrowLeft />
            </Link>
          </Button>
        </section>
      ) : null}

      {/* ---------------- recent orders + listings ---------------- */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-bold text-foreground">آخرین سفارش‌ها</h2>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-primary hover:underline">
              همه
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {MY_ORDERS.slice(0, 4).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p dir="ltr" className="text-xs font-semibold text-foreground tabular-nums">
                    {order.code}
                  </p>
                  <p className="mt-1 text-[0.6875rem] text-subtle">
                    {order.items.length} شماره — {timeAgo(order.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <Badge tone={ORDER_STATUS_TONE[order.status]} size="xs">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <p className="mt-1.5 text-xs font-bold text-foreground tabular-nums">
                    {formatToman(order.total)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-bold text-foreground">آگهی‌های فروش من</h2>
            <Link href="/dashboard/listings" className="text-xs font-semibold text-primary hover:underline">
              همه
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {MY_LISTINGS.slice(0, 4).map((listing) => (
              <li key={listing.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <NumberPlate msisdn={listing.number.msisdn} size="xs" variant="bare" />
                <div className="shrink-0 text-end">
                  <p className="text-xs font-bold text-foreground tabular-nums">
                    {formatToman(listing.askingPrice)}
                  </p>
                  <p className="mt-1 text-[0.6875rem] text-subtle tabular-nums">
                    {formatToman(listing.views)} بازدید
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
