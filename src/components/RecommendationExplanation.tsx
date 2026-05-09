import { CategorySavingsInsight, ItemSavingsInsight, Supermarket } from '../types';
import { formatCurrency } from '../utils/basket';

interface Props {
  topItems: ItemSavingsInsight[];
  categorySavings: CategorySavingsInsight[];
  secondCheapestStore: Supermarket;
  savingsVsSecond: number;
}

export function RecommendationExplanation({
  topItems,
  categorySavings,
  secondCheapestStore,
  savingsVsSecond,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-base font-bold text-slate-900">Why this recommendation?</h3>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">1) Top saving products</p>
        <div className="mt-2 space-y-2">
          {topItems.map((item) => (
            <div key={item.productId} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              {item.productName} saves <span className="font-bold">{formatCurrency(item.totalSavings)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">2) Biggest category savings</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categorySavings.slice(0, 4).map((row) => (
            <div key={row.category} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p className="capitalize text-slate-600">{row.category}</p>
              <p className="font-bold text-slate-900">{formatCurrency(row.totalSavings)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">
        <p className="font-semibold">3) Compared to second cheapest</p>
        <p>
          You save <span className="font-bold">{formatCurrency(savingsVsSecond)}</span> vs {secondCheapestStore}.
        </p>
      </div>
    </section>
  );
}
