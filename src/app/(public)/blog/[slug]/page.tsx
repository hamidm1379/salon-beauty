import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Badge } from "@/components/ui/Badge";
import { blogRepository } from "@/repositories/blog.repository";
import { ArticleSchema, BreadcrumbSchema } from "@/components/shared/JsonLd";
import { BlogPostContent } from "./BlogPostContent";

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
      authors: ["Beauty Salon"],
      siteName: "Beauty Salon",
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

  if (!post) {
    notFound();
  }

  const relatedPosts = await blogRepository.findRelated(post.id, post.blogCategoryId, 3);
  const readTime = estimateReadTime(post.content);
  const coverImage = post.image?.url || post.coverImage;
  const coverAlt = post.image?.alt || post.title;

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.title}
        image={coverImage || undefined}
        datePublished={String(post.publishedAt || post.createdAt)}
        dateModified={String(post.updatedAt)}
        url={`https://beautysalon.com/blog/${post.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "بلاگ", url: "https://beautysalon.com/blog" },
          { name: post.title, url: `https://beautysalon.com/blog/${post.slug}` },
        ]}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl" />

        <Container className="relative">
          <nav className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] mb-8" aria-label="breadcrumb">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">خانه</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">بلاگ</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--color-ink)] truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <Badge variant="default">{post.blogCategory.name}</Badge>
              <span className="text-sm text-[var(--color-ink-muted)]">
                {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-[var(--color-ink-muted)]">|</span>
              <span className="text-sm text-[var(--color-ink-muted)]">
                {readTime} دقیقه مطالعه
              </span>
            </div>

            {/* H1: single per page — the post title */}
            <h1 className="text-3xl lg:text-5xl font-bold leading-[1.4] text-[var(--color-ink)] mb-5">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-2xl mx-auto">
                {post.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Cover Image ─── */}
      {coverImage && (
        <div className="py-6">
          <Container>
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(124,58,237,0.15)]">
              <Image
                src={coverImage}
                alt={coverAlt}
                width={1000}
                height={900}
                sizes="(max-width: 768px) 100vw, 1600px"
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </Container>
        </div>
      )}

      {/* ─── Article Content ─── */}
      <Container className="py-12">
        <article className="max-w-3xl mx-auto">
          {/* Decorative divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--color-primary)]/20 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/40" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--color-primary)]/20 to-transparent" />
          </div>

          {/* Prose content — client interactivity lives in BlogPostContent */}
          <BlogPostContent html={post.content} />

          {/* ─── Tags / Keywords ─── */}
          {(post.primaryKeyword || post.secondaryKeyword) && (
            <div className="mt-10 pt-8 border-t border-[var(--color-ink)]/10">
              <div className="flex flex-wrap gap-2">
                {post.primaryKeyword?.split(",").map((kw) => (
                  <span
                    key={kw.trim()}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/8 text-[var(--color-primary)] border border-[var(--color-primary)]/15"
                  >
                    {kw.trim()}
                  </span>
                ))}
                {post.secondaryKeyword?.split(",").map((kw) => (
                  <span
                    key={kw.trim()}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-gold-accent)]/10 text-[var(--color-gold-accent)] border border-[var(--color-gold-accent)]/15"
                  >
                    {kw.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ─── Share Section ─── */}
          <div className="mt-10 pt-8 border-t border-[var(--color-ink)]/10">
            <p className="text-sm font-medium text-[var(--color-ink)] mb-3">اشتراک‌گذاری مقاله</p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://beautysalon.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
              >
                توییتر
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://beautysalon.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
              >
                لینکدین
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`https://beautysalon.com/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#0088CC]/10 text-[#0088CC] hover:bg-[#0088CC]/20 transition-colors"
              >
                تلگرام
              </a>
            </div>
          </div>

          {/* ─── Related Posts (H2) ─── */}
          {relatedPosts.length > 0 && (
            <section className="mt-16" aria-labelledby="related-heading">
              {/* Gold accent divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--color-gold-accent)]/30 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-accent)]/50" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--color-gold-accent)]/30 to-transparent" />
              </div>

              {/* H2: section heading */}
              <h2
                id="related-heading"
                className="text-2xl lg:text-3xl font-bold text-[var(--color-ink)] text-center mb-8"
              >
                مقالات مرتبط
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => {
                  const relatedCover = related.image?.url || related.coverImage;
                  return (
                    <Link key={related.id} href={`/blog/${related.slug}`}>
                      <div className="group bg-[var(--color-bg)] rounded-3xl overflow-hidden border border-[var(--color-ink)]/5 shadow-[0_8px_30px_-12px_rgba(124,58,237,0.08)] hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.16)] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                        <div className="aspect-video bg-[var(--color-bg-soft)] overflow-hidden">
                          {relatedCover ? (
                            <Image
                              src={relatedCover}
                              alt={related.image?.alt || related.title}
                              width={400}
                              height={225}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : null}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="text-[10px]">{related.blogCategory.name}</Badge>
                            <span className="text-xs text-[var(--color-ink-muted)]">
                              {new Date(related.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                          {/* H3 for related post titles */}
                          <h3 className="font-bold text-[var(--color-ink)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                            {related.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </Container>
    </>
  );
}
