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
import { MapPin, Navigation, ChevronRight, Info, ExternalLink } from "lucide-react";

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
    <>
      <main className="min-h-screen bg-neutral-50 dark:bg-[#0D0D0D] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <header className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20">
              <MapPin className="w-3.5 h-3.5" />
              Provincia de {province.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Radares DGT en {province.name}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Catálogo de cinemómetros fijos y de tramo activos de la Dirección General de Tráfico
              en carreteras de {province.name}. Consulta el punto kilométrico (PK), sentido de circulación y
              localización en el mapa interactivo.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Total Radares</span>
                <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">{radars.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Carreteras</span>
                <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">{roads.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-[#ff6b00] block">Radares Fijos</span>
                <span className="text-2xl font-black font-mono text-[#ff6b00]">{fijos}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-amber-500 block">Radares de Tramo</span>
                <span className="text-2xl font-black font-mono text-amber-500">{tramos}</span>
              </div>
            </div>
          </header>

          {/* Interactive Map */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Mapa de radares en {province.name}
            </h2>
            <DgtRadarsMap radars={radars} className="h-[400px] w-full rounded-2xl" />
          </section>

          {/* Highways and roads filter */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Carreteras con cinemómetros en {province.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {roads.map((road) => (
                <Link
                  key={road.slug}
                  href={`/radares/${province.slug}/${road.slug}`}
                  className="group p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-[#ff6b00]/60 transition-all flex flex-col justify-between"
                >
                  <span className="font-extrabold text-sm text-neutral-900 dark:text-white group-hover:text-[#ff6b00] transition-colors">
                    {road.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-1">
                    {road.totalRadars} {road.totalRadars === 1 ? "radar" : "radares"}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Complete radar table / card list */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Listado completo de cinemómetros en {province.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {radars.map((radar) => (
                <div
                  key={radar.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-neutral-900 dark:text-white">
                          {radar.carretera}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          PK {radar.pk}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Sentido: <strong className="text-neutral-700 dark:text-neutral-200">{radar.sentido}</strong> &bull; {radar.singularity}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        radar.tipo === "Tramo"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20"
                      }`}
                    >
                      {radar.tipo}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {radar.lat.toFixed(4)}, {radar.lng.toFixed(4)}
                    </span>
                    <Link
                      href={`/radares/radar/${radar.id}`}
                      className="font-bold text-[#ff6b00] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Ver ficha</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DGT NAP citation footer */}
          <footer className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between flex-wrap gap-2">
            <span>Fuente oficial: DGT Punto de Acceso Nacional (publicado {radars[0]?.fechaPublicacion || "2025-12-18"})</span>
            <Link href="/radares" className="text-[#ff6b00] hover:underline">
              &larr; Volver a todas las provincias
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
