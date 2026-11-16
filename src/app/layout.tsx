import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RadarPuntos | Consultor de Multas DGT, Puntos y Mapa de Radares en España",
  description:
    "Calculadora oficial de multas de tráfico con regla del 3-5% de margen metrológico, baremo de retirada de puntos, catálogo de 28 infracciones y mapa interactivo de radares en España.",
  keywords: [
    "multas DGT",
    "calculadora multas velocidad",
    "puntos carnet conducir",
    "mapa radares España",
    "margen error radar 3 5",
    "pronto pago 50%",
    "delito exceso de velocidad art 379",
    "multas de trafico 2026",
  ],
  authors: [{ name: "RadarPuntos" }],
  creator: "RadarPuntos",
  publisher: "RadarPuntos",
  metadataBase: new URL("https://radarpuntos.es"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RadarPuntos | Consultor Oficial de Multas DGT y Radares",
    description:
      "Calcula al instante el importe de tu multa por exceso de velocidad, pérdida de puntos de carnet y localiza cinemómetros en carreteras de España.",
    url: "https://radarpuntos.es",
    siteName: "RadarPuntos",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadarPuntos | Consultor de Multas DGT y Mapa de Radares",
    description:
      "Herramienta ciudadana gratuita para calcular sanciones de tráfico, puntos retirados y mapa de radares.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Anti-FOUC theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('radarpuntos_theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
