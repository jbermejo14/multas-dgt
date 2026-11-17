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
import { MapPin, Navigation, ChevronRight, Gauge, ExternalLink, ArrowLeft } from "lucide-react";

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
    <>
      <main className="min-h-screen bg-neutral-50 dark:bg-[#0D0D0D] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <header className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20">
                <Navigation className="w-3.5 h-3.5" />
                Vía {roadName} &bull; {province.name}
              </div>
              <Link
                href={`/radares/${province.slug}`}
                className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#ff6b00] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ver todos los radares de {province.name}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
              Radares DGT en {roadName} ({province.name})
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Ubicación de los cinemómetros situados a lo largo de la {roadName} a su paso por
              la provincia de {province.name}. Puntos kilométricos, sentido de la marcha y coordenadas geográficas.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Total en esta vía</span>
                <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">{radars.length}</span>
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
              Mapa de radares en la {roadName}
            </h2>
            <DgtRadarsMap radars={radars} className="h-[400px] w-full rounded-2xl" />
          </section>

          {/* Radar details list */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Puntos kilométricos y cinemómetros en la {roadName}
            </h2>
            <div className="space-y-3">
              {radars.map((radar, index) => (
                <div
                  key={radar.id}
                  className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-lg text-neutral-900 dark:text-white">
                        PK {radar.pk}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          radar.tipo === "Tramo"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20"
                        }`}
                      >
                        Radar de {radar.tipo}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {radar.singularity}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Sentido: <strong className="text-neutral-800 dark:text-neutral-200">{radar.sentido}</strong> &bull; Coordenadas: {radar.lat.toFixed(5)}, {radar.lng.toFixed(5)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/radares/radar/${radar.id}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-colors inline-flex items-center gap-1 shadow-sm shadow-[#ff6b00]/20"
                    >
                      <span>Ficha del Radar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Speed Calculator callout */}
          <div className="p-6 rounded-2xl border border-[#ff6b00]/30 bg-gradient-to-r from-[#ff6b00]/10 via-[#ff6b00]/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                ¿Has sido captado por un radar en la {roadName}?
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl">
                Calcula al instante la sanción exacta aplicando el margen legal oficial de error (Orden ICT/155/2020),
                la posible pérdida de puntos y el descuento del 50% por pronto pago.
              </p>
            </div>
            <Link
              href="/#calculadora"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-colors shrink-0 inline-flex items-center gap-1.5 shadow-sm shadow-[#ff6b00]/25"
            >
              <Gauge className="w-4 h-4" />
              <span>Abrir Calculadora</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
