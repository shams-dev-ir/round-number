"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, PillGroup } from "@/components/ui/field";
import { STATUS_LABELS } from "@/lib/data/site";
import type { PhoneNumber } from "@/lib/types";
import { cn, discountPercent, formatToman } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useCompare, useFavorites } from "@/store/favorites";
import {
  BadgeCheck,
  Check,
  GitCompareArrows,
  Heart,
  Link2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const DOWN_PAYMENT_RATE = 0.4;
const PLANS = [3, 6, 12] as const;
/** Flat monthly profit rate applied to the financed remainder. */
const MONTHLY_RATE = 0.025;

export function PurchasePanel({ item }: { item: PhoneNumber }) {
  const [months, setMonths] = useState<(typeof PLANS)[number]>(6);
  const [copied, setCopied] = useState(false);

  const addToCart = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.some((l) => l.id === item.id));
  const favorite = useFavorites((s) => s.ids.includes(item.id));
  const toggleFavorite = useFavorites((s) => s.toggle);
  const compared = useCompare((s) => s.ids.includes(item.id));
  const toggleCompare = useCompare((s) => s.toggle);

  const off = discountPercent(item.price, item.oldPrice);
  const unavailable = item.status !== "available";

  const down = Math.round(item.price * DOWN_PAYMENT_RATE);
  const financed = item.price - down;
  const monthly = Math.round((financed * (1 + MONTHLY_RATE * months)) / months);

  const handleAdd = () => {
    if (inCart) {
      toast.info("این شماره در سبد خرید شماست");
      return;
    }
    addToCart(item);
    toast.success("به سبد خرید اضافه شد", { description: item.msisdn });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.msisdn, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("نشانی صفحه کپی شد");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی نشانی ممکن نشد");
    }
  };

  return (
    <div className="lg:sticky lg:top-24">
      <div className="hairline overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {/* ---------- price ---------- */}
        <div className="border-b border-border p-5">
          {item.oldPrice ? (
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-sm text-subtle line-through tabular-nums">
                {formatToman(item.oldPrice)}
              </span>
              {off ? (
                <Badge tone="danger" size="xs">
                  {off}% تخفیف
                </Badge>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-baseline gap-2">
            <span className="foil font-num text-3xl font-extrabold tabular-nums">
              {formatToman(item.price)}
            </span>
            <span className="text-sm text-muted">تومان</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone={unavailable ? "warning" : "success"} size="xs">
              {STATUS_LABELS[item.status]}
            </Badge>
            {item.negotiable ? (
              <Badge tone="neutral" size="xs">
                قابل مذاکره
              </Badge>
            ) : null}
            {item.guarantee ? (
              <Badge tone="info" size="xs">
                <ShieldCheck className="size-3" />
                ضمانت بازگشت وجه
              </Badge>
            ) : null}
          </div>
        </div>

        {/* ---------- installments ---------- */}
        {item.installment && !unavailable ? (
          <div className="border-b border-border bg-canvas-2/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Wallet className="size-4 text-success" />
              <h3 className="text-sm font-bold text-foreground">خرید اقساطی</h3>
            </div>

            <PillGroup className="mb-3 w-full">
              {PLANS.map((m) => (
                <Pill key={m} active={months === m} onClick={() => setMonths(m)} className="flex-1">
                  {m} ماه
                </Pill>
              ))}
            </PillGroup>

            <dl className="space-y-2 text-[0.8125rem]">
              <div className="flex justify-between">
                <dt className="text-muted">پیش‌پرداخت (۴۰٪)</dt>
                <dd className="font-semibold text-foreground tabular-nums">{formatToman(down)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">قسط ماهانه</dt>
                <dd className="font-bold text-success tabular-nums">{formatToman(monthly)}</dd>
              </div>
            </dl>
            <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-subtle">
              انتقال سند پس از تسویه کامل انجام می‌شود؛ خط از روز اول در اختیار شماست.
            </p>
          </div>
        ) : null}

        {/* ---------- actions ---------- */}
        <div className="space-y-2.5 p-5">
          <Button size="lg" className="w-full" onClick={handleAdd} disabled={unavailable}>
            <ShoppingBag />
            {unavailable ? STATUS_LABELS[item.status] : inCart ? "در سبد خرید" : "افزودن به سبد خرید"}
          </Button>

          {inCart ? (
            <Button asChild variant="gold" size="lg" className="w-full">
              <Link href="/checkout">تکمیل خرید</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="w-full">
              <a href="tel:02191009100">
                <Phone />
                مشاوره تلفنی رایگان
              </a>
            </Button>
          )}

          <div className="grid grid-cols-3 gap-2 pt-1">
            <IconAction
              label="علاقه‌مندی"
              active={favorite}
              activeClass="border-danger/40 bg-danger/10 text-danger"
              onClick={() => toggleFavorite(item.id)}
            >
              <Heart className={cn("size-4", favorite && "fill-current")} />
            </IconAction>
            <IconAction
              label="مقایسه"
              active={compared}
              activeClass="border-primary/40 bg-primary-tint text-primary"
              onClick={() => toggleCompare(item.id)}
            >
              <GitCompareArrows className="size-4" />
            </IconAction>
            <IconAction label={copied ? "کپی شد" : "اشتراک"} onClick={share}>
              {copied ? <Check className="size-4 text-success" /> : <Link2 className="size-4" />}
            </IconAction>
          </div>
        </div>

        {/* ---------- assurances ---------- */}
        <ul className="divide-y divide-border border-t border-border">
          {[
            { icon: ShieldCheck, text: "پرداخت امانی — پول تا تأیید انتقال آزاد نمی‌شود" },
            { icon: BadgeCheck, text: "استعلام بدهی و مالکیت پیش از انتشار" },
            { icon: Truck, text: "ارسال سیم‌کارت با پیک ویژه در سراسر کشور" },
          ].map((row) => (
            <li key={row.text} className="flex items-start gap-3 px-5 py-3.5">
              <row.icon className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-[0.75rem] leading-relaxed text-muted">{row.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IconAction({
  label,
  children,
  onClick,
  active,
  activeClass,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border border-border py-2.5 text-[0.625rem] text-muted transition-colors hover:border-primary/35 hover:text-foreground",
        active && activeClass,
      )}
    >
      {children}
      {label}
    </button>
  );
}
