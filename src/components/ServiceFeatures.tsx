"use client";

import { motion } from "framer-motion";
import { Truck, Star, ShieldCheck, Lock, Award } from "lucide-react";

const FEATURES = [
  { icon: Truck, label: "Fast Delivery", sub: "Global Logistics" },
  { icon: Star, label: "99% Positive", sub: "Guest Feedback" },
  { icon: ShieldCheck, label: "1-2 Years Warranty", sub: "On All Items" },
  { icon: Lock, label: "Secure Payment", sub: "B2B Encryption" },
  { icon: Award, label: "Best Quality", sub: "Luxury Standard" },
];

export function ServiceFeatures() {
  return (
    <section className="w-full bg-neutral-900 py-6 sm:py-10 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-12 lg:gap-8 lg:divide-x lg:divide-white/10 items-start">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center lg:items-start lg:pl-8 first:pl-0 text-center lg:text-left group"
            >
              <div className="mb-3 sm:mb-6 p-3 sm:p-4 rounded-full bg-white/5 border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <feature.icon className="w-4 h-4 sm:w-6 sm:h-6 text-inherit" strokeWidth={1.2} />
              </div>
              <h4 className="text-white text-xs sm:text-sm font-medium tracking-tight mb-1">{feature.label}</h4>
              <p className="text-white/40 text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em]">{feature.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
