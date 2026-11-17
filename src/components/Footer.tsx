import React from 'react';
import Link from 'next/link';
import { getAllProvinces } from '@/lib/radarsData';
import { SITE_NAME } from '@/lib/site';
import { ConsentSettingsButton } from '@/components/ConsentSettingsButton';

const FREQUENT_INFRACTIONS = [
  { label: 'Usar el móvil al volante', slug: 'utilizar-movil-conduciendo-mano' },
  { label: 'Tasa de alcohol positiva', slug: 'tasa-alcohol-positiva-general' },
  { label: 'ITV caducada', slug: 'circular-con-itv-caducada' },
  { label: 'Zonas de bajas emisiones (ZBE)', slug: 'entrar-en-zona-bajas-emisiones-zbe' }
] as const;

const EXTERNAL_LINKS = [
  { label: 'Sede electrónica de la DGT', href: 'https://sede.dgt.gob.es/' },
  { label: 'Pago de multas (DGT)', href: 'https://www.dgt.es/nuestros-servicios/multas-y-sanciones/pago-de-multas/' },
  { label: 'Ley de Tráfico y Seguridad Vial (BOE)', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722' }
] as const;

const LINK_ROW_CLASS = 'flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted mt-2';
const LINK_CLASS = 'text-muted hover:text-accent transition-colors';

export interface FooterProps {
  /** Muestra el botón para cambiar el consentimiento; solo si AdSense está configurado. */
  mostrarConsentimiento?: boolean;
}

export function Footer({ mostrarConsentimiento = false }: FooterProps) {
  const provinces = getAllProvinces();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p className="footer-text">
          <strong>{SITE_NAME}</strong> &bull; Multas, puntos y radares de tráfico en España.
        </p>
        <p className="footer-subtext">
          Sitio independiente: no es una web oficial de la DGT, de la Guardia Civil ni del Ministerio del Interior. Los cálculos se basan en el Anexo IV del RDL 6/2015 y en la Orden ICT/155/2020, y los radares proceden del Punto de Acceso Nacional de la DGT. El resultado es orientativo y no sustituye a la notificación de la sanción.
        </p>
        <nav aria-label="Información legal" className="footer-legal">
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          {mostrarConsentimiento && <ConsentSettingsButton />}
        </nav>
        <div className={LINK_ROW_CLASS}>
          <span>Radares por provincia:</span>
          {provinces.map(province => (
            <Link key={province.slug} href={`/radares/${province.slug}`} className={LINK_CLASS}>
              {province.name}
            </Link>
          ))}
        </div>
        <div className={LINK_ROW_CLASS}>
          <span>Infracciones frecuentes:</span>
          {FREQUENT_INFRACTIONS.map(infraction => (
            <Link key={infraction.slug} href={`/multas/${infraction.slug}`} className={LINK_CLASS}>
              {infraction.label}
            </Link>
          ))}
        </div>
        <div className={LINK_ROW_CLASS}>
          <span>Fuentes oficiales:</span>
          {EXTERNAL_LINKS.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
