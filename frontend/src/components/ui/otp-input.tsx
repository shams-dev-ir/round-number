"use client";

import { cn, normalizeDigits } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * Fixed-length numeric code entry. Handles paste of a whole code, backspace
 * across boxes, arrow navigation, and Persian digits typed on an Iranian
 * keyboard layout.
 */
export function OtpInput({
  length = 5,
  value,
  onChange,
  autoFocus,
  invalid,
  className,
}: {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const next = value.padEnd(length, " ").split("");
    next[index] = digit || " ";
    onChange(next.join("").replace(/ /g, "").slice(0, length));
  };

  return (
    <div dir="ltr" className={cn("flex justify-center gap-2.5", className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] ?? ""}
          aria-label={`رقم ${i + 1} از ${length}`}
          onChange={(e) => {
            const digits = normalizeDigits(e.target.value).replace(/\D/g, "");
            if (!digits) {
              setDigit(i, "");
              return;
            }
            // Paste of a full code lands in one box — spread it across the rest.
            if (digits.length > 1) {
              onChange(digits.slice(0, length));
              refs.current[Math.min(digits.length, length - 1)]?.focus();
              return;
            }
            setDigit(i, digits);
            if (i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
          }}
          className={cn(
            "size-13 rounded-xl border bg-surface text-center font-num text-xl font-bold text-foreground tabular-nums transition-all",
            "focus:outline-none focus:ring-4 focus:ring-[var(--primary-ring)]",
            invalid ? "border-danger" : value[i] ? "border-primary" : "border-border",
          )}
        />
      ))}
    </div>
  );
}
