import type { InfractionSeverity } from "@/types";

const SEVERITY_TAG_CLASSES: Record<InfractionSeverity, string> = {
  "Sin sanción": "tag tag-green",
  Leve: "tag tag-warning",
  Grave: "tag tag-accent",
  "Muy Grave": "tag tag-red",
  "Delito Penal": "tag tag-critical",
};

/** Clases de la etiqueta de color de una gravedad; mismo criterio en calculadora, catálogo y fichas. */
export function infractionSeverityTagClass(severity: InfractionSeverity): string {
  return SEVERITY_TAG_CLASSES[severity];
}
