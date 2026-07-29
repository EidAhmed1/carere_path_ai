import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const isAuthed = Boolean(cookie) && cookie === process.env.ADMIN_SESSION_SECRET;

  // Protect the admin UI itself (but not the login page, or you could never log in).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthed) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect any request that changes data. Reading (GET) stays public
  // so the homepage can always load the paths.
  const isPathsApi = pathname === "/api/paths" || pathname.startsWith("/api/paths/");
  if (isPathsApi && ["POST", "PUT", "DELETE"].includes(method)) {
    if (!isAuthed) {
      return NextResponse.json({ error: "غير مصرح. سجّل الدخول من /admin أولاً." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/paths", "/api/paths/:path*"],
};
