import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/cart.store';
import { resolveAllCartItems } from '../lib/catalog';
import { useToast } from '../components/ui/Toast';
import { sanitizeNotes } from '../lib/sanitize';
import type { CheckoutFormData } from '../types';

const checkoutSchema = z
  .object({
    fullName: z.string().min(3, 'Nome muito curto').max(120).trim(),
    email: z.string().email('E-mail inválido').max(254),
    phone: z.string().min(10, 'Telefone inválido').max(20).regex(/^[\d\s()+-]+$/, 'Apenas números'),
    street: z.string().min(3, 'Endereço obrigatório').max(200).trim(),
    number: z.string().min(1, 'Número obrigatório').max(10).trim(),
    complement: z.string().max(100).optional(),
    neighborhood: z.string().min(2, 'Bairro obrigatório').max(100).trim(),
    city: z.string().min(2, 'Cidade obrigatória').max(100).trim(),
    state: z.string().length(2, 'UF deve ter 2 letras').regex(/^[A-Z]{2}$/, 'UF inválida'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    paymentMethod: z.enum(['pix', 'credit-card', 'debit-card']),
    cardNumber: z.string().optional(),
    cardHolder: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    notes: z.string().max(300).optional().transform((v) => (v ? sanitizeNotes(v) : undefined)),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== 'pix') {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Número do cartão inválido', path: ['cardNumber'] });
      }
      if (!data.cardHolder || data.cardHolder.trim().length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nome inválido', path: ['cardHolder'] });
      }
      if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Validade inválida', path: ['cardExpiry'] });
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CVV inválido', path: ['cardCvv'] });
      }
    }
  });

const STEPS = [
  { id: 1, label: 'Dados', icon: '👤' },
  { id: 2, label: 'Endereço', icon: '📍' },
  { id: 3, label: 'Pagamento', icon: '💳' },
  { id: 4, label: 'Confirmação', icon: '✅' },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-400 text-xs mt-1"
      role="alert"
    >
      {message}
    </motion.p>
  );
}

