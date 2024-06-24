import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const url = req.nextUrl;

  if (url.pathname === "/login" && token) {
    // Redirect to /profile if the token cookie exists and the current route is /login
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Define the paths where the middleware will apply
export const config = {
  matcher: ["/login"],
};
