import Link from "next/link";
import { prisma } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true }, orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, author: { select: { name: true } }, categories: { select: { name: true } } },
  });
  return <main>
    <h1>Blog Platform</h1>
    <nav><Link href="/register">Register</Link>{" | "}<Link href="/login">Log in</Link>{" | "}<Link href="/dashboard/posts">My posts</Link></nav>
    <h2>Published posts</h2>
    {posts.length === 0 ? <p>No published posts yet.</p> : <ul>{posts.map((post) => <li key={post.id}>
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>By {post.author.name} | {post.categories.map((category) => category.name).join(", ")}</p>
    </li>)}</ul>}
  </main>;
}
