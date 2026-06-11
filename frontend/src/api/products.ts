import client from './client';
import { Product } from '../types';

export const productsApi = {
  getAll: async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
    const response = await client.get('/api/products', {
      params: { skip, limit },
    });
    return response.data;
  },

  search: async (
    query: string = '',
    category?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Product[]> => {
    const response = await client.get('/api/products/search', {
      params: { q: query, category, skip, limit },
    });
    return response.data;
  },

  getById: async (productId: string): Promise<Product> => {
    const response = await client.get(`/api/products/${productId}`);
    return response.data;
  },
};
