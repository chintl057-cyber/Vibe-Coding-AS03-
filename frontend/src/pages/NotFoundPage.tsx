import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-brand-700">Page not found</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">We could not find that page.</h1>
        <p className="mt-2 text-sm text-slate-600">
          The link may be incorrect or the page may have moved.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </section>
    </main>
  );
}
