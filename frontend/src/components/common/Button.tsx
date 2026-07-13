import { motion, useReducedMotion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  const shouldReduceMotion = useReducedMotion();
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';
  
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-brand-600 to-purple-650 hover:from-brand-500 hover:to-purple-550 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 focus:ring-brand-500/20 border border-brand-700/50',
    secondary: 'bg-neutralDark-800 hover:bg-neutralDark-700 text-neutralDark-100 hover:text-white border border-neutralDark-700 focus:ring-neutralDark-700/40',
    danger: 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/10 hover:shadow-accent-500/20 focus:ring-accent-500/20 border border-accent-600',
    ghost: 'bg-transparent hover:bg-neutralDark-800 text-neutralDark-300 hover:text-white border border-transparent focus:ring-neutralDark-800/45',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const isDisabled = disabled || loading;
  
  const hoverAnimation = shouldReduceMotion || isDisabled ? {} : { scale: 1.02, y: -0.5 };
  const tapAnimation = shouldReduceMotion || isDisabled ? {} : { scale: 0.98, y: 0 };

  return (
    <motion.button
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
