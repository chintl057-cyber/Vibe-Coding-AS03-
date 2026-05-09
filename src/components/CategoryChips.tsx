import clsx from 'clsx';
import { Category } from '../types';

interface Props {
  categories: Category[];
  active: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

export function CategoryChips({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange('all')}
        className={clsx(
          'whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition',
          active === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600',
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={clsx(
            'whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold capitalize transition',
            active === category ? 'bg-brand-600 text-white' : 'bg-white text-slate-600',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
