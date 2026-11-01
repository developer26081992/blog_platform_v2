"use client";

import { useState, type FormEvent } from "react";

export default function AuthForm({ mode }: { mode: "register" | "login" }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Request failed.");
        return;
      }
      window.location.assign(mode === "register" ? "/login" : "/dashboard");
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {mode === "register" && (
        <div className="field">
          <label htmlFor="auth-name">Name</label>
          <input
            id="auth-name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            maxLength={100}
            required
          />
        </div>
      )}
      <div className="field">
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={
            mode === "register" ? "new-password" : "current-password"
          }
          placeholder={
            mode === "register" ? "Choose a password" : "Enter your password"
          }
          required
        />
      </div>
      <button className="button form-button" disabled={pending}>
        {pending
          ? "Please wait…"
          : mode === "register"
            ? "Create account"
            : "Log in"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-message" role="status">
        {message}
      </p>
    </form>
  );
}
