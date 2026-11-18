"use client";

import React, { useEffect, useRef } from "react";
import { getAdSenseClient } from "@/components/AdSenseScript";

const ADSENSE_SLOT_PATTERN = /^\d{10}$/;
const ADVERTISING_LABEL = "Publicidad";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Unidad de anuncio configurada, o null si falta o no tiene 10 dígitos. */
export function getAdSenseSlot(): string | null {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "";
  return ADSENSE_SLOT_PATTERN.test(slot) ? slot : null;
}

function AdSlotUnit({ client, slot, className }: { client: string; slot: string; className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    // En modo estricto React monta dos veces: la ref evita pedir dos anuncios para el mismo hueco.
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("No se pudo cargar el bloque de anuncio", error);
    }
  }, []);

  return (
    <aside aria-label={ADVERTISING_LABEL} className={className ? `ad-slot ${className}` : "ad-slot"}>
      <span className="ad-slot-label text-muted">{ADVERTISING_LABEL}</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

/**
 * Hueco de anuncio manual. No renderiza nada si falta un cliente válido
 * (NEXT_PUBLIC_ADSENSE_CLIENT) o una unidad válida (NEXT_PUBLIC_ADSENSE_SLOT, 10 dígitos).
 */
export function AdSlot({ className }: { className?: string }) {
  const client = getAdSenseClient();
  const slot = getAdSenseSlot();
  if (!client || !slot) return null;
  return <AdSlotUnit client={client} slot={slot} className={className} />;
}
