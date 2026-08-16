import { SITE } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * The mark abstracts the product: three stacked bars standing for the 4-3-4
 * grouping of an Iranian mobile number, with the middle "pattern" bar gilded.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-gradient relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0_4px_14px_-4px_var(--primary-ring)]",
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-0 bg-radial-[at_30%_10%] from-white/30 to-transparent to-70%" />
      <svg viewBox="0 0 24 24" className="relative size-5.5" fill="none">
        <rect x="3" y="5" width="18" height="3" rx="1.5" fill="white" fillOpacity="0.92" />
        <rect x="7" y="10.5" width="14" height="3" rx="1.5" fill="var(--accent)" />
        <rect x="3" y="16" width="18" height="3" rx="1.5" fill="white" fillOpacity="0.55" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2.5 rounded-xl", className)}
      aria-label={SITE.name}
    >
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      {!compact ? (
        <span className="flex flex-col leading-none">
          {/* No negative tracking: the wordmark is Persian, a connected script. */}
          <span className="font-display text-lg font-extrabold text-foreground">
            {SITE.name}
          </span>
          <span
            dir="ltr"
            className="mt-0.5 font-num text-[0.5625rem] font-bold tracking-[0.32em] text-subtle uppercase"
          >
            {SITE.nameLatin}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
