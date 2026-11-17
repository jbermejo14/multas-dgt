// Sin capas de CARTO: sus basemaps exigen ahora clave de API y devuelven teselas de aviso.
export type RadarMapLayerType = "osm" | "sat";

export interface RadarMapTileSource {
  label: string;
  title: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
}

const RADAR_MAP_OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const RADAR_MAP_TILE_SOURCES: Record<RadarMapLayerType, RadarMapTileSource> = {
  osm: {
    label: "OSM",
    title: "Capa OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: RADAR_MAP_OSM_ATTRIBUTION,
    maxZoom: 19,
    subdomains: "abc",
  },
  sat: {
    label: "Satélite",
    title: "Fotografía satélite",
    url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Fuente: Esri, Maxar, Earthstar Geographics and the GIS User Community",
    maxZoom: 18,
  },
};

export const RADAR_MAP_LAYER_ORDER: RadarMapLayerType[] = ["osm", "sat"];

/** Capa inicial del mapa en los dos temas. */
export const RADAR_MAP_DEFAULT_LAYER: RadarMapLayerType = "osm";

export const RADAR_MAP_SPAIN_CENTER: [number, number] = [40.2, -3.7];
export const RADAR_MAP_SPAIN_ZOOM = 6;
export const RADAR_MAP_MIN_ZOOM = 5;
export const RADAR_MAP_MAX_ZOOM = 19;
export const RADAR_MAP_RADAR_ZOOM = 14;
export const RADAR_MAP_FLY_DURATION_SECONDS = 0.9;

export interface RadarMapRegionShortcut {
  label: string;
  title: string;
  center: [number, number];
  zoom: number;
}

export const RADAR_MAP_REGION_SHORTCUTS: RadarMapRegionShortcut[] = [
  { label: "Madrid", title: "Centrar en Madrid", center: [40.4168, -3.7038], zoom: 11 },
  { label: "Barcelona", title: "Centrar en Barcelona", center: [41.3879, 2.1699], zoom: 11 },
  { label: "Andalucía", title: "Centrar en Málaga y Cádiz", center: [36.7212, -4.4214], zoom: 9 },
  { label: "Galicia", title: "Centrar en Vigo", center: [42.2406, -8.7207], zoom: 10 },
];
