import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFRACTIONS_DATA } from "@/data/infractions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { getCanonicalUrl, getSiteUrl } from "@/lib/siteConfig";
import {
  ShieldAlert,
  Coins,
  Scale,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Share2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

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

  const canonicalUrl = getCanonicalUrl(`/multas/${infraction.slug}`);
  const title = `Multa por ${infraction.titulo} (${infraction.importe}€ y -${infraction.puntos} puntos)`;
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
      siteName: "RadarPuntos",
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

  const canonicalUrl = getCanonicalUrl(`/multas/${infraction.slug}`);
  const siteUrl = getSiteUrl();

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
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Infracciones de Tráfico",
            "item": `${siteUrl}/#infracciones`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": infraction.titulo,
            "item": canonicalUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": `Multa por ${infraction.titulo}: Sanción, Puntos y Procedimiento`,
        "description": infraction.descripcion,
        "inLanguage": "es-ES",
        "dateModified": `${infraction.fechaVerificacion}T00:00:00Z`,
        "author": {
          "@type": "Organization",
          "name": "RadarPuntos",
          "url": siteUrl,
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-neutral-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Migas de pan" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-neutral-400">
            <li>
              <Link href="/" className="hover:text-[#ff6b00] transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#infracciones" className="hover:text-[#ff6b00] transition-colors">
                Infracciones
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-700 dark:text-neutral-300 font-semibold truncate max-w-xs">
              {infraction.titulo}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/#infracciones"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#ff6b00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo completo de infracciones
          </Link>
        </div>

        {/* Hero Section */}
        <article className="space-y-8">
          <header className="p-6 sm:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#141414] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/15 text-[#ff6b00]">
                {infraction.categoria}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {infraction.articulo}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                infraction.gravedad === "Muy Grave" || infraction.gravedad === "Delito Penal"
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : infraction.gravedad === "Grave"
                  ? "bg-[#ff6b00]/15 text-[#ff6b00]"
                  : "bg-amber-500/15 text-amber-600"
              }`}>
                Infracción {infraction.gravedad}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              {infraction.titulo}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
              {infraction.resumen}
            </p>

            {/* Verificación legal destacada */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Verificación legal:</strong> {infraction.fechaVerificacion}
                </span>
              </div>
              <a
                href={infraction.fuente}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#ff6b00] hover:underline"
              >
                <span>Fuente oficial BOE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {/* Sanción */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Importe Base
                </span>
                <div className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                  {infraction.importe} €
                </div>
                <span className="text-[10px] text-neutral-400">cuantía sin bonificación</span>
              </div>

              {/* Pronto Pago */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Pronto Pago (-50%)
                </span>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {infraction.permiteProntoPago ? `${infraction.prontoPago} €` : "No aplicable"}
                </div>
                <span className="text-[10px] text-neutral-400">
                  {infraction.permiteProntoPago ? "primeros 20 días naturales" : "sin reducción (Art. 93.2 LSV)"}
                </span>
              </div>

              {/* Puntos */}
              <div className={`p-4 rounded-2xl border ${
                infraction.puntos > 0
                  ? "bg-[#ff6b00]/10 border-[#ff6b00]/30"
                  : "bg-white dark:bg-[#191919] border-neutral-200 dark:border-neutral-800"
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Pérdida de Puntos
                </span>
                <div className={`text-3xl font-black font-mono mt-1 ${
                  infraction.puntos > 0 ? "text-[#ff6b00]" : "text-neutral-900 dark:text-white"
                }`}>
                  {infraction.puntos > 0 ? `-${infraction.puntos}` : "0"} {infraction.puntos === 1 ? "Punto" : "Puntos"}
                </div>
                <span className="text-[10px] text-neutral-400">del carnet de conducir</span>
              </div>
            </div>
          </header>

          {/* Ad Space 1 */}
          <AdPlaceholder format="banner-horizontal" />

          {/* Detailed Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Detailed Breakdown */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#ff6b00]" />
                  Descripción del Hecho Infractor
                </h2>
                <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-3">
                  <p>{infraction.descripcion}</p>
                </div>
              </section>

              {/* Legal Basis */}
              <section className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#ff6b00]" />
                  Base Legal y Enlace Oficial
                </h3>
                <p className="text-sm font-mono text-neutral-800 dark:text-neutral-200">
                  {infraction.baseLegal}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Boletín Oficial del Estado:</span>
                  <a
                    href={infraction.fuente}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff6b00] underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{infraction.fuente}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </section>

              {/* How to appeal / Pronto pago guide */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#ff6b00]" />
                  ¿Cómo Recurrir la Multa o Acogerse al Pronto Pago?
                </h2>
                <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-3">
                  <p>{infraction.comoRecurrir}</p>

                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Regla de incompatibilidad entre pronto pago y recurso
                    </div>
                    <p>
                      Si decides abonar la sanción acogiéndote al 50% de descuento por pronto pago (20 días naturales), se pone fin a la vía administrativa y <strong>renuncias a presentar alegaciones</strong>. Si presentas alegaciones o recursos, pierdes automáticamente el derecho a la reducción del 50%.
                    </p>
                  </div>
                </div>
              </section>

              {/* Points recovery */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#ff6b00]" />
                  Plazo de Recuperación de Puntos
                </h2>
                <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-3">
                  <p>{infraction.plazoRecuperacion}</p>
                  <p>
                    Para recuperar los puntos de forma acelerada, puedes realizar un curso de sensibilización y reeducación vial de 12 horas presenciales acreditado en centros autorizados, recuperando hasta un máximo de 4 puntos.
                  </p>
                </div>
              </section>

              {/* Tips for drivers */}
              {infraction.consejos.length > 0 && (
                <section className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff6b00]" />
                    Recomendaciones de Conducción Preventiva
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                    {infraction.consejos.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Infraction specific FAQ (Visible en página -> FAQPage JSON-LD válido) */}
              {infraction.faq.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#ff6b00]" />
                    Preguntas Frecuentes sobre esta Infracción
                  </h2>
                  <div className="space-y-3">
                    {infraction.faq.map((item, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]"
                      >
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
                          {item.pregunta}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {item.respuesta}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <AdPlaceholder format="rectangle" />

              {/* Quick Calculator link */}
              <div className="p-5 rounded-2xl border border-[#ff6b00]/30 bg-[#ff6b00]/10 text-neutral-900 dark:text-white space-y-3">
                <h4 className="font-black text-sm text-[#ff6b00] uppercase tracking-wider">
                  ¿Te han multado por velocidad?
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Calcula de inmediato la sanción deduciendo el margen metrológico del 3-5% según la Orden ICT/155/2020.
                </p>
                <Link
                  href="/#calculadora"
                  className="inline-block w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-md shadow-[#ff6b00]/25 transition-colors"
                >
                  Abrir Calculadora de Velocidad
                </Link>
              </div>

              {/* Related Infractions */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                  Otras Infracciones Relacionadas
                </h4>
                <div className="space-y-3">
                  {fallbackRelated.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/multas/${rel.slug}`}
                      className="block p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-[#ff6b00]/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span>{rel.categoria}</span>
                        {rel.puntos > 0 ? (
                          <span className="text-[#ff6b00] font-bold">-{rel.puntos} pts</span>
                        ) : (
                          <span>0 pts</span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 group-hover:text-[#ff6b00] line-clamp-2 transition-colors">
                        {rel.titulo}
                      </h5>
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white mt-1 block">
                        {rel.importe} €
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>

        {/* Ad Space 2 */}
        <AdPlaceholder format="banner-horizontal" className="mt-12" />
      </main>

      <Footer />
    </div>
  );
}
