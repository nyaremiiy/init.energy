import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

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
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
