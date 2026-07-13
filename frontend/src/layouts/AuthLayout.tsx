import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutralDark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic background decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
