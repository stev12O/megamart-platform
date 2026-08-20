"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, ShoppingBag, ShieldCheck, Clock, Award } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function QuickViewModal() {
  const isQuickViewOpen = useUIStore((state) => state.isQuickViewOpen);
  const closeQuickView = useUIStore((state) => state.closeQuickView);
  const product = useUIStore((state) => state.quickViewProduct);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isQuickViewOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeQuickView();
      openCart();
    }, 600);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-gray-50 overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                Sin imagen disponible
              </div>
            )}

            {discountPercent && (
              <span className="absolute top-4 left-4 bg-[#E31E24] text-white text-xs font-extrabold px-2.5 py-1 rounded shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {product.badge && (
                <span className="inline-block bg-[#F5C518] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                  {product.badge}
                </span>
              )}

              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-gray-500 mt-1">Por {product.unit}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                {product.description ||
                  "Producto selecto de calidad premium, listo para disfrutar con la frescura tradicional de MEGAMART."}
              </p>

              {/* Feature bullets */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#3A9E3A]" />
                  <span>Selección fresca del día</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F5C518]" />
                  <span>Disponible para Delivery y Pickup hoy</span>
                </div>
              </div>
            </div>

            {/* Stepper and Add Button */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Cantidad:</span>
                <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#E31E24] hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                  added
                    ? "bg-[#3A9E3A] text-white"
                    : "bg-[#E31E24] hover:bg-[#CC181E] text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Agregar {quantity} por {formatPrice(product.price * quantity)}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
