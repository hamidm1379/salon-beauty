import type { Metadata } from "next";
import { Container } from "@/components/ui/Layout";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "گالری نمونه کارها",
    description: "گالری تصاویر نمونه کارهای تخصصی سالن زیبایی شامل میکاپ، اصلاح مو، رنگ مو، کاشت ناخن و خدمات پوستی با بهترین کیفیت",
    path: "/gallery",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

export default async function GalleryPage() {
  let items: {
    id: string;
    title: string;
    description: string | null;
    image: { id: string; url: string; type: string | null; alt: string | null } | null;
  }[] = [];

  try {
    items = await prisma.gallery.findMany({
      where: { isActive: true },
      include: { image: { select: { id: true, url: true, type: true, alt: true } } },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    // Database not connected - render with empty data
  }

  const settings = await getSiteSettings();

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `گالری نمونه کارهای ${settings.salonName}`,
    description: "گالری تصاویر نمونه کارهای تخصصی سالن زیبایی شامل میکاپ، اصلاح مو، رنگ مو و خدمات پوستی",
    url: "https://beautysalon.com/gallery",
    image: items
      .filter((item) => item.image)
      .map((item) => ({
        "@type": "ImageObject",
        contentUrl: `https://beautysalon.com${item.image!.url}`,
        name: item.title,
        description: item.description || item.title,
      })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "گالری", url: "https://beautysalon.com/gallery" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

      <GalleryHero />

      <section className="py-2 sm:py-16 bg-[var(--color-bg-soft)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl" />

        <Container className="relative">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--color-ink-muted)] text-lg">
                هنوز تصویری اضافه نشده است
              </p>
            </div>
          ) : (
            <GalleryGrid items={items} />
          )}
        </Container>
      </section>
    </>
  );
}
