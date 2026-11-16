import React from "react";
import Link from "next/link";
import { ShieldCheck, Scale, ExternalLink, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#0B0B0B] text-neutral-600 dark:text-neutral-400 text-sm transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ff6b00] text-white flex items-center justify-center font-bold">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                Radar<span className="text-[#ff6b00]">Puntos</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Plataforma digital especializada en cálculo de sanciones de tráfico, baremos de pérdida de puntos y localización de cinemómetros en carreteras españolas.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Conforme a Ley de Seguridad Vial</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-neutral-200 mb-3">
              Módulos y Herramientas
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#calculadora" className="hover:text-[#ff6b00] transition-colors">
                  Calculadora de exceso de velocidad
                </a>
              </li>
              <li>
                <a href="#infracciones" className="hover:text-[#ff6b00] transition-colors">
                  Catálogo de 28 infracciones DGT
                </a>
              </li>
              <li>
                <a href="#radares" className="hover:text-[#ff6b00] transition-colors">
                  Mapa interactivo de radares en España
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#ff6b00] transition-colors">
                  Regla del margen del 3-5%
                </a>
              </li>
            </ul>
          </div>

          {/* Sanciones Frecuentes */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-neutral-200 mb-3">
              Sanciones Populares
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/multas/utilizar-movil-conduciendo-mano" className="hover:text-[#ff6b00] transition-colors">
                  Multa por usar el móvil al volante (6 puntos)
                </Link>
              </li>
              <li>
                <Link href="/multas/tasa-alcohol-positiva-general" className="hover:text-[#ff6b00] transition-colors">
                  Tasa de alcoholemia y delito penal
                </Link>
              </li>
              <li>
                <Link href="/multas/circular-con-itv-caducada" className="hover:text-[#ff6b00] transition-colors">
                  Sanción por ITV caducada o desfavorable
                </Link>
              </li>
              <li>
                <Link href="/multas/entrar-en-zona-bajas-emisiones-zbe" className="hover:text-[#ff6b00] transition-colors">
                  Acceso a Zonas de Bajas Emisiones (ZBE)
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces Oficiales */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-neutral-200 mb-3">
              Organismos Oficiales
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://sede.dgt.gob.es/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#ff6b00] transition-colors"
                >
                  Sede Electrónica DGT <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.dgt.es/nuestros-servicios/multas-y-sanciones/pago-de-multas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#ff6b00] transition-colors"
                >
                  Pago telemático de multas <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#ff6b00] transition-colors"
                >
                  Ley de Tráfico y Seguridad Vial (BOE) <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] mb-8">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-[#ff6b00] shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              <strong className="text-neutral-800 dark:text-neutral-200">Aviso Legal y Metodológico:</strong> RadarPuntos es una aplicación web de consulta orientativa para conductores y no mantiene vinculación orgánica ni institucional con la Dirección General de Tráfico (DGT), Guardia Civil de Tráfico ni el Ministerio del Interior. Los cálculos se efectúan rigurosamente en base al Anexo IV del Texto Refundido de la Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial (RDL 6/2015) y a la Orden ICT/155/2020 de control metrológico de cinemómetros.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-6 gap-2">
          <p>© 2026 RadarPuntos.es - Todos los derechos reservados.</p>
          <p>Optimizado para SEO técnico y normativa de circulación vigente en España.</p>
        </div>
      </div>
    </footer>
  );
}
