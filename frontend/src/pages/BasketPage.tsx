import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BasketSummaryPanel } from '../components/BasketSummaryPanel';
import { EmptyBasketState } from '../components/EmptyBasketState';
import type { OptimisationMode } from '../components/OptimisationModeSwitcher';
import { Button } from '../components/ui/Button';
import { useBasket } from '../contexts/BasketContext';
import { productsApi } from '../api/products';
import type { Product } from '../types';

export function BasketPage() {
  const navigate = useNavigate();
  const { basket, isLoading: basketLoading } = useBasket();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [mode, setMode] = useState<OptimisationMode>('single-store');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await productsApi.getAll(0, 1000);
        setProducts(data);
        setProductsError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        console.error('Failed to load products:', err);
        setProductsError(message);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const selected = basket
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((item): item is typeof item & { product: Product } => Boolean(item.product));

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Basket optimisation</h2>
        <Button variant="ghost" onClick={() => navigate('/discovery')}>Back</Button>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="mb-2 font-semibold text-slate-800">Your items</p>
        {basketLoading || productsLoading ? (
          <p className="text-sm text-slate-500">Loading your saved basket...</p>
        ) : productsError ? (
          <p className="text-sm text-red-600">{productsError}</p>
        ) : selected.length === 0 ? (
          <p className="text-sm text-slate-500">No items yet.</p>
        ) : (
          <div className="space-y-2">
            {selected.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span>{item.product.name}</span>
                <span className="font-semibold">Qty {item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {!basketLoading && !productsLoading && !productsError && (
        selected.length === 0 ? (
          <EmptyBasketState />
        ) : (
          <BasketSummaryPanel basket={basket} products={products} mode={mode} onModeChange={setMode} />
        )
      )}

      <Button
        className="w-full"
        onClick={() => navigate(`/recommendation?mode=${mode}`)}
        disabled={basketLoading || productsLoading || Boolean(productsError) || selected.length === 0}
      >
        Get recommendation
      </Button>
    </main>
  );
}
