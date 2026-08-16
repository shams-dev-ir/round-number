"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

/* ------------------------------------------------------------- Accordion ---- */

export function Accordion({
  items,
  className,
  defaultOpen,
}: {
  items: { id: string; q: ReactNode; a: ReactNode }[];
  className?: string;
  defaultOpen?: string;
}) {
  return (
    <div className={cn("divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      {items.map((item) => (
        <details key={item.id} id={item.id} open={item.id === defaultOpen} className="group scroll-mt-28">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4.5 transition-colors hover:bg-elevated [&::-webkit-details-marker]:hidden">
            <span className="text-start text-[0.9375rem] font-medium text-foreground">{item.q}</span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all group-open:rotate-180 group-open:border-primary/40 group-open:bg-primary-tint group-open:text-primary">
              <ChevronDown className="size-4" />
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-[1.9] text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- Sheet ---- */

/** Slide-over panel. Used for mobile navigation and the mobile filter drawer. */
export function Sheet({
  open,
  onClose,
  title,
  side = "end",
  footer,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "start" | "end" | "bottom";
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-100", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal={open}
        className={cn(
          "absolute flex flex-col bg-surface shadow-xl transition-transform duration-300 ease-out",
          side === "bottom"
            ? cn("inset-x-0 bottom-0 max-h-[86vh] rounded-t-3xl", open ? "translate-y-0" : "translate-y-full")
            : cn(
                "inset-y-0 w-[min(23rem,88vw)]",
                side === "end"
                  ? cn("end-0 border-s border-border", open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full")
                  : cn("start-0 border-e border-border", open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"),
              ),
          className,
        )}
      >
        {title ? (
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X className="size-4.5" />
            </button>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tabs ---- */

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: ReactNode; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("no-scrollbar flex gap-1 overflow-x-auto border-b border-border", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors",
              active ? "text-primary" : "text-muted hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[0.6875rem] tabular-nums",
                    active ? "bg-primary-tint text-primary" : "bg-elevated text-subtle",
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </span>
            {active ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
