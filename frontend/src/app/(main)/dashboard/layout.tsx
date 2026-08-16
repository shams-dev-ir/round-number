import { PanelNav, type PanelNavItem } from "@/components/layout/panel-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENT_USER, MY_LISTINGS, MY_ORDERS } from "@/lib/data/account";
import { formatToman, initials } from "@/lib/utils";
import {
  BadgeCheck,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const ITEMS: PanelNavItem[] = [
  { href: "/dashboard", label: "نمای کلی", icon: <LayoutDashboard />, exact: true },
  { href: "/dashboard/orders", label: "سفارش‌های من", icon: <ShoppingBag />, badge: MY_ORDERS.length },
  { href: "/dashboard/listings", label: "آگهی‌های فروش", icon: <Store />, badge: MY_LISTINGS.length },
  { href: "/dashboard/wallet", label: "کیف پول", icon: <Wallet /> },
  { href: "/favorites", label: "علاقه‌مندی‌ها", icon: <Heart /> },
  { href: "/dashboard/settings", label: "تنظیمات حساب", icon: <Settings /> },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="container-page py-8">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-8">
        {/* ---------------- sidebar ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="hairline mb-4 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint font-display text-sm font-bold text-primary">
                {initials(CURRENT_USER.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{CURRENT_USER.name}</p>
                <p dir="ltr" className="mt-0.5 truncate text-[0.6875rem] text-subtle tabular-nums">
                  {CURRENT_USER.phone}
                </p>
              </div>
            </div>

            {CURRENT_USER.verified ? (
              <Badge tone="success" size="xs" className="mt-3">
                <BadgeCheck className="size-3" />
                هویت تأیید شده
              </Badge>
            ) : null}

            <div className="mt-4 rounded-xl border border-border bg-canvas-2/60 p-3">
              <p className="text-[0.625rem] text-subtle">موجودی کیف پول</p>
              <p className="mt-1 font-num text-base font-bold text-foreground tabular-nums">
                {formatToman(CURRENT_USER.walletBalance)}
                <span className="ms-1 text-[0.625rem] font-normal text-muted">تومان</span>
              </p>
            </div>
          </div>

          <div className="hairline rounded-2xl border border-border bg-surface p-2">
            <PanelNav items={ITEMS} />
            <div className="mt-1 border-t border-border pt-1">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start px-3.5 text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Link href="/">
                  <LogOut className="size-4.5" />
                  خروج از حساب
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
