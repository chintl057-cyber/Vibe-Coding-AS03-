import client from './client';
import { BasketItem, BasketRecommendationAnalysis } from '../types';

export interface AnalyzeBasketRequest {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface SavedBasketResponse {
  basketId: number;
  items: BasketItem[];
  name: string;
}

export const basketApi = {
  analyze: async (items: BasketItem[]): Promise<BasketRecommendationAnalysis> => {
    const request: AnalyzeBasketRequest = {
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };
    const response = await client.post('/api/basket/analyze', request);
    return response.data;
  },

  get: async (): Promise<SavedBasketResponse> => {
    const response = await client.get('/api/basket/');
    return response.data;
  },

  save: async (items: BasketItem[]): Promise<SavedBasketResponse> => {
    const request: AnalyzeBasketRequest = {
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };
    const response = await client.post('/api/basket/', request);
    return response.data;
  },
};
