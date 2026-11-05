import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "init.energy",
  description: "init.energy",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
