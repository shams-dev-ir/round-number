"use client";

import { NumberCardMini } from "@/components/numbers/number-card";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Pill, PillGroup } from "@/components/ui/field";
import { Aurora, ScoreMeter, SectionHeading } from "@/components/ui/misc";
import { ROND_LABELS, SIM_TYPE_LABELS } from "@/lib/data/site";
import type { SimType } from "@/lib/types";
import { cn, formatToman, formatTomanCompact, VIP_SCORE } from "@/lib/utils";
import { valuate, type Valuation } from "@/lib/valuation";
import {
  ArrowLeft,
  BadgeCheck,
  Calculator,
  Gauge,
  Info,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const EXAMPLES = ["09121110000", "09351234567", "09122224444", "09201361361"];

export default function ValuationPage() {
  const [input, setInput] = useState("");
  const [simType, setSimType] = useState<SimType>("permanent");
  const [result, setResult] = useState<Valuation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (raw: string, sim: SimType = simType) => {
    const value = valuate(raw, sim);
    if (!value) {
      setError("شماره وارد شده معتبر نیست. یک شماره موبایل ۱۱ رقمی وارد کنید — مثل 09121234567");
      setResult(null);
      return;
    }
    setError(null);
    setResult(value);
  };

  return (
    <div className="pb-14">
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-70" />
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative container-page py-14">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand" className="mb-5">
              <Gauge className="size-3.5" />
              موتور قیمت‌گذاری روندیکس
            </Badge>
            <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              شماره‌تان چقدر <span className="foil">می‌ارزد؟</span>
            </h1>
            <p className="mt-4 text-[0.9375rem] leading-[1.95] text-muted">
              الگوی رند، کد اپراتور و نوع سیم‌کارت را می‌سنجیم و بر پایه معاملات واقعی بازار، بازه
              قیمت منصفانه را همان لحظه به شما می‌گوییم. رایگان و بدون ثبت‌نام.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
            className="hairline mx-auto mt-9 max-w-xl rounded-2xl border border-border bg-surface/90 p-4 shadow-lg backdrop-blur-sm"
          >
            <Label htmlFor="msisdn">شماره موبایل</Label>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Input
                id="msisdn"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                digitsOnly
                maxLength={13}
                placeholder="09121234567"
                icon={<Calculator />}
                aria-label="شماره موبایل"
                invalid={Boolean(error)}
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 shrink-0">
                ارزیابی کن
                <ArrowLeft />
              </Button>
            </div>

            <div className="mt-4">
              <Label>نوع سیم‌کارت</Label>
              <PillGroup className="w-full">
                {(["permanent", "credit"] as SimType[]).map((t) => (
                  <Pill
                    key={t}
                    active={simType === t}
                    onClick={() => {
                      setSimType(t);
                      if (result) run(result.msisdn, t);
                    }}
                    className="flex-1"
                  >
                    {SIM_TYPE_LABELS[t]}
                  </Pill>
                ))}
              </PillGroup>
            </div>

            {error ? (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-tint px-3.5 py-2.5 text-xs leading-relaxed text-danger">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[0.6875rem] text-subtle">نمونه:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  dir="ltr"
                  onClick={() => {
                    setInput(ex);
                    run(ex);
                  }}
                  className="rounded-lg border border-border bg-elevated px-2.5 py-1 font-num text-[0.6875rem] text-muted tabular-nums transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ---------------- result ---------------- */}
      {result ? (
        <section className="container-page py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
            <div className="min-w-0 space-y-6">
              {/* headline card */}
              <div className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <NumberPlate msisdn={result.msisdn} size="lg" />
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {result.operator ? (
                        <OperatorChip operator={result.operator} size="md" />
                      ) : (
                        <Badge tone="warning" size="xs">
                          پیش‌شماره ناشناس
                        </Badge>
                      )}
                      <Badge tone="neutral" size="xs">
                        سیم‌کارت {SIM_TYPE_LABELS[simType]}
                      </Badge>
                      {result.score >= VIP_SCORE ? (
                        <Badge tone="gold" size="xs">
                          <Sparkles className="size-3" />
                          در دسته VIP
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <ScoreMeter score={result.score} size="lg" />
                    <div>
                      <p className="text-sm font-bold text-foreground">امتیاز رندی</p>
                      <p className="mt-0.5 max-w-36 text-[0.6875rem] leading-relaxed text-muted">
                        از ۱۰۰ — بر پایه ۱۴ الگوی رند
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* patterns */}
              <div className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <Tag className="size-4.5 text-primary" />
                  الگوهای شناسایی‌شده
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.rondTypes.map((t) => (
                    <Link
                      key={t}
                      href={`/numbers?rond=${t}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-tint px-3 py-1.5 text-xs font-medium text-accent-fg transition-colors hover:border-accent dark:text-accent"
                    >
                      {ROND_LABELS[t]}
                    </Link>
                  ))}
                </div>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {result.reasons.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2.5 rounded-xl border border-border bg-canvas-2/60 p-3 text-[0.8125rem] text-muted"
                    >
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* comparables */}
              <div>
                <SectionHeading
                  title="معاملات مشابه در بازار"
                  description="شماره‌هایی با الگو و امتیاز نزدیک که همین حالا در روندیکس فعال هستند."
                  className="mb-5"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.comparables.map((n) => (
                    <NumberCardMini key={n.id} item={n} />
                  ))}
                </div>
              </div>
            </div>

            {/* price band */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-display text-base font-bold text-foreground">بازه قیمت پیشنهادی</h2>
                  <p className="mt-1 text-[0.6875rem] text-subtle">بر پایه معاملات ۹۰ روز گذشته</p>
                </div>

                <div className="space-y-3 p-5">
                  <PriceRow
                    label="فروش فوری"
                    hint="پیشنهاد نقدی همکاران"
                    value={result.low}
                    tone="info"
                  />
                  <PriceRow
                    label="قیمت منصفانه بازار"
                    hint="محتمل‌ترین قیمت معامله"
                    value={result.mid}
                    tone="gold"
                    emphasis
                  />
                  <PriceRow
                    label="فروش صبورانه"
                    hint="با زمان انتظار بیشتر"
                    value={result.high}
                    tone="success"
                  />
                </div>

                {/* band visual */}
                <div className="px-5 pb-5">
                  <div className="relative h-2 overflow-hidden rounded-full bg-elevated">
                    <div className="absolute inset-y-0 start-[12%] end-[12%] rounded-full bg-linear-to-l from-info via-accent to-success" />
                  </div>
                  <div className="mt-2 flex justify-between text-[0.625rem] text-subtle tabular-nums">
                    <span>{formatTomanCompact(result.low)}</span>
                    <span>{formatTomanCompact(result.high)}</span>
                  </div>
                </div>

                <div className="border-t border-border p-5">
                  <Button asChild className="w-full">
                    <Link href="/sell">
                      ثبت آگهی فروش
                      <ArrowLeft />
                    </Link>
                  </Button>
                  <p className="mt-3 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-subtle">
                    <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    این بازه یک برآورد خودکار است. کارشناسان ما پس از ثبت آگهی، قیمت نهایی را با شما
                    نهایی می‌کنند.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className="container-page py-14">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Tag,
                title: "۱۴ الگوی رند",
                body: "از تکرارهای پنج‌رقمی تا ترازویی و رول؛ هر الگو وزن خودش را در امتیاز دارد.",
              },
              {
                icon: TrendingUp,
                title: "داده معاملات واقعی",
                body: "قیمت‌ها با معاملات ۹۰ روز گذشته روندیکس کالیبره می‌شوند، نه با حدس.",
              },
              {
                icon: Gauge,
                title: "سه سطح قیمت",
                body: "فروش فوری، قیمت منصفانه و سقف فروش صبورانه — تا با چشم باز تصمیم بگیرید.",
              },
            ].map((f) => (
              <div key={f.title} className="hairline rounded-2xl border border-border bg-surface p-5">
                <span className="mb-3.5 flex size-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
                  <f.icon className="size-4.5" />
                </span>
                <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PriceRow({
  label,
  hint,
  value,
  tone,
  emphasis,
}: {
  label: string;
  hint: string;
  value: number;
  tone: "info" | "gold" | "success";
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5",
        emphasis ? "border-accent/35 bg-accent-tint/50" : "border-border bg-canvas-2/50",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.8125rem] font-semibold text-foreground">{label}</span>
        <span
          className={cn(
            "font-num font-extrabold tabular-nums",
            emphasis ? "text-price text-lg" : "text-sm",
            !emphasis && tone === "info" && "text-info",
            !emphasis && tone === "success" && "text-success",
          )}
        >
          {formatToman(value)}
        </span>
      </div>
      <p className="mt-1 text-[0.625rem] text-subtle">{hint}</p>
    </div>
  );
}
