import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export const AUTH_COOKIE = "auth-token";

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
