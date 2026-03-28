/**
 * Catalog resolver — the single source of truth for price computation.
 *
 * All monetary calculations MUST go through this module.
 * CartItems store only IDs; this module resolves them to full objects
 * at runtime, making it impossible to tamper with prices via localStorage.
 */
import { PRODUCTS } from '../data/products';
import { ALL_TOPPINGS } from '../data/toppings';
import type { CartItem, Product, ResolvedCartItem, Topping } from '../types';

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getToppingById(id: string): Topping | undefined {
  return ALL_TOPPINGS.find((t) => t.id === id);
}

/**
 * Resolves a CartItem into a display-ready ResolvedCartItem.
 * Returns null if the product no longer exists in the catalog
 * (guards against stale localStorage data referencing deleted products).
 */
export function resolveCartItem(item: CartItem): ResolvedCartItem | null {
  const product = getProductById(item.productId);
  if (!product) return null;

  const selectedToppings = item.selectedToppingIds
    .map((id) => getToppingById(id))
    .filter((t): t is Topping => t !== undefined);

  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = product.price + toppingTotal;

  return {
    cartItem: item,
    product,
    selectedToppings,
    unitPrice,
    totalPrice: unitPrice * item.quantity,
  };
}

/**
 * Resolves all cart items, silently dropping any with missing products.
 */
export function resolveAllCartItems(items: CartItem[]): ResolvedCartItem[] {
  return items.reduce<ResolvedCartItem[]>((acc, item) => {
    const resolved = resolveCartItem(item);
    if (resolved) acc.push(resolved);
    return acc;
  }, []);
}

/**
 * Computes the verified subtotal directly from the catalog.
 * This is the canonical price — stored prices in CartItem are IGNORED.
 */
export function computeVerifiedSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const resolved = resolveCartItem(item);
    return sum + (resolved?.totalPrice ?? 0);
  }, 0);
}
