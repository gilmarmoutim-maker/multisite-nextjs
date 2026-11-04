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
