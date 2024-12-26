import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the path starts with /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const isAuthenticated = request.cookies.get("admin_authenticated");

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/dashboard/:path*", // Matches /dashboard and all routes after it
};
