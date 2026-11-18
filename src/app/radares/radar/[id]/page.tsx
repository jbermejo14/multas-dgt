import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRadars, getRadarById } from "@/lib/radarsData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DgtRadarsMap } from "@/components/DgtRadarsMap";
import { Gauge, ExternalLink, ArrowLeft, ShieldAlert } from "lucide-react";

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

  const canonicalUrl = absoluteUrl(`/radares/radar/${radar.id}`);
  return {
    title: `Radar DGT en ${radar.carretera} PK ${radar.pk} (${radar.provincia})`,
    description: `Ficha del radar de ${radar.tipo.toLowerCase()} en ${radar.carretera} PK ${radar.pk} (${radar.provincia}), sentido ${radar.sentido}. Coordenadas y límites según el Punto de Acceso Nacional de la DGT.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Radar DGT en ${radar.carretera} PK ${radar.pk} | ${SITE_NAME}`,
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
    <main className="main-wrapper space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`tag ${radar.tipo === "Fijo" ? "tag-accent" : ""}`}>Cinemómetro de {radar.tipo}</span>

          <Link
            href={`/radares/${radar.provinciaSlug}/${radar.carreteraSlug}`}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-muted hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Volver a {radar.carretera}
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            Radar en {radar.carretera} &bull; punto kilométrico {radar.pk}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Provincia de {radar.provincia} &bull; {radar.singularity}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3">
          <div className="stat-tile">
            <span className="stat-label">Vía</span>
            <span className="font-mono text-lg font-bold">{radar.carretera}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Punto kilométrico</span>
            <span className="font-mono text-lg font-bold">PK {radar.pk}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Sentido</span>
            <span className="text-sm font-bold">{radar.sentido}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Coordenadas</span>
            <span className="font-mono text-xs">
              {radar.lat.toFixed(5)}, {radar.lng.toFixed(5)}
            </span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Tipo de cinemómetro</span>
            <span className="text-sm font-bold text-accent">{radar.tipo}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Identificador DGT</span>
            <span className="block truncate font-mono text-xs text-muted">{radar.dgtLocationId}</span>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">Localización exacta en mapa</h2>
        <DgtRadarsMap
          radars={[radar]}
          initialCenter={[radar.lat, radar.lng]}
          initialZoom={14}
          highlightId={radar.id}
          className="h-[400px] w-full rounded-2xl"
        />
      </section>

      <AdSlot />

      <section className="card space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <ShieldAlert className="h-5 w-5 text-accent" aria-hidden="true" />
          Límites y margen de error legal aplicable
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-muted">
          <p>
            Según la <strong className="text-fg">Orden ICT/155/2020</strong> de control metrológico del Estado, a los radares
            de tipo <em>{radar.tipo.toLowerCase()}</em> se les debe aplicar obligatoriamente un margen de error máximo permitido:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-2 font-mono text-fg">
            <li>Restar <strong>3 km/h</strong> si la velocidad del vehículo es igual o inferior a 100 km/h.</li>
            <li>Restar el <strong>3%</strong> si la velocidad del vehículo supera los 100 km/h.</li>
          </ul>
          <p>
            Nota: La DGT no publica en su canal de datos abiertos el límite puntual señalizado en cada cinemómetro.
            Respete siempre las señales verticales presentes en la vía ({radar.singularity}).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <Link href="/#calculadora" className="btn btn-primary">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            <span>Calcular multa con margen del 3%</span>
          </Link>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${radar.lat},${radar.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-muted hover:text-accent"
          >
            <span>Abrir en Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <AdSlot />

      <footer className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-elevated p-4 text-xs text-muted">
        <span>Fuente oficial: DGT Punto de Acceso Nacional (Publicado: {radar.fechaPublicacion})</span>
        <Link href={`/radares/${radar.provinciaSlug}`} className="inline-flex min-h-11 items-center text-accent hover:underline">
          &larr; Ver todos los radares de {radar.provincia}
        </Link>
      </footer>
    </main>
  );
}
