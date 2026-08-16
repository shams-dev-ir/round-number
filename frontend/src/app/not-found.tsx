import { Logo } from "@/components/layout/logo";
import { NumberPlate } from "@/components/numbers/number-plate";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/misc";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <Aurora />
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <Logo className="mx-auto mb-10" />

        <p className="mb-5 text-sm text-muted">این شماره در بازار ما ثبت نشده است</p>

        {/* 404 rendered as a plate — the site's own visual language */}
        <NumberPlate msisdn="09044040404" size="lg" className="mx-auto" />

        <h1 className="mt-9 font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          صفحه‌ای که دنبالش بودید پیدا نشد
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-[1.95] text-muted">
          ممکن است نشانی را اشتباه وارد کرده باشید، یا این آگهی فروخته شده و از بازار حذف شده باشد.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/numbers">
              <Search />
              جستجو در بازار
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home />
              بازگشت به خانه
            </Link>
          </Button>
        </div>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-subtle transition-colors hover:text-primary"
        >
          شماره خاصی می‌خواهید؟ درخواستتان را ثبت کنید
          <ArrowLeft className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
