import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  unit: string;
  storeId?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export type OrderMode = "DELIVERY" | "PICKUP";

interface CartState {
  items: CartItem[];
  orderMode: OrderMode;
  deliveryAddress: string;
  deliveryNotes: string;
  pickupTime: string;
  tipAmount: number;
  deliveryFee: number;
  
  // Actions
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderMode: (mode: OrderMode) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryNotes: (notes: string) => void;
  setPickupTime: (time: string) => void;
  setTipAmount: (tip: number) => void;

  // Computed / Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getEstimatedTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderMode: "DELIVERY",
      deliveryAddress: "7850 Richmond Hwy, Alexandria, VA 22306",
      deliveryNotes: "",
      pickupTime: "Lo antes posible (30-45 min)",
      tipAmount: 3.0,
      deliveryFee: 3.99,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            return {
              items: [...state.items, { product, quantity }],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setOrderMode: (mode) => {
        set({
          orderMode: mode,
          deliveryFee: mode === "DELIVERY" ? 3.99 : 0,
        });
      },

      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      setDeliveryNotes: (notes) => set({ deliveryNotes: notes }),
      setPickupTime: (time) => set({ pickupTime: time }),
      setTipAmount: (tip) => set({ tipAmount: tip }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getEstimatedTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.06; // 6% Virginia sales tax approximation
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getEstimatedTax();
        const fee = get().orderMode === "DELIVERY" ? get().deliveryFee : 0;
        const tip = get().tipAmount;
        return subtotal + tax + fee + tip;
      },
    }),
    {
      name: "megamart-cart-storage",
    }
  )
);
