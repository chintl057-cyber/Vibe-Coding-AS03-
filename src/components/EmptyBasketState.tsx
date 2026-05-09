import { ShoppingBasket } from 'lucide-react';

export function EmptyBasketState() {
  return (
    <section className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
      <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-700">
        <ShoppingBasket size={22} />
      </div>
      <p className="text-lg font-semibold text-slate-900">Your basket is empty</p>
      <p className="mt-1 text-sm text-slate-500">
        Add products to compare grocery costs across stores and unlock Basketly optimisation.
      </p>
    </section>
  );
}
