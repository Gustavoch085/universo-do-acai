import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { ProductBadge } from '../ui/Badge';
import { ProductCustomizer } from './ProductCustomizer';
import { PROMO_2X24 } from '../../lib/promo';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590301157284-5a0b6e5d8a91?w=400&fm=webp&q=70';

export const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const openCustomizer = useCallback(() => setCustomizerOpen(true), []);
  const closeCustomizer = useCallback(() => setCustomizerOpen(false), []);

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="group bg-surface-2 rounded-2xl overflow-hidden border border-purple-900/30 hover:border-purple-600/50 transition-all duration-300 flex flex-col"
        aria-label={`Produto: ${product.name}, R$ ${product.price.toFixed(2)}`}
      >
        <div className="relative overflow-hidden h-48 bg-surface-3 flex-shrink-0">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton" aria-hidden="true" />
          )}
          <img
            src={imageError ? FALLBACK_IMAGE : product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true); }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && <ProductBadge badge={product.badge} />}
            {product.promoEligible && (
              <span className="inline-flex items-center gap-1 bg-lime-400/20 border border-lime-400/50 text-lime-400 text-xs font-bold px-2 py-0.5 rounded-full">
                ⚡ {PROMO_2X24.label}
              </span>
            )}
          </div>

          {discountPct && (
            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
              −{discountPct}%
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-sm leading-tight">{product.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5" aria-label={`Avaliação: ${product.rating} de 5`}>
              <span className="text-yellow-400 text-xs" aria-hidden="true">★</span>
              <span className="text-purple-300/60 text-xs font-medium">{product.rating}</span>
            </div>
          </div>

          <p className="text-purple-300/55 text-xs leading-relaxed flex-1 line-clamp-2 mb-2.5">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2.5 border-t border-purple-900/30">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-white font-extrabold text-base">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-purple-300/35 text-xs line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-purple-300/35 text-xs">{product.preparationTime} min</p>
            </div>

            <button
              type="button"
              onClick={openCustomizer}
              disabled={!product.inStock}
              aria-label={
                product.inStock
                  ? `Adicionar ${product.name} ao carrinho`
                  : `${product.name} esgotado`
              }
              className={[
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95',
                product.inStock
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40'
                  : 'bg-surface-3 text-purple-400/30 cursor-not-allowed border border-purple-900/20',
              ].join(' ')}
            >
              {product.inStock ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar
                </>
              ) : (
                'Esgotado'
              )}
            </button>
          </div>
        </div>
      </motion.article>

      <ProductCustomizer
        product={product}
        isOpen={customizerOpen}
        onClose={closeCustomizer}
      />
    </>
  );
});
