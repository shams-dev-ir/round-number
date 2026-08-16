import { OperatorTile } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/disclosure";
import { Aurora, SectionHeading, Stars } from "@/components/ui/misc";
import {
  FAQS,
  HOW_IT_WORKS,
  OPERATORS,
  ROND_TYPES,
  TESTIMONIALS,
  TRUST_POINTS,
} from "@/lib/data/site";
import type { OperatorId, RondType } from "@/lib/types";
import {
  ArrowLeft,
  BadgeCheck,
  Gauge,
  Headset,
  Quote,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";

const TRUST_ICONS = { shield: ShieldCheck, badge: BadgeCheck, gauge: Gauge, headset: Headset };

/* ------------------------------------------------------------ trust strip -- */

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="container-page grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {TRUST_POINTS.map((point) => {
          const Icon = TRUST_ICONS[point.icon as keyof typeof TRUST_ICONS];
          return (
            <div key={point.title} className="group flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary-tint">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">{point.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{point.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- categories -- */

export function Categories({ counts }: { counts: Record<RondType, number> }) {
  return (
    <section id="categories" className="container-page scroll-mt-24 py-18">
      <SectionHeading
        eyebrow="دسته‌بندی"
        title="بر اساس الگوی رند بگردید"
        description="هر الگو ارزش و مخاطب خودش را دارد. از تکرارهای کم‌یاب تا هزاری‌های اقتصادی، مسیر جستجو را از همین‌جا کوتاه کنید."
        action={
          <Button asChild variant="outline">
            <Link href="/numbers">
              همه شماره‌ها
              <ArrowLeft />
            </Link>
          </Button>
        }
      />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ROND_TYPES.map((type, i) => (
          <Link
            key={type.id}
            href={`/numbers?rond=${type.id}`}
            className="group hairline relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -end-12 size-28 rounded-full bg-primary/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-fg">
                <Tag className="size-4" />
              </span>
              {i < 3 ? (
                <Badge tone="gold" size="xs">
                  <Sparkles className="size-3" />
                  کم‌یاب
                </Badge>
              ) : (
                <span className="text-[0.6875rem] text-subtle tabular-nums">{counts[type.id] ?? 0} شماره</span>
              )}
            </div>

            <h3 className="relative mt-3.5 text-sm font-bold text-foreground">{type.label}</h3>
            <p className="relative mt-1 text-[0.75rem] text-subtle">{type.hint}</p>
            <p
              dir="ltr"
              className="relative mt-3 font-num text-xs font-semibold text-muted tabular-nums transition-colors group-hover:text-primary"
            >
              {type.example}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- operators -- */

export function OperatorsSection({ counts }: { counts: Record<OperatorId, number> }) {
  return (
    <section className="border-y border-border bg-canvas-2/70">
      <div className="container-page py-18">
        <SectionHeading
          align="center"
          eyebrow="اپراتورها"
          title="از هر اپراتوری که بخواهید"
          description="خطوط دائمی و اعتباری همه اپراتورهای کشور، با امکان استعلام وضعیت پیش از خرید."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {OPERATORS.map((op) => (
            <Link key={op.id} href={`/numbers?operator=${op.id}`}>
              <OperatorTile operator={op.id} count={counts[op.id] ?? 0} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how it works -- */

export function HowItWorks() {
  return (
    <section className="container-page py-18">
      <SectionHeading
        eyebrow="فرآیند خرید"
        title="از انتخاب تا سند، چهار قدم"
        description="بدون واسطه‌های ناشناس و بدون ریسک. هر مرحله در پنل کاربری شما ثبت و قابل پیگیری است."
      />

      <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((step, i) => (
          <li key={step.step} className="relative">
            {/* connector */}
            {i < HOW_IT_WORKS.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-6 -start-6 hidden h-px w-6 bg-linear-to-l from-border to-transparent lg:block"
              />
            ) : null}

            <div className="hairline h-full rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <span className="font-display text-2xl font-black text-border-soft select-none dark:text-elevated">
                {step.step}
              </span>
              <h3 className="mt-2 text-base font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------- valuation CTA -- */

export function ValuationTeaser() {
  return (
    <section className="container-page py-8">
      <div className="hairline relative overflow-hidden rounded-3xl border border-border bg-surface">
        <Aurora className="opacity-60" />
        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <Badge tone="brand" className="mb-4">
              <Gauge className="size-3.5" />
              موتور قیمت‌گذاری روندیکس
            </Badge>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              نمی‌دانید شماره‌تان چقدر می‌ارزد؟
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              شماره را وارد کنید؛ الگوی رند، کد اپراتور و نوع سیم‌کارت را می‌سنجیم و بر پایه معاملات
              واقعی بازار، بازه قیمت منصفانه را همان لحظه نشان می‌دهیم.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/valuation">
                  ارزیابی رایگان شماره
                  <ArrowLeft />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sell">ثبت آگهی فروش</Link>
              </Button>
            </div>
          </div>

          <ul className="space-y-3">
            {[
              "تحلیل ۱۴ الگوی رند و امتیاز رندی ۰ تا ۱۰۰",
              "مقایسه با معاملات مشابه در ۹۰ روز گذشته",
              "پیشنهاد بازه قیمت خرید فوری و فروش صبورانه",
              "بدون نیاز به ثبت‌نام یا احراز هویت",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-canvas-2/60 p-3.5 text-[0.8125rem] text-muted"
              >
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- testimonials -- */

export function Testimonials() {
  return (
    <section className="border-y border-border bg-canvas-2/70">
      <div className="container-page py-18">
        <SectionHeading
          align="center"
          eyebrow="اعتماد مشتریان"
          title="۱۲٬۴۰۰ معامله، بدون یک پرونده باز"
          description="از برندهای شناخته‌شده تا فروشندگان حرفه‌ای؛ روندیکس را برای امنیت معامله انتخاب کرده‌اند."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="hairline flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <Quote className="size-6 text-primary/35" />
              <blockquote className="mt-3 flex-1 text-[0.8125rem] leading-[1.9] text-muted">
                {t.body}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-bold text-primary">
                  {t.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block truncate text-[0.6875rem] text-subtle">{t.role}</span>
                </span>
                <Stars rating={t.rating} className="ms-auto shrink-0" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- FAQ block -- */

export function FaqPreview() {
  return (
    <section className="container-page py-18">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="سوالات متداول"
            title="هر چیزی که پیش از خرید باید بدانید"
            description="اگر پاسخ سوالتان را پیدا نکردید، کارشناسان ما هفت روز هفته پاسخگو هستند."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/faq">همه سوالات</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">
                تماس با کارشناس
                <ArrowLeft />
              </Link>
            </Button>
          </div>
        </div>

        <Accordion items={FAQS.slice(0, 5).map((f) => ({ id: f.id, q: f.q, a: f.a }))} defaultOpen="transfer" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- final CTA --- */

export function FinalCta() {
  return (
    <section className="container-page pb-18">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-plate p-8 text-center sm:p-14">
        <Aurora className="opacity-80" />
        <div aria-hidden className="grain absolute inset-0" />
        <div
          aria-hidden
          className="lattice pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)]"
        />

        <div className="relative mx-auto max-w-2xl">
          <Badge tone="plate" className="mb-5">
            <Sparkles className="size-3.5 text-accent" />
            شروع کنید
          </Badge>
          <h2 className="font-display text-2xl font-extrabold text-plate-fg sm:text-4xl">
            شماره‌تان را <span className="foil-plate">امروز</span> انتخاب کنید
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.95] text-plate-fg/70 sm:text-base">
            بیش از ۴۸٬۰۰۰ شماره اصالت‌سنجی‌شده در انتظار شماست. رزرو رایگان است و تا تأیید انتقال سند
            پولی از حساب امانی خارج نمی‌شود.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/numbers">
                مرور شماره‌ها
                <ArrowLeft />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-plate-fg hover:bg-white/8 hover:text-plate-fg"
            >
              <Link href="/sell">شماره‌ام را می‌فروشم</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
