import { SplitBasketAllocation } from '../types';
import { formatCurrency } from '../utils/basket';

interface Props {
  allocations: SplitBasketAllocation[];
}

export function SplitBasketAllocationPanel({ allocations }: Props) {
  const grouped = allocations.reduce<Record<string, SplitBasketAllocation[]>>((acc, allocation) => {
    if (!acc[allocation.store]) {
      acc[allocation.store] = [];
    }
    acc[allocation.store].push(allocation);
    return acc;
  }, {});

  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 float-in">
      <h3 className="text-base font-bold text-slate-900">Where to buy each item</h3>
      <p className="mt-1 text-xs text-slate-500">Smart split-basket allocation for maximum savings.</p>
      <div className="mt-3 space-y-3">
        {Object.entries(grouped).map(([store, items]) => (
          <div key={store} className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-3 ring-1 ring-slate-100">
            <p className="mb-2 font-semibold text-brand-700">{store}</p>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.productName}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.unitPrice)} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
