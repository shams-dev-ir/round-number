import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Card({
  className,
  hairline = false,
  ...props
}: ComponentProps<"div"> & { hairline?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-surface shadow-sm",
        hairline && "hairline",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-start justify-between gap-4 p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-semibold text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("mt-1 text-sm leading-relaxed text-muted", className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-border px-5 py-4", className)}
      {...props}
    />
  );
}
