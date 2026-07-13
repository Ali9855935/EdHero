import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  UserSquare2, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';

const NavLinkActiveHighlight = ({ itemPath }: { itemPath: string }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(itemPath);
  if (!isActive) return null;
  return (
    <motion.div
      layoutId="active-nav-highlight"
      className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-650 shadow-lg shadow-brand-500/30 border border-brand-400/30 rounded-lg"
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{ zIndex: 0 }}
    />
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  mobileSidebarOpen, 
  setMobileSidebarOpen 
}: SidebarProps) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Leads', path: '/leads', icon: Layers },
    { name: 'Customers', path: '/customers', icon: UserSquare2 },
  ];

  return (
    <aside 
      className={`fixed md:relative inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-neutralDark-900 to-neutralDark-950/90 border-r border-brand-500/10 transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'md:w-20' : 'md:w-64'
      } ${
        mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-brand-500/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-650 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/30">
            <span className="text-white font-bold text-lg">EH</span>
          </div>
          <AnimatePresence mode="wait">
            {(!isCollapsed || mobileSidebarOpen) && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8, originX: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-white text-lg tracking-tight whitespace-nowrap"
              >
                EdHero CRM
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        {/* Toggle Collapse on desktop, Close on mobile */}
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex h-6 w-6 rounded-md hover:bg-neutralDark-800 items-center justify-center text-neutralDark-400 hover:text-white transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          
          {mobileSidebarOpen && (
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="flex md:hidden h-8 w-8 rounded-md hover:bg-neutralDark-800 items-center justify-center text-neutralDark-400 hover:text-white transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)} // Auto close drawer on click mobile route
              className={
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'text-white'
                    : 'text-neutralDark-400 hover:text-white hover:bg-neutralDark-800/40'
                }`
              }
            >
              {/* Sliding active route indicator */}
              <NavLinkActiveHighlight itemPath={item.path} />

              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.12 }}
                className="flex-shrink-0 z-10"
              >
                <Icon size={20} />
              </motion.div>
              
              <AnimatePresence mode="wait">
                {(!isCollapsed || mobileSidebarOpen) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, originX: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap z-10"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isCollapsed && !mobileSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutralDark-900 border border-neutralDark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Expand Button at bottom (when collapsed on desktop) */}
      {isCollapsed && (
        <div className="hidden md:flex p-4 justify-center border-t border-neutralDark-800">
          <button
            onClick={() => setIsCollapsed(false)}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-neutralDark-800 text-neutralDark-400 hover:text-white transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
