"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Aurora, SectionHeading } from "@/components/ui/misc";
import { SITE } from "@/lib/data/site";
import { CircleCheckBig, Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TOPICS = [
  "سوال درباره خرید شماره",
  "درخواست شماره سفارشی",
  "پیگیری سفارش",
  "فروش شماره و کارشناسی قیمت",
  "همکاری و نمایندگی",
  "گزارش مشکل فنی",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valid = form.name.trim().length > 2 && /^09\d{9}$/.test(form.phone) && form.message.trim().length > 9;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      toast.error("نام، شماره تماس و متن پیام را کامل کنید");
      return;
    }
    setSent(true);
  };

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-60" />
        <div className="relative container-page py-14 text-center">
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">تماس با ما</h1>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-[1.95] text-muted">
            سوالی دارید یا شماره خاصی می‌خواهید که در بازار نیست؟ بنویسید — کارشناسان ما در کمتر از
            یک روز کاری پاسخ می‌دهند.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
          {/* ---------------- form ---------------- */}
          <div className="min-w-0">
            {sent ? (
              <div className="hairline rounded-2xl border border-border bg-surface p-8 text-center">
                <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-success-tint text-success">
                  <CircleCheckBig className="size-8" />
                </span>
                <h2 className="font-display text-xl font-bold text-foreground">پیام شما ارسال شد</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                  از تماس شما سپاسگزاریم. کارشناسان ما حداکثر تا یک روز کاری با شما تماس می‌گیرند.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", phone: "", email: "", topic: TOPICS[0], message: "" });
                  }}
                >
                  ارسال پیام دیگر
                </Button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="hairline space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6"
              >
                <SectionHeading title="فرم تماس" description="فیلدهای ستاره‌دار الزامی هستند." />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">نام و نام خانوادگی *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="نام کامل"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">شماره تماس *</Label>
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
                    <Label htmlFor="topic">موضوع</Label>
                    <Select id="topic" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" hint={`${form.message.length} حرف`}>
                    متن پیام *
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="اگر شماره سفارشی می‌خواهید، الگوی مورد نظر و بازه قیمتتان را بنویسید."
                    className="min-h-40"
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={!valid}>
                  <Send />
                  ارسال پیام
                </Button>
              </form>
            )}
          </div>

          {/* ---------------- info ---------------- */}
          <aside className="space-y-4">
            <div className="hairline rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-5 font-display text-base font-bold text-foreground">راه‌های تماس</h2>
              <ul className="space-y-4">
                <InfoRow icon={Phone} label="تلفن پشتیبانی">
                  <a href={`tel:${SITE.phone}`} dir="ltr" className="tabular-nums hover:text-primary">
                    {SITE.phone}
                  </a>
                </InfoRow>
                <InfoRow icon={Mail} label="ایمیل">
                  <a href={`mailto:${SITE.email}`} dir="ltr" className="hover:text-primary">
                    {SITE.email}
                  </a>
                </InfoRow>
                <InfoRow icon={MapPin} label="نشانی دفتر">
                  {SITE.address}
                </InfoRow>
                <InfoRow icon={Clock} label="ساعات پاسخگویی">
                  هر روز، ۹ صبح تا ۹ شب
                </InfoRow>
              </ul>
            </div>

            <div className="hairline rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-foreground">
                <MessageSquare className="size-4 text-primary" />
                شبکه‌های اجتماعی
              </h2>
              <div className="flex flex-wrap gap-2">
                {SITE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="rounded-full border border-border bg-elevated px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
              <div
                aria-hidden
                className="lattice grid h-40 place-items-center border-b border-border bg-canvas-2"
              >
                <MapPin className="size-8 text-primary/50" />
              </div>
              <div className="p-5">
                <p className="text-[0.8125rem] leading-relaxed text-muted">
                  حضور در دفتر تنها با هماهنگی تلفنی قبلی امکان‌پذیر است.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.6875rem] text-subtle">{label}</p>
        <p className="mt-0.5 text-[0.8125rem] text-foreground">{children}</p>
      </div>
    </li>
  );
}
