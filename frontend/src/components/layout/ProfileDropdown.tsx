import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    onClose();
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

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

          <button
            onClick={() => {
              showToast.info('Profile page coming soon!');
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutralDark-300 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer"
          >
            <User size={16} />
            Profile
          </button>

          <button
            onClick={() => {
              showToast.info('Settings page coming soon!');
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutralDark-300 hover:text-white hover:bg-neutralDark-800 transition-colors cursor-pointer"
          >
            <Settings size={16} />
            Settings
          </button>

          <div className="my-1 border-t border-neutralDark-800" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-accent-400 hover:text-accent-300 hover:bg-neutralDark-800 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
