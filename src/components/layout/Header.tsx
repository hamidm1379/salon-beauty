"use client";

import { Search, Sparkles, Menu, X, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/utils/cn";

const links = [
  { label: "صفحه اصلی", href: "/" },
  { label: "خدمات", href: "/services" },
  { label: "درباره ما", href: "/about" },
  { label: "بلاگ", href: "/blog" },
  { label: "گالری", href: "/gallery" },
  { label: "تماس با ما", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-ink)]/5">
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4"
        aria-label="منوی اصلی"
      >
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--color-primary)]" aria-hidden="true" />
          <span className="text-xl font-bold text-[var(--color-ink)]">Salon</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "transition",
                  pathname === l.href
                    ? "text-[var(--color-primary)] font-bold"
                    : "hover:text-[var(--color-primary)]"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="جستجو"
            className="p-2 rounded-full hover:bg-[var(--color-bg-soft)] transition"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-full hover:bg-[var(--color-bg-soft)] transition"
            aria-label="ورود / ثبت‌نام"
          >
            <LogIn className="w-5 h-5" />
          </Link>

          <Link
            href="/appointment"
            className="rounded-full bg-[var(--color-primary)] text-white px-5 py-2.5 text-sm font-medium hover:scale-105 transition-transform"
          >
            رزرو نوبت
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-[var(--color-bg-soft)] transition"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-ink)]/5 bg-[var(--color-bg)]">
          <ul className="flex flex-col px-6 py-4 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-3 px-4 rounded-xl text-sm font-medium transition",
                    pathname === l.href
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)] transition"
              >
                <LogIn className="w-4 h-4" />
                ورود / ثبت‌نام
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
