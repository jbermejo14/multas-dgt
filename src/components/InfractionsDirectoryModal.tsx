"use client";

import React from "react";
import Link from "next/link";
import { InfractionData } from "@/types";
import { X, ExternalLink } from "lucide-react";

interface InfractionsDirectoryModalProps {
  infraction: InfractionData;
  onClose: () => void;
}

function InfractionsDirectorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-fg">{title}</h4>
      {children}
    </div>
  );
}

/** Ventana con el detalle completo de una infracción: sanción, base legal, recuperación de puntos y recurso. */
export function InfractionsDirectoryModal({ infraction, onClose }: InfractionsDirectoryModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-infraction-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="card relative max-h-[90vh] w-full max-w-2xl space-y-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary btn-icon absolute right-3 top-3"
          aria-label="Cerrar ventana"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="tag tag-accent">{infraction.categoria}</span>
            <span className="font-mono text-xs text-muted">{infraction.articulo}</span>
          </div>
          <h2 id="modal-infraction-title" className="pr-14 text-xl font-extrabold sm:text-2xl">
            {infraction.titulo}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-xl border border-line bg-elevated p-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-muted">Importe</span>
            <div className="mt-0.5 font-mono text-xl font-bold">{infraction.importe} €</div>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-positive">Pronto pago</span>
            <div className="mt-0.5 font-mono text-xl font-bold text-positive">
              {infraction.permiteProntoPago ? `${infraction.prontoPago} €` : "No"}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-muted">Puntos</span>
            <div className={`mt-0.5 font-mono text-xl font-bold ${infraction.puntos > 0 ? "text-accent" : ""}`}>
              {infraction.puntos > 0 ? `-${infraction.puntos}` : "0"}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <InfractionsDirectorySection title="Descripción y hecho infractor">
            <p>{infraction.descripcion}</p>
          </InfractionsDirectorySection>

          <div className="space-y-1 rounded-xl border border-line bg-elevated p-3 text-xs">
            <div>
              <span className="font-bold text-fg">Base legal: </span>
              <span className="font-mono">{infraction.baseLegal}</span>
            </div>
            {infraction.fuente && (
              <div className="text-[11px]">
                <span>Fuente legal verificada: </span>
                <a href={infraction.fuente} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  Consultar texto oficial en BOE
                </a>
                {infraction.fechaVerificacion && (
                  <span className="ml-2">(Verificado: {infraction.fechaVerificacion})</span>
                )}
              </div>
            )}
          </div>

          <InfractionsDirectorySection title="Recuperación de puntos">
            <p>{infraction.plazoRecuperacion}</p>
          </InfractionsDirectorySection>

          <InfractionsDirectorySection title="¿Cómo recurrir esta sanción?">
            <p>{infraction.comoRecurrir}</p>
          </InfractionsDirectorySection>

          {infraction.consejos.length > 0 && (
            <InfractionsDirectorySection title="Consejos para conductores">
              <ul className="list-inside list-disc space-y-1 text-xs">
                {infraction.consejos.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </InfractionsDirectorySection>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <Link
            href={`/multas/${infraction.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-accent hover:underline"
          >
            <span>Ver página dedicada y preguntas frecuentes completas</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
