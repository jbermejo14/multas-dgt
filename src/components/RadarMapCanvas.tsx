"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DgtRadar } from "@/lib/radarsData";
import type { RoadSpeedLimit } from "@/types";
import { getRadarSpeedLimit } from "@/lib/radarMapFilters";
import {
  RADAR_MAP_LIMIT_ATTRIBUTE,
  RADAR_MAP_MARKER_BORDER,
  RADAR_MAP_MARKER_RADIUS,
  RADAR_MAP_TYPE_COLORS,
  buildRadarPopupHtml,
  buildRadarTooltipHtml,
} from "@/lib/radarMapMarkers";
import {
  RADAR_MAP_FLY_DURATION_SECONDS,
  RADAR_MAP_MAX_ZOOM,
  RADAR_MAP_MIN_ZOOM,
  RADAR_MAP_SPAIN_CENTER,
  RADAR_MAP_SPAIN_ZOOM,
  RADAR_MAP_TILE_SOURCES,
  type RadarMapLayerType,
} from "@/lib/radarMapTiles";

type LeafletModule = typeof Leaflet;

/** Vista a la que debe volar el mapa. Un objeto nuevo provoca un nuevo vuelo. */
export interface RadarMapFocus {
  center: [number, number];
  zoom: number;
}

interface RadarMapCanvasProps {
  radars: DgtRadar[];
  layer: RadarMapLayerType;
  focus: RadarMapFocus | null;
  onSelectLimit?: (limit: RoadSpeedLimit) => void;
}

const RADAR_MAP_MARKER_FILL_OPACITY = 0.9;
const RADAR_MAP_MARKER_BORDER_WEIGHT = 2;
const RADAR_MAP_ZOOM_CONTROL_POSITION = "topright";

function radarMapCreateTileLayer(L: LeafletModule, layer: RadarMapLayerType): Leaflet.TileLayer {
  const source = RADAR_MAP_TILE_SOURCES[layer];
  return L.tileLayer(source.url, {
    attribution: source.attribution,
    maxZoom: source.maxZoom,
    subdomains: source.subdomains,
  });
}

function radarMapCreateMarker(
  L: LeafletModule,
  radar: DgtRadar,
  onSelectLimit: (limit: RoadSpeedLimit) => void,
): Leaflet.CircleMarker {
  const limit = getRadarSpeedLimit(radar);
  const marker = L.circleMarker([radar.lat, radar.lng], {
    radius: RADAR_MAP_MARKER_RADIUS,
    fillColor: RADAR_MAP_TYPE_COLORS[radar.tipo],
    fillOpacity: RADAR_MAP_MARKER_FILL_OPACITY,
    color: RADAR_MAP_MARKER_BORDER,
    weight: RADAR_MAP_MARKER_BORDER_WEIGHT,
  });
  marker.bindTooltip(buildRadarTooltipHtml(radar), { direction: "top" });
  marker.bindPopup(buildRadarPopupHtml(radar, limit));
  if (limit !== null) {
    // El botón se recrea en cada apertura del popup, así que se engancha en cada apertura.
    marker.on("popupopen", (event: Leaflet.PopupEvent) => {
      const button = event.popup.getElement()?.querySelector(`[${RADAR_MAP_LIMIT_ATTRIBUTE}]`);
      button?.addEventListener("click", () => onSelectLimit(limit));
    });
  }
  return marker;
}

/** Propietario del mapa Leaflet: crea el mapa una vez y sincroniza capa base, marcadores y vista. */
export function RadarMapCanvas({ radars, layer, focus, onSelectLimit }: RadarMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const tileLayerRef = useRef<Leaflet.TileLayer | null>(null);
  const markersRef = useRef<Leaflet.LayerGroup | null>(null);
  const onSelectLimitRef = useRef(onSelectLimit);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onSelectLimitRef.current = onSelectLimit;
  }, [onSelectLimit]);

  useEffect(() => {
    let isMounted = true;
    import("leaflet").then((module) => {
      if (!isMounted || !containerRef.current) return;
      const L = module.default;
      const map = L.map(containerRef.current, {
        center: RADAR_MAP_SPAIN_CENTER,
        zoom: RADAR_MAP_SPAIN_ZOOM,
        minZoom: RADAR_MAP_MIN_ZOOM,
        maxZoom: RADAR_MAP_MAX_ZOOM,
        zoomControl: false,
        preferCanvas: true,
      });
      L.control.zoom({ position: RADAR_MAP_ZOOM_CONTROL_POSITION }).addTo(map);
      markersRef.current = L.layerGroup().addTo(map);
      leafletRef.current = L;
      mapRef.current = map;
      setIsReady(true);
    });
    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!isReady || !L || !map) return;
    tileLayerRef.current?.remove();
    tileLayerRef.current = radarMapCreateTileLayer(L, layer).addTo(map);
  }, [isReady, layer]);

  useEffect(() => {
    const L = leafletRef.current;
    const group = markersRef.current;
    if (!isReady || !L || !group) return;
    const handleSelect = (limit: RoadSpeedLimit) => onSelectLimitRef.current?.(limit);
    group.clearLayers();
    radars.forEach((radar) => group.addLayer(radarMapCreateMarker(L, radar, handleSelect)));
  }, [isReady, radars]);

  useEffect(() => {
    if (!isReady || !focus) return;
    mapRef.current?.flyTo(focus.center, focus.zoom, { duration: RADAR_MAP_FLY_DURATION_SECONDS });
  }, [isReady, focus]);

  return (
    <div className="relative h-[540px] w-full md:h-[620px]">
      <div ref={containerRef} className="absolute inset-0" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-elevated text-sm text-muted">
          Cargando mapa y radares...
        </div>
      )}
    </div>
  );
}
