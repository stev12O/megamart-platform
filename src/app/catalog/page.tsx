import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ArrowLeft, Layers, Sparkles } from "lucide-react";

interface CatalogPageProps {
  searchParams: {
    cat?: string;
    q?: string;
    sort?: string;
  };
}

export const revalidate = 0;

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const categorySlug = searchParams.cat || "";
  const query = searchParams.q || "";
  const sort = searchParams.sort || "featured";

  // Fetch all categories for filter chips
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Build where clause
  const whereClause: any = {
    isAvailable: true,
  };

  if (categorySlug) {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy,
  });

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E31E24] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>

        <span className="text-xs text-gray-400 font-medium">
          Mostrando {products.length} {products.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {activeCategory ? activeCategory.name : query ? `Búsqueda: "${query}"` : "Catálogo Completo"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {activeCategory
              ? `Explora toda nuestra variedad en ${activeCategory.name.toLowerCase()}`
              : "Todos los productos frescos y de calidad garantizada de MEGAMART"}
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-500 font-medium">Ordenar por:</span>
          <div className="relative">
            <select
              defaultValue={sort}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-[#E31E24] cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/catalog"
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !categorySlug
              ? "bg-[#E31E24] text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
          }`}
        >
          Todos los Productos
        </Link>

        {categories.map((cat) => {
          const isSelected = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/catalog?cat=${cat.slug}${query ? `&q=${query}` : ""}`}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-[#E31E24] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Active Search Filter Chip */}
      {query && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Filtrado por:</span>
          <span className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full">
            "{query}"
            <Link href={`/catalog${categorySlug ? `?cat=${categorySlug}` : ""}`} className="text-gray-500 hover:text-black">
              ×
            </Link>
          </span>
        </div>
      )}

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No encontramos productos con ese filtro</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Intenta buscar con otra palabra o explora nuestras categorías más populares.
          </p>
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 bg-[#E31E24] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
