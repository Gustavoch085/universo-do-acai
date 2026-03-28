import { lazy, Suspense, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeaturedProducts } from '../hooks/useProducts';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { PromoBanner } from '../components/ui/PromoBanner';
import { SectionErrorBoundary } from '../components/ui/ErrorBoundary';

const ProductCard = lazy(() =>
  import('../components/product/ProductCard').then((m) => ({ default: m.ProductCard }))
);

const STATS = [
  { value: '50k+', label: 'Clientes em Fortaleza', emoji: '😊' },
  { value: '4', label: 'Lojas na cidade', emoji: '📍' },
  { value: '4.8★', label: 'Avaliação média', emoji: '⭐' },
  { value: '6+', label: 'Anos de história', emoji: '🏆' },
];

const VALUES = [
  { emoji: '🍬', title: 'Açaí Doce', description: 'Batido com guaraná, cremoso e gelado. Do jeito que Fortaleza aprendeu a amar.' },
  { emoji: '⚡', title: 'Feito na Hora', description: 'Cada tigela preparada na hora do pedido para garantir textura e temperatura ideais.' },
  { emoji: '🎨', title: 'Personalizado', description: 'Monte do seu jeito com nossa variedade de adicionais frescos e de qualidade.' },
  { emoji: '💜', title: 'Com Carinho', description: '6 anos servindo famílias fortalezenses. O segredo é o amor em cada colherada.' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function FeaturedSection() {
  const { products, isLoading, error } = useFeaturedProducts();

  return (
    <section aria-labelledby="featured-heading" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-2"
        >
          Os Favoritos
        </motion.p>
        <motion.h2
          id="featured-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-white"
        >
          Os Mais Pedidos
        </motion.h2>
      </div>

      <SectionErrorBoundary>
        {error ? (
          <div className="text-center text-red-400/70 py-8 text-sm">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product, i) => (
                  <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
                    <ProductCard product={product} index={i} />
                  </Suspense>
                ))}
          </div>
        )}
      </SectionErrorBoundary>

      <div className="text-center mt-10">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl font-bold text-sm transition-all duration-200"
        >
          Ver Cardápio Completo
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export const Home = memo(function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        aria-label="Apresentação"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-24 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-24 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(168,85,247,0.07) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/40 border border-purple-700/50 rounded-full text-purple-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" aria-hidden="true" />
                4 lojas em Fortaleza · Entrega em 30 min
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                O Açaí Doce<br />
                <span className="gradient-text">de Fortaleza.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-5 text-lg text-purple-300/65 leading-relaxed max-w-md">
                Cremoso, gelado e do jeito certo. Desde 2019 fazendo parte do dia a dia
                das famílias fortalezenses. Personalize com os melhores adicionais.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-3">
                <PromoBanner variant="inline" />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-7">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-base rounded-xl shadow-xl shadow-purple-900/50 transition-all duration-200 active:scale-95 glow-purple"
                >
                  Ver Cardápio
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/sobre"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-purple-700/60 hover:border-purple-500 text-purple-300 hover:text-white font-bold text-base rounded-xl transition-all duration-200"
                >
                  Nossa História
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
              className="relative flex items-center justify-center lg:justify-end"
              aria-hidden="true"
            >
              {/* Glow estático fora do float para não pular */}
              <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-3xl scale-75 pointer-events-none" />

              {/* Tudo dentro deste div flutua junto: bola + cards */}
              <div className="relative animate-float">
                {/* Bola com texto sobreposto no centro */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                  <img
                    src="https://images.unsplash.com/photo-1590301157284-5a0b6e5d8a91?w=600&fm=webp&q=85"
                    alt=""
                    loading="eager"
                    className="w-full h-full object-cover rounded-full border-4 border-purple-600/40 shadow-2xl"
                  />
                  {/* Nome no centro — flutua junto com a bola (mesmo animate-float no pai) */}
                  <div
                    className="absolute inset-0 rounded-full bg-black/45 flex flex-col items-center justify-center px-5 text-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <span className="font-extrabold text-white text-2xl sm:text-3xl tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-tight">
                      Universo
                    </span>
                    <span className="font-extrabold text-lime-400 text-2xl sm:text-3xl tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mt-0.5">
                      Açaí
                    </span>
                  </div>
                </div>

                {/* Card Avaliação — esquerda */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.45 }}
                  className="absolute -left-6 top-1/4 glass rounded-2xl px-4 py-3 shadow-xl text-center min-w-[90px]"
                >
                  <p className="text-xs text-purple-300/55">Avaliação</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-yellow-400 text-base" aria-hidden="true">★</span>
                    <span className="font-extrabold text-white text-xl">4.8</span>
                  </div>
                </motion.div>

                {/* Card Lojas — direita */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.45 }}
                  className="absolute -right-6 bottom-1/4 glass rounded-2xl px-4 py-3 shadow-xl text-center min-w-[100px]"
                >
                  <p className="text-xs text-purple-300/55">Nossas lojas</p>
                  <p className="font-extrabold text-white text-xl mt-0.5">Fortaleza</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-purple-900/30 bg-surface-2" aria-label="Estatísticas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, label, emoji }) => (
              <motion.div key={value} variants={itemVariants} className="text-center">
                <div className="text-2xl mb-1.5" aria-hidden="true">{emoji}</div>
                <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-purple-300/45 text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured products */}
      <FeaturedSection />

      {/* Promo highlight */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <PromoBanner variant="hero" />
      </section>

      {/* Values */}
      <section className="py-20 bg-surface-2" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <motion.h2
              id="values-heading"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Por Que o Universo do Açaí?
            </motion.h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {VALUES.map(({ emoji, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="p-6 bg-surface-3 rounded-2xl border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300"
              >
                <div className="text-3xl mb-3" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-white text-base mb-1.5">{title}</h3>
                <p className="text-purple-300/55 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 text-center" aria-labelledby="cta-heading">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1a1025 55%, #0f3d20 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-lime-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-lime-400 font-bold text-sm uppercase tracking-widest mb-3">Cupom de Boas-Vindas</p>
            <h2 id="cta-heading" className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
              15% OFF na primeira compra
            </h2>
            <p className="text-purple-300/65 mb-7 max-w-md mx-auto">
              Use o cupom{' '}
              <strong className="text-white font-mono bg-purple-900/60 px-2 py-0.5 rounded-lg text-sm">
                PRIMEIRACOMPRA
              </strong>{' '}
              no checkout.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-10 py-4 bg-lime-400 hover:bg-lime-300 text-gray-900 font-extrabold text-base rounded-xl shadow-xl shadow-lime-900/30 transition-all duration-200 active:scale-95 glow-lime"
            >
              Pedir Agora 🍨
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
});
