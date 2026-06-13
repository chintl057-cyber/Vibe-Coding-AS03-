import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getCheapestStoreForProduct, getPromotionSaving, STORES } from '../utils/basket';
import { Button } from './ui/Button';

interface Props {
  product: Product;
  expanded: boolean;
  onToggleCompare: () => void;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function ProductCard({ product, expanded, onToggleCompare, quantity, onIncrease, onDecrease }: Props) {
  const best = getCheapestStoreForProduct(product);
  const maxPrice = Math.max(...STORES.map((store) => product.prices[store]));
  const savingsValue = Math.max(0, maxPrice - best.price);
  const promo = product.promotion;
  const secondaryIndicator = product.trendLabel ?? product.verificationLabel ?? 'Community verified pricing';
  const categoryColorMap: Record<Product['category'], string> = {
    dairy: 'from-sky-100 to-blue-50 text-sky-700',
    fruit: 'from-orange-100 to-rose-50 text-rose-700',
    vegetables: 'from-emerald-100 to-green-50 text-emerald-700',
    snacks: 'from-amber-100 to-yellow-50 text-amber-700',
    pantry: 'from-amber-100 to-orange-50 text-orange-700',
    drinks: 'from-cyan-100 to-teal-50 text-cyan-700',
  };

  return (
    <article className="group rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-soft float-in">
      <div className="mb-3 flex items-start gap-3">
        <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br text-3xl ${categoryColorMap[product.category]}`}>
          {product.image}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-slate-900">{product.name}</p>
          <p className="text-xs capitalize tracking-wide text-slate-500">{product.category}</p>
          <p className="mt-1 text-sm font-semibold text-brand-700">
            {formatCurrency(best.price)} at {best.store}
          </p>
          {promo?.isHalfPrice && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {promo.promotionLabel} at {promo.store} • Save {formatCurrency(getPromotionSaving(product))}
            </p>
          )}
          <p className="text-xs text-slate-400">Updated at {product.updatedAt.replace('updated ', '')}</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {savingsValue > 0 && (
          <p className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold uppercase text-emerald-800 shadow-sm">
            Save {formatCurrency(savingsValue)}
          </p>
        )}
        {promo?.isHalfPrice && (
          <p className="inline-block rounded-full bg-rose-100 px-2 py-1 text-[11px] font-bold uppercase text-rose-700 shadow-sm">
            50% OFF
          </p>
        )}
        <p className="inline-block rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
          {secondaryIndicator}
        </p>
      </div>

      {promo?.isHalfPrice && (
        <div className="mb-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-100">
          <span className="mr-2 line-through text-slate-500">{formatCurrency(promo.originalPrice)}</span>
          <span className="font-bold">{formatCurrency(promo.discountedPrice)}</span>
          <span className="ml-2 text-slate-500">{promo.endsIn ?? 'Promotion-based estimates only'}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onToggleCompare}>
          <span className="inline-flex items-center gap-1">
            Compare {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </Button>
        {quantity === 0 ? (
          <Button className="flex-1" onClick={onIncrease}>
            <span className="inline-flex items-center gap-1">
              <Plus size={16} /> Add
            </span>
          </Button>
        ) : (
          <div className="flex flex-1 items-center justify-between rounded-2xl bg-brand-50 px-2 py-1 transition-all duration-200">
            <button
              type="button"
              onClick={onDecrease}
              className="grid h-8 w-8 place-items-center rounded-xl bg-white text-brand-700 transition hover:scale-105 hover:bg-brand-100"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="rounded-full bg-white px-2 py-1 text-sm font-bold text-brand-700 shadow-sm">{quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              className="grid h-8 w-8 place-items-center rounded-xl bg-white text-brand-700 transition hover:scale-105 hover:bg-brand-100"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 transition-all duration-300">
          {STORES.map((store) => (
            <div key={store} className="rounded-xl bg-white p-2 text-xs">
              <p className="text-slate-500">{store}</p>
              <p className="font-semibold text-slate-800">{formatCurrency(product.prices[store])}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
