import { Aurora } from "@/components/ui/misc";
import { CalendarClock, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  body: string[];
}

/** Shared shell for the terms and privacy pages: sticky index + prose column. */
export function LegalPage({
  title,
  updatedAt,
  intro,
  sections,
}: {
  title: string;
  updatedAt: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border">
        <Aurora className="opacity-50" />
        <div className="relative container-page py-12">
          <nav aria-label="مسیر" className="mb-5 flex items-center gap-1.5 text-xs text-subtle">
            <Link href="/" className="hover:text-primary">
              خانه
            </Link>
            <ChevronLeft className="size-3.5" />
            <span className="text-foreground">{title}</span>
          </nav>

          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.95] text-muted">{intro}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-muted">
            <CalendarClock className="size-3.5 text-primary" />
            آخرین به‌روزرسانی: <span className="tabular-nums">{updatedAt}</span>
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <nav aria-label="فهرست مطالب" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold text-subtle">فهرست</p>
          <ul className="space-y-1 border-s border-border ps-4">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block py-1 text-[0.8125rem] text-muted transition-colors hover:text-primary"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-xl font-bold text-foreground">{s.title}</h2>
              <div className="mt-4 space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="text-[0.9375rem] leading-[2.05] text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
