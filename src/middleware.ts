import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const url = req.nextUrl;

  if (url.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (!token && url.pathname !== "/") {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  const res = NextResponse.next();

  return res;
}

// Define the paths where the middleware will apply
export const config = {
  matcher: ["/", "/profile", "/year"],
};
