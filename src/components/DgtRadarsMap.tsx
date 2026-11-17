"use client";

import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { DgtRadar } from "@/lib/radarsData";
import { escapeHtml, RADAR_MAP_MARKER_BORDER, RADAR_MAP_TYPE_COLORS } from "@/lib/radarMapMarkers";
import "leaflet/dist/leaflet.css";

const DGT_MAP_DEFAULT_CENTER: [number, number] = [40.4168, -3.7038];
const DGT_MAP_FIT_PADDING: [number, number] = [30, 30];
const DGT_MAP_FIT_MAX_ZOOM = 14;
const DGT_MAP_HIGHLIGHT_COLOR = "#e11d48";
const DGT_MAP_HIGHLIGHT_HALO = "rgba(225, 29, 72, 0.4)";
const DGT_MAP_MARKER_TEXT_COLOR = "#ffffff";
const DGT_MAP_TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DGT_MAP_MAX_ZOOM = 19;

interface DgtRadarsMapProps {
  radars: DgtRadar[];
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightId?: string;
  className?: string;
}

function dgtMapAverageCenter(radars: DgtRadar[]): [number, number] {
  if (radars.length === 0) return DGT_MAP_DEFAULT_CENTER;
  const latitude = radars.reduce((sum, radar) => sum + radar.lat, 0) / radars.length;
  const longitude = radars.reduce((sum, radar) => sum + radar.lng, 0) / radars.length;
  return [latitude, longitude];
}

function dgtMapMarkerHtml(radar: DgtRadar, isHighlighted: boolean): string {
  const background = isHighlighted ? DGT_MAP_HIGHLIGHT_COLOR : RADAR_MAP_TYPE_COLORS[radar.tipo];
  const halo = isHighlighted
    ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${DGT_MAP_HIGHLIGHT_HALO};"></div>`
    : "";
  return `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      ${halo}
      <div style="width: 26px; height: 26px; border-radius: 50%; background: ${background}; border: 2px solid ${RADAR_MAP_MARKER_BORDER}; display: flex; align-items: center; justify-content: center; color: ${DGT_MAP_MARKER_TEXT_COLOR}; font-weight: 800; font-size: 10px; font-family: monospace;">
        ${radar.tipo === "Tramo" ? "TR" : "RAD"}
      </div>
    </div>
  `;
}

function dgtMapPopupHtml(radar: DgtRadar): string {
  const limit = radar.velocidadEstimada
    ? `<div><strong>Límite genérico vía:</strong> ${radar.velocidadEstimada} km/h</div>`
    : "";
  return `
    <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: var(--text-primary); min-width: 180px; padding: 0.5rem 0.75rem;">
      <div style="font-weight: 800; font-size: 13px; color: var(--accent-primary); margin-bottom: 3px;">
        ${escapeHtml(radar.carretera)} &bull; PK ${escapeHtml(radar.pk)}
      </div>
      <div><strong>Tipo:</strong> Radar de ${radar.tipo}</div>
      <div><strong>Sentido:</strong> ${escapeHtml(radar.sentido)}</div>
      <div><strong>Provincia:</strong> ${escapeHtml(radar.provincia)}</div>
      ${limit}
      <div style="margin-top: 4px; font-size: 10px; color: var(--text-muted);">Fuente oficial: DGT NAP</div>
    </div>
  `;
}

export function DgtRadarsMap({
  radars,
  initialCenter,
  initialZoom = 9,
  highlightId,
  className = "h-[450px] w-full rounded-2xl",
}: DgtRadarsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let map: LeafletMap | null = null;

    async function buildMap() {
      const L = (await import("leaflet")).default;
      if (isCancelled || !mapContainerRef.current) return;

      map = L.map(mapContainerRef.current, {
        center: initialCenter ?? dgtMapAverageCenter(radars),
        zoom: initialZoom,
        scrollWheelZoom: true,
      });
      L.tileLayer(DGT_MAP_TILES_URL, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: DGT_MAP_MAX_ZOOM,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      for (const radar of radars) {
        const isHighlighted = highlightId === radar.id;
        const icon = L.divIcon({
          html: dgtMapMarkerHtml(radar, isHighlighted),
          className: "custom-dgt-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });
        const marker = L.marker([radar.lat, radar.lng], { icon }).bindPopup(dgtMapPopupHtml(radar));
        marker.addTo(map);
        bounds.extend([radar.lat, radar.lng]);
        if (isHighlighted) marker.openPopup();
      }

      if (radars.length > 1 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: DGT_MAP_FIT_PADDING, maxZoom: DGT_MAP_FIT_MAX_ZOOM });
      }
    }

    void buildMap();
    return () => {
      isCancelled = true;
      map?.remove();
    };
  }, [radars, initialCenter, initialZoom, highlightId]);

  return (
    <div className="isolate">
      <div ref={mapContainerRef} className={`${className} overflow-hidden border border-line bg-elevated`} />
    </div>
  );
}
