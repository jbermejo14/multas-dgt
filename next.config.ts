import type { NextConfig } from "next";

// Debe coincidir con BASE_PATH de src/lib/site.ts (lo comprueba test/site.test.ts).
// No se importa de allí porque Next compila este fichero a ESM y no resuelve
// importaciones TypeScript sin extensión.
const BASE_PATH = "/es/multas";

// Exportación estática: el sitio se publica como ficheros en Cloudflare Pages (ver ../ododex-sitio).
// cacheComponents y partialPrefetching se quitaron porque son incompatibles con la
// configuración `dynamic` que exige el sitemap al exportar, y sin servidor no aportan nada.
const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  output: "export",
};

export default nextConfig;
