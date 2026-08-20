import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import HeroBanner from "@/components/HeroBanner";
import CategorySlider from "@/components/CategorySlider";
import ProductCard from "@/components/ProductCard";
import StoreMap from "@/components/StoreMap";
import { Sparkles, ArrowRight, Flame, Heart, Truck, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export const revalidate = 0; // Dynamic for preview

export default async function HomePage() {
  // Fetch categories with product counts
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: { category: true },
    take: 8,
  });

  // Fetch bakery products specifically for the artisanal tradition highlight
  const bakeryProducts = await prisma.product.findMany({
    where: {
      category: { slug: "panaderia" },
      isAvailable: true,
    },
    include: { category: true },
    take: 4,
  });

  // Fetch fresh butchery products
  const meatProducts = await prisma.product.findMany({
    where: {
      category: { slug: "carnes" },
      isAvailable: true,
    },
    include: { category: true },
    take: 4,
  });

  // Fetch store details
  const store = await prisma.store.findFirst({
    where: { isActive: true },
  });

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Categories Slider */}
      <CategorySlider categories={categories} />

      {/* 3. Featured & Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-[#E31E24]" />
              <span>Ofertas y Favoritos de la Semana</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Los Más Pedidos en Virginia
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Precios bajos garantizados y calidad insuperable en tu mesa diaria
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E31E24] hover:text-[#CC181E] hover:underline"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Artisanal Bakery Spotlight ("Hecho con Tradición") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 bg-[radial-gradient(#F5C518_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4">
              <span className="bg-[#F5C518] text-[#1A1A1A] font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                🥖 Panadería Artesanal
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                El Auténtico Sabor del Pan Dulce y Tortillas Calientes
              </h2>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                Horneamos diariamente con recetas auténticas de México y Centroamérica. Conchas esponjosas, bolillos crujientes y tortillas de maíz nixtamalizado hechas hoy.
              </p>

              <div className="pt-2">
                <Link
                  href="/catalog?cat=panaderia"
                  className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-[#E5A800] text-[#1A1A1A] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-105"
                >
                  <span>Explorar Panadería</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bakery Mini Product Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {bakeryProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white rounded-xl text-gray-900 overflow-hidden shadow-md">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Fresh Carnicería Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-[#E31E24]" />
              <span>Cortes Selectos de Calidad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Carnicería & Aves Frescas
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Cortes limpios y marinados preparados por nuestros carniceros expertos
            </p>
          </div>

          <Link
            href="/catalog?cat=carnes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E31E24] hover:underline"
          >
            <span>Ver toda la carnicería</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {meatProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Why Choose MEGAMART Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1B4DA1]/5 border border-[#1B4DA1]/15 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              ¿Por qué las familias eligen MEGAMART?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Un supermercado diseñado para que ahorres tiempo sin renunciar a la calidad y tradición de siempre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center font-bold shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Delivery con Repartidores Propios</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Tu pedido no pasa por terceros desconocidos. Nuestro propio equipo cuida cada bolsa hasta tu puerta.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5C518]/15 text-[#1A1A1A] flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Selección Rigurosa de Frescura</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Revisamos cada fruta y verdura a mano para que recibas siempre lo mejor de la temporada.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3A9E3A]/10 text-[#3A9E3A] flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Precios Transparentes</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Los mismos precios accesibles de la tienda física, sin sobrecargos ocultos ni sorpresas en el total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Store Map */}
      <StoreMap
        storeName={store?.name || "MEGAMART - Sucursal Principal Alexandria"}
        storeAddress={store?.address || "7850 Richmond Hwy, Alexandria, VA 22306"}
        storeLat={store?.latitude || 38.7425}
        storeLng={store?.longitude || -77.1032}
        storePhone={store?.phone || "+1 (703) 555-0199"}
      />
    </div>
  );
}
