"use client";

import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, Input, Label, Pill, PillGroup, Select, Switch, Textarea } from "@/components/ui/field";
import { Aurora, ScoreMeter, SectionHeading } from "@/components/ui/misc";
import { CITIES, ROND_LABELS, SIM_TYPE_LABELS } from "@/lib/data/site";
import type { SimType } from "@/lib/types";
import { formatToman, formatTomanCompact } from "@/lib/utils";
import { valuate } from "@/lib/valuation";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CircleCheckBig,
  Gauge,
  Handshake,
  Megaphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const BENEFITS = [
  {
    icon: Megaphone,
    title: "دیده‌شدن جدی",
    body: "آگهی شما در بازاری منتشر می‌شود که ماهانه بیش از ۳۰۰ هزار بازدیدکننده هدفمند دارد.",
  },
  {
    icon: Gauge,
    title: "قیمت‌گذاری کارشناسی",
    body: "پیش از انتشار، بازه قیمت منصفانه را بر پایه معاملات واقعی به شما پیشنهاد می‌دهیم.",
  },
  {
    icon: Handshake,
    title: "معامله بی‌دغدغه",
    body: "مذاکره، احراز هویت خریدار و هماهنگی انتقال سند را کارشناسان ما انجام می‌دهند.",
  },
  {
    icon: Banknote,
    title: "تسویه سریع",
    body: "حداکثر ۲۴ ساعت پس از تأیید انتقال، مبلغ به حساب شما واریز می‌شود. کمیسیون تنها ۳٪.",
  },
];

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    msisdn: "",
    simType: "permanent" as SimType,
    askingPrice: "",
    city: CITIES[0],
    name: "",
    phone: "",
    description: "",
    negotiable: true,
    installment: false,
    terms: false,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const preview = useMemo(
    () => (form.msisdn.length >= 11 ? valuate(form.msisdn, form.simType) : null),
    [form.msisdn, form.simType],
  );

  const valid =
    preview !== null &&
    form.name.trim().length > 2 &&
    /^09\d{9}$/.test(form.phone) &&
    Number(form.askingPrice) > 0 &&
    form.terms;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      toast.error("لطفاً شماره، قیمت پیشنهادی، نام و شماره تماس را کامل کنید");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="container-page py-16">
        <div className="hairline mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-success-tint text-success">
            <CircleCheckBig className="size-8" />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-foreground">درخواست شما ثبت شد</h1>
          <p className="mt-3 text-sm leading-[1.9] text-muted">
            کارشناسان روندیکس حداکثر تا ۴ ساعت کاری قیمت پیشنهادی را به شما اعلام می‌کنند. پس از تأیید
            شما، آگهی با نشان «اصالت‌سنجی شده» منتشر می‌شود.
          </p>
          <div className="my-6">
            <NumberPlate msisdn={form.msisdn} size="md" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard/listings">آگهی‌های من</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/numbers">مرور بازار</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-14">
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-60" />
        <div className="relative container-page py-14 text-center">
          <Badge tone="gold" className="mb-5">
            <Sparkles className="size-3.5" />
            کمیسیون فقط ۳٪
          </Badge>
          <h1 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            شماره‌تان را به <span className="foil">خریدار درست</span> برسانید
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-[1.95] text-muted">
            مشخصات خط را ثبت کنید؛ ما قیمت‌گذاری، بازاریابی، مذاکره و انتقال سند را انجام می‌دهیم.
          </p>
        </div>
      </section>

      {/* ---------------- benefits ---------------- */}
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="hairline rounded-2xl border border-border bg-surface p-5">
              <span className="mb-3.5 flex size-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <b.icon className="size-4.5" />
              </span>
              <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- form ---------------- */}
      <section className="container-page pb-6">
        <SectionHeading
          eyebrow="ثبت آگهی"
          title="مشخصات شماره"
          description="هر چه اطلاعات کامل‌تر باشد، کارشناسی قیمت سریع‌تر و دقیق‌تر انجام می‌شود."
          className="mb-8"
        />

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
          <div className="hairline min-w-0 space-y-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="msisdn" hint="۱۱ رقم، با ۰۹ شروع شود">
                  شماره موبایل
                </Label>
                <Input
                  id="msisdn"
                  digitsOnly
                  maxLength={11}
                  value={form.msisdn}
                  onChange={(e) => set("msisdn", e.target.value)}
                  placeholder="09121234567"
                  invalid={form.msisdn.length >= 11 && !preview}
                  className="h-12 text-base"
                  required
                />
                {form.msisdn.length >= 11 && !preview ? (
                  <p className="mt-2 text-xs text-danger">این شماره معتبر نیست.</p>
                ) : null}
              </div>

              <div>
                <Label>نوع سیم‌کارت</Label>
                <PillGroup className="w-full">
                  {(["permanent", "credit"] as SimType[]).map((t) => (
                    <Pill
                      key={t}
                      active={form.simType === t}
                      onClick={() => set("simType", t)}
                      className="flex-1"
                    >
                      {SIM_TYPE_LABELS[t]}
                    </Pill>
                  ))}
                </PillGroup>
              </div>

              <div>
                <Label htmlFor="city">شهر شما</Label>
                <Select id="city" value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label
                  htmlFor="askingPrice"
                  hint={
                    preview ? (
                      <button
                        type="button"
                        onClick={() => set("askingPrice", String(preview.mid))}
                        className="text-primary hover:underline"
                      >
                        استفاده از پیشنهاد ما ({formatTomanCompact(preview.mid)})
                      </button>
                    ) : null
                  }
                >
                  قیمت پیشنهادی شما (تومان)
                </Label>
                <Input
                  id="askingPrice"
                  digitsOnly
                  value={form.askingPrice}
                  onChange={(e) => set("askingPrice", e.target.value)}
                  placeholder="مثلاً 25000000"
                  suffix="تومان"
                  required
                />
                {form.askingPrice ? (
                  <p className="mt-2 text-xs text-muted tabular-nums">
                    {formatToman(Number(form.askingPrice))} تومان
                  </p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="نام کامل"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  digitsOnly
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="09123456789"
                  invalid={form.phone.length > 0 && !/^09\d{9}$/.test(form.phone)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="description" hint="اختیاری">
                  توضیحات
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="سابقه خط، وضعیت بدهی، دلیل فروش و هر نکته‌ای که برای خریدار مهم است."
                />
              </div>
            </div>

            <div className="space-y-3.5 rounded-xl border border-border bg-canvas-2/60 p-4">
              <Switch
                label="قیمت قابل مذاکره است"
                checked={form.negotiable}
                onChange={(e) => set("negotiable", e.target.checked)}
              />
              <Switch
                label="فروش اقساطی را می‌پذیرم"
                description="پیش‌پرداخت ۴۰٪ و تسویه ۳ تا ۱۲ ماهه، با تضمین روندیکس"
                checked={form.installment}
                onChange={(e) => set("installment", e.target.checked)}
              />
            </div>

            <Checkbox
              label={
                <span>
                  <Link href="/terms" className="text-primary hover:underline">
                    قوانین فروشندگان
                  </Link>{" "}
                  را می‌پذیرم و تأیید می‌کنم مالک قانونی این خط هستم.
                </span>
              }
              checked={form.terms}
              onChange={(e) => set("terms", e.target.checked)}
            />

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!valid}>
              ثبت درخواست کارشناسی
              <ArrowLeft />
            </Button>
          </div>

          {/* live preview */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
              <h2 className="border-b border-border px-5 py-4 font-display text-base font-bold text-foreground">
                پیش‌نمایش آگهی
              </h2>

              {preview ? (
                <div className="p-5">
                  <div className="flex justify-center">
                    <NumberPlate msisdn={preview.msisdn} size="md" />
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {preview.operator ? <OperatorChip operator={preview.operator} /> : null}
                    <Badge tone="neutral" size="xs">
                      {SIM_TYPE_LABELS[form.simType]}
                    </Badge>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-4 rounded-xl border border-border bg-canvas-2/60 p-4">
                    <ScoreMeter score={preview.score} size="md" />
                    <div>
                      <p className="text-xs font-bold text-foreground">امتیاز رندی</p>
                      <p className="mt-0.5 text-[0.625rem] text-subtle">از ۱۰۰</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {preview.rondTypes.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-accent/30 bg-accent-tint px-2 py-0.5 text-[0.625rem] text-accent-fg dark:text-accent"
                      >
                        {ROND_LABELS[t]}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl border border-accent/30 bg-accent-tint/50 p-4 text-center">
                    <p className="text-[0.6875rem] text-muted">بازه پیشنهادی روندیکس</p>
                    <p className="mt-1 font-num text-lg font-extrabold text-price tabular-nums">
                      {formatTomanCompact(preview.low)} — {formatTomanCompact(preview.high)}
                    </p>
                    <p className="mt-1 text-[0.625rem] text-subtle">تومان</p>
                  </div>

                  <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
                    <Link href="/valuation">جزئیات کامل ارزیابی</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-elevated text-subtle">
                    <Gauge className="size-5" />
                  </span>
                  <p className="text-sm text-muted">
                    شماره را وارد کنید تا امتیاز رندی و بازه قیمت پیشنهادی را همین‌جا ببینید.
                  </p>
                </div>
              )}

              <ul className="divide-y divide-border border-t border-border">
                {[
                  "انتشار آگهی رایگان است",
                  "کمیسیون ۳٪ تنها در صورت فروش",
                  "امکان حذف آگهی در هر زمان",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 px-5 py-3">
                    <BadgeCheck className="size-4 shrink-0 text-success" />
                    <span className="text-[0.75rem] text-muted">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </form>
      </section>
    </div>
  );
}
