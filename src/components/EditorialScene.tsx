"use client";

import { useState } from "react";
import * as motion from "framer-motion/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductDetailModal } from "@/components/ProductDetailModal";

interface Hotspot {
  id: string;
  productId: string;
  x: number; // percentage
  y: number; // percentage
  label: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "kettle",
    productId: "aaaaaaaa-0000-0000-0000-000000000003",
    x: 64.1,
    y: 58.5,
    label: "Gooseneck Kettle",
  },
  {
    id: "minibar",
    productId: "cccccccc-0000-0000-0000-000000000002",
    x: 33.8,
    y: 70.2,
    label: "Glass Minibar",
  },
  {
    id: "safe",
    productId: "dddddddd-0000-0000-0000-000000000002",
    x: 85.2,
    y: 50.5,
    label: "Biometric Safe",
  },
];

interface EditorialSceneProps {
  products: Product[];
}

export function EditorialScene({ products }: EditorialSceneProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12 mb-16 sm:mb-24 lg:mt-20 lg:mb-32">
      <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center">
        {/* Editorial Imagery (native wide-angle sharpness) */}
        <div className="w-full lg:w-3/5">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl group border border-black/5">
            <Image
              src="/editorial/room-scene-wide.png?v=3"
              alt="Luxury Hotel Suite Editorial"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/5" />

            {/* Hotspots */}
            {HOTSPOTS.map((spot) => {
              const product = getProduct(spot.productId);
              if (!product) return null;

              return (
                <Dialog key={spot.id}>
                  <div
                    className="absolute z-20"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    <DialogTrigger render={
                      <button
                        className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pulse"
                      >
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                        <div className="absolute inset-0 bg-white/40 rounded-full scale-100 group-hover/pulse:scale-125 transition-transform duration-500" />
                        <div className="relative w-3 h-3 bg-white rounded-full shadow-xl" />
                      </button>
                    } />
                  </div>
                  
                  <ProductDetailModal product={product} />
                </Dialog>
              );
            })}
          </div>
        </div>

        {/* Narrative & Context */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center text-left">
          <Badge variant="outline" className="mb-4 sm:mb-6 w-fit tracking-[0.1em] sm:tracking-[0.2em] uppercase text-[9px] sm:text-[10px] py-1 px-3 sm:px-4 rounded-full border-neutral-300">
            Contextual Editorial
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light tracking-tighter text-neutral-900 mb-4 sm:mb-8 leading-tight">
            The Living <br className="hidden sm:block"/>
            <span className="italic font-serif font-medium underline decoration-black/10 underline-offset-4 sm:underline-offset-8 ml-2 sm:ml-0">Collection.</span>
          </h2>
          <p className="text-neutral-500 font-light text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-12 text-justify">
            Luxury isn&apos;t just a spec sheet. It&apos;s how a precision gooseneck kettle rests on marble, or how a silent minibar disappears into a walnut cabinet. 
            <br className="hidden sm:block"/><br className="hidden sm:block"/>
            <span className="block mt-4 sm:mt-0 sm:inline">Explore our curated hospitality suite in its natural habitat—where invisible essentials create unforgettable guest experiences.</span>
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-[1px] w-8 sm:w-12 bg-black shrink-0" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-tight flex-1">Room 101: The Architect Series</span>
          </div>
        </div>
      </div>
    </section>
  );
}
