import { useEffect, useMemo, useState } from 'react';
import { BasketItem, Product } from '../types';
import { formatCurrency, getBasketRecommendationAnalysis, getBasketTotalsByStore } from '../utils/basket';
import { ComparisonBars } from './ComparisonBars';
import { OptimisationMode, OptimisationModeSwitcher } from './OptimisationModeSwitcher';
import { RecommendationExplanation } from './RecommendationExplanation';
import { SplitBasketAllocationPanel } from './SplitBasketAllocation';

interface Props {
  basket: BasketItem[];
  products: Product[];
}

export function BasketSummaryPanel({ basket, products }: Props) {
  const [mode, setMode] = useState<OptimisationMode>('single-store');
  const [isSwitching, setIsSwitching] = useState(false);

  const totals = getBasketTotalsByStore(basket, products);
  const analysis = useMemo(() => getBasketRecommendationAnalysis(basket, products), [basket, products]);

  useEffect(() => {
    setIsSwitching(true);
    const timer = window.setTimeout(() => setIsSwitching(false), 240);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const isSplitEqualToSingle = analysis.splitBasketExtraSavings <= 0.001;

  return (
    <section className="space-y-3 soft-enter">
      <div className="rounded-3xl bg-gradient-to-br from-white to-emerald-50 p-4 shadow-soft ring-1 ring-emerald-100">
        <OptimisationModeSwitcher mode={mode} onChange={setMode} />
        <p className="mt-3 text-sm text-slate-500">Recommended mode</p>
        {mode === 'single-store' ? (
          <>
            <p className="text-2xl font-bold text-brand-700">{analysis.cheapestStoreTotal.store}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Save {formatCurrency(analysis.singleStoreSavingsVsSecond)} this week</p>
            <p className="text-sm text-slate-600">
              Total: <span className="font-semibold">{formatCurrency(analysis.cheapestStoreTotal.total)}</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              Shop at {analysis.cheapestStoreTotal.store} and save {formatCurrency(analysis.singleStoreSavingsVsSecond)}
              {' '}compared to {analysis.secondCheapestStoreTotal.store}.
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-brand-700">Split basket</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Maximum savings mode</p>
            <p className="text-sm text-slate-600">
              Total: <span className="font-semibold">{formatCurrency(analysis.splitBasket.totalCost)}</span>
            </p>
            {isSplitEqualToSingle ? (
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Maximum savings is the same as shopping at {analysis.cheapestStoreTotal.store} this week. No need to visit
                multiple stores.
              </p>
            ) : (
              <p className="mt-1 text-sm font-semibold text-emerald-600">
                Split across {analysis.splitBasket.storesUsed.join(', ')} to save an extra{' '}
                {formatCurrency(analysis.splitBasket.extraSavingsVsSingleStore)}.
              </p>
            )}
          </>
        )}
        <p className="mt-1 text-xs text-slate-500">{analysis.confidenceReason}</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <p className="mb-2 font-semibold text-slate-800">Basket totals by supermarket</p>

        {isSwitching ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
          </div>
        ) : (
          <ComparisonBars totals={totals} highlightedStore={analysis.cheapestStoreTotal.store} />
        )}
      </div>

      <RecommendationExplanation
        topItems={analysis.topSavingItems}
        categorySavings={analysis.categorySavings}
        secondCheapestStore={analysis.secondCheapestStoreTotal.store}
        savingsVsSecond={analysis.singleStoreSavingsVsSecond}
      />

      {mode === 'max-savings' && !isSplitEqualToSingle && (
        <SplitBasketAllocationPanel allocations={analysis.splitBasket.allocations} />
      )}

      <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
        <p className="font-semibold">Weekly insights</p>
        <p>
          Your basket categories increased 6% this week. {analysis.cheapestStoreTotal.store} currently has the
          strongest produce pricing.
        </p>
      </div>
    </section>
  );
}
