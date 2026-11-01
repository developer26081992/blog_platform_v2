import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireUser } from "../../../lib/session";
import PostControls from "./post-controls";

export default async function MyPosts() {
  const user = await requireUser();
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      updatedAt: true,
    },
  });
  return (
    <>
      <header className="page-heading">
        <div>
          <span className="eyebrow">Your stories, in one place</span>
          <h1>My posts</h1>
          <p>
            A work in progress today. Someone&apos;s next good read tomorrow.
          </p>
        </div>
        <Link href="/dashboard/posts/new" className="button">
          Create post <span aria-hidden="true">＋</span>
        </Link>
      </header>
      {posts.length === 0 ? (
        <div className="empty-state">
          <span className="eyebrow">A fresh page</span>
          <h2>Your first story is waiting.</h2>
          <p>You have no posts yet. Put your first idea into words.</p>
          <Link href="/dashboard/posts/new" className="button">
            Create your first draft <span aria-hidden="true">↗</span>
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="posts-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <span className="post-table-title">
                      {post.published ? (
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      ) : (
                        post.title
                      )}
                    </span>
                    <span className="post-table-slug">/{post.slug}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${post.published ? "" : "status-draft"}`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <time dateTime={post.updatedAt.toISOString()}>
                      {post.updatedAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </time>
                  </td>
                  <td>
                    <div className="post-row-actions">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        Edit
                      </Link>
                      <PostControls id={post.id} published={post.published} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {posts.length > 0 && (
        <p className="table-footnote">
          Only your posts appear here. Drafts remain private until you publish
          them.
        </p>
      )}
    </>
  );
}
