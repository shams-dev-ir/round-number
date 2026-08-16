import { OperatorDonut, OrdersChart, RevenueChart, TrafficChart } from "@/components/admin/charts";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/data/account";
import {
  ADMIN_ORDERS,
  ADMIN_SUMMARY,
  FUNNEL,
  OPERATOR_SALES,
  PENDING_LISTINGS,
  REVENUE_SERIES,
  TOP_NUMBERS,
  TRAFFIC_SERIES,
} from "@/lib/data/admin";
import { formatToman, formatTomanCompact, timeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  Banknote,
  Check,
  Eye,
  Hash,
  Percent,
  ScrollText,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "داشبورد مدیریت" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
            داشبورد مدیریت
          </h1>
          <p className="mt-1.5 text-sm text-muted">نمای کلی عملکرد بازار در ۱۲ ماه گذشته.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/listings">
            <ScrollText />
            {ADMIN_SUMMARY.pendingReview} آگهی در انتظار بررسی
          </Link>
        </Button>
      </header>

      {/* ---------------- KPIs ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="گردش معاملات این ماه"
          value={formatTomanCompact(ADMIN_SUMMARY.revenueThisMonth)}
          unit="تومان"
          icon={Banknote}
          tone="brand"
          delta={ADMIN_SUMMARY.revenueDelta}
        />
        <StatCard
          label="سفارش‌های این ماه"
          value={ADMIN_SUMMARY.ordersThisMonth}
          icon={ShoppingBag}
          tone="gold"
          delta={ADMIN_SUMMARY.ordersDelta}
        />
        <StatCard
          label="شماره‌های فعال"
          value={formatToman(ADMIN_SUMMARY.activeListings)}
          icon={Hash}
          tone="info"
          delta={ADMIN_SUMMARY.listingsDelta}
        />
        <StatCard
          label="کاربران ثبت‌نام‌شده"
          value={formatToman(ADMIN_SUMMARY.users)}
          icon={Users}
          tone="success"
          delta={ADMIN_SUMMARY.usersDelta}
        />
      </div>

      {/* ---------------- revenue + operators ---------------- */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel
          title="گردش معاملات و درآمد"
          hint="کمیسیون ۳٪ روی هر معامله موفق"
          className="xl:col-span-2"
        >
          <RevenueChart data={REVENUE_SERIES} />
        </Panel>

        <Panel title="سهم اپراتورها" hint="بر پایه تعداد شماره‌های فعال">
          <OperatorDonut data={OPERATOR_SALES} />
        </Panel>
      </div>

      {/* ---------------- orders + traffic ---------------- */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="تعداد سفارش‌ها" hint="به تفکیک ماه">
          <OrdersChart data={REVENUE_SERIES} />
        </Panel>
        <Panel title="ترافیک سایت" hint="۱۴ روز گذشته">
          <TrafficChart data={TRAFFIC_SERIES} />
        </Panel>
      </div>

      {/* ---------------- funnel + AOV ---------------- */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="قیف تبدیل" hint="از بازدید تا سفارش موفق" className="xl:col-span-2">
          <ul className="space-y-3">
            {FUNNEL.map((stage, i) => {
              const share = (stage.value / FUNNEL[0].value) * 100;
              return (
                <li key={stage.stage}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[0.8125rem] text-muted">{stage.stage}</span>
                    <span className="text-xs font-bold text-foreground tabular-nums">
                      {formatToman(stage.value)}
                      <span className="ms-2 font-normal text-subtle">{share.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${share}%`,
                        background:
                          i === FUNNEL.length - 1
                            ? "var(--success)"
                            : `color-mix(in oklab, var(--primary) ${100 - i * 18}%, var(--info))`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="grid gap-4 content-start">
          <StatCard
            label="نرخ تبدیل"
            value={ADMIN_SUMMARY.conversionRate}
            unit="%"
            icon={Percent}
            tone="success"
            hint="بازدید صفحه شماره تا سفارش موفق"
          />
          <StatCard
            label="میانگین ارزش سفارش"
            value={formatTomanCompact(ADMIN_SUMMARY.avgOrderValue)}
            unit="تومان"
            icon={Banknote}
            tone="gold"
            hint="در ۶۰ روز گذشته"
          />
        </div>
      </div>

      {/* ---------------- pending review ---------------- */}
      <Panel
        title="آگهی‌های در انتظار کارشناسی"
        hint="قیمت پیشنهادی فروشنده را با برآورد موتور قیمت‌گذاری مقایسه کنید"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/listings">
              همه
              <ArrowLeft />
            </Link>
          </Button>
        }
        flush
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-sm">
            <thead>
              <tr className="border-y border-border bg-canvas-2/50">
                <Th>شماره</Th>
                <Th>فروشنده</Th>
                <Th>امتیاز</Th>
                <Th>قیمت فروشنده</Th>
                <Th>برآورد ما</Th>
                <Th>زمان</Th>
                <Th className="text-end">اقدام</Th>
              </tr>
            </thead>
            <tbody>
              {PENDING_LISTINGS.map((row) => {
                const gap = ((row.askingPrice - row.suggestedPrice) / row.suggestedPrice) * 100;
                return (
                  <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-elevated/50">
                    <td className="px-5 py-3.5">
                      <NumberPlate msisdn={row.msisdn} size="xs" />
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[0.8125rem] text-foreground">{row.seller}</p>
                      <p className="mt-0.5 text-[0.625rem] text-subtle">{row.city}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={row.score >= 70 ? "gold" : "neutral"} size="xs">
                        {row.score}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-[0.8125rem] font-semibold text-foreground whitespace-nowrap tabular-nums">
                      {formatToman(row.askingPrice)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-[0.8125rem] text-muted tabular-nums">
                        {formatToman(row.suggestedPrice)}
                      </span>
                      <span
                        className={`ms-2 text-[0.625rem] font-bold tabular-nums ${
                          gap > 15 ? "text-danger" : gap < -5 ? "text-success" : "text-subtle"
                        }`}
                      >
                        {gap > 0 ? "+" : ""}
                        {gap.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[0.75rem] text-subtle whitespace-nowrap">
                      {timeAgo(row.submittedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Button size="icon-sm" variant="secondary" aria-label="تأیید آگهی" title="تأیید">
                          <Check className="size-4 text-success" />
                        </Button>
                        <Button size="icon-sm" variant="secondary" aria-label="رد آگهی" title="رد">
                          <X className="size-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* ---------------- recent orders + top numbers ---------------- */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="آخرین سفارش‌ها"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                همه
                <ArrowLeft />
              </Link>
            </Button>
          }
          flush
        >
          <ul className="divide-y divide-border">
            {ADMIN_ORDERS.slice(0, 6).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p dir="ltr" className="text-xs font-bold text-foreground tabular-nums">
                    {order.code}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6875rem] text-subtle">
                    {order.buyer} — {timeAgo(order.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <Badge tone={ORDER_STATUS_TONE[order.status]} size="xs">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <p className="mt-1 text-xs font-bold text-foreground tabular-nums">
                    {formatTomanCompact(order.total)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="پربازدیدترین شماره‌ها" hint="در ۳۰ روز گذشته" flush>
          <ul className="divide-y divide-border">
            {TOP_NUMBERS.map((n, i) => (
              <li key={n.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-5 shrink-0 font-num text-xs font-bold text-subtle tabular-nums">
                  {i + 1}
                </span>
                <Link href={`/numbers/${n.slug}`} className="shrink-0">
                  <NumberPlate msisdn={n.msisdn} size="xs" variant="bare" />
                </Link>
                <div className="min-w-0 flex-1">
                  <OperatorChip operator={n.operator} showName={false} />
                </div>
                <span className="shrink-0 text-xs text-muted tabular-nums">
                  <Eye className="me-1 inline size-3" />
                  {formatToman(n.views)}
                </span>
                <span className="hidden shrink-0 text-xs font-bold text-foreground tabular-nums sm:block">
                  {formatTomanCompact(n.price)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Panel({
  title,
  hint,
  action,
  children,
  className,
  flush,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Removes body padding so tables and lists can span edge to edge. */
  flush?: boolean;
}) {
  return (
    <section
      className={`hairline overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
          {hint ? <p className="mt-1 text-[0.6875rem] text-subtle">{hint}</p> : null}
        </div>
        {action}
      </header>
      <div className={flush ? "" : "px-5 pb-5"}>{children}</div>
    </section>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-5 py-3 text-start text-xs font-semibold whitespace-nowrap text-subtle ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
