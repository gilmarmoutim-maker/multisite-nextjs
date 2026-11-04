/**
 * Ponto de extensão para injetar HTML ou dados migrados por subdomínio + caminho.
 * Substitua o corpo desta função por leitura de filesystem, CMS ou snapshot estático.
 */
export type SubdomainContentPayload = {
  subdomain: string;
  originalPath: string;
  /** HTML completo do legado, quando disponível */
  html?: string;
  /** Metadados opcionais (título, etc.) */
  meta?: Record<string, string>;
};

export async function loadSubdomainContent(
  subdomain: string,
  originalPath: string,
): Promise<SubdomainContentPayload> {
  return {
    subdomain,
    originalPath,
    html: undefined,
    meta: {},
  };
}
