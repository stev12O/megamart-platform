"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, MapPin, Clock, ShieldCheck, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const openCart = useUIStore((state) => state.openCart);
  const openStoreMap = useUIStore((state) => state.openStoreMap);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  const [mounted, setMounted] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeItemCount = mounted ? itemCount : 0;
  const safeSubtotal = mounted ? subtotal : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (localSearch.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(localSearch.trim())}`);
    } else {
      router.push("/catalog");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      {/* Top Banner Announcement */}
      <div className="bg-[#1B4DA1] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-[#F5C518] text-[#1A1A1A] font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              OFERTA
            </span>
            <span className="truncate">
              ¡Envío GRATIS en órdenes mayores a $35! Usa el cupón <strong className="underline font-bold">MEGAMART10</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-blue-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Abierto hoy: 8:00 AM - 10:00 PM</span>
            </div>
            <button
              onClick={openStoreMap}
              className="flex items-center gap-1.5 hover:text-[#F5C518] transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F5C518]" />
              <span className="underline underline-offset-2">Alexandria, VA (Ver Mapa)</span>
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-[#F5C518] hover:text-white font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Tienda</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-36 h-11 sm:w-44 sm:h-12 md:w-48 md:h-12 max-w-[200px] max-h-[50px] transition-transform group-hover:scale-105">
              <Image
                src="/images/logo-megamart.png"
                alt="MEGAMART Supermercado"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Store Location Selector Pill (Clickable -> Opens Map Modal) */}
          <button
            onClick={openStoreMap}
            type="button"
            className="hidden lg:flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-left transition-all group cursor-pointer"
            title="Ver mapa y horarios de la tienda"
          >
            <div className="w-7 h-7 rounded-full bg-[#E31E24]/10 group-hover:bg-[#E31E24] group-hover:text-white flex items-center justify-center text-[#E31E24] transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight group-hover:text-[#E31E24] flex items-center gap-1">
                <span>Alexandria, Virginia</span>
                <span className="text-[10px] text-[#1B4DA1] font-semibold">📍 Ver Mapa</span>
              </div>
              <div className="text-gray-500 text-[10px]">7850 Richmond Hwy • Entrega 35 min</div>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative hidden sm:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar pan dulce, carnes, aguacates, lácteos..."
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 focus:border-[#E31E24] rounded-full text-sm outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31E24]/20"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 bg-[#E31E24] hover:bg-[#CC181E] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick Catalog Link */}
            <Link
              href="/catalog"
              className="hidden md:inline-flex items-center font-medium text-sm text-gray-700 hover:text-[#E31E24] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Catálogo
            </Link>

            {/* Admin Quick link (visible on mobile / tablet) */}
            <Link
              href="/admin"
              className="md:hidden inline-flex p-2 text-gray-600 hover:text-[#E31E24] hover:bg-gray-100 rounded-full transition-colors"
              title="Panel Administrador"
            >
              <ShieldCheck className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Cart Button with Count & Total */}
            <button
              onClick={openCart}
              className="flex items-center gap-2.5 bg-[#E31E24] hover:bg-[#CC181E] text-white px-3.5 sm:px-5 py-2.5 rounded-full font-semibold shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {safeItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F5C518] text-[#1A1A1A] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-badge-bounce">
                    {safeItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left text-xs leading-none">
                <span className="text-red-100 text-[10px] uppercase font-bold tracking-wider">Mi Carrito</span>
                <span className="font-extrabold text-sm">{formatPrice(safeSubtotal)}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar productos en MEGAMART..."
              className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs outline-none focus:border-[#E31E24]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#E31E24] text-white text-[11px] font-bold px-3 py-1 rounded-full"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
