import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/db";
import { credentials } from "../../../../lib/credentials";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const input = credentials(body);
  const name = body && typeof body === "object" ? (body as Record<string, unknown>).name : undefined;
  if (!input || typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: "Provide a name, valid email, and password of at most 72 bytes." }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { name: name.trim(), email: input.email, hashedPassword: await hash(input.password, 12) },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }
    console.error("Registration failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 500 });
  }
}
