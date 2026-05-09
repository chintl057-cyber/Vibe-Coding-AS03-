import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppShell() {
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
