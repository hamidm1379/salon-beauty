import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Badge } from "@/components/ui/Badge";
import { blogRepository } from "@/repositories/blog.repository";
import { ArticleSchema, BreadcrumbSchema } from "@/components/shared/JsonLd";
import { getSiteSettings } from "@/lib/site-settings";
import { BlogPostContent } from "./BlogPostContent";
import { ShareSidebar } from "./ShareSidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogRepository.findBySlug(slug);
  const settings = await getSiteSettings();

  if (!post) {
    return { title: "مقاله یافت نشد" };
  }

  const description = post.excerpt || post.title;
  const image = post.image?.url || post.coverImage || undefined;
  const keywords = [post.blogCategory.name];
  if (post.primaryKeyword) keywords.push(post.primaryKeyword);
  if (post.secondaryKeyword) keywords.push(post.secondaryKeyword);

  return {
    title: post.title,
    description,
    keywords,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://beautysalon.com/blog/${post.slug}`,
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : [],
      publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [settings.salonName],
      siteName: settings.salonName,
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://beautysalon.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await blogRepository.findBySlug(slug);
  const settings = await getSiteSettings();

  if (!post) {
    notFound();
  }

  const relatedPosts = await blogRepository.findRelated(post.id, post.blogCategoryId, 4);
  const readTime = estimateReadTime(post.content);
  const coverImage = post.image?.url || post.coverImage;
  const coverAlt = post.image?.alt || post.title;
  const shareUrl = `https://beautysalon.com/blog/${post.slug}`;

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.title}
        image={coverImage || undefined}
        datePublished={String(post.publishedAt || post.createdAt)}
        dateModified={String(post.updatedAt)}
        url={shareUrl}
        site={{ siteName: settings.salonName, logoUrl: settings.logoUrl || undefined }}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "بلاگ", url: "https://beautysalon.com/blog" },
          { name: post.title, url: shareUrl },
        ]}
      />

      {/* ─── Immersive Hero ─── */}
      <section className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-end overflow-hidden">
        {/* Background image */}
        {coverImage && (
          <div className="absolute inset-0">
            <Image
              src={coverImage}
              alt={coverAlt}
              width={1600}
              height={900}
              priority
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays — bottom heavy for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-ink)]/40 via-transparent to-transparent" />
          </div>
        )}

        {/* Fallback when no cover image */}
        {!coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-ink)]" />
        )}

        {/* Decorative mesh dots */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <Container className="relative z-10 pb-14 pt-0 sm:pt-36 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">خانه</Link>
            <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <Link href="/blog" className="hover:text-white transition-colors">بلاگ</Link>
            <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="text-white/90 truncate max-w-[240px]">{post.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                {post.blogCategory.name}
              </Badge>
              <span className="text-xs sm:text-sm text-white/50">
                {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
              <span className="text-xs sm:text-sm text-white/50 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readTime} دقیقه مطالعه
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.35] text-white mb-5">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-white/65 leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Two-Column Content ─── */}
      <Container className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ─── Main Article (right in RTL) ─── */}
          <article className="flex-1 min-w-0 order-1">
            {/* Decorative divider */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-0.5 bg-[var(--color-primary)] rounded-full" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/40" />
            </div>

            <BlogPostContent html={post.content} />

            {/* ─── Tags ─── */}
            {(post.primaryKeyword || post.secondaryKeyword) && (
              <div className="mt-12 pt-8 border-t border-[var(--color-ink)]/10">
                <div className="flex flex-wrap gap-2">
                  {post.primaryKeyword?.split(",").map((kw) => (
                    <span
                      key={kw.trim()}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/8 text-[var(--color-primary)] border border-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/15 transition-colors cursor-default"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                  {post.secondaryKeyword?.split(",").map((kw) => (
                    <span
                      key={kw.trim()}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--color-gold-accent)]/10 text-[var(--color-gold-accent)] border border-[var(--color-gold-accent)]/15 hover:bg-[var(--color-gold-accent)]/20 transition-colors cursor-default"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* ─── Sidebar (left in RTL) ─── */}
          <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 order-2">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Share Sidebar */}
              <ShareSidebar shareUrl={shareUrl} title={post.title} />

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="bg-[var(--color-bg-soft)] rounded-3xl p-6 border border-[var(--color-ink)]/5">
                  <h2 className="text-base font-bold text-[var(--color-ink)] mb-5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-gold-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    مقالات مرتبط
                  </h2>

                  <div className="space-y-4">
                    {relatedPosts.map((related) => {
                      const relatedCover = related.image?.url || related.coverImage;
                      return (
                        <Link key={related.id} href={`/blog/${related.slug}`} className="group flex gap-3.5 items-start">
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-[var(--color-bg)] shrink-0 border border-[var(--color-ink)]/5">
                            {relatedCover ? (
                              <Image
                                src={relatedCover}
                                alt={related.image?.alt || related.title}
                                width={160}
                                height={128}
                                sizes="160px"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/5">
                                <svg className="w-6 h-6 text-[var(--color-primary)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[var(--color-ink)] line-clamp-2 leading-relaxed group-hover:text-[var(--color-primary)] transition-colors">
                              {related.title}
                            </h3>
                            <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
                              {new Date(related.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href="/blog"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--color-ink)]/10 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/5 transition-all"
                  >
                    مشاهده همه مقالات
                    <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
