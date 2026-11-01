import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { COOKIE_NAME, verifyToken } from "../../lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  try { await verifyToken(token); }
  catch { redirect("/login"); }
  return <main><nav><Link href="/">Home</Link>{" | "}<Link href="/dashboard">Dashboard</Link>{" | "}<Link href="/dashboard/posts">My posts</Link></nav>{children}</main>;
}
