"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreMeter } from "@/components/ui/misc";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { ROND_LABELS, SIM_TYPE_LABELS, STATUS_LABELS } from "@/lib/data/site";
import type { PhoneNumber } from "@/lib/types";
import { cn, discountPercent, formatToman, timeAgo } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useCompare, useFavorites } from "@/store/favorites";
import { BadgeCheck, Crown, Eye, GitCompareArrows, Heart, MapPin, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function NumberCard({
  item,
  layout = "grid",
  className,
  style,
}: {
  item: PhoneNumber;
  layout?: "grid" | "row";
  className?: string;
  style?: React.CSSProperties;
}) {
  const favorite = useFavorites((s) => s.ids.includes(item.id));
  const toggleFavorite = useFavorites((s) => s.toggle);
  const compared = useCompare((s) => s.ids.includes(item.id));
  const toggleCompare = useCompare((s) => s.toggle);
  const inCart = useCart((s) => s.lines.some((l) => l.id === item.id));
  const addToCart = useCart((s) => s.add);

  const off = discountPercent(item.price, item.oldPrice);
  const unavailable = item.status !== "available";

  const handleCart = () => {
    if (unavailable) return;
    if (inCart) {
      toast.info("این شماره از قبل در سبد شماست");
      return;
    }
    addToCart(item);
    toast.success("به سبد خرید اضافه شد", { description: item.msisdn });
  };

  return (
    <article
      style={style}
      className={cn(
        "group hairline relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg",
        layout === "row" && "sm:flex-row sm:items-center",
        unavailable && "opacity-70 grayscale-[35%] hover:translate-y-0",
        className,
      )}
    >
      {/* VIP corner flare */}
      {item.vip ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-14 -end-14 size-28 rotate-45 bg-linear-to-b from-accent/35 to-transparent blur-xl"
        />
      ) : null}

      <div className={cn("flex flex-1 flex-col p-4", layout === "row" && "sm:flex-row sm:items-center sm:gap-6")}>
        {/* ---- header ---- */}
        <div className={cn("mb-3.5 flex items-start justify-between gap-3", layout === "row" && "sm:mb-0 sm:order-2 sm:flex-col sm:items-end")}>
          <div className="flex flex-wrap items-center gap-1.5">
            <OperatorChip operator={item.operator} />
            <Badge tone={item.simType === "permanent" ? "info" : "neutral"} size="xs">
              {SIM_TYPE_LABELS[item.simType]}
            </Badge>
            {item.vip ? (
              <Badge tone="gold" size="xs">
                <Crown className="size-3" />
                VIP
              </Badge>
            ) : null}
            {unavailable ? (
              <Badge tone={item.status === "sold" ? "danger" : "warning"} size="xs">
                {STATUS_LABELS[item.status]}
              </Badge>
            ) : null}
          </div>
          <ScoreMeter score={item.score} size="sm" className={layout === "row" ? "sm:hidden" : undefined} />
        </div>

        {/* ---- the number ---- */}
        <div className={cn("flex flex-col items-center gap-3", layout === "row" && "sm:order-1 sm:flex-1 sm:items-start")}>
          <Link
            href={`/numbers/${item.slug}`}
            className="rounded-2xl transition-transform duration-300 group-hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <NumberPlate msisdn={item.msisdn} size="md" />
          </Link>

          <div className="flex flex-wrap justify-center gap-1.5">
            {item.rondTypes.slice(0, 3).map((t) => (
              <Link
                key={t}
                href={`/numbers?rond=${t}`}
                className="rounded-full border border-border bg-elevated px-2 py-0.5 text-[0.6875rem] text-muted transition-colors hover:border-primary/40 hover:bg-primary-tint hover:text-primary"
              >
                {ROND_LABELS[t]}
              </Link>
            ))}
            {item.rondTypes.length > 3 ? (
              <span className="px-1 py-0.5 text-[0.6875rem] text-subtle">+{item.rondTypes.length - 3}</span>
            ) : null}
          </div>
        </div>

        {/* ---- meta ---- */}
        <div className={cn("mt-4 flex items-center justify-center gap-3 text-[0.6875rem] text-subtle", layout === "row" && "sm:order-3 sm:mt-0")}>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {item.city}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Eye className="size-3" />
            {formatToman(item.views)}
          </span>
          <span>{timeAgo(item.createdAt)}</span>
        </div>
      </div>

      {/* ---- price + actions ---- */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-t border-border bg-canvas-2/60 px-4 py-3",
          layout === "row" && "sm:w-64 sm:shrink-0 sm:flex-col sm:items-stretch sm:border-t-0 sm:border-s",
        )}
      >
        <div className="min-w-0">
          {item.oldPrice ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-subtle line-through tabular-nums">{formatToman(item.oldPrice)}</span>
              {off ? (
                <span className="rounded-md bg-danger/12 px-1.5 py-px text-[0.625rem] font-bold text-danger tabular-nums">
                  {off}%
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-baseline gap-1">
            <span className="font-num text-lg font-extrabold text-price tabular-nums">{formatToman(item.price)}</span>
            <span className="text-[0.6875rem] text-muted">تومان</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            {item.installment ? (
              <span className="inline-flex items-center gap-1 text-[0.625rem] text-success">
                <Wallet className="size-3" />
                اقساطی
              </span>
            ) : null}
            {item.guarantee ? (
              <span className="inline-flex items-center gap-1 text-[0.625rem] text-info">
                <BadgeCheck className="size-3" />
                ضمانت
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleCompare(item.id)}
            aria-label="افزودن به مقایسه"
            aria-pressed={compared}
            title="مقایسه"
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border transition-colors",
              compared
                ? "border-primary/40 bg-primary-tint text-primary"
                : "border-border text-subtle hover:border-primary/35 hover:text-primary",
            )}
          >
            <GitCompareArrows className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            aria-label="افزودن به علاقه‌مندی‌ها"
            aria-pressed={favorite}
            title="علاقه‌مندی"
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border transition-colors",
              favorite
                ? "border-danger/40 bg-danger/10 text-danger"
                : "border-border text-subtle hover:border-danger/35 hover:text-danger",
            )}
          >
            <Heart className={cn("size-4", favorite && "fill-current")} />
          </button>
          <Button
            size="icon-sm"
            variant={inCart ? "secondary" : "primary"}
            onClick={handleCart}
            disabled={unavailable}
            aria-label="افزودن به سبد خرید"
            title={unavailable ? STATUS_LABELS[item.status] : "افزودن به سبد"}
            className={cn(layout === "row" && "sm:hidden")}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>

        {layout === "row" ? (
          <Button
            variant={inCart ? "secondary" : "primary"}
            onClick={handleCart}
            disabled={unavailable}
            className="hidden sm:flex"
          >
            <ShoppingBag />
            {inCart ? "در سبد خرید" : "افزودن به سبد"}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

/** Compact variant for rails, sidebars and "similar numbers" lists. */
export function NumberCardMini({ item }: { item: PhoneNumber }) {
  return (
    <Link
      href={`/numbers/${item.slug}`}
      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
    >
      <div className="min-w-0">
        <NumberPlate msisdn={item.msisdn} size="sm" />
        <div className="mt-2 flex items-center gap-2">
          <OperatorChip operator={item.operator} showName={false} />
          <span className="text-[0.6875rem] text-subtle">{SIM_TYPE_LABELS[item.simType]}</span>
        </div>
      </div>
      <div className="shrink-0 text-end">
        <div className="font-num text-sm font-bold text-price tabular-nums">{formatToman(item.price)}</div>
        <div className="mt-1 text-[0.625rem] text-subtle">تومان</div>
      </div>
    </Link>
  );
}
