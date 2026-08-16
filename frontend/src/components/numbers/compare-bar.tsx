"use client";

import { Button } from "@/components/ui/button";
import { NumberPlate } from "@/components/numbers/number-plate";
import { getNumber } from "@/lib/data/numbers";
import { cn, formatTomanCompact } from "@/lib/utils";
import { useCompare } from "@/store/favorites";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { GitCompareArrows, X } from "lucide-react";
import Link from "next/link";

/**
 * Docked tray that collects numbers picked for comparison. Rendered in the
 * site layout so the selection survives navigation between listing and detail.
 */
export function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const clear = useCompare((s) => s.clear);
  const mounted = useIsHydrated();

  if (!mounted || ids.length === 0) return null;

  const items = ids.map((id) => getNumber(id)).filter(Boolean);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-60 p-3 sm:p-4">
      <div
        className={cn(
          "glass pointer-events-auto mx-auto flex max-w-4xl animate-rise flex-col gap-3 rounded-2xl border border-border p-3 shadow-xl",
          "sm:flex-row sm:items-center sm:gap-4",
        )}
      >
        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-tint text-primary">
            <GitCompareArrows className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">مقایسه شماره‌ها</p>
            <p className="text-[0.6875rem] text-subtle tabular-nums">{ids.length} از ۴ انتخاب شده</p>
          </div>
        </div>

        <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item!.id}
              className="relative flex shrink-0 flex-col items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2"
            >
              <button
                type="button"
                onClick={() => toggle(item!.id)}
                aria-label="حذف از مقایسه"
                className="absolute -top-1.5 -end-1.5 flex size-5 items-center justify-center rounded-full bg-danger text-white transition-transform hover:scale-110"
              >
                <X className="size-3" />
              </button>
              <NumberPlate msisdn={item!.msisdn} size="xs" variant="bare" />
              <span className="text-[0.625rem] text-subtle">{formatTomanCompact(item!.price)}</span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            پاک کردن
          </Button>
          <Button asChild size="sm" disabled={ids.length < 2}>
            <Link href={`/compare?ids=${ids.join(",")}`}>مقایسه کن</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
