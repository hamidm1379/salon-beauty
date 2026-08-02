# DESIGN.md — Visual System (AI-readable design spec)

هدف: یک طراحی لوکس، مینیمال و مدرن که از عکس مرجع الهام گرفته اما کپی نیست.
این فایل باید همراه هر پرامپتی که UI می‌سازد به مدل داده شود.

## هویت بصری

- سبک: Luxury · Minimal · Modern · Editorial spacing
- پس‌زمینه: سفید (#FFFFFF) با gradient بنفش ملایم به‌عنوان accent، نه پس‌زمینه‌ی کامل
- افکت: Glassmorphism محدود (فقط روی navbar/cards شناور، نه همه‌جا)

## پالت رنگ (به‌عنوان Tailwind CSS variables تعریف کن)

```css
--color-bg: #ffffff --color-bg-soft: #faf9fc --color-primary: #7c3aed /* violet-600 */
  --color-primary-soft: #c4b5fd /* violet-300 */ --color-gradient-from: #ede9fe
  --color-gradient-to: #ffffff --color-ink: #1a1523 --color-ink-muted: #6b7280
  --color-gold-accent: #c9a227 /* برای لمس لوکس، خیلی محدود استفاده شود */;
```

## تایپوگرافی

- Heading: یک فونت serif یا high-contrast sans لوکس (مثل "Playfair Display" یا "Cormorant" برای H1/H2)
- Body: یک sans تمیز و خوانا (مثل "Inter" یا "Manrope")
- مقیاس: H1 `text-5xl md:text-6xl` / H2 `text-3xl md:text-4xl` / body `text-base leading-relaxed`
- letter-spacing کمی باز روی heading های بزرگ (`tracking-tight` روی H1 برعکس عمل نکن — تست کن کدام بهتر می‌نشیند)

## فاصله‌گذاری و لایه‌بندی

- Border radius: بزرگ و سخاوتمندانه — کارت‌ها `rounded-3xl`، دکمه‌ها `rounded-full` یا `rounded-2xl`
- Shadow: نرم و پخش — هرگز سخت/تیز؛ چیزی شبیه `shadow-[0_20px_60px_-15px_rgba(124,58,237,0.15)]`
- Section spacing: `py-24 md:py-32` بین بخش‌های اصلی صفحه
- Container: max-width حدود `1280px`، padding افقی ریسپانسیو

## کامپوننت‌ها (قوانین مشترک)

- Button: primary (solid violet gradient)، secondary (outline)، ghost — همه با hover scale/lift ملایم
- Card: پس‌زمینه سفید/شیشه‌ای، border ظریف `border-white/40`، سایه‌ی نرم، هاور با `translate-y` کوچک
- Badge: کوچک، rounded-full، رنگ soft از پالت primary
- Modal/Drawer/Dialog: backdrop blur، ورود با fade+scale، خروج معکوس

## انیمیشن (Framer Motion — ظریف، نه شلوغ)

- Entry: fade + slight translateY (`opacity 0→1، y 20→0`)، duration ~0.5-0.6s، easing نرم
- Hover: scale 1.02-1.05 یا lift 4-6px، هرگز پرش تند
- Parallax: فقط روی hero/gallery، ملایم (max 30-40px shift)
- Stagger روی گرید سرویس‌ها/گالری (0.05-0.1s بین آیتم‌ها)
- هیچ‌وقت انیمیشن نباید UX را کند یا مزاحم کند؛ `prefers-reduced-motion` را رعایت کن

## آیکون‌ها

Heroicons برای UI عمومی، Lucide برای dashboard/admin — سایز و ضخامت یکدست در کل پروژه

## Responsive Breakpoints

Mobile-first: `sm 640` `md 768` `lg 1024` `xl 1280` `2xl 1536`

- Hero روی موبایل: متن قبل از تصویر، تصویر کوتاه‌تر
- گرید سرویس‌ها: 1 ستون موبایل → 2 تبلت → 3-4 دسکتاپ
- Admin dashboard: sidebar جمع‌شونده (drawer) زیر `lg`

## تصاویر

همه‌ی تصاویر از طریق `next/image` + Sharp pipeline (WebP، چند سایز، lazy به‌جز above-the-fold)
