import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="main-wrapper">
      <div className="card text-center max-w-2xl mx-auto py-16">
        <div className="text-6xl font-extrabold text-accent font-mono mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Página no encontrada</h1>
        <p className="text-muted mb-8 text-sm">
          La infracción, provincia, carretera o radar solicitado no existe o ha cambiado de dirección.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-secondary">
            ← Volver a la calculadora
          </Link>
          <Link href="/radares" className="btn btn-secondary">
            Ver radares por provincia
          </Link>
        </div>
      </div>
    </main>
  );
}
