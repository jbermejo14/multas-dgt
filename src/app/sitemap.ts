import type { MetadataRoute } from "next";
import { INFRACTIONS_DATA } from "@/data/infractions";
import { getAllProvinces, getAllRadars } from "@/lib/radarsData";
import { absoluteUrl } from "@/lib/site";

// Con `output: "export"` el sitemap debe declararse estático para generarse en el build.
export const dynamic = "force-static";

const STATIC_PAGES: ReadonlyArray<{ path: string; priority: number }> = [
  { path: "/", priority: 1.0 },
  { path: "/radares", priority: 0.9 },
];

/**
 * Páginas indexables. Las fichas individuales de radar (/radares/radar/[id]) llevan
 * noindex y por eso no aparecen aquí; tampoco las páginas legales.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority,
  }));

  const infractionPages: MetadataRoute.Sitemap = INFRACTIONS_DATA.map((inf) => ({
    url: absoluteUrl(`/multas/${inf.slug}`),
    lastModified: inf.fechaVerificacion || currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const provincePages: MetadataRoute.Sitemap = getAllProvinces().map((p) => ({
    url: absoluteUrl(`/radares/${p.slug}`),
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const roadPairs = new Map<string, { prov: string; road: string }>();
  for (const r of getAllRadars()) {
    const key = `${r.provinciaSlug}/${r.carreteraSlug}`;
    if (!roadPairs.has(key)) {
      roadPairs.set(key, { prov: r.provinciaSlug, road: r.carreteraSlug });
    }
  }

  const roadPages: MetadataRoute.Sitemap = Array.from(roadPairs.values()).map(
    ({ prov, road }) => ({
      url: absoluteUrl(`/radares/${prov}/${road}`),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...infractionPages, ...provincePages, ...roadPages];
}
