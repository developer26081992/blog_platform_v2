import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch { /* Missing, expired, or invalid JWTs must not reach the dashboard. */ }
  }
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
