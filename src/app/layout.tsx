import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beauty Salon",
  description: "Luxury beauty salon services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-(family-name:--font-vazirmatn)">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
