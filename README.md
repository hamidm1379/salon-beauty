# Beauty Salon — Next.js 16

سالن زیبایی با طراحی لوکس، مینیمال و مدرن. پشتیبانی کامل از RTL، حالت تاریک، و بهینه‌سازی SEO.

## تکنولوژی‌ها

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, Framer Motion
- **ORM:** Prisma + PostgreSQL
- **Auth:** JWT (jose)
- **State:** TanStack Query, Zustand
- **Forms:** React Hook Form + Zod

## راه‌اندازی

```bash
# 1. نصب وابستگی‌ها
npm install

# 2. کپی فایل محیطی
cp .env.example .env.local

# 3. تنظیم متغیرهای محیطی در .env.local
#    - DATABASE_URL: آدرس دیتابیس PostgreSQL
#    - JWT_SECRET: کلید محرمانه JWT
#    - NEXT_PUBLIC_APP_URL: آدرس اپلیکیشن

# 4. ساخت دیتابیس
npx prisma migrate dev

# 5. تولید Prisma Client
npx prisma generate

# 6. اضافه کردن داده‌های اولیه (اختیاری)
npx prisma db seed

# 7. اجرای سرور توسعه
npm run dev
```

## دستورات مفید

```bash
npm run dev          # سرور توسعه
npm run build        # بیلد پرو덕شن
npm run start        # اجرای پرو덕شن
npm run lint         # بررسی کد
npm run lint:fix     # رفع خودکار مشکلات
npm run format       # فرمت‌دهی کد
npm run format:check # بررسی فرمت

# Prisma
npx prisma studio    # مشاهده دیتابیس
npx prisma migrate dev  # مایگریشن جدید
npx prisma db seed   # داده‌های اولیه
```

## ساختار پروژه

```
src/
├── app/
│   ├── (public)/          # صفحات عمومی
│   │   ├── about/         # درباره ما
│   │   ├── appointment/   # رزرو نوبت
│   │   ├── blog/          # بلاگ
│   │   ├── contact/       # تماس با ما
│   │   ├── gallery/       # گالری
│   │   └── services/      # خدمات
│   ├── (dashboard)/       # پنل مدیریت
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── services/
│   │       ├── blog/
│   │       ├── gallery/
│   │       ├── contacts/
│   │       ├── users/
│   │       └── settings/
│   └── api/               # API Routes
├── components/            # کامپوننت‌ها
│   ├── home/              # صفحه اصلی
│   ├── layout/            # هدر و فوتر
│   ├── ui/                # کامپوننت‌های پایه
│   ├── services/          # فیلتر خدمات
│   ├── gallery/           # گالری تصاویر
│   ├── blog/              # بلاگ
│   ├── appointment/       # رزرو نوبت
│   ├── admin/             # پنل مدیریت
│   └── shared/            # اشتراکی (JSON-LD)
├── hooks/                 # Custom Hooks
├── lib/                   # وابستگی‌ها (Prisma, Auth, etc.)
└── utils/                 # ابزارها
```

## ویژگی‌ها

- Server Components First با Dynamic Import برای کامپوننت‌های سنگین
- `next/image` با `sizes` بهینه و Sharp pipeline
- ISR (Incremental Static Regeneration) برای صفحات کم‌تغییر
- دسترسی‌پذیری (Accessibility): contrast مناسب، aria-label، کیبورد نویگیشن
- حالت تاریک (Dark Mode) با next-themes
- SEO کامل: metadata, JSON-LD, sitemap, robots.txt
- ریسپانسیو: mobile-first با breakpoint‌های standard
