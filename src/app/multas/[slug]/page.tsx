import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFRACTIONS_DATA } from "@/data/infractions";
import type { InfractionData } from "@/types";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { infractionSeverityTagClass } from "@/components/InfractionsDirectorySeverity";
import {
  Scale,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

/** Título de la ficha: "Multa por <título en minúscula inicial>: <importe> € y <puntos> puntos". La marca la añade la plantilla del layout. */
function infractionSeoTitle(infraction: InfractionData): string {
  const lowerCaseTitle = infraction.titulo.charAt(0).toLowerCase() + infraction.titulo.slice(1);
  const consequence =
    infraction.puntos > 0
      ? `${infraction.importe} € y ${infraction.puntos} ${infraction.puntos === 1 ? "punto" : "puntos"}`
      : `${infraction.importe} €, sin pérdida de puntos`;
  return `Multa por ${lowerCaseTitle}: ${consequence}`;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INFRACTIONS_DATA.map((inf) => ({
    slug: inf.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const infraction = INFRACTIONS_DATA.find((item) => item.slug === slug);

  if (!infraction) {
    return {
      title: "Infracción no encontrada",
      description: "La infracción solicitada no existe en el catálogo de sanciones.",
    };
  }

  const canonicalUrl = absoluteUrl(`/multas/${infraction.slug}`);
  const title = infractionSeoTitle(infraction);
  const description = `Importe legal de ${infraction.importe}€ (${infraction.prontoPago}€ con 50% de pronto pago), detracción de ${infraction.puntos} puntos, plazos de alegaciones y normativa ${infraction.articulo}.`;

  return {
    title,
    description,
    keywords: [
      infraction.titulo,
      `multa ${infraction.categoria}`,
      infraction.articulo,
      "puntos carnet DGT",
      "pronto pago 50%",
      "como recurrir multa trafico",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "es_ES",
      url: canonicalUrl,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InfractionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const infraction = INFRACTIONS_DATA.find((item) => item.slug === slug);

  if (!infraction) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/multas/${infraction.slug}`);
  const homeUrl = absoluteUrl("/");

  // Infracciones relacionadas
  const relatedInfractions = INFRACTIONS_DATA.filter(
    (item) => item.slug !== infraction.slug && item.categoria === infraction.categoria
  ).slice(0, 3);

  const fallbackRelated =
    relatedInfractions.length > 0
      ? relatedInfractions
      : INFRACTIONS_DATA.filter((item) => item.slug !== infraction.slug).slice(0, 3);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": `Multa por ${infraction.titulo}: Sanción, Puntos y Procedimiento`,
        "description": infraction.descripcion,
        "inLanguage": "es-ES",
        "dateModified": `${infraction.fechaVerificacion}T00:00:00Z`,
        "author": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": homeUrl,
        },
      },
      ...(infraction.faq && infraction.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              "mainEntity": infraction.faq.map((f) => ({
                "@type": "Question",
                "name": f.pregunta,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.respuesta,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="main-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <Breadcrumbs
        items={[
          { name: "Inicio", url: "/" },
          { name: "Infracciones", url: "/" },
          { name: infraction.titulo, url: `/multas/${infraction.slug}` },
        ]}
      />

      <Link
        href="/#infracciones"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al catálogo completo de infracciones
      </Link>

      <article className="space-y-8">
        <header className="card space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag tag-accent">{infraction.categoria}</span>
            <span className="tag font-mono text-muted">{infraction.articulo}</span>
            <span className={infractionSeverityTagClass(infraction.gravedad)}>Infracción {infraction.gravedad}</span>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{infraction.titulo}</h1>

          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{infraction.resumen}</p>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-bg p-3.5 text-xs">
            <div className="flex items-center gap-2 text-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-positive" aria-hidden="true" />
              <span>
                <strong>Verificación legal:</strong> {infraction.fechaVerificacion}
              </span>
            </div>
            <a
              href={infraction.fuente}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent hover:underline"
            >
              <span>Fuente oficial BOE</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-bg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Importe base</span>
              <div className="mt-1 font-mono text-3xl font-bold">{infraction.importe} €</div>
              <span className="text-[11px] text-muted">cuantía sin bonificación</span>
            </div>

            <div className="rounded-xl border border-line bg-bg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-positive">Pronto pago (-50%)</span>
              <div className="mt-1 font-mono text-3xl font-bold text-positive">
                {infraction.permiteProntoPago ? `${infraction.prontoPago} €` : "No aplicable"}
              </div>
              <span className="text-[11px] text-muted">
                {infraction.permiteProntoPago ? "primeros 20 días naturales" : "sin reducción (Art. 93.2 LSV)"}
              </span>
            </div>

            <div className={`rounded-xl border p-4 ${infraction.puntos > 0 ? "border-accent bg-accent-soft" : "border-line bg-bg"}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Pérdida de puntos</span>
              <div className={`mt-1 font-mono text-3xl font-bold ${infraction.puntos > 0 ? "text-accent" : ""}`}>
                {infraction.puntos > 0 ? `-${infraction.puntos}` : "0"} {infraction.puntos === 1 ? "Punto" : "Puntos"}
              </div>
              <span className="text-[11px] text-muted">del carnet de conducir</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <FileText className="h-5 w-5 text-accent" aria-hidden="true" />
                Descripción del hecho infractor
              </h2>
              <p className="text-sm leading-relaxed text-muted">{infraction.descripcion}</p>
            </section>

            <section className="card card-compact space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <Scale className="h-4 w-4 text-accent" aria-hidden="true" />
                Base legal y enlace oficial
              </h3>
              <p className="font-mono text-sm">{infraction.baseLegal}</p>
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted">
                <span>Boletín Oficial del Estado:</span>
                <a
                  href={infraction.fuente}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 break-all font-semibold text-accent underline"
                >
                  <span>{infraction.fuente}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Scale className="h-5 w-5 text-accent" aria-hidden="true" />
                ¿Cómo recurrir la multa o acogerse al pronto pago?
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted">
                <p>{infraction.comoRecurrir}</p>

                <div className="alert-warning space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-warning">
                    <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Regla de incompatibilidad entre pronto pago y recurso
                  </div>
                  <p>
                    Si decides abonar la sanción acogiéndote al 50% de descuento por pronto pago (20 días naturales), se pone fin a la vía administrativa y <strong>renuncias a presentar alegaciones</strong>. Si presentas alegaciones o recursos, pierdes automáticamente el derecho a la reducción del 50%.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                Plazo de recuperación de puntos
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted">
                <p>{infraction.plazoRecuperacion}</p>
                <p>
                  Para recuperar los puntos de forma acelerada, puedes realizar un curso de sensibilización y reeducación vial de 12 horas presenciales acreditado en centros autorizados, recuperando hasta un máximo de 4 puntos.
                </p>
              </div>
            </section>

            {infraction.consejos.length > 0 && (
              <section className="card card-compact space-y-3">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                  Recomendaciones de conducción preventiva
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  {infraction.consejos.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" aria-hidden="true" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {infraction.faq.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                  <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
                  Preguntas frecuentes sobre esta infracción
                </h2>
                <div className="space-y-3">
                  {infraction.faq.map((item, index) => (
                    <div key={index} className="card card-compact">
                      <h4 className="mb-2 text-sm font-bold">{item.pregunta}</h4>
                      <p className="text-sm leading-relaxed text-muted">{item.respuesta}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card card-compact space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent">
                ¿Te han multado por velocidad?
              </h4>
              <p className="text-xs leading-relaxed text-muted">
                Calcula de inmediato la sanción deduciendo el margen metrológico del 3-5% según la Orden ICT/155/2020.
              </p>
              <Link href="/#calculadora" className="btn btn-primary w-full text-center">
                Abrir calculadora de velocidad
              </Link>
            </div>

            <div className="card card-compact space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Otras infracciones relacionadas</h4>
              <div className="space-y-3">
                {fallbackRelated.map((rel) => (
                  <Link key={rel.id} href={`/multas/${rel.slug}`} className="link-card link-card-stack">
                    <span className="flex items-center justify-between text-[11px] text-muted">
                      <span>{rel.categoria}</span>
                      <span className={rel.puntos > 0 ? "font-bold text-accent" : ""}>
                        {rel.puntos > 0 ? `-${rel.puntos} pts` : "0 pts"}
                      </span>
                    </span>
                    <span className="line-clamp-2 text-xs font-bold">{rel.titulo}</span>
                    <span className="font-mono text-xs font-bold">{rel.importe} €</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
