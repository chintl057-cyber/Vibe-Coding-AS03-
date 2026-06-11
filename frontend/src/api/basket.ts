import client from './client';
import { BasketItem, BasketRecommendationAnalysis } from '../types';

export interface AnalyzeBasketRequest {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
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
    
    // Transform response to match frontend types (convert snake_case to camelCase)
    return {
      cheapestStoreTotal: {
        store: response.data.cheapest_store_total.store,
        total: response.data.cheapest_store_total.total,
      },
      secondCheapestStoreTotal: {
        store: response.data.second_cheapest_store_total.store,
        total: response.data.second_cheapest_store_total.total,
      },
      singleStoreSavingsVsSecond: response.data.single_store_savings_vs_second,
      splitBasket: response.data.split_basket,
      splitBasketExtraSavings: response.data.split_basket_extra_savings,
      topSavingItems: response.data.top_saving_items,
      categorySavings: response.data.category_savings,
      recommendationConfidence: response.data.recommendation_confidence,
      confidenceReason: response.data.confidence_reason,
    };
  },

  get: async (): Promise<{ basket_id: number; items: BasketItem[]; name: string }> => {
    const response = await client.get('/api/basket');
    return response.data;
  },

  save: async (items: BasketItem[]): Promise<{ basket_id: number; items: BasketItem[]; name: string }> => {
    const request: AnalyzeBasketRequest = {
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };
    const response = await client.post('/api/basket', request);
    return response.data;
  },
};
