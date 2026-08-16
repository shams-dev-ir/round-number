"use client";

import { NumberCard } from "@/components/numbers/number-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getNumber } from "@/lib/data/numbers";
import { useFavorites } from "@/store/favorites";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function FavoritesPage() {
  const ids = useFavorites((s) => s.ids);
  const clear = useFavorites((s) => s.clear);
  const mounted = useIsHydrated();

  if (!mounted) return <div className="container-page py-16" aria-busy />;

  const items = ids.map((id) => getNumber(id)).filter((n): n is NonNullable<typeof n> => Boolean(n));

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            علاقه‌مندی‌های من
          </h1>
          <p className="mt-2 text-sm text-muted">
            {items.length > 0
              ? `${items.length} شماره ذخیره شده — قیمت‌ها را زیر نظر داشته باشید.`
              : "هنوز شماره‌ای ذخیره نکرده‌اید."}
          </p>
        </div>
        {items.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              toast.success("فهرست علاقه‌مندی‌ها پاک شد");
            }}
            className="text-danger hover:bg-danger/10"
          >
            <Trash2 />
            پاک کردن همه
          </Button>
        ) : null}
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart />}
          title="فهرست علاقه‌مندی‌ها خالی است"
          description="روی نشان قلب هر شماره بزنید تا برای بررسی بعدی ذخیره شود."
          action={
            <Button asChild>
              <Link href="/numbers">
                مرور شماره‌ها
                <ArrowLeft />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <NumberCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
