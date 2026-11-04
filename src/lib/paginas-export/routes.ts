import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { normalizePublicPath, slugifyTitle } from "./slug";
import type { PaginaExportRow } from "./types";
import { loadPaginasExport } from "./load-paginas-export";

export type PaginaRouteBinding = {
  paginaId: number;
  /** `apex` para domínio raiz ou rótulo do subdomínio (ex.: `limpafossabetimmg`). */
  host: string;
  path: string;
};

type PaginasRoutesFile = {
  bindings: PaginaRouteBinding[];
};

export type PaginaRouteKey = `${string}:${string}`;

function routeKey(host: string, publicPath: string): PaginaRouteKey {
  return `${host}:${normalizePublicPath(publicPath)}`;
}

async function readBindingsFile(cwd: string): Promise<PaginaRouteBinding[]> {
  const filePath = path.join(cwd, "data", "paginas-routes.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as PaginasRoutesFile;
    if (!Array.isArray(parsed.bindings)) return [];
    return parsed.bindings.map((b) => ({
      paginaId: b.paginaId,
      host: b.host.trim().toLowerCase(),
      path: normalizePublicPath(b.path),
    }));
  } catch {
    return [];
  }
}

function inferApexBindingsFromCsv(rows: PaginaExportRow[]): PaginaRouteBinding[] {
  const bindings: PaginaRouteBinding[] = [];
  for (const row of rows) {
    const titleLower = row.title.trim().toLowerCase();
    if (titleLower === "pgmp" || row.id === 5794) {
      bindings.push({ paginaId: row.id, host: "apex", path: "/" });
      continue;
    }
    bindings.push({
      paginaId: row.id,
      host: "apex",
      path: `/${slugifyTitle(row.title)}`,
    });
  }
  return bindings;
}

export type PaginasRouteIndex = {
  byHostAndPath: Map<PaginaRouteKey, number>;
  byPaginaId: Map<number, PaginaExportRow>;
};

export const loadPaginasRouteIndex = cache(
  async (cwd: string = process.cwd()): Promise<PaginasRouteIndex> => {
    const rows = await loadPaginasExport(cwd);
    const byPaginaId = new Map(rows.map((row) => [row.id, row]));

    let bindings = await readBindingsFile(cwd);
    if (bindings.length === 0) {
      bindings = inferApexBindingsFromCsv(rows);
    }

    const byHostAndPath = new Map<PaginaRouteKey, number>();
    for (const binding of bindings) {
      if (!byPaginaId.has(binding.paginaId)) continue;
      byHostAndPath.set(routeKey(binding.host, binding.path), binding.paginaId);
    }

    return { byHostAndPath, byPaginaId };
  },
);
