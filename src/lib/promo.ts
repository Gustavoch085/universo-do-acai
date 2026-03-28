/**
 * Promotional pricing engine.
 *
 * Promo "2 por R$ 24,00":
 * - Applies to all items in the 'acai' category
 * - Every 2 eligible units cost R$ 24,00 total (regardless of individual prices)
 * - Pairs are assembled by sorting by price DESC to maximize customer savings
 * - Remaining unpaired items are charged at their full verified price
 */
import type { CartItem, ProductCategory, PromoResult } from '../types';
import { resolveCartItem } from './catalog';

export const PROMO_2X24 = {
  id: 'PROMO_2X24' as const,
  label: '2 por R$ 24,00',
  pairPrice: 24,
  eligibleCategories: ['acai'] as ProductCategory[],
  minQualifyingItems: 2,
} as const;

/**
 * Calculates the discount from the "2 por R$ 24" promo.
 * Always works from verified catalog prices — never trusts stored values.
 */
export function calculatePromoDiscount(items: CartItem[]): PromoResult {
  const eligibleUnitPrices: number[] = [];

  for (const item of items) {
    const resolved = resolveCartItem(item);
    if (!resolved) continue;
    if (!PROMO_2X24.eligibleCategories.includes(resolved.product.category)) continue;

    for (let i = 0; i < item.quantity; i++) {
      eligibleUnitPrices.push(resolved.unitPrice);
    }
  }

  if (eligibleUnitPrices.length < PROMO_2X24.minQualifyingItems) {
    return { label: PROMO_2X24.label, discountAmount: 0, eligiblePairCount: 0 };
  }

  eligibleUnitPrices.sort((a, b) => b - a);

  const pairs = Math.floor(eligibleUnitPrices.length / 2);
  let pairedNormalTotal = 0;

  for (let i = 0; i < pairs * 2; i++) {
    pairedNormalTotal += eligibleUnitPrices[i];
  }

  const promoTotal = pairs * PROMO_2X24.pairPrice;
  const discountAmount = Math.max(0, pairedNormalTotal - promoTotal);

  return {
    label: PROMO_2X24.label,
    discountAmount: Math.round(discountAmount * 100) / 100,
    eligiblePairCount: pairs,
  };
}

/**
 * Returns true when the cart qualifies for the promo.
 */
export function isPromoActive(items: CartItem[]): boolean {
  let eligibleCount = 0;
  for (const item of items) {
    const resolved = resolveCartItem(item);
    if (!resolved) continue;
    if (PROMO_2X24.eligibleCategories.includes(resolved.product.category)) {
      eligibleCount += item.quantity;
      if (eligibleCount >= PROMO_2X24.minQualifyingItems) return true;
    }
  }
  return false;
}
