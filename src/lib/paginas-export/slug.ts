/** Normaliza caminho público (sem query), com barra inicial e sem barra final (exceto `/`). */
export function normalizePublicPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  let path = pathname.trim();
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+/g, "/");
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

/** Slug estilo WordPress a partir do título (fallback quando não há rota explícita). */
export function slugifyTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
