import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="footer-brand">
          The Journal.
        </Link>
        <p>A home for thoughtful writing.</p>
      </div>
      <div className="footer-links">
        <Link href="/">Explore the journal</Link>
        <Link href="/dashboard/posts/new">
          Share your perspective <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <span className="footer-note">READ. REFLECT. WRITE.</span>
    </footer>
  );
}
