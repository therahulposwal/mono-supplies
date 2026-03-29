"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRequisition } from "@/context/RequisitionContext";
import { cn } from "@/lib/utils";
import { Plus, Minus, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import type { PricingTier, Product } from "@/lib/types";

export type { PricingTier };

interface ProductCardProps {
  id: string;
  name: string;
  shortDescription: string;
  fullSpecifications: Record<string, string>;
  images: string[];
  pricingTiers: PricingTier[];
}

export function ProductCard(props: ProductCardProps) {
  const { id, name, shortDescription, images, pricingTiers } = props;
  const { addItem, items } = useRequisition();
  const [isAdded, setIsAdded] = useState(false);
  const [hoverImageIndex, setHoverImageIndex] = useState(0);
  const [hoverInterval, setHoverInterval] = useState<NodeJS.Timeout | null>(null);

  const cartItem = items.find((item) => item.id === id);

  const handleMouseEnter = () => {
    // Disable slideshow on mobile for a cleaner touch experience
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;

    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setHoverImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
      setHoverInterval(interval);
    }
  };

  const handleMouseLeave = () => {
    if (hoverInterval) {
      clearInterval(hoverInterval);
      setHoverInterval(null);
    }
    setHoverImageIndex(0);
  };

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addItem(props);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Base price logic remains same
  const sortedTiers = [...(pricingTiers || [])].sort((a, b) => a.minQty - b.minQty);
  const basePrice = sortedTiers.length > 0 ? sortedTiers[0].unitPrice : 0;
  const bestPrice = sortedTiers.length > 1 ? sortedTiers[sortedTiers.length - 1].unitPrice : null;

  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <Card 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group flex flex-col h-full overflow-hidden bg-white border-neutral-200 shadow-sm transition-all hover:border-neutral-300 hover:shadow-2xl rounded pt-0 cursor-default"
        >
          <DialogTrigger render={
            <motion.button 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              type="button" 
              className="relative w-full aspect-[4/3] lg:aspect-square overflow-hidden bg-neutral-100 cursor-pointer block p-0 border-none group-hover:shadow-inner"
            >
              {images && images.map((img, idx) => (
                <Image
                  key={idx}
                  src={`${img}?v=2`}
                  alt={`${name} view ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-opacity duration-1000",
                    hoverImageIndex === idx ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              
              {/* Progress Indicators for Hover Cycling */}
              {images && images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        hoverImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              )}

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdd();
                }}
                className={cn(
                  "hidden lg:flex absolute top-4 right-4 h-10 w-10 backdrop-blur-sm rounded-full items-center justify-center shadow-lg transform transition-all duration-300 z-20 hover:scale-110 cursor-pointer",
                  isAdded 
                    ? "bg-white text-neutral-900 opacity-100 translate-y-0" 
                    : "bg-white/90 text-neutral-900 opacity-100 translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 hover:bg-black hover:text-white"
                )}
                title="Add to Requisition"
              >
                {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
            </motion.button>
          } />
          <CardHeader className="p-3 sm:p-5 h-24 sm:h-28 flex flex-col justify-start pb-0">
            <CardTitle className="text-sm sm:text-xl font-medium tracking-tight text-neutral-900 line-clamp-2 sm:line-clamp-1 leading-snug">
              {name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 sm:mt-2 text-neutral-500 line-clamp-2 overflow-hidden">
              {shortDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-5 pb-0 flex-grow">
            {basePrice > 0 ? (
              <div className="mt-2 sm:mt-3 flex justify-between items-end">
                <div className="space-y-0.5 sm:space-y-1 block">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-0 sm:mb-0.5">
                    Starting At
                  </span>
                  <div className="flex items-baseline gap-1 text-lg sm:text-3xl font-medium text-neutral-900 tracking-tight">
                    ${basePrice.toFixed(2)}
                    <span className="text-[10px] sm:text-sm font-medium text-neutral-500 tracking-normal lowercase">/unit</span>
                  </div>
                  {bestPrice && (
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 py-0.5 px-1.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20 whitespace-nowrap">
                      <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-[#B8860B]">Best Price</span>
                      <span className="text-[9px] sm:text-xs font-semibold text-neutral-900">
                        ${bestPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd();
                  }}
                  className={cn(
                    "flex lg:hidden shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full items-center justify-center shadow-md transform transition-all duration-300 z-20 active:scale-95 cursor-pointer mb-0.5",
                    isAdded 
                      ? "bg-neutral-900 text-white" 
                      : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                  )}
                  title="Add to Requisition"
                >
                  {isAdded ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-neutral-500 mt-2 text-justify">
                Contact for Prizing
              </p>
            )}
          </CardContent>
          <CardFooter className="p-3 sm:p-5 pt-3 sm:pt-4 mt-auto border-t border-neutral-50 bg-neutral-50/10">
            <DialogTrigger
              render={
                <Button className="w-full h-8 sm:h-10 text-[10px] sm:text-sm bg-neutral-900 hover:bg-neutral-800 text-white rounded shadow-lg transition-all cursor-pointer">
                  View Details
                </Button>
              }
            />
          </CardFooter>
        </Card>
      </motion.div>

      <ProductDetailModal product={props as unknown as Product} />
    </Dialog>
  );
}
