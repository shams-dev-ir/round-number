import { Providers } from "@/components/providers";
import { SITE } from "@/lib/data/site";
import type { Metadata, Viewport } from "next";
import { Estedad, Sora } from "next/font/google";
import "./globals.css";

/**
 * The whole Persian voice of the site — body copy and headings alike.
 * Estedad is a variable Persian family with real weights from 100–900, so
 * headings get genuine bold cuts instead of synthetic ones.
 */
const estedad = Estedad({
  subsets: ["arabic", "latin"],
  variable: "--font-estedad",
  display: "swap",
  /**
   * Next has no built-in metric overrides for Estedad, so it cannot synthesise
   * a size-adjusted fallback. These are the faces that actually ship with
   * Persian coverage on each platform — naming them keeps the pre-swap render
   * close enough in width to avoid a visible reflow.
   */
  fallback: ["Tahoma", "Noto Sans Arabic", "Segoe UI", "ui-sans-serif", "sans-serif"],
});

/**
 * Reserved for standalone numerics — number plates, prices, counters — where
 * geometric digits carry the premium feel. It has no Arabic glyphs, so it is
 * deliberately never used for Persian text.
 */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["شماره رند", "خرید شماره رند", "شماره رند همراه اول", "شماره رند ایرانسل", "فروش سیم کارت رند"],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaff" },
    { media: "(prefers-color-scheme: dark)", color: "#100f1a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${estedad.variable} ${sora.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
