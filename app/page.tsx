import Link from "next/link";
import { prisma } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
      author: { select: { name: true } },
      categories: { select: { name: true } },
    },
  });
  const [featured, ...stories] = posts;
  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  const date = (value: Date) =>
    value.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  return (
    <main id="main-content" className="page-shell">
      <section className="home-intro" aria-labelledby="journal-title">
        <div>
          <p className="eyebrow">Independent voices. Shared perspectives.</p>
          <h1 id="journal-title">
            Ideas worth
            <br />
            <em>spending time with.</em>
          </h1>
        </div>
        <div className="intro-note">
          <div className="small-rule" />
          <p>
            A journal for the curious. Explore thoughtful stories on technology,
            writing, and the ideas that connect us.
          </p>
          <a href="#latest" className="text-link">
            Discover the latest <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section aria-label="Featured story">
        <div className="section-heading">
          <span className="section-label">The featured story</span>
          <span className="quiet">A good place to begin</span>
        </div>
        {featured ? (
          <article className="featured-story">
            <div className="feature-copy">
              <span className="category-label">
                {featured.categories
                  .map((category) => category.name)
                  .join(" / ")}
              </span>
              <h2>
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p>
                {featured.content.slice(0, 210)}
                {featured.content.length > 210 ? "…" : ""}
              </p>
              <div className="feature-bottom">
                <div className="story-meta">
                  <span className="author-dot" aria-hidden="true">
                    {initials(featured.author.name)}
                  </span>
                  <span>{featured.author.name}</span>
                  <span className="meta-divider" />
                  <time dateTime={featured.createdAt.toISOString()}>
                    {date(featured.createdAt)}
                  </time>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="round-arrow"
                  aria-label={`Read ${featured.title}`}
                >
                  ↗
                </Link>
              </div>
            </div>
            <div className="feature-art" aria-hidden="true">
              <div className="art-top">
                <span>THE ART OF PERSPECTIVE</span>
                <span>NO. 01</span>
              </div>
              <span className="art-letter">Aa</span>
              <div className="art-bottom">
                <span>WORDS MAKE WORLDS.</span>
                <span>THE JOURNAL</span>
              </div>
            </div>
          </article>
        ) : (
          <div className="empty-state">
            <h2>The next story starts here.</h2>
            <p>
              There are no published stories yet. Share a perspective of your
              own.
            </p>
            <Link href="/dashboard/posts/new" className="button">
              Write a story <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </section>
      <section
        id="latest"
        className="latest-section"
        aria-labelledby="latest-title"
      >
        <div className="section-heading">
          <h2 id="latest-title" className="section-label">
            More from the journal
          </h2>
          <span className="quiet">
            Fresh thoughts, different points of view
          </span>
        </div>
        {stories.length > 0 ? (
          <div className="story-grid">
            {stories.map((post, index) => (
              <article className="story-card" key={post.id}>
                <div className="story-card-top">
                  <span className="category-label">
                    {post.categories
                      .map((category) => category.name)
                      .join(" / ")}
                  </span>
                  <span className="story-number">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                </div>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.content}</p>
                <div className="story-meta">
                  <span>{post.author.name}</span>
                  <span className="meta-divider" />
                  <time dateTime={post.createdAt.toISOString()}>
                    {date(post.createdAt)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="table-footnote">More perspectives are on their way.</p>
        )}
      </section>
    </main>
  );
}
