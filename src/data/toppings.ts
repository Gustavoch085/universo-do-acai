import type { Topping } from '../types';

/**
 * Immutable topping catalog — source of truth for all price lookups.
 * Never mutate this array at runtime.
 */
export const ALL_TOPPINGS: ReadonlyArray<Topping> = Object.freeze([
  { id: 'granola',        name: 'Granola',               price: 1.5, emoji: '🌾', category: 'granola' },
  { id: 'granola-mel',    name: 'Granola com Mel',        price: 2.0, emoji: '🌾', category: 'granola' },
  { id: 'granola-coco',   name: 'Granola de Coco',        price: 2.0, emoji: '🥥', category: 'granola' },
  { id: 'banana',         name: 'Banana',                 price: 1.5, emoji: '🍌', category: 'fruit'   },
  { id: 'morango',        name: 'Morango Fresco',         price: 2.5, emoji: '🍓', category: 'fruit'   },
  { id: 'manga',          name: 'Manga',                  price: 2.5, emoji: '🥭', category: 'fruit'   },
  { id: 'kiwi',           name: 'Kiwi',                   price: 2.5, emoji: '🥝', category: 'fruit'   },
  { id: 'uva',            name: 'Uva sem Caroço',         price: 2.5, emoji: '🍇', category: 'fruit'   },
  { id: 'blueberry',      name: 'Blueberry',              price: 3.5, emoji: '🫐', category: 'fruit'   },
  { id: 'ninho',          name: 'Leite Ninho (pó)',       price: 2.0, emoji: '🥛', category: 'complemento' },
  { id: 'nutella',        name: 'Nutella',                price: 3.0, emoji: '🍫', category: 'complemento' },
  { id: 'ovomaltine',     name: 'Ovomaltine',             price: 2.5, emoji: '🟫', category: 'complemento' },
  { id: 'pacoca',         name: 'Paçoca',                 price: 2.0, emoji: '🟤', category: 'complemento' },
  { id: 'amendoim',       name: 'Amendoim Torrado',       price: 1.5, emoji: '🥜', category: 'complemento' },
  { id: 'castanha-caju',  name: 'Castanha de Caju',       price: 2.5, emoji: '🥜', category: 'complemento' },
  { id: 'mel',            name: 'Mel Puro',               price: 1.5, emoji: '🍯', category: 'syrup'   },
  { id: 'leite-cond',     name: 'Leite Condensado',       price: 2.0, emoji: '🥛', category: 'syrup'   },
  { id: 'calda-choco',    name: 'Calda de Chocolate',     price: 2.0, emoji: '🍫', category: 'syrup'   },
  { id: 'morango-calda',  name: 'Morango em Calda',       price: 2.5, emoji: '🍓', category: 'syrup'   },
  { id: 'coco-ralado',    name: 'Coco Ralado',            price: 1.5, emoji: '🥥', category: 'extra'   },
  { id: 'granulado',      name: 'Granulado de Chocolate', price: 1.5, emoji: '🍩', category: 'extra'   },
  { id: 'chia',           name: 'Chia',                   price: 2.0, emoji: '🌱', category: 'extra'   },
  { id: 'aveia',          name: 'Aveia em Flocos',        price: 1.5, emoji: '🌾', category: 'extra'   },
]);

export function getToppingById(id: string): Topping | undefined {
  return ALL_TOPPINGS.find((t) => t.id === id);
}
