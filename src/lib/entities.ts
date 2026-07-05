import { z } from "zod";

/**
 * Single source of truth for every entity the Admin CMS manages.
 *
 * Both the API routes (validation, Prisma delegate lookup) and the UI
 * (table columns, form fields) read from this file. Add a new module by
 * adding one entry here — no new components or route files needed.
 */

export type FieldType = "text" | "textarea" | "select" | "bool" | "number" | "image";
export type ColumnType = "text" | "mono" | "number" | "bool" | "status" | "date" | "rating";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export interface ColumnDef {
  key: string;
  label: string;
  type: ColumnType;
}

export interface EntityConfig {
  slug: string; // used in URLs: /admin/[slug], /api/admin/[slug]
  label: string;
  prismaModel: string; // property name on the Prisma client
  titleField: string; // field used as the row's display name
  searchField: string; // field used for the `search` query param (contains, case-insensitive)
  statusEnum?: string[]; // valid values for `status`, if the entity has one
  columns: ColumnDef[];
  fields: FieldDef[];
  schema: z.ZodTypeAny; // used for POST (create)
  updateSchema: z.ZodTypeAny; // used for PUT (partial update)
  hasImageView?: boolean; // offer a card/grid view alongside the table
}

const CONTENT_STATUSES = ["PUBLISHED", "DRAFT", "FLAGGED", "ARCHIVED"] as const;

const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Must be a valid URL"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  description: z.string().min(1, "Description is required"),
  pricing: z.enum(["FREE", "FREEMIUM", "PAID"]),
  status: z.enum(CONTENT_STATUSES),
  categoryId: z.string().optional().nullable(),
});

const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Must be a valid URL"),
  headquarters: z.string().min(1, "Headquarters is required"),
  foundedYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  funding: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(CONTENT_STATUSES),
});

const modelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  contextWindow: z.string().min(1, "Context window is required"),
  pricing: z.string().optional().nullable(),
  openSource: z.coerce.boolean().default(false),
  documentation: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  status: z.enum(CONTENT_STATUSES),
  companyId: z.string().optional().nullable(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, letters/numbers/hyphens only"),
  popular: z.coerce.boolean().default(false),
  status: z.enum(CONTENT_STATUSES),
});

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  curator: z.string().min(1, "Curator is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(CONTENT_STATUSES),
});

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  body: z.string().min(1, "Body is required"),
  status: z.enum(CONTENT_STATUSES),
});

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  channel: z.string().min(1, "Channel is required"),
  embedUrl: z.string().url("Must be a valid URL"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, "Use mm:ss format"),
  status: z.enum(CONTENT_STATUSES),
});

const repositorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  githubUrl: z.string().url("Must be a valid URL"),
  language: z.string().min(1, "Language is required"),
  license: z.string().min(1, "License is required"),
  status: z.enum(CONTENT_STATUSES),
});

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  role: z.enum(["ADMIN", "EDITOR", "MEMBER"]),
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"]),
});

