"use client";

import { Search } from "lucide-react";
import {
  RADAR_MAP_ALL_ROADS,
  RADAR_MAP_ALL_TYPES,
  type RadarMapFilters,
  type RadarMapTypeFilter,
} from "@/lib/radarMapFilters";

interface RadarMapFilterPanelProps {
  filters: RadarMapFilters;
  provinces: string[];
  roads: string[];
  onChange: (filters: RadarMapFilters) => void;
}

const RADAR_MAP_FIELD_CLASS =
  "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg";
const RADAR_MAP_LABEL_CLASS = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted";

/** Filtros de provincia, carretera, tipo y búsqueda libre sobre el mapa. */
export function RadarMapFilterPanel({ filters, provinces, roads, onChange }: RadarMapFilterPanelProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="radar-map-province" className={RADAR_MAP_LABEL_CLASS}>
          Provincia
        </label>
        <select
          id="radar-map-province"
          value={filters.provincia}
          onChange={(event) =>
            onChange({ ...filters, provincia: event.target.value, carretera: RADAR_MAP_ALL_ROADS })
          }
          className={RADAR_MAP_FIELD_CLASS}
        >
          <option value={RADAR_MAP_ALL_ROADS}>Todas las provincias</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="radar-map-road" className={RADAR_MAP_LABEL_CLASS}>
          Carretera / vía
        </label>
        <select
          id="radar-map-road"
          value={filters.carretera}
          onChange={(event) => onChange({ ...filters, carretera: event.target.value })}
          className={RADAR_MAP_FIELD_CLASS}
        >
          <option value={RADAR_MAP_ALL_ROADS}>Todas las carreteras</option>
          {roads.map((road) => (
            <option key={road} value={road}>
              {road}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="radar-map-type" className={RADAR_MAP_LABEL_CLASS}>
          Tipo de radar
        </label>
        <select
          id="radar-map-type"
          value={filters.tipo}
          onChange={(event) => onChange({ ...filters, tipo: event.target.value as RadarMapTypeFilter })}
          className={RADAR_MAP_FIELD_CLASS}
        >
          <option value={RADAR_MAP_ALL_TYPES}>Todos los tipos</option>
          <option value="Fijo">Radar fijo</option>
          <option value="Tramo">Radar de tramo</option>
        </select>
      </div>

      <div>
        <label htmlFor="radar-map-search" className={RADAR_MAP_LABEL_CLASS}>
          Buscar vía o PK
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="radar-map-search"
            type="text"
            placeholder="Ej: A-381, M-30, 74..."
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            className={`${RADAR_MAP_FIELD_CLASS} pl-9`}
          />
        </div>
      </div>
    </div>
  );
}
