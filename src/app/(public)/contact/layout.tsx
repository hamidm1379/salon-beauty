import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";

export const metadata: Metadata = generateSEOMetadata({
  title: "تماس با ما",
  description: "با ما در تماس باشید. اطلاعات تماس، آدرس و ساعات کاری سالن زیبایی",
  path: "/contact",
});

export default function ContactLayout({
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
