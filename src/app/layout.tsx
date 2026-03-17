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
  title: "Global++ | Ecosistema de Seguridad Inteligente",
  description: "Global++ unifica tu seguridad. Videovigilancia, CRM y logística técnica en un solo ecosistema inteligente de alta integridad.",
  keywords: ["Global++", "Security", "Seguridad Electrónica", "CCTV Premium", "Logística Técnica", "Ecosistema Inteligente"],
  authors: [{ name: "Global++ Engineering Team" }],
  openGraph: {
    title: "Global++ | Ecosistema de Protección Inteligente",
    description: "La plataforma definitiva que unifica videovigilancia, CRM y logística técnica.",
    url: "https://globaltelecomunicaciones.mx/",
    siteName: "Global++",
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
              "name": "Global++",
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
              "description": "Global++: Ecosistema inteligente que unifica videovigilancia, CRM y logística técnica en México.",
              "areaServed": "México",
              "provider": {
                "@type": "Organization",
                "name": "Global++"
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
