import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="The Journal home">
          <span className="brand-symbol" aria-hidden="true">
            j.
          </span>
          <span>
            The Journal
            <span className="brand-caption">A PLACE FOR PERSPECTIVE</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/" className="nav-link">
            The journal
          </Link>
          <Link href="/dashboard/posts" className="nav-link workspace-link">
            My workspace
          </Link>
          <Link href="/login" className="nav-link login-link">
            Log in
          </Link>
          <Link href="/dashboard/posts/new" className="button button-small">
            Write a story <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
