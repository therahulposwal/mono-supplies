"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Four Seasons", src: "https://upload.wikimedia.org/wikipedia/en/a/a1/Four_Seasons_logo.svg" },
  { name: "Mandarin Oriental", src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Mandarin_Oriental_Hotel_Group_logo.svg" },
  { name: "Ritz-Carlton", src: "https://upload.wikimedia.org/wikipedia/en/a/a0/RitzCarlton.svg" },
  { name: "Aman", src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Aman_Resorts_logo.svg" },
  { name: "Rosewood", src: "https://upload.wikimedia.org/wikipedia/commons/d/db/Rosewood_hotel_resorts_logo.jpg" },
  { name: "St. Regis", src: "https://upload.wikimedia.org/wikipedia/commons/d/dc/St._Regis_Hotels_%26_Resorts_logo.svg" },
  { name: "Belmond", src: "https://upload.wikimedia.org/wikipedia/en/1/1c/Belmond_Logo.png" },
  { name: "IHG", src: "https://upload.wikimedia.org/wikipedia/commons/9/93/IHG_Hotels_%26_Resorts_logo.svg" },
  { name: "The Peninsula", src: "https://upload.wikimedia.org/wikipedia/commons/c/ce/ThePeninsulaHotelsLogo.svg" },
  { name: "Auberge", src: "https://upload.wikimedia.org/wikipedia/en/4/40/Auberge_Resorts_Logo.png" },
];

export function PrestigeMarquee() {
  // Triple the list to ensure a seamless loop
  const duplicatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-y border-neutral-100 py-3 sm:py-8 lg:py-10 overflow-hidden">
      <div className="flex flex-col items-center mb-3 sm:mb-6 lg:mb-8 px-4 text-center">
        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-neutral-600 leading-relaxed sm:leading-normal">
          <span className="block sm:inline">Trusted by properties in&#32;</span>
          <span className="block sm:inline">Paris, Tokyo, London & Dubai</span>
        </span>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-33.33%"],
          }}
          transition={{
            duration: 60,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap gap-6 sm:gap-8 lg:gap-12 items-center"
        >
          {duplicatedPartners.map((partner, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-28 sm:w-32 lg:w-44 h-10 sm:h-12 lg:h-16 flex items-center justify-center"
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="h-6 sm:h-8 lg:h-10 w-auto max-w-[80%] object-contain grayscale brightness-[0.5] opacity-60 hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all duration-700 pointer-events-none"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
