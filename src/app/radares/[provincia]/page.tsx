import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProvinces,
  getProvinceBySlug,
  getRadarsByProvince,
  getRoadsByProvince,
} from "@/lib/radarsData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DgtRadarsMap } from "@/components/DgtRadarsMap";
import { MapPin, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ provincia: string }>;
}

export async function generateStaticParams() {
  return getAllProvinces().map((p) => ({
    provincia: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provincia: slug } = await params;
  const province = getProvinceBySlug(slug);

  if (!province) {
    return {
      title: "Provincia no encontrada",
      description: "No se encontraron radares en la provincia solicitada.",
    };
  }

  const canonicalUrl = absoluteUrl(`/radares/${province.slug}`);
  return {
    title: `Radares DGT en ${province.name}: Ubicación, Carreteras y PK`,
    description: `Consulta la ubicación de los ${province.totalRadars} radares fijos y de tramo de la DGT en la provincia de ${province.name}. Puntos kilométricos y vías.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Radares DGT en ${province.name} | ${SITE_NAME}`,
      description: `Ubicación de cinemómetros en ${province.name} en ${province.roadsCount} carreteras.`,
      url: canonicalUrl,
    },
  };
}

export default async function RadaresProvinciaPage({ params }: PageProps) {
  const { provincia: slug } = await params;
  const province = getProvinceBySlug(slug);

  if (!province) {
    notFound();
  }

  const radars = getRadarsByProvince(slug);
  const roads = getRoadsByProvince(slug);
  const fijos = radars.filter((r) => r.tipo === "Fijo").length;
  const tramos = radars.filter((r) => r.tipo === "Tramo").length;

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Radares", url: "/radares" },
    { name: province.name, url: `/radares/${province.slug}` },
  ];

  return (
    <main className="main-wrapper space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="card space-y-4">
        <div className="tag inline-flex items-center gap-2 whitespace-normal text-accent">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          Provincia de {province.name}
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Radares DGT en {province.name}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Catálogo de cinemómetros fijos y de tramo activos de la Dirección General de Tráfico
          en carreteras de {province.name}. Consulta el punto kilométrico (PK), sentido de circulación y
          localización en el mapa interactivo.
        </p>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-4">
          <div className="stat-tile">
            <span className="stat-label">Total radares</span>
            <span className="stat-value">{radars.length}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Carreteras</span>
            <span className="stat-value">{roads.length}</span>
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
        <h2 className="text-xl font-extrabold">Mapa de radares en {province.name}</h2>
        <DgtRadarsMap radars={radars} className="h-[400px] w-full rounded-2xl" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold">Carreteras con cinemómetros en {province.name}</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {roads.map((road) => (
            <Link
              key={road.slug}
              href={`/radares/${province.slug}/${road.slug}`}
              className="link-card link-card-stack"
            >
              <span className="link-card-name">{road.name}</span>
              <span className="link-card-hint">
                {road.totalRadars} {road.totalRadars === 1 ? "radar" : "radares"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold">Listado completo de cinemómetros en {province.name}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {radars.map((radar) => (
            <div key={radar.id} className="card card-compact flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold">{radar.carretera}</span>
                    <span className="tag font-mono">PK {radar.pk}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Sentido: <strong className="text-fg">{radar.sentido}</strong> &bull; {radar.singularity}
                  </div>
                </div>
                <span className={`tag shrink-0 ${radar.tipo === "Fijo" ? "tag-accent" : ""}`}>{radar.tipo}</span>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-2 text-xs">
                <span className="font-mono text-[11px] text-muted">
                  {radar.lat.toFixed(4)}, {radar.lng.toFixed(4)}
                </span>
                <Link
                  href={`/radares/radar/${radar.id}`}
                  className="inline-flex min-h-11 items-center gap-1 font-bold text-accent hover:underline"
                >
                  <span>Ver ficha</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-elevated p-4 text-xs text-muted">
        <span>Fuente oficial: DGT Punto de Acceso Nacional (publicado {radars[0]?.fechaPublicacion || "2025-12-18"})</span>
        <Link href="/radares" className="inline-flex min-h-11 items-center text-accent hover:underline">
          &larr; Volver a todas las provincias
        </Link>
      </footer>
    </main>
  );
}
