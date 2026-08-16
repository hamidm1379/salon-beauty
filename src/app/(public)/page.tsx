import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

const Hero = dynamic(() => import("@/components/home/Hero").then((m) => m.Hero), {
  loading: () => <div className="h-screen bg-background" />,
});
const ServicesGrid = dynamic(
  () => import("@/components/home/ServicesGrid").then((m) => m.ServicesGrid),
  { loading: () => <div className="h-96 bg-bg-soft" /> },
);
const WhyChooseUs = dynamic(
  () => import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs),
  { loading: () => <div className="h-96 bg-background" /> },
);
const GallerySlider = dynamic(
  () => import("@/components/home/GallerySlider").then((m) => m.GallerySlider),
  { loading: () => <div className="h-64 bg-bg-soft" /> },
);
const CTABanner = dynamic(
  () => import("@/components/home/CTABanner").then((m) => m.CTABanner),
);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "خانه",
    description: settings.seoDescription || "بهترین سالن زیبایی با خدمات تخصصی پوست، مو، ناخن و میکاپ در تهران",
    path: "",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

async function getSettings() {
  const settings = await prisma.settings.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  return map;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  });
  return categories;
}

export default async function Home() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <>
      <Hero
        bannerUrl={settings.bannerUrl || ""}
        bannerText={settings.bannerText || ""}
        bannerTextSecondary={settings.bannerTextSecondary || ""}
      />
      <ServicesGrid categories={categories} />
      <WhyChooseUs />
      <GallerySlider />
      <CTABanner />
    </>
  );
}
