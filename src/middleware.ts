import { auth } from "@/auth";
import type { UserRole } from "@/types/next-auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role: UserRole = req.auth?.user?.role ?? "user";
  const { pathname } = req.nextUrl;

  // ── Protect all /admin routes (including /admin/login) ────────────────
  if (pathname.startsWith("/admin")) {
    // Must be logged in and have admin or superadmin role
    if (!isLoggedIn || (role !== "admin" && role !== "superadmin")) {
      return Response.redirect(new URL("/", req.nextUrl));
    }

    // Redirect legacy /admin/login to /admin for authenticated admins
    if (pathname === "/admin/login") {
      return Response.redirect(new URL("/admin", req.nextUrl));
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
