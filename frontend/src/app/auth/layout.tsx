import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NumberPlate } from "@/components/numbers/number-plate";
import { Aurora, Stars } from "@/components/ui/misc";
import { SITE } from "@/lib/data/site";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      {/* ---------------- form side ---------------- */}
      <div className="relative flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.6875rem] text-subtle">
          <Link href="/terms" className="hover:text-primary">
            قوانین و مقررات
          </Link>
          <span className="text-border">•</span>
          <Link href="/privacy" className="hover:text-primary">
            حریم خصوصی
          </Link>
          <span className="text-border">•</span>
          <Link href="/contact" className="hover:text-primary">
            پشتیبانی
          </Link>
        </footer>
      </div>

      {/* ---------------- brand side ---------------- */}
      <aside className="relative hidden overflow-hidden bg-plate p-12 lg:flex lg:flex-col lg:justify-between">
        <Aurora className="opacity-90" />
        <div aria-hidden className="grain absolute inset-0" />
        <div
          aria-hidden
          className="lattice pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)]"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-plate-fg/80 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-accent" />
            {SITE.tagline}
          </span>

          <h2 className="mt-8 max-w-md font-display text-3xl leading-[1.35] font-extrabold text-plate-fg">
            شماره‌ای که <span className="foil-plate">هویت برند</span> شما می‌شود
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-[1.95] text-plate-fg/65">
            وارد شوید تا شماره‌های ذخیره‌شده، سفارش‌ها و آگهی‌های فروشتان را یک‌جا مدیریت کنید.
          </p>
        </div>

        <div className="relative space-y-6">
          <div className="flex flex-wrap gap-3">
            {["09121110000", "09351234567", "09201212121"].map((n, i) => (
              <div
                key={n}
                style={{ animationDelay: `${-i * 2.4}s` }}
                className="animate-float rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
              >
                <NumberPlate msisdn={n} size="xs" variant="bare" className="text-plate-fg" />
              </div>
            ))}
          </div>

          <figure className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <Stars rating={5} />
            <blockquote className="mt-3 text-[0.8125rem] leading-[1.9] text-plate-fg/80">
              حساب امانی خیالم را راحت کرد. تا وقتی خودم انتقال سند را تأیید نکردم، پول آزاد نشد.
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-plate-fg">
                س
              </span>
              <span className="text-xs">
                <span className="block font-semibold text-plate-fg">سارا موسوی</span>
                <span className="block text-plate-fg/50">بنیان‌گذار، کافه ویونا</span>
              </span>
            </figcaption>
          </figure>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { icon: ShieldCheck, text: "پرداخت امانی" },
              { icon: BadgeCheck, text: "اصالت‌سنجی شماره" },
              { icon: Sparkles, text: "۴۸٬۰۰۰+ شماره فعال" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-2 text-xs text-plate-fg/60">
                <f.icon className="size-4 text-accent" />
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
