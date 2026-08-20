"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Clock, Phone, ExternalLink, CheckCircle } from "lucide-react";

const StoreMapInner = dynamic(() => import("./StoreMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 animate-pulse">
      <MapPin className="w-8 h-8 text-gray-300" />
      <span className="text-xs">Cargando mapa de la tienda...</span>
    </div>
  ),
});

interface StoreMapProps {
  storeName?: string;
  storeAddress?: string;
  storeLat?: number;
  storeLng?: number;
  storePhone?: string;
}

export default function StoreMap({
  storeName = "MEGAMART - Sucursal Principal Alexandria",
  storeAddress = "7850 Richmond Hwy, Alexandria, VA 22306",
  storeLat = 38.7425,
  storeLng = -77.1032,
  storePhone = "+1 (703) 555-0199",
}: StoreMapProps) {
  const [userLocating, setUserLocating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);

  const handleLocateMe = () => {
    setUserLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocating(false);
          // Calculate approx distance in miles
          const lat1 = position.coords.latitude;
          const lon1 = position.coords.longitude;
          const lat2 = storeLat;
          const lon2 = storeLng;
          
          const R = 3958.8; // Radius of Earth in miles
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

          setDistanceInfo(`Estás a ~${d.toFixed(1)} millas de nuestra tienda (tiempo est. de entrega: ~30-40 min)`);
        },
        (error) => {
          setUserLocating(false);
          setDistanceInfo("No pudimos obtener tu ubicación exacta. Hacemos delivery a todo Alexandria y alrededores.");
        }
      );
    } else {
      setUserLocating(false);
      setDistanceInfo("Geolocalización no soportada en este navegador.");
    }
  };

  return (
    <section id="mapa" className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 sm:p-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Tu Supermercado Cercano</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Visítanos o Pide a Domicilio
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Ubicados estratégicamente en Virginia para garantizar entregas ultra rápidas y productos que llegan calientes de nuestra panadería y frescos de nuestra carnicería.
                </p>
              </div>

              {/* Store Details Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/70 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">{storeName}</span>
                    <span className="text-gray-600">{storeAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-200/50">
                  <div className="w-8 h-8 rounded-lg bg-[#3A9E3A]/10 text-[#3A9E3A] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Horario de Atención</span>
                    <span className="text-gray-600">Lunes a Domingo: 8:00 AM – 10:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-200/50">
                  <div className="w-8 h-8 rounded-lg bg-[#1B4DA1]/10 text-[#1B4DA1] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Teléfono de la Tienda</span>
                    <a href={`tel:${storePhone}`} className="text-[#1B4DA1] font-bold hover:underline">
                      {storePhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Geolocation Button */}
              <div>
                <button
                  onClick={handleLocateMe}
                  disabled={userLocating}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
                >
                  <Navigation className={`w-4 h-4 ${userLocating ? "animate-spin" : ""}`} />
                  <span>{userLocating ? "Calculando distancia..." : "Calcular tiempo de entrega a mi ubicación"}</span>
                </button>

                {distanceInfo && (
                  <div className="mt-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{distanceInfo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Map Canvas */}
            <div className="lg:col-span-7 h-[360px] sm:h-[420px] relative rounded-xl overflow-hidden border border-gray-200">
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
    </section>
  );
}
