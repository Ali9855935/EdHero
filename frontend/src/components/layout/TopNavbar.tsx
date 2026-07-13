import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Bell, Search, Menu, X } from 'lucide-react';
import Badge from '../common/Badge';
import ProfileDropdown from './ProfileDropdown';

interface TopNavbarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const TopNavbar = ({ 
  mobileSidebarOpen, 
  setMobileSidebarOpen 
}: TopNavbarProps) => {
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="h-16 bg-neutralDark-900 border-b border-neutralDark-800 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0 relative">
      {/* Mobile Search Overlay Input */}
      {searchExpanded ? (
        <div className="absolute inset-x-0 inset-y-0 bg-neutralDark-900 px-4 flex items-center gap-3 z-30 animate-fade-in">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutralDark-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              autoFocus
              placeholder="Search leads, users or customers..."
              className="w-full pl-9 pr-4 py-2 bg-neutralDark-950 border border-neutralDark-800 rounded-lg text-sm text-white placeholder-neutralDark-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <button 
            onClick={() => setSearchExpanded(false)}
            className="p-2 rounded-lg text-neutralDark-400 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer"
            title="Close Search"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      {/* Main Bar Items */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-lg text-neutralDark-400 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer"
          title="Menu"
        >
          <Menu size={18} />
        </button>

        {/* Desktop inline Search Bar */}
        <div className="hidden md:block relative w-full max-w-xs lg:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutralDark-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search leads, users or customers..."
            className="w-full pl-9 pr-4 py-2 bg-neutralDark-950 border border-neutralDark-800 rounded-lg text-sm text-white placeholder-neutralDark-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Trigger Icon */}
        <button 
          onClick={() => setSearchExpanded(true)}
          className="md:hidden p-2 rounded-lg text-neutralDark-400 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-neutralDark-400 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer">
          <Bell size={18} />
          <Badge 
            label="3" 
            className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 scale-75 bg-brand-500 text-white font-bold text-[10px] border-none px-1 py-0 min-w-4 min-h-4 justify-center" 
          />
        </button>

        <div className="h-8 w-[1px] bg-neutralDark-800" />

        {/* User profile dropdown button */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-neutralDark-800 transition-colors cursor-pointer select-none"
          >
            <span className="text-sm text-neutralDark-300 font-medium hidden md:inline">
              {user?.name || 'Administrator'}
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 ring-2 ring-brand-500/30 text-white font-bold flex items-center justify-center shadow-md shadow-brand-500/10">
              {user?.name?.toUpperCase().charAt(0) || 'A'}
            </div>
          </button>

          <ProfileDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
