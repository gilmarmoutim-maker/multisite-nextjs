import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Domínios customizados (apex + wildcard) são roteados pelo middleware via Host. */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
    "/subdomains/[subdomain]": ["./data/**/*"],
    "/subdomains/[subdomain]/[...slug]": ["./data/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
