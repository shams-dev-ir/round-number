import type { OperatorId } from "@/lib/types";
import { OPERATOR_MAP } from "@/lib/data/site";
import { cn } from "@/lib/utils";

const RING: Record<OperatorId, string> = {
  mci: "text-op-mci bg-op-mci/12 border-op-mci/25",
  irancell: "text-op-irancell bg-op-irancell/12 border-op-irancell/25",
  rightel: "text-op-rightel bg-op-rightel/12 border-op-rightel/25",
  shatel: "text-op-shatel bg-op-shatel/12 border-op-shatel/25",
  aptel: "text-op-aptel bg-op-aptel/12 border-op-aptel/25",
};

export function OperatorChip({
  operator,
  size = "sm",
  showName = true,
  className,
}: {
  operator: OperatorId;
  size?: "sm" | "md";
  showName?: boolean;
  className?: string;
}) {
  const op = OPERATOR_MAP[operator];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        RING[operator],
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-3 py-1.5 text-sm",
        className,
      )}
    >
      <span
        dir="ltr"
        className={cn(
          "font-num font-black tracking-tight",
          size === "sm" ? "text-[0.5625rem]" : "text-[0.6875rem]",
        )}
      >
        {op.logo}
      </span>
      {showName ? <span>{op.shortName}</span> : null}
    </span>
  );
}

/** Larger square tile used in the operator grid on the home page. */
export function OperatorTile({ operator, count }: { operator: OperatorId; count?: number }) {
  const op = OPERATOR_MAP[operator];
  return (
    <div
      className={cn(
        "group hairline relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-5 text-center transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
      )}
    >
      <div
        className="absolute inset-x-0 -top-16 h-32 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: op.colorVar }}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex size-14 items-center justify-center rounded-2xl border font-num text-xs font-black",
          RING[operator],
        )}
        dir="ltr"
      >
        {op.logo}
      </span>
      <div className="relative">
        <div className="text-sm font-semibold text-foreground">{op.name}</div>
        {count !== undefined ? (
          <div className="mt-0.5 text-xs text-subtle tabular-nums">{count} شماره</div>
        ) : null}
      </div>
    </div>
  );
}
