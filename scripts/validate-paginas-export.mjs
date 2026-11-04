import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = path.join(
  root,
  "data",
  "Paginas-Export-2026-novembro-04-1414.csv",
);

const raw = await readFile(csvPath, "utf8");
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  bom: true,
});

console.log(`paginas-export: ${rows.length} linha(s)`);
for (const row of rows) {
  console.log(`  - id=${row.id} title=${JSON.stringify(row.Title)}`);
}
