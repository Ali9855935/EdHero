import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const shouldReduceMotion = useReducedMotion();


  const variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 6,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.18,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -6,
      transition: {
        duration: 0.15,
        ease: [0.55, 0.055, 0.675, 0.19], // easeInCubic
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
