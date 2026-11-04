import type { Metadata } from "next";
import { MigratedPaginaView } from "@/components/MigratedPaginaView";
import { recomposeOriginalPath } from "@/lib/platform";
import {
  getMigratedPaginaOrNotFound,
  hostScopeLabel,
} from "@/lib/migrated-page";

export const instant = false;

type ApexCatchAllProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: ApexCatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  const originalPath = recomposeOriginalPath(slug);
  const pagina = await getMigratedPaginaOrNotFound(null, originalPath);
  return { title: pagina.title };
}

export default async function ApexCatchAllPage({ params }: ApexCatchAllProps) {
  const { slug } = await params;
  const originalPath = recomposeOriginalPath(slug);
  const pagina = await getMigratedPaginaOrNotFound(null, originalPath);

  return (
    <MigratedPaginaView
      pagina={pagina}
      hostScope={hostScopeLabel(null)}
      originalPath={originalPath}
    />
  );
}
