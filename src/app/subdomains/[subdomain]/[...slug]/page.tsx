import type { Metadata } from "next";
import { MigratedPaginaView } from "@/components/MigratedPaginaView";
import { recomposeOriginalPath } from "@/lib/platform";
import {
  getMigratedPaginaOrNotFound,
  hostScopeLabel,
} from "@/lib/migrated-page";

export const instant = false;

type SubdomainCatchAllProps = {
  params: Promise<{ subdomain: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: SubdomainCatchAllProps): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const originalPath = recomposeOriginalPath(slug);
  const pagina = await getMigratedPaginaOrNotFound(subdomain, originalPath);
  return { title: pagina.title };
}

export default async function SubdomainCatchAllPage({
  params,
}: SubdomainCatchAllProps) {
  const { subdomain, slug } = await params;
  const originalPath = recomposeOriginalPath(slug);
  const pagina = await getMigratedPaginaOrNotFound(subdomain, originalPath);

  return (
    <MigratedPaginaView
      pagina={pagina}
      hostScope={hostScopeLabel(subdomain)}
      originalPath={originalPath}
    />
  );
}
