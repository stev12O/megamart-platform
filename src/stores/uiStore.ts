import { create } from "zustand";
import { CartProduct } from "./cartStore";

interface UIState {
  isCartOpen: boolean;
  isQuickViewOpen: boolean;
  isStoreMapOpen: boolean;
  quickViewProduct: (CartProduct & { description?: string | null; badge?: string | null; stock?: number }) | null;
  searchQuery: string;
  selectedCategory: string | null;
  
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openQuickView: (product: CartProduct & { description?: string | null; badge?: string | null; stock?: number }) => void;
  closeQuickView: () => void;
  openStoreMap: () => void;
  closeStoreMap: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (slug: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isQuickViewOpen: false,
  isStoreMapOpen: false,
  quickViewProduct: null,
  searchQuery: "",
  selectedCategory: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  openQuickView: (product) => set({ isQuickViewOpen: true, quickViewProduct: product }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProduct: null }),

  openStoreMap: () => set({ isStoreMapOpen: true }),
  closeStoreMap: () => set({ isStoreMapOpen: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (slug) => set({ selectedCategory: slug }),
}));
