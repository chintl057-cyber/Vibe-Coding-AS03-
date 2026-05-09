import { useNavigate } from 'react-router-dom';
import { BasketSummaryPanel } from '../components/BasketSummaryPanel';
import { EmptyBasketState } from '../components/EmptyBasketState';
import { Button } from '../components/ui/Button';
import { useBasket } from '../contexts/BasketContext';
import { products } from '../data/products';

export function BasketPage() {
  const navigate = useNavigate();
  const { basket } = useBasket();

  const selected = basket
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((item): item is typeof item & { product: typeof products[0] } => Boolean(item.product));

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Basket optimisation</h2>
        <Button variant="ghost" onClick={() => navigate('/discovery')}>Back</Button>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="mb-2 font-semibold text-slate-800">Your items</p>
        {selected.length === 0 ? (
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

      {selected.length === 0 ? <EmptyBasketState /> : <BasketSummaryPanel basket={basket} products={products} />}

      <Button className="w-full" onClick={() => navigate('/recommendation')} disabled={selected.length === 0}>
        Get recommendation
      </Button>
    </main>
  );
}
