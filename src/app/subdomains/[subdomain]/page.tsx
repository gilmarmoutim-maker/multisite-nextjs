import { loadSubdomainContent } from "@/lib/subdomain-content";

type SubdomainHomeProps = {
  params: Promise<{ subdomain: string }>;
};

export default async function SubdomainHomePage({ params }: SubdomainHomeProps) {
  const { subdomain } = await params;
  const content = await loadSubdomainContent(subdomain, "/");

  if (content.html) {
    return (
      <div
        className="subdomain-legacy-root"
        data-subdomain={subdomain}
        data-path="/"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  return (
    <main
      className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16"
      data-subdomain={subdomain}
      data-path="/"
    >
      <p className="text-sm uppercase tracking-wide text-zinc-500">Subdomínio</p>
      <h1 className="mt-2 text-3xl font-semibold">{subdomain}</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Home do subdomínio — pronta para receber o conteúdo migrado (
        <code className="rounded bg-black/5 px-1 dark:bg-white/10">loadSubdomainContent</code>
        ).
      </p>
    </main>
  );
}
