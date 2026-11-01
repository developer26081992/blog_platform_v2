import Link from "next/link";
import AuthForm from "../auth-form";

export default function Register() {
  return (
    <main id="main-content" className="auth-page">
      <section className="auth-story">
        <span className="eyebrow">Every voice has a place</span>
        <h1>
          Make room
          <br />
          for <em>your ideas.</em>
        </h1>
        <p>
          Join a journal built around curiosity. Find your voice, shape your
          story, and share it with the world.
        </p>
        <div className="auth-story-bottom">
          SOMETHING WORTH SAYING STARTS HERE.
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="register-title">
        <span className="eyebrow">Start your story</span>
        <h2 id="register-title">Create an account</h2>
        <p>A new space for your perspective.</p>
        <AuthForm mode="register" />
        <div className="auth-switch">
          Already a writer here? <Link href="/login">Log in</Link>
        </div>
        <Link href="/" className="auth-back">
          <span aria-hidden="true">←</span> Back to reading
        </Link>
      </section>
    </main>
  );
}
