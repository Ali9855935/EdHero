import { motion } from 'framer-motion';
import { Sparkles, Circle } from 'lucide-react';

export const AmbientBackground = () => {
  // Define 8 fixed particles with coordinates, sizes, float speeds, and offsets
  const particles = [
    { id: 1, icon: Sparkles, size: 22, top: '12%', left: '8%', duration: 7, delay: 0 },
    { id: 2, icon: Circle, size: 10, top: '22%', left: '88%', duration: 9, delay: 1 },
    { id: 3, icon: Sparkles, size: 16, top: '78%', left: '12%', duration: 8, delay: 2 },
    { id: 4, icon: Circle, size: 6, top: '62%', left: '82%', duration: 6, delay: 0.5 },
    { id: 5, icon: Sparkles, size: 18, top: '35%', left: '55%', duration: 10, delay: 1.5 },
    { id: 6, icon: Circle, size: 8, top: '82%', left: '72%', duration: 7, delay: 2.5 },
    { id: 7, icon: Sparkles, size: 14, top: '8%', left: '78%', duration: 8, delay: 0.2 },
    { id: 8, icon: Circle, size: 5, top: '88%', left: '32%', duration: 9, delay: 1.2 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {particles.map((p) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.id}
            className="absolute text-brand-500/10 filter blur-[1px]"
            style={{
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.08, 0.22, 0.08],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={p.size} className="text-brand-400" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default AmbientBackground;
