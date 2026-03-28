import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartTotals, PromoResult } from '../types';
import { computeVerifiedSubtotal } from '../lib/catalog';
import { calculatePromoDiscount } from '../lib/promo';
import { sanitizeCouponCode, sanitizeNotes, clampQuantity } from '../lib/sanitize';

const DELIVERY_FEE = 6.9;
const FREE_DELIVERY_THRESHOLD = 60;
const STORE_VERSION = 2;

/**
 * Coupon registry — server-side validation would replace this in production.
 * Rates represent the fraction of subtotal discounted AFTER promo is applied.
 */
const COUPONS: Readonly<Record<string, number>> = Object.freeze({
  UNIVERSO10: 0.1,
  PRIMEIRACOMPRA: 0.15,
  FORTALEZA20: 0.2,
  BEMVINDO: 0.05,
});

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscount: number;

  addItem: (productId: string, selectedToppingIds: string[], quantity?: number, notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  /**
   * Computes totals from verified catalog sources.
   * Cannot be spoofed via localStorage tampering.
   */
  computeTotals: () => CartTotals;
  promoState: () => PromoResult;
  itemCount: () => number;
}

function generateCartId(productId: string): string {
  return `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      couponDiscount: 0,

      addItem: (productId, selectedToppingIds, quantity = 1, notes) => {
        const safeQty = clampQuantity(quantity);
        const safeNotes = notes ? sanitizeNotes(notes) : undefined;
        const sortedIds = [...selectedToppingIds].sort();

        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === productId &&
              JSON.stringify([...item.selectedToppingIds].sort()) === JSON.stringify(sortedIds)
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: clampQuantity(item.quantity + safeQty) }
                  : item
              ),
            };
          }

          const newItem: CartItem = {
            id: generateCartId(productId),
            productId,
            quantity: safeQty,
            selectedToppingIds: sortedIds,
            notes: safeNotes,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== cartItemId) })),

      updateQuantity: (cartItemId, quantity) => {
        const safeQty = clampQuantity(quantity, 0);
        if (safeQty === 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: safeQty } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code) => {
        const normalized = sanitizeCouponCode(code);
        const rate = COUPONS[normalized];
        if (!rate) return false;
        set({ couponCode: normalized, couponDiscount: rate });
        return true;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      /**
       * All monetary values are derived here from the immutable product catalog.
       * Prices stored in the cart (via localStorage) are COMPLETELY IGNORED.
       * This ensures cart total cannot be manipulated via DevTools.
       */
      computeTotals: (): CartTotals => {
        const { items, couponDiscount } = get();
        const subtotal = computeVerifiedSubtotal(items);
        const promoResult = calculatePromoDiscount(items);
        const postPromoSubtotal = subtotal - promoResult.discountAmount;
        const couponAmt = postPromoSubtotal * couponDiscount;
        const deliveryFee = postPromoSubtotal - couponAmt >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
        const total = postPromoSubtotal - couponAmt + deliveryFee;

        return {
          subtotal,
          promoDiscount: promoResult.discountAmount,
          couponDiscount: couponAmt,
          deliveryFee,
          total: Math.max(0, total),
        };
      },

      promoState: () => calculatePromoDiscount(get().items),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'universo-cart-v2',
      storage: createJSONStorage(() => localStorage),
      version: STORE_VERSION,
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
      migrate: () => ({ items: [], couponCode: null, couponDiscount: 0 }),
    }
  )
);
