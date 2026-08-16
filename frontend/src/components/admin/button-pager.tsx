"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Windowed page list: 1 … 4 5 [6] 7 8 … 20 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current]);
  for (let d = 1; d <= 1; d++) {
    if (current - d > 1) pages.add(current - d);
    if (current + d < total) pages.add(current + d);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

/**
 * Pagination for tables whose page lives in component state rather than the
 * URL — the admin grids filter client-side, so there is no href to link to.
 */
export function ButtonPager({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const item =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-[0.8125rem] font-medium transition-colors tabular-nums disabled:opacity-40 disabled:pointer-events-none";

  return (
    <nav aria-label="صفحه‌بندی" className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="صفحه قبل"
        className={cn(item, "border-border text-muted hover:border-primary/40 hover:text-primary")}
      >
        <ChevronRight className="size-4" />
      </button>

      {pageWindow(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-subtle">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              item,
              p === page
                ? "border-primary bg-primary text-primary-fg"
                : "border-border text-muted hover:border-primary/40 hover:text-primary",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="صفحه بعد"
        className={cn(item, "border-border text-muted hover:border-primary/40 hover:text-primary")}
      >
        <ChevronLeft className="size-4" />
      </button>
    </nav>
  );
}
