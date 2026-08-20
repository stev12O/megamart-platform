"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Truck, Store, ArrowRight } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

export default function Footer() {
  const openStoreMap = useUIStore((state) => state.openStoreMap);

  return (
    <footer className="bg-[#1A1A1A] text-gray-300 pt-14 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-xl bg-[#E31E24]/20 text-[#E31E24] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Delivery Rápido en Virginia</h4>
              <p className="text-xs text-gray-400 mt-1">
                Llevamos tus compras con nuestro propio equipo de repartidores en menos de 45 min.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-xl bg-[#F5C518]/20 text-[#F5C518] flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Pickup en Tienda Gratis</h4>
              <p className="text-xs text-gray-400 mt-1">
                Haz tu pedido en línea y recógelo listo y empaquetado en nuestra sucursal sin filas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-xl bg-[#3A9E3A]/20 text-[#3A9E3A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Frescura & Calidad 100%</h4>
              <p className="text-xs text-gray-400 mt-1">
                Seleccionamos cada fruta, corte de carne y pan dulce con el estándar de la casa.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative w-44 h-16 bg-white/10 rounded-xl p-2 flex items-center justify-center backdrop-blur-xs">
              <Image
                src="/images/logo-megamart.png"
                alt="MEGAMART"
                fill
                className="object-contain p-1"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Supermercado latino con tradición, calidad y el mejor sabor para las familias de Virginia.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#F5C518] font-semibold bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/20">
                ⭐ Hecho con tradición
              </span>
            </div>
          </div>

          {/* Categorías Principales */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Categorías</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/catalog?cat=panaderia" className="hover:text-white transition-colors">Panadería & Tortillas</Link></li>
              <li><Link href="/catalog?cat=carnes" className="hover:text-white transition-colors">Carnicería Fresca</Link></li>
              <li><Link href="/catalog?cat=frutas-verduras" className="hover:text-white transition-colors">Frutas & Verduras</Link></li>
              <li><Link href="/catalog?cat=lacteos" className="hover:text-white transition-colors">Lácteos & Quesos</Link></li>
              <li><Link href="/catalog?cat=despensa" className="hover:text-white transition-colors">Abarrotes & Despensa</Link></li>
              <li><Link href="/catalog?cat=bebidas" className="hover:text-white transition-colors">Bebidas Tradicionales</Link></li>
            </ul>
          </div>

          {/* Enlaces de Servicio */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Servicio al Cliente</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Ver Todo el Catálogo</Link></li>
              <li>
                <button
                  onClick={openStoreMap}
                  className="hover:text-white text-left transition-colors text-xs text-gray-400"
                >
                  Ubicación y Horarios (Mapa)
                </button>
              </li>
              <li><Link href="/admin" className="hover:text-white transition-colors text-amber-400 font-medium">Acceso Administrativo</Link></li>
              <li><span className="text-gray-500">Zonas de Entrega: Alexandria, Arlington, Springfield</span></li>
              <li><span className="text-gray-500">Políticas de Devolución y Frescura</span></li>
            </ul>
          </div>

          {/* Contact & Store Info */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Sucursal Principal</h5>
            <div className="space-y-3 text-xs text-gray-400">
              <button
                onClick={openStoreMap}
                className="flex items-start gap-2.5 text-left hover:text-white transition-colors group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#E31E24] group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <span className="underline-offset-2 group-hover:underline">7850 Richmond Hwy, Alexandria, VA 22306</span>
              </button>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#3A9E3A] shrink-0" />
                <a href="tel:+17035550199" className="hover:text-white font-semibold text-gray-200">
                  +1 (703) 555-0199
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F5C518] shrink-0" />
                <span>Lunes a Domingo: 8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1B4DA1] shrink-0" />
                <span>pedidos@megamartva.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>© 2026 MEGAMART Supermarkets LLC. Todos los derechos reservados.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-[11px] bg-white/[0.05] px-2.5 py-1 rounded">💳 Tarjeta & Apple Pay con Stripe</span>
            <span className="text-[11px] bg-white/[0.05] px-2.5 py-1 rounded">🛡️ Compra 100% Segura</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
