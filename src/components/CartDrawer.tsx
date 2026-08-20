"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Store, Sparkles, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);

  const items = useCartStore((state) => state.items);
  const orderMode = useCartStore((state) => state.orderMode);
  const setOrderMode = useCartStore((state) => state.setOrderMode);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const subtotal = useCartStore((state) => state.getSubtotal());
  const deliveryFee = useCartStore((state) => (orderMode === "DELIVERY" ? 3.99 : 0));
  const tax = useCartStore((state) => state.getEstimatedTax());
  const tip = useCartStore((state) => state.tipAmount);
  const setTip = useCartStore((state) => state.setTipAmount);
  const total = useCartStore((state) => state.getTotal());

  const freeDeliveryThreshold = 35.0;
  const minOrderThreshold = 15.0;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Tu Carrito</h3>
                <p className="text-[11px] text-gray-500">
                  {items.length} {items.length === 1 ? "producto" : "productos"} seleccionados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-[#E31E24] p-1.5 transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery / Pickup Tabs */}
          <div className="px-4 sm:px-5 pt-3 pb-2 bg-white">
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setOrderMode("DELIVERY")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  orderMode === "DELIVERY"
                    ? "bg-[#E31E24] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery ($3.99)</span>
              </button>

              <button
                onClick={() => setOrderMode("PICKUP")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  orderMode === "PICKUP"
                    ? "bg-[#F5C518] text-[#1A1A1A] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Pickup (Gratis)</span>
              </button>
            </div>

            {/* Free Delivery Bar */}
            {orderMode === "DELIVERY" && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900 mb-1">
                  <span>
                    {remainingForFreeDelivery > 0
                      ? `¡Agrega ${formatPrice(remainingForFreeDelivery)} más para Envío Gratis!`
                      : "🎉 ¡Felicidades! Tienes Envío Gratis"}
                  </span>
                  <span>{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E31E24] transition-all duration-300 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-2 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Tu carrito está vacío</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Explora nuestra panadería fresca, carnes selectas y frutas de temporada para comenzar tu pedido.
                </p>
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="mt-4 inline-flex items-center gap-1.5 bg-[#E31E24] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#CC181E] transition-colors"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3 group">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-200/70">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                        Item
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-gray-400">Por {item.product.unit}</span>
                    <div className="text-xs font-black text-gray-900 mt-0.5">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#E31E24] hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#FAF9F6] space-y-3">
              {/* Tip Selection */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                  <span className="font-medium">Propina para el repartidor</span>
                  <span className="font-bold text-gray-900">{formatPrice(tip)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2.0, 3.0, 5.0, 0.0].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTip(t)}
                      className={`py-1 rounded-md text-xs font-bold border transition-colors ${
                        tip === t
                          ? "bg-white border-[#E31E24] text-[#E31E24] shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
                      }`}
                    >
                      {t === 0 ? "Sin propina" : `$${t.toFixed(0)}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-200/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{orderMode === "DELIVERY" ? "Costo de Envío" : "Pickup en Tienda"}</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? "GRATIS" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Impuesto estimado (VA 6%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span>Propina</span>
                    <span className="font-medium text-gray-900">{formatPrice(tip)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total a Pagar</span>
                  <span className="text-base text-[#E31E24]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#CC181E] text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all transform active:scale-98"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3A9E3A]" />
                <span>Pago encriptado con Stripe • Garantía de satisfacción</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
