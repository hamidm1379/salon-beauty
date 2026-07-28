import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { Clock, DollarSign } from "lucide-react";
import { ServiceSchema, BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      select: { name: true, description: true, price: true },
    });

    if (!service) return { title: "سرویس یافت نشد" };

    return generateSEOMetadata({
      title: service.name,
      description: service.description || `${service.name} - قیمت: ${service.price.toLocaleString("fa-IR")} تومان`,
      path: `/services/${slug}`,
    });
  } catch {
    return { title: "سرویس یافت نشد" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch {
    notFound();
  }

  if (!service) notFound();

  return (
    <>
      <ServiceSchema
        name={service.name}
        description={service.description}
        price={service.price}
        currency="IRR"
        duration={String(service.duration)}
        category={service.category.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "خدمات ما", url: "https://beautysalon.com/services" },
          { name: service.name, url: `https://beautysalon.com/services/${slug}` },
        ]}
      />

      <Container className="py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[var(--color-bg-soft)]">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                width={600}
                height={450}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-muted)]">
                بدون تصویر
              </div>
            )}
          </div>

          <div>
            <Badge>{service.category.name}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mt-4 text-[var(--color-ink)]">
              {service.name}
            </h1>

            {service.description && (
              <p className="text-[var(--color-ink-muted)] mt-6 leading-relaxed">
                {service.description}
              </p>
            )}

            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
                <span className="text-2xl font-bold text-[var(--color-primary)]">${service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-ink-muted)]" aria-hidden="true" />
                <span className="text-[var(--color-ink-muted)]">{service.duration} دقیقه</span>
              </div>
            </div>

            <Link href="/appointment" className="mt-8 inline-flex items-center justify-center font-medium transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white hover:opacity-90 shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] px-8 py-3 text-base rounded-2xl w-full sm:w-auto">
              رزرو نوبت
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
