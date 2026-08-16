"use client";

import { AdminPanel } from "@/components/admin/table";
import { ThemeSegmented } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Switch, Textarea } from "@/components/ui/field";
import { SITE } from "@/lib/data/site";
import { formatToman } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Palette,
  Percent,
  Plug,
  Save,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState({
    name: SITE.name,
    tagline: SITE.tagline,
    phone: SITE.phone,
    email: SITE.email,
    address: SITE.address,
    description: SITE.description,
  });

  const [commerce, setCommerce] = useState({
    commission: "3",
    transferFee: "450000",
    downPayment: "40",
    minPrice: "900000",
    escrow: true,
    installments: true,
    guaranteeDays: "7",
  });

  const [flags, setFlags] = useState({
    maintenance: false,
    registrations: true,
    publicListings: true,
    autoApprove: false,
    priceAlerts: true,
  });

  const setG = <K extends keyof typeof general>(k: K, v: string) =>
    setGeneral((s) => ({ ...s, [k]: v }));
  const setC = <K extends keyof typeof commerce>(k: K, v: string | boolean) =>
    setCommerce((s) => ({ ...s, [k]: v }));

  const save = (label: string) => toast.success(`${label} ذخیره شد`);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">تنظیمات</h1>
          <p className="mt-1.5 text-sm text-muted">
            پیکربندی فروشگاه، قوانین مالی و سرویس‌های متصل.
          </p>
        </div>
        <Badge tone="warning" size="xs">
          تغییرات در فاز دوم روی API اعمال می‌شود
        </Badge>
      </header>

      {/* ---------------- general ---------------- */}
      <AdminPanel title="اطلاعات عمومی" hint="در هدر، فوتر و متادیتای سایت استفاده می‌شود">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save("اطلاعات عمومی");
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="site-name">نام سایت</Label>
              <Input id="site-name" value={general.name} onChange={(e) => setG("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tagline">شعار</Label>
              <Input id="tagline" value={general.tagline} onChange={(e) => setG("tagline", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="site-phone">تلفن پشتیبانی</Label>
              <Input id="site-phone" value={general.phone} onChange={(e) => setG("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="site-email">ایمیل</Label>
              <Input
                id="site-email"
                type="email"
                value={general.email}
                onChange={(e) => setG("email", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">نشانی دفتر</Label>
              <Input id="address" value={general.address} onChange={(e) => setG("address", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description" hint="برای موتورهای جستجو">
                توضیحات متا
              </Label>
              <Textarea
                id="description"
                value={general.description}
                onChange={(e) => setG("description", e.target.value)}
              />
            </div>
          </div>
          <Button type="submit">
            <Save />
            ذخیره
          </Button>
        </form>
      </AdminPanel>

      {/* ---------------- commerce ---------------- */}
      <AdminPanel title="قوانین مالی" hint="کمیسیون، هزینه‌ها و شرایط اقساط">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save("قوانین مالی");
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="commission">کمیسیون پلتفرم</Label>
              <Input
                id="commission"
                digitsOnly
                value={commerce.commission}
                onChange={(e) => setC("commission", e.target.value)}
                suffix="درصد"
              />
            </div>
            <div>
              <Label htmlFor="transferFee">هزینه انتقال سند</Label>
              <Input
                id="transferFee"
                digitsOnly
                value={commerce.transferFee}
                onChange={(e) => setC("transferFee", e.target.value)}
                suffix="تومان"
              />
              <p className="mt-1.5 text-[0.6875rem] text-subtle tabular-nums">
                {formatToman(Number(commerce.transferFee) || 0)} تومان
              </p>
            </div>
            <div>
              <Label htmlFor="downPayment">حداقل پیش‌پرداخت اقساطی</Label>
              <Input
                id="downPayment"
                digitsOnly
                value={commerce.downPayment}
                onChange={(e) => setC("downPayment", e.target.value)}
                suffix="درصد"
              />
            </div>
            <div>
              <Label htmlFor="guaranteeDays">مدت ضمانت بازگشت</Label>
              <Input
                id="guaranteeDays"
                digitsOnly
                value={commerce.guaranteeDays}
                onChange={(e) => setC("guaranteeDays", e.target.value)}
                suffix="روز"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="minPrice">حداقل قیمت مجاز آگهی</Label>
              <Input
                id="minPrice"
                digitsOnly
                value={commerce.minPrice}
                onChange={(e) => setC("minPrice", e.target.value)}
                suffix="تومان"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-canvas-2/50 p-4">
              <Switch
                label="پرداخت امانی فعال باشد"
                description="نگهداری وجه تا تأیید انتقال سند توسط خریدار"
                checked={commerce.escrow}
                onChange={(e) => setC("escrow", e.target.checked)}
              />
            </div>
            <div className="rounded-xl border border-border bg-canvas-2/50 p-4">
              <Switch
                label="خرید اقساطی فعال باشد"
                description="نمایش گزینه اقساط روی شماره‌های واجد شرایط"
                checked={commerce.installments}
                onChange={(e) => setC("installments", e.target.checked)}
              />
            </div>
          </div>

          <Button type="submit">
            <Save />
            ذخیره
          </Button>
        </form>
      </AdminPanel>

      {/* ---------------- feature flags ---------------- */}
      <AdminPanel title="وضعیت سرویس" hint="کلیدهای کنترل رفتار سایت">
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                key: "maintenance",
                label: "حالت تعمیرات",
                desc: "سایت برای کاربران عادی بسته می‌شود",
                icon: ShieldCheck,
                danger: true,
              },
              {
                key: "registrations",
                label: "ثبت‌نام کاربران جدید",
                desc: "امکان ساخت حساب کاربری",
                icon: Building2,
                danger: false,
              },
              {
                key: "publicListings",
                label: "ثبت آگهی توسط کاربران",
                desc: "فرم فروش شماره در دسترس عموم باشد",
                icon: Truck,
                danger: false,
              },
              {
                key: "autoApprove",
                label: "تأیید خودکار آگهی‌ها",
                desc: "آگهی‌هایی که اختلاف قیمتشان زیر ۱۰٪ است بدون بررسی منتشر شوند",
                icon: Percent,
                danger: false,
              },
              {
                key: "priceAlerts",
                label: "هشدار تغییر قیمت",
                desc: "اطلاع‌رسانی به کاربرانی که شماره را ذخیره کرده‌اند",
                icon: Search,
                danger: false,
              },
            ] as const
          ).map((f) => (
            <div
              key={f.key}
              className={`rounded-xl border p-4 ${
                f.danger && flags[f.key] ? "border-danger/35 bg-danger-tint/40" : "border-border bg-canvas-2/50"
              }`}
            >
              <Switch
                label={
                  <span className="flex items-center gap-2">
                    <f.icon className="size-3.5 text-primary" />
                    {f.label}
                  </span>
                }
                description={f.desc}
                checked={flags[f.key]}
                onChange={(e) => setFlags((s) => ({ ...s, [f.key]: e.target.checked }))}
              />
            </div>
          ))}
        </div>
      </AdminPanel>

      {/* ---------------- integrations ---------------- */}
      <AdminPanel title="سرویس‌های متصل" hint="درگاه پرداخت، پیامک و تحلیل">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: CreditCard, name: "درگاه پرداخت زرین‌پال", state: "متصل", tone: "success" as const },
            { icon: Plug, name: "سرویس پیامک کاوه‌نگار", state: "متصل", tone: "success" as const },
            { icon: Search, name: "استعلام اپراتور", state: "متصل", tone: "success" as const },
            { icon: Building2, name: "سامانه مالیاتی مودیان", state: "پیکربندی نشده", tone: "warning" as const },
          ].map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-4 rounded-xl border border-border bg-canvas-2/50 p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                <s.icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <Badge tone={s.tone} size="xs" className="mt-1.5">
                  {s.state}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("پیکربندی در فاز دوم")}>
                پیکربندی
              </Button>
            </li>
          ))}
        </ul>
      </AdminPanel>

      {/* ---------------- appearance ---------------- */}
      <AdminPanel title="ظاهر پنل" hint="تم پیش‌فرض پنل مدیریت">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
            <Palette className="size-4.5" />
          </span>
          <ThemeSegmented className="max-w-sm flex-1" />
        </div>
      </AdminPanel>
    </div>
  );
}
