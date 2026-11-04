import { recomposeOriginalPath } from "@/lib/platform";
import { loadSubdomainContent } from "@/lib/subdomain-content";

type SubdomainCatchAllProps = {
  params: Promise<{ subdomain: string; slug: string[] }>;
};

export default async function SubdomainCatchAllPage({
  params,
}: SubdomainCatchAllProps) {
  const { subdomain, slug } = await params;
  const originalPath = recomposeOriginalPath(slug);
  const content = await loadSubdomainContent(subdomain, originalPath);

  if (content.html) {
    return (
      <div
        className="subdomain-legacy-root"
        data-subdomain={subdomain}
        data-path={originalPath}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  return (
    <main
      className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16"
      data-subdomain={subdomain}
      data-path={originalPath}
    >
      <p className="text-sm uppercase tracking-wide text-zinc-500">Subdomínio</p>
      <h1 className="mt-2 text-3xl font-semibold">{subdomain}</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Caminho original preservado:{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          {originalPath}
        </code>
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Injete HTML/dados em{" "}
        <code className="rounded bg-black/5 px-1 dark:bg-white/10">
          loadSubdomainContent(subdomain, originalPath)
        </code>
        .
      </p>
    </main>
  );
}
