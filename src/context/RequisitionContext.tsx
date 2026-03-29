"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, PricingTier } from "@/lib/types";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  pricingTiers: PricingTier[];
}

interface RequisitionContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setAllQuantities: (quantity: number) => void;
  resetQuantities: () => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
  getItemPrice: (item: CartItem) => number;
  getItemTierName: (item: CartItem) => string;
}

const RequisitionContext = createContext<RequisitionContextType | undefined>(undefined);

export function RequisitionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("requisition_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Sanitize: ensure all items have pricingTiers
        if (Array.isArray(parsed)) {
          const sanitized = parsed.map((item: any) => ({
            ...item,
            pricingTiers: Array.isArray(item.pricingTiers) ? item.pricingTiers : []
          }));
          setItems(sanitized);
        }
      } catch (e) {
        console.error("Failed to parse cart storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("requisition_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.images[0] || "",
          quantity: 1,
          pricingTiers: product.pricingTiers,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const setAllQuantities = (qty: number) => {
    setItems((prev) => prev.map((item) => ({ ...item, quantity: Math.max(1, qty) })));
  };

  const resetQuantities = () => {
    setItems((prev) => prev.map((item) => ({ ...item, quantity: 1 })));
  };

  const clearCart = () => setItems([]);

  const getItemPrice = (item: CartItem) => {
    if (!item || !item.pricingTiers || !Array.isArray(item.pricingTiers) || item.pricingTiers.length === 0) return 0;
    const sorted = [...item.pricingTiers].sort((a, b) => b.minQty - a.minQty);
    const tier = sorted.find((t) => item.quantity >= t.minQty);
    return tier ? tier.unitPrice : (item.pricingTiers[0]?.unitPrice || 0);
  };

  const getItemTierName = (item: CartItem) => {
    if (!item || !item.pricingTiers || !Array.isArray(item.pricingTiers) || item.pricingTiers.length === 0) return "Standard";
    const sorted = [...item.pricingTiers].sort((a, b) => a.minQty - b.minQty);
    const activeIndex = [...sorted].reverse().findIndex((t) => item.quantity >= t.minQty);
    // Because we reversed to find the highest matching, indices are flipped
    const realIndex = activeIndex === -1 ? 0 : (sorted.length - 1 - activeIndex);
    
    if (realIndex === 1) return "SmartPrice";
    if (realIndex >= 2) return "BestPrice";
    return "BasicPrice";
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  return (
    <RequisitionContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setAllQuantities,
        resetQuantities,
        clearCart,
        itemCount,
        totalAmount,
        getItemPrice,
        getItemTierName,
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
}

export function useRequisition() {
  const context = useContext(RequisitionContext);
  if (context === undefined) {
    throw new Error("useRequisition must be used within a RequisitionProvider");
  }
  return context;
}
