"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-8">
        {/* Animated Mono Dot */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-6 w-6 rounded-full bg-black shadow-[0_0_20px_rgba(0,0,0,0.05)]"
        />

        <div className="flex flex-col items-center space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500 animate-pulse"
          >
            Calibrating Collection
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-[1px] bg-neutral-200"
          />
        </div>
      </div>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_45%,_#f8f9fa_0%,_transparent_70%)]" />
      </div>
    </div>
  );
}
