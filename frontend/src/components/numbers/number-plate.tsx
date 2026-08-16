import { cn, highlightFlags, numberGroups } from "@/lib/utils";

type PlateSize = "xs" | "sm" | "md" | "lg" | "xl";
type PlateVariant = "plate" | "bare" | "outline";

const sizeStyles: Record<PlateSize, { text: string; pad: string; gap: string; radius: string }> = {
  xs: { text: "text-sm tracking-[0.06em]", pad: "px-2 py-1", gap: "gap-1.5", radius: "rounded-md" },
  sm: { text: "text-base tracking-[0.07em]", pad: "px-3 py-1.5", gap: "gap-2", radius: "rounded-lg" },
  md: { text: "text-xl tracking-[0.08em] sm:text-[1.375rem]", pad: "px-4 py-2.5", gap: "gap-2.5", radius: "rounded-xl" },
  lg: { text: "text-[1.75rem] tracking-[0.09em] sm:text-4xl", pad: "px-5 py-4", gap: "gap-3.5", radius: "rounded-2xl" },
  xl: {
    text: "text-[2rem] tracking-[0.08em] sm:text-5xl lg:text-[3.5rem]",
    pad: "px-6 py-5",
    gap: "gap-4",
    radius: "rounded-3xl",
  },
};

/**
 * The product itself, rendered as an engraved plate.
 *
 * Digits that take part in a rond pattern (repeats, runs, rolls) are gilded;
 * the rest stay plain, so the shopper sees *why* a number is desirable at a
 * glance instead of having to read it. The operator prefix is always dimmed —
 * it carries no pattern value.
 */
export function NumberPlate({
  msisdn,
  size = "md",
  variant = "plate",
  highlight = true,
  className,
}: {
  msisdn: string;
  size?: PlateSize;
  variant?: PlateVariant;
  highlight?: boolean;
  className?: string;
}) {
  const [prefix, mid, last] = numberGroups(msisdn);
  const flags = highlight ? highlightFlags(mid + last) : new Array(7).fill(false);
  const s = sizeStyles[size];

  const onPlate = variant === "plate";

  const renderGroup = (group: string, offset: number) => (
    <span className="inline-flex">
      {group.split("").map((d, i) => {
        const gilded = flags[offset + i];
        return (
          <span
            key={i}
            className={cn(
              "transition-colors",
              gilded
                ? cn(
                    "text-accent",
                    onPlate && "[text-shadow:0_0_18px_color-mix(in_oklab,var(--accent)_45%,transparent)]",
                  )
                : onPlate
                  ? "text-plate-fg"
                  : "text-foreground",
            )}
          >
            {d}
          </span>
        );
      })}
    </span>
  );

  return (
    <span
      dir="ltr"
      data-nums
      className={cn(
        "relative inline-flex select-all items-center overflow-hidden font-num font-bold whitespace-nowrap",
        s.text,
        s.gap,
        onPlate && cn("bg-plate shadow-plate", s.pad, s.radius),
        variant === "outline" && cn("border border-border bg-elevated", s.pad, s.radius),
        className,
      )}
      aria-label={`شماره ${numberGroups(msisdn).join(" ")}`}
    >
      {onPlate ? (
        <>
          {/* engraved sheen across the top third */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/[0.07] to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial-[at_50%_-20%] from-white/[0.06] to-transparent to-70%"
          />
        </>
      ) : null}

      <span className={cn("relative", onPlate ? "text-plate-fg/45" : "text-subtle")}>{prefix}</span>
      <PlateDot onPlate={onPlate} size={size} />
      <span className="relative">{renderGroup(mid, 0)}</span>
      <PlateDot onPlate={onPlate} size={size} />
      <span className="relative">{renderGroup(last, 3)}</span>
    </span>
  );
}

function PlateDot({ onPlate, size }: { onPlate: boolean; size: PlateSize }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative shrink-0 rounded-full",
        size === "xs" || size === "sm" ? "size-1" : size === "md" ? "size-1.5" : "size-2",
        onPlate ? "bg-plate-fg/25" : "bg-subtle/40",
      )}
    />
  );
}
