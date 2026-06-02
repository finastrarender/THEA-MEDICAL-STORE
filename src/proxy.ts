import { auth } from "@/auth";

/** Next.js 16+ proxy (formerly middleware) — must be the auth handler directly, not a wrapper. */
export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
