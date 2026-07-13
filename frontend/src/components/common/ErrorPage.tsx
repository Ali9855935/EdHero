import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorPage = ({ 
  message = "An error occurred while fetching data from the server.", 
  onRetry 
}: ErrorPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 py-16 bg-neutralDark-900 border border-red-500/10 rounded-xl"
    >
      <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
        <AlertCircle size={24} />
      </div>

      <h3 className="text-base font-bold text-white tracking-tight">Something went wrong</h3>
      <p className="mt-2 text-sm text-neutralDark-400 max-w-sm text-center">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-6 gap-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <RefreshCw size={14} />
          Retry Request
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorPage;
