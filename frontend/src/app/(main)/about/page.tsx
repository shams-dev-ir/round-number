import { Button } from "@/components/ui/button";
import { Aurora, SectionHeading } from "@/components/ui/misc";
import { SITE, STATS, TRUST_POINTS } from "@/lib/data/site";
import { formatToman } from "@/lib/utils";
import {
  ArrowLeft,
  BadgeCheck,
  Gauge,
  Headset,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "روندیکس، بازار تخصصی شماره‌های رند با تمرکز بر امنیت معامله و شفافیت قیمت.",
};

const ICONS = { shield: ShieldCheck, badge: BadgeCheck, gauge: Gauge, headset: Headset };

const VALUES = [
  {
    icon: Scale,
    title: "شفافیت قیمت",
    body: "قیمت هر شماره را با منطق روشن و داده معاملات واقعی توضیح می‌دهیم. هیچ عدد بی‌دلیلی در روندیکس وجود ندارد.",
  },
  {
    icon: ShieldCheck,
    title: "امنیت پیش از سرعت",
    body: "حساب امانی، استعلام اپراتور و احراز هویت دو طرف، حتی اگر معامله را یک روز کندتر کند، حذف نمی‌شود.",
  },
  {
    icon: Users,
    title: "احترام به هر دو طرف",
    body: "خریدار و فروشنده هر دو مشتری ما هستند. سیاست‌های ما به سود یک طرف نوشته نشده است.",
  },
  {
    icon: Target,
    title: "تخصص، نه گستردگی",
    body: "ما فقط شماره رند می‌فروشیم. همین تمرکز اجازه می‌دهد در این حوزه از هر بازار عمومی دقیق‌تر باشیم.",
  },
];

const TIMELINE = [
  { year: "۱۳۹۸", title: "شروع با یک دفتر کوچک", body: "کار را با واسطه‌گری حضوری شماره‌های رند در تهران آغاز کردیم." },
  { year: "۱۴۰۰", title: "راه‌اندازی پلتفرم آنلاین", body: "نخستین نسخه بازار آنلاین با ۲٬۰۰۰ شماره و سامانه پرداخت امانی منتشر شد." },
  { year: "۱۴۰۲", title: "موتور قیمت‌گذاری", body: "با داده هزاران معامله، مدل امتیاز رندی و برآورد قیمت را ساختیم." },
  { year: "۱۴۰۴", title: "بازار سراسری", body: "بیش از ۴۸ هزار شماره فعال و شبکه کارشناسان انتقال سند در ۱۲ شهر کشور." },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-70" />
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative container-page py-16 text-center">
          <h1 className="mx-auto max-w-3xl font-display text-3xl font-extrabold text-foreground sm:text-5xl sm:leading-[1.32]">
            بازاری ساختیم که خودمان با <span className="foil">خیال راحت</span> در آن خرید کنیم
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[2] text-muted sm:text-base">
            {SITE.description} روندیکس از یک مشکل ساده شروع شد: خرید شماره رند در ایران پر از ریسک
            بود — قیمت‌های بی‌منطق، فروشندگان ناشناس و پرداخت‌هایی که هیچ تضمینی نداشتند. ما آن
            فرآیند را از نو ساختیم.
          </p>
        </div>
      </section>

      {/* ---------------- stats ---------------- */}
      <section className="border-b border-border bg-canvas-2/70">
        <dl className="container-page grid grid-cols-2 gap-6 py-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-num text-3xl font-extrabold text-foreground tabular-nums sm:text-4xl">
                {formatToman(s.value)}
                <span className="text-primary">{s.suffix}</span>
              </dd>
              <dt className="mt-2 text-xs text-muted sm:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- values ---------------- */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="ارزش‌های ما"
          title="چهار اصلی که سر آن‌ها مذاکره نمی‌کنیم"
          description="این‌ها شعار نیستند؛ هر تصمیم محصولی و عملیاتی ما با همین چهار معیار سنجیده می‌شود."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="hairline flex gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <v.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-[1.9] text-muted">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- timeline ---------------- */}
      <section className="border-y border-border bg-canvas-2/70">
        <div className="container-page py-16">
          <SectionHeading eyebrow="مسیر ما" title="از یک دفتر کوچک تا بازار سراسری" />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <li key={t.year} className="hairline rounded-2xl border border-border bg-surface p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 font-display text-xs font-bold text-accent-fg dark:text-accent">
                  <Sparkles className="size-3" />
                  {t.year}
                </span>
                <h3 className="mt-3 text-sm font-bold text-foreground">{t.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- guarantees ---------------- */}
      <section className="container-page py-16">
        <SectionHeading
          align="center"
          eyebrow="تضمین‌ها"
          title="چه چیزی را به شما تعهد می‌دهیم"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((p) => {
            const Icon = ICONS[p.icon as keyof typeof ICONS];
            return (
              <div key={p.title} className="hairline rounded-2xl border border-border bg-surface p-5">
                <span className="mb-3.5 flex size-11 items-center justify-center rounded-xl bg-success-tint text-success">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- cta ---------------- */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-plate p-8 text-center sm:p-14">
          <Aurora className="opacity-80" />
          <div aria-hidden className="grain absolute inset-0" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-2xl font-extrabold text-plate-fg sm:text-3xl">
              بیایید شماره‌ای پیدا کنیم که برای شما ساخته شده
            </h2>
            <p className="mx-auto mt-4 text-sm leading-[1.95] text-plate-fg/70">
              بیش از ۴۸ هزار شماره اصالت‌سنجی‌شده، با پرداخت امانی و انتقال سند رسمی.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/numbers">
                  مرور بازار
                  <ArrowLeft />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-plate-fg hover:bg-white/8 hover:text-plate-fg"
              >
                <Link href="/contact">تماس با ما</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
