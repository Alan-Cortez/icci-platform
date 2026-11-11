import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect all /admin routes: require authentication at the edge.
  // Authoritative role & active-status checks are enforced live against Turso
  // in AdminLayout (getCurrentAdminUser) and each page's requireRole(), so newly
  // promoted leaders/pastors get immediate access without waiting for JWT refresh.
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl));
    }

    if (pathname === "/admin/login") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }

    return null;
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
