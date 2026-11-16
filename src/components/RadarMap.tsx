"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  RotateCcw,
  Compass,
  Map as MapIcon,
  Moon,
  Satellite,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

interface RadarMapProps {
  onSelectRadarLimit?: (limit: RoadSpeedLimit) => void;
}

type MapLayerType = "osm" | "carto" | "dark" | "sat";

export function RadarMap({ onSelectRadarLimit }: RadarMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayersRef = useRef<any[]>([]);
  const markersLayerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState<boolean>(false);
  const [mapTheme, setMapTheme] = useState<MapLayerType>("osm"); // OpenStreetMap por defecto
  const [selectedProvincia, setSelectedProvincia] = useState<string>("Todas");
  const [selectedCarretera, setSelectedCarretera] = useState<string>("Todas");
  const [selectedTipo, setSelectedTipo] = useState<string>("Todos");
  const [onlyTopMultas, setOnlyTopMultas] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRadar, setSelectedRadar] = useState<RadarData | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sincronizar tema con modo oscuro/claro por defecto si no lo ha cambiado manualmente
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setMapTheme(isDark ? "dark" : "osm");
    }
  }, []);

  // Calcular provincias y carreteras únicas
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

  // Top 10 radares
  const top10Radars = useMemo(() => {
    return [...RADARS_DATA]
      .filter((r) => r.esTopMultas && r.rankingMasMultas)
      .sort((a, b) => (a.rankingMasMultas || 99) - (b.rankingMasMultas || 99))
      .slice(0, 10);
  }, []);

  // Dataset filtrado
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

  // Aplicar capa base de mapa (OpenStreetMap, CARTO, Oscuro, Satélite como en zbe-map)
  const applyTileLayer = useCallback((map: any, L: any, theme: MapLayerType) => {
    currentTileLayersRef.current.forEach((layer) => {
      try {
        layer.remove();
      } catch {
        // ignore
      }
    });
    currentTileLayersRef.current = [];

    if (theme === "osm") {
      // 1. OpenStreetMap Estándar
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        maxZoom: 19,
      });
      osmLayer.addTo(map);
      currentTileLayersRef.current.push(osmLayer);
    } else if (theme === "carto") {
      // 2. CARTO Positron Minimalista
      const cartoLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: "abcd",
          maxZoom: 20,
        }
      );
      cartoLayer.addTo(map);
      currentTileLayersRef.current.push(cartoLayer);
    } else if (theme === "dark") {
      // 3. Modo Oscuro (CARTO Dark Matter / Esri Canvas)
      const darkLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: "abcd",
          maxZoom: 20,
        }
      );
      darkLayer.addTo(map);
      currentTileLayersRef.current.push(darkLayer);
    } else if (theme === "sat") {
      // 4. Satélite (Esri World Imagery)
      const satLayer = L.tileLayer(
        "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "&copy; Esri, Maxar, Earthstar Geographics",
          maxZoom: 18,
        }
      );
      satLayer.addTo(map);
      currentTileLayersRef.current.push(satLayer);
    }
  }, []);

  // Renderizar marcadores de cinemómetros
  const renderMarkers = useCallback(
    (map: any, L: any, list: RadarData[]) => {
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      } else {
        markersLayerRef.current = L.layerGroup().addTo(map);
      }

      list.forEach((radar) => {
        const isTop = radar.esTopMultas;
        const isTramo = radar.tipo === "Tramo";
        const isSemaforo = radar.tipo === "Semáforo";

        // Color de marcador según categoría
        const markerBg = isTop
          ? "#dc2626" // Rojo intenso para los radares que más multan
          : isTramo
          ? "#ea580c" // Naranja oscuro para radares de tramo
          : isSemaforo
          ? "#8b5cf6" // Violeta para foto-rojo
          : "#ff6b00"; // Naranja vibrante para fijo

        const markerHtml = `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isTop
                ? `<div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(220, 38, 38, 0.45); animation: radar-pulse 1.5s infinite ease-out;"></div>`
                : `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 107, 0, 0.3); animation: radar-pulse 2s infinite ease-out;"></div>`
            }
            <div style="width: ${isTop ? "34px" : "28px"}; height: ${isTop ? "34px" : "28px"}; border-radius: 50%; background: ${markerBg}; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: ${
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

        // Tooltip al pasar el ratón (como en zbe-map)
        const tooltipHtml = `
          <div style="font-family: inherit; min-width: 160px; padding: 2px;">
            <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 2px;">
              ${radar.carretera} (pk ${radar.pk})
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #ff6b00;">
              Límite ${radar.velocidad_limite} km/h &bull; ${radar.tipo}
            </div>
            <div style="font-size: 10px; color: #a1a1aa; margin-top: 2px;">
              ${radar.provincia} (${radar.sentido})
            </div>
            ${
              isTop
                ? `<div style="font-size: 10px; color: #ef4444; font-weight: bold; margin-top: 2px;">
                    🔥 Top #${radar.rankingMasMultas} (~${radar.multasAnualesAprox?.toLocaleString()} multas)
                   </div>`
                : ""
            }
          </div>
        `;

        marker.bindTooltip(tooltipHtml, {
          direction: "top",
          offset: [0, -10],
        });

        // Popup interactivo
        const popupHtml = `
          <div style="padding: 14px; min-width: 240px; font-family: system-ui, sans-serif;">
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
            <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #ffffff;">
              ${radar.carretera} - PK ${radar.pk}
            </h4>
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #a3a3a3; line-height: 1.35;">
              ${radar.ubicacion} (${radar.provincia})
            </p>
            <div style="font-size: 11px; color: #737373; margin-bottom: 12px;">
              Sentido: <strong style="color: #e5e5e5;">${radar.sentido}</strong>
            </div>
            <button 
              onclick="window.radarPuntosSelectLimit && window.radarPuntosSelectLimit(${radar.velocidad_limite})"
              style="width: 100%; background: #ff6b00; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;"
            >
              Calcular sanción para este radar (${radar.velocidad_limite} km/h)
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on("click", () => {
          setSelectedRadar(radar);
        });

        markersLayerRef.current.addLayer(marker);
      });
    },
    []
  );

  // Inicializar Leaflet
  useEffect(() => {
    let isMounted = true;
    if (!isClient || !mapContainerRef.current) return;

    import("leaflet").then((LModule) => {
      if (!isMounted || !mapContainerRef.current) return;
      const L = LModule.default || LModule;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [40.2, -3.7],
        zoom: 6,
        minZoom: 5,
        maxZoom: 19,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Aplicar capa base inicial
      applyTileLayer(map, L, mapTheme);

      mapInstanceRef.current = map;
      setMapReady(true);
      renderMarkers(map, L, filteredRadars);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Cambiar capa cuando cambia mapTheme
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    import("leaflet").then((LModule) => {
      const L = LModule.default || LModule;
      if (mapInstanceRef.current) {
        applyTileLayer(mapInstanceRef.current, L, mapTheme);
      }
    });
  }, [mapTheme, mapReady, applyTileLayer]);

  // Actualizar marcadores cuando cambian los filtros
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    import("leaflet").then((LModule) => {
      const L = LModule.default || LModule;
      if (mapInstanceRef.current) {
        renderMarkers(mapInstanceRef.current, L, filteredRadars);
      }
    });
  }, [filteredRadars, mapReady, renderMarkers]);

  // Global callback para sincronizar botón del popup con la calculadora
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

  // Accesos directos rápidos de vista regional (como en zbe-map)
  const focusMadrid = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([40.4168, -3.7038], 11, { duration: 0.9 });
    }
  };

  const focusBarcelona = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([41.3879, 2.1699], 11, { duration: 0.9 });
    }
  };

  const focusAndalucia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([36.7212, -4.4214], 9, { duration: 0.9 });
    }
  };

  const focusGalicia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([42.2406, -8.7207], 10, { duration: 0.9 });
    }
  };

  const resetViewPeninsula = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([40.2, -3.7], 6, { duration: 0.8 });
    }
  };

  const focusCanarias = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([28.2916, -16.6291], 8, { duration: 0.8 });
    }
  };

  const handleZoomToRadar = (radar: RadarData) => {
    setSelectedRadar(radar);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([radar.lat, radar.lng], 14, { duration: 1.2 });
    }
    const mapElement = document.getElementById("leaflet-radar-map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header y Filtros Globales */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 mb-2">
            <Radio className="w-3.5 h-3.5" />
            Mapa de Radares con OpenStreetMap
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Buscador y Mapa Interactivo de Cinemómetros DGT
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Visualiza sobre <strong>OpenStreetMap</strong> los radares fijos, de tramo, foto-rojo y el ranking de cinemómetros que más multas emiten en España.
          </p>
        </div>

        {/* Filtros Dropdowns */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              Buscar vía o PK
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

      {/* CONTENEDOR PRINCIPAL DEL MAPA (CON ESTILO Y CONTROLES INTEGRADOS COMO EN ZBE-MAP) */}
      <div id="leaflet-radar-map" className="relative flex flex-col w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black shadow-xl">
        {/* Barra de control superior sobre el mapa (Negro y Naranja, idéntica a la de zbe-map) */}
        <div className="z-10 flex flex-wrap items-center justify-between gap-2.5 p-3 bg-neutral-950 border-b border-neutral-800 text-white">
          {/* Filtros rápidos de estado / categoría */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setOnlyTopMultas(false);
                setSelectedTipo("Todos");
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                !onlyTopMultas && selectedTipo === "Todos"
                  ? "bg-neutral-100 text-black font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              Todos ({RADARS_DATA.length})
            </button>

            {/* Toggle de los que más multan */}
            <button
              type="button"
              onClick={() => setOnlyTopMultas(!onlyTopMultas)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                onlyTopMultas
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-neutral-900 text-red-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>🔥 Los que más multan ({top10Radars.length}+)</span>
            </button>

            {/* Fijo */}
            <button
              type="button"
              onClick={() => {
                setOnlyTopMultas(false);
                setSelectedTipo(selectedTipo === "Fijo" ? "Todos" : "Fijo");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedTipo === "Fijo"
                  ? "bg-[#ff6b00] text-white font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#ff6b00]"></span>
              <span>Fijos</span>
            </button>

            {/* Tramo */}
            <button
              type="button"
              onClick={() => {
                setOnlyTopMultas(false);
                setSelectedTipo(selectedTipo === "Tramo" ? "Todos" : "Tramo");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedTipo === "Tramo"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Tramo</span>
            </button>

            {/* Semáforo */}
            <button
              type="button"
              onClick={() => {
                setOnlyTopMultas(false);
                setSelectedTipo(selectedTipo === "Semáforo" ? "Todos" : "Semáforo");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedTipo === "Semáforo"
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Foto-Rojo</span>
            </button>
          </div>

          {/* Accesos directos regionales y selector de capas (estilo zbe-map) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Accesos rápidos a zonas calientes */}
            <button
              type="button"
              onClick={focusMadrid}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#ff6b00] text-white hover:bg-[#e05e00] transition-colors"
              title="Centrar en Madrid (M-30, A-4, A-5)"
            >
              <Navigation className="w-3 h-3" />
              <span>Madrid</span>
            </button>

            <button
              type="button"
              onClick={focusBarcelona}
              className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Centrar en Barcelona (C-31, B-10, B-20)"
            >
              <span>Barcelona</span>
            </button>

            <button
              type="button"
              onClick={focusAndalucia}
              className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Centrar en A-381 / A-7 (Cádiz y Málaga)"
            >
              <span>Andalucía</span>
            </button>

            <button
              type="button"
              onClick={focusGalicia}
              className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Centrar en Galicia (A-55 Vigo / Mos)"
            >
              <span>Galicia</span>
            </button>

            {/* SELECTOR DE CAPAS DE MAPA (COMO EN ZBE-MAP) */}
            <div className="flex items-center bg-neutral-900 rounded border border-neutral-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMapTheme("osm")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  mapTheme === "osm" ? "bg-[#ff6b00] text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
                title="Capa OpenStreetMap Oficial"
              >
                OSM
              </button>
              <button
                type="button"
                onClick={() => setMapTheme("carto")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  mapTheme === "carto" ? "bg-[#ff6b00] text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
                title="Estilo CARTO Positron claro"
              >
                CARTO
              </button>
              <button
                type="button"
                onClick={() => setMapTheme("dark")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  mapTheme === "dark" ? "bg-[#ff6b00] text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
                title="Modo Oscuro Dark Matter"
              >
                Oscuro
              </button>
              <button
                type="button"
                onClick={() => setMapTheme("sat")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  mapTheme === "sat" ? "bg-[#ff6b00] text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
                title="Fotografía Satélite"
              >
                Satélite
              </button>
            </div>

            {/* Botón centrar península */}
            <button
              type="button"
              onClick={resetViewPeninsula}
              title="Centrar España Peninsular"
              className="rounded border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lienzo del Mapa Leaflet con OpenStreetMap */}
        <div className="relative w-full h-[540px] md:h-[620px]">
          {!isClient ? (
            <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-neutral-400">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#ff6b00] animate-spin" />
                <span>Cargando OpenStreetMap y cinemómetros...</span>
              </div>
            </div>
          ) : (
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          )}

          {/* Cartel Indicador Superior Izquierdo (estilo zbe-map) */}
          <div className="absolute top-3 left-3 z-[400] pointer-events-none bg-black/85 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1.5 text-[11px] text-neutral-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse"></span>
            <span>
              Capa activa: <strong className="text-white uppercase">{mapTheme}</strong> &bull; {filteredRadars.length} radares visibles
            </span>
          </div>

          {/* LEYENDA FLOTANTE INFERIOR IZQUIERDA (ESTILO ZBE-MAP) */}
          <div className="absolute bottom-3 left-3 z-[400] rounded-xl bg-black/90 backdrop-blur-md border border-neutral-800 p-3.5 shadow-xl pointer-events-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
              Tipos de Cinemómetro
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white inline-block shadow-sm"></span>
                <span>🔥 Top Más Sancionadores (Ranking AEA)</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <span className="w-3 h-3 rounded-full bg-[#ff6b00] border border-white inline-block shadow-sm"></span>
                <span>Radar Fijo (Pórtico / Cabina lateral)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-600 border border-white inline-block shadow-sm"></span>
                <span>Radar de Tramo (Velocidad media)</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <span className="w-3 h-3 rounded-full bg-purple-600 border border-white inline-block shadow-sm"></span>
                <span>Semáforo Foto-Rojo (Cruce urbano)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Detallada de Cinemómetros Filtrados */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6b00]" />
            Listado de Cinemómetros en España ({filteredRadars.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Haz clic sobre cualquier radar para enfocarlo en el mapa
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
                    radar.esTopMultas ? "bg-red-500/[0.04] dark:bg-red-950/15" : ""
                  }`}
                  onClick={() => handleZoomToRadar(radar)}
                >
                  <td className="py-3 px-3">
                    {radar.esTopMultas ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 whitespace-nowrap">
                        🔥 Top #{radar.rankingMasMultas} ({radar.multasAnualesAprox?.toLocaleString()} multas)
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Estándar DGT</span>
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
