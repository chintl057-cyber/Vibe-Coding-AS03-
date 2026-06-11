import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={clsx(
        'rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99]',
        variant === 'primary' && 'bg-brand-600 text-white shadow-soft hover:bg-brand-700',
        variant === 'secondary' && 'bg-brand-50 text-brand-700 hover:bg-brand-100',
        variant === 'ghost' && 'bg-white text-slate-700 hover:bg-slate-50',
        className,
      )}
      {...props}
    />
  );
}
