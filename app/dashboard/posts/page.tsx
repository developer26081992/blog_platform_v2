import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireUser } from "../../../lib/session";
import PostControls from "./post-controls";

export default async function MyPosts() {
  const user = await requireUser();
  const posts = await prisma.post.findMany({ where: { authorId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, slug: true, published: true, updatedAt: true } });
  return <>
    <h1>My posts</h1><p><Link href="/dashboard/posts/new">Create post</Link></p>
    {posts.length === 0 ? <p>You have no posts yet.</p> : <table>
      <thead><tr><th scope="col">Title</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col">Actions</th></tr></thead>
      <tbody>{posts.map((post) => <tr key={post.id}>
        <td>{post.published ? <Link href={`/blog/${post.slug}`}>{post.title}</Link> : post.title}</td>
        <td>{post.published ? "Published" : "Draft"}</td><td>{post.updatedAt.toISOString().slice(0, 10)}</td>
        <td><Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link><PostControls id={post.id} published={post.published} /></td>
      </tr>)}</tbody>
    </table>}
  </>;
}
