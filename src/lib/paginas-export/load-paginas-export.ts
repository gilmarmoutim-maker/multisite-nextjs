import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PAGINAS_EXPORT_CSV_FILENAME } from "./constants";
import type { PaginaExportRawRow, PaginaExportRow } from "./types";

export function getPaginasExportCsvPath(
  cwd: string = process.cwd(),
): string {
  return path.join(cwd, "data", PAGINAS_EXPORT_CSV_FILENAME);
}

function normalizeRow(raw: PaginaExportRawRow): PaginaExportRow {
  const id = Number.parseInt(raw.id, 10);
  if (!Number.isFinite(id)) {
    throw new Error(`ID de página inválido no CSV: ${JSON.stringify(raw.id)}`);
  }
  return {
    id,
    title: raw.Title?.trim() ?? "",
    content: raw.Content ?? "",
  };
}

/** Lê e faz parse do CSV de páginas (campos multilinha com HTML). */
export async function loadPaginasExport(
  cwd: string = process.cwd(),
): Promise<PaginaExportRow[]> {
  const filePath = getPaginasExportCsvPath(cwd);
  const raw = await readFile(filePath, "utf8");
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    bom: true,
  }) as PaginaExportRawRow[];

  return records.map(normalizeRow);
}

export async function loadPaginasExportById(
  cwd?: string,
): Promise<Map<number, PaginaExportRow>> {
  const rows = await loadPaginasExport(cwd);
  return new Map(rows.map((row) => [row.id, row]));
}

export async function findPaginaByTitle(
  title: string,
  cwd?: string,
): Promise<PaginaExportRow | undefined> {
  const normalized = title.trim().toLowerCase();
  const rows = await loadPaginasExport(cwd);
  return rows.find((row) => row.title.trim().toLowerCase() === normalized);
}
