"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/db";
import { requireUser } from "../../../lib/session";
import { postIdSchema, postSchema, publishSchema, type PostActionState } from "../../../lib/post-validation";

function postInput(form: FormData) {
  return postSchema.safeParse({
    title: form.get("title"), slug: form.get("slug"), content: form.get("content"),
    categoryIds: [...new Set(form.getAll("categoryIds"))],
  });
}
async function categoriesExist(ids: string[]) {
  return await prisma.category.count({ where: { id: { in: ids } } }) === ids.length;
}
function failure(error: unknown): PostActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return { error: "That slug is already in use. Choose another." };
    if (error.code === "P2025") return { error: "Post not found or you do not own it." };
    if (error.code === "P2003") return { error: "A selected category no longer exists. Refresh and try again." };
  }
  return { error: "Unable to save your changes. Please try again." };
}
function refresh(slug: string, oldSlug?: string) {
  revalidatePath("/");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/blog/${oldSlug}`);
}

export async function createPost(_state: PostActionState, form: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const parsed = postInput(form);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { categoryIds, ...data } = parsed.data;
  try {
    if (!await categoriesExist(categoryIds)) return { error: "Select existing categories." };
    await prisma.post.create({ data: { ...data, authorId: user.id, categories: { connect: categoryIds.map((id) => ({ id })) } } });
  } catch (error) { return failure(error); }
  refresh(data.slug);
  redirect("/dashboard/posts");
}

export async function updatePost(_state: PostActionState, form: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const id = postIdSchema.safeParse(form.get("id"));
  const parsed = postInput(form);
  if (!id.success) return { error: "Invalid post ID." };
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { categoryIds, ...data } = parsed.data;
  let oldSlug: string;
  try {
    const post = await prisma.post.findFirst({ where: { id: id.data, authorId: user.id }, select: { slug: true } });
    if (!post) return { error: "Post not found or you do not own it." };
    oldSlug = post.slug;
    if (!await categoriesExist(categoryIds)) return { error: "Select existing categories." };
    await prisma.post.update({ where: { id: id.data, authorId: user.id }, data: { ...data, categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) } } });
  } catch (error) { return failure(error); }
  refresh(data.slug, oldSlug);
  revalidatePath(`/dashboard/posts/${id.data}/edit`);
  redirect("/dashboard/posts");
}

export async function setPublished(_state: PostActionState, form: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const parsed = publishSchema.safeParse({ id: form.get("id"), published: form.get("published") });
  if (!parsed.success) return { error: "Invalid publication request." };
  try {
    const post = await prisma.post.update({ where: { id: parsed.data.id, authorId: user.id }, data: { published: parsed.data.published === "true" }, select: { slug: true } });
    refresh(post.slug);
  } catch (error) { return failure(error); }
  return {};
}

export async function deletePost(_state: PostActionState, form: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const id = postIdSchema.safeParse(form.get("id"));
  if (!id.success) return { error: "Invalid post ID." };
  try {
    const post = await prisma.post.delete({ where: { id: id.data, authorId: user.id }, select: { slug: true } });
    refresh(post.slug);
  } catch (error) { return failure(error); }
  return {};
}
