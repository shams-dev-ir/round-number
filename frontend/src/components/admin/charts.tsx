"use client";

import { OPERATOR_MAP } from "@/lib/data/site";
import type { OperatorId } from "@/lib/types";
import { formatToman, formatTomanCompact } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,

  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* Axes are reversed so the series reads right-to-left like the rest of the UI. */
const axisProps = {
  stroke: "var(--subtle)",
  tick: { fill: "var(--subtle)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

function TooltipCard({
  active,
  payload,
  label,
  money,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string | number }[];
  label?: string;
  money?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-lg">
      {label ? <p className="mb-1.5 text-xs font-bold text-foreground">{label}</p> : null}
      <ul className="space-y-1">
        {payload.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-[0.6875rem]">
            <span className="size-2 shrink-0 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted">{entry.name}:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {money ? `${formatToman(entry.value ?? 0)} تومان` : formatToman(entry.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------- revenue (area) ---- */

export function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number; commission: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="comFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" reversed {...axisProps} />
        <YAxis
          orientation="right"
          tickFormatter={(v: number) => formatTomanCompact(v)}
          width={70}
          {...axisProps}
        />
        <Tooltip content={<TooltipCard money />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="گردش معاملات"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#revFill)"
        />
        <Area
          type="monotone"
          dataKey="commission"
          name="درآمد روندیکس"
          stroke="var(--accent)"
          strokeWidth={2}
          fill="url(#comFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* --------------------------------------------------------- orders (bar) ---- */

export function OrdersChart({ data }: { data: { month: string; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" reversed {...axisProps} />
        <YAxis orientation="right" width={40} {...axisProps} />
        <Tooltip content={<TooltipCard />} cursor={{ fill: "var(--elevated)" }} />
        <Bar dataKey="orders" name="تعداد سفارش" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------ operators (pie) ---- */

const OP_COLORS: Record<OperatorId, string> = {
  mci: "var(--op-mci)",
  irancell: "var(--op-irancell)",
  rightel: "var(--op-rightel)",
  shatel: "var(--op-shatel)",
  aptel: "var(--op-aptel)",
};

export function OperatorDonut({ data }: { data: { id: OperatorId; name: string; value: number }[] }) {
  // Colour comes from a `fill` on each datum rather than <Cell> children:
  // Recharts 3 renders the sector shapes empty when Cells are used here.
  const slices = data.map((d) => ({ ...d, fill: OP_COLORS[d.id] }));

  return (
    <ResponsiveContainer width="100%" height={264}>
      <PieChart>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={94}
          paddingAngle={3}
          stroke="var(--surface)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Tooltip content={<TooltipCard />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "var(--muted)", fontSize: 11, paddingInlineStart: 4 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------- traffic (line) ---- */

export function TrafficChart({
  data,
}: {
  data: { day: string; visitors: number; searches: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" reversed {...axisProps} />
        <YAxis orientation="right" tickFormatter={(v: number) => formatTomanCompact(v)} width={54} {...axisProps} />
        <Tooltip content={<TooltipCard />} cursor={{ stroke: "var(--border)" }} />
        <Line
          type="monotone"
          dataKey="visitors"
          name="بازدیدکننده"
          stroke="var(--info)"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="searches"
          name="جستجو"
          stroke="var(--success)"
          strokeWidth={2.5}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------- helpers ---- */

export function operatorName(id: OperatorId) {
  return OPERATOR_MAP[id].name;
}
