import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Telecomunicaciones Digitales | CCTV, Control de Acceso y Redes",
  description: "Líderes en soluciones tecnológicas de seguridad en México. Instalación de CCTV, cercas electrificadas, control de acceso e infraestructura de red corporativa. Calidad garantizada y soporte técnico especializado.",
  keywords: ["CCTV", "Seguridad Electrónica", "Control de Acceso", "Redes", "Global Telecom", "Syscom Partner", "Videovigilancia México"],
  authors: [{ name: "Global Telecom Team" }],
  openGraph: {
    title: "Global Telecomunicaciones Digitales | Seguridad Avanzada",
    description: "Expertos en integración de sistemas de seguridad y telecomunicaciones.",
    url: "https://globaltelecomunicacionesdigitales.vercel.app/",
    siteName: "Global Telecom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
