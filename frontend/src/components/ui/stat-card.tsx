import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

type Tone = "brand" | "gold" | "success" | "info" | "danger";

const TONES: Record<Tone, string> = {
  brand: "bg-primary-tint text-primary",
  gold: "bg-accent-tint text-accent-fg dark:text-accent",
  success: "bg-success-tint text-success",
  info: "bg-info-tint text-info",
  danger: "bg-danger-tint text-danger",
};

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "brand",
  delta,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  icon: ComponentType<{ className?: string }>;
  tone?: Tone;
  /** Percentage change vs. the previous period; sign drives the arrow and colour. */
  delta?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hairline relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="size-4.5" />
        </span>

        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold tabular-nums",
              delta >= 0 ? "bg-success-tint text-success" : "bg-danger-tint text-danger",
            )}
          >
            {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(delta)}%
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted">{label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-num text-2xl font-extrabold text-foreground tabular-nums">{value}</span>
        {unit ? <span className="text-[0.6875rem] text-muted">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-[0.6875rem] leading-relaxed text-subtle">{hint}</p> : null}
    </div>
  );
}
