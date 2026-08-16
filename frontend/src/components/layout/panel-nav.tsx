"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface PanelNavItem {
  href: string;
  label: string;
  /**
   * A rendered element, not a component type — these lists are built in server
   * components, and only serialisable values (elements included) may cross the
   * boundary into this client component.
   */
  icon: ReactNode;
  badge?: number;
  exact?: boolean;
}

/**
 * Shared vertical navigation for the customer dashboard and the admin panel.
 * Scrolls horizontally as a pill rail on small screens.
 */
export function PanelNav({ items, className }: { items: PanelNavItem[]; className?: string }) {
  const pathname = usePathname();

  const isActive = (item: PanelNavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <nav
      className={cn(
        "no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible",
        className,
      )}
    >
      {items.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all lg:shrink",
              active
                ? "bg-primary-tint text-primary"
                : "text-muted hover:bg-elevated hover:text-foreground",
            )}
          >
            {active ? (
              <span className="absolute inset-y-2 -start-px hidden w-0.5 rounded-full bg-primary lg:block" />
            ) : null}
            <span
              className={cn(
                "shrink-0 transition-colors [&_svg]:size-4.5",
                active ? "text-primary" : "text-subtle group-hover:text-foreground",
              )}
            >
              {item.icon}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 ? (
              <span
                className={cn(
                  "ms-auto rounded-full px-1.5 py-px text-[0.625rem] font-bold tabular-nums",
                  active ? "bg-primary text-primary-fg" : "bg-elevated text-subtle",
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
