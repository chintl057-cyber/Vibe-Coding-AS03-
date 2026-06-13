import { Outlet, Navigate } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { authApi } from '../../api/auth';
import { useBasket } from '../../contexts/BasketContext';

export function AppShell() {
  const token = authApi.getToken();
  const { syncError } = useBasket();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      {syncError && (
        <div className="mx-auto mt-3 max-w-7xl rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          {syncError}
        </div>
      )}
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
