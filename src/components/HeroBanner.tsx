"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, ShieldCheck, ShoppingCart, Award } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function HeroBanner() {
  const setOrderMode = useCartStore((state) => state.setOrderMode);
  const orderMode = useCartStore((state) => state.orderMode);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const safeOrderMode = mounted ? orderMode : "DELIVERY";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-white pt-6 pb-10 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card */}
        <div className="relative rounded-2xl bg-[#1B4DA1] text-white overflow-hidden shadow-xl border border-blue-900/30">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1A1A1A] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                <span>Supermercado Latino en Virginia • Sabor Tradicional</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                Frescura, Calidad y Tradición <br />
                <span className="text-[#F5C518]">Directo a tu Puerta</span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-blue-100/90 max-w-xl leading-relaxed">
                Pan dulce recién horneado, carnes selectas del día, frutas frescas y los productos de tu tierra. Haz tu pedido en minutos para <strong>Delivery express</strong> o <strong>Pickup sin filas</strong> en Alexandria.
              </p>

              {/* Delivery / Pickup Toggle Selector on Hero */}
              <div className="inline-flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                <button
                  onClick={() => setOrderMode("DELIVERY")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    safeOrderMode === "DELIVERY"
                      ? "bg-[#E31E24] text-white shadow-md"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  🚀 Delivery a Domicilio (35 min)
                </button>
                <button
                  onClick={() => setOrderMode("PICKUP")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    safeOrderMode === "PICKUP"
                      ? "bg-[#F5C518] text-[#1A1A1A] shadow-md"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  🏬 Recoger en Tienda (Gratis)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#CC181E] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explorar Catálogo Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/catalog?cat=panaderia"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <span>🥖 Pan Dulce del Día</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F5C518] shrink-0" />
                  <span>Entrega en 30-45m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#F5C518] shrink-0" />
                  <span>Garantía de Frescura</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F5C518] shrink-0" />
                  <span>Pago Seguro Stripe</span>
                </div>
              </div>
            </div>

            {/* Right Featured Promo Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[4/3] bg-gray-900">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Megamart Pasillos de Supermercado y Frescura"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Floating promo badge on image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-gray-900 shadow-lg border border-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-lg bg-[#E31E24] text-white flex items-center justify-center font-black text-xs">
                        20%<br />OFF
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-gray-900 leading-tight">
                          Especial de Panadería & Carnicería
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Horneado fresco y cortes diarios de calidad
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/catalog?cat=panaderia"
                      className="text-xs font-bold text-[#E31E24] hover:underline"
                    >
                      Ver →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
