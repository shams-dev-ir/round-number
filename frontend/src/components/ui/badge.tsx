import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Tone = "neutral" | "brand" | "gold" | "success" | "warning" | "danger" | "info" | "plate";

const tones: Record<Tone, string> = {
  neutral: "bg-elevated text-muted border-border",
  brand: "bg-primary-tint text-primary border-primary/25",
  gold: "bg-accent-tint text-accent-fg border-accent/35 dark:text-accent",
  success: "bg-success-tint text-success border-success/25",
  warning: "bg-warning-tint text-warning border-warning/25",
  danger: "bg-danger-tint text-danger border-danger/25",
  info: "bg-info-tint text-info border-info/25",
  plate: "bg-plate-2 text-plate-fg border-white/10",
};

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: Tone;
  size?: "xs" | "sm";
}

export function Badge({ className, tone = "neutral", size = "sm", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium whitespace-nowrap",
        size === "xs" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs",
        "[&_svg]:size-[1.05em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
