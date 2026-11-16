"use client";

import React, { useState, useId } from "react";
import {
  RoadSpeedLimit,
  AVAILABLE_LIMITS,
  calculateSpeedFine,
  getPenalThreshold,
} from "@/data/speedFineTable";
import {
  Gauge,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";

interface SpeedCalculatorProps {
  initialLimit?: RoadSpeedLimit;
}

export function SpeedCalculator({ initialLimit = 120 }: SpeedCalculatorProps) {
  const [limite, setLimite] = useState<RoadSpeedLimit>(initialLimit);
  const [velocidadDetectada, setVelocidadDetectada] = useState<number>(138);
  const [aplicarMargen, setAplicarMargen] = useState<boolean>(true);
  const [tipoMargen, setTipoMargen] = useState<"fijo" | "movil">("fijo");
  const [copied, setCopied] = useState<boolean>(false);
  const sliderId = useId();
  const inputId = useId();

  // Run calculation
  const resultado = calculateSpeedFine(limite, velocidadDetectada, aplicarMargen, tipoMargen);

  // Also calculate comparative scenarios for full clarity
  const resultadoSinMargen = calculateSpeedFine(limite, velocidadDetectada, false);
  const resultadoFijo = calculateSpeedFine(limite, velocidadDetectada, true, "fijo");
  const resultadoMovil = calculateSpeedFine(limite, velocidadDetectada, true, "movil");

  const umbralPenal = getPenalThreshold(limite);
  const maxSliderSpeed = Math.max(220, limite + 90);

  const handleCopySummary = () => {
    const text = `Consulta RadarPuntos:\nLímite de vía: ${limite} km/h\nVelocidad registrada: ${velocidadDetectada} km/h\nVelocidad corregida (margen ${tipoMargen}): ${resultado.velocidadEfectiva} km/h\nSanción: ${resultado.importe} € (Pronto pago: ${resultado.prontoPago} €)\nPuntos retirados: ${resultado.puntos}\nCalificación: ${resultado.gravedad}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-white dark:bg-[#141414] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800/80 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 dark:from-[#171717] dark:via-[#141414] dark:to-[#171717]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 mb-2">
              <Gauge className="w-3.5 h-3.5" />
              Baremo Ley de Seguridad Vial (RDL 6/2015)
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Calculadora de Multas por Velocidad
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Selecciona el límite de la vía y la velocidad para conocer la sanción exacta, retirada de puntos y aplicación de márgenes de radar.
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors"
            title="Copiar desglose completo"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar informe</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Paso 1: Límite de la vía */}
        <section aria-labelledby="heading-paso-1" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="heading-paso-1" className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              1. Límite de velocidad de la vía
            </h3>
            <span className="text-xs font-medium text-neutral-400">
              {limite <= 50 ? "Vía Urbana / Travesía" : "Vía Interurbana / Autovía"}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
            {AVAILABLE_LIMITS.map((vel) => {
              const isSelected = limite === vel;
              return (
                <button
                  key={vel}
                  onClick={() => setLimite(vel)}
                  className={`py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-150 flex flex-col items-center justify-center border ${
                    isSelected
                      ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-md shadow-[#ff6b00]/30 scale-105"
                      : "bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#ff6b00]/50"
                  }`}
                >
                  <span className="text-base">{vel}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? "text-white/80" : "text-neutral-400"}`}>
                    km/h
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Paso 2: Velocidad registrada */}
        <section aria-labelledby="heading-paso-2" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 id="heading-paso-2" className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              2. Velocidad a la que circulabas
            </h3>
            <div className="flex items-center gap-2">
              <label htmlFor={inputId} className="text-xs text-neutral-400">
                Ajuste numérico:
              </label>
              <div className="relative">
                <input
                  id={inputId}
                  type="number"
                  min={10}
                  max={280}
                  value={velocidadDetectada || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setVelocidadDetectada(isNaN(val) ? 0 : Math.min(280, Math.max(0, val)));
                  }}
                  className="w-24 px-3 py-1.5 rounded-lg text-right font-black text-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                />
                <span className="absolute right-8 top-2 text-xs text-neutral-400 pointer-events-none">
                  km/h
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <label htmlFor={sliderId} className="sr-only">
                Velocidad del vehículo en km/h
              </label>
              <input
                id={sliderId}
                type="range"
                min={20}
                max={maxSliderSpeed}
                value={velocidadDetectada}
                onChange={(e) => setVelocidadDetectada(parseInt(e.target.value, 10))}
                className="w-full h-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 accent-[#ff6b00] cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-neutral-400 px-1">
              <span>20 km/h</span>
              <span className="text-[#ff6b00] font-semibold">Límite: {limite} km/h</span>
              <span className="text-red-500 font-semibold">Umbral Penal: &gt;{umbralPenal} km/h</span>
              <span>{maxSliderSpeed} km/h</span>
            </div>
          </div>
        </section>

        {/* Paso 3: Margen de error del radar (Regla del 3-5%) */}
        <section aria-labelledby="heading-paso-3" className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <TrendingDown className="w-5 h-5 text-[#ff6b00] shrink-0 mt-0.5" />
              <div>
                <h3 id="heading-paso-3" className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  Aplicar margen de error del radar (Regla del 3-5%)
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Orden ICT/155/2020
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  La ley obliga a restar el margen metrológico a la foto antes de emitir la multa.
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={aplicarMargen}
                onChange={(e) => setAplicarMargen(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-[#ff6b00]"></div>
            </label>
          </div>

          {aplicarMargen && (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoMargen("fijo")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tipoMargen === "fijo"
                    ? "bg-[#ff6b00]/10 border-[#ff6b00] text-neutral-900 dark:text-white"
                    : "bg-white dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Radar Fijo / De Tramo</span>
                  <span className="text-[11px] font-mono font-semibold text-[#ff6b00]">
                    -3 km/h o -3%
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Cabinas laterales, pórticos, radares de tramo y postes fijos.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTipoMargen("movil")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tipoMargen === "movil"
                    ? "bg-[#ff6b00]/10 border-[#ff6b00] text-neutral-900 dark:text-white"
                    : "bg-white dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Radar Móvil / Camuflado</span>
                  <span className="text-[11px] font-mono font-semibold text-[#ff6b00]">
                    -5 km/h o -5%
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Trípodes en el arcén, vehículos patrulla camuflados y pistolas láser.
                </p>
              </button>
            </div>
          )}
        </section>

        {/* ALERTA DELITO PENAL (ART. 379 CÓDIGO PENAL) */}
        {resultado.esDelitoPenal && (
          <div className="p-5 rounded-2xl border-2 border-red-500/80 bg-red-500/10 dark:bg-red-950/30 text-red-700 dark:text-red-300 space-y-3 animate-pulse">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-black tracking-tight text-red-600 dark:text-red-400">
                  ¡ALERTA CRÍTICA: PRESUNTO DELITO PENAL (Art. 379.1 CP)!
                </h4>
                <p className="text-xs font-medium mt-1 leading-relaxed text-red-800 dark:text-red-200">
                  Circular a <strong>{resultado.velocidadEfectiva} km/h</strong> en vía de {limite} km/h excede el umbral en más de {limite <= 50 ? "60 km/h en vía urbana" : "80 km/h en vía interurbana"}.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs space-y-1">
              <p className="font-bold">Consecuencias legales del Código Penal:</p>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-800 dark:text-neutral-200">
                <li>Pena de prisión de 3 a 6 meses, o multa de 6 a 12 meses o trabajos en beneficio de la comunidad de 31 a 90 días.</li>
                <li><strong>Privación obligatoria del derecho a conducir</strong> vehículos a motor y ciclomotores de 1 a 4 años.</li>
                <li>Apertura inmediata de atestado policial y citación para juicio rápido por lo penal.</li>
              </ul>
            </div>
          </div>
        )}

        {/* RESULTADOS EN TIEMPO REAL */}
        <section aria-label="Resultado del cálculo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tarjeta 1: Importe Total y Pronto Pago */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#171717] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Sanción Económica
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white font-mono">
                    {resultado.importe} €
                  </span>
                  {resultado.importe > 0 && (
                    <span className="text-xs text-neutral-400 font-medium">importe base</span>
                  )}
                </div>
              </div>

              {resultado.importe > 0 ? (
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Con Pronto Pago (-50%):
                    </span>
                    <span className="text-lg font-black font-mono">{resultado.prontoPago} €</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Abonando en los primeros 20 días naturales
                  </p>
                </div>
              ) : (
                <div className="mt-4 text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Sin sanción económica
                </div>
              )}
            </div>

            {/* Tarjeta 2: Pérdida de Puntos */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
              resultado.puntos > 0
                ? "border-[#ff6b00]/40 bg-[#ff6b00]/10 dark:bg-[#ff6b00]/15"
                : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#171717]"
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Pérdida de Puntos
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-4xl md:text-5xl font-black font-mono ${
                    resultado.puntos > 0 ? "text-[#ff6b00]" : "text-neutral-900 dark:text-white"
                  }`}>
                    {resultado.puntos}
                  </span>
                  <span className="text-xs font-semibold uppercase text-neutral-500">
                    {resultado.puntos === 1 ? "punto" : "puntos"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 text-xs">
                {resultado.puntos > 0 ? (
                  <p className="text-[#ff6b00] font-medium leading-tight">
                    Retirada formal de puntos en el Registro de Conductores de la DGT.
                  </p>
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Esta infracción no resta puntos en tu carnet de conducir.
                  </p>
                )}
              </div>
            </div>

            {/* Tarjeta 3: Calificación y Velocidad Corregida */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#171717] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Calificación de la Infracción
                </span>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black uppercase tracking-wide ${
                    resultado.gravedad === "Sin sanción"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : resultado.gravedad === "Leve"
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : resultado.gravedad === "Grave"
                      ? "bg-[#ff6b00]/20 text-[#ff6b00]"
                      : resultado.gravedad === "Muy Grave"
                      ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                      : "bg-red-600 text-white font-extrabold"
                  }`}>
                    {resultado.gravedad}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Velocidad imputada:</span>
                  <strong className="text-neutral-900 dark:text-white font-mono">
                    {resultado.velocidadEfectiva} km/h
                  </strong>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Exceso de velocidad:</span>
                  <strong className="text-neutral-900 dark:text-white font-mono">
                    +{resultado.excesoKmH} km/h
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla comparativa de márgenes: Fijo vs Móvil vs Sin Margen */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#ff6b00]" /> Comparativa según tipo de cinemómetro
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-medium">
                    <th className="pb-2">Escenario</th>
                    <th className="pb-2">Vel. Imputada</th>
                    <th className="pb-2">Multa Base</th>
                    <th className="pb-2">Pronto Pago</th>
                    <th className="pb-2">Puntos</th>
                    <th className="pb-2">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                  <tr className={tipoMargen === "fijo" && aplicarMargen ? "bg-[#ff6b00]/10 font-bold" : ""}>
                    <td className="py-2 font-sans flex items-center gap-1">
                      <span>Radar Fijo (-3 km/h o -3%)</span>
                      {tipoMargen === "fijo" && aplicarMargen && (
                        <span className="text-[10px] bg-[#ff6b00] text-white px-1.5 rounded">Activo</span>
                      )}
                    </td>
                    <td className="py-2">{resultadoFijo.velocidadEfectiva} km/h</td>
                    <td className="py-2">{resultadoFijo.importe} €</td>
                    <td className="py-2 text-emerald-500">{resultadoFijo.prontoPago} €</td>
                    <td className="py-2 text-[#ff6b00]">{resultadoFijo.puntos}</td>
                    <td className="py-2 font-sans">{resultadoFijo.gravedad}</td>
                  </tr>
                  <tr className={tipoMargen === "movil" && aplicarMargen ? "bg-[#ff6b00]/10 font-bold" : ""}>
                    <td className="py-2 font-sans flex items-center gap-1">
                      <span>Radar Móvil (-5 km/h o -5%)</span>
                      {tipoMargen === "movil" && aplicarMargen && (
                        <span className="text-[10px] bg-[#ff6b00] text-white px-1.5 rounded">Activo</span>
                      )}
                    </td>
                    <td className="py-2">{resultadoMovil.velocidadEfectiva} km/h</td>
                    <td className="py-2">{resultadoMovil.importe} €</td>
                    <td className="py-2 text-emerald-500">{resultadoMovil.prontoPago} €</td>
                    <td className="py-2 text-[#ff6b00]">{resultadoMovil.puntos}</td>
                    <td className="py-2 font-sans">{resultadoMovil.gravedad}</td>
                  </tr>
                  <tr className={!aplicarMargen ? "bg-[#ff6b00]/10 font-bold" : ""}>
                    <td className="py-2 font-sans flex items-center gap-1">
                      <span>Sin Margen (velocidad leída pura)</span>
                      {!aplicarMargen && (
                        <span className="text-[10px] bg-[#ff6b00] text-white px-1.5 rounded">Activo</span>
                      )}
                    </td>
                    <td className="py-2">{resultadoSinMargen.velocidadEfectiva} km/h</td>
                    <td className="py-2">{resultadoSinMargen.importe} €</td>
                    <td className="py-2 text-emerald-500">{resultadoSinMargen.prontoPago} €</td>
                    <td className="py-2 text-[#ff6b00]">{resultadoSinMargen.puntos}</td>
                    <td className="py-2 font-sans">{resultadoSinMargen.gravedad}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
