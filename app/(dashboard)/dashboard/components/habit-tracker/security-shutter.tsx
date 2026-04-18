'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function SecurityShutter({
  children,
  label = 'SECURED DATA'
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto h-[240px] perspective-1000">
      <AnimatePresence initial={false}>
        {!isOpen ? (
          <motion.div
            key="shutter"
            initial={{ height: '100%' }}
            animate={{ height: '100%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-20 bg-zinc-900 overflow-hidden rounded-lg shadow-xl cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Metal Shutter Texture */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#18181b,#18181b_10px,#27272a_10px,#27272a_12px)] opacity-50" />
            
            {/* Hazard Border Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)]" />
            
            {/* Center Lock Interface */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-zinc-800 border-2 border-zinc-700 group-hover:border-yellow-500/50 group-hover:scale-110 transition-all duration-300">
                <Lock className="w-8 h-8 text-zinc-500 group-hover:text-yellow-500" />
              </div>
              <div className="text-center">
                <p className="text-zinc-500 font-mono text-xs tracking-[0.2em] font-bold uppercase group-hover:text-zinc-300">
                  {label}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                    Privacy Active
                  </span>
                </div>
              </div>
            </div>
            
            {/* Handle */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-zinc-800 rounded-full border border-zinc-700" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="h-full"
          >
            {children}
            
            {/* Close Button (Hidden Eye) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-2 p-2 rounded-full bg-zinc-800/50 text-zinc-500 hover:text-white transition-colors"
              title="Hide Tracker"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
