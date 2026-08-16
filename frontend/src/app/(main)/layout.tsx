import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CompareBar } from "@/components/numbers/compare-bar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-fg"
      >
        رفتن به محتوای اصلی
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}
