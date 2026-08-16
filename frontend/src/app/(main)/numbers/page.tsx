import { ActiveFilterChips, FiltersPanel } from "@/components/numbers/filters-panel";
import { ResultsGrid, ResultsToolbar } from "@/components/numbers/results";
import { Pagination } from "@/components/ui/pagination";
import { countByOperator, countByRondType, queryNumbers } from "@/lib/data/numbers";
import { ROND_LABELS } from "@/lib/data/site";
import { parseFilters, parsePage, serializeFilters, type RawSearchParams } from "@/lib/filters";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const PER_PAGE = 18;

export async function generateMetadata({
  searchParams,
}: PageProps<"/numbers">): Promise<Metadata> {
  const filters = parseFilters((await searchParams) as RawSearchParams);
  const parts: string[] = [];
  if (filters.rondTypes.length) parts.push(ROND_LABELS[filters.rondTypes[0]]);
  if (filters.q) parts.push(filters.q);
  const title = parts.length ? `شماره رند ${parts.join(" ")}` : "خرید شماره رند";
  return {
    title,
    description: "جستجوی پیشرفته میان هزاران شماره رند اصالت‌سنجی‌شده همراه اول، ایرانسل و رایتل.",
  };
}

export default async function NumbersPage({ searchParams }: PageProps<"/numbers">) {
  const params = (await searchParams) as RawSearchParams;
  const filters = parseFilters(params);
  const page = parsePage(params);

  const all = queryNumbers(filters);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const items = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const counts = { rond: countByRondType(), operator: countByOperator() };

  const hrefFor = (p: number) => {
    const qs = serializeFilters(filters, p);
    return qs ? `/numbers?${qs}` : "/numbers";
  };

  return (
    <div className="container-page py-8">
      {/* breadcrumb */}
      <nav aria-label="مسیر" className="mb-5 flex items-center gap-1.5 text-xs text-subtle">
        <Link href="/" className="hover:text-primary">
          خانه
        </Link>
        <ChevronLeft className="size-3.5" />
        <span className="text-foreground">شماره‌ها</span>
      </nav>

      <header className="mb-7">
        <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          {filters.rondTypes.length === 1
            ? `شماره‌های ${ROND_LABELS[filters.rondTypes[0]]}`
            : "همه شماره‌های رند"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          با فیلترهای دقیق روی الگوی رند، اپراتور، بازه قیمت و امتیاز رندی، شماره دلخواهتان را پیدا
          کنید. همه شماره‌ها پیش از انتشار اصالت‌سنجی شده‌اند.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[17.5rem_1fr] lg:gap-8">
        <FiltersPanel filters={filters} counts={counts} total={all.length} />

        <div className="min-w-0">
          <div className="mb-5 space-y-4">
            <ResultsToolbar filters={filters} total={all.length} shown={items.length} />
            <ActiveFilterChips filters={filters} />
          </div>

          <ResultsGrid items={items} />

          <Pagination page={current} totalPages={totalPages} hrefFor={hrefFor} className="mt-10" />
        </div>
      </div>
    </div>
  );
}
