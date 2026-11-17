import type { DgtRadar } from "@/lib/radarsData";
import { AVAILABLE_LIMITS } from "@/lib/speedFine";
import type { RoadSpeedLimit } from "@/types";

/** Valor del filtro que no restringe ni por provincia ni por carretera. */
export const RADAR_MAP_ALL_ROADS = "Todas";
/** Valor del filtro que no restringe por tipo de radar. */
export const RADAR_MAP_ALL_TYPES = "Todos";

export type RadarMapTypeFilter = typeof RADAR_MAP_ALL_TYPES | DgtRadar["tipo"];

export interface RadarMapFilters {
  provincia: string;
  carretera: string;
  tipo: RadarMapTypeFilter;
  query: string;
}

export const RADAR_MAP_DEFAULT_FILTERS: RadarMapFilters = {
  provincia: RADAR_MAP_ALL_ROADS,
  carretera: RADAR_MAP_ALL_ROADS,
  tipo: RADAR_MAP_ALL_TYPES,
  query: "",
};

function radarMapNormalize(text: string): string {
  return text.trim().toLowerCase();
}

function radarMapMatchesQuery(radar: DgtRadar, query: string): boolean {
  if (query === "") return true;
  const haystack = [radar.carretera, radar.provincia, radar.pk].map(radarMapNormalize);
  return haystack.some((field) => field.includes(query));
}

/** Devuelve los radares que cumplen todos los filtros activos. */
export function filterRadars(radars: DgtRadar[], filters: RadarMapFilters): DgtRadar[] {
  const query = radarMapNormalize(filters.query);
  return radars.filter(
    (radar) =>
      (filters.provincia === RADAR_MAP_ALL_ROADS || radar.provincia === filters.provincia) &&
      (filters.carretera === RADAR_MAP_ALL_ROADS || radar.carretera === filters.carretera) &&
      (filters.tipo === RADAR_MAP_ALL_TYPES || radar.tipo === filters.tipo) &&
      radarMapMatchesQuery(radar, query),
  );
}

function radarMapSortedUnique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "es"));
}

/** Provincias disponibles, ordenadas alfabéticamente. */
export function getProvinceOptions(radars: DgtRadar[]): string[] {
  return radarMapSortedUnique(radars.map((radar) => radar.provincia));
}

/** Carreteras disponibles; si hay provincia elegida, solo las de esa provincia. */
export function getRoadOptions(radars: DgtRadar[], provincia: string): string[] {
  const inScope =
    provincia === RADAR_MAP_ALL_ROADS ? radars : radars.filter((radar) => radar.provincia === provincia);
  return radarMapSortedUnique(inScope.map((radar) => radar.carretera));
}

/**
 * Límite para la calculadora a partir de `velocidadEstimada`.
 * Devuelve null si falta o no es un límite que la calculadora admita.
 */
export function getRadarSpeedLimit(radar: Pick<DgtRadar, "velocidadEstimada">): RoadSpeedLimit | null {
  const estimated = radar.velocidadEstimada;
  return AVAILABLE_LIMITS.find((limit) => limit === estimated) ?? null;
}
