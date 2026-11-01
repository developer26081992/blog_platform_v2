import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <section className="workspace-welcome">
        <span className="eyebrow">Your workspace</span>
        <h1>
          Every good story
          <br />
          starts with an idea.
        </h1>
        <p>
          This is your space to turn a passing thought into something worth
          sharing. Start a fresh draft or pick up a story in progress.
        </p>
        <div className="welcome-actions">
          <Link href="/dashboard/posts/new" className="button">
            Write a new story <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/dashboard/posts" className="button button-secondary">
            Manage my posts
          </Link>
        </div>
      </section>
      <aside className="workspace-note">
        <span className="section-label">A note on publishing</span>
        <p>
          Your new stories begin as private drafts. When you are ready, publish
          them from My posts to share them with readers.
        </p>
      </aside>
    </>
  );
}
