'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock, EyeOff } from 'lucide-react';

export default function SecurityShutter({
  children,
  label = 'SECURED DATA'
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-[60px] [perspective:1000px]">
      <motion.div
        animate={{ rotateX: isOpen ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* FRONT SIDE (SHUTTER) */}
        <div
          className="absolute inset-0 z-20 bg-zinc-900 overflow-hidden shadow-xl cursor-pointer group [backface-visibility:hidden]"
          onClick={() => setIsOpen(true)}
        >
          {/* Metal Shutter Texture */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#18181b,#18181b_10px,#27272a_10px,#27272a_12px)] opacity-50" />

          {/* Hazard Border Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)]" />

          {/* Center Lock Interface */}
          <div className="absolute inset-0 flex items-center justify-between px-12">
            <div className="flex items-center gap-4">
              <div className="p-2 group-hover:border-yellow-500/50 group-hover:scale-110 transition-all duration-300">
                <Lock className="w-4 h-4 text-zinc-500 group-hover:text-yellow-500" />
              </div>
              <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] font-bold uppercase group-hover:text-zinc-300">
                SYSTEM ID: {label}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  Privacy Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE (HABIT CONTENT) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateX(180deg)]">
          {children}

          {/* Close Button (Hidden Eye) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-1/2 -translate-y-1/2 right-8 p-2 text-white hover:text-zinc-400 transition-colors z-30"
            title="Hide Tracker"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
