import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/disclosure";
import { Aurora, SectionHeading } from "@/components/ui/misc";
import { FAQS, SITE } from "@/lib/data/site";
import { ArrowLeft, Headset, MessageCircleQuestion, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ پرسش‌های رایج درباره خرید و فروش شماره رند، انتقال سند، پرداخت امانی و ضمانت.",
};

export default function FaqPage() {
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-60" />
        <div className="relative container-page py-14 text-center">
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
            <MessageCircleQuestion className="size-6" />
          </span>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            سوالات متداول
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-[1.95] text-muted">
            هر چیزی که پیش از خرید یا فروش شماره رند باید بدانید — از فرآیند انتقال سند تا ضمانت
            بازگشت وجه.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <Accordion items={FAQS.map((f) => ({ id: f.id, q: f.q, a: f.a }))} defaultOpen="transfer" />
        </div>
      </section>

      <section className="container-page">
        <div className="hairline relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
          <Aurora className="opacity-50" />
          <div className="relative mx-auto max-w-lg">
            <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent-tint text-accent-fg dark:text-accent">
              <Headset className="size-6" />
            </span>
            <SectionHeading
              align="center"
              title="پاسخ سوالتان را پیدا نکردید؟"
              description="کارشناسان ما هفت روز هفته، از ۹ صبح تا ۹ شب پاسخگوی شما هستند."
            />
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={`tel:${SITE.phone}`}>
                  <Phone />
                  <span dir="ltr" className="tabular-nums">
                    {SITE.phone}
                  </span>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  ارسال پیام
                  <ArrowLeft />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
