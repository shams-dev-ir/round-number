"use client";

import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, ScoreMeter } from "@/components/ui/misc";
import { getNumber } from "@/lib/data/numbers";
import { ROND_LABELS, SIM_TYPE_LABELS, STATUS_LABELS } from "@/lib/data/site";
import { cn, formatToman, timeAgo } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/favorites";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { ArrowLeft, Check, GitCompareArrows, Minus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ComparePage() {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const mounted = useIsHydrated();

  if (!mounted) return <div className="container-page py-16" aria-busy />;

  const items = ids.map((id) => getNumber(id)).filter((n): n is NonNullable<typeof n> => Boolean(n));

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<GitCompareArrows />}
          title="چیزی برای مقایسه انتخاب نشده"
          description="تا چهار شماره را با نشان مقایسه انتخاب کنید تا مشخصاتشان را کنار هم ببینید."
          action={
            <Button asChild>
              <Link href="/numbers">
                مرور شماره‌ها
                <ArrowLeft />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const cheapest = Math.min(...items.map((i) => i.price));
  const bestScore = Math.max(...items.map((i) => i.score));

  const rows: { label: string; render: (item: (typeof items)[number]) => React.ReactNode }[] = [
    {
      label: "قیمت",
      render: (item) => (
        <div>
          <span
            className={cn(
              "font-num text-base font-extrabold tabular-nums",
              item.price === cheapest ? "text-success" : "text-foreground",
            )}
          >
            {formatToman(item.price)}
          </span>
          <span className="ms-1 text-[0.625rem] text-muted">تومان</span>
          {item.price === cheapest && items.length > 1 ? (
            <Badge tone="success" size="xs" className="ms-2">
              ارزان‌ترین
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      label: "امتیاز رندی",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ScoreMeter score={item.score} size="sm" />
          {item.score === bestScore && items.length > 1 ? (
            <Badge tone="gold" size="xs">
              رندترین
            </Badge>
          ) : null}
        </div>
      ),
    },
    { label: "اپراتور", render: (item) => <OperatorChip operator={item.operator} /> },
    { label: "نوع سیم‌کارت", render: (item) => SIM_TYPE_LABELS[item.simType] },
    {
      label: "وضعیت",
      render: (item) => (
        <Badge tone={item.status === "available" ? "success" : "warning"} size="xs">
          {STATUS_LABELS[item.status]}
        </Badge>
      ),
    },
    {
      label: "الگوهای رند",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.rondTypes.map((t) => (
            <span key={t} className="rounded-md bg-elevated px-1.5 py-0.5 text-[0.625rem] text-muted">
              {ROND_LABELS[t]}
            </span>
          ))}
        </div>
      ),
    },
    { label: "شهر فروشنده", render: (item) => item.city },
    {
      label: "اقساطی",
      render: (item) => <BoolCell value={item.installment} />,
    },
    { label: "ضمانت بازگشت", render: (item) => <BoolCell value={item.guarantee} /> },
    { label: "قابل مذاکره", render: (item) => <BoolCell value={item.negotiable} /> },
    { label: "بازدید", render: (item) => <span className="tabular-nums">{formatToman(item.views)}</span> },
    { label: "زمان ثبت", render: (item) => timeAgo(item.createdAt) },
  ];

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          مقایسه شماره‌ها
        </h1>
        <p className="mt-2 text-sm text-muted">
          {items.length} شماره در حال مقایسه — بهترین مقدار هر سطر با نشان مشخص شده است.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-3xl border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky start-0 z-10 w-40 border-b border-e border-border bg-surface p-4 text-start text-xs font-semibold text-subtle">
                مشخصات
              </th>
              {items.map((item) => (
                <th key={item.id} className="border-b border-e border-border p-4 last:border-e-0">
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-label="حذف از مقایسه"
                      className="self-end rounded-lg p-1 text-subtle transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      <X className="size-4" />
                    </button>
                    <Link href={`/numbers/${item.slug}`}>
                      <NumberPlate msisdn={item.msisdn} size="sm" />
                    </Link>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={item.status !== "available"}
                      onClick={() => {
                        addToCart(item);
                        toast.success("به سبد خرید اضافه شد", { description: item.msisdn });
                      }}
                    >
                      <ShoppingBag />
                      افزودن به سبد
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 1 ? "bg-canvas-2/50" : undefined}>
                <th
                  scope="row"
                  className={cn(
                    "sticky start-0 z-10 border-b border-e border-border p-4 text-start text-xs font-medium text-muted",
                    i % 2 === 1 ? "bg-canvas-2" : "bg-surface",
                  )}
                >
                  {row.label}
                </th>
                {items.map((item) => (
                  <td
                    key={item.id}
                    className="border-b border-e border-border p-4 text-center text-[0.8125rem] text-foreground last:border-e-0"
                  >
                    <div className="flex justify-center">{row.render(item)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/numbers">
            <ArrowLeft className="rotate-180" />
            افزودن شماره دیگر
          </Link>
        </Button>
      </div>
    </div>
  );
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <span className="flex size-6 items-center justify-center rounded-full bg-success-tint text-success">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="flex size-6 items-center justify-center rounded-full bg-elevated text-subtle">
      <Minus className="size-3.5" />
    </span>
  );
}
