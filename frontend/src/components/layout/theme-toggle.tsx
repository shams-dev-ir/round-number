"use client";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** Single icon button that flips light ⇄ dark, with a crossfading sun/moon. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsHydrated();

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "روشن کردن تم" : "تاریک کردن تم"}
      className={cn(
        "relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface text-muted transition-colors hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-4.5 transition-all duration-400",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute size-4.5 transition-all duration-400",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}

/** Three-way control (light / dark / system) for the mobile menu and settings. */
export function ThemeSegmented({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsHydrated();

  const options = [
    { value: "light", label: "روشن", icon: Sun },
    { value: "dark", label: "تاریک", icon: Moon },
    { value: "system", label: "سیستم", icon: Monitor },
  ];

  return (
    <div className={cn("flex rounded-xl border border-border bg-elevated p-1", className)}>
      {options.map((opt) => {
        const active = mounted && theme === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all",
              active ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
