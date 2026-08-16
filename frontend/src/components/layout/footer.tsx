import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { FOOTER_NAV, SITE } from "@/lib/data/site";
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-canvas-2">
      <div aria-hidden className="lattice pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/4 size-[32rem] rounded-full bg-primary/8 blur-[100px]"
      />

      {/* ---------- newsletter ---------- */}
      <div className="relative border-b border-border">
        <div className="container-page flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h3 className="font-display text-xl font-bold text-foreground">
              شماره‌های تازه را اول از ما بشنوید
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              هفته‌ای یک ایمیل: رندترین شماره‌های تازه‌رسیده، تحلیل قیمت بازار و پیشنهادهای ویژه.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <Input type="email" placeholder="نشانی ایمیل شما" icon={<Mail />} aria-label="ایمیل" required />
            <Button type="submit" className="shrink-0">
              عضویت
              <ArrowLeft />
            </Button>
          </form>
        </div>
      </div>

      {/* ---------- links ---------- */}
      <div className="relative container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-[1.9] text-muted">{SITE.description}</p>

          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${SITE.phone}`} dir="ltr" className="tabular-nums hover:text-foreground">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${SITE.email}`} dir="ltr" className="hover:text-foreground">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{SITE.address}</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {FOOTER_NAV.map((col) => (
          <nav key={col.title}>
            <h4 className="mb-4 text-sm font-bold text-foreground">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* ---------- trust seals ---------- */}
      <div className="relative border-t border-border">
        <div className="container-page flex flex-col items-center gap-6 py-6 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["نماد اعتماد الکترونیکی", "ساماندهی", "درگاه پرداخت امن", "اتحادیه کسب‌وکار مجازی"].map(
              (seal) => (
                <span
                  key={seal}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[0.6875rem] text-muted"
                >
                  <ShieldCheck className="size-4 text-success" />
                  {seal}
                </span>
              ),
            )}
          </div>
          <p className="text-center text-xs text-subtle">
            © {new Date().getFullYear()} {SITE.name} — تمام حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
