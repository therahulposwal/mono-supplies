"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";

export function ConciergeFAB() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-10 right-10 z-50 flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-md group"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:block hidden" />
        <MessageSquareText className="w-5 h-5 text-white/80" />
      </div>
      <span className="text-sm font-medium tracking-tight">Speak with a Curator</span>
    </motion.button>
  );
}
