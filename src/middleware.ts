import { auth } from "@/auth";
import type { UserRole } from "@/types/next-auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role: UserRole = req.auth?.user?.role ?? "user";
  const { pathname } = req.nextUrl;

  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginRoute;

  // ── Admin login page ──────────────────────────────────────────────────
  // If already logged in as admin/superadmin → redirect to panel
  // If logged in as regular user → redirect to home
  if (isLoginRoute) {
    if (isLoggedIn) {
      const dest = role === "admin" || role === "superadmin" ? "/admin" : "/";
      return Response.redirect(new URL(dest, req.nextUrl));
    }
    return null;
  }

  // ── Admin panel ───────────────────────────────────────────────────────
  if (isAdminRoute) {
    // Must be logged in
    if (!isLoggedIn) {
      return Response.redirect(new URL("/admin/login", req.nextUrl));
    }

    // Must have admin or superadmin role (given by another admin in the panel)
    if (role !== "admin" && role !== "superadmin") {
      return Response.redirect(new URL("/", req.nextUrl));
    }

    // Only superadmin can access /admin/usuarios
    if (pathname.startsWith("/admin/usuarios") && role !== "superadmin") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }

    return null;
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|public).*)"],
};
