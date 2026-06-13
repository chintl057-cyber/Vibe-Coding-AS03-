import { Category, Supermarket } from '../types';
import { formatCurrency } from '../utils/basket';

export interface ProductRecommendationDetail {
  productId: string;
  productName: string;
  category: Category;
  totalCost: number;
  totalSavings: number;
}

interface Props {
  products: ProductRecommendationDetail[];
  comparisonLabel: string;
  comparisonStore?: Supermarket;
  totalSavings: number;
}

export function RecommendationExplanation({
  products,
  comparisonLabel,
  comparisonStore,
  totalSavings,
}: Props) {
  const categorySavings = Array.from(
    products.reduce((totals, product) => {
      totals.set(product.category, (totals.get(product.category) ?? 0) + product.totalSavings);
      return totals;
    }, new Map<Category, number>()),
  )
    .map(([category, savings]) => ({ category, savings }))
    .sort((a, b) => b.savings - a.savings);

  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-base font-bold text-slate-900">Why this recommendation?</h3>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">1) Product costs and savings</p>
        <div className="mt-2 space-y-2">
          {products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
            >
              <span>{product.productName}</span>
              <span className="text-right">
                <span className="font-bold">{formatCurrency(product.totalCost)}</span>
                <span className="block text-xs">
                  {product.totalSavings >= 0 ? 'Save' : 'Extra'} {formatCurrency(Math.abs(product.totalSavings))}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">2) Savings by category</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categorySavings.slice(0, 4).map((row) => (
            <div key={row.category} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p className="capitalize text-slate-600">{row.category}</p>
              <p className="font-bold text-slate-900">
                {row.savings >= 0 ? 'Save' : 'Extra'} {formatCurrency(Math.abs(row.savings))}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">
        <p className="font-semibold">3) {comparisonLabel}</p>
        <p>
          You save <span className="font-bold">{formatCurrency(totalSavings)}</span>
          {comparisonStore ? ` vs ${comparisonStore}.` : ' in total.'}
        </p>
      </div>
    </section>
  );
}
