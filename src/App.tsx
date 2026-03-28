import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartSidebar } from './components/layout/CartSidebar';
import { ToastProvider } from './components/ui/Toast';
import { HeroSkeleton } from './components/ui/Skeleton';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Menu = lazy(() => import('./pages/Menu').then((m) => ({ default: m.Menu })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-20" role="main">
      <div className="text-center">
        <p className="text-7xl mb-5" aria-hidden="true">🍨</p>
        <h1 className="text-3xl font-extrabold text-white mb-2">Página não encontrada</h1>
        <p className="text-purple-300/55 mb-7 text-sm">Essa tigela está vazia por aqui!</p>
        <a
          href="/"
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm transition-colors"
        >
          Voltar ao Início
        </a>
      </div>
    </main>
  );
}

function PageRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<HeroSkeleton />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              <ErrorBoundary>
                <PageRoutes />
              </ErrorBoundary>
            </div>
            <Footer />
            <CartSidebar />
          </div>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
