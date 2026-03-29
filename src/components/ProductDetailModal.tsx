"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus, ShieldCheck, Award, Zap, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingTable } from "@/components/PricingTable";
import { useRequisition } from "@/context/RequisitionContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductDetailModalProps {
  product: Product;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ProductDetailModal({ product }: ProductDetailModalProps) {
  const { id, name, shortDescription, fullSpecifications, images, pricingTiers } = product;
  const { addItem, items, updateQuantity } = useRequisition();
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = items.find((item) => item.id === id);
  const isInCart = !!cartItem;

  const currentModalImage = images?.[modalImageIndex] || images?.[0] || "";

  const handleAdd = () => {
    addItem({ id, name, shortDescription, fullSpecifications, images, pricingTiers });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <DialogContent className="block sm:max-w-4xl md:max-w-5xl w-[95vw] md:w-full max-h-[90vh] overflow-hidden p-0 border-none bg-white rounded sm:rounded-lg shadow-2xl">
      <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto w-full relative">
        {/* Left Column: Images & Gallery */}
        <div className="w-full md:w-1/2 bg-neutral-50 p-4 sm:p-8 flex flex-col gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={modalImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={`${currentModalImage}?v=2`}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                  className="object-cover scale-[1.01]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Interactive Thumbnail Gallery */}
          {images && images.length > 1 && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-4 justify-center"
            >
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalImageIndex(idx)}
                  className={cn(
                    "relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 rounded overflow-hidden transition-all duration-300",
                    modalImageIndex === idx 
                      ? "border-neutral-400 ring-4 ring-neutral-400/10 scale-105" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={`${img}?v=2`}
                    alt={`${name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover font-light"
                  />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Institutional Trust Markers (Desktop Only) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:grid grid-cols-4 gap-4 mt-auto pt-6 mb-4 border-t border-neutral-100"
          >
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-widest text-neutral-900 leading-tight">Institutional<br/>Quality</h4>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center text-center">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-widest text-neutral-900 leading-tight">Global<br/>Warranty</h4>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center text-center">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-widest text-neutral-900 leading-tight">Verified<br/>Safety</h4>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center text-center">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-widest text-neutral-900 leading-tight">Institutional<br/>Logistics</h4>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Details & Pricing */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col pt-6 sm:pt-8 bg-white"
        >
          <motion.div variants={itemVariants}>
            <DialogHeader className="mb-4 sm:mb-8 text-left">
              <DialogTitle className="text-xl sm:text-3xl font-light tracking-tight text-neutral-900 mb-1 sm:mb-2 leading-snug">
                {name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-base text-neutral-500 font-light leading-relaxed">
                {shortDescription}
              </DialogDescription>
            </DialogHeader>
          </motion.div>

          <div className="flex-1">
            <motion.div variants={itemVariants}>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3 sm:mb-4 border-b border-neutral-100 pb-2">
                Technical Specifications
              </h3>
              {fullSpecifications && Object.keys(fullSpecifications).length > 0 ? (
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {Object.entries(fullSpecifications).map(([key, value]) => (
                    <li key={key} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-neutral-500 capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="font-medium text-neutral-900 text-right ml-4">
                        {String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400 mb-8 italic text-justify">
                  No specific specs attached.
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3 sm:mb-4 border-b border-neutral-100 pb-2">
                Volume Pricing
              </h3>
              <div className="mb-4 sm:mb-6 overflow-x-auto">
                <PricingTable tiers={pricingTiers} />
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-auto">
            {isInCart ? (
              <div className="flex items-center justify-between w-full mt-4 sm:mt-8 bg-neutral-50 border border-neutral-200 rounded h-10 sm:h-14 p-1 sm:p-2 shadow-sm">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(id, -1)}
                  className="h-full px-4 hover:bg-neutral-100 transition-colors rounded text-neutral-600 cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-neutral-900">{cartItem.quantity}</span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">In Requisition</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(id, 1)}
                  className="h-full px-4 hover:bg-neutral-100 transition-colors rounded text-neutral-600 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleAdd}
                  className={cn(
                    "w-full mt-4 sm:mt-8 rounded h-10 sm:h-14 text-sm sm:text-lg font-light tracking-wide shadow-xl transition-all cursor-pointer",
                    isAdded ? "bg-neutral-100 text-neutral-900 border border-neutral-200" : "bg-black text-white hover:bg-neutral-800"
                  )}
                >
                  {isAdded ? "Added to Requisition" : "Add to Requisition"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </DialogContent>
  );
}
