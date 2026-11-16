"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { RADARS_DATA } from "@/data/radars";
import { RadarData, RadarType, RoadSpeedLimit } from "@/types";
import {
  MapPin,
  Filter,
  Navigation,
  Gauge,
  Radio,
  Search,
  CheckCircle,
  ExternalLink,
  Layers,
  Flame,
  Trophy,
  AlertOctagon,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

interface RadarMapProps {
  onSelectRadarLimit?: (limit: RoadSpeedLimit) => void;
}

export function RadarMap({ onSelectRadarLimit }: RadarMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedProvincia, setSelectedProvincia] = useState<string>("Todas");
  const [selectedCarretera, setSelectedCarretera] = useState<string>("Todas");
  const [selectedTipo, setSelectedTipo] = useState<string>("Todos");
  const [onlyTopMultas, setOnlyTopMultas] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [selectedRadar, setSelectedRadar] = useState<RadarData | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Compute unique provinces and roads
  const provincias = useMemo(() => {
    const set = new Set<string>();
    RADARS_DATA.forEach((r) => set.add(r.provincia));
    return ["Todas", ...Array.from(set).sort()];
  }, []);

  const carreteras = useMemo(() => {
    const set = new Set<string>();
    RADARS_DATA.forEach((r) => {
      if (selectedProvincia === "Todas" || r.provincia === selectedProvincia) {
        set.add(r.carretera);
      }
    });
    return ["Todas", ...Array.from(set).sort()];
  }, [selectedProvincia]);

  // Top 10 radars specifically for quick ranking table
  const top10Radars = useMemo(() => {
    return [...RADARS_DATA]
      .filter((r) => r.esTopMultas && r.rankingMasMultas)
      .sort((a, b) => (a.rankingMasMultas || 99) - (b.rankingMasMultas || 99))
      .slice(0, 10);
  }, []);

  // Filtered dataset
  const filteredRadars = useMemo(() => {
    return RADARS_DATA.filter((radar) => {
      const matchTop = !onlyTopMultas || radar.esTopMultas;
      const matchProvincia =
        selectedProvincia === "Todas" || radar.provincia === selectedProvincia;
      const matchCarretera =
        selectedCarretera === "Todas" || radar.carretera === selectedCarretera;
      const matchTipo =
        selectedTipo === "Todos" || radar.tipo === selectedTipo;
      const matchSearch =
        searchQuery === "" ||
        radar.carretera.toLowerCase().includes(searchQuery.toLowerCase()) ||
        radar.ubicacion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        radar.provincia.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTop && matchProvincia && matchCarretera && matchTipo && matchSearch;
    });
  }, [onlyTopMultas, selectedProvincia, selectedCarretera, selectedTipo, searchQuery]);

  // Initialize and maintain Leaflet Map
  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    let isSubscribed = true;

    import("leaflet").then((leafletModule) => {
      if (!isSubscribed) return;
      L = leafletModule.default || leafletModule;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const isDark = document.documentElement.classList.contains("dark");
        const tileUrl = isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

        const map = L.map(mapContainerRef.current, {
          center: [40.2, -3.7],
          zoom: 6,
          minZoom: 5,
          maxZoom: 18,
          scrollWheelZoom: true,
        });

        L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
      }

      // Re-populate markers
      if (markersLayerRef.current && mapInstanceRef.current) {
        markersLayerRef.current.clearLayers();

        filteredRadars.forEach((radar) => {
          const isTop = radar.esTopMultas;

          // Custom Marker HTML
          const markerHtml = `
            <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              ${
                isTop
                  ? `<div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: radar-pulse 1.5s infinite ease-out;"></div>`
                  : `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 107, 0, 0.25); animation: radar-pulse 2s infinite ease-out;"></div>`
              }
              <div style="width: ${isTop ? "32px" : "28px"}; height: ${isTop ? "32px" : "28px"}; border-radius: 50%; background: ${
                isTop ? "#dc2626" : "#ff6b00"
              }; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: ${
                isTop ? "10px" : "10px"
              }; font-family: monospace;">
                ${isTop ? `<span style="font-size: 8px; line-height: 1;">🔥#${radar.rankingMasMultas}</span>` : ""}
                <span style="line-height: 1;">${radar.velocidad_limite}</span>
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: "custom-radar-marker",
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
          });

          const marker = L.marker([radar.lat, radar.lng], { icon: customIcon });

          const popupHtml = `
            <div style="padding: 14px; min-width: 240px; font-family: sans-serif;">
              ${
                isTop
                  ? `<div style="background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px; padding: 4px 8px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                      <span style="color: #ef4444; font-weight: 800; font-size: 11px;">🔥 RANKING #${radar.rankingMasMultas} EN ESPAÑA</span>
                      <span style="font-size: 10px; color: #888; font-weight: bold;">~${radar.multasAnualesAprox?.toLocaleString()} multas/año</span>
                    </div>`
                  : ""
              }
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: bold; background: rgba(255,107,0,0.15); color: #ff6b00; padding: 2px 8px; border-radius: 6px;">
                  ${radar.tipo}
                </span>
                <span style="font-size: 12px; font-weight: 900; color: #ff6b00; font-family: monospace;">
                  Límite: ${radar.velocidad_limite} km/h
                </span>
              </div>
              <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800;">
                ${radar.carretera} - PK ${radar.pk}
              </h4>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #888; line-height: 1.3;">
                ${radar.ubicacion} (${radar.provincia})
              </p>
              <div style="font-size: 11px; color: #aaa; margin-bottom: 10px;">
                Sentido: <strong>${radar.sentido}</strong>
              </div>
              <button 
                onclick="window.radarPuntosSelectLimit && window.radarPuntosSelectLimit(${radar.velocidad_limite})"
                style="width: 100%; background: #ff6b00; color: white; border: none; padding: 8px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;"
              >
                Calcular sanción para este radar
              </button>
            </div>
          `;

          marker.bindPopup(popupHtml);
          marker.on("click", () => {
            setSelectedRadar(radar);
          });

          markersLayerRef.current.addLayer(marker);
        });

        if (filteredRadars.length > 0) {
          const group = L.featureGroup(markersLayerRef.current.getLayers());
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
        }
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [filteredRadars, isClient]);

  // Hook global function so popup button can trigger calculator
  useEffect(() => {
    (window as any).radarPuntosSelectLimit = (limit: RoadSpeedLimit) => {
      if (onSelectRadarLimit) {
        onSelectRadarLimit(limit);
        const calcElement = document.getElementById("calculadora");
        if (calcElement) {
          calcElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
  }, [onSelectRadarLimit]);

  const handleZoomToRadar = (radar: RadarData) => {
    setSelectedRadar(radar);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([radar.lat, radar.lng], 13, { duration: 1.2 });
    }
    const mapElement = document.getElementById("leaflet-map-element");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Module Header and Filters */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 mb-2">
            <Radio className="w-3.5 h-3.5" />
            Red Oficial de Cinemómetros en España
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Buscador y Mapa de Radares DGT
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Localiza radares fijos, de tramo, de semáforo y <strong>los cinemómetros que más multas emiten en España</strong> según datos oficiales de la DGT y Automovilistas Europeos Asociados (AEA).
          </p>
        </div>

        {/* Quick Filter: TOP RADARES QUE MÁS MULTAN TOGGLE BUTTON */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setOnlyTopMultas(!onlyTopMultas)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              onlyTopMultas
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105 border-2 border-red-500"
                : "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/30"
            }`}
          >
            <Flame className={`w-4 h-4 ${onlyTopMultas ? "animate-bounce" : "text-red-500"}`} />
            <span>{onlyTopMultas ? "✓ Filtrando: Top Radares que Más Multan" : "🔥 Ver los Radares que Más Multan de España"}</span>
          </button>

          {onlyTopMultas && (
            <button
              onClick={() => {
                setOnlyTopMultas(false);
                setSelectedProvincia("Todas");
                setSelectedCarretera("Todas");
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline"
            >
              Mostrar todos los radares
            </button>
          )}
        </div>

        {/* Standard Filters Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Provincia */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Provincia
            </label>
            <select
              value={selectedProvincia}
              onChange={(e) => {
                setSelectedProvincia(e.target.value);
                setSelectedCarretera("Todas");
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            >
              {provincias.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === "Todas" ? "Todas las provincias" : prov}
                </option>
              ))}
            </select>
          </div>

          {/* Carretera */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Carretera / Vía
            </label>
            <select
              value={selectedCarretera}
              onChange={(e) => setSelectedCarretera(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            >
              {carreteras.map((car) => (
                <option key={car} value={car}>
                  {car === "Todas" ? "Todas las carreteras" : car}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de radar */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Tipo de cinemómetro
            </label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Fijo">Radar Fijo de cabina / pórtico</option>
              <option value="Tramo">Radar de Tramo</option>
              <option value="Semáforo">Semáforo (Foto-Rojo)</option>
            </select>
          </div>

          {/* Search box */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Buscar por PK o vía
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ej: A-381, A-7, M-30, km 74..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
          <span>{filteredRadars.length} cinemómetros localizados</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-red-500 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              Radares Top Sancionadores (Rojo)
            </span>
            <span className="flex items-center gap-1 text-[#ff6b00] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] inline-block"></span>
              Radares Convencionales (Naranja)
            </span>
          </div>
        </div>
      </div>

      {/* TOP 10 RADARES SPOTLIGHT RANKING BANNER */}
      <div className="p-6 md:p-8 rounded-2xl border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 via-amber-500/5 to-red-500/10 dark:from-red-950/20 dark:via-[#141414] dark:to-red-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                Ranking Oficial: Los Radares que Más Multan en España
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Los 10 cinemómetros con mayor recaudación y número de denuncias según el informe anual de AEA y DGT.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {top10Radars.slice(0, 5).map((r) => (
            <div
              key={r.id}
              onClick={() => handleZoomToRadar(r)}
              className="p-3.5 rounded-xl border border-red-500/30 bg-white/80 dark:bg-neutral-900/80 hover:border-red-500 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                  Puesto #{r.rankingMasMultas}
                </span>
                <span className="text-xs font-black font-mono text-[#ff6b00]">
                  {r.velocidad_limite} km/h
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors">
                {r.carretera} pk {r.pk}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {r.provincia}
              </p>
              <div className="mt-2 text-[11px] font-mono font-bold text-red-600 dark:text-red-400">
                ~{r.multasAnualesAprox?.toLocaleString()} multas/año
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[480px] md:h-[550px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-900">
        {!isClient ? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-400">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#ff6b00] animate-spin" />
              <span>Cargando mapa interactivo...</span>
            </div>
          </div>
        ) : (
          <div id="leaflet-map-element" ref={mapContainerRef} className="w-full h-full" />
        )}

        <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg border border-neutral-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Haz clic en los puntos rojos y naranjas para ver ubicación y sanción estimada
          </div>
        </div>
      </div>

      {/* Table of Filtered Radars */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6b00]" />
            Listado Detallado de Cinemómetros ({filteredRadars.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Ordenado con prioridad a los radares más activos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Ranking / Denuncias</th>
                <th className="py-2.5 px-3">Vía / PK</th>
                <th className="py-2.5 px-3">Provincia</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Límite</th>
                <th className="py-2.5 px-3">Sentido</th>
                <th className="py-2.5 px-3">Ubicación exacta</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredRadars.map((radar) => (
                <tr
                  key={radar.id}
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors group cursor-pointer ${
                    radar.esTopMultas ? "bg-red-500/[0.03] dark:bg-red-950/10" : ""
                  }`}
                  onClick={() => handleZoomToRadar(radar)}
                >
                  <td className="py-3 px-3">
                    {radar.esTopMultas ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 whitespace-nowrap">
                        🔥 Top #{radar.rankingMasMultas} ({radar.multasAnualesAprox?.toLocaleString()} multas)
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Estándar</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                    {radar.carretera} <span className="text-neutral-400 font-normal">pk {radar.pk}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">
                    {radar.provincia}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {radar.tipo}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black font-mono border ${
                      radar.esTopMultas
                        ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                        : "bg-[#ff6b00]/15 text-[#ff6b00] border-[#ff6b00]/30"
                    }`}>
                      {radar.velocidad_limite}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400">
                    {radar.sentido}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                    {radar.ubicacion}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectRadarLimit) {
                          onSelectRadarLimit(radar.velocidad_limite);
                          const calc = document.getElementById("calculadora");
                          if (calc) calc.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#ff6b00]/15 hover:bg-[#ff6b00] text-[#ff6b00] hover:text-white transition-colors"
                    >
                      Calcular multa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
