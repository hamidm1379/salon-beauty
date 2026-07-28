import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { OrganizationSchema } from "@/components/shared/JsonLd";

const Navbar = dynamic(() => import("@/components/layout/Header").then((m) => m.Navbar), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/layout/Footer").then((m) => m.Footer), {
  ssr: true,
});

export const metadata: Metadata = {
  title: {
    default: "Beauty Salon",
    template: "%s | Beauty Salon",
  },
  description: "بهترین سالن زیبایی با خدمات تخصصی پوست، مو، ناخن و میکاپ",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizationSchema />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
