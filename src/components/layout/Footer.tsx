import { memo } from 'react';
import { Link } from 'react-router-dom';

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-surface-2 border-t border-purple-900/30 mt-24" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
                <span className="text-lg" aria-hidden="true">🍨</span>
              </div>
              <span className="font-extrabold text-xl leading-none">
                <span className="text-white">Universo</span>
                <span className="text-purple-400"> do Açaí</span>
              </span>
            </Link>
            <p className="text-purple-300/55 text-sm leading-relaxed">
              Açaí doce, do jeito fortalezense. 4 lojas em Fortaleza, mais de 5 anos de história.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                {
                  name: 'instagram', href: 'https://instagram.com',
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
                },
                {
                  name: 'whatsapp', href: 'https://wa.me/5585999999999',
                  icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
                },
              ].map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Seguir no ${name}`}
                  className="w-9 h-9 rounded-xl bg-purple-900/40 hover:bg-purple-700/60 flex items-center justify-center text-purple-400 hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-2.5" role="list">
              {[['/', 'Início'], ['/menu', 'Cardápio'], ['/sobre', 'Nossa História'], ['/dashboard', 'Minha Conta']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-purple-300/55 hover:text-purple-300 text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Cardápio</h3>
            <ul className="space-y-2.5" role="list">
              {[['Açaí Doce', 'acai'], ['Creme de Ninho', 'creme-de-ninho'], ['Sorvetes', 'sorvetes'], ['Cupuaçu', 'cupuacu']].map(([label, cat]) => (
                <li key={cat}>
                  <Link to={`/menu?categoria=${cat}`} className="text-purple-300/55 hover:text-purple-300 text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Nossas Lojas</h3>
            <ul className="space-y-3 text-sm text-purple-300/55" role="list">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0" aria-hidden="true">📍</span>
                <span>4 unidades em Fortaleza — CE</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">🕐</span>
                <span>Todos os dias: 12h–23h</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📱</span>
                <a href="https://wa.me/5585999999999" className="hover:text-purple-300 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                  (85) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-purple-900/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-purple-300/35 text-sm">
            © {new Date().getFullYear()} Universo do Açaí. Todos os direitos reservados.
          </p>
          <p className="text-purple-300/35 text-sm">
            Feito com 💜 em Fortaleza
          </p>
        </div>
      </div>
    </footer>
  );
});
