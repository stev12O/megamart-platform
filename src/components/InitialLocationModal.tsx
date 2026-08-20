"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  X,
  MapPin,
  Truck,
  Store,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const StoreMapInner = dynamic(() => import("./StoreMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[220px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 animate-pulse">
      <MapPin className="w-8 h-8 text-gray-300" />
      <span className="text-xs">Cargando mapa de la sucursal...</span>
    </div>
  ),
});

export default function InitialLocationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const setOrderMode = useCartStore((state) => state.setOrderMode);
  const orderMode = useCartStore((state) => state.orderMode);

  const [selectedMode, setSelectedMode] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [userLocating, setUserLocating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);

  const storeLat = 38.7425;
  const storeLng = -77.1032;
  const storeName = "MEGAMART - Sucursal Principal Alexandria";
  const storeAddress = "7850 Richmond Hwy, Alexandria, VA 22306";

  useEffect(() => {
    // Check if user has already made an initial selection
    const hasSeenModal = localStorage.getItem("megamart_seen_welcome_modal");
    if (!hasSeenModal) {
      // Small timeout for smooth entry animation
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = (mode: "DELIVERY" | "PICKUP") => {
    setOrderMode(mode);
    localStorage.setItem("megamart_seen_welcome_modal", "true");
    setIsOpen(false);
  };

  const handleLocateMe = () => {
    setUserLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocating(false);
          const lat1 = position.coords.latitude;
          const lon1 = position.coords.longitude;
          const lat2 = storeLat;
          const lon2 = storeLng;

          const R = 3958.8; // Miles
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const d = R * c;

          setDistanceInfo(`Estás a ~${d.toFixed(1)} millas de nuestra tienda en Alexandria.`);
        },
        () => {
          setUserLocating(false);
          setDistanceInfo("Hacemos delivery en toda el área de Alexandria y el norte de Virginia.");
        }
      );
    } else {
      setUserLocating(false);
      setDistanceInfo("Geolocalización no soportada.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => handleConfirm("DELIVERY")}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition-colors"
          title="Cerrar y empezar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-[#1B4DA1] to-[#153E85] text-white p-6 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center space-y-2">
            {/* Torito Avatar Badge */}
            <div className="relative w-16 h-16 rounded-full bg-white p-1 border-2 border-[#F5C518] shadow-lg mb-1">
              <Image
                src="/images/torito-pin.png"
                alt="MEGAMART Torito"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>

            <span className="bg-[#F5C518] text-[#1A1A1A] font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
              ¡Bienvenido a MEGAMART!
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ¿Cómo deseas tus compras hoy?
            </h3>

            <p className="text-xs text-blue-100 max-w-md mx-auto">
              Selecciona tu método preferido para mostrarte el inventario fresco y los tiempos exactos de entrega.
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Delivery Option */}
            <button
              type="button"
              onClick={() => setSelectedMode("DELIVERY")}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMode === "DELIVERY"
                  ? "border-[#E31E24] bg-[#FEF2F2]/70 ring-2 ring-[#E31E24]/20 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  $3.99 / Gratis {">"} $35
                </span>
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Delivery a Domicilio</h4>
              <p className="text-xs text-gray-500 mt-1">
                Llevamos tus productos en menos de <strong>35-45 minutos</strong> con nuestro propio equipo.
              </p>
            </button>

            {/* Pickup Option */}
            <button
              type="button"
              onClick={() => setSelectedMode("PICKUP")}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMode === "PICKUP"
                  ? "border-[#F5C518] bg-[#FEFCE8] ring-2 ring-[#F5C518]/30 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F5C518]/20 text-[#D4A017] flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  GRATIS
                </span>
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Recoger en Tienda</h4>
              <p className="text-xs text-gray-500 mt-1">
                Pasa por nuestra sucursal de Alexandria. Empacamos todo listo para ti en <strong>20 minutos</strong>.
              </p>
            </button>
          </div>

          {/* Store Location Mini Map Preview with Torito Pin */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
            <div className="p-3.5 bg-white border-b border-gray-100 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E31E24] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">{storeName}</span>
                  <span className="text-gray-500 text-[11px]">{storeAddress}</span>
                </div>
              </div>
              <span className="text-[#3A9E3A] font-bold text-[11px] shrink-0">● Abierto hoy</span>
            </div>

            <div className="h-44 w-full relative">
              <StoreMapInner
                storeLat={storeLat}
                storeLng={storeLng}
                storeName={storeName}
                storeAddress={storeAddress}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => handleConfirm(selectedMode)}
            className="w-full bg-[#E31E24] hover:bg-[#CC181E] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm"
          >
            <span>
              {selectedMode === "DELIVERY"
                ? "Empezar a Comprar con Delivery"
                : "Empezar a Comprar con Pickup"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
