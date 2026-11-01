import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { credentials } from "../../../../lib/credentials";
import { COOKIE_NAME, SESSION_SECONDS, createToken } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const input = credentials(body);
  if (!input) return NextResponse.json({ error: "Provide a valid email and password." }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !await compare(input.password, user.hashedPassword)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const token = await createToken(user.id);
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Login failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Login is temporarily unavailable." }, { status: 500 });
  }
}
