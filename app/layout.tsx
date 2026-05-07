import type { Metadata, Viewport } from "next";
import { Inter, Vollkorn } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://aglayanogina.com";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${vollkorn.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:bg-paper focus-visible:px-4 focus-visible:py-2 focus-visible:label-caps focus-visible:border focus-visible:border-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
