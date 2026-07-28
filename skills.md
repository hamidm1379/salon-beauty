# SKILLS.md — دانش/مهارت‌های لازم برای این پروژه

اگر opencode از سیستم "skills" (فایل‌های راهنمای تخصصی که قبل از هر تسک خوانده می‌شوند) پشتیبانی می‌کند،
پیشنهاد می‌شود برای هرکدام از موارد زیر یک فایل کوچک `SKILL.md` جدا بسازی و در پرامپت مربوطه لینکش کنی.
اگر پشتیبانی نمی‌کند، همین لیست را به‌عنوان checklist دانشی قبل از هر فاز به مدل بده.

## 1. nextjs-app-router
Server/Client Component boundary، layouts تودرتو، route groups `(public)`/`(dashboard)`،
`generateMetadata`، `loading.tsx`/`error.tsx`، Suspense streaming، ISR (`revalidate`).

## 2. prisma-postgres
طراحی schema (User, Role, Service, Category, Appointment, Gallery, Blog, BlogCategory,
Image, Settings, ContactMessage)، relations، migrations، seed data، index گذاری درست.

## 3. repository-service-dto-pattern
جداسازی دقیق لایه‌ها طبق agent.md؛ نگاشت Prisma model → DTO؛ جلوگیری از leak کردن
Prisma types به کامپوننت‌ها.

## 4. zod-validation
Schema واحد که هم سمت سرور (route handler/service) و هم سمت کلاینت (RHF resolver)
استفاده می‌شود؛ error formatting یکدست برای پاسخ API.

## 5. jwt-auth-middleware
صدور/تایید JWT، `middleware.ts` برای محافظت از `(dashboard)`، role-based access
(Admin/Editor)، refresh/logout flow.

## 6. tanstack-query-axios
query keys استاندارد، mutation + invalidation، axios instance مرکزی با interceptor
برای auth token و error handling.

## 7. zustand-store
minimal global state (theme، UI toggles، admin sidebar state) — نه برای server data.

## 8. image-pipeline-sharp
آپلود → resize/WebP/thumbnail → نام فایل یکتا → ذخیره مسیر در DB → serve با next/image.

## 9. seo-nextjs
`robots.ts`، `sitemap.ts`، OpenGraph/Twitter metadata per-route، JSON-LD
(Organization, Service, FAQ, Breadcrumb schema)، canonical URLs.

## 10. framer-motion-animation
انیمیشن‌های ظریف طبق design.md (fade/slide/scale/parallax/stagger)، بدون آسیب به
performance یا accessibility.

## 11. tailwind-v4-theming
CSS variables برای رنگ/تایپوگرافی، dark mode با next-themes، utility-first بدون
inline style.

## 12. accessible-ui-components
Button/Card/Modal/Dialog/Drawer/Tabs/Accordion با ARIA درست، focus trap در
modal/drawer، keyboard navigation کامل.

## 13. admin-dashboard-ux
جدول‌ها با pagination/filter/search، فرم‌های CRUD، آمار dashboard، تایید/رد appointment.

## 14. testing-lint-hooks
ESLint + Prettier + Husky + lint-staged setup، حداقل smoke test برای API routes مهم.

---
### نکته درباره‌ی opencode
اگر ابزار opencode مورد استفاده از دایرکتوری `.opencode/skills/` یا مشابه پشتیبانی می‌کند،
هرکدام از ۱۴ مورد بالا را به‌صورت یک فایل جدا با همین ساختار بریز:
عنوان، وقتی triggered می‌شود، و ۳-۶ بولت راهنمای عملی (شبیه فایل‌های SKILL.md که در
این سیستم استفاده می‌شود).