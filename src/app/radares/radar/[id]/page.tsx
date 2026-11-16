import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRadars, getRadarById } from "@/lib/radarsData";
import { getCanonicalUrl } from "@/lib/siteConfig";
import { JsonLd } from "@/components/JsonLd";
import { DgtRadarsMap } from "@/components/DgtRadarsMap";
import {
  MapPin,
  Navigation,
  Gauge,
  ExternalLink,
  ArrowLeft,
  ShieldAlert,
  Info,
  Calendar,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllRadars().map((r) => ({
    id: r.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const radar = getRadarById(id);

  if (!radar) {
    return {
      title: "Radar no encontrado",
      description: "El radar solicitado no existe en el catálogo de radares.",
    };
  }

  const canonicalUrl = getCanonicalUrl(`/radares/radar/${radar.id}`);
  return {
    title: `Radar DGT en ${radar.carretera} PK ${radar.pk} (${radar.provincia})`,
    description: `Ficha del radar de ${radar.tipo.toLowerCase()} en ${radar.carretera} PK ${radar.pk} (${radar.provincia}), sentido ${radar.sentido}. Coordenadas y límites según el Punto de Acceso Nacional de la DGT.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Radar DGT en ${radar.carretera} PK ${radar.pk} | RadarPuntos`,
      description: `Ubicación del cinemómetro DGT en ${radar.carretera} PK ${radar.pk} (${radar.provincia}).`,
      url: canonicalUrl,
    },
  };
}

export default async function RadarDetallePage({ params }: PageProps) {
  const { id } = await params;
  const radar = getRadarById(id);

  if (!radar) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Radares", url: "/radares" },
    { name: radar.provincia, url: `/radares/${radar.provinciaSlug}` },
    { name: radar.carretera, url: `/radares/${radar.provinciaSlug}/${radar.carreteraSlug}` },
    { name: `PK ${radar.pk}`, url: `/radares/radar/${radar.id}` },
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />

      <main className="min-h-screen bg-neutral-50 dark:bg-[#0D0D0D] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb nav */}
          <nav aria-label="Migas de pan" className="text-xs text-neutral-500 dark:text-neutral-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#ff6b00] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/radares" className="hover:text-[#ff6b00] transition-colors">
                  Radares
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/radares/${radar.provinciaSlug}`} className="hover:text-[#ff6b00] transition-colors">
                  {radar.provincia}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/radares/${radar.provinciaSlug}/${radar.carreteraSlug}`}
                  className="hover:text-[#ff6b00] transition-colors"
                >
                  {radar.carretera}
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-neutral-800 dark:text-neutral-200" aria-current="page">
                PK {radar.pk}
              </li>
            </ol>
          </nav>

          {/* Header Card */}
          <header className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  radar.tipo === "Tramo"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20"
                }`}
              >
                Cinemómetro de {radar.tipo}
              </span>

              <Link
                href={`/radares/${radar.provinciaSlug}/${radar.carreteraSlug}`}
                className="text-xs font-bold text-neutral-500 hover:text-[#ff6b00] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a {radar.carretera}
              </Link>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                Radar en {radar.carretera} &bull; Punto Kilométrico {radar.pk}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Provincia de {radar.provincia} &bull; {radar.singularity}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Vía</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-white">{radar.carretera}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Punto Kilométrico</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-white">PK {radar.pk}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Sentido</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{radar.sentido}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Coordenadas</span>
                <span className="text-xs font-mono text-neutral-900 dark:text-white">
                  {radar.lat.toFixed(5)}, {radar.lng.toFixed(5)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Tipo Cinemómetro</span>
                <span className="text-sm font-bold text-[#ff6b00]">{radar.tipo}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Identificador DGT</span>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate block">
                  {radar.dgtLocationId}
                </span>
              </div>
            </div>
          </header>

          {/* Map view */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Localización exacta en mapa
            </h2>
            <DgtRadarsMap
              radars={[radar]}
              initialCenter={[radar.lat, radar.lng]}
              initialZoom={14}
              highlightId={radar.id}
              className="h-[400px] w-full rounded-2xl"
            />
          </section>

          {/* Speed Limit & Legal Margin Notice */}
          <section className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#ff6b00]" />
              Límites y margen de error legal aplicable
            </h2>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Según la <strong>Orden ICT/155/2020</strong> de control metrológico del Estado, a los radares
                de tipo <em>{radar.tipo.toLowerCase()}</em> se les debe aplicar obligatoriamente un margen de error máximo permitido:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-neutral-700 dark:text-neutral-200">
                <li>Restar <strong>3 km/h</strong> si la velocidad del vehículo es igual o inferior a 100 km/h.</li>
                <li>Restar el <strong>3%</strong> si la velocidad del vehículo supera los 100 km/h.</li>
              </ul>
              <p className="text-neutral-400">
                Nota: La DGT no publica en su canal de datos abiertos el límite puntual señalizado en cada cinemómetro.
                Respete siempre las señales verticales presentes en la vía ({radar.singularity}).
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
              <Link
                href="/#calculadora"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-[#ff6b00]/25"
              >
                <Gauge className="w-4 h-4" />
                <span>Calcular multa con margen del 3%</span>
              </Link>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${radar.lat},${radar.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#ff6b00] inline-flex items-center gap-1"
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

          {/* Official Verification */}
          <footer className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between flex-wrap gap-2">
            <span>
              Fuente oficial: DGT Punto de Acceso Nacional (Publicado: {radar.fechaPublicacion})
            </span>
            <Link
              href={`/radares/${radar.provinciaSlug}`}
              className="text-[#ff6b00] hover:underline"
            >
              &larr; Ver todos los radares de {radar.provincia}
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
