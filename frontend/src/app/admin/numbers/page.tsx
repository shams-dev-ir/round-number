"use client";

import { ButtonPager } from "@/components/admin/button-pager";
import { AdminPanel, RowActions, Table, TableScroll, Td, Th, THead, Tr } from "@/components/admin/table";
import { NumberPlate } from "@/components/numbers/number-plate";
import { OperatorChip } from "@/components/numbers/operator-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState, ScoreMeter } from "@/components/ui/misc";
import { StatCard } from "@/components/ui/stat-card";
import { NUMBERS } from "@/lib/data/numbers";
import { OPERATORS, ROND_LABELS, SIM_TYPE_LABELS, STATUS_LABELS } from "@/lib/data/site";
import type { NumberStatus, OperatorId } from "@/lib/types";
import { cn, formatToman, formatTomanCompact, timeAgo, VIP_SCORE } from "@/lib/utils";
import {
  Check,
  Crown,
  Download,
  Hash,
  Pencil,
  Plus,
  SearchX,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 12;

export default function AdminNumbersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<NumberStatus | "">("");
  const [operator, setOperator] = useState<OperatorId | "">("");
  const [vipOnly, setVipOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const digits = q.replace(/\D/g, "");
    return NUMBERS.filter((n) => {
      if (digits && !n.msisdn.includes(digits)) return false;
      if (status && n.status !== status) return false;
      if (operator && n.operator !== operator) return false;
      if (vipOnly && !n.vip) return false;
      return true;
    });
  }, [q, status, operator, vipOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const toggleAll = () =>
    setSelected((prev) =>
      allOnPageSelected
        ? prev.filter((id) => !rows.some((r) => r.id === id))
        : [...new Set([...prev, ...rows.map((r) => r.id)])],
    );

  const resetFilters = () => {
    setQ("");
    setStatus("");
    setOperator("");
    setVipOnly(false);
    setPage(1);
  };

  const totalValue = NUMBERS.reduce((s, n) => s + n.price, 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
            مدیریت شماره‌ها
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {formatToman(NUMBERS.length)} شماره در بازار — ویرایش قیمت، وضعیت و نشان VIP.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("خروجی CSV آماده دانلود شد")}>
            <Download />
            خروجی CSV
          </Button>
          <Button size="sm" onClick={() => toast.info("فرم افزودن شماره در فاز بعد فعال می‌شود")}>
            <Plus />
            افزودن شماره
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل شماره‌ها" value={formatToman(NUMBERS.length)} icon={Hash} tone="brand" />
        <StatCard
          label="موجود برای فروش"
          value={formatToman(NUMBERS.filter((n) => n.status === "available").length)}
          icon={Check}
          tone="success"
        />
        <StatCard
          label="شماره‌های VIP"
          value={NUMBERS.filter((n) => n.vip).length}
          icon={Crown}
          tone="gold"
          hint={`امتیاز ${VIP_SCORE} و بالاتر`}
        />
        <StatCard
          label="ارزش کل موجودی"
          value={formatTomanCompact(totalValue)}
          unit="تومان"
          icon={TrendingUp}
          tone="info"
        />
      </div>

      <AdminPanel
        title="فهرست شماره‌ها"
        hint={`${formatToman(filtered.length)} نتیجه`}
        action={
          selected.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted tabular-nums">{selected.length} انتخاب شده</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`${selected.length} شماره به VIP تغییر یافت`);
                  setSelected([]);
                }}
              >
                <Star />
                علامت VIP
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-danger hover:border-danger/40 hover:bg-danger/10"
                onClick={() => {
                  toast.success(`${selected.length} شماره حذف شد`);
                  setSelected([]);
                }}
              >
                <Trash2 />
                حذف
              </Button>
            </div>
          ) : null
        }
        flush
      >
        {/* ---- filter bar ---- */}
        <div className="flex flex-wrap gap-2.5 border-y border-border bg-canvas-2/40 px-5 py-3.5">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            digitsOnly
            placeholder="جستجوی شماره…"
            aria-label="جستجوی شماره"
            className="h-10 w-full sm:w-52"
          />
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as NumberStatus | "");
              setPage(1);
            }}
            aria-label="وضعیت"
            className="h-10 w-full sm:w-40"
          >
            <option value="">همه وضعیت‌ها</option>
            {(["available", "reserved", "sold"] as NumberStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select
            value={operator}
            onChange={(e) => {
              setOperator(e.target.value as OperatorId | "");
              setPage(1);
            }}
            aria-label="اپراتور"
            className="h-10 w-full sm:w-40"
          >
            <option value="">همه اپراتورها</option>
            {OPERATORS.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </Select>
          <Button
            variant={vipOnly ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              setVipOnly((v) => !v);
              setPage(1);
            }}
            className="h-10"
          >
            <Crown />
            فقط VIP
          </Button>
          {(q || status || operator || vipOnly) && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10">
              پاک کردن فیلترها
            </Button>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<SearchX />}
              title="نتیجه‌ای یافت نشد"
              description="فیلترها را تغییر دهید یا جستجو را پاک کنید."
              action={
                <Button variant="outline" onClick={resetFilters}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <TableScroll>
              <Table className="min-w-5xl">
                <THead>
                  <tr>
                    <Th className="w-10">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleAll}
                        aria-label="انتخاب همه در این صفحه"
                        className="size-4 accent-primary"
                      />
                    </Th>
                    <Th>شماره</Th>
                    <Th>اپراتور</Th>
                    <Th>نوع</Th>
                    <Th>امتیاز</Th>
                    <Th>الگو</Th>
                    <Th>قیمت</Th>
                    <Th>وضعیت</Th>
                    <Th>بازدید</Th>
                    <Th>ثبت</Th>
                    <Th className="text-end">اقدام</Th>
                  </tr>
                </THead>
                <tbody>
                  {rows.map((n) => (
                    <Tr key={n.id} className={cn(selected.includes(n.id) && "bg-primary-tint/40")}>
                      <Td>
                        <input
                          type="checkbox"
                          checked={selected.includes(n.id)}
                          onChange={() =>
                            setSelected((prev) =>
                              prev.includes(n.id) ? prev.filter((x) => x !== n.id) : [...prev, n.id],
                            )
                          }
                          aria-label={`انتخاب ${n.msisdn}`}
                          className="size-4 accent-primary"
                        />
                      </Td>
                      <Td>
                        <Link href={`/numbers/${n.slug}`} className="inline-block">
                          <NumberPlate msisdn={n.msisdn} size="xs" />
                        </Link>
                      </Td>
                      <Td>
                        <OperatorChip operator={n.operator} />
                      </Td>
                      <Td className="text-muted">{SIM_TYPE_LABELS[n.simType]}</Td>
                      <Td>
                        <ScoreMeter score={n.score} size="sm" />
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {n.rondTypes.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-elevated px-1.5 py-0.5 text-[0.625rem] whitespace-nowrap text-muted"
                            >
                              {ROND_LABELS[t]}
                            </span>
                          ))}
                          {n.rondTypes.length > 2 ? (
                            <span className="text-[0.625rem] text-subtle">+{n.rondTypes.length - 2}</span>
                          ) : null}
                        </div>
                      </Td>
                      <Td className="font-semibold whitespace-nowrap tabular-nums">
                        {formatToman(n.price)}
                      </Td>
                      <Td>
                        <Badge
                          tone={
                            n.status === "available" ? "success" : n.status === "reserved" ? "warning" : "danger"
                          }
                          size="xs"
                        >
                          {STATUS_LABELS[n.status]}
                        </Badge>
                      </Td>
                      <Td className="text-muted tabular-nums">{formatToman(n.views)}</Td>
                      <Td className="text-[0.75rem] whitespace-nowrap text-subtle">
                        {timeAgo(n.createdAt)}
                      </Td>
                      <Td>
                        <RowActions>
                          <Button size="icon-sm" variant="secondary" aria-label="ویرایش" title="ویرایش">
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="secondary"
                            aria-label="حذف"
                            title="حذف"
                            className="text-danger"
                            onClick={() => toast.success(`${n.msisdn} حذف شد`)}
                          >
                            <Trash2 className="size-4" />
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
                {formatToman(filtered.length)}
              </p>
              <ButtonPager page={current} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </AdminPanel>
    </div>
  );
}
