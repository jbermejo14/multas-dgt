import type { NextConfig } from "next";

// Debe coincidir con BASE_PATH de src/lib/site.ts (lo comprueba test/site.test.ts).
// No se importa de allí porque Next compila este fichero a ESM y no resuelve
// importaciones TypeScript sin extensión.
const BASE_PATH = "/es/multas";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
