import { BasketStoreTotal } from '../types';
import { formatCurrency } from '../utils/basket';

interface Props {
  totals: BasketStoreTotal[];
  highlightedStore: string;
}

export function ComparisonBars({ totals, highlightedStore }: Props) {
  const max = Math.max(...totals.map((t) => t.total), 1);

  return (
    <div className="space-y-2">
      {totals.map((row) => {
        const width = (row.total / max) * 100;
        const active = row.store === highlightedStore;
        return (
          <div key={row.store} className={active ? 'rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200' : 'rounded-xl bg-slate-50 p-2'}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className={active ? 'font-bold text-brand-700' : 'font-medium text-slate-700'}>{row.store}</span>
              <span className={active ? 'font-bold text-brand-700' : 'font-semibold text-slate-900'}>{formatCurrency(row.total)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={active ? 'h-2 rounded-full bg-brand-500 transition-all duration-500 glow-pulse' : 'h-2 rounded-full bg-slate-400 transition-all duration-500'}
                style={{ width: `${Math.max(10, width)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
