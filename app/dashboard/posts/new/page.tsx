import Link from "next/link";
import { prisma } from "../../../../lib/db";
import { requireUser } from "../../../../lib/session";
import PostForm from "../post-form";

export default async function NewPost() {
  await requireUser();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return <><h1>Create post</h1><Link href="/dashboard/posts">My posts</Link><PostForm categories={categories} /></>;
}
