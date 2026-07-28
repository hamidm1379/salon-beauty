import { z } from "zod";

// ─── Zod Schemas ─────────────────────────────────────────

export const CreateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive("Price must be positive"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  image: z.string().url("Invalid URL").optional().nullable(),
  categoryId: z.string().cuid("Invalid category ID"),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();

export const ListServicesSchema = z.object({
  categoryId: z.string().cuid().optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(["name", "price", "createdAt", "sortOrder"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// ─── TypeScript Types ────────────────────────────────────

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type ListServicesInput = z.infer<typeof ListServicesSchema>;

// ─── Response Types ──────────────────────────────────────

export interface ServiceResponseDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedServicesResponseDTO {
  items: ServiceResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
