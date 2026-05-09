import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-brand-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/discovery" className="text-lg font-extrabold tracking-tight text-brand-600">
          Basketly
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          <Link to="/basket" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
            Basket
          </Link>
          <Link to="/recommendation" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
            Insights
          </Link>
          <Button variant="secondary" className="rounded-lg px-4 py-2 text-sm" onClick={() => navigate('/')}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
