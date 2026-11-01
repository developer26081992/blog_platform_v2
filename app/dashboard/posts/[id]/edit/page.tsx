import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireUser } from "../../../../../lib/session";
import PostForm from "../../post-form";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const post = await prisma.post.findFirst({
    where: { id, authorId: user.id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      categories: { select: { id: true } },
    },
  });
  if (!post) notFound();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <>
      <header className="page-heading editor-heading">
        <div>
          <span className="eyebrow">A little refinement goes a long way</span>
          <h1>Edit post</h1>
          <p>Keep shaping your story. Every word is yours to make better.</p>
        </div>
        <Link href="/dashboard/posts" className="text-link">
          <span aria-hidden="true">←</span> My posts
        </Link>
      </header>
      <PostForm categories={categories} post={post} />
    </>
  );
}
