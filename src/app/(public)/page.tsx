import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

const Hero = dynamic(() => import("@/components/home/Hero").then((m) => m.Hero), {
  loading: () => <div className="h-screen bg-background" />,
});
const ServicesGrid = dynamic(
  () => import("@/components/home/ServicesGrid").then((m) => m.ServicesGrid),
  { loading: () => <div className="h-96 bg-bg-soft" /> },
);
const WhyChooseUs = dynamic(
  () => import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs),
  { loading: () => <div className="h-96 bg-background" /> },
);
const GallerySlider = dynamic(
  () => import("@/components/home/GallerySlider").then((m) => m.GallerySlider),
  { loading: () => <div className="h-64 bg-bg-soft" /> },
);
const CTABanner = dynamic(
  () => import("@/components/home/CTABanner").then((m) => m.CTABanner),
);

export const metadata: Metadata = generateSEOMetadata({
  title: "خانه",
  description: "بهترین سالن زیبایی با خدمات تخصصی پوست، مو، ناخن و میکاپ در تهران",
  path: "",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <WhyChooseUs />
      <GallerySlider />
      <CTABanner />
    </>
  );
}
