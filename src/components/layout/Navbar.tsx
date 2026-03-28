import { useState, useEffect, memo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cart.store';

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/menu', label: 'Cardápio' },
  { to: '/sobre', label: 'Nossa História' },
];

export const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { openCart, itemCount } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass shadow-xl shadow-black/40 py-3' : 'bg-transparent py-5',
        ].join(' ')}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between"
          role="navigation"
          aria-label="Navegação principal"
        >
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Universo do Açaí — Página inicial">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/60 group-hover:scale-110 transition-transform duration-200">
              <span className="text-lg" aria-hidden="true">🍨</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight leading-none">
              <span className="text-white">Universo</span>
              <span className="text-purple-400"> do Açaí</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    [
                      'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'text-purple-200/70 hover:text-white hover:bg-white/5',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              aria-label="Minha conta"
              className="hidden md:flex w-9 h-9 rounded-xl items-center justify-center text-purple-300 hover:bg-purple-900/40 hover:text-white transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`}
              className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-purple-900/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Carrinho</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-lime-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-xl hover:bg-purple-900/40 transition-colors duration-200"
            >
              <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
              <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-white rounded-full" />
              <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="navigation"
            aria-label="Menu mobile"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-[70px] left-4 right-4 z-40 glass rounded-2xl p-4 shadow-2xl border border-purple-800/40 md:hidden"
          >
            <ul className="flex flex-col gap-1" role="list">
              {[...NAV_LINKS, { to: '/dashboard', label: 'Minha Conta' }].map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      [
                        'block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
                        isActive ? 'bg-purple-600/30 text-purple-200' : 'text-purple-200/70 hover:bg-white/5 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
