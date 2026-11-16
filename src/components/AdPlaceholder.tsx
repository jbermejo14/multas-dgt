"use client";

import React from "react";
import { Megaphone } from "lucide-react";

interface AdPlaceholderProps {
  slotId?: string;
  format?: "banner-horizontal" | "rectangle" | "in-feed" | "compact";
  className?: string;
}

export function AdPlaceholder({
  format = "banner-horizontal",
  className = "",
}: AdPlaceholderProps) {
  const getFormatClasses = () => {
    switch (format) {
      case "banner-horizontal":
        return "min-h-[90px] max-w-4xl py-3";
      case "rectangle":
        return "min-h-[250px] w-full max-w-sm py-6";
      case "in-feed":
        return "min-h-[120px] w-full py-4";
      case "compact":
        return "min-h-[60px] w-full py-2";
      default:
        return "min-h-[90px] w-full py-3";
    }
  };

  return (
    <aside
      aria-label="Espacio Publicitario"
      className={`relative mx-auto my-6 w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/60 dark:bg-[#121212]/70 text-center transition-colors overflow-hidden ${getFormatClasses()} ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
        <Megaphone className="w-3.5 h-3.5 text-[#ff6b00]/60" />
        <span>Espacio Publicitario</span>
      </div>
      <p className="text-[11px] text-neutral-400/80 dark:text-neutral-600 max-w-md px-4">
        Anuncio patrocinado relevante sobre recursos de multas, seguros de auto o cursos DGT
      </p>
      <div className="absolute top-2 right-2 text-[10px] text-neutral-400/60 dark:text-neutral-600 uppercase font-mono">
        Ad
      </div>
    </aside>
  );
}
