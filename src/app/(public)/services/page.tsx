import type { Metadata } from "next";
import { Container } from "@/components/ui/Layout";
import { prisma } from "@/lib/prisma";
import { ServicesFilter } from "@/components/services/ServicesFilter";
import { ServicesHero } from "@/components/services/ServicesHero";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = generateSEOMetadata({
  title: "خدمات ما",
  description: "لیست تمام خدمات زیبایی شامل پوست، مو، ناخن و میکاپ با بهترین متدهای روز دنیا",
  path: "/services",
});

export default async function ServicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let services: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = [];
  let total = 0;

  try {
    [services, categories, total] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { sortOrder: "asc" },
        take: 9,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.service.count({ where: { isActive: true } }),
    ]);
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

      <section className="py-16 bg-[var(--color-bg-soft)] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl" />
        <Container className="relative">
          <ServicesFilter
            initialServices={{
              items: services.map((s) => ({
                ...s,
                price: s.price,
              })),
              total,
              page: 1,
              limit: 9,
              totalPages: Math.ceil(total / 9),
            }}
            categories={categories}
          />
        </Container>
      </section>
    </>
  );
}
