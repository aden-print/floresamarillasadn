import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Un Universo de Flores Amarillas 🌻 | 21 de Septiembre",
  description: "Una experiencia web mágica e interactiva dedicada al 21 de septiembre.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#030308] text-gray-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
