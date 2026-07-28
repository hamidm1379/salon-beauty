import { z } from "zod";

// ─── Appointment ─────────────────────────────────────────
export const createAppointmentSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10).max(20).optional(),
  serviceId: z.string().cuid(),
  date: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, "Date must be in the future"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:mm format"),
  notes: z.string().max(500).optional(),
  userId: z.string().cuid().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const listAppointmentsSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  serviceId: z.string().cuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ─── Gallery ─────────────────────────────────────────────
export const createGallerySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  imageId: z.string().cuid().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateGallerySchema = createGallerySchema.partial();

export const listGallerySchema = z.object({
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

// ─── Blog ────────────────────────────────────────────────
export const createBlogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  blogCategoryId: z.string().cuid(),
  imageId: z.string().cuid().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const listBlogSchema = z.object({
  published: z.coerce.boolean().optional(),
  blogCategoryId: z.string().cuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ─── BlogCategory ────────────────────────────────────────
export const createBlogCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(500).optional(),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();

// ─── User (Admin) ────────────────────────────────────────
export const listUsersSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR"]),
});

// ─── ContactMessage ──────────────────────────────────────
export const createContactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
});

export const listContactMessagesSchema = z.object({
  isRead: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Service ─────────────────────────────────────────────
export const createServiceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  image: z.string().url().optional(),
  categoryId: z.string().cuid(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const listServicesSchema = z.object({
  categoryId: z.string().cuid().optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ─── Category ────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();
