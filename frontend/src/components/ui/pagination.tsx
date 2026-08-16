import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/** Windowed page list: 1 … 4 5 [6] 7 8 … 20 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current]);
  for (let d = 1; d <= 2; d++) {
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

export function Pagination({
  page,
  totalPages,
  hrefFor,
  className,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const itemClass =
    "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors tabular-nums";

  return (
    <nav aria-label="صفحه‌بندی" className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}>
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          rel="prev"
          aria-label="صفحه قبل"
          className={cn(itemClass, "border-border text-muted hover:border-primary/40 hover:text-primary")}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemClass, "border-border-soft text-subtle opacity-50")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}

      {pageWindow(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-subtle">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            scroll={false}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              itemClass,
              p === page
                ? "border-primary bg-primary text-primary-fg shadow-[0_4px_14px_-6px_var(--primary-ring)]"
                : "border-border text-muted hover:border-primary/40 hover:text-primary",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          rel="next"
          aria-label="صفحه بعد"
          className={cn(itemClass, "border-border text-muted hover:border-primary/40 hover:text-primary")}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemClass, "border-border-soft text-subtle opacity-50")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
    </nav>
  );
}
