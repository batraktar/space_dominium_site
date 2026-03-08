import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleOverlayProps {
  activeParticles: number[];
  onComplete: (id: number) => void;
  isVertical?: boolean;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ activeParticles, onComplete, isVertical = false }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {activeParticles.map((id) => (
          <motion.div
            key={id}
            initial={isVertical ? {
              left: '50%',
              top: '30%', // Start from upper button area
              opacity: 1,
              scale: 0.5,
              x: '-50%',
              boxShadow: "0 0 0px rgba(59, 130, 246, 0)"
            } : { 
              left: '25%', 
              top: '60%', 
              opacity: 1, 
              scale: 0.5,
              x: '0%',
              boxShadow: "0 0 0px rgba(59, 130, 246, 0)"
            }}
            animate={isVertical ? {
              left: '50%',
              top: ['30%', '50%', '80%'], // Move down to admin panel
              opacity: [1, 1, 0],
              scale: [1, 1.5, 0.5],
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.8)",
                "0 0 5px rgba(59, 130, 246, 0)"
              ]
            } : { 
              left: ['25%', '50%', '75%'],
              top: ['60%', '50%', '40%'], 
              opacity: [1, 1, 0],
              scale: [1, 1.5, 0.5],
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.8)",
                "0 0 5px rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => onComplete(id)}
            className="absolute w-4 h-4 bg-blue-500 rounded-full"
          >
            {/* Trail effect */}
            <motion.div 
              className="absolute inset-0 bg-cyan-400 rounded-full blur-sm"
              animate={{ scale: [1, 2, 1] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};