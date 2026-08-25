import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // Root /admin route -> redirect to login if no token, else to dashboard
  if (pathname === "/admin") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Protecting /admin/dashboard -> redirect to login if no token
  if (pathname.startsWith("/admin/dashboard") && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Redirect away from login if already logged in
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
