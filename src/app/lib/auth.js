import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_JWT_SECRET || "portfolio-admin-super-secret-2025";
const ADMIN_USER = process.env.ADMIN_USERNAME || "Akmal";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "Akmal@542";

export function verifyCredentials(username, password) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function isValidSession(session) {
  return session && session.role === "admin";
}
