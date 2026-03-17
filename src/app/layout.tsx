import type { Metadata } from "next";
import { Inter, Montserrat } from 'next/font/google'
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['400', '700', '900']
})

export const metadata: Metadata = {
  metadataBase: new URL("https://globaltelecomunicaciones.mx"),
  title: "Global Telecomunicaciones Digitales | Soluciones en Telecomunicaciones y Seguridad",
  description: "Líderes en infraestructura de seguridad de alta integridad. Especialistas en CCTV, Control de Acceso y Redes con ingeniería de detalle.",
  keywords: ["Global Telecomunicaciones Digitales", "Security", "Seguridad Electrónica", "CCTV Premium", "Control de Acceso", "Ingeniería de Detalle", "Infraestructura Crítica"],
  authors: [{ name: "Global Telecomunicaciones Digitales Team" }],
  openGraph: {
    title: "Global Telecomunicaciones Digitales | Protección de Alto Nivel",
    description: "Infraestructura de seguridad robusta y personalizada con inteligencia integral.",
    url: "https://globaltelecomunicaciones.mx/",
    siteName: "Global Telecomunicaciones Digitales",
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
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Global Telecomunicaciones Digitales",
              "image": "https://globaltelecomunicaciones.mx/logo-global.png",
              "@id": "https://globaltelecomunicaciones.mx/",
              "url": "https://globaltelecomunicaciones.mx/",
              "telephone": "+520000000000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ingeniería de Detalle",
                "addressLocality": "Ciudad de México",
                "addressRegion": "CDMX",
                "postalCode": "00000",
                "addressCountry": "MX"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.4326,
                "longitude": -99.1332
              },
              "servesCuisine": "",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.linkedin.com/company/global-telecomunicaciones-digitales"
              ],
              "description": "Expertos en Instalación de CCTV, Control de Acceso e Ingeniería de Seguridad Electrónica en México.",
              "areaServed": "México",
              "provider": {
                "@type": "Organization",
                "name": "Global Telecomunicaciones Digitales"
              }
            })
          }}
        />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
