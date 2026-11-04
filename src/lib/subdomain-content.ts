import { resolvePaginaForHostContext } from "@/lib/paginas-export/resolve-pagina";

export type SubdomainContentPayload = {
  subdomain: string;
  originalPath: string;
  html?: string;
  meta?: Record<string, string>;
};

export async function loadSubdomainContent(
  subdomain: string,
  originalPath: string,
): Promise<SubdomainContentPayload> {
  const pagina = await resolvePaginaForHostContext({
    subdomainLabel: subdomain,
    originalPath,
  });

  if (!pagina) {
    return { subdomain, originalPath, html: undefined, meta: {} };
  }

  return {
    subdomain,
    originalPath,
    html: pagina.content,
    meta: { title: pagina.title, paginaId: String(pagina.id) },
  };
}
