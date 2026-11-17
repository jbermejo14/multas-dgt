import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { HomePageView } from "@/components/HomePageView";

export const metadata: Metadata = {
  title: {
    absolute: "Calculadora de multas de tráfico, puntos y radares DGT | Ododex",
  },
  description:
    "Calculadora de multas de tráfico por exceso de velocidad con regla del 3-5% (Orden ICT/155/2020), baremo de pérdida de puntos de la Ley de Seguridad Vial y mapa de radares.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Page() {
  return <HomePageView />;
}
