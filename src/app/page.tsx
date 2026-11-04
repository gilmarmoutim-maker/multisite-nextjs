import { PLATFORM_APEX_DOMAIN } from "@/lib/platform";

export default function ApexHomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Domínio principal</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Esta rota atende{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          {PLATFORM_APEX_DOMAIN}
        </code>{" "}
        e{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          www.{PLATFORM_APEX_DOMAIN}
        </code>
        . Subdomínios são reescritos internamente pelo middleware, sem alterar a URL
        no navegador.
      </p>
    </main>
  );
}
