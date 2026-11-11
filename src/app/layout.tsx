import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

import { consentHeadScript } from "@/lib/consent/consent";
import { siteUrl } from "@/lib/seo/metadata";

import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
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
  themeColor: "#000217",
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
