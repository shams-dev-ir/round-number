import { Logo, LogoMark } from "@/components/layout/logo";
import { PanelNav, type PanelNavItem } from "@/components/layout/panel-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { ADMIN_SUMMARY } from "@/lib/data/admin";
import {
  ArrowUpRight,
  Bell,
  Hash,
  LayoutDashboard,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";

const ITEMS: PanelNavItem[] = [
  { href: "/admin", label: "داشبورد", icon: <LayoutDashboard />, exact: true },
  { href: "/admin/numbers", label: "مدیریت شماره‌ها", icon: <Hash /> },
  { href: "/admin/orders", label: "سفارش‌ها", icon: <ShoppingBag /> },
  {
    href: "/admin/listings",
    label: "آگهی‌های در انتظار",
    icon: <ScrollText />,
    badge: ADMIN_SUMMARY.pendingReview,
  },
  { href: "/admin/users", label: "کاربران", icon: <Users /> },
  { href: "/admin/settings", label: "تنظیمات", icon: <Settings /> },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-svh bg-canvas-2/60">
      {/* ---------------- sidebar (desktop) ---------------- */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[0.625rem] font-semibold tracking-wide text-subtle uppercase">
            مدیریت
          </p>
          <PanelNav items={ITEMS} />

          <div className="mt-6 rounded-2xl border border-accent/25 bg-accent-tint/40 p-4">
            <span className="mb-2.5 flex size-9 items-center justify-center rounded-xl bg-accent text-accent-fg">
              <ShieldCheck className="size-4.5" />
            </span>
            <p className="text-xs font-bold text-foreground">حالت نمایشی</p>
            <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-muted">
              داده‌های این پنل نمونه هستند. در فاز دوم به API فست‌فای متصل می‌شود.
            </p>
          </div>
        </div>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <ArrowUpRight className="size-4.5 shrink-0 text-subtle" />
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* ---------------- main ---------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-40 border-b border-border">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <div className="lg:hidden">
              <AdminMobileNav items={ITEMS} />
            </div>
            <LogoMark className="lg:hidden" />

            <form className="hidden max-w-sm flex-1 sm:block">
              <Input
                icon={<Search />}
                placeholder="جستجوی شماره، سفارش یا کاربر…"
                aria-label="جستجو در پنل مدیریت"
                className="h-10 bg-elevated"
              />
            </form>

            <div className="flex-1" />

            <ThemeToggle />

            <button
              type="button"
              aria-label="اعلان‌ها"
              className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Bell className="size-4.5" />
              <span className="absolute -top-1 -end-1 flex size-4.5 items-center justify-center rounded-full bg-danger text-[0.625rem] font-bold text-white tabular-nums">
                {ADMIN_SUMMARY.pendingReview}
              </span>
            </button>

            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pe-3 ps-1.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-tint font-display text-xs font-bold text-primary">
                مد
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold text-foreground">مدیر سیستم</p>
                <Badge tone="brand" size="xs" className="mt-0.5">
                  دسترسی کامل
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
