import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautysalon.com";
const FALLBACK_SITE_NAME = "Beauty Salon";
const FALLBACK_DESCRIPTION = "بهترین سالن زیبایی با خدمات تخصصی پوست، مو، ناخن و میکاپ";

interface SiteMeta {
  siteName?: string;
  siteDescription?: string;
  logoUrl?: string;
  seoOgImage?: string;
}

interface GenerateMetadataParams {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  site?: SiteMeta;
}

export function generateMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  site = {},
}: GenerateMetadataParams): Metadata {
  const siteName = site.siteName || FALLBACK_SITE_NAME;
  const defaultDesc = site.siteDescription || FALLBACK_DESCRIPTION;
  const desc = description || defaultDesc;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || site.seoOgImage || `${SITE_URL}/og-default.jpg`;

  return {
    title: `${title} | ${siteName}`,
    description: desc,
    keywords: undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description: desc,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "fa_IR",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  phone?: string;
  address?: string;
  site?: SiteMeta;
}

export function generateOrganizationSchema({
  name,
  url = SITE_URL,
  logo,
  phone,
  address,
  site = {},
}: OrganizationSchemaProps = {}) {
  const siteName = name || site.siteName || FALLBACK_SITE_NAME;
  const siteLogo = logo || site.logoUrl || `${SITE_URL}/logo.png`;
  const sitePhone = phone || "+98-21-12345678";
  const siteAddress = address || "تهران، خیابان ولیعصر، پلاک ۱۲۳";

  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteName,
    url,
    logo: siteLogo,
    telephone: sitePhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteAddress,
      addressCountry: "IR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
    sameAs: [
      "https://instagram.com/beautysalon",
      "https://t.me/beautysalon",
    ],
  };
}

interface ServiceSchemaProps {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  duration?: string;
  category?: string;
  site?: SiteMeta;
}

export function generateServiceSchema({
  name,
  description,
  price,
  currency = "IRR",
  duration,
  category,
  site = {},
}: ServiceSchemaProps) {
  const siteName = site.siteName || FALLBACK_SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "BeautySalon",
      name: siteName,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    ...(duration && { duration: `PT${duration}M` }),
    ...(category && { category }),
  };
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  site?: SiteMeta;
}

export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
  site = {},
}: ArticleSchemaProps) {
  const siteName = site.siteName || FALLBACK_SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author || siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: site.logoUrl || `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
