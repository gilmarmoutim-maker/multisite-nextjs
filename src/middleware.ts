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

  // Endereço IP do servidor Plesk/WordPress original
  const PLESK_SERVER_IP = '177.104.179.81';

  // Se for o domínio principal ou um subdomínio, faz o Proxy Reverso para o Plesk
  if (isApexHost(host) || extractSubdomainLabel(host)) {
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `http://${PLESK_SERVER_IP}`);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("host", host);
    requestHeaders.set("x-forwarded-host", host);

    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};