const InputField = memo(function InputField({
  label,
  error,
  className = '',
  ...props
}: { label: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        className={[
          'w-full px-4 py-3 bg-surface-3 border rounded-xl text-white text-sm placeholder-purple-400/35 outline-none transition-colors duration-150',
          error ? 'border-red-500/60 focus:border-red-400' : 'border-purple-900/40 focus:border-purple-500/70',
        ].join(' ')}
        aria-invalid={!!error}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
});

export const Checkout = memo(function Checkout() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { items, computeTotals, couponCode, clearCart, applyCoupon, removeCoupon } = useCartStore();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');

  const totals = computeTotals();
  const resolvedItems = useMemo(() => resolveAllCartItems(items), [items]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'pix' },
  });

  const paymentMethod = watch('paymentMethod');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) showToast('Cupom aplicado com sucesso!', 'success', '🎉');
    else showToast('Cupom inválido ou expirado.', 'error', '❌');
    setCouponInput('');
  };

  if (resolvedItems.length === 0 && step !== 4) {
    return (
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4" aria-hidden="true">🛒</p>
          <h1 className="text-2xl font-bold text-white mb-2">Carrinho vazio</h1>
          <p className="text-purple-300/50 mb-6 text-sm">Adicione produtos antes de finalizar.</p>
          <Link to="/menu" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm transition-colors">
            Ver Cardápio
          </Link>
        </div>
      </main>
    );
  }

  const nextStep = async () => {
    const fieldsMap: Record<number, (keyof CheckoutFormData)[]> = {
      1: ['fullName', 'email', 'phone'],
      2: ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'],
      3: ['paymentMethod'],
    };
    const valid = await trigger(fieldsMap[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const newOrderId = `UA${Math.floor(Math.random() * 90000 + 10000)}`;
    setOrderId(newOrderId);
    clearCart();
    setStep(4);
    showToast('Pedido confirmado!', 'success', '🎉');
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Finalizar Pedido</h1>

        <nav aria-label="Etapas do checkout" className="mb-10">
          <ol className="flex items-center justify-center gap-2 sm:gap-3">
            {STEPS.map(({ id, label, icon }, i) => (
              <li key={id} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                      step > id ? 'bg-lime-400 text-gray-900' :
                      step === id ? 'bg-purple-600 text-white ring-4 ring-purple-500/30' :
                      'bg-surface-3 text-purple-400/40 border border-purple-900/30',
                    ].join(' ')}
                    aria-current={step === id ? 'step' : undefined}
                  >
                    {step > id ? '✓' : icon}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === id ? 'text-purple-300' : 'text-purple-400/35'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 sm:w-14 transition-colors duration-300 ${step > id ? 'bg-lime-400/50' : 'bg-purple-900/30'}`} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4">Dados Pessoais</h2>
                    <InputField label="Nome completo" placeholder="Seu nome" error={errors.fullName?.message} {...register('fullName')} />
                    <InputField label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
                    <InputField label="Telefone" placeholder="(85) 99999-9999" error={errors.phone?.message} {...register('phone')} />
                    <div>
                      <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Observações</label>
                      <textarea
                        {...register('notes')}
                        placeholder="Instrução especial para o pedido..."
                        maxLength={300}
                        rows={2}
                        className="w-full px-4 py-3 bg-surface-3 border border-purple-900/40 focus:border-purple-500/70 rounded-xl text-white text-sm placeholder-purple-400/35 outline-none resize-none transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4">Endereço de Entrega</h2>
                    <InputField label="CEP" placeholder="60000-000" error={errors.zipCode?.message} {...register('zipCode')} />
                    <div className="grid grid-cols-3 gap-3">
                      <InputField label="Logradouro" placeholder="Rua, Av..." error={errors.street?.message} {...register('street')} className="col-span-2" />
                      <InputField label="Nº" placeholder="100" error={errors.number?.message} {...register('number')} />
                    </div>
                    <InputField label="Complemento (opcional)" placeholder="Apto, Bloco..." {...register('complement')} />
                    <InputField label="Bairro" placeholder="Aldeota" error={errors.neighborhood?.message} {...register('neighborhood')} />
                    <div className="grid grid-cols-3 gap-3">
                      <InputField label="Cidade" placeholder="Fortaleza" error={errors.city?.message} {...register('city')} className="col-span-2" />
                      <InputField label="UF" placeholder="CE" maxLength={2} error={errors.state?.message} {...register('state')} />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                    <h2 className="text-lg font-bold text-white mb-4">Pagamento</h2>

                    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Método de pagamento">
                      {([
                        { value: 'pix', label: 'Pix', emoji: '🔑' },
                        { value: 'credit-card', label: 'Crédito', emoji: '💳' },
                        { value: 'debit-card', label: 'Débito', emoji: '💳' },
                      ] as const).map(({ value, label, emoji }) => (
                        <label
                          key={value}
                          className={[
                            'flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all duration-150',
                            paymentMethod === value
                              ? 'border-purple-500 bg-purple-600/15 text-white'
                              : 'border-purple-900/30 bg-surface-3 text-purple-400/55 hover:border-purple-700/50',
                          ].join(' ')}
                        >
                          <input type="radio" value={value} {...register('paymentMethod')} className="sr-only" />
                          <span className="text-2xl" aria-hidden="true">{emoji}</span>
                          <span className="text-xs font-bold">{label}</span>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'pix' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-surface-3 rounded-2xl border border-purple-900/30 text-center"
                      >
                        <div className="w-32 h-32 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">QR Code</div>
                        </div>
                        <p className="text-white font-bold text-sm mb-0.5">Escaneie o QR Code</p>
                        <p className="text-purple-300/50 text-xs">ou copie a chave Pix abaixo</p>
                        <div className="mt-3 p-2.5 bg-surface-2 rounded-xl flex items-center justify-between gap-2">
                          <span className="text-purple-300 text-xs font-mono truncate">universodoacai@pix.com.br</span>
                          <button
                            type="button"
                            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex-shrink-0"
                            onClick={() => showToast('Chave Pix copiada!', 'info', '📋')}
                          >
                            Copiar
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <InputField label="Número do Cartão" placeholder="0000 0000 0000 0000" maxLength={19} error={errors.cardNumber?.message} {...register('cardNumber')} />
                        <InputField label="Nome no Cartão" placeholder="COMO NO CARTÃO" error={errors.cardHolder?.message} {...register('cardHolder')} />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Validade" placeholder="MM/AA" maxLength={5} error={errors.cardExpiry?.message} {...register('cardExpiry')} />
                          <InputField label="CVV" placeholder="123" maxLength={4} type="password" error={errors.cardCvv?.message} {...register('cardCvv')} />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                    role="status"
                    aria-live="assertive"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-lime-400/15 border-2 border-lime-400 rounded-full flex items-center justify-center mx-auto mb-5"
                    >
                      <span className="text-4xl" aria-hidden="true">🎉</span>
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-white mb-2">Pedido Confirmado!</h2>
                    <p className="text-purple-300/60 text-sm mb-1">
                      Pedido <strong className="text-white font-mono">#{orderId}</strong> recebido.
                    </p>
                    <p className="text-purple-300/45 text-sm mb-8">
                      Estimativa: <strong className="text-white">25–40 minutos</strong> 🛵
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to="/dashboard" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm transition-colors">
                        Ver meus pedidos
                      </Link>
                      <Link to="/" className="px-6 py-3 border border-purple-700 hover:bg-purple-900/30 rounded-xl text-purple-300 font-bold text-sm transition-colors">
                        Voltar ao início
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step < 4 && (
                <div className="flex gap-3 mt-7">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex-1 py-3 border border-purple-700 hover:bg-purple-900/30 rounded-xl text-purple-300 font-bold text-sm transition-colors"
                    >
                      ← Voltar
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm transition-colors"
                    >
                      Continuar →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processando...
                        </>
                      ) : (
                        '🔒 Confirmar Pedido'
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {step < 4 && (
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
              aria-label="Resumo do pedido"
            >
              <div className="bg-surface-2 rounded-2xl border border-purple-900/30 overflow-hidden">
                <div className="px-5 py-4 border-b border-purple-900/25">
                  <h3 className="font-bold text-white text-sm">Resumo</h3>
                </div>
                <div className="p-4 space-y-3 max-h-52 overflow-y-auto">
                  {resolvedItems.map((r) => (
                    <div key={r.cartItem.id} className="flex gap-3">
                      <img src={r.product.image} alt={r.product.name} loading="lazy" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{r.product.name}</p>
                        <p className="text-purple-300/45 text-xs">×{r.cartItem.quantity}</p>
                      </div>
                      <p className="text-white text-xs font-bold">R$ {r.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <div className="px-4 pb-4">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 bg-lime-400/10 border border-lime-500/30 rounded-xl">
                      <span className="text-lime-400 text-xs font-semibold">✓ {couponCode}</span>
                      <button type="button" onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-300">Remover</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase().slice(0, 20))}
                        placeholder="Código de cupom"
                        aria-label="Inserir cupom de desconto"
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 px-3 py-2 bg-surface-3 border border-purple-900/30 focus:border-purple-500/60 rounded-xl text-white text-xs outline-none placeholder-purple-400/40 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-2 bg-purple-700 hover:bg-purple-600 rounded-xl text-white text-xs font-semibold transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4 space-y-1.5 text-xs border-t border-purple-900/25 pt-3">
                  <div className="flex justify-between text-purple-300/55">
                    <span>Subtotal</span><span>R$ {totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.promoDiscount > 0 && (
                    <div className="flex justify-between text-lime-400 font-semibold">
                      <span>Promo 2×R$24</span><span>−R$ {totals.promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.couponDiscount > 0 && (
                    <div className="flex justify-between text-lime-400">
                      <span>Cupom</span><span>−R$ {totals.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-purple-300/55">
                    <span>Entrega</span>
                    <span className={totals.deliveryFee === 0 ? 'text-lime-400 font-semibold' : ''}>
                      {totals.deliveryFee === 0 ? 'Grátis' : `R$ ${totals.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-purple-900/25">
                    <span>Total</span><span>R$ {totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-purple-300/25">🔒 Pagamento 100% seguro</p>
            </motion.aside>
          )}
        </div>
      </div>
    </main>
  );
});
