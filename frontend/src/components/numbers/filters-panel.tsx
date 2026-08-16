"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/disclosure";
import { Checkbox, Input, Label, Pill, PillGroup, Select, Switch } from "@/components/ui/field";
import { CITIES, OPERATORS, PRICE_TIERS, ROND_LABELS, ROND_TYPES, SIM_TYPE_LABELS } from "@/lib/data/site";
import { activeFilterCount, DEFAULT_FILTERS, serializeFilters } from "@/lib/filters";
import type { NumberFilters, OperatorId, RondType, SimType } from "@/lib/types";
import { cn, formatTomanCompact, VIP_SCORE } from "@/lib/utils";
import { Crown, Eraser, Search, SlidersHorizontal, Wallet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/**
 * The URL is the single source of truth for the result set; this panel only
 * holds a draft so typing feels instant, then pushes a serialized query.
 */
export function FiltersPanel({
  filters,
  counts,
  total,
}: {
  filters: NumberFilters;
  counts: { rond: Record<RondType, number>; operator: Record<OperatorId, number> };
  total: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = activeFilterCount(filters);

  return (
    <>
      {/* mobile trigger */}
      <div className="flex items-center gap-2 lg:hidden">
        <Button variant="outline" onClick={() => setMobileOpen(true)} className="flex-1">
          <SlidersHorizontal />
          فیلترها
          {activeCount > 0 ? (
            <Badge tone="brand" size="xs" className="ms-1">
              {activeCount}
            </Badge>
          ) : null}
        </Button>
      </div>

      <Sheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="فیلترها"
        side="end"
        footer={
          <Button className="w-full" onClick={() => setMobileOpen(false)}>
            نمایش {total} شماره
          </Button>
        }
      >
        <FilterForm filters={filters} counts={counts} />
      </Sheet>

      {/* desktop rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-surface">
          <FilterForm filters={filters} counts={counts} />
        </div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function FilterForm({
  filters,
  counts,
}: {
  filters: NumberFilters;
  counts: { rond: Record<RondType, number>; operator: Record<OperatorId, number> };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState(filters);

  // Keep the draft in step when the URL changes from outside (chips, back
  // button). Adjusted during render so the inputs never flash the stale draft.
  const [syncedFrom, setSyncedFrom] = useState(filters);
  if (syncedFrom !== filters) {
    setSyncedFrom(filters);
    setDraft(filters);
  }

  const apply = (next: NumberFilters) => {
    setDraft(next);
    startTransition(() => {
      const qs = serializeFilters(next);
      router.push(qs ? `/numbers?${qs}` : "/numbers", { scroll: false });
    });
  };

  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const activeCount = activeFilterCount(draft);

  return (
    <div className={cn("divide-y divide-border", pending && "opacity-70")}>
      {/* ---- header ---- */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          فیلترها
        </h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => apply(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-danger transition-opacity hover:opacity-75"
          >
            <Eraser className="size-3.5" />
            پاک کردن ({activeCount})
          </button>
        ) : null}
      </div>

      {/* ---- search ---- */}
      <Group>
        <Label hint="* = هر رقمی">جستجوی شماره</Label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(draft);
          }}
        >
          <Input
            value={draft.q}
            onChange={(e) => setDraft({ ...draft, q: e.target.value })}
            digitsOnly
            icon={<Search />}
            placeholder="0912***11**"
            aria-label="جستجوی شماره"
          />
        </form>
      </Group>

      {/* ---- quick toggles ---- */}
      <Group className="space-y-3.5">
        <Switch
          label={
            <span className="flex items-center gap-1.5">
              <Crown className="size-3.5 text-price" />
              فقط شماره‌های VIP
            </span>
          }
          description={`امتیاز رندی ${VIP_SCORE} و بالاتر`}
          checked={draft.vipOnly}
          onChange={(e) => apply({ ...draft, vipOnly: e.target.checked })}
        />
        <Switch
          label={
            <span className="flex items-center gap-1.5">
              <Wallet className="size-3.5 text-success" />
              قابل خرید اقساطی
            </span>
          }
          checked={draft.installmentOnly}
          onChange={(e) => apply({ ...draft, installmentOnly: e.target.checked })}
        />
        <Switch
          label="فقط موجودها"
          description="رزروشده و فروخته‌شده را پنهان کن"
          checked={draft.availableOnly}
          onChange={(e) => apply({ ...draft, availableOnly: e.target.checked })}
        />
      </Group>

      {/* ---- operator ---- */}
      <Group>
        <Label>اپراتور</Label>
        <div className="space-y-0.5">
          {OPERATORS.map((op) => (
            <Checkbox
              key={op.id}
              label={op.name}
              count={counts.operator[op.id] ?? 0}
              checked={draft.operators.includes(op.id)}
              onChange={() => apply({ ...draft, operators: toggleIn(draft.operators, op.id) })}
            />
          ))}
        </div>
      </Group>

      {/* ---- sim type ---- */}
      <Group>
        <Label>نوع سیم‌کارت</Label>
        <PillGroup className="w-full">
          {(["permanent", "credit"] as SimType[]).map((t) => (
            <Pill
              key={t}
              active={draft.simTypes.includes(t)}
              onClick={() => apply({ ...draft, simTypes: toggleIn(draft.simTypes, t) })}
              className="flex-1"
            >
              {SIM_TYPE_LABELS[t]}
            </Pill>
          ))}
        </PillGroup>
      </Group>

      {/* ---- price ---- */}
      <Group>
        <Label
          hint={
            draft.minPrice !== null || draft.maxPrice !== null ? (
              <button
                type="button"
                onClick={() => apply({ ...draft, minPrice: null, maxPrice: null })}
                className="text-danger"
              >
                حذف
              </button>
            ) : null
          }
        >
          بازه قیمت (تومان)
        </Label>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {PRICE_TIERS.map((tier) => {
            const active = draft.minPrice === tier.min && draft.maxPrice === tier.max;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() =>
                  apply(
                    active
                      ? { ...draft, minPrice: null, maxPrice: null }
                      : { ...draft, minPrice: tier.min, maxPrice: tier.max },
                  )
                }
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-[0.6875rem] transition-colors",
                  active
                    ? "border-primary bg-primary-tint text-primary"
                    : "border-border text-muted hover:border-primary/40 hover:text-primary",
                )}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(draft);
          }}
          className="flex items-center gap-2"
        >
          <Input
            digitsOnly
            placeholder="از"
            aria-label="کمترین قیمت"
            value={draft.minPrice ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, minPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="h-10"
          />
          <span className="text-subtle">—</span>
          <Input
            digitsOnly
            placeholder="تا"
            aria-label="بیشترین قیمت"
            value={draft.maxPrice ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="h-10"
          />
          <Button type="submit" size="icon-sm" variant="secondary" aria-label="اعمال بازه قیمت">
            <Search className="size-4" />
          </Button>
        </form>

        {draft.minPrice !== null || draft.maxPrice !== null ? (
          <p className="mt-2 text-[0.6875rem] text-subtle">
            {draft.minPrice !== null ? formatTomanCompact(draft.minPrice) : "۰"} تا{" "}
            {draft.maxPrice !== null ? formatTomanCompact(draft.maxPrice) : "بی‌نهایت"} تومان
          </p>
        ) : null}
      </Group>

      {/* ---- rond score ---- */}
      <Group>
        <Label hint={<span className="tabular-nums">{draft.minScore} +</span>}>حداقل امتیاز رندی</Label>
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={draft.minScore}
          onChange={(e) => setDraft({ ...draft, minScore: Number(e.target.value) })}
          onMouseUp={() => apply(draft)}
          onTouchEnd={() => apply(draft)}
          onKeyUp={() => apply(draft)}
          aria-label="حداقل امتیاز رندی"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-elevated accent-primary
            [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-md"
        />
        <div className="mt-1.5 flex justify-between text-[0.625rem] text-subtle">
          <span>همه</span>
          <span>فقط کم‌یاب‌ها</span>
        </div>
      </Group>

      {/* ---- rond types ---- */}
      <Group>
        <Label>الگوی رند</Label>
        <div className="max-h-64 space-y-0.5 overflow-y-auto pe-1">
          {ROND_TYPES.map((t) => (
            <Checkbox
              key={t.id}
              label={ROND_LABELS[t.id]}
              count={counts.rond[t.id] ?? 0}
              checked={draft.rondTypes.includes(t.id)}
              onChange={() => apply({ ...draft, rondTypes: toggleIn(draft.rondTypes, t.id) })}
            />
          ))}
        </div>
      </Group>

      {/* ---- city ---- */}
      <Group>
        <Label>شهر فروشنده</Label>
        <Select
          value={draft.city ?? ""}
          onChange={(e) => apply({ ...draft, city: e.target.value || null })}
          aria-label="شهر"
        >
          <option value="">همه شهرها</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Group>
    </div>
  );
}

function Group({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}

/* -------------------------------------------------------------------------- */

/** Removable chips summarising what is currently filtered. */
export function ActiveFilterChips({ filters }: { filters: NumberFilters }) {
  const router = useRouter();

  const chips: { label: string; next: NumberFilters }[] = [];

  if (filters.q) chips.push({ label: `شماره: ${filters.q}`, next: { ...filters, q: "" } });
  for (const op of filters.operators) {
    chips.push({
      label: OPERATORS.find((o) => o.id === op)!.name,
      next: { ...filters, operators: filters.operators.filter((o) => o !== op) },
    });
  }
  for (const sim of filters.simTypes) {
    chips.push({
      label: SIM_TYPE_LABELS[sim],
      next: { ...filters, simTypes: filters.simTypes.filter((s) => s !== sim) },
    });
  }
  for (const rond of filters.rondTypes) {
    chips.push({
      label: ROND_LABELS[rond],
      next: { ...filters, rondTypes: filters.rondTypes.filter((r) => r !== rond) },
    });
  }
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      label: `${filters.minPrice ? formatTomanCompact(filters.minPrice) : "۰"} تا ${
        filters.maxPrice ? formatTomanCompact(filters.maxPrice) : "بی‌نهایت"
      }`,
      next: { ...filters, minPrice: null, maxPrice: null },
    });
  }
  if (filters.minScore > 0) {
    chips.push({ label: `امتیاز ${filters.minScore}+`, next: { ...filters, minScore: 0 } });
  }
  if (filters.vipOnly) chips.push({ label: "VIP", next: { ...filters, vipOnly: false } });
  if (filters.installmentOnly) chips.push({ label: "اقساطی", next: { ...filters, installmentOnly: false } });
  if (filters.availableOnly) chips.push({ label: "فقط موجود", next: { ...filters, availableOnly: false } });
  if (filters.city) chips.push({ label: filters.city, next: { ...filters, city: null } });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          type="button"
          onClick={() => {
            const qs = serializeFilters(chip.next);
            router.push(qs ? `/numbers?${qs}` : "/numbers", { scroll: false });
          }}
          className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-tint px-3 py-1 text-xs text-primary transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
        >
          {chip.label}
          <X className="size-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push("/numbers", { scroll: false })}
        className="text-xs text-subtle underline-offset-4 hover:text-danger hover:underline"
      >
        پاک کردن همه
      </button>
    </div>
  );
}
