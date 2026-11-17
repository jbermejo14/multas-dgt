export type RoadSpeedLimit = 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120;

export type InfractionSeverity = "Sin sanción" | "Leve" | "Grave" | "Muy Grave" | "Delito Penal";

export interface SpeedCalculationResult {
  limite: number;
  velocidadDetectada: number;
  velocidadCorregidaFijo: number;
  velocidadCorregidaMovil: number;
  velocidadEfectiva: number; // The one currently used depending on toggle/choice
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

export type InfractionCategory =
  | "Velocidad"
  | "Móvil y Distracciones"
  | "Alcohol y Drogas"
  | "Seguridad y Cinturón"
  | "Documentación e ITV"
  | "Señales y Semáforos"
  | "ZBE y Medio Ambiente"
  | "Dispositivos no autorizados"
  | "Otras infracciones";

export interface InfractionData {
  id: string;
  slug: string;
  titulo: string;
  categoria: InfractionCategory;
  articulo: string;
  importe: number;
  prontoPago: number;
  puntos: number;
  gravedad: "Leve" | "Grave" | "Muy Grave" | "Delito Penal";
  permiteProntoPago: boolean;
  resumen: string;
  descripcion: string;
  baseLegal: string;
  plazoRecuperacion: string;
  comoRecurrir: string;
  consejos: string[];
  fuente: string;
  fechaVerificacion: string; // Fecha en formato ISO (YYYY-MM-DD)
  faq: {
    pregunta: string;
    respuesta: string;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
