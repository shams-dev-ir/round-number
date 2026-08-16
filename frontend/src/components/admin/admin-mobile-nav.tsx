"use client";

import { Logo } from "@/components/layout/logo";
import { PanelNav, type PanelNavItem } from "@/components/layout/panel-nav";
import { Sheet } from "@/components/ui/disclosure";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminMobileNav({ items }: { items: PanelNavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, adjusted during render (see Header for the rationale).
  const [navPath, setNavPath] = useState(pathname);
  if (navPath !== pathname) {
    setNavPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="منوی مدیریت"
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-foreground"
      >
        <Menu className="size-5" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} side="end" title="پنل مدیریت">
        <div className="p-4">
          <Logo className="mb-6" />
          <div className="flex flex-col gap-1 lg:flex-col">
            <PanelNav items={items} className="!flex-col !overflow-visible" />
          </div>
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl border-t border-border px-3.5 pt-4 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowUpRight className="size-4.5 text-subtle" />
            بازگشت به سایت
          </Link>
        </div>
      </Sheet>
    </>
  );
}
