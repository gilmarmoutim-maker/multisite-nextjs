import { cache } from "react";
import { normalizePublicPath } from "./slug";
import { loadPaginasRouteIndex } from "./routes";
import type { PaginaExportRow } from "./types";

export type PaginaHostContext = {
  /** `null` = domínio apex (principal). */
  subdomainLabel: string | null;
  originalPath: string;
};

function hostScope(subdomainLabel: string | null): string {
  return subdomainLabel ? subdomainLabel.toLowerCase() : "apex";
}

export const resolvePaginaForHost = cache(
  async (
    subdomainLabel: string | null,
    originalPath: string,
    cwd?: string,
  ): Promise<PaginaExportRow | null> => {
    const index = await loadPaginasRouteIndex(cwd);
    const path = normalizePublicPath(originalPath);
    const scope = hostScope(subdomainLabel);
    const paginaId = index.byHostAndPath.get(`${scope}:${path}`);
    if (paginaId == null) return null;
    return index.byPaginaId.get(paginaId) ?? null;
  },
);

export async function resolvePaginaForHostContext(
  context: PaginaHostContext,
  cwd?: string,
): Promise<PaginaExportRow | null> {
  return resolvePaginaForHost(context.subdomainLabel, context.originalPath, cwd);
}
