import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell not-found">
      <span className="eyebrow">404 / A page out of place</span>
      <h1>This story isn&apos;t here.</h1>
      <p>
        It may have moved, or it might still be a work in progress. There is
        more to discover in the journal.
      </p>
      <Link href="/" className="button">
        Back to the journal <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
