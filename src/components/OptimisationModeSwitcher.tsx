import clsx from 'clsx';

export type OptimisationMode = 'single-store' | 'max-savings';

interface Props {
  mode: OptimisationMode;
  onChange: (mode: OptimisationMode) => void;
}

export function OptimisationModeSwitcher({ mode, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-slate-100 p-1">
      <div className="grid grid-cols-2 gap-1 text-xs font-semibold">
        <button
          className={clsx(
            'rounded-xl px-3 py-2 transition',
            mode === 'single-store' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600',
          )}
          onClick={() => onChange('single-store')}
        >
          Cheapest single-store
        </button>
        <button
          className={clsx(
            'rounded-xl px-3 py-2 transition',
            mode === 'max-savings' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600',
          )}
          onClick={() => onChange('max-savings')}
        >
          Maximum savings
        </button>
      </div>
    </div>
  );
}
