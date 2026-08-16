import type { Metadata } from "next";
import { Container } from "@/components/ui/Layout";
import { prisma } from "@/lib/prisma";
import { ServicesFilter } from "@/components/services/ServicesFilter";
import { ServicesHero } from "@/components/services/ServicesHero";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "خدمات ما",
    description: "لیست تمام خدمات زیبایی شامل پوست، مو، ناخن و میکاپ با بهترین متدهای روز دنیا",
    path: "/services",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];

  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    // Database not connected - render with empty data
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "خدمات ما", url: "https://beautysalon.com/services" },
        ]}
      />
      <ServicesHero />

      <section className="sm:py-16 bg-[var(--color-bg-soft)] relative overflow-hidden ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl" />
        <Container className="relative">
          <ServicesFilter
            categories={categories}
            categorySlug={category}
          />
        </Container>
      </section>
    </>
  );
}
