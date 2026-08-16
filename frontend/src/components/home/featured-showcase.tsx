"use client";

import { NumberCard } from "@/components/numbers/number-card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/disclosure";
import { SectionHeading } from "@/components/ui/misc";
import type { PhoneNumber } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Group = { value: string; label: string; items: PhoneNumber[]; href: string };

export function FeaturedShowcase({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(groups[0]?.value ?? "");
  const current = groups.find((g) => g.value === active) ?? groups[0];

  return (
    <section className="container-page py-18">
      <SectionHeading
        eyebrow="بازار"
        title="شماره‌های منتخب روندیکس"
        description="گلچینی از رندترین، تازه‌ترین و مقرون‌به‌صرفه‌ترین شماره‌های فعال بازار."
        action={
          <Button asChild variant="outline">
            <Link href={current?.href ?? "/numbers"}>
              مشاهده همه
              <ArrowLeft />
            </Link>
          </Button>
        }
      />

      <Tabs
        className="mt-8"
        value={active}
        onChange={setActive}
        tabs={groups.map((g) => ({ value: g.value, label: g.label, count: g.items.length }))}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {current?.items.map((item, i) => (
          <NumberCard
            key={item.id}
            item={item}
            className="animate-count-in"
            style={{ animationDelay: `${i * 45}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
