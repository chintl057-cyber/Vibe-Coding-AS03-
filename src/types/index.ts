export type Supermarket = 'Coles' | 'Woolworths' | 'Aldi' | 'IGA';

export type Category = 'dairy' | 'vegetables' | 'fruit' | 'snacks' | 'pantry' | 'drinks';

export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  prices: Record<Supermarket, number>;
  promotion?: ProductPromotion;
  updatedAt: string;
  badge?: 'price dropped' | 'special deal';
  trendLabel?: string;
  confidenceLabel?: string;
  verificationLabel?: string;
  monthlyLow?: boolean;
  priceChangePercent?: number;
}

export interface ProductPromotion {
  store: Supermarket;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  promotionLabel: string;
  isHalfPrice: boolean;
  savingAmount?: number;
  endsIn?: string;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface BasketStoreTotal {
  store: Supermarket;
  total: number;
}

export interface SplitBasketAllocation {
  productId: string;
  productName: string;
  category: Category;
  store: Supermarket;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface SplitBasketResult {
  totalCost: number;
  allocations: SplitBasketAllocation[];
  storesUsed: Supermarket[];
  extraSavingsVsSingleStore: number;
}

export interface ItemSavingsInsight {
  productId: string;
  productName: string;
  category: Category;
  recommendedStore: Supermarket;
  alternativeStore: Supermarket;
  savingsPerUnit: number;
  quantity: number;
  totalSavings: number;
}

export interface CategorySavingsInsight {
  category: Category;
  totalSavings: number;
}

export interface BasketRecommendationAnalysis {
  cheapestStoreTotal: BasketStoreTotal;
  secondCheapestStoreTotal: BasketStoreTotal;
  singleStoreSavingsVsSecond: number;
  splitBasket: SplitBasketResult;
  splitBasketExtraSavings: number;
  topSavingItems: ItemSavingsInsight[];
  categorySavings: CategorySavingsInsight[];
  recommendationConfidence: 'high' | 'medium';
  confidenceReason: string;
}
