import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Footer } from "@/components/layout/footer/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ContactWidget } from "@/components/ui/contact-widget";
import { Header } from "@/components/layout/header/header";
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

export const metadata: Metadata = {
  title: "init.energy",
  description: "init.energy",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${inter.variable} ${montserrat.variable} h-full font-sans`}>
      <body className="relative min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <BackToTop />
        <ContactWidget />
      </body>
    </html>
  );
}
