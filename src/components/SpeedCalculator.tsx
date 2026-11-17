"use client";

import React, { useState, useId } from "react";
import {
  RoadSpeedLimit,
  AVAILABLE_LIMITS,
  calculateSpeedFine,
  getPenalThreshold,
} from "@/data/speedFineTable";
import { SpeedCalculatorResults } from "@/components/SpeedCalculatorResults";
import { SITE_NAME } from "@/lib/site";
import { URBAN_LIMIT_MAX } from "@/lib/speedLimits";
import { Gauge, Copy, Check, TrendingDown } from "lucide-react";

const DEFAULT_SPEED = 138;
const MIN_SLIDER_SPEED = 20;
const MIN_SLIDER_MAX = 220;
const SLIDER_MARGIN_OVER_LIMIT = 90;
const MAX_INPUT_SPEED = 280;
const MIN_INPUT_SPEED = 10;
const COPIED_FEEDBACK_MS = 2500;

type MarginType = "fijo" | "movil";

const MARGIN_OPTIONS: { type: MarginType; title: string; value: string; description: string }[] = [
  {
    type: "fijo",
    title: "Radar fijo / de tramo",
    value: "-3 km/h o -3%",
    description: "Cabinas laterales, pórticos, radares de tramo y postes fijos.",
  },
  {
    type: "movil",
    title: "Radar móvil / camuflado",
    value: "-5 km/h o -5%",
    description: "Trípodes en el arcén, vehículos patrulla camuflados y pistolas láser.",
  },
];

interface SpeedCalculatorProps {
  initialLimit?: RoadSpeedLimit;
}

interface SpeedCalculatorMarginProps {
  isApplied: boolean;
  type: MarginType;
  onToggle: (applied: boolean) => void;
  onSelectType: (type: MarginType) => void;
}

