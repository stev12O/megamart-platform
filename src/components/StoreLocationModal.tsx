"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { X, MapPin, Clock, Phone, Navigation, ExternalLink, CheckCircle, Store } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";

const StoreMapInner = dynamic(() => import("./StoreMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 animate-pulse">
      <MapPin className="w-8 h-8 text-gray-300" />
      <span className="text-xs">Cargando mapa de la sucursal...</span>
    </div>
  ),
});

export default function StoreLocationModal() {
  const isStoreMapOpen = useUIStore((state) => state.isStoreMapOpen);
  const closeStoreMap = useUIStore((state) => state.closeStoreMap);
  const setOrderMode = useCartStore((state) => state.setOrderMode);

  const [userLocating, setUserLocating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);

  const storeLat = 38.7425;
  const storeLng = -77.1032;
  const storeName = "MEGAMART - Sucursal Principal Alexandria";
  const storeAddress = "7850 Richmond Hwy, Alexandria, VA 22306";
  const storePhone = "+1 (703) 555-0199";

  if (!isStoreMapOpen) return null;

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
          
          const R = 3958.8; // Radius in miles
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

          setDistanceInfo(`Estás a ~${d.toFixed(1)} millas de esta sucursal (Delivery estimado: ~35 min).`);
        },
        (error) => {
          setUserLocating(false);
          setDistanceInfo("No pudimos obtener tu ubicación exacta. Hacemos delivery a Alexandria y alrededores.");
        }
      );
    } else {
      setUserLocating(false);
      setDistanceInfo("Geolocalización no disponible.");
    }
  };

  const handleSelectPickup = () => {
    setOrderMode("PICKUP");
    closeStoreMap();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeStoreMap}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                Sucursales y Mapa de Tiendas
              </h3>
              <p className="text-[11px] text-gray-500">
                Selecciona tu tienda para Delivery rápido o Pickup en persona
              </p>
            </div>
          </div>

          <button
            onClick={closeStoreMap}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Info Side */}
          <div className="md:col-span-5 p-5 space-y-4 bg-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 text-xs">
            <div className="space-y-4">
              <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl space-y-2">
                <span className="bg-[#E31E24] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                  SUCURSAL ACTIVA
                </span>
                <h4 className="font-extrabold text-gray-900 text-sm leading-snug">
                  {storeName}
                </h4>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-[#E31E24] shrink-0 mt-0.5" />
                  <span>{storeAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-[#3A9E3A] shrink-0" />
                  <a href={`tel:${storePhone}`} className="text-[#1B4DA1] font-bold hover:underline">
                    {storePhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-[#F5C518] shrink-0" />
                  <span>Abierto hoy: 8:00 AM – 10:00 PM</span>
                </div>
              </div>

              {/* Locate Me */}
              <div>
                <button
                  onClick={handleLocateMe}
                  disabled={userLocating}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs"
                >
                  <Navigation className={`w-3.5 h-3.5 ${userLocating ? "animate-spin" : ""}`} />
                  <span>{userLocating ? "Calculando distancia..." : "Calcular tiempo desde mi ubicación"}</span>
                </button>

                {distanceInfo && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{distanceInfo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button
                onClick={handleSelectPickup}
                className="w-full bg-[#E31E24] hover:bg-[#CC181E] text-white font-extrabold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Elegir para Pickup (Gratis)</span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${storeLat},${storeLng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver ruta en Google Maps</span>
              </a>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="md:col-span-7 h-[300px] md:h-[400px] relative bg-gray-100">
            <StoreMapInner
              storeLat={storeLat}
              storeLng={storeLng}
              storeName={storeName}
              storeAddress={storeAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
