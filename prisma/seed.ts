import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── Users ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@salon.com" },
    update: {},
    create: {
      name: "Admin",
      username: "admin",
      email: "admin@salon.com",
      passwordHash,
      role: "ADMIN",
      phone: "+1234567890",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@salon.com" },
    update: {},
    create: {
      name: "Editor",
      username: "editor",
      email: "editor@salon.com",
      passwordHash: await bcrypt.hash("editor123", 12),
      role: "EDITOR",
    },
  });

  console.log("Users created:", { admin: admin.email, editor: editor.email });

  // ─── Categories ─────────────────────────────────────────
  const hairCategory = await prisma.category.upsert({
    where: { slug: "hair" },
    update: {},
    create: {
      name: "Hair",
      slug: "hair",
      description: "All hair styling and treatment services",
      sortOrder: 1,
    },
  });

  const nailCategory = await prisma.category.upsert({
    where: { slug: "nails" },
    update: {},
    create: {
      name: "Nails",
      slug: "nails",
      description: "Manicure, pedicure and nail art",
      sortOrder: 2,
    },
  });

  const skinCategory = await prisma.category.upsert({
    where: { slug: "skin-care" },
    update: {},
    create: {
      name: "Skin Care",
      slug: "skin-care",
      description: "Facial treatments and skin care",
      sortOrder: 3,
    },
  });

  const makeupCategory = await prisma.category.upsert({
    where: { slug: "makeup" },
    update: {},
    create: {
      name: "Makeup",
      slug: "makeup",
      description: "Professional makeup services",
      sortOrder: 4,
    },
  });

  console.log("Categories created:", [
    hairCategory.name,
    nailCategory.name,
    skinCategory.name,
    makeupCategory.name,
  ]);

  // ─── Services ───────────────────────────────────────────
  const services = [
    {
      name: "Haircut & Styling",
      slug: "haircut-styling",
      description: "Professional haircut tailored to your face shape and style",
      price: 45,
      duration: 45,
      categoryId: hairCategory.id,
      sortOrder: 1,
    },
    {
      name: "Hair Coloring",
      slug: "hair-coloring",
      description: "Full color, highlights, balayage or ombré",
      price: 85,
      duration: 120,
      categoryId: hairCategory.id,
      sortOrder: 2,
    },
    {
      name: "Manicure Classic",
      slug: "manicure-classic",
      description: "Classic manicure with nail shaping and polish",
      price: 25,
      duration: 30,
      categoryId: nailCategory.id,
      sortOrder: 1,
    },
    {
      name: "Gel Nails",
      slug: "gel-nails",
      description: "Long-lasting gel nail application",
      price: 40,
      duration: 60,
      categoryId: nailCategory.id,
      sortOrder: 2,
    },
    {
      name: "Deep Cleansing Facial",
      slug: "deep-cleansing-facial",
      description: "Deep cleansing facial with extraction and mask",
      price: 70,
      duration: 60,
      categoryId: skinCategory.id,
      sortOrder: 1,
    },
    {
      name: "Anti-Aging Treatment",
      slug: "anti-aging-treatment",
      description: "Advanced anti-aging facial with collagen boost",
      price: 95,
      duration: 75,
      categoryId: skinCategory.id,
      sortOrder: 2,
    },
    {
      name: "Bridal Makeup",
      slug: "bridal-makeup",
      description: "Complete bridal makeup with trial session",
      price: 150,
      duration: 90,
      categoryId: makeupCategory.id,
      sortOrder: 1,
    },
    {
      name: "Everyday Makeup",
      slug: "everyday-makeup",
      description: "Natural everyday makeup look",
      price: 50,
      duration: 45,
      categoryId: makeupCategory.id,
      sortOrder: 2,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  console.log("Services created:", services.length);

  // ─── Blog Categories ────────────────────────────────────
  const beautyTips = await prisma.blogCategory.upsert({
    where: { slug: "beauty-tips" },
    update: {},
    create: {
      name: "Beauty Tips",
      slug: "beauty-tips",
      description: "Tips and tricks for your beauty routine",
    },
  });

  const trends = await prisma.blogCategory.upsert({
    where: { slug: "trends" },
    update: {},
    create: {
      name: "Trends",
      slug: "trends",
      description: "Latest beauty and fashion trends",
    },
  });

  console.log("Blog categories created:", [beautyTips.name, trends.name]);

  // ─── Blog Posts ─────────────────────────────────────────
  const posts = [
    {
      title: "10 Summer Hair Care Tips",
      slug: "summer-hair-care-tips",
      excerpt: "Keep your hair healthy and shiny all summer long",
      content:
        "Summer can be tough on your hair with sun, chlorine, and salt water. Here are our top tips to keep your locks looking gorgeous...",
      published: true,
      publishedAt: new Date(),
      blogCategoryId: beautyTips.id,
    },
    {
      title: "2024 Nail Art Trends",
      slug: "2024-nail-art-trends",
      excerpt: "Discover the hottest nail art trends this year",
      content:
        "From minimalist designs to bold statement nails, here are the trends dominating the nail art world...",
      published: true,
      publishedAt: new Date(),
      blogCategoryId: trends.id,
    },
  ];

  for (const post of posts) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Blog posts created:", posts.length);

  // ─── Settings ───────────────────────────────────────────
  const settings = [
    { key: "salon_name", value: "Beauty Salon", group: "general" },
    { key: "salon_email", value: "info@salon.com", group: "general" },
    { key: "salon_phone", value: "+1234567890", group: "general" },
    { key: "salon_address", value: "123 Beauty Street, City", group: "general" },
    { key: "opening_hours", value: "Mon-Sat: 9AM-7PM", group: "hours" },
    { key: "booking_advance_days", value: "30", group: "booking" },
    { key: "booking_cancellation_hours", value: "24", group: "booking" },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Settings created:", settings.length);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
