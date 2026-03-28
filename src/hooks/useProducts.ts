import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { productService, type ProductFilters } from '../services/api';

interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getAll(filters);
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { products, isLoading, error, refetch: fetch };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productService
      .getFeatured()
      .then((r) => setProducts(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { products, isLoading, error };
}
