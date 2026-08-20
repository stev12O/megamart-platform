"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, ShieldCheck, MapPin } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

export default function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCart = useUIStore((state) => state.openCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const safeItemCount = mounted ? itemCount : 0;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 shadow-lg">
      <div className="grid grid-cols-4 items-center justify-around text-center">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/") ? "text-[#E31E24] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </Link>

        {/* Catalog */}
        <Link
          href="/catalog"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/catalog") ? "text-[#E31E24] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catálogo</span>
        </Link>

        {/* Cart Trigger */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 text-gray-700 hover:text-[#E31E24] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {safeItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E31E24] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {safeItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium">Carrito</span>
        </button>

        {/* Admin */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/admin") ? "text-[#E31E24] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Admin</span>
        </Link>
      </div>
    </div>
  );
}
