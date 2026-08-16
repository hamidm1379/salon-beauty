import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/Providers";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // مسیر فایل favicon باید مطلق (شروع با /) باشه چون از public سرو می‌شه
  const faviconUrl = settings.seoFavicon
    ? settings.seoFavicon.startsWith("/")
      ? settings.seoFavicon
      : `/${settings.seoFavicon}`
    : "";

  // تشخیص type بر اساس پسوند فایل (چون webp/png/ico نیاز به type دقیق دارن)
  const getIconType = (url: string) => {
    if (url.endsWith(".webp")) return "image/webp";
    if (url.endsWith(".png")) return "image/png";
    if (url.endsWith(".svg")) return "image/svg+xml";
    if (url.endsWith(".ico")) return "image/x-icon";
    if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
    return undefined;
  };

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://beautysalon.com"
    ),
    title: {
      default: settings.salonName,
      template: `%s | ${settings.salonName}`,
    },
    description: settings.seoDescription,
    keywords: settings.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
    ...(faviconUrl && {
      icons: {
        icon: [
          {
            url: faviconUrl,
            type: getIconType(faviconUrl),
          },
        ],
        shortcut: [{ url: faviconUrl }],
        apple: [{ url: faviconUrl }],
      },
    }),
    openGraph: {
      siteName: settings.salonName,
      locale: "fa_IR",
      type: "website",
      ...(settings.seoOgImage && {
        images: [{ url: settings.seoOgImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      ...(settings.seoOgImage && { images: [settings.seoOgImage] }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
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