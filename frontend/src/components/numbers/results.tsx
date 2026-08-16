"use client";

import { NumberCard } from "@/components/numbers/number-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { SORT_OPTIONS } from "@/lib/data/site";
import { serializeFilters } from "@/lib/filters";
import type { NumberFilters, PhoneNumber } from "@/lib/types";
import { cn, formatToman } from "@/lib/utils";
import { LayoutGrid, Rows3, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResultsToolbar({
  filters,
  total,
  shown,
}: {
  filters: NumberFilters;
  total: number;
  shown: number;
  }) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        <span className="font-bold text-foreground tabular-nums">{formatToman(total)}</span> شماره یافت شد
        {shown < total ? (
          <span className="text-subtle"> — نمایش {shown} مورد در این صفحه</span>
        ) : null}
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="hidden text-xs text-subtle sm:block">
          ترتیب:
        </label>
        <Select
          id="sort"
          value={filters.sort}
          onChange={(e) => {
            const qs = serializeFilters({ ...filters, sort: e.target.value as NumberFilters["sort"] });
            router.push(qs ? `/numbers?${qs}` : "/numbers", { scroll: false });
          }}
          className="h-10 w-36 text-[0.8125rem]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export function ResultsGrid({ items }: { items: PhoneNumber[] }) {
  const [layout, setLayout] = useState<"grid" | "row">("grid");

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="شماره‌ای با این مشخصات پیدا نشد"
        description="فیلترها را کمی بازتر کنید یا الگوی جستجو را تغییر دهید. می‌توانید درخواست خود را ثبت کنید تا به‌محض رسیدن شماره مطلع شوید."
        action={
          <Button asChild variant="outline">
            <a href="/contact">ثبت درخواست شماره سفارشی</a>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-xl border border-border bg-elevated p-1">
          {(
            [
              { value: "grid", icon: LayoutGrid, label: "نمایش شبکه‌ای" },
              { value: "row", icon: Rows3, label: "نمایش لیستی" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLayout(opt.value)}
              aria-label={opt.label}
              aria-pressed={layout === opt.value}
              title={opt.label}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-all",
                layout === opt.value
                  ? "bg-surface text-primary shadow-sm"
                  : "text-subtle hover:text-foreground",
              )}
            >
              <opt.icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          layout === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3",
        )}
      >
        {items.map((item, i) => (
          <NumberCard
            key={item.id}
            item={item}
            layout={layout}
            className="animate-count-in"
            style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
          />
        ))}
      </div>
    </>
  );
}
