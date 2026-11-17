import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllRadars,
  getRadarsByRoad,
  getRoadInfo,
  getProvinceBySlug,
} from "@/lib/radarsData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DgtRadarsMap } from "@/components/DgtRadarsMap";
import { Navigation, ChevronRight, Gauge, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ provincia: string; carretera: string }>;
}

export async function generateStaticParams() {
  const all = getAllRadars();
  const combinations = new Map<string, { provincia: string; carretera: string }>();

  for (const r of all) {
    const key = `${r.provinciaSlug}___${r.carreteraSlug}`;
    if (!combinations.has(key)) {
      combinations.set(key, {
        provincia: r.provinciaSlug,
        carretera: r.carreteraSlug,
      });
    }
  }

  return Array.from(combinations.values());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provincia: provSlug, carretera: roadSlug } = await params;
  const info = getRoadInfo(provSlug, roadSlug);

  if (!info) {
    return {
      title: "Carretera no encontrada",
      description: "No se encontraron cinemómetros en la vía indicada.",
    };
  }

  const canonicalUrl = absoluteUrl(`/radares/${provSlug}/${roadSlug}`);
  return {
    title: `Radares DGT en ${info.roadName} (${info.provinceName}): Puntos Kilométricos y Ubicación`,
    description: `Consulta la ubicación de los ${info.totalRadars} radares fijos y de tramo en la ${info.roadName} en ${info.provinceName}. Sentido, PK y coordenadas DGT.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Radares DGT en ${info.roadName} (${info.provinceName}) | ${SITE_NAME}`,
      description: `Ubicación de cinemómetros en ${info.roadName} (${info.provinceName}).`,
      url: canonicalUrl,
    },
  };
}

export default async function RadaresCarreteraPage({ params }: PageProps) {
  const { provincia: provSlug, carretera: roadSlug } = await params;
  const province = getProvinceBySlug(provSlug);
  const radars = getRadarsByRoad(provSlug, roadSlug);

  if (!province || radars.length === 0) {
    notFound();
  }

  const roadName = radars[0].carretera;
  const fijos = radars.filter((r) => r.tipo === "Fijo").length;
  const tramos = radars.filter((r) => r.tipo === "Tramo").length;

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Radares", url: "/radares" },
    { name: province.name, url: `/radares/${province.slug}` },
    { name: roadName, url: `/radares/${province.slug}/${roadSlug}` },
  ];

  return (
    <main className="main-wrapper space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="tag inline-flex items-center gap-2 text-accent">
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Vía {roadName} &bull; {province.name}
          </div>
          <Link
            href={`/radares/${province.slug}`}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-muted hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Ver todos los radares de {province.name}
          </Link>
        </div>

        <h1 className="font-mono text-2xl font-bold tracking-tight sm:text-4xl">
          Radares DGT en {roadName} ({province.name})
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Ubicación de los cinemómetros situados a lo largo de la {roadName} a su paso por
          la provincia de {province.name}. Puntos kilométricos, sentido de la marcha y coordenadas geográficas.
        </p>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3">
          <div className="stat-tile">
            <span className="stat-label">Total en esta vía</span>
            <span className="stat-value">{radars.length}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Radares fijos</span>
            <span className="stat-value text-accent">{fijos}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Radares de tramo</span>
            <span className="stat-value text-accent">{tramos}</span>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">Mapa de radares en la {roadName}</h2>
        <DgtRadarsMap radars={radars} className="h-[400px] w-full rounded-2xl" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold">Puntos kilométricos y cinemómetros en la {roadName}</h2>
        <div className="space-y-3">
          {radars.map((radar) => (
            <div key={radar.id} className="card card-compact flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-lg font-bold">PK {radar.pk}</span>
                  <span className={`tag ${radar.tipo === "Fijo" ? "tag-accent" : ""}`}>Radar de {radar.tipo}</span>
                  <span className="tag text-muted">{radar.singularity}</span>
                </div>
                <p className="text-xs text-muted">
                  Sentido: <strong className="text-fg">{radar.sentido}</strong> &bull; Coordenadas: {radar.lat.toFixed(5)}, {radar.lng.toFixed(5)}
                </p>
              </div>

              <Link href={`/radares/radar/${radar.id}`} className="btn btn-primary shrink-0">
                <span>Ficha del radar</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="card flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold">¿Has sido captado por un radar en la {roadName}?</h3>
          <p className="mt-1 max-w-xl text-xs text-muted">
            Calcula al instante la sanción exacta aplicando el margen legal oficial de error (Orden ICT/155/2020),
            la posible pérdida de puntos y el descuento del 50% por pronto pago.
          </p>
        </div>
        <Link href="/#calculadora" className="btn btn-primary shrink-0">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          <span>Abrir calculadora</span>
        </Link>
      </div>
    </main>
  );
}
