export type Role = "ADMIN" | "EDITOR";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

// ─── Appointment DTOs ────────────────────────────────────
export interface CreateAppointmentInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  userId?: string;
}

export interface AppointmentResponse {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  date: Date;
  time: string;
  notes: string | null;
  status: AppointmentStatus;
  service: {
    id: string;
    name: string;
    slug: string;
    price: number;
    duration: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListAppointmentsInput {
  status?: AppointmentStatus;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

// ─── Gallery DTOs ────────────────────────────────────────
export interface CreateGalleryInput {
  title: string;
  description?: string;
  imageId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface GalleryResponse {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  image: {
    id: string;
    url: string;
    type: string;
    alt: string | null;
    width: number | null;
    height: number | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListGalleryInput {
  isActive?: boolean;
  page: number;
  limit: number;
}

// ─── Blog DTOs ───────────────────────────────────────────
export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  blogCategoryId: string;
  imageId?: string;
  primaryKeyword?: string;
  secondaryKeyword?: string;
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  blogCategory: {
    id: string;
    name: string;
    slug: string;
  };
  image: {
    id: string;
    url: string;
    alt: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListBlogInput {
  published?: boolean;
  blogCategoryId?: string;
  search?: string;
  page: number;
  limit: number;
}

// ─── BlogCategory DTOs ───────────────────────────────────
export interface CreateBlogCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface BlogCategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    posts: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── User DTOs ───────────────────────────────────────────
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatar: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersInput {
  role?: Role;
  search?: string;
  page: number;
  limit: number;
}

// ─── ContactMessage DTOs ─────────────────────────────────
export interface CreateContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactMessageResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListContactMessagesInput {
  isRead?: boolean;
  page: number;
  limit: number;
}

// ─── Pagination ──────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API Response ────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}
