"use client";

import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Aurora, Stars } from "@/components/ui/misc";
import { OPERATORS } from "@/lib/data/site";
import type { PhoneNumber } from "@/lib/types";
import { formatToman, formatTomanCompact } from "@/lib/utils";
import { ArrowLeft, BadgeCheck, Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QUICK_CHIPS = [
  { label: "چهار رقم تکراری", href: "/numbers?rond=repeat-4" },
  { label: "هزاری", href: "/numbers?rond=thousand" },
  { label: "کد ۰۹۱۲", href: "/numbers?q=0912" },
  { label: "زیر ۵ میلیون", href: "/numbers?max=5000000" },
  { label: "آینه‌ای", href: "/numbers?rond=mirror" },
];

export function Hero({
  showcase,
  ticker,
  stats,
}: {
  showcase: PhoneNumber[];
  ticker: PhoneNumber[];
  stats: { value: number; suffix: string; label: string }[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [operator, setOperator] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (operator) params.set("operator", operator);
    router.push(`/numbers${params.size ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      <Aurora />
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-canvas to-transparent"
      />

      <div className="relative container-page grid gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-22">
        {/* ------------------------------ copy ------------------------------ */}
        <div className="animate-rise">
          <Badge tone="gold" className="mb-6">
            <Sparkles className="size-3.5" />
            بیش از ۴۸٬۰۰۰ شماره رند، اصالت‌سنجی شده
          </Badge>

          <h1 className="font-display text-[2.125rem] leading-[1.42] font-extrabold text-foreground sm:text-5xl sm:leading-[1.32] lg:text-[3.25rem]">
            شماره‌ای که{" "}
            <span className="relative inline-block">
              <span className="foil">یک‌بار می‌شنوند</span>
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute inset-x-0 -bottom-1.5 h-2.5 w-full text-accent/45"
              >
                <path d="M2 8C40 3 70 3 100 6s60 4 98-1" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            و هیچ‌وقت فراموش نمی‌کنند
          </h1>

          <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.95] text-muted sm:text-base">
            بازار تخصصی خرید و فروش شماره رند همراه اول، ایرانسل و رایتل. پرداخت امانی، انتقال سند
            رسمی و کارشناسی قیمت بر پایه هزاران معامله واقعی.
          </p>

          {/* search */}
          <form
            onSubmit={submit}
            className="hairline mt-8 rounded-2xl border border-border bg-surface/90 p-2.5 shadow-lg backdrop-blur-sm"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                digitsOnly
                icon={<Search />}
                placeholder="شماره یا الگو — مثلاً 0912***11**"
                aria-label="جستجوی شماره"
                className="h-12 border-transparent bg-elevated"
              />
              <Select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                aria-label="اپراتور"
                className="h-12 border-transparent bg-elevated sm:w-40"
              >
                <option value="">همه اپراتورها</option>
                {OPERATORS.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </Select>
              <Button type="submit" size="lg" className="h-12 shrink-0 sm:px-8">
                جستجو
                <ArrowLeft />
              </Button>
            </div>
            <p className="mt-2.5 px-2 pb-0.5 text-[0.6875rem] text-subtle">
              نکته: با <code className="rounded bg-elevated px-1 font-num text-foreground">*</code> جای
              رقم‌های دلخواه را خالی بگذارید — مثل <span dir="ltr" className="text-foreground">0912**5555</span>
            </p>
          </form>

          {/* quick chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-subtle">جستجوهای پرطرفدار:</span>
            {QUICK_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* social proof */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 rtl:space-x-reverse">
                {["از", "رم", "نس", "کی"].map((t, i) => (
                  <span
                    key={i}
                    className="flex size-8 items-center justify-center rounded-full border-2 border-canvas bg-elevated text-[0.625rem] font-bold text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div>
                <Stars rating={4.8} />
                <p className="mt-0.5 text-[0.6875rem] text-subtle">
                  <span className="font-semibold text-foreground tabular-nums">۴.۸</span> از ۵ — ۲٬۳۴۰ نظر
                </p>
              </div>
            </div>
            <span className="hidden h-8 w-px bg-border sm:block" />
            <p className="flex items-center gap-2 text-xs text-muted">
              <BadgeCheck className="size-4 text-success" />
              پرداخت امانی تا تأیید انتقال سند
            </p>
          </div>
        </div>

        {/* ---------------------------- showcase ---------------------------- */}
        <div className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* the spotlight number */}
            {showcase[0] ? (
              <div className="hairline relative z-20 rounded-3xl border border-border bg-surface p-5 shadow-xl sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Badge tone="gold" size="xs">
                    <Zap className="size-3" />
                    پیشنهاد ویژه امروز
                  </Badge>
                  <OperatorChip operator={showcase[0].operator} />
                </div>

                <Link href={`/numbers/${showcase[0].slug}`} className="block">
                  <NumberPlate msisdn={showcase[0].msisdn} size="lg" className="w-full justify-center" />
                </Link>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] text-subtle">قیمت</p>
                    <p className="foil font-num text-2xl font-extrabold tabular-nums">
                      {formatToman(showcase[0].price)}
                    </p>
                    <p className="text-[0.6875rem] text-muted">تومان</p>
                  </div>
                  <Button asChild variant="gold" size="sm">
                    <Link href={`/numbers/${showcase[0].slug}`}>
                      مشاهده
                      <ArrowLeft />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {/* stacked cards behind */}
            {showcase.slice(1, 3).map((item, i) => (
              <Link
                key={item.id}
                href={`/numbers/${item.slug}`}
                style={{ animationDelay: `${-i * 2.5}s` }}
                className={
                  i === 0
                    ? "absolute -top-6 -start-4 z-10 hidden animate-float rounded-2xl border border-border bg-surface/85 px-4 py-3 shadow-lg backdrop-blur-md transition-transform hover:scale-105 sm:block"
                    : "absolute -bottom-8 -end-3 z-30 hidden animate-float rounded-2xl border border-border bg-surface/85 px-4 py-3 shadow-lg backdrop-blur-md transition-transform hover:scale-105 sm:block"
                }
              >
                <NumberPlate msisdn={item.msisdn} size="xs" variant="bare" />
                <p className="mt-1.5 text-[0.625rem] text-muted tabular-nums">
                  {formatTomanCompact(item.price)} تومان
                </p>
              </Link>
            ))}
          </div>

          {/* stats */}
          <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-16">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-surface/70 p-4 text-center backdrop-blur-sm"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-num text-xl font-extrabold text-foreground tabular-nums sm:text-2xl">
                    {formatToman(s.value)}
                  </span>
                  <span className="font-display text-sm font-bold text-primary">{s.suffix}</span>
                  <span className="mt-1 block text-[0.6875rem] leading-[1.6] text-subtle">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ------------------------------ ticker ------------------------------ */}
      <div className="relative border-t border-border bg-surface/50">
        <div className="container-page flex items-center gap-4 py-3">
          <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-success">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            آخرین معاملات
          </span>
          <div className="fade-inline-end relative min-w-0 flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-8">
              {[...ticker, ...ticker].map((item, i) => (
                <span key={`${item.id}-${i}`} className="flex shrink-0 items-center gap-2.5 text-xs">
                  <TrendingUp className="size-3.5 text-success" />
                  <span dir="ltr" className="font-num font-semibold text-foreground tabular-nums">
                    {item.msisdn.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}
                  </span>
                  <span className="text-subtle">{formatTomanCompact(item.price)} تومان</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
