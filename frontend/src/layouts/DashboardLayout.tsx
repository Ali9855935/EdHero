import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import AmbientBackground from '../components/common/AmbientBackground';

export const DashboardLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Monitor viewport size to collapse sidebar on tablet and below by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      
      // Auto close mobile drawer when resizing back to larger screen
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    
    handleResize(); // Set initial value on load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-neutralDark-950 text-neutralDark-100 overflow-hidden relative">
      {/* Ambient floating background dots/shapes */}
      <AmbientBackground />

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-neutralDark-950/60 backdrop-blur-sm z-30 transition-opacity md:hidden"
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        {/* Top Header */}
        <TopNavbar 
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Outlet View (Routed Panels) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 relative bg-transparent z-10">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
