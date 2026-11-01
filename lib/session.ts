import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyToken } from "./auth";
import { prisma } from "./db";

export async function requireUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  let id: string;
  try { id = await verifyToken(token); }
  catch { redirect("/login"); }
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!user) redirect("/login");
  return user;
}
