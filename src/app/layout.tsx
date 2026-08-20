import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import StoreLocationModal from "@/components/StoreLocationModal";
import InitialLocationModal from "@/components/InitialLocationModal";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEGAMART — Supermercado & Delivery On-Demand",
  description: "Compra tus productos favoritos con la frescura y tradición de MEGAMART. Delivery rápido y Pickup en tienda en Alexandria, Virginia.",
  keywords: ["supermercado", "delivery", "pickup", "alexandria va", "productos latinos", "panaderia", "carniceria", "megamart"],
  authors: [{ name: "MEGAMART" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#FAF9F6] text-[#1A1A1A]">
        <Header />
        <main className="flex-1 pb-20 md:pb-12">{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
        <QuickViewModal />
        <StoreLocationModal />
        <InitialLocationModal />
      </body>
    </html>
  );
}
