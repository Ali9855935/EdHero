import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import showToast from '../common/Toast';
import { User, Settings, LogOut } from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleLogout = () => {
    onClose();
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: <User size={16} />,
      action: () => {
        showToast.info('Profile page coming soon!');
        onClose();
      },
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      action: () => {
        showToast.info('Settings page coming soon!');
        onClose();
      },
    },
    {
      label: 'Logout',
      icon: <LogOut size={16} />,
      action: handleLogout,
      className: 'text-accent-400 hover:text-accent-300 hover:bg-neutralDark-800',
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          e.preventDefault();
          break;
        case 'ArrowDown':
          setFocusedIndex((prev) => (prev + 1 < menuItems.length ? prev + 1 : 0));
          e.preventDefault();
          break;
        case 'ArrowUp':
          setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : menuItems.length - 1));
          e.preventDefault();
          break;
        case 'Enter':
          if (focusedIndex >= 0 && menuItems[focusedIndex]) {
            menuItems[focusedIndex].action();
            e.preventDefault();
          }
          break;
        case 'Tab':
          // Close dropdown when focus leaves
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex]);

  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -8,
      transition: {
        duration: 0.1,
        ease: 'easeIn',
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute right-0 mt-2 w-48 rounded-xl bg-neutralDark-900 border border-brand-500/20 shadow-2xl shadow-brand-500/5 py-1.5 z-50 text-left origin-top-right"
        >
          <div className="px-4 py-2 border-b border-neutralDark-800">
            <p className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider">Account</p>
          </div>

          <div className="py-1">
            {menuItems.map((item, index) => {
              const isFocused = index === focusedIndex;
              return (
                <div key={item.label}>
                  {index === 2 && <div className="my-1 border-t border-neutralDark-800" />}
                  <button
                    onClick={item.action}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors cursor-pointer text-left ${
                      isFocused
                        ? 'bg-neutralDark-800 text-white font-medium'
                        : item.className || 'text-neutralDark-300 hover:text-white hover:bg-neutralDark-800'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
