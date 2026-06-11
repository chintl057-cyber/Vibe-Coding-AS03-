import { Outlet, Navigate } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { authApi } from '../../api/auth';

export function AppShell() {
  const token = authApi.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
