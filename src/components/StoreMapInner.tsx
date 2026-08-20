"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";

interface StoreMapInnerProps {
  storeLat: number;
  storeLng: number;
  storeName: string;
  storeAddress: string;
}

export default function StoreMapInner({
  storeLat,
  storeLng,
  storeName,
  storeAddress,
}: StoreMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([storeLat, storeLng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Torito Pin Marker HTML
      const toritoIconHtml = `
        <div style="position: relative; width: 56px; height: 68px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; cursor: pointer; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));">
          <!-- Animated pulse ring -->
          <div style="position: absolute; top: 2px; width: 50px; height: 50px; border-radius: 50%; background: rgba(227, 30, 36, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          
          <!-- Circular Cow Head Badge -->
          <div style="position: relative; width: 48px; height: 48px; border-radius: 50%; background: #FFFFFF; border: 3px solid #F5C518; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; overflow: hidden; z-index: 10;">
            <img src="/images/torito-pin.png" alt="MEGAMART Torito" style="width: 42px; height: 42px; object-fit: contain; transform: scale(1.15) translateY(-1px);" />
          </div>

          <!-- Bottom Pin Pointer Triangle -->
          <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 10px solid #F5C518; margin-top: -3px; z-index: 9;"></div>
          <div style="position: absolute; bottom: 8px; width: 6px; height: 6px; border-radius: 50%; background: #E31E24; z-index: 11;"></div>
        </div>
      `;

      const toritoDivIcon = L.divIcon({
        className: "custom-torito-marker",
        html: toritoIconHtml,
        iconSize: [56, 68],
        iconAnchor: [28, 62],
        popupAnchor: [0, -60],
      });

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <div style="width: 28px; height: 28px; border-radius: 6px; background: #FDF2F2; display: flex; align-items: center; justify-content: center; overflow: hidden;">
              <img src="/images/torito-pin.png" style="width: 24px; height: 24px; object-fit: contain;" />
            </div>
            <div>
              <strong style="color: #E31E24; font-size: 13px; display: block; line-height: 1.2;">${storeName}</strong>
              <span style="font-size: 10px; font-weight: bold; color: #F5C518; background: #1A1A1A; padding: 1px 5px; border-radius: 3px;">Tienda Principal</span>
            </div>
          </div>
          <p style="color: #4B5563; font-size: 11px; margin: 4px 0 6px 0;">📍 ${storeAddress}</p>
          <div style="border-top: 1px solid #F3F4F6; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #15803D; font-size: 10px; font-weight: bold;">● Abierto hasta 10 PM</span>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${storeLat},${storeLng}" target="_blank" rel="noreferrer" style="color: #1B4DA1; font-weight: bold; font-size: 11px; text-decoration: underline;">Cómo llegar &rarr;</a>
          </div>
        </div>
      `;

      L.marker([storeLat, storeLng], { icon: toritoDivIcon })
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [storeLat, storeLng, storeName, storeAddress]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[340px] rounded-xl overflow-hidden shadow-inner"
    />
  );
}
