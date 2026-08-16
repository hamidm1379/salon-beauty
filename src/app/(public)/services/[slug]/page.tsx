import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Flower2, ImageOff, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { ServiceSchema, BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { ServiceComments } from "@/components/services/ServiceComments";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });

    if (!service) return { title: "سرویس یافت نشد" };

    const plainDesc = service.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "";

    return generateSEOMetadata({
      title: service.name,
      description: plainDesc || service.name,
      path: `/services/${slug}`,
      site: {
        siteName: settings.salonName,
        siteDescription: settings.seoDescription,
        seoOgImage: settings.seoOgImage,
      },
    });
  } catch {
    return { title: "سرویس یافت نشد" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const settings = await getSiteSettings();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let otherServices: any[] = [];
  try {
    [service, otherServices] = await Promise.all([
      prisma.service.findUnique({
        where: { slug },
        include: { category: true },
      }),
      prisma.service.findMany({
        where: { isActive: true, slug: { not: slug } },
        include: { category: { select: { name: true } } },
        take: 5,
        orderBy: { sortOrder: "asc" },
      }),
    ]);
  } catch {
    notFound();
  }

  if (!service) notFound();

  const plainDescription = service.description?.replace(/<[^>]*>/g, "") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceWithHtml: any = service;

  const shareUrl = `https://beautysalon.com/services/${slug}`;

  return (
    <>
      <ServiceSchema
        name={service.name}
        description={plainDescription}
        price={service.price}
        currency="IRR"
        duration={String(service.duration)}
        category={service.category.name}
        site={{ siteName: settings.salonName }}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "خدمات ما", url: "https://beautysalon.com/services" },
          { name: service.name, url: shareUrl },
        ]}
      />

      <Container className="pt-24 pb-12 lg:pt-16 lg:pb-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 mt-4">
          {/* ─── Main Content (right in RTL) ─── */}
          <article className="flex-1 min-w-0 order-1">
            {/* Image */}
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-[var(--color-bg-soft)] shadow-sm">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-ink-muted)]">
                  <ImageOff className="w-8 h-8 opacity-50" />
                  <span className="text-sm">بدون تصویر</span>
                </div>
              )}
            </div>

            {/* Title + description */}
            <div className="mt-10">
              <Badge>{service.category.name}</Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold mt-4 leading-[1.25] text-[var(--color-ink)]">
                {service.name}
              </h1>

              {/* Ornamental divider */}
              <div className="flex items-center gap-3 mt-6 mb-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-ink)]/10 to-[var(--color-ink)]/20" />
                <Leaf className="w-3 h-3 text-[var(--color-primary)]/40 -rotate-12" />
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/15">
                  <Flower2 className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <Leaf className="w-3 h-3 text-[var(--color-primary)]/40 rotate-12 scale-x-[-1]" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--color-ink)]/10 to-[var(--color-ink)]/20" />
              </div>

              {serviceWithHtml.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-3">توضیحات</h2>
                  <div
                    className="prose prose-sm max-w-none text-[var(--color-ink-muted)] leading-relaxed
                      [&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto
                      [&_p]:mb-3 [&_h3]:text-[var(--color-ink)] [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                      [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:mb-3 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: serviceWithHtml.description }}
                  />
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-16 lg:mt-24">
              <ServiceComments serviceId={service.id} serviceSlug={slug} />
            </div>
          </article>

          {/* ─── Sidebar (left in RTL) ─── */}
          <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 order-2">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Share */}
              <div className="bg-[var(--color-bg-soft)] rounded-3xl p-6 border border-[var(--color-ink)]/5">
                <h2 className="text-base font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--color-primary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  اشتراک‌گذاری
                </h2>

                <div className="space-y-2.5">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(service.name)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-[#1DA1F2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-sm font-medium text-[#1DA1F2]">توییتر</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-colors"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-[#0A66C2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-sm font-medium text-[#0A66C2]">لینکدین</span>
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(service.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#0088CC]/10 hover:bg-[#0088CC]/20 transition-colors"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-[#0088CC]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-sm font-medium text-[#0088CC]">تلگرام</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(service.name + " " + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-[#25D366]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-sm font-medium text-[#25D366]">واتساپ</span>
                  </a>
                </div>
              </div>

              {/* Other Services */}
              {otherServices.length > 0 && (
                <div className="bg-[var(--color-bg-soft)] rounded-3xl p-6 border border-[var(--color-ink)]/5">
                  <h2 className="text-base font-bold text-[var(--color-ink)] mb-5 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[var(--color-gold-accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    خدمات دیگر
                  </h2>

                  <div className="space-y-4">
                    {otherServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.slug}`}
                        className="group flex gap-3.5 items-start"
                      >
                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-[var(--color-bg)] shrink-0 border border-[var(--color-ink)]/5">
                          {s.image ? (
                            <Image
                              src={s.image}
                              alt={s.name}
                              width={160}
                              height={128}
                              sizes="160px"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/5">
                              <svg
                                className="w-6 h-6 text-[var(--color-primary)]/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[var(--color-ink)] line-clamp-2 leading-relaxed group-hover:text-[var(--color-primary)] transition-colors">
                            {s.name}
                          </h3>
                          <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
                            {s.category.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/services"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--color-ink)]/10 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/5 transition-all"
                  >
                    مشاهده همه خدمات
                    <svg
                      className="w-3.5 h-3.5 rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
