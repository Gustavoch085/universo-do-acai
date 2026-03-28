import { useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cart.store';
import { resolveAllCartItems } from '../../lib/catalog';
import { isPromoActive } from '../../lib/promo';
import { PromoBanner } from '../ui/PromoBanner';

const FREE_DELIVERY_THRESHOLD = 60;

export const CartSidebar = memo(function CartSidebar() {
  const {
    isOpen, closeCart, items,
    removeItem, updateQuantity,
    computeTotals, itemCount,
    couponCode,
  } = useCartStore();

  const totals = computeTotals();
  const count = itemCount();
  const promoActive = isPromoActive(items);

  /**
   * resolvedItems is derived from the immutable catalog — not from stored prices.
   * Memoized to prevent expensive re-resolution on unrelated re-renders.
   */
  const resolvedItems = useMemo(() => resolveAllCartItems(items), [items]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  const progressToFreeDelivery = Math.min(
    ((totals.subtotal - totals.promoDiscount - totals.couponDiscount) / FREE_DELIVERY_THRESHOLD) * 100,
    100
  );

  const handleQuantityDecrement = useCallback((id: string, qty: number) => {
    updateQuantity(id, qty - 1);
  }, [updateQuantity]);

  const handleQuantityIncrement = useCallback((id: string, qty: number) => {
    updateQuantity(id, qty + 1);
  }, [updateQuantity]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface-2 z-50 flex flex-col border-l border-purple-900/40 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-purple-900/30 flex-shrink-0">
              <h2 className="font-bold text-lg text-white">
                Meu Carrinho
                {count > 0 && (
                  <span className="ml-2 text-sm font-normal text-purple-400">
                    ({count} {count === 1 ? 'item' : 'itens'})
                  </span>
                )}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-300 hover:bg-purple-900/40 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free delivery progress */}
            <AnimatePresence>
              {totals.subtotal > 0 && totals.deliveryFee > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 py-3 bg-purple-900/15 border-b border-purple-900/20 flex-shrink-0"
                >
                  <div className="flex justify-between text-xs text-purple-300/60 mb-1.5">
                    <span>Progresso para frete grátis</span>
                    <span>Faltam R$ {Math.max(0, FREE_DELIVERY_THRESHOLD - (totals.subtotal - totals.promoDiscount - totals.couponDiscount)).toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-lime-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToFreeDelivery}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Promo banner inside cart */}
            <AnimatePresence>
              {promoActive && <PromoBanner variant="cart" />}
            </AnimatePresence>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {resolvedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
                  <span className="text-5xl" aria-hidden="true">🛒</span>
                  <p className="text-purple-300/60 font-medium">Seu carrinho está vazio</p>
                  <p className="text-purple-300/35 text-sm">Adicione itens do cardápio para começar.</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-semibold transition-colors"
                  >
                    Ver Cardápio
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {resolvedItems.map((resolved) => (
                    <motion.div
                      key={resolved.cartItem.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-3 p-3 rounded-2xl bg-surface-3 border border-purple-900/25"
                    >
                      <img
                        src={resolved.product.image}
                        alt={resolved.product.name}
                        loading="lazy"
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm leading-tight truncate">
                          {resolved.product.name}
                        </p>
                        {resolved.selectedToppings.length > 0 && (
                          <p className="text-purple-300/45 text-xs mt-0.5 truncate">
                            + {resolved.selectedToppings.map((t) => t.name).join(', ')}
                          </p>
                        )}
                        {resolved.cartItem.notes && (
                          <p className="text-purple-300/35 text-xs mt-0.5 truncate italic">
                            {resolved.cartItem.notes}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1.5 bg-surface-2 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityDecrement(resolved.cartItem.id, resolved.cartItem.quantity)}
                              aria-label={`Diminuir quantidade de ${resolved.product.name}`}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-purple-300 hover:bg-purple-700/50 hover:text-white transition-colors text-base font-bold"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-white text-xs font-bold" aria-live="polite">
                              {resolved.cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityIncrement(resolved.cartItem.id, resolved.cartItem.quantity)}
                              aria-label={`Aumentar quantidade de ${resolved.product.name}`}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-purple-300 hover:bg-purple-700/50 hover:text-white transition-colors text-base font-bold"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-white font-bold text-sm">
                            R$ {resolved.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(resolved.cartItem.id)}
                        aria-label={`Remover ${resolved.product.name} do carrinho`}
                        className="self-start w-7 h-7 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer totals + CTA */}
            {resolvedItems.length > 0 && (
              <div className="px-5 py-4 border-t border-purple-900/30 space-y-3 flex-shrink-0">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-purple-300/60">
                    <span>Subtotal</span>
                    <span>R$ {totals.subtotal.toFixed(2)}</span>
                  </div>

                  {totals.promoDiscount > 0 && (
                    <div className="flex justify-between text-lime-400 font-semibold">
                      <span>Promo {totals.promoDiscount > 0 ? '2×R$24' : ''}</span>
                      <span>−R$ {totals.promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {totals.couponDiscount > 0 && (
                    <div className="flex justify-between text-lime-400">
                      <span>Cupom ({couponCode})</span>
                      <span>−R$ {totals.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-purple-300/60">
                    <span>Entrega</span>
                    <span className={totals.deliveryFee === 0 ? 'text-lime-400 font-semibold' : ''}>
                      {totals.deliveryFee === 0 ? 'Grátis 🎉' : `R$ ${totals.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-purple-900/30">
                    <span>Total</span>
                    <span>R$ {totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl text-white font-bold text-center text-sm transition-all duration-200 shadow-lg shadow-purple-900/50"
                >
                  Finalizar Pedido →
                </Link>
                <p className="text-center text-xs text-purple-300/30">🔒 Pagamento seguro</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});
