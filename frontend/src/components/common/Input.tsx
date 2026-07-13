import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const shakeVariants = {
      shake: {
        x: [0, -4, 4, -4, 4, 0],
        transition: { duration: 0.2 },
      },
    };

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-neutralDark-300 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-2.5 rounded-lg bg-neutralDark-950 border text-white placeholder-neutralDark-500 text-sm focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-accent-500 focus:ring-accent-500/20'
                : 'border-neutralDark-800 focus:ring-brand-500/20 focus:border-brand-500'
            } ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-neutralDark-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              key="error"
              variants={shakeVariants}
              animate="shake"
              initial={{ opacity: 0, y: -2 }}
              exit={{ opacity: 0 }}
              className="text-xs text-accent-500 font-medium"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <p key="helper" className="text-xs text-neutralDark-400">
              {helperText}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
