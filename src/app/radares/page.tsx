import { Metadata } from "next";
import Link from "next/link";
import { getAllProvinces, getAllRadars } from "@/lib/radarsData";
import { getCanonicalUrl } from "@/lib/siteConfig";
import { JsonLd } from "@/components/JsonLd";
import { Navigation, MapPin, ShieldAlert, ExternalLink, ChevronRight, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Radares DGT en España por Provincias y Carreteras",
  description:
    "Consulta la ubicación de los 737 radares fijos y de tramo de la DGT en España. Filtrados por provincia, carretera y punto kilométrico con coordenadas del Punto de Acceso Nacional de la DGT.",
  alternates: {
    canonical: getCanonicalUrl("/radares"),
  },
  openGraph: {
    title: "Radares DGT en España por Provincias y Carreteras | RadarPuntos",
    description:
      "Ubicación de cinemómetros fijos y de tramo de la Dirección General de Tráfico (DGT). Datos procedentes del Punto de Acceso Nacional (NAP).",
    url: getCanonicalUrl("/radares"),
    type: "website",
  },
};

export default function RadaresIndexPage() {
  const provinces = getAllProvinces();
  const allRadars = getAllRadars();
  const tramoCount = allRadars.filter((r) => r.tipo === "Tramo").length;
  const fijoCount = allRadars.filter((r) => r.tipo === "Fijo").length;

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Radares DGT", url: "/radares" },
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />

      <main className="min-h-screen bg-neutral-50 dark:bg-[#0D0D0D] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumb nav */}
          <nav aria-label="Migas de pan" className="text-xs text-neutral-500 dark:text-neutral-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#ff6b00] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-neutral-800 dark:text-neutral-200" aria-current="page">
                Radares en España
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20">
              <Navigation className="w-3.5 h-3.5" />
              Datos de la DGT &bull; Punto de Acceso Nacional
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Radares DGT en España: Provincias y Carreteras
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Catálogo de cinemómetros fijos y de tramo gestionados por la Dirección General de Tráfico
              en las vías de su competencia (excluidas vías autonómicas transferidas en Cataluña y País Vasco).
              Localiza cada radar por provincia, vía y punto kilométrico exacto.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Total Radares</span>
                <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">{allRadars.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">Provincias</span>
                <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">{provinces.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-[#ff6b00] block">Radares Fijos</span>
                <span className="text-2xl font-black font-mono text-[#ff6b00]">{fijoCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[11px] uppercase font-bold text-amber-500 block">Radares de Tramo</span>
                <span className="text-2xl font-black font-mono text-amber-500">{tramoCount}</span>
              </div>
            </div>

            {/* Honest Data Source Notice */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p>
                  <strong>Transparencia de datos:</strong> Las ubicaciones y coordenadas proceden del canal DATEX II del
                  Punto de Acceso Nacional de la DGT (publicación 18/12/2025). El catálogo de la DGT no incluye
                  los límites de velocidad específicos por cinemómetro en su feed; señalamos la velocidad genérica del
                  tipo de vía y recomendamos atender siempre a la señalización vertical en el tramo.
                </p>
              </div>
            </div>
          </header>

          {/* Grid of Provinces */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Selecciona una provincia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {provinces.map((prov) => (
                <Link
                  key={prov.slug}
                  href={`/radares/${prov.slug}`}
                  className="group p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-[#ff6b00]/60 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-[#ff6b00] transition-colors">
                      {prov.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {prov.totalRadars} radares &bull; {prov.roadsCount} vías
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#ff6b00] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
