import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'purple' | 'lime' | 'red' | 'yellow' | 'blue';
  size?: 'sm' | 'md';
}

const variants = {
  purple: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
  lime: 'bg-lime-900/40 text-lime-400 border border-lime-700/50',
  red: 'bg-red-900/40 text-red-400 border border-red-700/50',
  yellow: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50',
  blue: 'bg-blue-900/40 text-blue-400 border border-blue-700/50',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export function Badge({ children, variant = 'purple', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

export function ProductBadge({ badge }: { badge: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    bestseller: { label: '🔥 Mais Vendido', variant: 'red' },
    new: { label: '✨ Novo', variant: 'lime' },
    vegan: { label: '🌱 Vegano', variant: 'lime' },
    keto: { label: '💪 Keto', variant: 'blue' },
    hot: { label: '☕ Quente', variant: 'yellow' },
  };

  const { label, variant } = config[badge] ?? { label: badge, variant: 'purple' };
  return <Badge variant={variant}>{label}</Badge>;
}
