"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { INFRACTIONS_DATA } from "@/data/infractions";
import { InfractionData, InfractionCategory } from "@/types";
import {
  Search,
  Filter,
  ShieldAlert,
  Coins,
  Scale,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

const CATEGORIES: ("Todas" | InfractionCategory)[] = [
  "Todas",
  "Móvil y Distracciones",
  "Alcohol y Drogas",
  "Seguridad y Cinturón",
  "Documentación e ITV",
  "Señales y Semáforos",
  "Velocidad",
  "ZBE y Medio Ambiente",
  "Dispositivos no autorizados",
];

export function InfractionsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [activeModalInfraction, setActiveModalInfraction] = useState<InfractionData | null>(null);

  const filteredInfractions = useMemo(() => {
    return INFRACTIONS_DATA.filter((item) => {
      const matchesSearch =
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.articulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todas" || item.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full space-y-6">
      {/* Header and Search / Filter Controls */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            Catálogo Ley de Seguridad Vial
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Buscador de Infracciones y Pérdida de Puntos
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Consulta en tiempo real el importe de la multa, descuento por pronto pago, detracción de puntos y plazos de recurso según la Ley de Seguridad Vial.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="mt-6 relative">
          <label htmlFor="search-infractions-input" className="sr-only">
            Buscar infracción por palabra clave
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="search-infractions-input"
            type="text"
            placeholder="Buscar por infracción (móvil, cinturón, alcohol, ITV, seguro, semáforo, ZBE...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all text-sm md:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0 ml-1 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-[#ff6b00] text-white shadow-sm shadow-[#ff6b00]/25"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="mt-3 flex justify-between text-xs text-neutral-400">
          <span>Mostrando {filteredInfractions.length} de {INFRACTIONS_DATA.length} infracciones</span>
          {selectedCategory !== "Todas" && (
            <button
              onClick={() => setSelectedCategory("Todas")}
              className="text-[#ff6b00] hover:underline"
            >
              Restablecer categoría
            </button>
          )}
        </div>
      </div>

      {/* Grid of Infraction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInfractions.map((inf) => {
          return (
            <div
              key={inf.id}
              className="group flex flex-col justify-between p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-[#ff6b00]/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div>
                {/* Top Row: Category and Points Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md truncate">
                    {inf.categoria}
                  </span>

                  {inf.puntos > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ff6b00] text-white shadow-sm shadow-[#ff6b00]/30 shrink-0">
                      -{inf.puntos} {inf.puntos === 1 ? "Punto" : "Puntos"}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 px-2 py-0.5 rounded-md shrink-0">
                      0 Puntos
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-[#ff6b00] transition-colors leading-snug line-clamp-2">
                  {inf.titulo}
                </h3>

                {/* Article and Summary */}
                <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span>{inf.articulo}</span>
                  <span>•</span>
                  <span className={
                    inf.gravedad === "Muy Grave" || inf.gravedad === "Delito Penal"
                      ? "text-rose-500 font-bold"
                      : inf.gravedad === "Grave"
                      ? "text-[#ff6b00] font-semibold"
                      : "text-amber-500"
                  }>
                    {inf.gravedad}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {inf.resumen}
                </p>
              </div>

              {/* Bottom: Pricing & Action Button */}
              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Importe Base
                    </span>
                    <span className="text-xl font-black text-neutral-900 dark:text-white font-mono">
                      {inf.importe} €
                    </span>
                  </div>

                  {inf.permiteProntoPago ? (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                        Pronto Pago (-50%)
                      </span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {inf.prontoPago} €
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Pronto Pago
                      </span>
                      <span className="text-xs font-semibold text-rose-500">
                        No bonificado
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalInfraction(inf)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1"
                  >
                    Ver detalles
                  </button>

                  <Link
                    href={`/multas/${inf.slug}`}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-colors flex items-center justify-center gap-1 shadow-sm shadow-[#ff6b00]/20"
                  >
                    <span>Ficha SEO</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALLE DE LA INFRACCIÓN */}
      {activeModalInfraction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-infraction-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalInfraction(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-6 text-neutral-900 dark:text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalInfraction(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#ff6b00]/15 text-[#ff6b00]">
                  {activeModalInfraction.categoria}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {activeModalInfraction.articulo}
                </span>
              </div>
              <h2 id="modal-infraction-title" className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white pr-8">
                {activeModalInfraction.titulo}
              </h2>
            </div>

            {/* Quick Sanción Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Importe</span>
                <div className="text-xl font-black font-mono mt-0.5">
                  {activeModalInfraction.importe} €
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  Pronto Pago
                </span>
                <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeModalInfraction.permiteProntoPago ? `${activeModalInfraction.prontoPago} €` : "No"}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Puntos</span>
                <div className={`text-xl font-black font-mono mt-0.5 ${activeModalInfraction.puntos > 0 ? "text-[#ff6b00]" : ""}`}>
                  {activeModalInfraction.puntos > 0 ? `-${activeModalInfraction.puntos}` : "0"}
                </div>
              </div>
            </div>

            {/* Body Info */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-xs mb-1">
                  Descripción y Hecho Infractor
                </h4>
                <p>{activeModalInfraction.descripcion}</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-xs space-y-1">
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Base Legal: </span>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">{activeModalInfraction.baseLegal}</span>
                </div>
                {activeModalInfraction.fuente && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Fuente legal verificada: </span>
                    <a
                      href={activeModalInfraction.fuente}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ff6b00] hover:underline"
                    >
                      Consultar texto oficial en BOE
                    </a>
                    {activeModalInfraction.fechaVerificacion && (
                      <span className="ml-2 text-neutral-400">
                        (Verificado: {activeModalInfraction.fechaVerificacion})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-xs mb-1">
                  Recuperación de Puntos
                </h4>
                <p>{activeModalInfraction.plazoRecuperacion}</p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-xs mb-1">
                  ¿Cómo Recurrir esta Sanción?
                </h4>
                <p>{activeModalInfraction.comoRecurrir}</p>
              </div>

              {activeModalInfraction.consejos.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-xs mb-1">
                    Consejos para Conductores
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {activeModalInfraction.consejos.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <Link
                href={`/multas/${activeModalInfraction.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:underline"
              >
                <span>Ver página dedicada y preguntas frecuentes completas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setActiveModalInfraction(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
