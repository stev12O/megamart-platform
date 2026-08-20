"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Check, Eye } from "lucide-react";
import { useCartStore, CartProduct } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    originalPrice?: number | null;
    imageUrl?: string | null;
    stock: number;
    unit: string;
    badge?: string | null;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const openCart = useUIStore((state) => state.openCart);

  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = mounted && cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      unit: product.unit,
    };
    addItem(cartProduct, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const handleCardClick = () => {
    openQuickView({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      unit: product.unit,
      badge: product.badge,
      stock: product.stock,
    });
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {discountPercent ? (
          <span className="bg-[#E31E24] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </span>
        ) : product.badge ? (
          <span className="bg-[#F5C518] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </span>
        ) : <span />}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="pointer-events-auto opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full shadow-sm transition-opacity"
          title="Vista rápida"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full pt-[85%] bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#E31E24] transition-colors">
            {product.name}
          </h3>

          {/* Unit / Stock */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>Por {product.unit}</span>
            {product.stock <= 10 && (
              <span className="text-amber-600 font-medium text-[11px]">
                • ¡Últimas {product.stock}!
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Cart Actions */}
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`flex items-center justify-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                justAdded
                  ? "bg-[#3A9E3A] text-white"
                  : "bg-[#E31E24] hover:bg-[#CC181E] text-white shadow-sm hover:shadow"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Listo</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                title="Reducir cantidad"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-[#E31E24] hover:bg-gray-200 transition-colors"
                title="Aumentar cantidad"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
