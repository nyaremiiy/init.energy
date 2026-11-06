import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/header/header";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "init.energy",
  description: "init.energy",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${montserrat.className} h-full`}>
      <body className="relative min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
