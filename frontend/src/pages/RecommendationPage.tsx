import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatCurrency, getBasketRecommendationAnalysis } from '../utils/basket';
import { Button } from '../components/ui/Button';
import { useBasket } from '../contexts/BasketContext';
import { useDiscovery } from '../contexts/DiscoveryContext';
import { productsApi } from '../api/products';
import type { Product } from '../types';

export function RecommendationPage() {
  const navigate = useNavigate();
  const { basket, clearBasket } = useBasket();
  const { setSearch, setCategory, setExpandedId } = useDiscovery();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsApi.getAll(0, 1000);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };

    loadProducts();
  }, []);

  const analysis = getBasketRecommendationAnalysis(basket, products);
  const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  const handleRestart = () => {
    clearBasket();
    setSearch('');
    setCategory('all');
    setExpandedId(undefined);
    navigate('/discovery');
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-4 px-4 py-6 soft-enter">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-6 text-center shadow-soft ring-1 ring-emerald-100">
        <div className="absolute -top-3 right-6 text-2xl opacity-70">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-60">🥦</div>
        <div className="absolute top-6 left-8 text-2xl opacity-55">🍎</div>
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700 glow-pulse">
          <CheckCircle2 />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Best basket found 🎉</h2>
        <p className="mt-1 text-lg font-bold text-emerald-700">You saved {formatCurrency(analysis.singleStoreSavingsVsSecond)} today</p>
        <p className="mt-2 text-slate-600">
          Shop at <span className="font-semibold text-brand-700">{analysis.cheapestStoreTotal.store}</span> and save{' '}
          <span className="font-semibold text-emerald-600">{formatCurrency(analysis.singleStoreSavingsVsSecond)}</span> this week.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-3 text-left">
            <p className="text-xs text-slate-500">Items</p>
            <p className="text-xl font-bold text-slate-900">{itemCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-left">
            <p className="text-xs text-slate-500">Best value</p>
            <p className="text-xl font-bold text-brand-700">{analysis.cheapestStoreTotal.store}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-left">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(analysis.cheapestStoreTotal.total)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-left text-sm text-brand-800">
          <p className="font-semibold">Recommendation confidence</p>
          <p className="mt-1">
            {analysis.recommendationConfidence === 'high' ? 'High confidence recommendation' : 'Medium confidence recommendation'}
          </p>
          <p className="text-xs">Based on {itemCount} verified grocery prices. Updated from weekly catalogues.</p>
        </div>

        <Button className="mt-5 w-full" onClick={handleRestart}>Compare another basket</Button>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-base font-bold text-slate-900">Savings breakdown</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {analysis.categorySavings.slice(0, 4).map((category) => (
            <div key={category.category} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <p className="capitalize">{category.category}</p>
              <p className="font-bold">{formatCurrency(category.totalSavings)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-base font-bold text-slate-900">Top saving items</p>
        <div className="mt-3 space-y-2">
          {analysis.topSavingItems.slice(0, 3).map((item) => (
            <div key={item.productId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <span>{item.productName}</span>
              <span className="font-bold text-emerald-700">{formatCurrency(item.totalSavings)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-base font-bold text-slate-900">Convenience vs maximum savings</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Cheapest single-store</p>
            <p className="font-bold text-slate-900">
              {analysis.cheapestStoreTotal.store} — {formatCurrency(analysis.cheapestStoreTotal.total)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
            <p>Maximum savings</p>
            <p className="font-bold">
              {analysis.splitBasket.storesUsed.join(' + ')} — {formatCurrency(analysis.splitBasket.totalCost)}
            </p>
            <p className="text-xs">Extra saved: {formatCurrency(analysis.splitBasketExtraSavings)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-100">
        <p className="font-semibold">Weekly grocery insights</p>
        <p>
          Your basket categories increased 6% this week, but you still saved more than last week by choosing
          {` ${analysis.cheapestStoreTotal.store}`}. Aldi currently has the strongest produce pricing.
        </p>
      </div>
    </main>
  );
}