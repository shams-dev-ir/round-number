"use client";

import { ThemeSegmented } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Switch, Textarea } from "@/components/ui/field";
import { CITIES } from "@/lib/data/site";
import { CURRENT_USER } from "@/lib/data/account";
import { BadgeCheck, Bell, Lock, Palette, Save, ShieldAlert, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    phone: CURRENT_USER.phone,
    nationalId: CURRENT_USER.nationalId,
    city: CURRENT_USER.city,
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    orderSms: true,
    orderEmail: true,
    priceAlerts: true,
    newsletter: false,
    marketing: false,
  });

  const set = <K extends keyof typeof profile>(key: K, value: string) =>
    setProfile((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">تنظیمات حساب</h1>
        <p className="mt-2 text-sm text-muted">
          اطلاعات هویتی، اعلان‌ها و ظاهر پنل خود را مدیریت کنید.
        </p>
      </header>

      {/* ---------------- profile ---------------- */}
      <Section icon={User} title="اطلاعات شخصی" description="سند شماره‌ها به نام همین مشخصات منتقل می‌شود.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("اطلاعات حساب ذخیره شد");
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" value={profile.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone" hint="تغییر نیازمند تأیید پیامکی">
                شماره موبایل
              </Label>
              <Input id="phone" digitsOnly value={profile.phone} readOnly className="opacity-70" />
            </div>
            <div>
              <Label
                htmlFor="nationalId"
                hint={
                  CURRENT_USER.verified ? (
                    <span className="inline-flex items-center gap-1 text-success">
                      <BadgeCheck className="size-3" />
                      تأیید شده
                    </span>
                  ) : null
                }
              >
                کد ملی
              </Label>
              <Input
                id="nationalId"
                digitsOnly
                maxLength={10}
                value={profile.nationalId}
                onChange={(e) => set("nationalId", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">شهر</Label>
              <Select id="city" value={profile.city} onChange={(e) => set("city", e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio" hint="برای نمایش در پروفایل فروشنده">
                درباره من
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="مثلاً: فعال در حوزه خرید و فروش شماره‌های رند از سال ۱۳۹۹"
              />
            </div>
          </div>

          <Button type="submit">
            <Save />
            ذخیره تغییرات
          </Button>
        </form>
      </Section>

      {/* ---------------- notifications ---------------- */}
      <Section icon={Bell} title="اعلان‌ها" description="انتخاب کنید چه چیزی و از چه راهی به شما اطلاع داده شود.">
        <div className="space-y-4">
          {(
            [
              { key: "orderSms", label: "پیامک وضعیت سفارش", desc: "تغییر وضعیت پرداخت و انتقال سند" },
              { key: "orderEmail", label: "ایمیل وضعیت سفارش", desc: "فاکتور و مدارک انتقال" },
              { key: "priceAlerts", label: "هشدار تغییر قیمت", desc: "برای شماره‌های ذخیره‌شده در علاقه‌مندی‌ها" },
              { key: "newsletter", label: "خبرنامه هفتگی", desc: "رندترین شماره‌های تازه‌رسیده و تحلیل بازار" },
              { key: "marketing", label: "پیشنهادهای تبلیغاتی", desc: "کدهای تخفیف و کمپین‌های فصلی" },
            ] as const
          ).map((row) => (
            <div key={row.key} className="rounded-xl border border-border bg-canvas-2/50 p-4">
              <Switch
                label={row.label}
                description={row.desc}
                checked={notifications[row.key]}
                onChange={(e) =>
                  setNotifications((n) => ({ ...n, [row.key]: e.target.checked }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- appearance ---------------- */}
      <Section icon={Palette} title="ظاهر" description="تم روشن، تاریک یا هم‌گام با سیستم‌عامل.">
        <ThemeSegmented className="max-w-sm" />
      </Section>

      {/* ---------------- security ---------------- */}
      <Section icon={Lock} title="امنیت" description="دستگاه‌های فعال و ورودهای اخیر به حساب شما.">
        <div className="space-y-2.5">
          {[
            { device: "Chrome — ویندوز", place: "تهران، ایران", when: "همین حالا", current: true },
            { device: "Safari — iPhone", place: "تهران، ایران", when: "۲ روز پیش", current: false },
            { device: "Chrome — اندروید", place: "مشهد، ایران", when: "۳ هفته پیش", current: false },
          ].map((s) => (
            <div
              key={s.device + s.when}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-canvas-2/50 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{s.device}</p>
                  {s.current ? (
                    <Badge tone="success" size="xs">
                      دستگاه فعلی
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-[0.6875rem] text-subtle">
                  {s.place} — {s.when}
                </p>
              </div>
              {!s.current ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.success("نشست بسته شد")}
                  className="text-danger hover:bg-danger/10"
                >
                  خروج از این دستگاه
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- danger zone ---------------- */}
      <section className="rounded-2xl border border-danger/30 bg-danger-tint/40 p-5 sm:p-6">
        <div className="flex gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/12 text-danger">
            <ShieldAlert className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-foreground">حذف حساب کاربری</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
              با حذف حساب، دسترسی شما به سفارش‌ها و آگهی‌ها از بین می‌رود. سابقه معاملات انجام‌شده به
              دلیل الزامات قانونی حفظ می‌شود.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-4"
              onClick={() => toast.error("برای حذف حساب با پشتیبانی تماس بگیرید")}
            >
              <Trash2 />
              درخواست حذف حساب
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
          <Icon className="size-4.5" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
