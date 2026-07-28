import { serviceRepository, type ServiceWithCategory } from "@/repositories/service.repository";
import { AppError } from "@/lib/errors";
import {
  CreateServiceSchema,
  UpdateServiceSchema,
  ListServicesSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
  type ListServicesInput,
  type ServiceResponseDTO,
  type PaginatedServicesResponseDTO,
} from "@/dto/service.dto";

function toResponseDTO(service: ServiceWithCategory): ServiceResponseDTO {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    price: service.price,
    duration: service.duration,
    image: service.image,
    isActive: service.isActive,
    sortOrder: service.sortOrder,
    category: service.category,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export class ServiceService {
  async list(input: ListServicesInput): Promise<PaginatedServicesResponseDTO> {
    const params = ListServicesSchema.parse(input);
    const { categoryId, isActive, search, page, limit, sortBy, sortOrder } = params;

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sortBy === "name" || sortBy === "price" || sortBy === "createdAt") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.sortOrder = sortOrder;
    }

    const [items, total] = await Promise.all([
      serviceRepository.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      serviceRepository.count({ where }),
    ]);

    return {
      items: items.map(toResponseDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<ServiceResponseDTO> {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw AppError.notFound("Service not found");
    }
    return toResponseDTO(service);
  }

  async getBySlug(slug: string): Promise<ServiceResponseDTO> {
    const service = await serviceRepository.findBySlug(slug);
    if (!service) {
      throw AppError.notFound("Service not found");
    }
    return toResponseDTO(service);
  }

  async create(input: CreateServiceInput): Promise<ServiceResponseDTO> {
    const data = CreateServiceSchema.parse(input);

    // Generate slug from name if not provided
    const slug = data.slug || generateSlug(data.name);

    // Check slug uniqueness
    const existingSlug = await serviceRepository.findBySlug(slug);
    if (existingSlug) {
      throw AppError.conflict("A service with this slug already exists");
    }

    const service = await serviceRepository.create({
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      duration: data.duration,
      image: data.image,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      category: { connect: { id: data.categoryId } },
    });

    return toResponseDTO(service);
  }

  async update(id: string, input: UpdateServiceInput): Promise<ServiceResponseDTO> {
    const existing = await serviceRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Service not found");
    }

    const data = UpdateServiceSchema.parse(input);

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await serviceRepository.findBySlug(data.slug);
      if (slugExists) {
        throw AppError.conflict("A service with this slug already exists");
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.categoryId !== undefined) {
      updateData.category = { connect: { id: data.categoryId } };
    }

    const service = await serviceRepository.update(id, updateData as never);
    return toResponseDTO(service);
  }

  async delete(id: string): Promise<void> {
    const existing = await serviceRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Service not found");
    }
    await serviceRepository.delete(id);
  }
}

export const serviceService = new ServiceService();
