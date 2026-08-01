import { z } from "zod";

// ─── Zod Schemas ─────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  description: z.string().max(500).optional(),
  image: z.string().max(500).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const ListCategoriesSchema = z.object({
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(["name", "createdAt", "sortOrder"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// ─── TypeScript Types ────────────────────────────────────

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ListCategoriesInput = z.infer<typeof ListCategoriesSchema>;

// ─── Response Types ──────────────────────────────────────

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    services: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCategoriesResponseDTO {
  items: CategoryResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
