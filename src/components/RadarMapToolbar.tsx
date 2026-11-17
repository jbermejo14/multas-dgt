"use client";

import { RotateCcw } from "lucide-react";
import {
  RADAR_MAP_LAYER_ORDER,
  RADAR_MAP_REGION_SHORTCUTS,
  RADAR_MAP_TILE_SOURCES,
  type RadarMapLayerType,
  type RadarMapRegionShortcut,
} from "@/lib/radarMapTiles";

interface RadarMapToolbarProps {
  activeLayer: RadarMapLayerType;
  onSelectLayer: (layer: RadarMapLayerType) => void;
  onFocusRegion: (region: RadarMapRegionShortcut) => void;
  onResetView: () => void;
}

const RADAR_MAP_BUTTON_CLASS =
  "rounded border border-line bg-elevated px-2.5 py-1 text-xs font-semibold text-muted hover:text-fg";
const RADAR_MAP_ACTIVE_LAYER_STYLE = {
  backgroundColor: "var(--on-accent-bg)",
  color: "var(--on-accent-text)",
};

/** Barra sobre el mapa: accesos regionales, selector de capa base y vista inicial. */
export function RadarMapToolbar({ activeLayer, onSelectLayer, onFocusRegion, onResetView }: RadarMapToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-surface p-3">
      <div className="flex flex-wrap items-center gap-2">
        {RADAR_MAP_REGION_SHORTCUTS.map((region) => (
          <button
            key={region.label}
            type="button"
            onClick={() => onFocusRegion(region)}
            title={region.title}
            className={RADAR_MAP_BUTTON_CLASS}
          >
            {region.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded border border-line bg-elevated p-0.5" role="group" aria-label="Capa del mapa">
          {RADAR_MAP_LAYER_ORDER.map((layer) => {
            const isActive = layer === activeLayer;
            return (
              <button
                key={layer}
                type="button"
                onClick={() => onSelectLayer(layer)}
                title={RADAR_MAP_TILE_SOURCES[layer].title}
                aria-pressed={isActive}
                style={isActive ? RADAR_MAP_ACTIVE_LAYER_STYLE : undefined}
                className="rounded px-2 py-0.5 text-[11px] font-semibold text-muted"
              >
                {RADAR_MAP_TILE_SOURCES[layer].label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onResetView}
          title="Centrar España peninsular"
          aria-label="Centrar España peninsular"
          className="rounded border border-line bg-elevated p-1.5 text-muted hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
