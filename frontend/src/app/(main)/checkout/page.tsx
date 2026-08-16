"use client";

import { NumberPlate } from "@/components/numbers/number-plate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Switch, Textarea } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { CITIES } from "@/lib/data/site";
import { cn, formatToman } from "@/lib/utils";
import { cartTotal, COMMISSION_RATE, TRANSFER_FEE, useCart } from "@/store/cart";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  FileCheck2,
  Landmark,
  PartyPopper,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "اطلاعات خریدار", icon: User },
  { id: 2, label: "روش پرداخت", icon: CreditCard },
  { id: 3, label: "تأیید نهایی", icon: FileCheck2 },
];

const PAYMENT_METHODS = [
  {
    id: "gateway",
    label: "درگاه پرداخت بانکی",
    hint: "پرداخت آنی با کارت‌های شتاب",
    icon: CreditCard,
  },
  { id: "wallet", label: "کیف پول روندیکس", hint: "موجودی: ۰ تومان", icon: Wallet, disabled: true },
  { id: "installment", label: "خرید اقساطی", hint: "پیش‌پرداخت ۴۰٪ و اقساط ۳ تا ۱۲ ماهه", icon: Landmark },
  { id: "transfer", label: "کارت به کارت / حواله", hint: "تأیید دستی تا ۲ ساعت کاری", icon: Building2 },
];

