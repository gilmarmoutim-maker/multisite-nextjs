import type { Metadata } from "next";
import { MigratedPaginaView } from "@/components/MigratedPaginaView";
import {
  getMigratedPaginaOrNotFound,
  hostScopeLabel,
} from "@/lib/migrated-page";

export const instant = false;

type SubdomainHomeProps = {
  params: Promise<{ subdomain: string }>;
};

export async function generateMetadata({
  params,
}: SubdomainHomeProps): Promise<Metadata> {
  const { subdomain } = await params;
  const pagina = await getMigratedPaginaOrNotFound(subdomain, "/");
  return { title: pagina.title };
}

export default async function SubdomainHomePage({ params }: SubdomainHomeProps) {
  const { subdomain } = await params;
  const pagina = await getMigratedPaginaOrNotFound(subdomain, "/");

  return (
    <MigratedPaginaView
      pagina={pagina}
      hostScope={hostScopeLabel(subdomain)}
      originalPath="/"
    />
  );
}
