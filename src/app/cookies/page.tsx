import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FECHA_TEXTOS_LEGALES } from '@/lib/legal';
import { absoluteUrl, SITE_NAME } from '@/lib/site';

const RUTA = '/cookies';
const URL_COOKIES_GOOGLE = 'https://policies.google.com/technologies/cookies?hl=es';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: `Qué cookies y almacenamiento local usa ${SITE_NAME} y cómo gestionarlos.`,
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl(RUTA) }
};

export default function CookiesPage() {
  return (
    <main className="main-wrapper">
      <Breadcrumbs
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Cookies', url: RUTA }
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Política de cookies</h1>
      <div className="card legal-text">
        <h2>Qué son las cookies</h2>
        <p>
          Las cookies y tecnologías similares (como el almacenamiento local del navegador) guardan pequeños datos en tu dispositivo. Se regulan en el artículo 22.2 de la LSSI y en la Guía sobre el uso de las cookies de la AEPD.
        </p>

        <h2>Qué usa esta web</h2>
        <div className="table-responsive mb-4">
          <table className="guide-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Finalidad</th>
                <th>Tipo</th>
                <th>Caducidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>ododex-theme</code> (localStorage)</td>
                <td>Recordar el tema claro u oscuro que eliges.</td>
                <td>Técnica, exenta de consentimiento</td>
                <td>Sin caducidad</td>
              </tr>
              <tr>
                <td>Cookies de Google AdSense</td>
                <td>Publicidad y medición. Solo se instalan si aceptas en el mensaje de consentimiento.</td>
                <td>Publicitaria y de medición, de tercero</td>
                <td>Según Google</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Los mapas de radares piden las imágenes del mapa a tile.openstreetmap.org. Esas peticiones no instalan cookies; los datos que recibe ese tercero se explican en la política de privacidad.
        </p>
        <p>
          Más información sobre las cookies de Google en <a href={URL_COOKIES_GOOGLE} target="_blank" rel="noopener noreferrer">policies.google.com</a>.
        </p>

        <h2>Cambiar o retirar el consentimiento</h2>
        <p>
          Puedes cambiar tu elección en cualquier momento con el botón «Configurar cookies» del pie de página. El botón solo aparece cuando la publicidad está activa.
        </p>

        <h2>Borrar cookies desde el navegador</h2>
        <p>
          Puedes bloquear o eliminar las cookies y el almacenamiento local desde los ajustes de privacidad de tu navegador. Si borras <code>ododex-theme</code>, la web volverá al tema de tu sistema.
        </p>

        <p className="text-xs text-muted">Última revisión: {FECHA_TEXTOS_LEGALES}</p>
      </div>
    </main>
  );
}