const reportSchema = z.object({
  target: z.string().min(1, "Target is required"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional().nullable(),
  status: z.enum(["PENDING", "RESOLVED", "FLAGGED"]),
});

export const ENTITY_REGISTRY: Record<string, EntityConfig> = {
  tools: {
    slug: "tools",
    label: "AI Tools",
    prismaModel: "tool",
    titleField: "name",
    searchField: "name",
    statusEnum: [...CONTENT_STATUSES],
    hasImageView: true,
    columns: [
      { key: "name", label: "Tool", type: "text" },
      { key: "pricing", label: "Pricing", type: "text" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "bookmarks", label: "Bookmarks", type: "number" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Tool name", type: "text", required: true },
      { key: "website", label: "Website URL", type: "text", required: true },
      { key: "imageUrl", label: "Image URL", type: "image" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "pricing", label: "Pricing model", type: "select", options: ["FREE", "FREEMIUM", "PAID"], required: true },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: toolSchema,
    updateSchema: toolSchema.partial(),
  },
  companies: {
    slug: "companies",
    label: "Companies",
    prismaModel: "company",
    titleField: "name",
    searchField: "name",
    statusEnum: [...CONTENT_STATUSES],
    columns: [
      { key: "name", label: "Company", type: "text" },
      { key: "headquarters", label: "HQ", type: "text" },
      { key: "foundedYear", label: "Founded", type: "number" },
      { key: "funding", label: "Funding", type: "text" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Company name", type: "text", required: true },
      { key: "website", label: "Website", type: "text", required: true },
      { key: "headquarters", label: "Headquarters", type: "text", required: true },
      { key: "foundedYear", label: "Founded year", type: "number", required: true },
      { key: "funding", label: "Funding raised", type: "text" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: companySchema,
    updateSchema: companySchema.partial(),
  },
  models: {
    slug: "models",
    label: "AI Models",
    prismaModel: "aiModel",
    titleField: "name",
    searchField: "name",
    statusEnum: [...CONTENT_STATUSES],
    columns: [
      { key: "name", label: "Model", type: "text" },
      { key: "provider", label: "Provider", type: "text" },
      { key: "contextWindow", label: "Context", type: "text" },
      { key: "openSource", label: "Open Source", type: "bool" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Model name", type: "text", required: true },
      { key: "provider", label: "Provider", type: "text", required: true },
      { key: "contextWindow", label: "Context window", type: "text", required: true },
      { key: "pricing", label: "Pricing (per 1M tokens)", type: "text" },
      { key: "openSource", label: "Open source", type: "bool" },
      { key: "documentation", label: "Documentation URL", type: "text" },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: modelSchema,
    updateSchema: modelSchema.partial(),
  },
  categories: {
    slug: "categories",
    label: "Categories & Tasks",
    prismaModel: "category",
    titleField: "name",
    searchField: "name",
    statusEnum: [...CONTENT_STATUSES],
    columns: [
      { key: "name", label: "Category", type: "text" },
      { key: "slug", label: "Slug", type: "mono" },
      { key: "popular", label: "Popular", type: "bool" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Category name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "popular", label: "Mark as popular", type: "bool" },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: categorySchema,
    updateSchema: categorySchema.partial(),
  },
  collections: {
    slug: "collections",
    label: "Collections",
    prismaModel: "collection",
    titleField: "title",
    searchField: "title",
    statusEnum: [...CONTENT_STATUSES],
    hasImageView: true,
    columns: [
      { key: "title", label: "Collection", type: "text" },
      { key: "curator", label: "Curator", type: "text" },
      { key: "itemCount", label: "Items", type: "number" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "title", label: "Collection title", type: "text", required: true },
      { key: "curator", label: "Curator", type: "text", required: true },
      { key: "imageUrl", label: "Image URL", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: collectionSchema,
    updateSchema: collectionSchema.partial(),
  },
  news: {
    slug: "news",
    label: "AI News",
    prismaModel: "news",
    titleField: "title",
    searchField: "title",
    statusEnum: [...CONTENT_STATUSES],
    hasImageView: true,
    columns: [
      { key: "title", label: "Headline", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "author", label: "Author", type: "text" },
      { key: "createdAt", label: "Published", type: "date" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "title", label: "Headline", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "author", label: "Author", type: "text", required: true },
      { key: "imageUrl", label: "Image URL", type: "image" },
      { key: "body", label: "Article body", type: "textarea", required: true },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: newsSchema,
    updateSchema: newsSchema.partial(),
  },
  videos: {
    slug: "videos",
    label: "Videos",
    prismaModel: "video",
    titleField: "title",
    searchField: "title",
    statusEnum: [...CONTENT_STATUSES],
    hasImageView: true,
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "channel", label: "Channel", type: "text" },
      { key: "duration", label: "Duration", type: "mono" },
      { key: "views", label: "Views", type: "number" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "title", label: "Video title", type: "text", required: true },
      { key: "channel", label: "Channel", type: "text", required: true },
      { key: "embedUrl", label: "Embed URL", type: "text", required: true },
      { key: "imageUrl", label: "Thumbnail Image URL", type: "image" },
      { key: "duration", label: "Duration (mm:ss)", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: videoSchema,
    updateSchema: videoSchema.partial(),
  },
  repositories: {
    slug: "repositories",
    label: "Repositories",
    prismaModel: "repository",
    titleField: "name",
    searchField: "name",
    statusEnum: [...CONTENT_STATUSES],
    columns: [
      { key: "name", label: "Repository", type: "mono" },
      { key: "language", label: "Language", type: "text" },
      { key: "stars", label: "Stars", type: "number" },
      { key: "license", label: "License", type: "text" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Repository name", type: "text", required: true },
      { key: "githubUrl", label: "GitHub URL", type: "text", required: true },
      { key: "language", label: "Primary language", type: "text", required: true },
      { key: "license", label: "License", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: [...CONTENT_STATUSES], required: true },
    ],
    schema: repositorySchema,
    updateSchema: repositorySchema.partial(),
  },
  users: {
    slug: "users",
    label: "Users",
    prismaModel: "user",
    titleField: "name",
    searchField: "name",
    statusEnum: ["ACTIVE", "SUSPENDED", "PENDING"],
    columns: [
      { key: "name", label: "User", type: "text" },
      { key: "email", label: "Email", type: "mono" },
      { key: "role", label: "Role", type: "text" },
      { key: "createdAt", label: "Joined", type: "date" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "role", label: "Role", type: "select", options: ["ADMIN", "EDITOR", "MEMBER"], required: true },
      { key: "status", label: "Status", type: "select", options: ["ACTIVE", "SUSPENDED", "PENDING"], required: true },
    ],
    schema: userSchema,
    updateSchema: userSchema.partial(),
  },
  reports: {
    slug: "reports",
    label: "Reports",
    prismaModel: "report",
    titleField: "target",
    searchField: "target",
    statusEnum: ["PENDING", "RESOLVED", "FLAGGED"],
    columns: [
      { key: "target", label: "Reported item", type: "text" },
      { key: "reason", label: "Reason", type: "text" },
      { key: "createdAt", label: "Date", type: "date" },
      { key: "status", label: "Status", type: "status" },
    ],
    fields: [
      { key: "target", label: "Reported item", type: "text", required: true },
      { key: "reason", label: "Reason", type: "text", required: true },
      { key: "notes", label: "Moderator notes", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["PENDING", "RESOLVED", "FLAGGED"], required: true },
    ],
    schema: reportSchema,
    updateSchema: reportSchema.partial(),
  },
};

export function getEntityConfig(slug: string): EntityConfig | undefined {
  return ENTITY_REGISTRY[slug];
}

export const ENTITY_SLUGS = Object.keys(ENTITY_REGISTRY);