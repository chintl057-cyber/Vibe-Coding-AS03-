import { ReactNode } from 'react';
import { ShoppingBasket } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/Button';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-8 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>
      
      <div className="relative z-10">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-brand-100 to-emerald-100 p-6 shadow-soft">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand-700">
            <ShoppingBasket size={16} /> Basketly
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>

        <AuthCard>{children}</AuthCard>
      </div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return <section className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">{children}</section>;
}

interface AuthInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AuthInput({ type = 'text', placeholder, value, onChange, disabled }: AuthInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

export function AuthAlert({ message, tone }: { message: string; tone: 'success' | 'error' }) {
  return (
    <div
      className={clsx(
        'rounded-2xl px-3 py-2 text-sm',
        tone === 'success' && 'bg-emerald-50 text-emerald-800',
        tone === 'error' && 'bg-rose-50 text-rose-700',
      )}
    >
      {message}
    </div>
  );
}

interface AuthFooterActionProps {
  text: string;
  actionLabel: string;
  onClick: () => void;
}

export function AuthFooterAction({ text, actionLabel, onClick }: AuthFooterActionProps) {
  return (
    <p className="text-center text-sm text-slate-500">
      {text}{' '}
      <Button type="button" variant="ghost" className="px-1 py-0 text-sm text-brand-700" onClick={onClick}>
        {actionLabel}
      </Button>
    </p>
  );
}
