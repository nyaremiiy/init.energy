import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

import { consentHeadScript } from "@/lib/consent/consent";
import { siteUrl } from "@/lib/seo/metadata";

import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  // 400 text · 500 buttons, menu, emphasis · 600 buttons only.
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  // 300 big numbers · 500 labels and values · 600 headings.
  weight: ["300", "500", "600"],
  display: "swap",
  variable: "--font-montserrat",
});

/**
 * Site-wide defaults; every page sets its own title, description, canonical
 * and hreflang via buildMetadata().
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "INIT ENERGY",
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
  // Search Console / Bing Webmaster: set the tokens on the server (.env), no code change.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "rgb(0, 2, 23)",
};

/**
 * One root layout for both locales. Header, footer and the locale live in
 * the (uk) and en layouts; <html lang> is Ukrainian (the main site).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${montserrat.variable} h-full font-sans`}
    >
      <head>
        {/* Consent Mode v2 defaults (all denied) before any tag; see lib/consent. */}
        <script id="consent-default" dangerouslySetInnerHTML={{ __html: consentHeadScript }} />
      </head>
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
