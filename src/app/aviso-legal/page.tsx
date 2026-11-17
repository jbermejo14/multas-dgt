import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getTitular, valorOPendiente, FECHA_TEXTOS_LEGALES, type Titular } from '@/lib/legal';
import { absoluteUrl, SITE_NAME } from '@/lib/site';

const RUTA = '/aviso-legal';

export const metadata: Metadata = {
  title: 'Aviso legal',
  description: `Aviso legal e información del titular de ${SITE_NAME} conforme al artículo 10 de la LSSI.`,
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl(RUTA) }
};

export default function AvisoLegalPage() {
  const titular = getTitular();
  const dato = (campo: keyof Titular) => valorOPendiente(titular, campo);

  return (
    <main className="main-wrapper">
      <Breadcrumbs
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Aviso legal', url: RUTA }
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Aviso legal</h1>
      <div className="card legal-text">
        <h2>Datos del titular</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI), se informa de que el titular de este sitio web es:
        </p>
        <ul>
          <li>Titular: {dato('nombre')}</li>
          <li>NIF: {dato('nif')}</li>
          <li>Domicilio: {dato('domicilio')}</li>
          <li>Correo electrónico de contacto: {dato('email')}</li>
          {titular.tipo === 'empresa' && <li>Datos del Registro Mercantil: {dato('registroMercantil')}</li>}
        </ul>

        <h2>Objeto del sitio</h2>
        <p>
          {SITE_NAME} ofrece información orientativa sobre multas de tráfico, puntos del permiso de conducir y ubicación de radares en España, con una calculadora de sanciones por exceso de velocidad.
        </p>

        <h2>Carácter no oficial y orientativo</h2>
        <p>
          Este sitio es independiente. No es una web oficial de la Dirección General de Tráfico (DGT), de la Guardia Civil, del Ministerio del Interior ni de ninguna otra administración pública. El resultado de la calculadora es orientativo y no sustituye a la notificación de la sanción, que es el único documento con valor oficial.
        </p>

        <h2>Limitación de responsabilidad</h2>
        <p>
          El titular procura que los datos y cálculos sean correctos y estén actualizados, pero no garantiza su exactitud ni su vigencia. No se responsabiliza de las decisiones tomadas ni de los perjuicios derivados del uso de los cálculos. Antes de pagar o recurrir una sanción, contrasta el resultado con la notificación recibida, con la administración competente o con un abogado.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los textos, el diseño, el código, el logotipo y demás contenidos del sitio son propiedad del titular o se usan con autorización, y están protegidos por la normativa de propiedad intelectual. No se permite su reproducción, distribución o transformación sin permiso expreso, salvo para uso personal y citando la fuente.
        </p>

        <h2>Enlaces a terceros</h2>
        <p>
          El sitio puede enlazar a páginas de terceros, como el BOE o la sede electrónica de la DGT. El titular no controla esos sitios ni responde de su contenido o de sus políticas.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          Este aviso se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a la normativa aplicable.
        </p>

        <p className="text-xs text-muted">Última revisión: {FECHA_TEXTOS_LEGALES}</p>
      </div>
    </main>
  );
}
