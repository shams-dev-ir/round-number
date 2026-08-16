"use client";

import { ButtonPager } from "@/components/admin/button-pager";
import { AdminPanel, RowActions, Table, TableScroll, Td, Th, THead, Tr } from "@/components/admin/table";
import { NumberPlate } from "@/components/numbers/number-plate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/disclosure";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { StatCard } from "@/components/ui/stat-card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_LABELS } from "@/lib/data/account";
import { ADMIN_ORDERS } from "@/lib/data/admin";
import type { Order } from "@/lib/types";
import { formatJalali, formatToman, formatTomanCompact, timeAgo } from "@/lib/utils";
import {
  Banknote,
  CircleDashed,
  Download,
  Eye,
  FileText,
  Search,
  SearchX,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 10;
const STATUSES: (Order["status"] | "all")[] = [
  "all",
  "pending",
  "paid",
  "processing",
  "transferred",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<Order["status"] | "all">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ADMIN_ORDERS.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!query) return true;
      return (
        o.code.toLowerCase().includes(query) ||
        o.buyer.includes(q.trim()) ||
        o.items.some((i) => i.msisdn.includes(query.replace(/\D/g, "")))
      );
    });
  }, [tab, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const revenue = ADMIN_ORDERS.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const inProgress = ADMIN_ORDERS.filter((o) => o.status === "processing" || o.status === "paid").length;
  const delivered = ADMIN_ORDERS.filter((o) => o.status === "transferred").length;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">سفارش‌ها</h1>
          <p className="mt-1.5 text-sm text-muted">
            پیگیری پرداخت، انتقال سند و تحویل هر سفارش.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("خروجی گزارش آماده شد")}>
          <Download />
          خروجی گزارش
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل سفارش‌ها" value={ADMIN_ORDERS.length} icon={ShoppingBag} tone="brand" />
        <StatCard
          label="گردش مالی"
          value={formatTomanCompact(revenue)}
          unit="تومان"
          icon={Banknote}
          tone="gold"
          delta={11}
        />
        <StatCard label="در جریان" value={inProgress} icon={CircleDashed} tone="info" />
        <StatCard label="تحویل شده" value={delivered} icon={Truck} tone="success" />
      </div>

      <AdminPanel title="فهرست سفارش‌ها" hint={`${filtered.length} نتیجه`} flush>
        <Tabs
          className="px-5"
          value={tab}
          onChange={(v) => {
            setTab(v as Order["status"] | "all");
            setPage(1);
          }}
          tabs={STATUSES.map((s) => ({
            value: s,
            label: s === "all" ? "همه" : ORDER_STATUS_LABELS[s],
            count:
              s === "all"
                ? ADMIN_ORDERS.length
                : ADMIN_ORDERS.filter((o) => o.status === s).length,
          }))}
        />

        <div className="border-b border-border bg-canvas-2/40 px-5 py-3.5">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            icon={<Search />}
            placeholder="کد سفارش، نام خریدار یا شماره…"
            aria-label="جستجوی سفارش"
            className="h-10 w-full sm:w-80"
          />
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<SearchX />} title="سفارشی یافت نشد" description="جستجو یا فیلتر را تغییر دهید." />
          </div>
        ) : (
          <>
            <TableScroll>
              <Table className="min-w-4xl">
                <THead>
                  <tr>
                    <Th>کد سفارش</Th>
                    <Th>خریدار</Th>
                    <Th>شماره‌ها</Th>
                    <Th>مبلغ</Th>
                    <Th>پرداخت</Th>
                    <Th>وضعیت</Th>
                    <Th>تاریخ</Th>
                    <Th className="text-end">اقدام</Th>
                  </tr>
                </THead>
                <tbody>
                  {rows.map((order) => (
                    <Tr key={order.id}>
                      <Td>
                        <span dir="ltr" className="font-semibold tabular-nums">
                          {order.code}
                        </span>
                      </Td>
                      <Td className="whitespace-nowrap">{order.buyer}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((line) => (
                            <NumberPlate key={line.id} msisdn={line.msisdn} size="xs" variant="bare" />
                          ))}
                        </div>
                      </Td>
                      <Td className="font-semibold whitespace-nowrap tabular-nums">
                        {formatToman(order.total)}
                      </Td>
                      <Td className="whitespace-nowrap text-muted">{PAYMENT_LABELS[order.paymentMethod]}</Td>
                      <Td>
                        <Badge tone={ORDER_STATUS_TONE[order.status]} size="xs">
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </Td>
                      <Td className="whitespace-nowrap">
                        <span className="text-[0.75rem] text-foreground">{formatJalali(order.createdAt)}</span>
                        <span className="mt-0.5 block text-[0.625rem] text-subtle">
                          {timeAgo(order.createdAt)}
                        </span>
                      </Td>
                      <Td>
                        <RowActions>
                          <Button size="icon-sm" variant="secondary" aria-label="مشاهده سفارش" title="مشاهده">
                            <Eye className="size-4" />
                          </Button>
                          <Button size="icon-sm" variant="secondary" aria-label="فاکتور" title="فاکتور">
                            <FileText className="size-4" />
                          </Button>
                        </RowActions>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableScroll>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
              <p className="text-xs text-muted tabular-nums">
                نمایش {(current - 1) * PER_PAGE + 1} تا {Math.min(current * PER_PAGE, filtered.length)} از{" "}
                {filtered.length}
              </p>
              <ButtonPager page={current} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </AdminPanel>
    </div>
  );
}
