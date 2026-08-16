import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "بلاگ",
    description: "مقالات و نکات مفید درباره زیبایی، مراقبت از پوست و مو",
    path: "/blog",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
