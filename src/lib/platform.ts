/** Domínio raiz da plataforma (sem protocolo, sem barra). Configure via env na Vercel. */
export const PLATFORM_APEX_DOMAIN =
  process.env.PLATFORM_APEX_DOMAIN ?? "seudominio.com.br";

export function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

export function isApexHost(host: string, apex = PLATFORM_APEX_DOMAIN): boolean {
  const root = apex.toLowerCase();
  return host === root || host === `www.${root}`;
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
