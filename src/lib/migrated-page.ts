import { notFound } from "next/navigation";
import { resolvePaginaForHost } from "@/lib/paginas-export/resolve-pagina";
import type { PaginaExportRow } from "@/lib/paginas-export";

export async function getMigratedPaginaOrNotFound(
  subdomainLabel: string | null,
  originalPath: string,
): Promise<PaginaExportRow> {
  const pagina = await resolvePaginaForHost(subdomainLabel, originalPath);
  if (!pagina) notFound();
  return pagina;
}

export function hostScopeLabel(subdomainLabel: string | null): string {
  return subdomainLabel ?? "apex";
}
