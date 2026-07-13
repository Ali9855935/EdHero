import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Return null on login page to avoid clutter
  if (location.pathname === '/login') return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-neutralDark-400 font-medium select-none mb-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center space-x-1.5">
            <ChevronRight size={12} className="text-neutralDark-600" />
            {isLast ? (
              <span className="text-white font-semibold">{displayName}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-white transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
