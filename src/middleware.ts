import { NextRequest, NextResponse } from "next/server";
import {
  apexHostname,
  buildApexCanonicalUrl,
  extractSubdomainLabel,
  isApexHost,
  isVercelSystemHost,
  isWwwApexHost,
  PLATFORM_APEX_DOMAIN,
  PLATFORM_REDIRECT_WWW_TO_APEX,
  resolveRequestHost,
  resolveRequestProtocol,
} from "@/lib/platform";

export function middleware(request: NextRequest) {
  const host = resolveRequestHost(
    request.headers.get("host"),
    request.headers.get("x-forwarded-host"),
  );
  if (!host) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/subdomains/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const apex = apexHostname();

  if (PLATFORM_REDIRECT_WWW_TO_APEX && isWwwApexHost(host)) {
    const protocol = resolveRequestProtocol(
      request.headers.get("x-forwarded-proto"),
      request.nextUrl.protocol,
    );
    const redirectUrl = buildApexCanonicalUrl(
      apex,
      pathname,
      search,
      protocol,
    );
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (isApexHost(host)) {
    const response = NextResponse.next();
    response.headers.set("x-platform-host", host);
    response.headers.set("x-platform-apex", PLATFORM_APEX_DOMAIN);
    response.headers.set("x-platform-scope", "apex");
    return response;
  }

  if (isVercelSystemHost(host)) {
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
  response.headers.set("x-platform-scope", "subdomain");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
