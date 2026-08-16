import { cn, scoreTier } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

/* ------------------------------------------------------- Section heading ---- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <div
            className={cn(
              "mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase",
              align === "center" && "justify-center",
            )}
          >
            <span className="h-px w-6 bg-linear-to-r from-transparent to-primary" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------- Skeleton ---- */

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-elevated", className)}
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/12 to-transparent" />
    </div>
  );
}

/* ----------------------------------------------------------- Empty state ---- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary-tint text-primary [&_svg]:size-7">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ Score meter --- */

export function ScoreMeter({
  score,
  size = "md",
  showLabel = true,
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const tier = scoreTier(score);
  const dim = size === "sm" ? 34 : size === "lg" ? 76 : 52;
  const stroke = size === "sm" ? 3 : size === "lg" ? 6 : 4.5;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg width={dim} height={dim} className="-rotate-90" aria-hidden>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={cn(
            tier === "vip" ? "stroke-price" : tier === "good" ? "stroke-primary" : "stroke-info",
          )}
        />
      </svg>
      {showLabel ? (
        <span
          className={cn(
            "absolute font-num font-bold tabular-nums",
            size === "sm" ? "text-[0.625rem]" : size === "lg" ? "text-lg" : "text-xs",
            tier === "vip" ? "text-price" : tier === "good" ? "text-primary" : "text-info",
          )}
        >
          {score}
        </span>
      ) : null}
      <span className="sr-only">امتیاز رندی {score} از ۱۰۰</span>
    </div>
  );
}

/* --------------------------------------------------------------- Divider ---- */

export function Divider({ className, label }: { className?: string; label?: ReactNode }) {
  if (!label) return <div className={cn("h-px w-full bg-border", className)} />;
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-subtle">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ----------------------------------------------------------------- Stars ---- */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-3.5" aria-hidden>
          <defs>
            <linearGradient id={`star-${i}-${Math.round(rating * 10)}`} x1="1" x2="0">
              <stop offset={`${Math.min(1, Math.max(0, rating - i)) * 100}%`} stopColor="var(--accent)" />
              <stop offset={`${Math.min(1, Math.max(0, rating - i)) * 100}%`} stopColor="var(--border)" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#star-${i}-${Math.round(rating * 10)})`}
            d="M10 1.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L10 14.9l-5.2 2.75 1-5.75-4.2-4.1 5.8-.85z"
          />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------- Aurora bg ---- */

/** The animated mesh glow behind hero and CTA sections. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute -top-40 start-[8%] size-[38rem] animate-aurora rounded-full bg-primary/22 blur-[110px]" />
      <div
        className="absolute -top-24 end-[4%] size-[30rem] animate-aurora rounded-full bg-accent/16 blur-[100px]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute top-[42%] start-[38%] size-[26rem] animate-aurora rounded-full bg-info/16 blur-[110px]"
        style={{ animationDelay: "-14s" }}
      />
    </div>
  );
}
