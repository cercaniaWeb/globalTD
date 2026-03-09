import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Telecomunicaciones Digitales | CCTV & Seguridad",
  description: "Especialistas en videovigilancia, control de acceso e infraestructura de red. Partner oficial Syscom.",
};

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
