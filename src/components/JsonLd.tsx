import React from "react";
import { HOME_FAQS } from "@/data/faqs";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

/** Datos estructurados de la home: sitio web, aplicación y preguntas frecuentes visibles. */
export function JsonLd() {
  const homeUrl = absoluteUrl("/");

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        "url": homeUrl,
        "name": SITE_NAME,
        "description": "Consultor de multas de tráfico, baremo de puntos y mapa de cinemómetros en España.",
        "inLanguage": "es-ES",
      },
      {
        "@type": "WebApplication",
        "@id": `${homeUrl}#webapp`,
        "name": `Calculadora de multas y puntos ${SITE_NAME}`,
        "url": homeUrl,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
        },
        "description": "Calcula el importe de multas por exceso de velocidad, pérdida de puntos de carnet y márgenes de radar conforme a la Ley de Seguridad Vial.",
      },
      {
        "@type": "FAQPage",
        "@id": `${homeUrl}#faq`,
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
