import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy Feature Views
const Login = lazy(() => import('./features/auth/Login'));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./features/auth/ResetPassword'));
const DashboardView = lazy(() => import('./features/dashboard/DashboardView'));
const UserList = lazy(() => import('./features/users/UserList'));
const UserDetails = lazy(() => import('./features/users/UserDetails'));
const LeadList = lazy(() => import('./features/leads/LeadList'));
const LeadDetails = lazy(() => import('./features/leads/LeadDetails'));
const CustomerList = lazy(() => import('./features/customers/CustomerList'));
const CustomerDetails = lazy(() => import('./features/customers/CustomerDetails'));

function App() {
  const location = useLocation();

  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-neutralDark-950">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-500 border-r-2 border-transparent" />
    </div>
  );

  return (
    <>
      {/* Modern Toast Notification Container */}
      <Toaster 
        position="top-right" 
        theme="dark" 
        closeButton 
        richColors 
        expand={false}
      />

      {/* Main Routes with wait mode for smooth exit animations */}
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected Admin CRM Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/leads" element={<LeadList />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
            </Route>

            {/* Catch-all Routing */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
