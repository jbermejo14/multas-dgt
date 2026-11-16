import type { MetadataRoute } from "next";
import { INFRACTIONS_DATA } from "@/data/infractions";
import { getAllProvinces, getAllRadars } from "@/lib/radarsData";
import { getCanonicalUrl } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getCanonicalUrl("/radares"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 2. Infractions pages (/multas/[slug])
  const infractionPages: MetadataRoute.Sitemap = INFRACTIONS_DATA.map((inf) => ({
    url: getCanonicalUrl(`/multas/${inf.slug}`),
    lastModified: inf.fechaVerificacion || currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 3. Province radar pages (/radares/[provincia])
  const provinces = getAllProvinces();
  const provincePages: MetadataRoute.Sitemap = provinces.map((p) => ({
    url: getCanonicalUrl(`/radares/${p.slug}`),
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 4. Road radar pages (/radares/[provincia]/[carretera])
  const allRadars = getAllRadars();
  const roadPairs = new Map<string, { prov: string; road: string }>();
  for (const r of allRadars) {
    const key = `${r.provinciaSlug}/${r.carreteraSlug}`;
    if (!roadPairs.has(key)) {
      roadPairs.set(key, { prov: r.provinciaSlug, road: r.carreteraSlug });
    }
  }

  const roadPages: MetadataRoute.Sitemap = Array.from(roadPairs.values()).map(
    ({ prov, road }) => ({
      url: getCanonicalUrl(`/radares/${prov}/${road}`),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  // 5. Radar detail pages (/radares/radar/[id])
  const radarPages: MetadataRoute.Sitemap = allRadars.map((r) => ({
    url: getCanonicalUrl(`/radares/radar/${r.id}`),
    lastModified: r.fechaPublicacion || currentDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...infractionPages,
    ...provincePages,
    ...roadPages,
    ...radarPages,
  ];
}
