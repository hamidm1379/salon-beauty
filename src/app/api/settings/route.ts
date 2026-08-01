import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError } from "@/utils/api-response";

interface SettingsData {
  [key: string]: string;
}

const defaultSettings: SettingsData = {
  salonName: "Beauty Salon",
  salonAddress: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  salonPhone: "021-12345678",
  salonMobile: "0912-123-4567",
  salonEmail: "info@beautysalon.com",
  workingHours: "شنبه تا پنجشنبه ۹ الی ۲۱",
  logoUrl: "",
  footerDescription: "ما در سالن زیبایی، با ارائه خدمات متنوع و باکیفیت، زیبایی طبیعی شما را به بهترین شکل ممکن نمایان می‌کنیم.",
  footerUsefulLinks: JSON.stringify([
    { label: "اخبار و مقالات", href: "/blog" },
    { label: "سوالات متداول", href: "/faq" },
    { label: "شرایط و قوانین", href: "/terms" },
    { label: "حریم خصوصی", href: "/privacy" },
  ]),
  socialLinks: JSON.stringify([
    { platform: "website", url: "https://beautysalon.ir" },
    { platform: "telegram", url: "https://t.me/beautysalon" },
    { platform: "whatsapp", url: "https://wa.me/989121234567" },
    { platform: "instagram", url: "https://instagram.com/beautysalon" },
  ]),
  instagram: "https://instagram.com/beautysalon",
  telegram: "https://t.me/beautysalon",
  whatsapp: "",
  rubika: "",
  bale: "",
  seoTitle: "Beauty Salon - بهترین سالن زیبایی",
  seoDescription: "سالن زیبایی با بهترین خدمات و متخصصین",
  seoKeywords: "سالن زیبایی, آرایشگاه, زیبایی, مو, پوست",
  seoOgImage: "",
  seoFavicon: "",
};

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    const settingsMap: SettingsData = {};

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const result = { ...defaultSettings, ...settingsMap };

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const upsertPromises = Object.entries(body).map(([key, value]) =>
      prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(upsertPromises);

    return successResponse(body, "Settings updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
