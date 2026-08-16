import dynamic from "next/dynamic";
import { getSiteSettings } from "@/lib/site-settings";
import { OrganizationSchema } from "@/components/shared/JsonLd";

const Navbar = dynamic(() => import("@/components/layout/Header").then((m) => m.Navbar), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/layout/Footer").then((m) => m.Footer), {
  ssr: true,
});

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <OrganizationSchema
        site={{ siteName: settings.salonName, logoUrl: settings.logoUrl || undefined }}
        name={settings.salonName}
        phone={settings.salonPhone}
        address={settings.salonAddress}
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
