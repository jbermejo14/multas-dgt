"use client";

import React, { useState } from "react";
import { HOME_FAQS } from "@/data/faqs";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="w-full scroll-mt-28 space-y-6">
      <div className="max-w-3xl space-y-2">
        <div className="tag inline-flex items-center gap-1.5 text-accent">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Preguntas frecuentes
        </div>
        <h2 id="faq-title" className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Dudas comunes sobre multas y puntos DGT
        </h2>
        <p className="text-sm text-muted">
          Todo lo que necesitas saber sobre plazos de notificación, pronto pago del 50%, márgenes de radar y recuperación del carnet de conducir.
        </p>
      </div>

      <div className="max-w-3xl space-y-3">
        {HOME_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="overflow-hidden rounded-xl border border-line bg-surface">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex min-h-11 w-full items-center justify-between gap-4 p-4 text-left text-sm font-bold text-fg hover:text-accent md:text-base"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-accent" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="border-t border-line px-4 pb-4 pt-3 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
