import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "تماس با ما",
    description: "با ما در تماس باشید. اطلاعات تماس، آدرس و ساعات کاری " + settings.salonName,
    path: "/contact",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "تماس با ما", url: "https://beautysalon.com/contact" },
        ]}
      />
      {children}
    </>
  );
}
