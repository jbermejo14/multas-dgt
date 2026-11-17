import { Metadata } from "next";
import Link from "next/link";
import { getAllProvinces, getAllRadars } from "@/lib/radarsData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Navigation, ChevronRight, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Radares DGT en España por Provincias y Carreteras",
  description:
    "Consulta la ubicación de los 737 radares fijos y de tramo de la DGT en España. Filtrados por provincia, carretera y punto kilométrico con coordenadas del Punto de Acceso Nacional de la DGT.",
  alternates: {
    canonical: absoluteUrl("/radares"),
  },
  openGraph: {
    title: `Radares DGT en España por Provincias y Carreteras | ${SITE_NAME}`,
    description:
      "Ubicación de cinemómetros fijos y de tramo de la Dirección General de Tráfico (DGT). Datos procedentes del Punto de Acceso Nacional (NAP).",
    url: absoluteUrl("/radares"),
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
    <main className="main-wrapper space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="card space-y-4">
        <div className="tag inline-flex items-center gap-2 whitespace-normal text-accent">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
          Datos de la DGT &bull; Punto de Acceso Nacional
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          Radares DGT en España: provincias y carreteras
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Catálogo de cinemómetros fijos y de tramo gestionados por la Dirección General de Tráfico
          en las vías de su competencia (excluidas vías autonómicas transferidas en Cataluña y País Vasco).
          Localiza cada radar por provincia, vía y punto kilométrico exacto.
        </p>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-4">
          <div className="rounded-xl border border-line bg-elevated p-3">
            <span className="block text-[11px] font-bold uppercase text-muted">Total radares</span>
            <span className="font-mono text-2xl font-bold">{allRadars.length}</span>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-3">
            <span className="block text-[11px] font-bold uppercase text-muted">Provincias</span>
            <span className="font-mono text-2xl font-bold">{provinces.length}</span>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-3">
            <span className="block text-[11px] font-bold uppercase text-muted">Radares fijos</span>
            <span className="font-mono text-2xl font-bold text-accent">{fijoCount}</span>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-3">
            <span className="block text-[11px] font-bold uppercase text-muted">Radares de tramo</span>
            <span className="font-mono text-2xl font-bold text-accent">{tramoCount}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-line bg-elevated p-3.5 text-xs text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p>
            <strong className="text-fg">Transparencia de datos:</strong> Las ubicaciones y coordenadas proceden del canal DATEX II del
            Punto de Acceso Nacional de la DGT (publicación 18/12/2025). El catálogo de la DGT no incluye
            los límites de velocidad específicos por cinemómetro en su feed; señalamos la velocidad genérica del
            tipo de vía y recomendamos atender siempre a la señalización vertical en el tramo.
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold">Selecciona una provincia</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {provinces.map((prov) => (
            <Link key={prov.slug} href={`/radares/${prov.slug}`} className="link-card">
              <span>
                <span className="link-card-name">{prov.name}</span>
                <span className="link-card-hint">
                  {prov.totalRadars} radares &bull; {prov.roadsCount} vías
                </span>
              </span>
              <ChevronRight className="link-card-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
