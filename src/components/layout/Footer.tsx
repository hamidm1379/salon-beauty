"use client";

import {
  Flower2,
  Send,
  Globe,
  MessageCircle,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { RubikaIcon } from "@/components/ui/RubikaIcon";
import { useSettings } from "@/hooks/use-settings";
import { useCategories } from "@/hooks/use-categories";
import { toPersianNumbers } from "@/utils/persian";

interface UsefulLink {
  label: string;
  href: string;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  telegram: Send,
  whatsapp: WhatsAppIcon,
  rubika: RubikaIcon,
  bale: MessageCircle,
};

const socialLabels: Record<string, string> = {
  instagram: "اینستاگرام",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  rubika: "روبیکا",
  bale: "بله",
};

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function Footer() {
  const { data: settings } = useSettings();
  const { data: categoriesData } = useCategories();

  const salonName = settings?.salonName ?? "Beauty Salon";
  const logoUrl = settings?.logoUrl ?? "";
  const footerDescription = settings?.footerDescription ?? "";
  const salonAddress = settings?.salonAddress ?? "";
  const salonPhone = settings?.salonPhone ?? "";
  const salonMobile = settings?.salonMobile ?? "";
  const salonEmail = settings?.salonEmail ?? "";

  const usefulLinks = parseJsonSetting<UsefulLink[]>(settings?.footerUsefulLinks, []);

  const socialPlatforms: Array<{ key: string; url: string }> = [
    { key: "instagram", url: settings?.instagram ?? "" },
    { key: "telegram", url: settings?.telegram ?? "" },
    { key: "whatsapp", url: settings?.whatsapp ?? "" },
    { key: "rubika", url: settings?.rubika ?? "" },
    { key: "bale", url: settings?.bale ?? "" },
  ].filter((item) => item.url !== "");

  const services = categoriesData?.items ?? [];

  return (
    <footer dir="rtl" className="bg-[var(--color-bg-soft)] pt-20 text-right">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* لوگو */}
        <div>
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={salonName}
                width={44}
                height={44}
                className="rounded-full object-contain"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            )}
            <div className="leading-tight">
              <p className="font-bold text-[var(--color-ink)] tracking-wide">{salonName}</p>
              <p className="text-[10px] tracking-[0.3em] text-[var(--color-ink-muted)]">SALON</p>
            </div>
          </div>
          <p className="font-semibold mt-4">زیبایی، اعتماد به نفس</p>
          {footerDescription && (
            <p className="text-sm text-[var(--color-ink-muted)] mt-3 leading-relaxed">
              {footerDescription}
            </p>
          )}
        </div>

        {/* تماس با ما */}
        <div>
          <h4 className="font-semibold mb-4">تماس با ما</h4>
          <ul className="space-y-4 text-sm text-[var(--color-ink-muted)]">
            {salonAddress && (
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" />
                <span>{toPersianNumbers(salonAddress)}</span>
              </li>
            )}
            {salonPhone && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span dir="ltr">{toPersianNumbers(salonPhone)}</span>
              </li>
            )}
            {salonMobile && (
              <li className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                <span dir="ltr">{toPersianNumbers(salonMobile)}</span>
              </li>
            )}
            {salonEmail && (
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                <span dir="ltr">{salonEmail}</span>
              </li>
            )}
          </ul>
        </div>

        {/* خدمات ما + لینک‌های مفید */}
        <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:col-span-2">
          <div>
            <h4 className="font-semibold mb-4">خدمات ما</h4>
            <ul className="space-y-3 text-sm text-[var(--color-ink-muted)]">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/services#${s.slug}`}
                    className="hover:text-[var(--color-primary)] transition"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">لینک‌های مفید</h4>
            <ul className="space-y-3 text-sm text-[var(--color-ink-muted)]">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[var(--color-primary)] transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* عضویت در خبرنامه */}
        <div>
          <h4 className="font-semibold mb-4">عضویت در خبرنامه</h4>
          <p className="text-sm text-[var(--color-ink-muted)] mb-4 leading-relaxed">
            با عضویت در خبرنامه، از جدیدترین تخفیف‌ها و خدمات ما مطلع شوید
          </p>
          <form className="flex items-center rounded-2xl bg-[var(--color-bg)] border border-[var(--color-ink)]/10 p-1.5 ps-4">
            <input
              type="email"
              dir="rtl"
              placeholder="ایمیل خود را وارد کنید"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-ink-muted)] text-right"
            />
            <button
              type="submit"
              aria-label="ارسال"
              className="rounded-xl bg-[var(--color-primary)] text-white p-2.5 hover:opacity-90 transition shrink-0"
            >
              <Send className="w-4 h-4 -scale-x-100" />
            </button>
          </form>

          <p className="text-xs text-[var(--color-ink-muted)] mt-5">
            ما را در شبکه‌های اجتماعی دنبال کنید
          </p>
          <div className="flex gap-3 mt-3" role="list" aria-label="شبکه‌های اجتماعی">
            {socialPlatforms.map(({ key, url }) => {
              const Icon = socialIcons[key] ?? Globe;
              const label = socialLabels[key] ?? key;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* نوار پایین */}
      <div
        className="relative mt-16 overflow-hidden bg-gradient-to-l from-[#7D56A1] to-[#4B2D70] text-white/80"
        style={{ borderTopLeftRadius: "160px 40px" }}
      >
        <svg
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 h-full opacity-[0.13]"
          viewBox="0 0 600 100"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id="footerLeaf" width="150" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M20,100 C24,80 55,78 56,62 C57,50 32,47 27,58"
                stroke="white"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M27,58 C46,38 24,20 45,2"
                stroke="white"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path d="M32,48 C 38,44 40,39 44,33 C 40,41 36,45 32,48 Z" fill="white" />
              <path d="M40,28 C 46,23 48,18 52,12 C 48,20 44,25 40,28 Z" fill="white" />
            </pattern>
          </defs>
          <rect width="600" height="100" fill="url(#footerLeaf)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sm:text-xs text-[10px]">
          <button
            aria-label="بازگشت به بالا"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <p>
            © {toPersianNumbers(new Date().getFullYear())} {salonName} تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  );
}
