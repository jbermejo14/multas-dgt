"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import type { DgtRadar } from "@/lib/radarsData";
import type { RoadSpeedLimit } from "@/types";
import { getRadarSpeedLimit } from "@/lib/radarMapFilters";

interface RadarMapTableProps {
  radars: DgtRadar[];
  onShowOnMap: (radar: DgtRadar) => void;
  onSelectLimit?: (limit: RoadSpeedLimit) => void;
}

/** Máximo de filas pintadas: con cientos de radares el listado completo pesa más que aporta. */
const RADAR_MAP_TABLE_MAX_ROWS = 100;
const RADAR_MAP_ACTION_CLASS = "text-xs font-bold text-accent hover:underline";

/** Listado de los primeros radares filtrados, con enlace a la ficha de cada uno. */
export function RadarMapTable({ radars, onShowOnMap, onSelectLimit }: RadarMapTableProps) {
  const visibleRadars = radars.slice(0, RADAR_MAP_TABLE_MAX_ROWS);

  return (
    <div className="card">
      <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-fg">
        <Layers className="h-4 w-4 text-accent" aria-hidden="true" />
        Listado de radares ({radars.length})
      </h3>
      {radars.length > visibleRadars.length && (
        <p className="mb-3 text-xs text-muted">
          Se muestran los primeros {visibleRadars.length}. Usa los filtros para acotar el listado.
        </p>
      )}

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line font-semibold uppercase tracking-wider text-muted">
              <th className="px-3 py-2.5">Vía / PK</th>
              <th className="px-3 py-2.5">Provincia</th>
              <th className="px-3 py-2.5">Tipo</th>
              <th className="px-3 py-2.5">Sentido</th>
              <th className="px-3 py-2.5">Límite estimado</th>
              <th className="px-3 py-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visibleRadars.map((radar) => {
              const limit = getRadarSpeedLimit(radar);
              return (
                <tr key={radar.id}>
                  <td className="px-3 py-3 font-mono font-bold text-fg">
                    {radar.carretera} <span className="font-normal text-muted">pk {radar.pk}</span>
                  </td>
                  <td className="px-3 py-3 text-muted">{radar.provincia}</td>
                  <td className="px-3 py-3">
                    <span className="tag">{radar.tipo}</span>
                  </td>
                  <td className="px-3 py-3 text-muted">{radar.sentido}</td>
                  <td className="px-3 py-3 text-muted">{limit === null ? "Sin dato" : `${limit} km/h`}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button type="button" onClick={() => onShowOnMap(radar)} className={RADAR_MAP_ACTION_CLASS}>
                        Ver en mapa
                      </button>
                      <Link href={`/radares/radar/${encodeURIComponent(radar.id)}`} className={RADAR_MAP_ACTION_CLASS}>
                        Ficha
                      </Link>
                      {limit !== null && onSelectLimit && (
                        <button type="button" onClick={() => onSelectLimit(limit)} className={RADAR_MAP_ACTION_CLASS}>
                          Calcular multa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
