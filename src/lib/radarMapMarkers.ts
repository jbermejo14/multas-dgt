import { assetPath } from "@/lib/site";
import type { DgtRadar } from "@/lib/radarsData";
import type { RoadSpeedLimit } from "@/types";

/** Atributo del botón del popup que identifica la acción "calcular con este límite". */
export const RADAR_MAP_LIMIT_ATTRIBUTE = "data-radar-limit";

/** Colores de marcador por tipo de radar (el mismo valor alimenta la leyenda). */
export const RADAR_MAP_TYPE_COLORS: Record<DgtRadar["tipo"], string> = {
  Fijo: "#c2410c",
  Tramo: "#1d4ed8",
};

export const RADAR_MAP_MARKER_RADIUS = 6;
export const RADAR_MAP_MARKER_BORDER = "#ffffff";

const RADAR_MAP_HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapa texto del dataset antes de insertarlo en el HTML de un popup de Leaflet. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => RADAR_MAP_HTML_ESCAPES[char]);
}

/** Ruta de la ficha del radar, lista para un `<a href>` fuera de next/link. */
export function getRadarDetailHref(radar: Pick<DgtRadar, "id">): string {
  return assetPath(`/radares/radar/${encodeURIComponent(radar.id)}`);
}

export function buildRadarTooltipHtml(radar: DgtRadar): string {
  return `<strong>${escapeHtml(radar.carretera)}</strong> (pk ${escapeHtml(radar.pk)})<br>${escapeHtml(
    radar.tipo,
  )} &bull; ${escapeHtml(radar.provincia)}`;
}

function radarMapLimitButtonHtml(limit: RoadSpeedLimit | null): string {
  if (limit === null) return "";
  return `<button type="button" ${RADAR_MAP_LIMIT_ATTRIBUTE}="${limit}" style="width:100%;margin-top:10px;padding:8px 12px;border:none;border-radius:8px;background:var(--on-accent-bg);color:var(--on-accent-text);font-size:12px;font-weight:700;cursor:pointer;">Calcular sanción con ${limit} km/h</button>`;
}

function radarMapLimitLineHtml(limit: RoadSpeedLimit | null): string {
  if (limit === null) return "";
  return `<div style="font-size:12px;color:var(--text-secondary);">Límite estimado de la vía: <strong style="color:var(--text-primary);">${limit} km/h</strong></div>`;
}

/** HTML del popup: datos del radar, enlace a su ficha y, si hay límite válido, el botón de la calculadora. */
export function buildRadarPopupHtml(radar: DgtRadar, limit: RoadSpeedLimit | null): string {
  return `<div style="padding:14px;min-width:220px;line-height:1.4;">
    <div style="font-size:11px;font-weight:700;color:var(--accent-primary);margin-bottom:4px;">Radar ${escapeHtml(radar.tipo)}</div>
    <div style="font-size:15px;font-weight:800;color:var(--text-primary);">${escapeHtml(radar.carretera)} - PK ${escapeHtml(radar.pk)}</div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">${escapeHtml(radar.provincia)} &bull; Sentido ${escapeHtml(radar.sentido)}</div>
    ${radarMapLimitLineHtml(limit)}
    <a href="${escapeHtml(getRadarDetailHref(radar))}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:700;color:var(--accent-primary);">Ver ficha del radar</a>
    ${radarMapLimitButtonHtml(limit)}
  </div>`;
}
