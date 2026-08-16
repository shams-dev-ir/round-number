import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "gold" | "secondary" | "outline" | "ghost" | "danger" | "plain";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const base =
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-xl font-medium " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out " +
  "active:scale-[0.975] disabled:pointer-events-none disabled:opacity-45 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "[&_svg]:size-[1.15em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "brand-gradient text-primary-fg shadow-[0_6px_20px_-8px_var(--primary-ring)] " +
    "hover:shadow-[0_10px_28px_-8px_var(--primary-ring)] hover:brightness-110",
  gold:
    "bg-accent text-accent-fg shadow-[0_6px_20px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] " +
    "hover:bg-accent-strong hover:shadow-[0_10px_28px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)]",
  secondary: "bg-elevated text-foreground border border-border hover:border-primary/45 hover:bg-primary-tint",
  outline: "border border-border bg-transparent text-foreground hover:border-primary/45 hover:bg-primary-tint",
  ghost: "text-muted hover:bg-elevated hover:text-foreground",
  danger: "bg-danger text-white hover:brightness-110",
  plain: "text-primary underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "size-11",
  "icon-sm": "size-9 rounded-lg",
};

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...(asChild ? {} : { type })}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
