"use client";

import { AdminPanel, Table, TableScroll, Td, Th, THead, Tr } from "@/components/admin/table";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, ScoreMeter } from "@/components/ui/misc";
import { StatCard } from "@/components/ui/stat-card";
import { PENDING_LISTINGS } from "@/lib/data/admin";
import { cn, formatToman, formatTomanCompact, timeAgo } from "@/lib/utils";
import { Check, CircleCheckBig, Clock, Gauge, MessageSquare, ScrollText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Decision = "approved" | "rejected";

export default function AdminListingsPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const pending = PENDING_LISTINGS.filter((l) => !decisions[l.id]);
  const approved = Object.values(decisions).filter((d) => d === "approved").length;
  const rejected = Object.values(decisions).filter((d) => d === "rejected").length;

  const decide = (id: string, msisdn: string, decision: Decision) => {
    setDecisions((d) => ({ ...d, [id]: decision }));
    toast.success(decision === "approved" ? `آگهی ${msisdn} تأیید و منتشر شد` : `آگهی ${msisdn} رد شد`);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
          آگهی‌های در انتظار کارشناسی
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          قیمت درخواستی فروشنده را با برآورد موتور قیمت‌گذاری بسنجید و آگهی را تأیید یا رد کنید.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="در انتظار بررسی" value={pending.length} icon={Clock} tone="gold" />
        <StatCard label="تأیید شده در این نشست" value={approved} icon={CircleCheckBig} tone="success" />
        <StatCard label="رد شده در این نشست" value={rejected} icon={X} tone="danger" />
      </div>

      <AdminPanel title="صف بررسی" hint={`${pending.length} آگهی`} flush>
        {pending.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<ScrollText />}
              title="صف بررسی خالی است"
              description="همه آگهی‌های ارسالی بررسی شده‌اند. آگهی‌های تازه به‌صورت خودکار اینجا نمایش داده می‌شوند."
            />
          </div>
        ) : (
          <TableScroll>
            <Table className="min-w-5xl">
              <THead>
                <tr>
                  <Th>شماره</Th>
                  <Th>اپراتور</Th>
                  <Th>فروشنده</Th>
                  <Th>امتیاز رندی</Th>
                  <Th>قیمت درخواستی</Th>
                  <Th>برآورد ما</Th>
                  <Th>اختلاف</Th>
                  <Th>ارسال</Th>
                  <Th className="text-end">تصمیم</Th>
                </tr>
              </THead>
              <tbody>
                {pending.map((row) => {
                  const gap = ((row.askingPrice - row.suggestedPrice) / row.suggestedPrice) * 100;
                  const overpriced = gap > 15;
                  return (
                    <Tr key={row.id}>
                      <Td>
                        <NumberPlate msisdn={row.msisdn} size="xs" />
                      </Td>
                      <Td>
                        <OperatorChip operator={row.operator} />
                      </Td>
                      <Td>
                        <p className="whitespace-nowrap text-foreground">{row.seller}</p>
                        <p className="mt-0.5 text-[0.625rem] text-subtle">{row.city}</p>
                      </Td>
                      <Td>
                        <ScoreMeter score={row.score} size="sm" />
                      </Td>
                      <Td className="font-semibold whitespace-nowrap tabular-nums">
                        {formatToman(row.askingPrice)}
                      </Td>
                      <Td className="whitespace-nowrap text-muted tabular-nums">
                        {formatToman(row.suggestedPrice)}
                      </Td>
                      <Td>
                        <Badge tone={overpriced ? "danger" : gap < -5 ? "success" : "neutral"} size="xs">
                          {gap > 0 ? "+" : ""}
                          {gap.toFixed(0)}%
                        </Badge>
                      </Td>
                      <Td className="whitespace-nowrap text-[0.75rem] text-subtle">
                        {timeAgo(row.submittedAt)}
                      </Td>
                      <Td>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toast.info(`پیام به ${row.seller} ارسال شد`)}
                            aria-label="پیام به فروشنده"
                            title="درخواست اصلاح قیمت"
                          >
                            <MessageSquare className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => decide(row.id, row.msisdn, "approved")}
                          >
                            <Check />
                            تأیید
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn("text-danger hover:border-danger/40 hover:bg-danger/10")}
                            onClick={() => decide(row.id, row.msisdn, "rejected")}
                          >
                            <X />
                            رد
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </AdminPanel>

      <AdminPanel title="راهنمای کارشناسی" hint="معیارهای تأیید آگهی">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Gauge,
              title: "اختلاف قیمت زیر ۱۵٪",
              body: "اگر قیمت درخواستی بیش از ۱۵٪ بالاتر از برآورد باشد، پیش از تأیید اصلاح قیمت را درخواست کنید.",
            },
            {
              icon: Check,
              title: "استعلام اپراتور",
              body: "وضعیت بدهی، مسدودی و مالکیت خط باید در پرونده شماره ثبت شده باشد.",
            },
            {
              icon: MessageSquare,
              title: "کیفیت توضیحات",
              body: "آگهی بدون توضیح یا با اطلاعات تماس در متن، رد و به فروشنده بازگردانده می‌شود.",
            },
            {
              icon: Clock,
              title: "زمان پاسخ",
              body: "هر آگهی باید حداکثر تا ۴ ساعت کاری پس از ارسال بررسی شود.",
            },
          ].map((g) => (
            <li key={g.title} className="flex gap-3.5 rounded-xl border border-border bg-canvas-2/50 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <g.icon className="size-4" />
              </span>
              <div>
                <p className="text-[0.8125rem] font-bold text-foreground">{g.title}</p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted">{g.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.6875rem] text-subtle">
          میانگین ارزش آگهی‌های صف:{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {formatTomanCompact(
              PENDING_LISTINGS.reduce((s, l) => s + l.suggestedPrice, 0) /
                Math.max(1, PENDING_LISTINGS.length),
            )}{" "}
            تومان
          </span>
        </p>
      </AdminPanel>
    </div>
  );
}
