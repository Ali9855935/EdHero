import { motion } from 'framer-motion';

interface BadgeProps {
  label: string;
  statusColorMap?: Record<string, string>;
  className?: string;
}

const defaultStatusColorMap: Record<string, string> = {
  // Common CRM statuses
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-neutralDark-800 text-neutralDark-400 border-neutralDark-700/60',
  new: 'bg-accent-500/10 text-accent-400 border-accent-500/20', // Cyan/Teal status accent
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  negotiation: 'bg-brand-500/10 text-brand-400 border-brand-500/20', // Violet brand primary
  qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  lost: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const Badge = ({
  label,
  statusColorMap = defaultStatusColorMap,
  className = '',
}: BadgeProps) => {
  const normalizedKey = label.toLowerCase();
  
  // Find color styles or fall back to default neutral dark outline styling
  const colorStyles = 
    statusColorMap[normalizedKey] || 
    'bg-neutralDark-800/40 text-neutralDark-300 border-neutralDark-700';

  return (
    <motion.span
      key={label}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300 ease-in-out ${colorStyles} ${className}`}
    >
      {label}
    </motion.span>
  );
};

export default Badge;
