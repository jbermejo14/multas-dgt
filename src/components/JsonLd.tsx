import React from "react";
import { HOME_FAQS } from "@/data/faqs";

export function JsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://radarpuntos.es/#website",
        "url": "https://radarpuntos.es/",
        "name": "RadarPuntos",
        "description": "Consultor de multas de tráfico, pérdida de puntos y mapa de radares DGT en España con margen metrológico.",
        "inLanguage": "es-ES",
      },
      {
        "@type": "WebApplication",
        "@id": "https://radarpuntos.es/#webapp",
        "name": "Calculadora de Multas y Puntos RadarPuntos",
        "url": "https://radarpuntos.es/",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
        },
        "description": "Calcula el importe de multas por exceso de velocidad, pérdida de puntos de carnet y márgenes de radar del 3-5% conforme a la Ley de Seguridad Vial.",
      },
      {
        "@type": "FAQPage",
        "@id": "https://radarpuntos.es/#faq",
        "mainEntity": HOME_FAQS.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
