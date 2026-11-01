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
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error ?? "Request failed."); return; }
      window.location.assign(mode === "register" ? "/login" : "/dashboard");
    } catch { setMessage("Unable to connect. Please try again."); }
    finally { setPending(false); }
  }

  return <form onSubmit={submit}>
    {mode === "register" && <p><label>Name <input name="name" autoComplete="name" maxLength={100} required /></label></p>}
    <p><label>Email <input name="email" type="email" autoComplete="email" required /></label></p>
    <p><label>Password <input name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required /></label></p>
    <button disabled={pending}>{pending ? "Please wait…" : mode === "register" ? "Register" : "Log in"}</button>
    <p role="status">{message}</p>
  </form>;
}
