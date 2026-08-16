import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

/** Card + horizontal-scroll shell shared by every admin table. */
export function AdminPanel({
  title,
  hint,
  action,
  children,
  className,
  flush,
}: {
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section
      className={cn("hairline overflow-hidden rounded-2xl border border-border bg-surface", className)}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
          {hint ? <p className="mt-1 text-[0.6875rem] text-subtle">{hint}</p> : null}
        </div>
        {action}
      </header>
      <div className={flush ? "" : "px-5 pb-5"}>{children}</div>
    </section>
  );
}

export function TableScroll({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-x-auto", className)}>{children}</div>;
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <table className={cn("w-full text-sm", className)} {...props} />;
}

export function THead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("border-y border-border bg-canvas-2/50 [&_th]:whitespace-nowrap", className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn("px-5 py-3 text-start text-xs font-semibold whitespace-nowrap text-subtle", className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border transition-colors last:border-b-0 hover:bg-elevated/50", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("px-5 py-3.5 align-middle text-[0.8125rem] text-foreground", className)} {...props} />;
}

/** Right-aligned cluster of icon buttons in the last column. */
export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-1.5">{children}</div>;
}
