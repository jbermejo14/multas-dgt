import React from "react";
import { HOME_FAQS } from "@/data/faqs";
import { getSiteUrl, getCanonicalUrl } from "@/lib/siteConfig";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface JsonLdProps {
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
}

export function JsonLd({ breadcrumbs, faqs }: JsonLdProps = {}) {
  const siteUrl = getSiteUrl();

  const graph: any[] = [];

  // If breadcrumbs are provided, emit BreadcrumbList
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.url.startsWith("http") ? crumb.url : getCanonicalUrl(crumb.url),
      })),
    });
  }

  // If page-specific FAQs are provided, emit FAQPage (only where visible on page)
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    });
  }

  // Default Home schema when neither custom breadcrumbs nor custom FAQs are passed
  if (!breadcrumbs && !faqs) {
    graph.push(
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": `${siteUrl}/`,
        "name": "RadarPuntos",
        "description": "Consultor de multas de tráfico, baremo de puntos y mapa de cinemómetros en España.",
        "inLanguage": "es-ES",
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#webapp`,
        "name": "Calculadora de Multas y Puntos RadarPuntos",
        "url": `${siteUrl}/`,
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
        "@id": `${siteUrl}/#faq`,
        "mainEntity": HOME_FAQS.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      }
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
