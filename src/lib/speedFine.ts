export type RoadSpeedLimit = 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120;
export type InfractionSeverity = "Sin sanción" | "Leve" | "Grave" | "Muy Grave" | "Delito Penal";

export interface SpeedCalculationResult {
  limite: number;
  velocidadDetectada: number;
  velocidadCorregidaFijo: number;
  velocidadCorregidaMovil: number;
  velocidadEfectiva: number;
  margenAplicado: number;
  tipoMargen: "fijo" | "movil" | "ninguno";
  superaLimite: boolean;
  excesoKmH: number;
  importe: number;
  prontoPago: number;
  puntos: number;
  gravedad: InfractionSeverity;
  esDelitoPenal: boolean;
  umbralPenal: number;
  detallesSancion: string;
  tiempoPagoDescuento: string;
  articuloLegal: string;
}

export interface SpeedRangeBracket {
  min: number;
  max: number;
  importe: number;
  puntos: number;
  gravedad: InfractionSeverity;
}

/**
 * Tabla oficial de sanciones por exceso de velocidad (Anexo IV de la Ley sobre Tráfico,
 * Circulación de Vehículos a Motor y Seguridad Vial, RDL 6/2015).
 */
export const SPEED_FINE_TABLE: Record<RoadSpeedLimit, SpeedRangeBracket[]> = {
  20: [
    { min: 21, max: 40, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 41, max: 50, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 51, max: 60, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 61, max: 70, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 71, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  30: [
    { min: 31, max: 50, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 51, max: 60, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 61, max: 70, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 71, max: 80, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 81, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  40: [
    { min: 41, max: 60, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 61, max: 70, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 71, max: 80, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 81, max: 90, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 91, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  50: [
    { min: 51, max: 70, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 71, max: 80, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 81, max: 90, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 91, max: 100, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 101, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  60: [
    { min: 61, max: 90, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 91, max: 110, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 111, max: 120, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 121, max: 130, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 131, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  70: [
    { min: 71, max: 100, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 101, max: 120, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 121, max: 130, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 131, max: 140, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 141, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  80: [
    { min: 81, max: 110, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 111, max: 130, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 131, max: 140, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 141, max: 150, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 151, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  90: [
    { min: 91, max: 120, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 121, max: 140, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 141, max: 150, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 151, max: 160, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 161, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  100: [
    { min: 101, max: 130, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 131, max: 150, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 151, max: 160, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 161, max: 170, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 171, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  110: [
    { min: 111, max: 140, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 141, max: 160, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 161, max: 170, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 171, max: 180, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 181, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
  120: [
    { min: 121, max: 150, importe: 100, puntos: 0, gravedad: "Leve" },
    { min: 151, max: 170, importe: 300, puntos: 2, gravedad: "Grave" },
    { min: 171, max: 180, importe: 400, puntos: 4, gravedad: "Grave" },
    { min: 181, max: 190, importe: 500, puntos: 6, gravedad: "Grave" },
    { min: 191, max: 999, importe: 600, puntos: 6, gravedad: "Muy Grave" },
  ],
};

export const AVAILABLE_LIMITS: RoadSpeedLimit[] = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

/**
 * Aplica margen de error metrológico reglamentario según la Orden ICT/155/2020:
 * - Cinemómetros fijos y de tramo: 3 km/h para velocidades <= 100 km/h o 3% para > 100 km/h.
 * - Cinemómetros móviles (patrullas/trípodes): 5 km/h para velocidades <= 100 km/h o 5% para > 100 km/h.
 */
export function calculateCorrectedSpeed(
  speed: number,
  type: "fijo" | "movil" | "ninguno"
): number {
  if (type === "ninguno") {
    return speed;
  }
  if (type === "fijo") {
    if (speed <= 100) {
      return Math.max(0, Math.round(speed - 3));
    }
    return Math.round(speed * (1 - 0.03));
  } else {
    if (speed <= 100) {
      return Math.max(0, Math.round(speed - 5));
    }
    return Math.round(speed * (1 - 0.05));
  }
}

/**
 * Determina el umbral de presunto delito penal contra la seguridad vial
 * según el artículo 379.1 del Código Penal español:
 * - Vía urbana (límite legal <= 50 km/h): superar en más de 60 km/h.
 * - Vía interurbana (límite legal > 50 km/h): superar en más de 80 km/h.
 */
export function getPenalThreshold(limite: RoadSpeedLimit): number {
  return limite <= 50 ? limite + 60 : limite + 80;
}

/**
 * Realiza el cálculo de la multa, reducción por pronto pago y puntos
 * conforme al Anexo IV del RDL 6/2015 y Art. 379.1 del Código Penal.
 */
export function calculateSpeedFine(
  limite: RoadSpeedLimit,
  velocidadDetectada: number,
  aplicarMargen: boolean = true,
  tipoMargenPreferido: "fijo" | "movil" = "fijo"
): SpeedCalculationResult {
  const correctedFijo = calculateCorrectedSpeed(velocidadDetectada, "fijo");
  const correctedMovil = calculateCorrectedSpeed(velocidadDetectada, "movil");

  const velocidadEfectiva = aplicarMargen
    ? tipoMargenPreferido === "fijo"
      ? correctedFijo
      : correctedMovil
    : velocidadDetectada;

  const margenAplicado = velocidadDetectada - velocidadEfectiva;
  const tipoMargen = aplicarMargen ? tipoMargenPreferido : "ninguno";

  const superaLimite = velocidadEfectiva > limite;
  const excesoKmH = Math.max(0, velocidadEfectiva - limite);
  const umbralPenal = getPenalThreshold(limite);
  const esDelitoPenal = velocidadEfectiva > umbralPenal;

  if (!superaLimite) {
    return {
      limite,
      velocidadDetectada,
      velocidadCorregidaFijo: correctedFijo,
      velocidadCorregidaMovil: correctedMovil,
      velocidadEfectiva,
      margenAplicado,
      tipoMargen,
      superaLimite: false,
      excesoKmH: 0,
      importe: 0,
      prontoPago: 0,
      puntos: 0,
      gravedad: "Sin sanción",
      esDelitoPenal: false,
      umbralPenal,
      detallesSancion: "Velocidad dentro del límite legal establecido.",
      tiempoPagoDescuento: "No aplicable",
      articuloLegal: "Reglamento General de Circulación (Art. 48/50)",
    };
  }

  const brackets = SPEED_FINE_TABLE[limite] || [];
  let bracketMatch = brackets.find(
    (b) => velocidadEfectiva >= b.min && velocidadEfectiva <= b.max
  );

  if (!bracketMatch && brackets.length > 0) {
    bracketMatch = brackets[brackets.length - 1];
  }

  const importe = bracketMatch ? bracketMatch.importe : 100;
  const puntos = bracketMatch ? bracketMatch.puntos : 0;
  const gravedad: InfractionSeverity = esDelitoPenal
    ? "Delito Penal"
    : bracketMatch
    ? bracketMatch.gravedad
    : "Leve";
  const prontoPago = Math.round(importe * 0.5);

  let detallesSancion = "";
  if (esDelitoPenal) {
    detallesSancion = `Velocidad imputada de ${velocidadEfectiva} km/h supera el umbral penal de ${umbralPenal} km/h (+${
      limite <= 50 ? 60 : 80
    } km/h sobre el límite). Constituye presunto delito contra la seguridad vial según el Art. 379.1 del Código Penal.`;
  } else if (puntos > 0) {
    detallesSancion = `Infracción ${gravedad.toLowerCase()} con sanción de ${importe} € y detracción de ${puntos} puntos.`;
  } else {
    detallesSancion = `Infracción leve con sanción de ${importe} €. No conlleva retirada de puntos.`;
  }

  return {
    limite,
    velocidadDetectada,
    velocidadCorregidaFijo: correctedFijo,
    velocidadCorregidaMovil: correctedMovil,
    velocidadEfectiva,
    margenAplicado,
    tipoMargen,
    superaLimite: true,
    excesoKmH,
    importe,
    prontoPago,
    puntos,
    gravedad,
    esDelitoPenal,
    umbralPenal,
    detallesSancion,
    tiempoPagoDescuento: "20 días naturales desde la notificación para el 50% de reducción",
    articuloLegal: esDelitoPenal
      ? "Art. 379.1 Código Penal & Art. 77.a Ley de Tráfico"
      : "Art. 76.a / Anexo IV de la Ley sobre Tráfico y Seguridad Vial (RDL 6/2015)",
  };
}
