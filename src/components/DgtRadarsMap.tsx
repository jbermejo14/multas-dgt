"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { DgtRadar } from "@/lib/radarsData";
import "leaflet/dist/leaflet.css";

interface DgtRadarsMapProps {
  radars: DgtRadar[];
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightId?: string;
  className?: string;
}

export function DgtRadarsMap({
  radars,
  initialCenter,
  initialZoom = 9,
  highlightId,
  className = "h-[450px] w-full rounded-2xl",
}: DgtRadarsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const L = (await import("leaflet")).default;

    // Calculate default center if not provided
    let centerLat = initialCenter ? initialCenter[0] : 40.4168;
    let centerLng = initialCenter ? initialCenter[1] : -3.7038;

    if (!initialCenter && radars.length > 0) {
      const avgLat = radars.reduce((sum, r) => sum + r.lat, 0) / radars.length;
      const avgLng = radars.reduce((sum, r) => sum + r.lng, 0) / radars.length;
      centerLat = avgLat;
      centerLng = avgLng;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: initialZoom,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Add markers
    const bounds = L.latLngBounds([]);

    radars.forEach((radar) => {
      const isTramo = radar.tipo === "Tramo";
      const isHighlighted = highlightId === radar.id;

      const markerBg = isHighlighted
        ? "#e11d48"
        : isTramo
        ? "#ea580c"
        : "#ff6b00";

      const markerHtml = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${
            isHighlighted
              ? '<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(225, 29, 72, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>'
              : ""
          }
          <div style="width: 26px; height: 26px; border-radius: 50%; background: ${markerBg}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 10px; font-family: monospace;">
            ${isTramo ? "TR" : "RAD"}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-dgt-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([radar.lat, radar.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #171717; min-width: 180px;">
          <div style="font-weight: 800; font-size: 13px; color: #ff6b00; margin-bottom: 3px;">
            ${radar.carretera} &bull; PK ${radar.pk}
          </div>
          <div><strong>Tipo:</strong> Radar de ${radar.tipo}</div>
          <div><strong>Sentido:</strong> ${radar.sentido}</div>
          <div><strong>Provincia:</strong> ${radar.provincia}</div>
          ${
            radar.velocidadEstimada
              ? `<div><strong>Límite genérico vía:</strong> ${radar.velocidadEstimada} km/h</div>`
              : ""
          }
          <div style="margin-top: 4px; font-size: 10px; color: #737373;">
            Fuente oficial: DGT NAP
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersGroup.addLayer(marker);
      bounds.extend([radar.lat, radar.lng]);

      if (isHighlighted) {
        marker.openPopup();
      }
    });

    if (radars.length > 1 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }
  }, [radars, initialCenter, initialZoom, highlightId]);

  useEffect(() => {
    if (isClient) {
      initMap();
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, initMap]);

  if (!isClient) {
    return (
      <div
        className={`${className} bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center`}
      >
        <span className="text-sm text-neutral-400">Cargando mapa interactivo...</span>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={`${className} border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-inner z-0`}
    />
  );
}
