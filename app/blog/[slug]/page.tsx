import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
export const dynamic = "force-dynamic";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      title: true,
      content: true,
      createdAt: true,
      author: { select: { name: true } },
      categories: { select: { name: true } },
    },
  });
  if (!post) notFound();
  return (
    <main id="main-content" className="article-shell">
      <Link href="/" className="article-back">
        <span aria-hidden="true">←</span> Back to the journal
      </Link>
      <article>
        <header className="article-header">
          <p className="category-label">
            {post.categories.map((category) => category.name).join(" / ")}
          </p>
          <h1>{post.title}</h1>
          <div className="article-byline">
            <span className="author-dot" aria-hidden="true">
              {post.author.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <strong>By {post.author.name}</strong>
              <time dateTime={post.createdAt.toISOString()}>
                {post.createdAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            </div>
          </div>
        </header>
        <div className="article-body">{post.content}</div>
        <footer className="article-end">
          <span>THANK YOU FOR READING.</span>
          <Link href="/" className="text-link">
            More perspectives <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}
