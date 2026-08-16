"use client";

import { cn, normalizeDigits } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

/* ---------------------------------------------------------------- Label ---- */

export function Label({
  className,
  hint,
  children,
  ...props
}: ComponentProps<"label"> & { hint?: ReactNode }) {
  return (
    <label className={cn("mb-2 flex items-baseline justify-between gap-2", className)} {...props}>
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

const controlBase =
  "w-full rounded-xl border border-border bg-surface text-sm text-foreground transition-colors " +
  "placeholder:text-subtle hover:border-primary/35 " +
  "focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--primary-ring)] " +
  "disabled:cursor-not-allowed disabled:opacity-55";

/* ---------------------------------------------------------------- Input ---- */

export interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
  suffix?: ReactNode;
  /** Converts Persian/Arabic digits to ASCII as the user types. */
  digitsOnly?: boolean;
  invalid?: boolean;
}

export function Input({
  className,
  icon,
  suffix,
  digitsOnly,
  invalid,
  onChange,
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon ? (
        <span className="pointer-events-none absolute start-3.5 text-subtle [&_svg]:size-4.5">{icon}</span>
      ) : null}
      {/*
        Deliberately no dir="ltr" here: the wrapper is RTL, so flipping the
        input would put the icon on the right and its padding on the left.
        European numerals already render left-to-right inside an RTL field via
        the bidi algorithm, so digits look correct either way.
      */}
      <input
        inputMode={digitsOnly ? "numeric" : undefined}
        onChange={(event) => {
          if (digitsOnly) {
            const el = event.currentTarget;
            const next = normalizeDigits(el.value);
            if (next !== el.value) el.value = next;
          }
          onChange?.(event);
        }}
        className={cn(
          controlBase,
          "h-11 px-4",
          icon && "ps-11",
          suffix && "pe-16",
          digitsOnly && "tracking-[0.08em] tabular-nums",
          invalid && "border-danger focus:border-danger focus:ring-danger/25",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="pointer-events-none absolute end-4 text-xs font-medium text-subtle">{suffix}</span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- Textarea ---- */

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlBase, "min-h-28 resize-y px-4 py-3 leading-relaxed", className)} {...props} />;
}

/* --------------------------------------------------------------- Select ---- */

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(controlBase, "h-11 cursor-pointer appearance-none px-4 pe-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
    </div>
  );
}

/* ------------------------------------------------------------- Checkbox ---- */

export function Checkbox({
  label,
  count,
  className,
  ...props
}: ComponentProps<"input"> & { label: ReactNode; count?: number }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-elevated",
        className,
      )}
    >
      <span className="relative flex size-[18px] shrink-0 items-center justify-center">
        <input id={id} type="checkbox" className="peer sr-only" {...props} />
        <span
          className="absolute inset-0 rounded-[6px] border border-border bg-surface transition-all
            peer-checked:border-primary peer-checked:bg-primary
            peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--primary-ring)]"
        />
        <Check
          className="relative size-3 scale-50 text-primary-fg opacity-0 transition-all
            peer-checked:scale-100 peer-checked:opacity-100"
          strokeWidth={3.5}
        />
      </span>
      <span className="flex-1 text-sm text-muted transition-colors group-hover:text-foreground">{label}</span>
      {count !== undefined ? (
        <span className="text-xs text-subtle tabular-nums">{count}</span>
      ) : null}
    </label>
  );
}

/* --------------------------------------------------------------- Switch ---- */

export function Switch({
  label,
  description,
  className,
  ...props
}: ComponentProps<"input"> & { label?: ReactNode; description?: ReactNode }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-center justify-between gap-4", className)}
    >
      {label ? (
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          {description ? <span className="mt-0.5 block text-xs text-subtle">{description}</span> : null}
        </span>
      ) : null}
      <span className="relative inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer sr-only" {...props} />
        <span
          className="block h-6 w-11 rounded-full border border-border bg-elevated transition-colors
            peer-checked:border-primary peer-checked:bg-primary
            peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--primary-ring)]"
        />
        <span
          className="pointer-events-none absolute top-1 start-1 size-4 rounded-full bg-white shadow-sm
            transition-transform duration-200 peer-checked:-translate-x-5 rtl:peer-checked:translate-x-5"
        />
      </span>
    </label>
  );
}

/* ----------------------------------------------------------- Radio pill ---- */

export function PillGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("inline-flex rounded-xl border border-border bg-elevated p-1", className)}
      {...props}
    />
  );
}

export function Pill({
  active,
  className,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "bg-surface text-foreground shadow-sm"
          : "text-muted hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
