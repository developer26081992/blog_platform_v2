import Link from "next/link";
import { prisma } from "../../../../lib/db";
import { requireUser } from "../../../../lib/session";
import PostForm from "../post-form";

export default async function NewPost() {
  await requireUser();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <>
      <header className="page-heading editor-heading">
        <div>
          <span className="eyebrow">A blank page. A new perspective.</span>
          <h1>Create post</h1>
          <p>Give your idea a title, find the words, and make it your own.</p>
        </div>
        <Link href="/dashboard/posts" className="text-link">
          <span aria-hidden="true">←</span> My posts
        </Link>
      </header>
      <PostForm categories={categories} />
    </>
  );
}
