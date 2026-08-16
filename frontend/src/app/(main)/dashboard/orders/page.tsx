import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import {
  MY_ORDERS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  PAYMENT_LABELS,
} from "@/lib/data/account";
import { SIM_TYPE_LABELS } from "@/lib/data/site";
import { formatJalali, formatToman } from "@/lib/utils";
import { ArrowLeft, Download, FileText, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "سفارش‌های من" };

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">سفارش‌های من</h1>
        <p className="mt-2 text-sm text-muted">
          سابقه کامل خریدها و وضعیت انتقال سند هر شماره.
        </p>
      </header>

      {MY_ORDERS.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag />}
          title="هنوز سفارشی ثبت نکرده‌اید"
          description="اولین شماره رند خودتان را از بازار روندیکس انتخاب کنید."
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
        <div className="space-y-4">
          {MY_ORDERS.map((order) => (
            <article
              key={order.id}
              className="hairline overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-canvas-2/50 px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  <div>
                    <p className="text-[0.625rem] text-subtle">کد سفارش</p>
                    <p dir="ltr" className="text-xs font-bold text-foreground tabular-nums">
                      {order.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.625rem] text-subtle">تاریخ</p>
                    <p className="text-xs font-medium text-foreground">{formatJalali(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[0.625rem] text-subtle">روش پرداخت</p>
                    <p className="text-xs font-medium text-foreground">
                      {PAYMENT_LABELS[order.paymentMethod]}
                    </p>
                  </div>
                </div>
                <Badge tone={ORDER_STATUS_TONE[order.status]} size="xs">
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </header>

              <ul className="divide-y divide-border">
                {order.items.map((line) => (
                  <li key={line.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <Link href={`/numbers/${line.id}`} className="shrink-0">
                      <NumberPlate msisdn={line.msisdn} size="sm" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <OperatorChip operator={line.operator} />
                      <Badge tone="neutral" size="xs">
                        {SIM_TYPE_LABELS[line.simType]}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {formatToman(line.price)}
                      <span className="ms-1 text-[0.625rem] font-normal text-muted">تومان</span>
                    </span>
                  </li>
                ))}
              </ul>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText />
                    مشاهده فاکتور
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download />
                    دانلود مدارک
                  </Button>
                </div>
                <p className="flex items-baseline gap-1.5">
                  <span className="text-xs text-muted">مبلغ کل:</span>
                  <span className="font-num text-base font-extrabold text-price tabular-nums">
                    {formatToman(order.total)}
                  </span>
                  <span className="text-[0.625rem] text-muted">تومان</span>
                </p>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
