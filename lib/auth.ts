import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const COOKIE_NAME = "blog_session";
export const SESSION_SECONDS = 60 * 60 * 24;

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || new TextEncoder().encode(secret).length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer("blog-platform-v2")
    .setAudience("blog-platform-v2")
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(signingKey());
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, signingKey(), {
    algorithms: ["HS256"],
    issuer: "blog-platform-v2",
    audience: "blog-platform-v2",
    requiredClaims: ["sub", "iat", "exp"],
  });
  if (!payload.sub) throw new Error("Invalid session subject.");
  return payload.sub;
}
