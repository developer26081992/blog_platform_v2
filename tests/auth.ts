import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { compare, getRounds } from "bcryptjs";
import { SignJWT } from "jose/jwt/sign";
import { prisma } from "../lib/db";

const base = process.argv[2] ?? "http://localhost:3000";
const email = `auth-test-${randomUUID()}@example.com`;
const password = "ExamTest123!";
const post = (path: string, body: unknown) => fetch(`${base}${path}`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});
async function denied(cookie?: string, path = "/dashboard") {
  const response = await fetch(`${base}${path}`, {
    redirect: "manual", headers: cookie ? { cookie } : {},
  });
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")!, base).pathname, "/login");
}

try {
  await denied();
  await denied(undefined, "/dashboard/settings");
  await denied("blog_session=invalid");
  const malformed = await fetch(`${base}/api/auth/register`, { method: "POST", body: "{" });
  assert.equal(malformed.status, 400);
  assert.equal((await post("/api/auth/register", { name: "Test", email: "invalid", password })).status, 400);
  assert.equal((await post("/api/auth/register", { name: "Test", email, password: "a".repeat(73) })).status, 400);
  const registration = await post("/api/auth/register", { name: "Auth Test", email: email.toUpperCase(), password });
  assert.equal(registration.status, 201);
  const registered = await registration.json();
  assert.equal(registered.user.email, email);
  assert.ok(!("hashedPassword" in registered.user));
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  assert.equal(getRounds(user.hashedPassword), 12);
  assert.ok(await compare(password, user.hashedPassword));
  assert.equal((await post("/api/auth/register", { name: "Duplicate", email, password })).status, 409);
  assert.equal((await post("/api/auth/login", { email, password: "wrong" })).status, 401);
  const login = await post("/api/auth/login", { email, password });
  assert.equal(login.status, 200);
  const result = await login.json();
  assert.ok(!("token" in result) && !("hashedPassword" in result.user));
  const cookieHeader = login.headers.get("set-cookie")!;
  assert.match(cookieHeader, /HttpOnly/i);
  assert.match(cookieHeader, /SameSite=lax/i);
  assert.match(cookieHeader, /Path=\//i);
  assert.match(cookieHeader, /Max-Age=86400/i);
  assert.match(cookieHeader, /Secure/i);
  const cookie = cookieHeader.split(";")[0];
  assert.equal((await fetch(`${base}/dashboard`, { headers: { cookie }, redirect: "manual" })).status, 200);
  assert.equal((await fetch(`${base}/dashboard/settings`, { headers: { cookie }, redirect: "manual" })).status, 404);
  const key = new TextEncoder().encode(process.env.JWT_SECRET!);
  const expired = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(user.id)
    .setIssuer("blog-platform-v2").setAudience("blog-platform-v2")
    .setIssuedAt(Math.floor(Date.now() / 1000) - 120).setExpirationTime(Math.floor(Date.now() / 1000) - 60).sign(key);
  await denied(`blog_session=${expired}`);
  const token = cookie.slice(cookie.indexOf("=") + 1);
  const pieces = token.split(".");
  pieces[2] = (pieces[2][0] === "a" ? "b" : "a") + pieces[2].slice(1);
  await denied(`blog_session=${pieces.join(".")}`);
  console.log("PASS: register, bcrypt cost 12, duplicate email, invalid input, login, HttpOnly/Secure cookie, dashboard protection, nested paths, expired and tampered JWTs.");
} finally {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
}
