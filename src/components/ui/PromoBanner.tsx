import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROMO_2X24 } from '../../lib/promo';

interface PromoBannerProps {
  variant?: 'hero' | 'inline' | 'cart';
}

export const PromoBanner = memo(function PromoBanner({ variant = 'hero' }: PromoBannerProps) {
  if (variant === 'cart') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mx-4 mb-3 px-4 py-3 bg-gradient-to-r from-lime-500/10 to-lime-400/5 border border-lime-500/30 rounded-2xl flex items-center gap-3"
        role="note"
        aria-label="Promoção ativa"
      >
        <span className="text-2xl flex-shrink-0" aria-hidden="true">🎉</span>
        <div>
          <p className="text-lime-400 font-bold text-sm">{PROMO_2X24.label}</p>
          <p className="text-lime-300/60 text-xs">Desconto aplicado automaticamente no carrinho</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400/10 border border-lime-400/30 rounded-full text-sm font-bold text-lime-400"
        role="note"
      >
        <span aria-hidden="true">⚡</span>
        <span>Promoção: {PROMO_2X24.label} no Açaí</span>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      aria-labelledby="promo-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-600/20 via-lime-500/10 to-transparent border border-lime-500/30 p-6 sm:p-8"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl" aria-hidden="true">⚡</span>
            <span className="text-xs font-bold text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-1 rounded-full border border-lime-400/30">
              Promoção Ativa
            </span>
          </div>
          <h2 id="promo-heading" className="text-2xl sm:text-3xl font-extrabold text-white">
            {PROMO_2X24.label} no Açaí!
          </h2>
          <p className="text-lime-300/70 mt-1.5 text-sm">
            Peça qualquer 2 produtos da categoria Açaí e pague apenas{' '}
            <strong className="text-white">R$ 24,00</strong> pelos dois.
            Desconto aplicado automático no carrinho.
          </p>
        </div>
        <Link
          to="/menu?categoria=acai"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-lime-400 hover:bg-lime-300 text-gray-900 font-extrabold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-lime-900/30 hover:shadow-lime-900/50 active:scale-95 whitespace-nowrap"
          aria-label="Ver produtos açaí em promoção"
        >
          Aproveitar agora
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </motion.section>
  );
});
