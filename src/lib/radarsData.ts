import rawRadars from "@/data/dgt-radars.json";

export interface DgtRadar {
  id: string;
  dgtLocationId: string;
  provincia: string;
  provinciaSlug: string;
  carretera: string;
  carreteraSlug: string;
  pk: string;
  sentido: string;
  tipo: "Fijo" | "Tramo";
  lat: number;
  lng: number;
  singularity: string;
  velocidadEstimada: number | null;
  fuente: string;
  fechaPublicacion: string;
}

const radars: DgtRadar[] = rawRadars as DgtRadar[];

export function getAllRadars(): DgtRadar[] {
  return radars;
}

export function getRadarById(id: string): DgtRadar | undefined {
  return radars.find((r) => r.id === id);
}

export interface ProvinceSummary {
  name: string;
  slug: string;
  totalRadars: number;
  roadsCount: number;
}

export function getAllProvinces(): ProvinceSummary[] {
  const map = new Map<string, { name: string; roads: Set<string>; count: number }>();
  
  for (const r of radars) {
    if (!map.has(r.provinciaSlug)) {
      map.set(r.provinciaSlug, { name: r.provincia, roads: new Set(), count: 0 });
    }
    const item = map.get(r.provinciaSlug)!;
    item.count += 1;
    item.roads.add(r.carreteraSlug);
  }

  return Array.from(map.entries())
    .map(([slug, data]) => ({
      name: data.name,
      slug,
      totalRadars: data.count,
      roadsCount: data.roads.size,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function getProvinceBySlug(slug: string): ProvinceSummary | undefined {
  return getAllProvinces().find((p) => p.slug === slug);
}

export function getRadarsByProvince(provinceSlug: string): DgtRadar[] {
  return radars.filter((r) => r.provinciaSlug === provinceSlug);
}

export interface RoadSummary {
  name: string;
  slug: string;
  totalRadars: number;
}

export function getRoadsByProvince(provinceSlug: string): RoadSummary[] {
  const provRadars = getRadarsByProvince(provinceSlug);
  const map = new Map<string, { name: string; count: number }>();

  for (const r of provRadars) {
    if (!map.has(r.carreteraSlug)) {
      map.set(r.carreteraSlug, { name: r.carretera, count: 0 });
    }
    map.get(r.carreteraSlug)!.count += 1;
  }

  return Array.from(map.entries())
    .map(([slug, data]) => ({
      name: data.name,
      slug,
      totalRadars: data.count,
    }))
    .sort((a, b) => b.totalRadars - a.totalRadars || a.name.localeCompare(b.name, "es"));
}

export function getRadarsByRoad(provinceSlug: string, roadSlug: string): DgtRadar[] {
  return radars.filter(
    (r) => r.provinciaSlug === provinceSlug && r.carreteraSlug === roadSlug
  );
}

export function getRoadInfo(provinceSlug: string, roadSlug: string) {
  const matches = getRadarsByRoad(provinceSlug, roadSlug);
  if (matches.length === 0) return undefined;
  return {
    roadName: matches[0].carretera,
    provinceName: matches[0].provincia,
    totalRadars: matches.length,
  };
}
