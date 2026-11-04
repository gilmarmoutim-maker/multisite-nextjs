import type { PaginaExportRow } from "@/lib/paginas-export";

type MigratedPaginaViewProps = {
  pagina: PaginaExportRow;
  hostScope: string;
  originalPath: string;
};

export function MigratedPaginaView({
  pagina,
  hostScope,
  originalPath,
}: MigratedPaginaViewProps) {
  return (
    <article
      className="migrated-wp-page"
      data-pagina-id={pagina.id}
      data-host-scope={hostScope}
      data-path={originalPath}
      dangerouslySetInnerHTML={{ __html: pagina.content }}
    />
  );
}
