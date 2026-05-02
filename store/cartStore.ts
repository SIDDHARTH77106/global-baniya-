import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartProductData = {
  productId: string;
  name: string;
  brand?: string | null;
  image?: string | null;
  size?: string | null;
  color?: string | null;
  price: number;
  originalPrice?: number | null;
  stock?: number;
};

export type CartItem = CartProductData & {
  variantId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (variantId: string, qty: number, productData: CartProductData) => void;
  removeFromCart: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
};

function clampQty(qty: number, stock?: number) {
  const nextQty = Math.max(1, Math.floor(qty));
  return typeof stock === 'number' ? Math.min(nextQty, Math.max(1, stock)) : nextQty;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (variantId, qty, productData) =>
        set((state) => {
          const existing = state.items.find((item) => item.variantId === variantId);
          const safeQty = clampQty(qty, productData.stock);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.variantId === variantId
                  ? {
                      ...item,
                      ...productData,
                      quantity: clampQty(item.quantity + safeQty, productData.stock),
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...productData,
                variantId,
                quantity: safeQty,
              },
            ],
          };
        }),
      removeFromCart: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),
      updateQty: (variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((item) => item.variantId !== variantId)
              : state.items.map((item) =>
                  item.variantId === variantId
                    ? { ...item, quantity: clampQty(qty, item.stock) }
                    : item
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'global-baniya-cart',
    }
  )
);
