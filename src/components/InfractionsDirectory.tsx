"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { INFRACTIONS_DATA } from "@/data/infractions";
import { InfractionData, InfractionCategory } from "@/types";
import { InfractionsDirectoryModal } from "@/components/InfractionsDirectoryModal";
import { infractionSeverityTagClass } from "@/components/InfractionsDirectorySeverity";
import { Search, Filter, X, ChevronRight, FileText } from "lucide-react";

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

function InfractionsDirectoryCard({ infraction, onOpenDetails }: { infraction: InfractionData; onOpenDetails: () => void }) {
  return (
    <div className="card card-compact flex flex-col justify-between">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="tag truncate text-muted">{infraction.categoria}</span>
          <span className={`tag shrink-0 ${infraction.puntos > 0 ? "tag-accent" : "text-muted"}`}>
            {infraction.puntos > 0
              ? `-${infraction.puntos} ${infraction.puntos === 1 ? "punto" : "puntos"}`
              : "0 puntos"}
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-bold leading-snug">{infraction.titulo}</h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="font-mono">{infraction.articulo}</span>
          <span className={infractionSeverityTagClass(infraction.gravedad)}>{infraction.gravedad}</span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted">{infraction.resumen}</p>
      </div>

      <div className="mt-5 border-t border-line pt-3">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="block text-[11px] font-bold uppercase text-muted">Importe base</span>
            <span className="font-mono text-xl font-bold">{infraction.importe} €</span>
          </div>

          <div className="text-right">
            <span className={`block text-[11px] font-bold uppercase ${infraction.permiteProntoPago ? "text-positive" : "text-muted"}`}>
              {infraction.permiteProntoPago ? "Pronto pago (-50%)" : "Pronto pago"}
            </span>
            {infraction.permiteProntoPago ? (
              <span className="font-mono text-lg font-bold text-positive">{infraction.prontoPago} €</span>
            ) : (
              <span className="text-xs font-semibold text-negative">No bonificado</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onOpenDetails} className="btn btn-secondary">
            Ver detalles
          </button>
          <Link href={`/multas/${infraction.slug}`} className="btn btn-primary">
            <span>Ficha SEO</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

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
      <div className="card">
        <div className="max-w-3xl">
          <div className="tag mb-2 inline-flex items-center gap-2 whitespace-normal text-accent">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Catálogo Ley de Seguridad Vial
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Buscador de infracciones y pérdida de puntos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Consulta en tiempo real el importe de la multa, descuento por pronto pago, detracción de puntos y plazos de recurso según la Ley de Seguridad Vial.
          </p>
        </div>

        <div className="relative mt-6">
          <label htmlFor="search-infractions-input" className="sr-only">
            Buscar infracción por palabra clave
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="search-infractions-input"
            type="text"
            placeholder="Buscar por infracción (móvil, cinturón, alcohol, ITV, seguro, semáforo, ZBE...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field field-search"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted hover:text-fg"
              aria-label="Borrar búsqueda"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="ml-1 hidden h-4 w-4 shrink-0 text-muted sm:block" aria-hidden="true" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className="option-btn shrink-0 whitespace-nowrap text-xs"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>Mostrando {filteredInfractions.length} de {INFRACTIONS_DATA.length} infracciones</span>
          {selectedCategory !== "Todas" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("Todas")}
              className="min-h-11 text-accent hover:underline"
            >
              Restablecer categoría
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInfractions.map((inf) => (
          <InfractionsDirectoryCard key={inf.id} infraction={inf} onOpenDetails={() => setActiveModalInfraction(inf)} />
        ))}
      </div>

      {activeModalInfraction && (
        <InfractionsDirectoryModal infraction={activeModalInfraction} onClose={() => setActiveModalInfraction(null)} />
      )}
    </div>
  );
}
