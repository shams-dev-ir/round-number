import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, ScoreMeter } from "@/components/ui/misc";
import { StatCard } from "@/components/ui/stat-card";
import { LISTING_STATUS_LABELS, LISTING_STATUS_TONE, MY_LISTINGS } from "@/lib/data/account";
import { formatJalali, formatToman } from "@/lib/utils";
import { ArrowLeft, Eye, MessageSquare, Pencil, Plus, Store, Trash2, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "آگهی‌های فروش" };

export default function ListingsPage() {
  const totalViews = MY_LISTINGS.reduce((s, l) => s + l.views, 0);
  const totalInquiries = MY_LISTINGS.reduce((s, l) => s + l.inquiries, 0);
  const published = MY_LISTINGS.filter((l) => l.status === "published").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
            آگهی‌های فروش من
          </h1>
          <p className="mt-2 text-sm text-muted">
            وضعیت کارشناسی، بازدید و استعلام‌های هر آگهی را اینجا پیگیری کنید.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/sell">
            <Plus />
            ثبت آگهی جدید
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="آگهی فعال" value={published} icon={Store} tone="brand" />
        <StatCard label="مجموع بازدید" value={formatToman(totalViews)} icon={Eye} tone="info" delta={12} />
        <StatCard
          label="استعلام خریداران"
          value={totalInquiries}
          icon={MessageSquare}
          tone="success"
          delta={4}
        />
      </div>

      {MY_LISTINGS.length === 0 ? (
        <EmptyState
          icon={<Store />}
          title="هنوز آگهی ثبت نکرده‌اید"
          description="شماره‌تان را ثبت کنید تا کارشناسان ما قیمت پیشنهادی را اعلام کنند."
          action={
            <Button asChild>
              <Link href="/sell">
                ثبت آگهی فروش
                <ArrowLeft />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {MY_LISTINGS.map((listing) => (
            <article
              key={listing.id}
              className="hairline flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <Link href={`/numbers/${listing.number.slug}`} className="shrink-0">
                <NumberPlate msisdn={listing.number.msisdn} size="sm" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <OperatorChip operator={listing.number.operator} />
                  <Badge tone={LISTING_STATUS_TONE[listing.status]} size="xs">
                    {LISTING_STATUS_LABELS[listing.status]}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] text-subtle">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Eye className="size-3" />
                    {formatToman(listing.views)} بازدید
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <MessageSquare className="size-3" />
                    {listing.inquiries} استعلام
                  </span>
                  <span>ثبت: {formatJalali(listing.createdAt)}</span>
                </div>
              </div>

              <div className="shrink-0">
                <ScoreMeter score={listing.number.score} size="sm" />
              </div>

              <div className="shrink-0 text-end">
                <p className="font-num text-base font-extrabold text-price tabular-nums">
                  {formatToman(listing.askingPrice)}
                </p>
                <p className="text-[0.625rem] text-muted">تومان</p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <Button variant="outline" size="icon-sm" aria-label="ویرایش آگهی" title="ویرایش">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" aria-label="گزارش بازدید" title="گزارش">
                  <TrendingUp className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="حذف آگهی"
                  title="حذف"
                  className="text-danger hover:border-danger/40 hover:bg-danger/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
