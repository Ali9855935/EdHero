import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionButton?: ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  icon, 
  actionButton 
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center p-8 py-16 bg-neutralDark-900 border border-neutralDark-800 rounded-xl"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: 'easeInOut' 
        }}
        className="h-16 w-16 rounded-2xl bg-neutralDark-800 border border-neutralDark-700 flex items-center justify-center text-neutralDark-400 mb-4"
      >
        {icon || <HelpCircle size={28} />}
      </motion.div>

      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-neutralDark-400 max-w-sm">
        {description}
      </p>

      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
