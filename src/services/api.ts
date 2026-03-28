import type { Product, ProductCategory, SortOption, ApiResponse, PaginatedResponse } from '../types';
import { PRODUCTS } from '../data/products';

const simulateLatency = (min = 300, max = 700): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

const simulateError = (chance = 0.015): void => {
  if (Math.random() < chance) throw new Error('Falha temporária na conexão. Tente novamente.');
};

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

function applyFilters(products: ReadonlyArray<Product>, filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.search?.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (filters.minPrice !== undefined) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) result = result.filter((p) => p.price <= filters.maxPrice!);

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => (a.badge === 'new' ? -1 : b.badge === 'new' ? 1 : 0));
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return result;
}

export const productService = {
  async getAll(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await simulateLatency(350, 650);
    simulateError();
    const filtered = applyFilters(PRODUCTS, filters);
    return { data: filtered, total: filtered.length, page: 1, limit: filtered.length, totalPages: 1 };
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    await simulateLatency(150, 400);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error(`Produto "${id}" não encontrado.`);
    return { data: product, message: 'Produto encontrado.', success: true };
  },

  async getFeatured(): Promise<ApiResponse<Product[]>> {
    await simulateLatency(300, 550);
    const featured = PRODUCTS.filter((p) => p.badge === 'bestseller' || p.rating >= 4.8).slice(0, 4);
    return { data: featured, message: 'Destaques.', success: true };
  },
};
