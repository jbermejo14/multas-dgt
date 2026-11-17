"use client";

import React, { useState } from "react";
import { SpeedCalculator } from "@/components/SpeedCalculator";
import { InfractionsDirectory } from "@/components/InfractionsDirectory";
import { RadarMap } from "@/components/RadarMap";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { RoadSpeedLimit } from "@/types";
import { Gauge, ShieldAlert, MapPin, CheckCircle, Radio } from "lucide-react";

const HERO_FEATURES = [
  "Regla del 3-5% (Orden ICT/155/2020)",
  "Pronto Pago: 50% en 20 días naturales",
  "Detección Delito Penal (Art. 379 CP)",
];

export function HomePageView() {
  const [calculatorLimit, setCalculatorLimit] = useState<RoadSpeedLimit>(120);

  const handleSelectRadarLimit = (limit: RoadSpeedLimit) => {
    setCalculatorLimit(limit);
    const calc = document.getElementById("calculadora");
    if (calc) {
      calc.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="main-wrapper space-y-12">
      <JsonLd />

      <section aria-labelledby="home-title" className="space-y-4">
        <div className="tag inline-flex items-center gap-2 whitespace-normal text-accent">
          <Radio className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Consultor informativo de multas, puntos y radares en España</span>
        </div>

        <h1 id="home-title" className="max-w-4xl text-2xl font-extrabold tracking-tight md:text-4xl">
          Calcula tu multa, puntos del carnet y ubica <span className="text-accent">radares en España</span>
        </h1>

        <p className="max-w-3xl text-sm text-muted md:text-base">
          Aplica automáticamente la regla legal del margen de error del radar (3-5% según Orden ICT/155/2020), calcula el pronto pago con 50% de descuento y consulta cómo recurrir sanciones de tráfico.
        </p>

        <ul className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
          {HERO_FEATURES.map((feature) => (
            <li key={feature} className="tag flex items-center gap-1.5 whitespace-normal">
              <CheckCircle className="h-4 w-4 shrink-0 text-[var(--positive)]" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#calculadora" className="btn btn-primary">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            <span>Calculadora de velocidad</span>
          </a>
          <a href="#infracciones" className="btn btn-secondary">
            <ShieldAlert className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Buscador de infracciones</span>
          </a>
          <a href="#radares" className="btn btn-secondary">
            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Mapa de radares</span>
          </a>
        </div>
      </section>

      <section id="calculadora" aria-label="Calculadora de multas de velocidad" className="scroll-mt-28">
        <SpeedCalculator key={calculatorLimit} initialLimit={calculatorLimit} />
      </section>

      <section id="infracciones" aria-label="Buscador de infracciones y pérdida de puntos" className="scroll-mt-28">
        <InfractionsDirectory />
      </section>

      <section id="radares" aria-label="Mapa de radares de tráfico en España" className="scroll-mt-28">
        <RadarMap onSelectRadarLimit={handleSelectRadarLimit} />
      </section>

      <FaqSection />
    </main>
  );
}
