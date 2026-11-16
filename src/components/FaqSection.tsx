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
    <section id="faq" aria-labelledby="faq-title" className="w-full space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20">
          <HelpCircle className="w-3.5 h-3.5" />
          Preguntas Frecuentes
        </div>
        <h2 id="faq-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Dudas Comunes sobre Multas y Puntos DGT
        </h2>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          Todo lo que necesitas saber sobre plazos de notificación, pronto pago del 50%, márgenes de radar y recuperación del carnet de conducir.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {HOME_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm md:text-base text-neutral-900 dark:text-white hover:text-[#ff6b00] dark:hover:text-[#ff6b00] transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#ff6b00]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-800/80 text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
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
