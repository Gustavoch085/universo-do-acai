import type { Product } from '../types';

/**
 * Immutable product catalog.
 * Images use Unsplash with WebP format parameters for performance.
 * All products reflect "Açaí Doce" — the sweet, modern style popular
 * across Fortaleza, distinct from the bitter traditional Amazonian açaí.
 */
export const PRODUCTS: ReadonlyArray<Product> = Object.freeze([

  // ─── AÇAÍ ─────────────────────────────────────────────────────────────────

  {
    id: 'p-acai-01',
    name: 'Açaí Doce na Tigela',
    description: 'O clássico que fez nossa fama. Doce, cremoso, irresistível.',
    longDescription:
      'Nossa base de açaí doce — batido com guaraná e açúcar refinado para a cremosidade perfeita — servida em tigela generosa. O favorito absoluto das nossas 4 lojas em Fortaleza. Personalize com os adicionais da sua escolha.',
    price: 14.0,
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1590301157284-5a0b6e5d8a91?w=600&fm=webp&q=80',
    badge: 'bestseller',
    rating: 4.9,
    reviewCount: 1840,
    availableToppingIds: [
      'granola', 'granola-mel', 'granola-coco',
      'banana', 'morango', 'uva',
      'ninho', 'pacoca', 'amendoim',
      'mel', 'leite-cond', 'calda-choco',
      'coco-ralado', 'granulado', 'chia',
    ],
    defaultToppingIds: ['granola-mel', 'banana', 'leite-cond'],
    nutritionalInfo: { calories: 340, protein: 4, carbs: 62, fat: 9, fiber: 5 },
    tags: ['açaí doce', 'clássico', 'cremoso'],
    inStock: true,
    preparationTime: 5,
    promoEligible: true,
  },

  {
    id: 'p-acai-02',
    name: 'Açaí com Ninho',
    description: 'Açaí doce coberto com leite Ninho em pó. Vício garantido.',
    longDescription:
      'A combinação que tomou conta de Fortaleza. Nossa base de açaí doce recebe uma camada generosa de leite Ninho em pó, criando um contraste de sabores que vicia na primeira colherada. Granola crocante e banana completam.',
    price: 16.0,
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&fm=webp&q=80',
    badge: 'bestseller',
    rating: 4.9,
    reviewCount: 2210,
    availableToppingIds: [
      'granola', 'granola-mel', 'ninho',
      'banana', 'morango', 'uva',
      'mel', 'leite-cond', 'calda-choco',
      'coco-ralado', 'granulado',
    ],
    defaultToppingIds: ['granola-mel', 'ninho', 'banana'],
    nutritionalInfo: { calories: 390, protein: 7, carbs: 68, fat: 11, fiber: 4 },
    tags: ['açaí doce', 'ninho', 'favorito'],
    inStock: true,
    preparationTime: 5,
    promoEligible: true,
  },

  {
    id: 'p-acai-03',
    name: 'Açaí com Nutella',
    description: 'Açaí doce com Nutella derretida por cima. Pecado delicioso.',
    longDescription:
      'Quem disse que não dá pra melhorar o açaí? A Nutella aquecida escorregando sobre a base gelada cria uma experiência sensorial única. Um dos nossos sabores mais fotografados e pedidos.',
    price: 17.0,
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1567196964734-e9b92cc10043?w=600&fm=webp&q=80',
    badge: 'new',
    rating: 4.8,
    reviewCount: 934,
    availableToppingIds: [
      'granola', 'granola-mel', 'granola-coco',
      'banana', 'morango', 'nutella',
      'calda-choco', 'leite-cond', 'granulado',
    ],
    defaultToppingIds: ['granola', 'nutella', 'banana'],
    nutritionalInfo: { calories: 450, protein: 5, carbs: 72, fat: 18, fiber: 4 },
    tags: ['açaí doce', 'nutella', 'indulgente'],
    inStock: true,
    preparationTime: 6,
    promoEligible: true,
  },

  {
    id: 'p-acai-04',
    name: 'Açaí com Ovomaltine',
    description: 'Base de açaí doce com Ovomaltine crocante. Textura incrível.',
    longDescription:
      'O Ovomaltine adiciona crocância e sabor maltado que eleva nosso açaí doce a outro nível. A combinação de temperaturas — açaí gelado + granulado levemente aquecido — é simplesmente perfeita.',
    price: 16.0,
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&fm=webp&q=80',
    rating: 4.7,
    reviewCount: 756,
    availableToppingIds: [
      'granola', 'granola-mel', 'ovomaltine',
      'banana', 'morango',
      'leite-cond', 'calda-choco', 'granulado',
    ],
    defaultToppingIds: ['granola', 'ovomaltine', 'leite-cond'],
    nutritionalInfo: { calories: 410, protein: 5, carbs: 70, fat: 13, fiber: 4 },
    tags: ['açaí doce', 'ovomaltine', 'crocante'],
    inStock: true,
    preparationTime: 5,
    promoEligible: true,
  },

  {
    id: 'p-acai-05',
    name: 'Açaí Especial da Casa',
    description: 'Nossa receita exclusiva. Tudo que é bom em uma tigela só.',
    longDescription:
      'Desenvolvida pelo nosso time após meses de testes, a versão Especial combina ninho, nutella, granola mel e morango fresco. É a pedida de quem quer experimentar o melhor que o Universo do Açaí tem a oferecer.',
    price: 19.0,
    originalPrice: 22.0,
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&fm=webp&q=80',
    badge: 'hot',
    rating: 4.9,
    reviewCount: 1123,
    availableToppingIds: [
      'granola-mel', 'granola-coco', 'ninho', 'nutella', 'ovomaltine',
      'banana', 'morango', 'uva', 'blueberry',
      'leite-cond', 'calda-choco', 'morango-calda',
      'coco-ralado', 'granulado',
    ],
    defaultToppingIds: ['granola-mel', 'ninho', 'nutella', 'morango'],
    nutritionalInfo: { calories: 520, protein: 8, carbs: 82, fat: 22, fiber: 5 },
    tags: ['açaí doce', 'especial', 'premium', 'exclusivo'],
    inStock: true,
    preparationTime: 7,
    promoEligible: false,
  },

  // ─── CREME DE NINHO ───────────────────────────────────────────────────────

  {
    id: 'p-ninho-01',
    name: 'Creme de Ninho Tradicional',
    description: 'Creme aveludado de leite Ninho. Puro conforto em tigela.',
    longDescription:
      'Para quem prefere um sabor mais suave e lácteo. Nosso creme de ninho é preparado com leite integral Nestlé Ninho, creme de leite e leite condensado, resultando em uma consistência absolutamente sedosa.',
    price: 14.0,
    category: 'creme-de-ninho',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb24e?w=600&fm=webp&q=80',
    badge: 'bestseller',
    rating: 4.8,
    reviewCount: 1340,
    availableToppingIds: [
      'granola', 'granola-mel', 'granola-coco',
      'banana', 'morango', 'uva', 'kiwi',
      'pacoca', 'amendoim',
      'mel', 'calda-choco', 'morango-calda',
      'coco-ralado', 'granulado',
    ],
    defaultToppingIds: ['granola-mel', 'banana', 'mel'],
    nutritionalInfo: { calories: 360, protein: 8, carbs: 58, fat: 12, fiber: 2 },
    tags: ['creme de ninho', 'lácteo', 'suave'],
    inStock: true,
    preparationTime: 4,
    promoEligible: false,
  },

  {
    id: 'p-ninho-02',
    name: 'Creme de Ninho com Morango',
    description: 'O casal perfeito: ninho cremoso + morango fresquinho.',
    longDescription:
      'A acidez natural do morango fresco equilibra a doçura do creme de ninho de forma magistral. Finalizado com calda de morango caseira e granola crocante. Uma combinação clássica que nunca falha.',
    price: 16.0,
    category: 'creme-de-ninho',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&fm=webp&q=80',
    badge: 'bestseller',
    rating: 4.9,
    reviewCount: 1890,
    availableToppingIds: [
      'granola', 'granola-mel',
      'morango', 'banana', 'uva',
      'morango-calda', 'mel', 'leite-cond',
      'granulado', 'coco-ralado',
    ],
    defaultToppingIds: ['granola-mel', 'morango', 'morango-calda'],
    nutritionalInfo: { calories: 380, protein: 7, carbs: 64, fat: 11, fiber: 3 },
    tags: ['creme de ninho', 'morango', 'clássico'],
    inStock: true,
    preparationTime: 5,
    promoEligible: false,
  },

  {
    id: 'p-ninho-03',
    name: 'Creme de Ninho com Nutella',
    description: 'Creme de Ninho + Nutella. Definitivamente proibido fazer dieta hoje.',
    longDescription:
      'A versão mais indulgente do nosso cardápio. Creme de ninho na base, fio generoso de Nutella aquecida, granola caramelizada e banana. Se você ama os dois, aqui eles convivem em perfeita harmonia.',
    price: 18.0,
    category: 'creme-de-ninho',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&fm=webp&q=80',
    badge: 'new',
    rating: 4.8,
    reviewCount: 672,
    availableToppingIds: [
      'granola', 'granola-mel', 'granola-coco',
      'banana', 'morango', 'nutella',
      'calda-choco', 'granulado', 'coco-ralado',
    ],
    defaultToppingIds: ['granola-mel', 'nutella', 'banana', 'granulado'],
    nutritionalInfo: { calories: 480, protein: 8, carbs: 74, fat: 20, fiber: 3 },
    tags: ['creme de ninho', 'nutella', 'premium'],
    inStock: true,
    preparationTime: 6,
    promoEligible: false,
  },

  // ─── SORVETES ─────────────────────────────────────────────────────────────

  {
    id: 'p-sorv-01',
    name: 'Sorvete de Açaí',
    description: 'Sorvete artesanal de açaí doce. Gelado do jeito certo.',
    longDescription:
      'Nosso açaí doce transformado em sorvete artesanal de textura densa e sabor intenso. Servido em casquinha crocante ou pote, com adicionais à sua escolha. A versão mais portátil da nossa estrela.',
    price: 12.0,
    category: 'sorvetes',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&fm=webp&q=80',
    badge: 'bestseller',
    rating: 4.7,
    reviewCount: 980,
    availableToppingIds: [
      'granola', 'granola-mel',
      'banana', 'morango',
      'calda-choco', 'morango-calda', 'mel',
      'granulado', 'coco-ralado',
    ],
    defaultToppingIds: ['granola', 'calda-choco'],
    nutritionalInfo: { calories: 280, protein: 3, carbs: 48, fat: 10, fiber: 3 },
    tags: ['sorvete', 'açaí', 'artesanal'],
    inStock: true,
    preparationTime: 3,
    promoEligible: false,
  },

  {
    id: 'p-sorv-02',
    name: 'Sorvete de Creme de Ninho',
    description: 'Cremoso, suave e irresistível. Sorvete artesanal de ninho.',
    longDescription:
      'O mesmo creme de ninho que faz sucesso nas nossas tigelas, agora no formato sorvete. Textura densa, sabor equilibrado e levemente adocicado. Perfeito para o calor de Fortaleza.',
    price: 12.0,
    category: 'sorvetes',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&fm=webp&q=80',
    rating: 4.6,
    reviewCount: 520,
    availableToppingIds: [
      'granola', 'granola-mel',
      'morango', 'banana', 'uva',
      'morango-calda', 'mel', 'calda-choco',
      'granulado',
    ],
    defaultToppingIds: ['granola', 'morango'],
    nutritionalInfo: { calories: 310, protein: 6, carbs: 50, fat: 11, fiber: 1 },
    tags: ['sorvete', 'ninho', 'cremoso'],
    inStock: true,
    preparationTime: 3,
    promoEligible: false,
  },

  {
    id: 'p-sorv-03',
    name: 'Combinado de Sorvetes',
    description: 'Açaí + Ninho side by side. Melhor dos dois mundos.',
    longDescription:
      'Para quem não consegue escolher: os dois sorvetes artesanais, açaí doce e creme de ninho, servidos juntos com adicionais à sua escolha. Porção generosa para comer sozinho ou dividir.',
    price: 16.0,
    category: 'sorvetes',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&fm=webp&q=80',
    badge: 'new',
    rating: 4.8,
    reviewCount: 312,
    availableToppingIds: [
      'granola', 'granola-mel',
      'banana', 'morango', 'uva',
      'calda-choco', 'morango-calda', 'leite-cond',
      'granulado', 'coco-ralado',
    ],
    defaultToppingIds: ['granola-mel', 'banana', 'calda-choco'],
    nutritionalInfo: { calories: 480, protein: 7, carbs: 78, fat: 18, fiber: 3 },
    tags: ['sorvete', 'combinado', 'açaí', 'ninho'],
    inStock: true,
    preparationTime: 4,
    promoEligible: false,
  },

  // ─── CUPUAÇU ──────────────────────────────────────────────────────────────

  {
    id: 'p-cupu-01',
    name: 'Cupuaçu na Tigela',
    description: 'O primo do açaí. Sabor único, levemente ácido e cremoso.',
    longDescription:
      'O cupuaçu é uma das frutas mais nobres da Amazônia — primo do cacau, com sabor complexo que mistura acidez e cremosidade. Para quem quer descobrir algo novo sem abrir mão da qualidade que o Universo do Açaí garante.',
    price: 15.0,
    category: 'cupuacu',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&fm=webp&q=80',
    badge: 'new',
    rating: 4.6,
    reviewCount: 287,
    availableToppingIds: [
      'granola', 'granola-mel', 'granola-coco',
      'banana', 'morango', 'coco-ralado',
      'mel', 'leite-cond',
      'chia', 'aveia',
    ],
    defaultToppingIds: ['granola-mel', 'banana', 'mel'],
    nutritionalInfo: { calories: 300, protein: 3, carbs: 56, fat: 7, fiber: 7 },
    tags: ['cupuaçu', 'amazônia', 'exótico', 'natural'],
    inStock: true,
    preparationTime: 5,
    promoEligible: false,
  },

  {
    id: 'p-cupu-02',
    name: 'Cupuaçu com Ninho',
    description: 'A acidez do cupuaçu equilibrada pela suavidade do Ninho.',
    longDescription:
      'A leveza ácida do cupuaçu encontra a cremosidade do leite Ninho em uma combinação surpreendente. A acidez natural da fruta é suavizada pelo ninho, criando um sabor equilibrado e viciante.',
    price: 17.0,
    category: 'cupuacu',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&fm=webp&q=80',
    rating: 4.7,
    reviewCount: 198,
    availableToppingIds: [
      'granola', 'granola-mel',
      'ninho', 'banana', 'morango',
      'mel', 'leite-cond', 'coco-ralado',
      'chia',
    ],
    defaultToppingIds: ['granola-mel', 'ninho', 'banana'],
    nutritionalInfo: { calories: 350, protein: 6, carbs: 62, fat: 9, fiber: 6 },
    tags: ['cupuaçu', 'ninho', 'cremoso'],
    inStock: true,
    preparationTime: 5,
    promoEligible: false,
  },
]);

export const FEATURED_PRODUCT_IDS = ['p-acai-02', 'p-acai-05', 'p-ninho-02', 'p-cupu-01'];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) =>
  FEATURED_PRODUCT_IDS.includes(p.id)
);

export const CATEGORY_LABELS: Record<string, string> = {
  acai: 'Açaí Doce',
  'creme-de-ninho': 'Creme de Ninho',
  sorvetes: 'Sorvetes',
  cupuacu: 'Cupuaçu',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  acai: 'Açaí doce batido na hora, do jeito fortalezense',
  'creme-de-ninho': 'Creme aveludado de leite Ninho com adicionais',
  sorvetes: 'Sorvetes artesanais de açaí e ninho',
  cupuacu: 'A fruta da Amazônia que vai surpreender você',
};
