/**
 * Configuración global del sitio y funciones helper para SEO
 */

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "https://radarpuntos.es";
}

export function getCanonicalUrl(path: string = "/"): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") {
    return `${base}/`;
  }
  return `${base}${cleanPath}`;
}
