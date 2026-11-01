import Link from "next/link";
import AuthForm from "../auth-form";

export default function Login() {
  return (
    <main id="main-content" className="auth-page">
      <section className="auth-story">
        <span className="eyebrow">Your next chapter</span>
        <h1>
          Good to
          <br />
          have you <em>back.</em>
        </h1>
        <p>
          A place for your ideas, your drafts, and the stories only you can
          tell.
        </p>
        <div className="auth-story-bottom">
          A LITTLE CURIOSITY GOES A LONG WAY.
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="login-title">
        <span className="eyebrow">The writer&apos;s workspace</span>
        <h2 id="login-title">Log in</h2>
        <p>Pick up where your last idea left off.</p>
        <AuthForm mode="login" />
        <div className="auth-switch">
          New to the journal? <Link href="/register">Create an account</Link>
        </div>
        <Link href="/" className="auth-back">
          <span aria-hidden="true">←</span> Back to reading
        </Link>
      </section>
    </main>
  );
}
