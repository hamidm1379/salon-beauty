import { prisma } from "@/lib/prisma";

export interface SiteSettings {
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  salonMobile: string;
  salonEmail: string;
  workingHours: string;
  logoUrl: string;
  bannerUrl: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;
  seoFavicon: string;
}

const defaults: SiteSettings = {
  salonName: "Beauty Salon",
  salonAddress: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  salonPhone: "021-12345678",
  salonMobile: "0912-123-4567",
  salonEmail: "info@beautysalon.com",
  workingHours: "شنبه تا پنجشنبه ۹ الی ۲۱",
  logoUrl: "",
  bannerUrl: "",
  footerDescription: "ما در سالن زیبایی، با ارائه خدمات متنوع و باکیفیت، زیبایی طبیعی شما را به بهترین شکل ممکن نمایان می‌کنیم.",
  seoTitle: "Beauty Salon - بهترین سالن زیبایی",
  seoDescription: "سالن زیبایی با بهترین خدمات و متخصصین",
  seoKeywords: "سالن زیبایی, آرایشگاه, زیبایی, مو, پوست",
  seoOgImage: "",
  seoFavicon: "",
};

let cached: SiteSettings | null = null;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (cached) return cached;

  try {
    const rows = await prisma.settings.findMany();
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    cached = { ...defaults, ...map };
    return cached;
  } catch {
    return defaults;
  }
}

export function resetSettingsCache() {
  cached = null;
}
