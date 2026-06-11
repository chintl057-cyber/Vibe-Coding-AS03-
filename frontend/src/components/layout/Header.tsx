import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { authApi } from '../../api/auth';
import type { CurrentUser } from '../../api/auth';

export function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let mounted = true;

    authApi.me()
      .then((user) => {
        if (mounted) {
          setCurrentUser(user);
        }
      })
      .catch((error) => {
        console.error('Failed to load current user:', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    authApi.logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-brand-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/discovery" className="text-lg font-extrabold tracking-tight text-brand-600">
          Basketly
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          {currentUser?.email && (
            <span className="hidden max-w-48 truncate text-sm font-medium text-slate-600 sm:inline">
              {currentUser.email}
            </span>
          )}
          <Link to="/basket" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
            Basket
          </Link>
          <Link to="/recommendation" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
            Insights
          </Link>
          <Button variant="secondary" className="rounded-lg px-4 py-2 text-sm" onClick={handleLogout}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
