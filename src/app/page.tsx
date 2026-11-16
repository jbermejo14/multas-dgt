"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpeedCalculator } from "@/components/SpeedCalculator";
import { InfractionsDirectory } from "@/components/InfractionsDirectory";
import { RadarMap } from "@/components/RadarMap";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { RoadSpeedLimit } from "@/types";
import {
  Gauge,
  ShieldAlert,
  MapPin,
  TrendingDown,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Radio,
  ArrowDown,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("calculadora");
  const [calculatorLimit, setCalculatorLimit] = useState<RoadSpeedLimit>(120);

  const handleSelectRadarLimit = (limit: RoadSpeedLimit) => {
    setCalculatorLimit(limit);
    setActiveTab("calculadora");
    const calc = document.getElementById("calculadora");
    if (calc) {
      calc.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-neutral-100 transition-colors">
      <JsonLd />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16 border-b border-neutral-200 dark:border-neutral-800/80 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-[#111111] dark:via-[#0D0D0D] dark:to-[#0D0D0D]">
        {/* Subtle background radar circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-5 dark:opacity-10">
          <div className="w-full h-full rounded-full border border-[#ff6b00]"></div>
          <div className="absolute inset-16 rounded-full border border-[#ff6b00]"></div>
          <div className="absolute inset-32 rounded-full border border-[#ff6b00]"></div>
          <div className="absolute inset-48 rounded-full border border-[#ff6b00]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 border border-[#ff6b00]/25 shadow-sm">
            <Radio className="w-4 h-4 text-[#ff6b00] animate-pulse" />
            <span>Consultor Oficial de Multas, Puntos y Radares DGT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Calcula tu multa, puntos del carnet y ubica <span className="text-[#ff6b00]">radares en España</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Aplica automáticamente la regla legal del margen de error del radar (3-5%), calcula el pronto pago con 50% de descuento y consulta cómo recurrir cualquier sanción de tráfico.
          </p>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Regla del 3-5% (Orden ICT/155/2020)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Pronto Pago: 50% en 20 días</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Detección Delito Penal (Art. 379 CP)</span>
            </div>
          </div>

          {/* Quick tab jump buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#calculadora"
              onClick={() => setActiveTab("calculadora")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-white bg-[#ff6b00] hover:bg-[#e05e00] shadow-lg shadow-[#ff6b00]/30 transition-all hover:scale-[1.02]"
            >
              <Gauge className="w-4 h-4" />
              <span>Calculadora de Velocidad</span>
            </a>
            <a
              href="#infracciones"
              onClick={() => setActiveTab("infracciones")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-[#ff6b00]" />
              <span>Buscador de Infracciones</span>
            </a>
            <a
              href="#radares"
              onClick={() => setActiveTab("radares")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#ff6b00]" />
              <span>Mapa de Radares</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Top Ad Space */}
        <AdPlaceholder format="banner-horizontal" />

        {/* SECCIÓN A: CALCULADORA DE MULTAS POR EXCESO DE VELOCIDAD */}
        <section id="calculadora" aria-label="Calculadora de multas de velocidad" className="scroll-mt-24">
          <SpeedCalculator key={calculatorLimit} initialLimit={calculatorLimit} />
        </section>

        {/* Ad Space below calculator */}
        <AdPlaceholder format="banner-horizontal" />

        {/* SECCIÓN B: BUSCADOR DE INFRACCIONES Y PÉRDIDA DE PUNTOS */}
        <section id="infracciones" aria-label="Buscador de infracciones y pérdida de puntos" className="scroll-mt-24">
          <InfractionsDirectory />
        </section>

        {/* Middle In-feed Ad Space */}
        <AdPlaceholder format="in-feed" />

        {/* SECCIÓN C: BUSCADOR Y MAPA DE RADARES EN ESPAÑA */}
        <section id="radares" aria-label="Mapa de radares de tráfico en España" className="scroll-mt-24">
          <RadarMap onSelectRadarLimit={handleSelectRadarLimit} />
        </section>

        {/* Ad Space before FAQ */}
        <AdPlaceholder format="banner-horizontal" />

        {/* SECCIÓN D: PREGUNTAS FRECUENTES (FAQ) */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
