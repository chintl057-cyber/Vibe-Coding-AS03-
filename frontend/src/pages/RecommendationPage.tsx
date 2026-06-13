import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { basketApi } from '../api/basket';
import { productsApi } from '../api/products';
import type { OptimisationMode } from '../components/OptimisationModeSwitcher';
import { Button } from '../components/ui/Button';
import { useBasket } from '../contexts/BasketContext';
import { useDiscovery } from '../contexts/DiscoveryContext';
import { suburbs } from '../data/products';
import type { BasketRecommendationAnalysis, Category, Product, Supermarket } from '../types';
import { formatCurrency } from '../utils/basket';
import { getApiErrorMessage } from '../api/errors';

interface ShoppingItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ShoppingGroup {
  store: Supermarket;
  items: ShoppingItem[];
  subtotal: number;
}

interface MockStoreLocation {
  store: Supermarket;
  branchName: string;
  suburb: string;
  distanceKm: number;
}

const getMockDistance = (store: Supermarket, suburb: string) => {
  const seed = `${store}-${suburb}`.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  return Number((0.4 + (seed % 58) / 10).toFixed(1));
};

export function RecommendationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { basket, clearBasket } = useBasket();
  const { setSearch, setCategory, setExpandedId } = useDiscovery();
  const [analysis, setAnalysis] = useState<BasketRecommendationAnalysis | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mode: OptimisationMode = searchParams.get('mode') === 'max-savings' ? 'max-savings' : 'single-store';

  useEffect(() => {
    const loadAnalysis = async () => {
      if (basket.length === 0) {
        setAnalysis(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [analysisData, productData] = await Promise.all([
          basketApi.analyze(basket),
          productsApi.getAll(0, 500),
        ]);
        setAnalysis(analysisData);
        setProducts(productData);
        setError(null);
      } catch (err) {
        const message = getApiErrorMessage(err, 'We could not analyze your basket. Please try again.');
        console.error('Failed to analyze basket:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [basket]);

  const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  const categorySavings = useMemo(() => {
    if (!analysis) return [];

    const totals = new Map<Category, number>();
    basket.forEach((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) return;

      let savings: number;
      if (mode === 'single-store') {
        savings =
          (product.prices[analysis.secondCheapestStoreTotal.store] -
            product.prices[analysis.cheapestStoreTotal.store]) *
          item.quantity;
      } else {
        const allocation = analysis.splitBasket.allocations.find(
          (candidate) => candidate.productId === item.productId,
        );
        if (!allocation) return;
        savings =
          product.prices[analysis.cheapestStoreTotal.store] * item.quantity - allocation.lineTotal;
      }

      totals.set(product.category, (totals.get(product.category) ?? 0) + savings);
    });

    return Array.from(totals.entries())
      .map(([category, savings]) => ({ category, savings }))
      .sort((a, b) => b.savings - a.savings);
  }, [analysis, basket, mode, products]);

  const shoppingGroups = useMemo<ShoppingGroup[]>(() => {
    if (!analysis) return [];

    if (mode === 'single-store') {
      const store = analysis.cheapestStoreTotal.store;
      const items = basket
        .map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          if (!product) return undefined;

          const unitPrice = product.prices[store];
          return {
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice,
            lineTotal: unitPrice * item.quantity,
          };
        })
        .filter((item): item is ShoppingItem => Boolean(item));

      return [{ store, items, subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0) }];
    }

    const grouped = new Map<Supermarket, ShoppingItem[]>();
    analysis.splitBasket.allocations.forEach((allocation) => {
      const items = grouped.get(allocation.store) ?? [];
      items.push({
        productId: allocation.productId,
        productName: allocation.productName,
        quantity: allocation.quantity,
        unitPrice: allocation.unitPrice,
        lineTotal: allocation.lineTotal,
      });
      grouped.set(allocation.store, items);
    });

    return Array.from(grouped.entries()).map(([store, items]) => ({
      store,
      items,
      subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    }));
  }, [analysis, basket, mode, products]);

  const storeLocations = useMemo<MockStoreLocation[]>(() => {
    if (shoppingGroups.length === 0) return [];

    if (mode === 'single-store') {
      const store = shoppingGroups[0].store;
      const suburb = 'Melbourne CBD';
      return [{
        store,
        branchName: `${store} ${suburb}`,
        suburb,
        distanceKm: getMockDistance(store, suburb),
      }];
    }

    const splitSuburbs = suburbs.filter((suburb) => suburb !== 'Melbourne CBD');
    const offset = shoppingGroups.reduce((sum, group) => sum + group.store.length, 0) % splitSuburbs.length;

    return shoppingGroups.map((group, index) => {
      const suburb = splitSuburbs[(offset + index) % splitSuburbs.length];
      return {
        store: group.store,
        branchName: `${group.store} ${suburb}`,
        suburb,
        distanceKm: getMockDistance(group.store, suburb),
      };
    });
  }, [mode, shoppingGroups]);

  const handleRestart = () => {
    clearBasket();
    setSearch('');
    setCategory('all');
    setExpandedId(undefined);
    navigate('/discovery');
  };

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6">
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-slate-100">
          <p className="text-lg font-semibold text-slate-900">Analyzing your basket...</p>
          <p className="mt-1 text-sm text-slate-600">Preparing your shopping plan</p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl space-y-4 px-4 py-6">
        <div className="rounded-3xl bg-red-50 p-6 text-center ring-1 ring-red-100">
          <p className="text-lg font-semibold text-red-900">
            {error ? 'Could not analyze basket' : 'Your basket is empty'}
          </p>
          <p className="mt-1 text-sm text-red-700">
            {error || 'Add products before requesting a recommendation.'}
          </p>
        </div>
        <Button className="w-full" onClick={() => navigate('/basket')}>
          Back to basket
        </Button>
      </main>
    );
  }

  const isMaximumSavings = mode === 'max-savings';
  const selectedSavings = isMaximumSavings
    ? analysis.splitBasketExtraSavings
    : analysis.singleStoreSavingsVsSecond;
  const selectedTotal = isMaximumSavings ? analysis.splitBasket.totalCost : analysis.cheapestStoreTotal.total;
  const savingsComparison = isMaximumSavings
    ? `compared with shopping only at ${analysis.cheapestStoreTotal.store}`
    : `compared with ${analysis.secondCheapestStoreTotal.store}`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-4 px-4 py-6 soft-enter">
      <section className="rounded-3xl bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-5 shadow-soft ring-1 ring-emerald-100">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700">Plan summary</p>
            <h2 className="text-2xl font-bold text-slate-900">
              {isMaximumSavings ? 'Maximum savings plan' : `${analysis.cheapestStoreTotal.store} shopping plan`}
            </h2>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-xs text-slate-500">Items</p>
            <p className="text-xl font-bold text-slate-900">{itemCount}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-xs text-slate-500">Supermarkets</p>
            <p className="text-xl font-bold text-brand-700">{shoppingGroups.length}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-xs text-slate-500">Basket total</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedTotal)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h3 className="text-base font-bold text-slate-900">Shopping list</h3>
        <p className="mt-1 text-sm text-slate-600">
          {isMaximumSavings
            ? 'Buy each item from the supermarket offering its lowest price.'
            : `Buy your complete basket at ${analysis.cheapestStoreTotal.store}.`}
        </p>

        <div className="mt-4 space-y-3">
          {shoppingGroups.map((group) => (
            <div key={group.store} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-bold text-brand-700">{group.store}</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(group.subtotal)}</p>
              </div>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-700">
                      {item.productName} <span className="text-slate-500">x {item.quantity}</span>
                    </span>
                    <span className="text-right font-semibold text-slate-900">
                      {formatCurrency(item.lineTotal)}
                      <span className="block text-xs font-normal text-slate-500">
                        {formatCurrency(item.unitPrice)} each
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h3 className="text-base font-bold text-slate-900">Savings summary</h3>
        <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
          <p className="text-sm">Total savings</p>
          <p className="text-2xl font-bold">{formatCurrency(selectedSavings)}</p>
          <p className="mt-1 text-xs">{savingsComparison}.</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {categorySavings.slice(0, 4).map((category) => (
            <div key={category.category} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p className="capitalize text-slate-600">{category.category}</p>
              <p className="font-bold text-slate-900">
                {category.savings >= 0 ? 'Saved' : 'Extra'} {formatCurrency(Math.abs(category.savings))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h3 className="text-base font-bold text-slate-900">Nearest locations</h3>
        <p className="mt-1 text-xs text-slate-500">
          Mock locations and estimated distances for this prototype. No live location lookup is used.
        </p>
        <div className="mt-3 space-y-2">
          {storeLocations.map((location) => (
            <div
              key={location.store}
              className="flex items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4 text-brand-900"
            >
              <div className="flex min-w-0 items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-brand-600" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{location.branchName}</p>
                  <p className="text-xs text-brand-700">{location.suburb}</p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold">{location.distanceKm.toFixed(1)} km</p>
            </div>
          ))}
        </div>
      </section>

      <Button className="w-full" onClick={handleRestart}>
        Compare another basket
      </Button>
    </main>
  );
}
