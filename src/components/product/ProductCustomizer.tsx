import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Topping } from '../../types';
import { ALL_TOPPINGS } from '../../data/toppings';
import { useCartStore } from '../../store/cart.store';
import { useToast } from '../ui/Toast';
import { sanitizeNotes, clampQuantity } from '../../lib/sanitize';

interface ProductCustomizerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const TOPPING_CATEGORY_LABELS: Readonly<Record<string, string>> = {
  granola: 'Granola',
  fruit: 'Frutas Frescas',
  complemento: 'Complementos',
  syrup: 'Caldas & Mel',
  extra: 'Extras',
};

const TOPPING_CATEGORY_ORDER = ['granola', 'fruit', 'complemento', 'syrup', 'extra'];

/** Memoized topping chip to prevent re-renders of the entire grid. */
const ToppingChip = memo(function ToppingChip({
  topping,
  isSelected,
  onToggle,
}: {
  topping: Topping;
  isSelected: boolean;
  onToggle: (t: Topping) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(topping)}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Remover' : 'Adicionar'} ${topping.name} — +R$ ${topping.price.toFixed(2)}`}
      className={[
        'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left border w-full',
        isSelected
          ? 'bg-purple-600/25 border-purple-500 text-purple-200'
          : 'bg-surface-3 border-purple-900/30 text-purple-300/70 hover:border-purple-700/60 hover:text-purple-200',
      ].join(' ')}
    >
      <span className="text-base flex-shrink-0" aria-hidden="true">{topping.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="leading-tight truncate text-xs font-semibold">{topping.name}</p>
        <p className="text-xs text-purple-400/70">+R$ {topping.price.toFixed(2)}</p>
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
});

export const ProductCustomizer = memo(function ProductCustomizer({
  product,
  isOpen,
  onClose,
}: ProductCustomizerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [rawNotes, setRawNotes] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /** Catalog toppings available for this product, stable across renders. */
  const availableToppings = useMemo(
    () => ALL_TOPPINGS.filter((t) => product.availableToppingIds.includes(t.id)),
    [product.availableToppingIds]
  );

  /** Toppings grouped by category, in display order. */
  const groupedToppings = useMemo(() => {
    const groups = new Map<string, Topping[]>();
    for (const cat of TOPPING_CATEGORY_ORDER) {
      const group = availableToppings.filter((t) => t.category === cat);
      if (group.length > 0) groups.set(cat, group);
    }
    return groups;
  }, [availableToppings]);

  /** Selected Topping objects, derived from selectedIds + catalog. */
  const selectedToppings = useMemo(
    () => availableToppings.filter((t) => selectedIds.has(t.id)),
    [availableToppings, selectedIds]
  );

  /** Unit price: base product price + sum of selected topping prices (from catalog). */
  const unitPrice = useMemo(
    () => product.price + selectedToppings.reduce((s, t) => s + t.price, 0),
    [product.price, selectedToppings]
  );

  const totalDisplayPrice = unitPrice * quantity;

  useEffect(() => {
    if (!isOpen) return;

    setSelectedIds(new Set(product.defaultToppingIds));
    setQuantity(1);
    setRawNotes('');
    setImageLoaded(false);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeButtonRef.current?.focus(), 60);

    return () => { document.body.style.overflow = ''; };
  }, [isOpen, product.defaultToppingIds]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const toggleTopping = useCallback((topping: Topping) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(topping.id)) {
        next.delete(topping.id);
      } else {
        next.add(topping.id);
      }
      return next;
    });
  }, []);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((q) => clampQuantity(q + delta));
  }, []);

  const handleAddToCart = useCallback(() => {
    const safeNotes = sanitizeNotes(rawNotes);
    addItem(product.id, [...selectedIds], quantity, safeNotes || undefined);
    showToast(`${product.name} adicionado!`, 'success', '🍨');
    onClose();
    setTimeout(openCart, 300);
  }, [addItem, openCart, onClose, showToast, product.id, product.name, selectedIds, quantity, rawNotes]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg max-h-[92vh] bg-surface-2 rounded-3xl border border-purple-800/50 shadow-2xl z-[60] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`Personalizar ${product.name}`}
          >
            {/* Product image header */}
            <div className="relative h-36 flex-shrink-0 overflow-hidden bg-surface-3">
              {!imageLoaded && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover"
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-black/20 to-transparent" aria-hidden="true" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar personalizador"
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-4">
                <h2 className="font-extrabold text-lg text-white leading-tight">{product.name}</h2>
                <p className="text-purple-200/60 text-xs">
                  Base: R$ {product.price.toFixed(2)}
                  {product.promoEligible && (
                    <span className="ml-2 text-lime-400 font-semibold">⚡ Elegível 2×R$24</span>
                  )}
                </p>
              </div>
            </div>

            {/* Scrollable toppings area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" role="group" aria-label="Escolha seus adicionais">
              {groupedToppings.size === 0 ? (
                <p className="text-purple-300/50 text-sm text-center py-4">
                  Nenhum adicional disponível para este produto.
                </p>
              ) : (
                Array.from(groupedToppings.entries()).map(([category, toppings]) => (
                  <div key={category}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                      {TOPPING_CATEGORY_LABELS[category] ?? category}
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {toppings.map((topping) => (
                        <ToppingChip
                          key={topping.id}
                          topping={topping}
                          isSelected={selectedIds.has(topping.id)}
                          onToggle={toggleTopping}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                  Observações <span className="text-purple-500/50 font-normal">(opcional)</span>
                </h3>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="Ex: sem leite condensado, pouco açúcar..."
                  maxLength={300}
                  rows={2}
                  aria-label="Observações para o pedido"
                  className="w-full bg-surface-3 border border-purple-900/30 rounded-xl px-3 py-2.5 text-sm text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-500/70 resize-none transition-colors duration-200"
                />
                <p className="text-right text-xs text-purple-400/30 mt-1" aria-live="polite">
                  {rawNotes.length}/300
                </p>
              </div>
            </div>

            {/* Footer: quantity + total + CTA */}
            <div className="px-4 py-4 border-t border-purple-900/30 bg-surface-2 flex-shrink-0">
              {selectedToppings.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedToppings.map((t) => (
                    <span
                      key={t.id}
                      className="text-xs px-2 py-0.5 bg-purple-700/30 text-purple-300 rounded-full"
                    >
                      {t.emoji} {t.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 bg-surface-3 rounded-xl p-1" role="group" aria-label="Quantidade">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-300 hover:bg-purple-700/50 hover:text-white disabled:opacity-30 transition-colors duration-150 text-xl font-bold"
                  >
                    −
                  </button>
                  <span className="w-7 text-center font-bold text-white text-sm" aria-live="polite" aria-atomic="true">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Aumentar quantidade"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-300 hover:bg-purple-700/50 hover:text-white transition-colors duration-150 text-xl font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-purple-300/40 text-xs">Total do item</p>
                  <motion.p
                    key={totalDisplayPrice.toFixed(2)}
                    initial={{ scale: 1.12, color: '#a3e635' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.25 }}
                    className="font-extrabold text-xl"
                    aria-live="polite"
                    aria-label={`Total: R$ ${totalDisplayPrice.toFixed(2)}`}
                  >
                    R$ {totalDisplayPrice.toFixed(2)}
                  </motion.p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2 active:scale-[0.98]"
              >
                Adicionar ao Carrinho 🍨
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
