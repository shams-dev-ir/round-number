import { NumberCardMini } from "@/components/numbers/number-card";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { PurchasePanel } from "@/components/numbers/purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/disclosure";
import { Aurora, ScoreMeter, Stars } from "@/components/ui/misc";
import { getNumber, getSimilar, NUMBERS } from "@/lib/data/numbers";
import { FAQS, OPERATOR_MAP, ROND_LABELS, SIM_TYPE_LABELS, STATUS_LABELS } from "@/lib/data/site";
import { analyzeNumber, formatJalali, formatToman, initials, timeAgo, VIP_SCORE } from "@/lib/utils";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  Crown,
  Eye,
  Heart,
  MapPin,
  Sparkles,
  Store,
  Tag,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/** Numbers outside the prerendered set render on demand instead of 404ing. */
export const dynamicParams = true;

/**
 * Only the numbers that actually draw traffic are prerendered. Building a page
 * for every listing does not scale: each one emits ~400 KB of html/rsc/segment
 * files, so the real catalogue of tens of thousands of numbers would produce a
 * multi-gigabyte build artifact to ship on every deploy. The long tail is
 * server-rendered on first request instead.
 */
const PRERENDER_COUNT = 60;

export function generateStaticParams() {
  return [...NUMBERS]
    .sort((a, b) => b.score - a.score || b.views - a.views)
    .slice(0, PRERENDER_COUNT)
    .map((n) => ({ id: n.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/numbers/[id]">): Promise<Metadata> {
  const item = getNumber((await params).id);
  if (!item) return { title: "شماره یافت نشد" };
  const op = OPERATOR_MAP[item.operator];
  return {
    title: `خرید شماره رند ${item.msisdn} — ${op.name}`,
    description: `${item.msisdn} | ${item.rondTypes.map((t) => ROND_LABELS[t]).join("، ")} | سیم‌کارت ${
      SIM_TYPE_LABELS[item.simType]
    } ${op.name} — ${formatToman(item.price)} تومان`,
  };
}

export default async function NumberDetailPage({ params }: PageProps<"/numbers/[id]">) {
  const item = getNumber((await params).id);
  if (!item) notFound();

  const { reasons } = analyzeNumber(item.msisdn);
  const similar = getSimilar(item, 6);
  const op = OPERATOR_MAP[item.operator];

  const specs = [
    { label: "اپراتور", value: op.name },
    { label: "پیش‌شماره", value: item.msisdn.slice(0, 4), ltr: true },
    { label: "نوع سیم‌کارت", value: SIM_TYPE_LABELS[item.simType] },
    { label: "وضعیت", value: STATUS_LABELS[item.status] },
    { label: "امتیاز رندی", value: `${item.score} از ۱۰۰` },
    { label: "شهر فروشنده", value: item.city },
    { label: "تاریخ ثبت", value: formatJalali(item.createdAt) },
    { label: "شناسه آگهی", value: `RX-${item.msisdn.slice(-6)}`, ltr: true },
  ];

  return (
    <div className="pb-6">
      {/* ================= hero ================= */}
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-70" />
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative container-page py-8">
          <nav aria-label="مسیر" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
            <Link href="/" className="hover:text-primary">
              خانه
            </Link>
            <ChevronLeft className="size-3.5" />
            <Link href="/numbers" className="hover:text-primary">
              شماره‌ها
            </Link>
            <ChevronLeft className="size-3.5" />
            <Link href={`/numbers?operator=${item.operator}`} className="hover:text-primary">
              {op.name}
            </Link>
            <ChevronLeft className="size-3.5" />
            <span dir="ltr" className="text-foreground tabular-nums">
              {item.msisdn}
            </span>
          </nav>

          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <OperatorChip operator={item.operator} size="md" />
                <Badge tone={item.simType === "permanent" ? "info" : "neutral"}>
                  سیم‌کارت {SIM_TYPE_LABELS[item.simType]}
                </Badge>
                {item.vip ? (
                  <Badge tone="gold">
                    <Crown className="size-3.5" />
                    شماره VIP
                  </Badge>
                ) : null}
              </div>

              <NumberPlate msisdn={item.msisdn} size="xl" />

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {item.city}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Eye className="size-3.5" />
                  {formatToman(item.views)} بازدید
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Heart className="size-3.5" />
                  {item.favorites} علاقه‌مندی
                </span>
                <span>{timeAgo(item.createdAt)}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-sm">
              <ScoreMeter score={item.score} size="lg" />
              <div>
                <p className="text-sm font-bold text-foreground">امتیاز رندی</p>
                <p className="mt-0.5 max-w-40 text-[0.6875rem] leading-relaxed text-muted">
                  {item.score >= VIP_SCORE
                    ? "در دسته کم‌یاب‌ترین شماره‌های بازار"
                    : item.score >= 56
                      ? "رند خوش‌آهنگ با تقاضای بالا"
                      : "رند اقتصادی و مقرون‌به‌صرفه"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= body ================= */}
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_21rem] lg:gap-10">
        <div className="min-w-0 space-y-8">
          {/* ---- why it's rond ---- */}
          <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <Sparkles className="size-4.5 text-price" />
              چرا این شماره رند است؟
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              ارقام طلایی روی پلاک، همان بخشی هستند که الگوی رند را می‌سازند.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.rondTypes.map((t) => (
                <Link
                  key={t}
                  href={`/numbers?rond=${t}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-tint px-3 py-1.5 text-xs font-medium text-accent-fg transition-colors hover:border-accent hover:bg-accent/15 dark:text-accent"
                >
                  <Tag className="size-3" />
                  {ROND_LABELS[t]}
                </Link>
              ))}
            </div>

            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {reasons.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-canvas-2/60 p-3 text-[0.8125rem] text-muted"
                >
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* ---- description ---- */}
          <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-foreground">توضیحات آگهی</h2>
            <p className="mt-3 text-[0.9375rem] leading-[2] text-muted">{item.description}</p>
          </section>

          {/* ---- specs ---- */}
          <section className="hairline overflow-hidden rounded-2xl border border-border bg-surface">
            <h2 className="border-b border-border px-5 py-4 font-display text-lg font-bold text-foreground sm:px-6">
              مشخصات
            </h2>
            <dl
              className="grid sm:grid-cols-2
                [&>div]:border-b [&>div]:border-border
                [&>div:last-child]:border-b-0
                sm:[&>div:nth-child(odd)]:border-e
                sm:[&>div:nth-last-child(-n+2)]:border-b-0"
            >
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6"
                >
                  <dt className="text-[0.8125rem] text-muted">{spec.label}</dt>
                  <dd
                    dir={spec.ltr ? "ltr" : undefined}
                    className="text-[0.8125rem] font-semibold text-foreground tabular-nums"
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ---- seller ---- */}
          <section className="hairline rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-5 font-display text-lg font-bold text-foreground">فروشنده</h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-tint font-display text-lg font-bold text-primary">
                {initials(item.seller.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{item.seller.name}</p>
                  {item.seller.verified ? (
                    <Badge tone="success" size="xs">
                      <BadgeCheck className="size-3" />
                      اصالت‌سنجی شده
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Stars rating={item.seller.rating} />
                    <span className="tabular-nums">{item.seller.rating}</span>
                  </span>
                  <span className="tabular-nums">{item.seller.sales} معامله موفق</span>
                  <span className="inline-flex items-center gap-1">
                    <Store className="size-3.5" />
                    عضو از {formatJalali(item.seller.since).split(" ").slice(-1)}
                  </span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/numbers?city=${encodeURIComponent(item.city)}`}>
                  سایر شماره‌های فروشنده
                  <ArrowLeft />
                </Link>
              </Button>
            </div>
          </section>

          {/* ---- faq ---- */}
          <section>
            <h2 className="mb-4 font-display text-lg font-bold text-foreground">
              پرسش‌های رایج درباره این خرید
            </h2>
            <Accordion
              items={FAQS.filter((f) => ["transfer", "escrow", "installment", "guarantee"].includes(f.id)).map(
                (f) => ({ id: `d-${f.id}`, q: f.q, a: f.a }),
              )}
            />
          </section>
        </div>

        {/* ---- sidebar ---- */}
        <div className="lg:min-w-0">
          <PurchasePanel item={item} />
        </div>
      </div>

      {/* ================= similar ================= */}
      <section className="container-page pt-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">شماره‌های مشابه</h2>
            <p className="mt-1.5 text-sm text-muted">با الگوی رند و بازه قیمت نزدیک به این شماره.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/numbers?rond=${item.rondTypes[0]}`}>
              مشاهده همه
              <ArrowLeft />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((n) => (
            <NumberCardMini key={n.id} item={n} />
          ))}
        </div>
      </section>
    </div>
  );
}
