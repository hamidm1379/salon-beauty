import type { Metadata } from "next";
import { Container, Heading } from "@/components/ui/Layout";
import { BookingForm } from "@/components/appointment/BookingForm";
import { BreadcrumbSchema } from "@/components/shared/JsonLd";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEOMetadata({
    title: "رزرو نوبت",
    description: "نوبت خود را به صورت آنلاین رزرو کنید - " + settings.salonName,
    path: "/appointment",
    site: { siteName: settings.salonName, siteDescription: settings.seoDescription, seoOgImage: settings.seoOgImage },
  });
}

export default async function AppointmentPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "خانه", url: "https://beautysalon.com" },
          { name: "رزرو نوبت", url: "https://beautysalon.com/appointment" },
        ]}
      />
      <Container className="py-24">
        <div className="text-center mb-12">
          <Heading level={1}>رزرو نوبت</Heading>
          <p className="text-[var(--color-ink-muted)] mt-4 max-w-2xl mx-auto">
            سرویس مورد نظر خود را انتخاب کنید و به راحتی نوبت بگیرید
          </p>
        </div>

        <BookingForm />
      </Container>
    </>
  );
}