export default function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);

  const mounted = useIsHydrated();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("gateway");
  const [placed, setPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    email: "",
    city: CITIES[0],
    address: "",
    note: "",
    delivery: true,
    terms: false,
  });

  const subtotal = cartTotal(lines);
  const commission = Math.round(subtotal * COMMISSION_RATE);
  const transfer = TRANSFER_FEE * lines.length;
  const total = subtotal + commission + transfer;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const stepOneValid =
    form.firstName.trim().length > 1 &&
    form.lastName.trim().length > 1 &&
    /^\d{10}$/.test(form.nationalId) &&
    /^09\d{9}$/.test(form.phone);

  const submit = () => {
    if (!form.terms) {
      toast.error("پذیرش قوانین و مقررات الزامی است");
      return;
    }
    const code = `RX-${Date.now().toString().slice(-8)}`;
    setPlaced(code);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return <div className="container-page py-16" aria-busy />;

  /* ---------------------------- success ---------------------------- */
  if (placed) {
    return (
      <div className="container-page py-16">
        <div className="hairline mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-success-tint text-success">
            <PartyPopper className="size-8" />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-foreground">سفارش شما ثبت شد</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            کارشناس روندیکس تا حداکثر ۲ ساعت کاری برای هماهنگی انتقال سند با شما تماس می‌گیرد. وضعیت
            سفارش را می‌توانید از پنل کاربری پیگیری کنید.
          </p>
          <div className="my-6 rounded-2xl border border-dashed border-border bg-canvas-2 p-4">
            <p className="text-xs text-subtle">کد پیگیری سفارش</p>
            <p dir="ltr" className="mt-1 font-num text-xl font-bold text-foreground tabular-nums">
              {placed}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard/orders">پیگیری سفارش</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/numbers">ادامه خرید</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------- empty ---------------------------- */
  if (lines.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag />}
          title="سبد خرید شما خالی است"
          description="برای تکمیل خرید ابتدا شماره‌ای را به سبد اضافه کنید."
          action={
            <Button asChild>
              <Link href="/numbers">
                مرور شماره‌ها
                <ArrowLeft />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  /* ---------------------------- flow ---------------------------- */
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">تکمیل خرید</h1>

      {/* stepper */}
      <ol className="mt-7 mb-8 flex items-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-colors",
                    done
                      ? "border-success bg-success text-white"
                      : active
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-surface text-subtle",
                  )}
                >
                  {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                </span>
                <span
                  className={cn(
                    "hidden truncate text-sm font-medium sm:block",
                    active ? "text-foreground" : "text-subtle",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 ? (
                <span
                  className={cn("h-px flex-1 transition-colors", step > s.id ? "bg-success" : "bg-border")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
        <div className="min-w-0">
          {/* ---------- step 1 ---------- */}
          {step === 1 ? (
            <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-5 font-display text-lg font-bold text-foreground">اطلاعات خریدار</h2>
              <p className="mb-6 rounded-xl border border-info/25 bg-info-tint px-4 py-3 text-[0.8125rem] leading-relaxed text-info">
                سند شماره به نام همین مشخصات منتقل می‌شود. لطفاً اطلاعات را دقیقاً مطابق کارت ملی وارد
                کنید.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    placeholder="نام"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder="نام خانوادگی"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nationalId" hint="۱۰ رقم">
                    کد ملی
                  </Label>
                  <Input
                    id="nationalId"
                    digitsOnly
                    maxLength={10}
                    value={form.nationalId}
                    onChange={(e) => set("nationalId", e.target.value)}
                    placeholder="0012345678"
                    invalid={form.nationalId.length > 0 && !/^\d{10}$/.test(form.nationalId)}
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
                <div>
                  <Label htmlFor="email" hint="اختیاری">
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="city">شهر</Label>
                  <Select id="city" value={form.city} onChange={(e) => set("city", e.target.value)}>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address" hint="برای ارسال سیم‌کارت">
                    نشانی
                  </Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="نشانی کامل پستی"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-canvas-2/60 p-4">
                <Switch
                  label="ارسال سیم‌کارت با پیک ویژه"
                  description="در صورت غیرفعال بودن، تحویل حضوری در دفتر روندیکس هماهنگ می‌شود."
                  checked={form.delivery}
                  onChange={(e) => set("delivery", e.target.checked)}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  size="lg"
                  disabled={!stepOneValid}
                  onClick={() => setStep(2)}
                  title={stepOneValid ? undefined : "نام، نام خانوادگی، کد ملی و شماره تماس را کامل کنید"}
                >
                  مرحله بعد
                  <ArrowLeft />
                </Button>
              </div>
            </section>
          ) : null}

          {/* ---------- step 2 ---------- */}
          {step === 2 ? (
            <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-5 font-display text-lg font-bold text-foreground">روش پرداخت</h2>

              <div className="grid gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors",
                      m.disabled && "cursor-not-allowed opacity-55",
                      method === m.id
                        ? "border-primary bg-primary-tint"
                        : "border-border hover:border-primary/35",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={method === m.id}
                      disabled={m.disabled}
                      onChange={() => setMethod(m.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                        method === m.id
                          ? "border-primary/40 bg-primary text-primary-fg"
                          : "border-border bg-elevated text-muted",
                      )}
                    >
                      <m.icon className="size-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                      <span className="mt-0.5 block text-xs text-subtle">{m.hint}</span>
                    </span>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        method === m.id ? "border-primary bg-primary" : "border-border",
                      )}
                    >
                      {method === m.id ? <Check className="size-3 text-primary-fg" strokeWidth={3.5} /> : null}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowRight />
                  مرحله قبل
                </Button>
                <Button size="lg" onClick={() => setStep(3)}>
                  مرحله بعد
                  <ArrowLeft />
                </Button>
              </div>
            </section>
          ) : null}

          {/* ---------- step 3 ---------- */}
          {step === 3 ? (
            <section className="space-y-5">
              <div className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <h2 className="mb-5 font-display text-lg font-bold text-foreground">مرور و تأیید</h2>

                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <Field label="خریدار" value={`${form.firstName} ${form.lastName}`} />
                  <Field label="کد ملی" value={form.nationalId} ltr />
                  <Field label="شماره تماس" value={form.phone} ltr />
                  <Field label="شهر" value={form.city} />
                  <Field
                    label="روش پرداخت"
                    value={PAYMENT_METHODS.find((m) => m.id === method)?.label ?? "—"}
                  />
                  <Field
                    label="تحویل"
                    value={form.delivery ? "پیک ویژه به نشانی خریدار" : "تحویل حضوری در دفتر"}
                  />
                  {form.address ? (
                    <div className="sm:col-span-2">
                      <Field label="نشانی" value={form.address} />
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6">
                  <Label htmlFor="note" hint="اختیاری">
                    یادداشت برای کارشناس
                  </Label>
                  <Textarea
                    id="note"
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                    placeholder="مثلاً: تماس در ساعات عصر"
                  />
                </div>
              </div>

              <div className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-bold text-foreground">شماره‌های این سفارش</h3>
                <div className="space-y-2.5">
                  {lines.map((line) => (
                    <div
                      key={line.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-canvas-2/60 p-3"
                    >
                      <NumberPlate msisdn={line.msisdn} size="xs" />
                      <span className="font-num text-sm font-bold text-foreground tabular-nums">
                        {formatToman(line.price)} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    className="mt-0.5 size-4.5 shrink-0 accent-primary"
                  />
                  <span className="text-[0.8125rem] leading-relaxed text-muted">
                    <Link href="/terms" className="text-primary hover:underline">
                      قوانین و مقررات
                    </Link>{" "}
                    و{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      سیاست حریم خصوصی
                    </Link>{" "}
                    روندیکس را خوانده‌ام و می‌پذیرم. می‌دانم مبلغ تا تأیید انتقال سند در حساب امانی
                    نگه داشته می‌شود.
                  </span>
                </label>

                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowRight />
                    مرحله قبل
                  </Button>
                  <Button variant="gold" size="lg" onClick={submit}>
                    <ShieldCheck />
                    پرداخت {formatToman(total)} تومان
                  </Button>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        {/* ---------- summary ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
            <h2 className="border-b border-border px-5 py-4 font-display text-base font-bold text-foreground">
              خلاصه سفارش
            </h2>
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <NumberPlate msisdn={line.msisdn} size="xs" variant="bare" />
                  <span className="text-xs font-semibold text-foreground tabular-nums">
                    {formatToman(line.price)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2.5 border-t border-border p-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">جمع شماره‌ها</dt>
                <dd className="font-semibold text-foreground tabular-nums">{formatToman(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">کمیسیون (۳٪)</dt>
                <dd className="font-semibold text-foreground tabular-nums">{formatToman(commission)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">انتقال سند</dt>
                <dd className="font-semibold text-foreground tabular-nums">{formatToman(transfer)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <dt className="font-bold text-foreground">قابل پرداخت</dt>
                <dd>
                  <span className="font-num text-lg font-extrabold text-price tabular-nums">
                    {formatToman(total)}
                  </span>
                  <span className="ms-1 text-[0.625rem] text-muted">تومان</span>
                </dd>
              </div>
            </dl>
            <div className="border-t border-border p-5">
              <Badge tone="success" size="xs" className="mb-2">
                <Truck className="size-3" />
                ارسال رایگان
              </Badge>
              <p className="text-[0.6875rem] leading-relaxed text-subtle">
                پس از تأیید پرداخت، کارشناس ما زمان انتقال سند را با شما و فروشنده هماهنگ می‌کند.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className="text-end font-medium text-foreground tabular-nums">
        {value || "—"}
      </dd>
    </div>
  );
}
