import type { Metadata } from "next";
import { MigratedPaginaView } from "@/components/MigratedPaginaView";
import {
  getMigratedPaginaOrNotFound,
  hostScopeLabel,
} from "@/lib/migrated-page";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getMigratedPaginaOrNotFound(null, "/");
  return { title: pagina.title };
}

export default async function ApexHomePage() {
  const pagina = await getMigratedPaginaOrNotFound(null, "/");
  return (
    <MigratedPaginaView
      pagina={pagina}
      hostScope={hostScopeLabel(null)}
      originalPath="/"
    />
  );
}
