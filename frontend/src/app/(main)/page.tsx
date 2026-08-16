import { FeaturedShowcase } from "@/components/home/featured-showcase";
import { Hero } from "@/components/home/hero";
import {
  Categories,
  FaqPreview,
  FinalCta,
  HowItWorks,
  OperatorsSection,
  Testimonials,
  TrustStrip,
  ValuationTeaser,
} from "@/components/home/sections";
import {
  countByOperator,
  countByRondType,
  getBudgetPicks,
  getDiscounted,
  getFeatured,
  getLatest,
  NUMBERS,
} from "@/lib/data/numbers";
import { STATS } from "@/lib/data/site";

export default function HomePage() {
  const featured = getFeatured(8);
  const latest = getLatest(8);
  const budget = getBudgetPicks(8);
  const discounted = getDiscounted(8);

  const ticker = NUMBERS.filter((n) => n.status === "sold").slice(0, 12);

  return (
    <>
      <Hero showcase={featured} ticker={ticker} stats={[...STATS]} />
      <TrustStrip />

      <FeaturedShowcase
        groups={[
          { value: "vip", label: "شماره‌های VIP", items: featured, href: "/numbers?vip=1" },
          { value: "new", label: "تازه‌رسیده‌ها", items: latest, href: "/numbers?sort=newest" },
          { value: "budget", label: "زیر ۱۲ میلیون", items: budget, href: "/numbers?max=12000000" },
          { value: "off", label: "تخفیف‌دار", items: discounted, href: "/numbers?sort=price-asc" },
        ]}
      />

      <Categories counts={countByRondType()} />
      <ValuationTeaser />
      <OperatorsSection counts={countByOperator()} />
      <HowItWorks />
      <Testimonials />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
