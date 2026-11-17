"use client";

import { useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { getAllRadars, type DgtRadar } from "@/lib/radarsData";
import type { RoadSpeedLimit } from "@/types";
import {
  RADAR_MAP_DEFAULT_FILTERS,
  filterRadars,
  getProvinceOptions,
  getRoadOptions,
  type RadarMapFilters,
} from "@/lib/radarMapFilters";
import { RADAR_MAP_TYPE_COLORS } from "@/lib/radarMapMarkers";
import {
  RADAR_MAP_RADAR_ZOOM,
  RADAR_MAP_SPAIN_CENTER,
  RADAR_MAP_SPAIN_ZOOM,
  RADAR_MAP_DEFAULT_LAYER,
  type RadarMapLayerType,
  type RadarMapRegionShortcut,
} from "@/lib/radarMapTiles";
import { RadarMapCanvas, type RadarMapFocus } from "@/components/RadarMapCanvas";
import { RadarMapFilterPanel } from "@/components/RadarMapFilterPanel";
import { RadarMapTable } from "@/components/RadarMapTable";
import { RadarMapToolbar } from "@/components/RadarMapToolbar";

interface RadarMapProps {
  onSelectRadarLimit?: (limit: RoadSpeedLimit) => void;
}

const RADAR_MAP_ELEMENT_ID = "leaflet-radar-map";
const RADAR_MAP_LEGEND: { tipo: DgtRadar["tipo"]; label: string }[] = [
  { tipo: "Fijo", label: "Radar fijo" },
  { tipo: "Tramo", label: "Radar de tramo" },
];

function radarMapScrollToMap(): void {
  document.getElementById(RADAR_MAP_ELEMENT_ID)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** Mapa de la home con los radares del Punto de Acceso Nacional de la DGT, filtros y listado. */
export function RadarMap({ onSelectRadarLimit }: RadarMapProps) {
  const allRadars = useMemo(() => getAllRadars(), []);
  const provinces = useMemo(() => getProvinceOptions(allRadars), [allRadars]);
  const [filters, setFilters] = useState<RadarMapFilters>(RADAR_MAP_DEFAULT_FILTERS);
  const [chosenLayer, setChosenLayer] = useState<RadarMapLayerType | null>(null);
  const [focus, setFocus] = useState<RadarMapFocus | null>(null);

  const roads = useMemo(() => getRoadOptions(allRadars, filters.provincia), [allRadars, filters.provincia]);
  const filteredRadars = useMemo(() => filterRadars(allRadars, filters), [allRadars, filters]);
  const activeLayer = chosenLayer ?? RADAR_MAP_DEFAULT_LAYER;

  const handleFocusRegion = (region: RadarMapRegionShortcut) => {
    setFocus({ center: region.center, zoom: region.zoom });
  };

  const handleResetView = () => {
    setFocus({ center: RADAR_MAP_SPAIN_CENTER, zoom: RADAR_MAP_SPAIN_ZOOM });
  };

  const handleShowOnMap = (radar: DgtRadar) => {
    setFocus({ center: [radar.lat, radar.lng], zoom: RADAR_MAP_RADAR_ZOOM });
    radarMapScrollToMap();
  };

  return (
    <div className="w-full space-y-8">
      <div className="card">
        <div className="max-w-3xl">
          <div className="tag mb-2 inline-flex items-center gap-2 text-accent">
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            Radares del NAP de la DGT
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-fg md:text-3xl">
            Mapa de radares fijos y de tramo en España
          </h2>
          <p className="mt-1 text-sm text-muted">
            {allRadars.length} radares publicados por la DGT en su Punto de Acceso Nacional. Filtra por provincia,
            carretera o tipo y abre cada radar para ver su ficha.
          </p>
        </div>

        <RadarMapFilterPanel filters={filters} provinces={provinces} roads={roads} onChange={setFilters} />
      </div>

      <div id={RADAR_MAP_ELEMENT_ID} className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-line">
        <RadarMapToolbar
          activeLayer={activeLayer}
          onSelectLayer={setChosenLayer}
          onFocusRegion={handleFocusRegion}
          onResetView={handleResetView}
        />

        {/* isolate: las capas de Leaflet (z-index 400+) no deben quedar por encima de la cabecera fija. */}
        <div className="relative isolate">
          <RadarMapCanvas
            radars={filteredRadars}
            layer={activeLayer}
            focus={focus}
            onSelectLimit={onSelectRadarLimit}
          />

          <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] text-muted">
            {filteredRadars.length} radares visibles
          </div>

          <div className="absolute bottom-3 left-3 z-[400] rounded-xl border border-line bg-surface p-3 text-xs text-fg">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted">
              Tipos de radar
            </span>
            <ul className="space-y-1.5">
              {RADAR_MAP_LEGEND.map((item) => (
                <li key={item.tipo} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-white"
                    style={{ backgroundColor: RADAR_MAP_TYPE_COLORS[item.tipo] }}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <RadarMapTable radars={filteredRadars} onShowOnMap={handleShowOnMap} onSelectLimit={onSelectRadarLimit} />
    </div>
  );
}
