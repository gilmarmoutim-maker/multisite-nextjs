/** Domínio raiz (apex) canônico — ex.: pgmp.com.br. Defina na Vercel: PLATFORM_APEX_DOMAIN. */
export const PLATFORM_APEX_DOMAIN =
  process.env.PLATFORM_APEX_DOMAIN ?? "pgmp.com.br";

/** Se não for `false`, redireciona www → apex (308). Apex funciona sem www. */
export const PLATFORM_REDIRECT_WWW_TO_APEX =
  process.env.PLATFORM_REDIRECT_WWW_TO_APEX !== "false";

export function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

/**
 * Host público da requisição. Com apex em registo A (ex.: 76.76.21.21 na Vercel),
 * o DNS entrega o IP, mas o roteamento usa sempre o cabeçalho Host / X-Forwarded-Host.
 */
export function resolveRequestHost(
  hostHeader: string | null,
  forwardedHostHeader: string | null,
): string | null {
  const direct = normalizeHost(hostHeader);
  if (direct) return direct;
  if (!forwardedHostHeader) return null;
  const first = forwardedHostHeader.split(",")[0]?.trim() ?? "";
  return normalizeHost(first);
}

export function resolveRequestProtocol(
  forwardedProtoHeader: string | null,
  fallbackProtocol: string,
): "http" | "https" {
  const raw =
    forwardedProtoHeader?.split(",")[0]?.trim() ??
    fallbackProtocol.replace(/:$/, "");
  return raw === "http" ? "http" : "https";
}

/** URL canônica no apex (308 www → apex), preservando path, query e HTTPS na Vercel. */
export function buildApexCanonicalUrl(
  apex: string,
  pathname: string,
  search: string,
  protocol: "http" | "https",
): URL {
  return new URL(`${pathname}${search}`, `${protocol}://${apex}`);
}

export function apexHostname(apex = PLATFORM_APEX_DOMAIN): string {
  return apex.toLowerCase();
}

export function wwwApexHostname(apex = PLATFORM_APEX_DOMAIN): string {
  return `www.${apexHostname(apex)}`;
}

export function isWwwApexHost(host: string, apex = PLATFORM_APEX_DOMAIN): boolean {
  return host === wwwApexHostname(apex);
}

export function isApexHost(host: string, apex = PLATFORM_APEX_DOMAIN): boolean {
  const root = apexHostname(apex);
  return host === root || host === wwwApexHostname(apex);
}

/** Hosts de preview/deploy Vercel (não são subdomínios da plataforma). */
export function isVercelSystemHost(host: string): boolean {
  return (
    host.endsWith(".vercel.app") ||
    host === "localhost" ||
    host.endsWith(".localhost")
  );
}

/**
 * Retorna o rótulo do subdomínio (parte antes de `.${apex}`), ou null se for apex/outro host.
 */
export function extractSubdomainLabel(
  host: string,
  apex = PLATFORM_APEX_DOMAIN,
): string | null {
  const root = apex.toLowerCase();
  const suffix = `.${root}`;
  if (!host.endsWith(suffix)) return null;
  const label = host.slice(0, -suffix.length);
  if (!label || label.includes(".")) return null;
  return label;
}

/** Recompõe o caminho público original a partir do segmento catch-all. */
export function recomposeOriginalPath(slug: string[] | undefined): string {
  if (!slug?.length) return "/";
  return `/${slug.map(decodeURIComponent).join("/")}`;
}
