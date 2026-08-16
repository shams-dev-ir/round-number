"use client";

import { ButtonPager } from "@/components/admin/button-pager";
import { AdminPanel, RowActions, Table, TableScroll, Td, Th, THead, Tr } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { StatCard } from "@/components/ui/stat-card";
import {
  ADMIN_USERS,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  USER_STATUS_TONE,
} from "@/lib/data/admin";
import type { AdminUser } from "@/lib/types";
import { formatJalali, formatToman, formatTomanCompact, initials } from "@/lib/utils";
import {
  Ban,
  Download,
  Mail,
  Search,
  SearchX,
  Store,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 12;

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<AdminUser["role"] | "">("");
  const [status, setStatus] = useState<AdminUser["status"] | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim();
    return ADMIN_USERS.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      if (!query) return true;
      return u.name.includes(query) || u.phone.includes(query) || u.email.includes(query.toLowerCase());
    });
  }, [q, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const sellers = ADMIN_USERS.filter((u) => u.role === "seller").length;
  const active = ADMIN_USERS.filter((u) => u.status === "active").length;
  const totalSpent = ADMIN_USERS.reduce((s, u) => s + u.spent, 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">کاربران</h1>
          <p className="mt-1.5 text-sm text-muted">مدیریت خریداران، فروشندگان و سطح دسترسی‌ها.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("خروجی کاربران آماده شد")}>
          <Download />
          خروجی CSV
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل کاربران" value={ADMIN_USERS.length} icon={Users} tone="brand" delta={21} />
        <StatCard label="کاربران فعال" value={active} icon={UserCheck} tone="success" />
        <StatCard label="فروشندگان" value={sellers} icon={Store} tone="gold" />
        <StatCard
          label="مجموع خرید کاربران"
          value={formatTomanCompact(totalSpent)}
          unit="تومان"
          icon={UserRound}
          tone="info"
        />
      </div>

      <AdminPanel title="فهرست کاربران" hint={`${filtered.length} نتیجه`} flush>
        <div className="flex flex-wrap gap-2.5 border-y border-border bg-canvas-2/40 px-5 py-3.5">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            icon={<Search />}
            placeholder="نام، شماره یا ایمیل…"
            aria-label="جستجوی کاربر"
            className="h-10 w-full sm:w-64"
          />
          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as AdminUser["role"] | "");
              setPage(1);
            }}
            aria-label="نقش"
            className="h-10 w-full sm:w-40"
          >
            <option value="">همه نقش‌ها</option>
            {(["customer", "seller", "admin"] as AdminUser["role"][]).map((r) => (
              <option key={r} value={r}>
                {USER_ROLE_LABELS[r]}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as AdminUser["status"] | "");
              setPage(1);
            }}
            aria-label="وضعیت"
            className="h-10 w-full sm:w-44"
          >
            <option value="">همه وضعیت‌ها</option>
            {(["active", "pending", "suspended"] as AdminUser["status"][]).map((s) => (
              <option key={s} value={s}>
                {USER_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<SearchX />} title="کاربری یافت نشد" description="جستجو یا فیلترها را تغییر دهید." />
          </div>
        ) : (
          <>
            <TableScroll>
              <Table className="min-w-4xl">
                <THead>
                  <tr>
                    <Th>کاربر</Th>
                    <Th>تماس</Th>
                    <Th>نقش</Th>
                    <Th>وضعیت</Th>
                    <Th>سفارش‌ها</Th>
                    <Th>مجموع خرید</Th>
                    <Th>عضویت</Th>
                    <Th className="text-end">اقدام</Th>
                  </tr>
                </THead>
                <tbody>
                  {rows.map((u) => (
                    <Tr key={u.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint font-display text-[0.6875rem] font-bold text-primary">
                            {initials(u.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium whitespace-nowrap text-foreground">{u.name}</p>
                            <p dir="ltr" className="mt-0.5 text-[0.625rem] text-subtle tabular-nums">
                              {u.id}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <p dir="ltr" className="whitespace-nowrap tabular-nums">
                          {u.phone}
                        </p>
                        <p dir="ltr" className="mt-0.5 text-[0.625rem] text-subtle">
                          {u.email}
                        </p>
                      </Td>
                      <Td>
                        <Badge tone={u.role === "admin" ? "brand" : u.role === "seller" ? "gold" : "neutral"} size="xs">
                          {USER_ROLE_LABELS[u.role]}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge tone={USER_STATUS_TONE[u.status]} size="xs">
                          {USER_STATUS_LABELS[u.status]}
                        </Badge>
                      </Td>
                      <Td className="tabular-nums">{u.orders}</Td>
                      <Td className="font-semibold whitespace-nowrap tabular-nums">
                        {formatToman(u.spent)}
                      </Td>
                      <Td className="whitespace-nowrap text-[0.75rem] text-muted">
                        {formatJalali(u.joinedAt)}
                      </Td>
                      <Td>
                        <RowActions>
                          <Button size="icon-sm" variant="secondary" aria-label="ارسال پیام" title="پیام">
                            <Mail className="size-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="secondary"
                            aria-label={u.status === "suspended" ? "فعال‌سازی" : "تعلیق"}
                            title={u.status === "suspended" ? "فعال‌سازی" : "تعلیق"}
                            className={u.status === "suspended" ? "text-success" : "text-danger"}
                            onClick={() =>
                              toast.success(
                                u.status === "suspended"
                                  ? `${u.name} فعال شد`
                                  : `${u.name} تعلیق شد`,
                              )
                            }
                          >
                            {u.status === "suspended" ? (
                              <UserCheck className="size-4" />
                            ) : (
                              <Ban className="size-4" />
                            )}
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
