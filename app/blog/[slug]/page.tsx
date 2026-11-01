import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: { title: true, content: true, createdAt: true, author: { select: { name: true } }, categories: { select: { name: true } } },
  });
  if (!post) notFound();
  return <main><Link href="/">All posts</Link><article>
    <h1>{post.title}</h1><p>By {post.author.name}</p>
    <p>Categories: {post.categories.map((category) => category.name).join(", ")}</p>
    <time dateTime={post.createdAt.toISOString()}>{post.createdAt.toISOString().slice(0, 10)}</time>
    <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{post.content}</div>
  </article></main>;
}