/** Paso 3: interruptor del margen de error y elección entre radar fijo o móvil. */
function SpeedCalculatorMargin({ isApplied, type, onToggle, onSelectType }: SpeedCalculatorMarginProps) {
  return (
    <section aria-labelledby="heading-paso-3" className="space-y-4 rounded-xl border border-line bg-elevated p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5">
          <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h3 id="heading-paso-3" className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
              Aplicar margen de error del radar (Regla del 3-5%)
              <span className="tag tag-green tag-xs">Orden ICT/155/2020</span>
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              La ley obliga a restar el margen metrológico a la foto antes de emitir la multa.
            </p>
          </div>
        </div>

        <label className="relative inline-flex min-h-11 cursor-pointer items-center self-start sm:self-auto">
          <span className="sr-only">Aplicar margen de error del radar</span>
          <input
            type="checkbox"
            checked={isApplied}
            onChange={(e) => onToggle(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative block h-6 w-11 rounded-full border border-line bg-surface transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-muted after:transition-all after:content-[''] peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:after:translate-x-5 peer-checked:after:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent" />
        </label>
      </div>

      {isApplied && (
        <div className="grid grid-cols-1 gap-3 border-t border-line pt-3 sm:grid-cols-2">
          {MARGIN_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              aria-pressed={type === option.type}
              onClick={() => onSelectType(option.type)}
              className="option-btn option-btn-start"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold">{option.title}</span>
                <span className="font-mono text-[11px] font-semibold text-accent">{option.value}</span>
              </span>
              <span className="mt-1 text-[11px] font-normal text-muted">{option.description}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export function SpeedCalculator({ initialLimit = 120 }: SpeedCalculatorProps) {
  const [limite, setLimite] = useState<RoadSpeedLimit>(initialLimit);
  const [velocidadDetectada, setVelocidadDetectada] = useState<number>(DEFAULT_SPEED);
  const [aplicarMargen, setAplicarMargen] = useState<boolean>(true);
  const [tipoMargen, setTipoMargen] = useState<MarginType>("fijo");
  const [copied, setCopied] = useState<boolean>(false);
  const sliderId = useId();
  const inputId = useId();

  const resultado = calculateSpeedFine(limite, velocidadDetectada, aplicarMargen, tipoMargen);
  const scenarios = {
    none: calculateSpeedFine(limite, velocidadDetectada, false),
    fixed: calculateSpeedFine(limite, velocidadDetectada, true, "fijo"),
    mobile: calculateSpeedFine(limite, velocidadDetectada, true, "movil"),
  };

  const umbralPenal = getPenalThreshold(limite);
  const maxSliderSpeed = Math.max(MIN_SLIDER_MAX, limite + SLIDER_MARGIN_OVER_LIMIT);

  const handleCopySummary = () => {
    const text = `Consulta ${SITE_NAME}:\nLímite de vía: ${limite} km/h\nVelocidad registrada: ${velocidadDetectada} km/h\nVelocidad corregida (margen ${tipoMargen}): ${resultado.velocidadEfectiva} km/h\nSanción: ${resultado.importe} € (Pronto pago: ${resultado.prontoPago} €)\nPuntos retirados: ${resultado.puntos}\nCalificación: ${resultado.gravedad}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <div className="card space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="tag mb-2 inline-flex items-center gap-2 whitespace-normal text-accent">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            Baremo Ley de Seguridad Vial (RDL 6/2015)
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Calculadora de multas por velocidad</h2>
          <p className="mt-1 text-sm text-muted">
            Selecciona el límite de la vía y la velocidad para conocer la sanción exacta, retirada de puntos y aplicación de márgenes de radar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="btn btn-secondary self-start md:self-auto"
          title="Copiar desglose completo"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-positive" aria-hidden="true" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>Copiar informe</span>
            </>
          )}
        </button>
      </div>

      <section aria-labelledby="heading-paso-1" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <h3 id="heading-paso-1" className="text-sm font-bold uppercase tracking-wider text-muted">
            1. Límite de velocidad de la vía
          </h3>
          <span className="text-xs text-muted">
            {limite <= URBAN_LIMIT_MAX ? "Vía urbana / travesía" : "Vía interurbana / autovía"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {AVAILABLE_LIMITS.map((vel) => (
            <button
              key={vel}
              type="button"
              aria-pressed={limite === vel}
              onClick={() => setLimite(vel)}
              className="option-btn"
            >
              <span className="font-mono text-base font-bold">{vel}</span>
              <span className="text-[10px] font-normal text-muted">km/h</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="heading-paso-2" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="heading-paso-2" className="text-sm font-bold uppercase tracking-wider text-muted">
            2. Velocidad a la que circulabas
          </h3>
          <div className="flex items-center gap-2">
            <label htmlFor={inputId} className="text-xs text-muted">
              Ajuste numérico (km/h):
            </label>
            <input
              id={inputId}
              type="number"
              min={MIN_INPUT_SPEED}
              max={MAX_INPUT_SPEED}
              value={velocidadDetectada || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setVelocidadDetectada(isNaN(val) ? 0 : Math.min(MAX_INPUT_SPEED, Math.max(0, val)));
              }}
              className="field field-number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={sliderId} className="sr-only">
            Velocidad del vehículo en km/h
          </label>
          <input
            id={sliderId}
            type="range"
            min={MIN_SLIDER_SPEED}
            max={maxSliderSpeed}
            value={velocidadDetectada}
            onChange={(e) => setVelocidadDetectada(parseInt(e.target.value, 10))}
            className="h-3 w-full cursor-pointer rounded-lg bg-elevated accent-accent"
          />
          <div className="flex flex-wrap justify-between gap-x-3 px-1 font-mono text-[11px] text-muted">
            <span>{MIN_SLIDER_SPEED} km/h</span>
            <span className="font-semibold text-accent">Límite: {limite} km/h</span>
            <span className="font-semibold text-negative">Umbral penal: &gt;{umbralPenal} km/h</span>
            <span>{maxSliderSpeed} km/h</span>
          </div>
        </div>
      </section>

      <SpeedCalculatorMargin
        isApplied={aplicarMargen}
        type={tipoMargen}
        onToggle={setAplicarMargen}
        onSelectType={setTipoMargen}
      />

      <SpeedCalculatorResults
        result={resultado}
        limit={limite}
        marginType={tipoMargen}
        isMarginApplied={aplicarMargen}
        scenarios={scenarios}
      />
    </div>
  );
}
