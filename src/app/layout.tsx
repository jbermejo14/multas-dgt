import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/siteConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RadarPuntos | Consultor de Multas, Puntos y Mapa de Radares en España",
    template: "%s | RadarPuntos",
  },
  description:
    "Herramienta informativa ciudadana con calculadora de multas de tráfico por velocidad (Orden ICT/155/2020), baremo de puntos de la Ley de Seguridad Vial, catálogo de infracciones y mapa de radares.",
  keywords: [
    "multas trafico España",
    "calculadora multas velocidad",
    "puntos carnet conducir",
    "mapa radares España",
    "margen error radar 3 5",
    "pronto pago 50%",
    "delito exceso de velocidad art 379",
    "multas DGT 2026",
  ],
  authors: [{ name: "RadarPuntos" }],
  creator: "RadarPuntos",
  publisher: "RadarPuntos",
  openGraph: {
    title: "RadarPuntos | Consultor de Multas, Puntos y Mapa de Radares",
    description:
      "Calcula el importe de multas por velocidad con márgenes metrológicos, consulta la pérdida de puntos y ubica cinemómetros en España.",
    url: siteUrl,
    siteName: "RadarPuntos",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadarPuntos | Consultor de Multas y Mapa de Radares",
    description:
      "Herramienta ciudadana gratuita para calcular sanciones de tráfico, puntos retirados y red de cinemómetros.",
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
