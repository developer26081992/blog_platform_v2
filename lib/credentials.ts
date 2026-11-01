export function credentials(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") return null;
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return null;
  // bcrypt uses at most 72 bytes; reject longer inputs rather than truncate.
  if (!password.length || new TextEncoder().encode(password).length > 72) return null;
  return { email: normalizedEmail, password };
}
