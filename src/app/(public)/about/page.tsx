import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = generateSEOMetadata({
  title: "درباره ما",
  description: "با تیم حرفه‌ای و تجربه چندین ساله سالن زیبایی آشنا شوید",
  path: "/about",
});

export default function AboutPage() {
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
