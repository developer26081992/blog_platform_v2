import { z } from "zod";

export type PostActionState = { error?: string };
export const postIdSchema = z.string().trim().min(1).max(100);
export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z.string().trim().min(1, "Slug is required.").max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens for the slug."),
  content: z.string().trim().min(1, "Content is required.").max(100000),
  categoryIds: z.array(postIdSchema).min(1, "Select at least one category.").max(50),
});
export const publishSchema = z.object({ id: postIdSchema, published: z.enum(["true", "false"]) });
