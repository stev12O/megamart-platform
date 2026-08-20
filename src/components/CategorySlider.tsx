"use client";

import React from "react";
import Link from "next/link";
import {
  Croissant,
  Beef,
  Apple,
  Milk,
  ShoppingBag,
  Coffee,
  Sparkles,
  Layers,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  productCount?: number;
}

interface CategorySliderProps {
  categories: Category[];
  activeSlug?: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  panaderia: <Croissant className="w-6 h-6 text-[#E31E24]" />,
  carnes: <Beef className="w-6 h-6 text-[#E31E24]" />,
  "frutas-verduras": <Apple className="w-6 h-6 text-[#3A9E3A]" />,
  lacteos: <Milk className="w-6 h-6 text-[#1B4DA1]" />,
  despensa: <ShoppingBag className="w-6 h-6 text-[#F5C518]" />,
  bebidas: <Coffee className="w-6 h-6 text-[#E31E24]" />,
  limpieza: <Sparkles className="w-6 h-6 text-[#1B4DA1]" />,
};

export default function CategorySlider({
  categories,
  activeSlug,
}: CategorySliderProps) {
  return (
    <section className="py-6 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Explorar por Categoría
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Encuentra los ingredientes más frescos para tu cocina
            </p>
          </div>

          <Link
            href="/catalog"
            className="text-xs font-bold text-[#E31E24] hover:text-[#CC181E] hover:underline"
          >
            Ver todas ({categories.length}) →
          </Link>
        </div>

        {/* Categories Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;
            const icon = iconMap[category.slug] || <Layers className="w-6 h-6 text-gray-700" />;

            return (
              <Link
                key={category.id}
                href={`/catalog?cat=${category.slug}`}
                className={`group flex flex-col items-center text-center p-3.5 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? "bg-[#FEF2F2] border-[#E31E24] shadow-sm ring-1 ring-[#E31E24]"
                    : "bg-gray-50/70 hover:bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <span className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#E31E24] transition-colors">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
