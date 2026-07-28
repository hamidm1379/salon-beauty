import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/* ─── Route Definitions ─── */
const routes = {
  public: ["/admin/login", "/api/auth/login"],
  publicGet: ["/api/blog", "/api/blog-categories", "/api/categories", "/api/settings", "/api/services"],
  publicPost: ["/api/contact"],
  adminOnly: ["/admin/users", "/admin/settings"],
} as const;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/* ─── Helpers ─── */
function matchesAny(pathname: string, patterns: readonly string[]) {
  return patterns.some((p) => pathname.startsWith(p));
}

function isPublicPath(pathname: string) {
  return matchesAny(pathname, routes.public);
}

function isDashboardPath(pathname: string) {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

function isAdminApiPath(pathname: string) {
  return pathname.startsWith("/api/") && !pathname.startsWith("/api/auth");
}

function isPublicGetMethod(pathname: string, method: string) {
  return method === "GET" && matchesAny(pathname, routes.publicGet);
}

function isPublicPostMethod(pathname: string, method: string) {
  return method === "POST" && matchesAny(pathname, routes.publicPost);
}

function isAdminOnlyPath(pathname: string) {
  return matchesAny(pathname, routes.adminOnly);
}

/* ─── Middleware ─── */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  const origin = request.nextUrl.origin;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isDashboardPath(pathname) && !isAdminApiPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicGetMethod(pathname, method)) {
    return NextResponse.next();
  }

  if (isPublicPostMethod(pathname, method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return unauthorizedResponse(origin, pathname);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "salon-api",
    });

    const role = payload.role as string;

    if (isAdminOnlyPath(pathname) && role !== "ADMIN") {
      return forbiddenResponse(origin, pathname);
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId as string);
    response.headers.set("x-user-role", role);
    return response;
  } catch {
    return unauthorizedResponse(origin, pathname);
  }
}

/* ─── Response Helpers ─── */
function unauthorizedResponse(origin: string, pathname: string) {
  if (isDashboardPath(pathname)) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }
  return NextResponse.json(
    { success: false, message: "Not authenticated" },
    { status: 401 }
  );
}

function forbiddenResponse(origin: string, pathname: string) {
  if (isDashboardPath(pathname)) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }
  return NextResponse.json(
    { success: false, message: "Forbidden: Admin access required" },
    { status: 403 }
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
