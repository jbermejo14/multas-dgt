import React from "react";
import { CheckCircle2, Info, ShieldAlert } from "lucide-react";
import type { SpeedCalculationResult } from "@/data/speedFineTable";
import { infractionSeverityTagClass } from "@/components/InfractionsDirectorySeverity";

const URBAN_LIMIT_MAX = 50;

interface SpeedCalculatorResultsProps {
  result: SpeedCalculationResult;
  limit: number;
  marginType: "fijo" | "movil";
  isMarginApplied: boolean;
  scenarios: { fixed: SpeedCalculationResult; mobile: SpeedCalculationResult; none: SpeedCalculationResult };
}

function SpeedCalculatorPenalAlert({ result, limit }: { result: SpeedCalculationResult; limit: number }) {
  return (
    <div className="alert-danger space-y-3" role="alert">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-negative" aria-hidden="true" />
        <div>
          <h4 className="text-base font-extrabold text-negative md:text-lg">
            ¡ALERTA CRÍTICA: PRESUNTO DELITO PENAL (Art. 379.1 CP)!
          </h4>
          <p className="mt-1 text-xs leading-relaxed">
            Circular a <strong>{result.velocidadEfectiva} km/h</strong> en vía de {limit} km/h excede el umbral en más de {limit <= URBAN_LIMIT_MAX ? "60 km/h en vía urbana" : "80 km/h en vía interurbana"}.
          </p>
        </div>
      </div>
      <div className="space-y-1 rounded-xl border border-line bg-surface p-3 text-xs">
        <p className="font-bold">Consecuencias legales del Código Penal:</p>
        <ul className="list-inside list-disc space-y-0.5">
          <li>Pena de prisión de 3 a 6 meses, o multa de 6 a 12 meses o trabajos en beneficio de la comunidad de 31 a 90 días.</li>
          <li><strong>Privación obligatoria del derecho a conducir</strong> vehículos a motor y ciclomotores de 1 a 4 años.</li>
          <li>Apertura inmediata de atestado policial y citación para juicio rápido por lo penal.</li>
        </ul>
      </div>
    </div>
  );
}

function SpeedCalculatorFineCard({ result }: { result: SpeedCalculationResult }) {
  return (
    <div className="card card-compact flex flex-col justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Sanción económica</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold text-fg md:text-5xl">{result.importe} €</span>
          {result.importe > 0 && <span className="text-xs text-muted">importe base</span>}
        </div>
      </div>

      {result.importe > 0 ? (
        <div className="mt-4 border-t border-line pt-3">
          <div className="flex items-center justify-between text-xs font-semibold text-positive">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Con pronto pago (-50%):
            </span>
            <span className="font-mono text-lg font-bold">{result.prontoPago} €</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted">Abonando en los primeros 20 días naturales</p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-positive">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Sin sanción económica
        </div>
      )}
    </div>
  );
}

function SpeedCalculatorPointsCard({ result }: { result: SpeedCalculationResult }) {
  const losesPoints = result.puntos > 0;
  return (
    <div className="card card-compact flex flex-col justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Pérdida de puntos</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`font-mono text-4xl font-bold md:text-5xl ${losesPoints ? "text-accent" : "text-fg"}`}>
            {result.puntos}
          </span>
          <span className="text-xs font-semibold uppercase text-muted">
            {result.puntos === 1 ? "punto" : "puntos"}
          </span>
        </div>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
        {losesPoints
          ? "Retirada formal de puntos en el Registro de Conductores de la DGT."
          : "Esta infracción no resta puntos en tu carnet de conducir."}
      </p>
    </div>
  );
}

function SpeedCalculatorSeverityCard({ result }: { result: SpeedCalculationResult }) {
  return (
    <div className="card card-compact flex flex-col justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Calificación de la infracción</span>
        <div className="mt-2">
          <span className={`${infractionSeverityTagClass(result.gravedad)} tag-lg uppercase`}>
            {result.gravedad}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-1 border-t border-line pt-3 text-xs text-muted">
        <div className="flex justify-between">
          <span>Velocidad imputada:</span>
          <strong className="font-mono text-fg">{result.velocidadEfectiva} km/h</strong>
        </div>
        <div className="flex justify-between">
          <span>Exceso de velocidad:</span>
          <strong className="font-mono text-fg">+{result.excesoKmH} km/h</strong>
        </div>
      </div>
    </div>
  );
}

interface SpeedCalculatorScenarioRowProps {
  label: string;
  scenario: SpeedCalculationResult;
  isActive: boolean;
}

function SpeedCalculatorScenarioRow({ label, scenario, isActive }: SpeedCalculatorScenarioRowProps) {
  return (
    <tr className={isActive ? "bg-accent-soft font-bold" : ""}>
      <td>
        <span>{label}</span>
        {isActive && <span className="tag tag-accent tag-xs ml-2">Activo</span>}
      </td>
      <td className="whitespace-nowrap font-mono">{scenario.velocidadEfectiva} km/h</td>
      <td className="whitespace-nowrap font-mono">{scenario.importe} €</td>
      <td className="whitespace-nowrap font-mono text-positive">{scenario.prontoPago} €</td>
      <td className="font-mono text-accent">{scenario.puntos}</td>
      <td className="whitespace-nowrap">{scenario.gravedad}</td>
    </tr>
  );
}

function SpeedCalculatorScenarioTable({
  marginType,
  isMarginApplied,
  scenarios,
}: Pick<SpeedCalculatorResultsProps, "marginType" | "isMarginApplied" | "scenarios">) {
  return (
    <div className="card card-compact">
      <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
        <Info className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Comparativa según tipo de cinemómetro
      </h4>
      <div className="table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Escenario</th>
              <th>Vel. imputada</th>
              <th>Multa base</th>
              <th>Pronto pago</th>
              <th>Puntos</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            <SpeedCalculatorScenarioRow
              label="Radar fijo (-3 km/h o -3%)"
              scenario={scenarios.fixed}
              isActive={isMarginApplied && marginType === "fijo"}
            />
            <SpeedCalculatorScenarioRow
              label="Radar móvil (-5 km/h o -5%)"
              scenario={scenarios.mobile}
              isActive={isMarginApplied && marginType === "movil"}
            />
            <SpeedCalculatorScenarioRow
              label="Sin margen (velocidad leída pura)"
              scenario={scenarios.none}
              isActive={!isMarginApplied}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Resultado del cálculo: alerta penal, tres tarjetas resumen y tabla comparativa de márgenes. */
export function SpeedCalculatorResults({ result, limit, marginType, isMarginApplied, scenarios }: SpeedCalculatorResultsProps) {
  return (
    <>
      {result.esDelitoPenal && <SpeedCalculatorPenalAlert result={result} limit={limit} />}

      <section aria-label="Resultado del cálculo" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpeedCalculatorFineCard result={result} />
          <SpeedCalculatorPointsCard result={result} />
          <SpeedCalculatorSeverityCard result={result} />
        </div>
        <SpeedCalculatorScenarioTable marginType={marginType} isMarginApplied={isMarginApplied} scenarios={scenarios} />
      </section>
    </>
  );
}
