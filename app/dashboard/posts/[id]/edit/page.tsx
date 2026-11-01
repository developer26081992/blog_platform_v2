import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireUser } from "../../../../../lib/session";
import PostForm from "../../post-form";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const post = await prisma.post.findFirst({ where: { id, authorId: user.id }, select: { id: true, title: true, slug: true, content: true, categories: { select: { id: true } } } });
  if (!post) notFound();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return <><h1>Edit post</h1><Link href="/dashboard/posts">My posts</Link><PostForm categories={categories} post={post} /></>;
}
