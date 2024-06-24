import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const url = req.nextUrl;

  if (url.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (!token && url.pathname !== "/login") {
    return NextResponse.redirect(
      new URL(`/login?redirect=${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}

// Define the paths where the middleware will apply
export const config = {
  matcher: ["/login", "/profile"],
};
