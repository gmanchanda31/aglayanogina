import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionRuntime } from "@/components/motion/motion-runtime";
import { PageTransition } from "@/components/motion/page-transition";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Arimo: metric-compatible with Arial (Aglaya's old site), open licence,
// renders the same on every platform. The site's one and only font.
const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aglaya Nogina — Visual Artist",
    template: "%s — Aglaya Nogina",
  },
  description:
    "Portfolio of Aglaya Nogina, Ukrainian visual artist working in xerography, relief printing, painting, photography, ceramics, and writing. Based in Düsseldorf.",
  authors: [{ name: "Aglaya Nogina" }],
  creator: "Aglaya Nogina",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Aglaya Nogina",
    title: "Aglaya Nogina — Visual Artist",
    description:
      "Xerography, relief printing, painting, photography, ceramics, writing. Luhansk → Kyiv → Düsseldorf.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aglaya Nogina — Visual Artist",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

/**
 * Arms the home hero's first-load entrance before first paint. No JS,
 * reduced motion or an automated browser leaves it off, so the hero is
 * simply static. Disarmed after a few seconds so soft navigations back to
 * `/` rely on the page crossfade instead of replaying it.
 */
const ENTRANCE_SCRIPT = `(function(){try{var d=document.documentElement;if(navigator.webdriver||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-entrance","on");setTimeout(function(){d.removeAttribute("data-entrance")},2500)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={arimo.variable}
      // Next turns off smooth scrolling during route changes when this is set,
      // so navigation lands at the top instead of gliding there
      data-scroll-behavior="smooth"
      // ENTRANCE_SCRIPT adds data-entrance before hydration
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ENTRANCE_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:bg-paper focus-visible:px-4 focus-visible:py-2 focus-visible:type-ui focus-visible:border focus-visible:border-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <MotionRuntime />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
