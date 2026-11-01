"use client";
import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page-shell not-found">
      <span className="eyebrow">A brief interruption</span>
      <h1>Let&apos;s turn the page.</h1>
      <p>
        We couldn&apos;t load this page right now. Please try again in a moment.
      </p>
      <div className="welcome-actions" style={{ justifyContent: "center" }}>
        <button className="button" onClick={reset}>
          Try again <span aria-hidden="true">↗</span>
        </button>
        <Link href="/" className="button button-secondary">
          Back to the journal
        </Link>
      </div>
    </main>
  );
}
