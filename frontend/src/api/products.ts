import client from './client';
import { Product, Supermarket } from '../types';

const MAX_PRODUCTS_PER_REQUEST = 500;
const STORE_NAMES: Supermarket[] = ['Coles', 'Woolworths', 'Aldi', 'IGA'];

const normalizeStoreName = (store: string): Supermarket | undefined => {
  const normalized = store.toLowerCase().replace(/[^a-z]/g, '');

  if (normalized === 'coles') return 'Coles';
  if (normalized === 'woolworths' || normalized === 'woolies') return 'Woolworths';
  if (normalized === 'aldi') return 'Aldi';
  if (normalized === 'iga') return 'IGA';

  return undefined;
};

const normalizeProduct = (product: Product): Product => {
  const prices = STORE_NAMES.reduce(
    (result, store) => {
      result[store] = Number.NaN;
      return result;
    },
    {} as Record<Supermarket, number>,
  );

  Object.entries(product.prices ?? {}).forEach(([store, price]) => {
    const normalizedStore = normalizeStoreName(store);
    const numericPrice = typeof price === 'number' ? price : Number(price);

    if (normalizedStore && Number.isFinite(numericPrice)) {
      prices[normalizedStore] = numericPrice;
    }
  });

  return {
    ...product,
    category: product.category?.toLowerCase() as Product['category'],
    prices,
    promotion: product.promotion
      ? {
          ...product.promotion,
          store: normalizeStoreName(product.promotion.store) ?? product.promotion.store,
        }
      : undefined,
  };
};

export const productsApi = {
  getAll: async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
    const response = await client.get('/api/products/', {
      params: { skip, limit: Math.min(limit, MAX_PRODUCTS_PER_REQUEST) },
    });
    return response.data.map(normalizeProduct);
  },

  search: async (
    query: string = '',
    category?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Product[]> => {
    const response = await client.get('/api/products/search', {
      params: { q: query, category, skip, limit: Math.min(limit, MAX_PRODUCTS_PER_REQUEST) },
    });
    return response.data.map(normalizeProduct);
  },

  getById: async (productId: string): Promise<Product> => {
    const response = await client.get(`/api/products/${productId}`);
    return normalizeProduct(response.data);
  },
};
