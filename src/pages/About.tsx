import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BRANCHES = [
  { name: 'Aldeota', address: 'Av. Santos Dumont, 1420', hours: '12h–23h' },
  { name: 'Meireles', address: 'R. dos Tabajaras, 680', hours: '12h–23h' },
  { name: 'Messejana', address: 'Av. Frei Cirilo, 840', hours: '13h–22h' },
  { name: 'Maracanaú', address: 'Av. Bezerra de Menezes, 310', hours: '13h–22h' },
];

const TIMELINE = [
  { year: '2019', title: 'O começo', desc: 'Abrimos nossa primeira loja na Aldeota com apenas 6 produtos no cardápio e um sonho grande.' },
  { year: '2020', title: 'Resistência', desc: 'Em tempos difíceis, investimos no delivery. A qualidade falou mais alto e crescemos 40%.' },
  { year: '2021', title: 'Segunda unidade', desc: 'O sucesso no Meireles confirmou que o fortalezense tinha fome do nosso açaí doce.' },
  { year: '2023', title: 'Expansão', desc: 'Messejana e Maracanaú. Fortaleza inteira agora tem o Universo do Açaí perto de casa.' },
  { year: '2025', title: 'Nosso melhor ano', desc: 'Cardápio renovado, novo app, e a prova de que açaí doce é amor em tigela.' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const About = memo(function About() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" aria-label="Nossa história">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Desde 2019 — Fortaleza, CE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            O açaí doce que{' '}
            <span className="gradient-text">Fortaleza ama.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-purple-300/65 text-lg leading-relaxed"
          >
            Nascemos em 2019 com uma missão simples: entregar o melhor açaí doce de Fortaleza.
            Hoje, com 4 lojas espalhadas pela cidade, somos parte do dia a dia de milhares de famílias cearenses.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="mission-heading">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1590301157284-5a0b6e5d8a91?w=700&fm=webp&q=80"
                alt="Bowl de açaí doce do Universo do Açaí"
                loading="lazy"
                className="w-full h-80 object-cover rounded-3xl"
              />
              <div className="absolute -bottom-5 -right-5 w-36 h-36 bg-surface-3 rounded-3xl border border-purple-900/30 p-4 flex flex-col items-center justify-center text-center shadow-2xl">
                <span className="text-3xl font-extrabold text-white">4</span>
                <span className="text-purple-300/55 text-xs mt-1">lojas em Fortaleza</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="space-y-5"
          >
            <h2 id="mission-heading" className="text-3xl font-extrabold text-white">
              Açaí Doce, do Jeito Certo
            </h2>
            <p className="text-purple-300/65 leading-relaxed">
              O Universo do Açaí serve açaí doce — batido com guaraná, na consistência cremosa e
              gelada que o fortalezense aprendeu a amar. Não é o açaí amargo da selva;
              é o açaí da memória afetiva, da tarde com a família, do lanche depois do banho de mar.
            </p>
            <p className="text-purple-300/65 leading-relaxed">
              Cada tigela é montada na hora, com adicionais frescos e de qualidade.
              Do primeiro ao último ingrediente, sabemos exatamente o que estamos servindo.
              Isso explica por que, desde 2019, nossos clientes voltam — e trazem a família.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { value: '6+', label: 'Anos em Fortaleza', emoji: '🏙️' },
                { value: '4', label: 'Unidades abertas', emoji: '📍' },
                { value: '50k+', label: 'Clientes atendidos', emoji: '😊' },
                { value: '4.8★', label: 'Média de avaliações', emoji: '⭐' },
              ].map(({ value, label, emoji }) => (
                <div key={label} className="p-4 bg-surface-2 rounded-2xl border border-purple-900/30">
                  <p className="text-purple-400 text-xl mb-0.5" aria-hidden="true">{emoji}</p>
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-xs text-purple-300/45 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface-2 py-16" aria-labelledby="timeline-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 id="timeline-heading" className="text-3xl font-extrabold text-white text-center mb-12">
            Nossa Trajetória
          </h2>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-purple-600 via-purple-700 to-transparent" aria-hidden="true" />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-8"
            >
              {TIMELINE.map(({ year, title, desc }) => (
                <motion.div key={year} variants={itemVariants} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-purple-900/60 border border-purple-700/40 flex items-center justify-center text-purple-300 font-bold text-xs shadow-lg">
                    {year}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="font-bold text-white text-lg">{title}</h3>
                    <p className="text-purple-300/55 text-sm mt-1 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="branches-heading">
        <div className="text-center mb-10">
          <h2 id="branches-heading" className="text-3xl font-extrabold text-white mb-2">
            Nossas 4 Lojas
          </h2>
          <p className="text-purple-300/55">Estamos perto de você em Fortaleza.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES.map(({ name, address, hours }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="p-5 bg-surface-2 rounded-2xl border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300"
            >
              <div className="text-3xl mb-3" aria-hidden="true">📍</div>
              <h3 className="font-bold text-white text-lg mb-1">Unidade {name}</h3>
              <p className="text-purple-300/55 text-xs leading-relaxed mb-2">{address}</p>
              <p className="text-purple-400 text-xs font-semibold">🕐 {hours}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-3xl bg-surface-2 border border-purple-900/30"
        >
          <p className="text-5xl mb-4" aria-hidden="true">💜</p>
          <h2 className="text-2xl font-extrabold text-white mb-3">Faça parte da nossa família</h2>
          <p className="text-purple-300/55 mb-6 max-w-md mx-auto text-sm">
            Mais de 50 mil fortalezenses já descobriram o universo do açaí doce. Você vai ser o próximo.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-purple-900/50 transition-all duration-200 active:scale-95"
          >
            Ver o Cardápio 🍨
          </Link>
        </motion.div>
      </section>
    </main>
  );
});
