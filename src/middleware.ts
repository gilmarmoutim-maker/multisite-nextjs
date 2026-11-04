import { NextRequest, NextResponse } from "next/server";
import {
  extractSubdomainLabel,
  isApexHost,
  normalizeHost,
  PLATFORM_APEX_DOMAIN,
} from "@/lib/platform";

export function middleware(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host"));
  if (!host) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/subdomains/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (isApexHost(host)) {
    return NextResponse.next();
  }

  const subdomain = extractSubdomainLabel(host);
  if (!subdomain) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname =
    pathname === "/"
      ? `/subdomains/${subdomain}`
      : `/subdomains/${subdomain}${pathname}`;

  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-platform-host", host);
  response.headers.set("x-platform-subdomain", subdomain);
  response.headers.set("x-platform-apex", PLATFORM_APEX_DOMAIN);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
