import { auth } from "@/auth";
import type { UserRole } from "@/types/next-auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role: UserRole = req.auth?.user?.role ?? "user";
  const { pathname } = req.nextUrl;

  // ── Protect all /admin routes (including /admin/login) ────────────────
  if (pathname.startsWith("/admin")) {
    const adminRoles: UserRole[] = ["admin", "superadmin", "pastor", "leader"];
    // Must be logged in and have an administrative role
    if (!isLoggedIn || !adminRoles.includes(role)) {
      return Response.redirect(new URL("/", req.nextUrl));
    }

    // Redirect legacy /admin/login to /admin for authenticated admins
    if (pathname === "/admin/login") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }

    // Only superadmin and pastors/admins can access /admin/usuarios and /admin/configuracion
    if (
      (pathname.startsWith("/admin/usuarios") || pathname.startsWith("/admin/configuracion")) &&
      role !== "superadmin" &&
      role !== "admin" &&
      role !== "pastor"
    ) {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }

    return null;
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
