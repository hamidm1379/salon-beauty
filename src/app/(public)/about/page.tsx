import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { AboutContent } from "./AboutContent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "درباره ما",
    description: "با تیم حرفه‌ای و تجربه چندین ساله سالن زیبایی آشنا شوید",
    path: "/about",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

export default async function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "درباره ما", url: "https://beautysalon.com/about" },
        ]}
      />
      <AboutContent />
    </>
  );
}
