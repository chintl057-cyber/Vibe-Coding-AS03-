import {
  BasketItem,
  BasketRecommendationAnalysis,
  BasketStoreTotal,
  CategorySavingsInsight,
  ItemSavingsInsight,
  Product,
  SplitBasketAllocation,
  SplitBasketResult,
  Supermarket,
} from '../types';

export const STORES: Supermarket[] = ['Coles', 'Woolworths', 'Aldi', 'IGA'];

export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export const getCheapestStoreForProduct = (product: Product) => {
  return STORES.reduce(
    (best, store) => (product.prices[store] < best.price ? { store, price: product.prices[store] } : best),
    { store: 'Coles' as Supermarket, price: product.prices.Coles },
  );
};

export const getBasketTotalsByStore = (basket: BasketItem[], products: Product[]): BasketStoreTotal[] => {
  return STORES.map((store) => {
    const total = basket.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.prices[store] * item.quantity;
    }, 0);

    return { store, total };
  });
};

export const getCheapestBasketOption = (totals: BasketStoreTotal[]) => {
  const sorted = [...totals].sort((a, b) => a.total - b.total);
  return {
    cheapest: sorted[0],
    secondCheapest: sorted[1],
  };
};

export const getEstimatedSavings = (totals: BasketStoreTotal[]) => {
  if (totals.length < 2) return 0;
  const { cheapest, secondCheapest } = getCheapestBasketOption(totals);
  return Math.max(0, secondCheapest.total - cheapest.total);
};

const findProduct = (products: Product[], productId: string) => products.find((p) => p.id === productId);

export const getSplitBasketOptimisation = (basket: BasketItem[], products: Product[]): SplitBasketResult => {
  const allocations: SplitBasketAllocation[] = basket
    .map((item) => {
      const product = findProduct(products, item.productId);
      if (!product) return undefined;

      const cheapestForItem = getCheapestStoreForProduct(product);
      const lineTotal = cheapestForItem.price * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        store: cheapestForItem.store,
        unitPrice: cheapestForItem.price,
        quantity: item.quantity,
        lineTotal,
      };
    })
    .filter((allocation): allocation is SplitBasketAllocation => Boolean(allocation));

  const totalCost = allocations.reduce((sum, allocation) => sum + allocation.lineTotal, 0);
  const storesUsed = Array.from(new Set(allocations.map((allocation) => allocation.store)));

  return {
    totalCost,
    allocations,
    storesUsed,
    extraSavingsVsSingleStore: 0,
  };
};

export const getTopSavingItems = (
  basket: BasketItem[],
  products: Product[],
  recommendedStore: Supermarket,
  compareStore: Supermarket,
  limit = 3,
): ItemSavingsInsight[] => {
  const insights = basket
    .map((item) => {
      const product = findProduct(products, item.productId);
      if (!product) return undefined;

      const savingsPerUnit = Math.max(0, product.prices[compareStore] - product.prices[recommendedStore]);
      const totalSavings = savingsPerUnit * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        recommendedStore,
        alternativeStore: compareStore,
        savingsPerUnit,
        quantity: item.quantity,
        totalSavings,
      };
    })
    .filter((insight): insight is ItemSavingsInsight => Boolean(insight))
    .sort((a, b) => b.totalSavings - a.totalSavings);

  return insights.slice(0, limit);
};

export const getCategorySavingsBreakdown = (
  basket: BasketItem[],
  products: Product[],
  recommendedStore: Supermarket,
  compareStore: Supermarket,
): CategorySavingsInsight[] => {
  const categoryTotals = new Map<string, number>();

  basket.forEach((item) => {
    const product = findProduct(products, item.productId);
    if (!product) return;

    const savings = Math.max(0, product.prices[compareStore] - product.prices[recommendedStore]) * item.quantity;
    categoryTotals.set(product.category, (categoryTotals.get(product.category) ?? 0) + savings);
  });

  return Array.from(categoryTotals.entries())
    .map(([category, totalSavings]) => ({ category: category as CategorySavingsInsight['category'], totalSavings }))
    .sort((a, b) => b.totalSavings - a.totalSavings);
};

export const getBasketRecommendationAnalysis = (
  basket: BasketItem[],
  products: Product[],
): BasketRecommendationAnalysis => {
  const totals = getBasketTotalsByStore(basket, products);
  const { cheapest, secondCheapest } = getCheapestBasketOption(totals);
  const splitBasket = getSplitBasketOptimisation(basket, products);

  const singleStoreSavingsVsSecond = Math.max(0, secondCheapest.total - cheapest.total);
  const splitBasketExtraSavings = Math.max(0, cheapest.total - splitBasket.totalCost);
  const splitBasketWithSavings: SplitBasketResult = {
    ...splitBasket,
    extraSavingsVsSingleStore: splitBasketExtraSavings,
  };

  const topSavingItems = getTopSavingItems(basket, products, cheapest.store, secondCheapest.store, 4);
  const categorySavings = getCategorySavingsBreakdown(basket, products, cheapest.store, secondCheapest.store);

  const recommendationConfidence: BasketRecommendationAnalysis['recommendationConfidence'] =
    singleStoreSavingsVsSecond >= 3 || splitBasketExtraSavings >= 3 ? 'high' : 'medium';

  const confidenceReason =
    recommendationConfidence === 'high'
      ? `High confidence recommendation based on ${basket.length} basket items and verified local prices.`
      : `Moderate confidence recommendation based on current mock catalogue updates.`;

  return {
    cheapestStoreTotal: cheapest,
    secondCheapestStoreTotal: secondCheapest,
    singleStoreSavingsVsSecond,
    splitBasket: splitBasketWithSavings,
    splitBasketExtraSavings,
    topSavingItems,
    categorySavings,
    recommendationConfidence,
    confidenceReason,
  };
};
