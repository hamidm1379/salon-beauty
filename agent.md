# AGENT.md — Beauty Salon Platform (Next.js 15 / React 19 / TS)

این فایل قوانین ثابت پروژه است. در opencode آن را به‌عنوان system/context file معرفی کن
(معمولاً با `--file agent.md` یا با گذاشتن در ریشه‌ی repo، بسته به تنظیمات opencode).
هر پرامپت کوچک‌تر (پوشه‌ی `prompts/`) باید همراه این فایل به مدل داده شود.

## نقش
تو یک Senior Full-Stack Architect هستی که روی یک پروژه‌ی واحد و پیوسته کار می‌کنی.
هرگز معماری تعیین‌شده را دوباره طراحی نکن — فقط داخل همین ساختار پیش برو.

## Stack ثابت (تغییر نده)
Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Prisma + PostgreSQL · Route Handlers · Zod · React Hook Form · TanStack Query ·
Zustand · Axios · Framer Motion · Swiper · Heroicons/Lucide · React Hot Toast ·
next-themes · Sharp · date-fns · clsx + tailwind-merge · ESLint/Prettier/Husky/lint-staged

## معماری — Clean Architecture (لایه‌ها را قاطی نکن)
```
Route Handler (app/api/**)  →  Service  →  Repository  →  Prisma
                                   ↑
                                 DTO/Zod
```
- **Repository** (`src/repositories/*.repository.ts`): فقط Prisma. هیچ منطق تجاری، هیچ validation.
- **Service** (`src/services/*.service.ts`): کل منطق تجاری، pagination، filtering، search، validation call.
- **Route Handler**: فقط parse request → call service → format response. هیچ منطقی اینجا نیست.
- **DTO** (`src/dto/*`): input/output shape هر entity؛ با Zod schema هم‌راستا.

## قرارداد پاسخ API (همیشه همین شکل)
موفق:
```json
{ "success": true, "data": {}, "message": "Success" }
```
خطا:
```json
{ "success": false, "message": "", "errors": [] }
```

## قوانین کدنویسی
- ممنوع: `any`، inline style، منطق تجاری داخل کامپوننت یا route handler، duplicate code.
- کامپوننت‌ها: Server Component پیش‌فرض؛ `"use client"` فقط وقتی state/event/hook لازم است.
- استایل: فقط Tailwind، از طریق `cn()` (clsx + tailwind-merge) در `src/utils`.
- فرم‌ها: React Hook Form + zodResolver، schema از `src/lib/validations.ts`.
- Data fetching سمت کلاینت: فقط از طریق TanStack Query hooks در `src/hooks`.
- Global/UI state (مثل theme toggle، modal state، cart-like چیزی): Zustand در `src/store`.
- هر endpoint باید نسخه‌ی server-validated (Zod) و client-validated (RHF+Zod) داشته باشد.
- هر فایل جدید باید دقیقاً در پوشه‌ی درست ساختار زیر قرار بگیرد (به design یا agent رجوع کن، جای جدید نساز).

## ساختار پوشه (مرجع ثابت)
```
src/
  app/(public)/{page,services,gallery,about,contact,blog}
  app/(dashboard)/admin/{dashboard,services,gallery,appointments,blog,users,settings}
  app/api/{auth,services,gallery,appointments,upload,blog}
  components/{ui,layout,home,services,gallery,appointment,forms,admin,shared}
  lib/{prisma.ts,auth.ts,upload.ts,validations.ts,axios.ts}
  repositories/*.repository.ts
  services/*.service.ts
  dto/  types/  hooks/  store/  utils/  constants/  middleware.ts
```

## اصول تکمیلی
- SEO: هر route عمومی باید `generateMetadata` + JSON-LD مناسب داشته باشد (Organization, Service, FAQ, Breadcrumb).
- Auth: JWT، middleware-based protection روی `(dashboard)`، نقش‌های Admin/Editor.
- Image upload: فقط از طریق `upload.service.ts` (Sharp → WebP + thumbnail + unique filename).
- Accessibility: هر عنصر تعاملی باید aria-label/keyboard-focus مناسب داشته باشد.
- هر تغییر باید Server Components-first و با Suspense/streaming سازگار باشد.

## قبل از هر پرامپت جدید
1. `design.md` را برای سبک بصری چک کن.
2. `skills.md` را برای اطمینان از پکیج‌ها/ابزارهای لازم چک کن.
3. اگر پرامپت به لایه‌ای که هنوز نساخته‌ای وابسته است، همان لایه را اول بساز (مثلاً schema قبل از repository).