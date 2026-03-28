import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; emoji: string }> = {
  pending: { label: 'Aguardando', color: 'text-yellow-400', emoji: '⏳' },
  confirmed: { label: 'Confirmado', color: 'text-blue-400', emoji: '✅' },
  preparing: { label: 'Preparando', color: 'text-orange-400', emoji: '👨‍🍳' },
  ready: { label: 'Pronto', color: 'text-lime-400', emoji: '🎉' },
  delivering: { label: 'Em Entrega', color: 'text-purple-400', emoji: '🚴' },
  delivered: { label: 'Entregue', color: 'text-green-400', emoji: '✔️' },
  cancelled: { label: 'Cancelado', color: 'text-red-400', emoji: '❌' },
};

const MOCK_ORDERS = [
  {
    id: 'AP82341',
    date: '27 Mar 2026, 18:42',
    items: [
      { name: 'Açaí Clássico da Casa', qty: 1, price: 22.9 },
      { name: 'Smoothie Morango & Açaí', qty: 2, price: 41.8 },
    ],
    total: 70.6,
    status: 'delivering' as OrderStatus,
  },
  {
    id: 'AP71204',
    date: '15 Mar 2026, 12:10',
    items: [{ name: 'Power Bowl Proteico', qty: 2, price: 63.8 }],
    total: 69.7,
    status: 'delivered' as OrderStatus,
  },
  {
    id: 'AP65890',
    date: '02 Mar 2026, 20:35',
    items: [
      { name: 'Bowl Carioca', qty: 1, price: 25.9 },
      { name: 'Picolé de Açaí Premium', qty: 3, price: 38.7 },
    ],
    total: 70.5,
    status: 'delivered' as OrderStatus,
  },
];

const TABS = [
  { id: 'orders', label: 'Meus Pedidos', emoji: '📦' },
  { id: 'profile', label: 'Perfil', emoji: '👤' },
  { id: 'loyalty', label: 'Fidelidade', emoji: '💜' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-3xl" aria-hidden="true">
            🧑
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Olá, Cliente!</h1>
            <p className="text-purple-300/60 text-sm">cliente@email.com · 💜 320 pontos de fidelidade</p>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-8 border-b border-purple-900/30 pb-0" role="tablist">
          {TABS.map(({ id, label, emoji }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={[
                'flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px',
                activeTab === id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-purple-300/50 hover:text-purple-300',
              ].join(' ')}
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="tabpanel"
            aria-label="Meus Pedidos"
            className="space-y-4"
          >
            {MOCK_ORDERS.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📦</p>
                <p className="text-white font-bold text-xl mb-2">Nenhum pedido ainda</p>
                <p className="text-purple-300/50 mb-6">Seu histórico de pedidos aparecerá aqui.</p>
                <Link to="/menu" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold transition-colors">
                  Fazer primeiro pedido
                </Link>
              </div>
            ) : (
              MOCK_ORDERS.map((order, i) => {
                const status = STATUS_CONFIG[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 bg-surface-2 rounded-2xl border border-purple-900/30 hover:border-purple-700/40 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <p className="font-bold text-white">Pedido #{order.id}</p>
                        <p className="text-purple-300/50 text-xs mt-0.5">{order.date}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-sm font-semibold ${status.color}`}>
                        {status.emoji} {status.label}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {order.items.map((item) => (
                        <div key={item.name} className="flex justify-between text-sm">
                          <span className="text-purple-300/70">{item.name} <span className="text-purple-400/50">x{item.qty}</span></span>
                          <span className="text-purple-300/70">R$ {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-900/30">
                      <span className="text-white font-bold">Total: R$ {order.total.toFixed(2)}</span>
                      {order.status === 'delivered' && (
                        <button className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                          Repetir pedido ↺
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="tabpanel"
            aria-label="Perfil"
            className="max-w-lg space-y-4"
          >
            <h2 className="text-xl font-bold text-white mb-5">Informações do Perfil</h2>
            {[
              { label: 'Nome completo', placeholder: 'Seu nome', type: 'text' },
              { label: 'E-mail', placeholder: 'seu@email.com', type: 'email' },
              { label: 'Telefone', placeholder: '(11) 99999-9999', type: 'tel' },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-surface-3 border border-purple-900/40 focus:border-purple-500 rounded-xl text-white text-sm placeholder-purple-400/40 outline-none transition-colors duration-200"
                />
              </div>
            ))}
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm transition-colors mt-2">
              Salvar alterações
            </button>
          </motion.div>
        )}

        {activeTab === 'loyalty' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="tabpanel"
            aria-label="Fidelidade"
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-purple-900/60 to-surface-3 rounded-2xl border border-purple-700/30 text-center">
              <p className="text-6xl mb-3" aria-hidden="true">💜</p>
              <p className="text-purple-300/60 text-sm uppercase tracking-widest mb-1">Seus pontos</p>
              <p className="text-5xl font-extrabold text-white">320</p>
              <p className="text-purple-300/50 text-sm mt-2">
                Faltam <strong className="text-white">180 pontos</strong> para o próximo nível
              </p>
              <div className="mt-4 h-2 bg-purple-900/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-lime-400 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '🥉', level: 'Bronze', points: '0–499', perks: '5% de desconto' },
                { emoji: '🥈', level: 'Prata', points: '500–999', perks: '10% de desconto + frete grátis' },
                { emoji: '🥇', level: 'Ouro', points: '1000+', perks: '15% de desconto + brindes' },
              ].map(({ emoji, level, points, perks }) => (
                <div
                  key={level}
                  className={`p-4 rounded-2xl border text-center ${level === 'Bronze' ? 'border-orange-700/50 bg-orange-900/10' : 'border-purple-900/30 bg-surface-2 opacity-50'}`}
                >
                  <p className="text-3xl mb-2">{emoji}</p>
                  <p className="font-bold text-white">{level}</p>
                  <p className="text-purple-300/50 text-xs">{points} pts</p>
                  <p className="text-purple-300/70 text-xs mt-1">{perks}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
