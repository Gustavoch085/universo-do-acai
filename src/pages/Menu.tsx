import { lazy, Suspense, useState, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { PromoBanner } from '../components/ui/PromoBanner';
import { SectionErrorBoundary } from '../components/ui/ErrorBoundary';
import type { ProductCategory, SortOption } from '../types';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '../data/products';

const ProductCard = lazy(() =>
  import('../components/product/ProductCard').then((m) => ({ default: m.ProductCard }))
);

const CATEGORIES: ReadonlyArray<{ id: 'all' | ProductCategory; label: string; emoji: string }> = [
  { id: 'all', label: 'Todos', emoji: '🍽️' },
  { id: 'acai', label: 'Açaí Doce', emoji: '🍇' },
  { id: 'creme-de-ninho', label: 'Creme de Ninho', emoji: '🥛' },
  { id: 'sorvetes', label: 'Sorvetes', emoji: '🍦' },
  { id: 'cupuacu', label: 'Cupuaçu', emoji: '🌿' },
];

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Mais Populares' },
  { value: 'rating', label: 'Melhor Avaliados' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'newest', label: 'Novidades' },
];

const CATEGORY_ORDER: Array<'all' | ProductCategory> = [
  'acai', 'creme-de-ninho', 'sorvetes', 'cupuacu',
];

export const Menu = memo(function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('categoria') as ProductCategory | 'all') ?? 'all';

  const [searchRaw, setSearchRaw] = useState('');
  const [category, setCategory] = useState<'all' | ProductCategory>(initialCategory);
  const [sort, setSort] = useState<SortOption>('popular');
  const search = useDebounce(searchRaw, 380);

  const filters = useMemo(
    () => ({
      category: category === 'all' ? undefined : category,
      search: search || undefined,
      sort,
    }),
    [category, search, sort]
  );

  const { products, isLoading, error, refetch } = useProducts(filters);

  const handleCategoryChange = useCallback((cat: 'all' | ProductCategory) => {
    setCategory(cat);
    setSearchParams(cat !== 'all' ? { categoria: cat } : {});
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchRaw('');
    setCategory('all');
    setSort('popular');
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters = searchRaw || category !== 'all' || sort !== 'popular';

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Universo do Açaí · Fortaleza
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Nosso Cardápio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-purple-300/60 mt-3"
          >
            Açaí doce, creme de ninho, sorvetes e cupuaçu — do jeito fortalezense.
          </motion.p>
        </div>

        {/* Promo banner */}
        <div className="mb-8">
          <PromoBanner variant="hero" />
        </div>

        {/* Sticky filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="sticky top-[68px] z-30 pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6"
          style={{ background: 'linear-gradient(to bottom, #0f0a1a 85%, transparent)' }}
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={searchRaw}
                  onChange={(e) => setSearchRaw(e.target.value)}
                  placeholder="Buscar produto..."
                  aria-label="Buscar produtos no cardápio"
                  className="w-full pl-10 pr-9 py-2.5 bg-surface-2 border border-purple-900/40 hover:border-purple-700/60 focus:border-purple-500 rounded-xl text-white placeholder-purple-400/40 text-sm transition-colors duration-150 outline-none"
                />
                <AnimatePresence>
                  {searchRaw && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchRaw('')}
                      aria-label="Limpar busca"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-purple-700/60 flex items-center justify-center text-purple-300 hover:bg-purple-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Ordenar produtos"
                className="px-3 py-2.5 bg-surface-2 border border-purple-900/40 focus:border-purple-500 rounded-xl text-white text-sm transition-colors outline-none cursor-pointer appearance-none min-w-[160px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-surface-2">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filtrar por categoria">
              {CATEGORIES.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCategoryChange(id)}
                  aria-pressed={category === id}
                  className={[
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border',
                    category === id
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/40'
                      : 'bg-surface-2 border-purple-900/30 text-purple-300/65 hover:border-purple-700/50 hover:text-white',
                  ].join(' ')}
                >
                  <span aria-hidden="true">{emoji}</span>
                  {label}
                </button>
              ))}

              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 border border-red-900/30 hover:bg-red-900/15 transition-all duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Product grid */}
        <SectionErrorBoundary>
          {error ? (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {!isLoading && products.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                  role="status"
                >
                  <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
                  <p className="text-white font-bold text-xl mb-2">Nenhum produto encontrado</p>
                  <p className="text-purple-300/50 text-sm mb-6">Ajuste os filtros ou a busca.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-semibold transition-colors"
                  >
                    Ver todos
                  </button>
                </motion.div>
              )}

              {CATEGORY_ORDER.map((catKey) => {
                if (category !== 'all' && category !== catKey) return null;
                const catProducts = products.filter((p) => p.category === catKey);
                if (!isLoading && catProducts.length === 0) return null;

                return (
                  <section key={catKey} className="mb-14" aria-labelledby={`cat-${catKey}`}>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <h2 id={`cat-${catKey}`} className="text-xl font-bold text-white">
                            {CATEGORY_LABELS[catKey]}
                          </h2>
                          <div className="flex-1 h-px bg-purple-900/30" aria-hidden="true" />
                          {!isLoading && (
                            <span className="text-purple-400/50 text-xs">{catProducts.length} itens</span>
                          )}
                        </div>
                        {CATEGORY_DESCRIPTIONS[catKey] && (
                          <p className="text-purple-300/45 text-xs mt-1">{CATEGORY_DESCRIPTIONS[catKey]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : catProducts.map((product, i) => (
                            <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
                              <ProductCard product={product} index={i} />
                            </Suspense>
                          ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </SectionErrorBoundary>
      </div>
    </main>
  );
});
