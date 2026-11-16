import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/siteConfig";
import { HomePageView } from "@/components/HomePageView";

export const metadata: Metadata = {
  title: {
    absolute: "RadarPuntos | Consultor de Multas de Tráfico, Puntos y Radares en España",
  },
  description:
    "Calculadora de multas de tráfico por exceso de velocidad con regla del 3-5% (Orden ICT/155/2020), baremo de pérdida de puntos de la Ley de Seguridad Vial y mapa de radares.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
};

export default function Page() {
  return <HomePageView />;
}
