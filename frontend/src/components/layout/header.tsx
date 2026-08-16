"use client";

import { Logo } from "@/components/layout/logo";
import { ThemeSegmented, ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/disclosure";
import { Input } from "@/components/ui/field";
import { OPERATORS, ROND_TYPES, SITE } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "خانه", href: "/" },
  { label: "همه شماره‌ها", href: "/numbers" },
  { label: "فروش شماره", href: "/sell" },
  { label: "قیمت‌گذاری", href: "/valuation" },
  { label: "سوالات متداول", href: "/faq" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const cartCount = useCart((s) => s.lines.length);
  const favCount = useFavorites((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer when navigation happens. Adjusted during render rather
  // than in an effect so the sheet never paints open on the new route.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/numbers?q=${encodeURIComponent(q)}` : "/numbers");
  };

  return (
    <>
      {/* ---------- announcement ---------- */}
      <div className="relative overflow-hidden border-b border-accent/20 bg-linear-to-l from-accent/12 via-primary/10 to-transparent">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[0.6875rem] sm:text-xs">
          <p className="flex items-center gap-2 text-muted">
            <Sparkles className="size-3.5 shrink-0 text-price" />
            <span className="truncate">
              انتقال سند رسمی با ضمانت بازگشت وجه تا ۷ روز — کمیسیون فقط ۳٪
            </span>
          </p>
          <a
            href={`tel:${SITE.phone}`}
            dir="ltr"
            className="hidden shrink-0 items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary sm:flex"
          >
            <Phone className="size-3.5" />
            <span className="tabular-nums">{SITE.phone}</span>
          </a>
        </div>
      </div>

      {/* ---------- main bar ---------- */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled ? "glass border-border shadow-sm" : "border-transparent bg-canvas",
        )}
      >
        <div className="container-page flex h-16 items-center gap-3 lg:h-18">
          <Logo />

          {/* desktop nav */}
          <nav className="hidden items-center lg:flex">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
            <CategoryMenu />
          </nav>

          <div className="flex-1" />

          {/* desktop search */}
          <form onSubmit={submitSearch} className="hidden w-64 xl:block">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              digitsOnly
              placeholder="0912***11**"
              icon={<Search />}
              aria-label="جستجوی شماره"
              className="h-10 bg-elevated"
            />
          </form>

          <div className="flex items-center gap-1.5">
            <Link
              href="/numbers"
              aria-label="جستجو"
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-primary/40 hover:text-primary xl:hidden"
            >
              <Search className="size-4.5" />
            </Link>

            <ThemeToggle />

            <IconLink href="/favorites" label="علاقه‌مندی‌ها" count={favCount}>
              <Heart className="size-4.5" />
            </IconLink>

            <IconLink href="/cart" label="سبد خرید" count={cartCount} accent>
              <ShoppingBag className="size-4.5" />
            </IconLink>

            <Button asChild variant="secondary" size="sm" className="hidden md:flex">
              <Link href="/auth/login">
                <LogIn />
                ورود / ثبت‌نام
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="منو"
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- mobile menu ---------- */}
      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="منو" side="end">
        <div className="p-4">
          <form onSubmit={submitSearch} className="mb-5">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              digitsOnly
              placeholder="جستجوی شماره — مثلاً 0912***11**"
              icon={<Search />}
              aria-label="جستجوی شماره"
            />
          </form>

          <nav className="mb-6 flex flex-col gap-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-primary-tint text-primary" : "text-muted hover:bg-elevated",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/dashboard" className="rounded-xl px-3 py-3 text-sm font-medium text-muted transition-colors hover:bg-elevated">
              پنل کاربری
            </Link>
            <Link href="/admin" className="rounded-xl px-3 py-3 text-sm font-medium text-muted transition-colors hover:bg-elevated">
              پنل مدیریت
            </Link>
          </nav>

          <div className="mb-6">
            <p className="mb-2.5 text-xs font-semibold text-subtle">اپراتورها</p>
            <div className="flex flex-wrap gap-2">
              {OPERATORS.map((op) => (
                <Link
                  key={op.id}
                  href={`/numbers?operator=${op.id}`}
                  className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {op.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2.5 text-xs font-semibold text-subtle">دسته‌بندی رند</p>
            <div className="flex flex-wrap gap-2">
              {ROND_TYPES.slice(0, 8).map((t) => (
                <Link
                  key={t.id}
                  href={`/numbers?rond=${t.id}`}
                  className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          <ThemeSegmented className="mb-4" />

          <Button asChild className="w-full">
            <Link href="/auth/login">
              <LogIn />
              ورود / ثبت‌نام
            </Link>
          </Button>
        </div>
      </Sheet>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function IconLink({
  href,
  label,
  count,
  accent,
  children,
}: {
  href: string;
  label: string;
  count: number;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-primary/40 hover:text-primary"
    >
      {children}
      {count > 0 ? (
        <span
          className={cn(
            "absolute -top-1.5 -end-1.5 flex min-w-4.5 items-center justify-center rounded-full px-1 text-[0.625rem] font-bold tabular-nums",
            accent ? "bg-accent text-accent-fg" : "bg-danger text-white",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

/** Hover/focus mega-menu listing every rond category. CSS-only. */
function CategoryMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors group-hover:text-foreground"
      >
        دسته‌بندی رند
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
      </button>

      {/*
        Anchored at `end-0` so the panel opens toward the page start. In RTL a
        `start-0` anchor would push 42rem past the left viewport edge and give
        the whole document a horizontal scrollbar, even while invisible.
      */}
      <div
        className="invisible absolute end-0 top-full z-50 w-[min(42rem,calc(100vw-3rem))] translate-y-2 pt-3 opacity-0 transition-all duration-200
          group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
          group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-1">
            {ROND_TYPES.map((t) => (
              <Link
                key={t.id}
                href={`/numbers?rond=${t.id}`}
                className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-elevated"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-primary-fg">
                  <Tag className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{t.label}</span>
                  <span dir="ltr" className="mt-0.5 block truncate font-num text-[0.6875rem] text-subtle tabular-nums">
                    {t.example}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-canvas-2 px-4 py-3">
            <p className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="size-4 text-success" />
              همه شماره‌ها پیش از انتشار اصالت‌سنجی می‌شوند
            </p>
            <div className="flex items-center gap-2">
              <Badge tone="gold" size="xs">
                <LayoutDashboard className="size-3" />
                مقایسه تا ۴ شماره
              </Badge>
              <Link href="/numbers" className="text-xs font-semibold text-primary hover:underline">
                مشاهده همه
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
