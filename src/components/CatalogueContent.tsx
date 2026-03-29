"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

interface CatalogueContentProps {
  products: Product[];
  categories: Category[];
}

export function CatalogueContent({ products, categories }: CatalogueContentProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      if (p.categorySlug) {
        counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categorySlug === activeCategory);
  }, [products, activeCategory]);

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name || "All Products";
  const activeIndex = categories.findIndex((c) => c.slug === activeCategory);

  return (
    <div className="flex flex-col gap-12 lg:flex-row">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 ease-out">
        <div className="sticky top-20 sm:top-24 z-10 bg-[#f8f9fa] lg:bg-transparent pt-4 lg:pt-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:pb-0 pb-2">
          <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-400 mb-4 sm:mb-8 ml-1 sm:ml-4">
            Collections
          </h2>
          <div className="relative flex flex-row overflow-x-auto gap-2 lg:flex-col lg:gap-0 scrollbar-hide snap-x">
            {/* Sliding Background (Desktop) */}
            <div 
              className="absolute left-0 w-full h-10 bg-neutral-100/80 rounded transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:block -z-10"
              style={{ 
                transform: `translateY(${activeIndex * 40}px)`,
                top: '0px'
              }}
            />
            
            {categories.map((cat, idx) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "flex items-center justify-between flex-shrink-0 snap-start text-left h-8 sm:h-10 px-3 sm:px-4 text-sm sm:text-base transition-all duration-300 whitespace-nowrap lg:w-full group rounded",
                  activeCategory === cat.slug
                    ? "text-black font-medium lg:bg-transparent bg-black text-white lg:text-black lg:rounded-none"
                    : "text-neutral-500 hover:text-black bg-neutral-100 lg:bg-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                    activeCategory === cat.slug ? "bg-black" : "bg-transparent group-hover:bg-neutral-200"
                  )} />
                  <span className="tracking-wide">{cat.name}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-mono transition-opacity duration-300",
                  activeCategory === cat.slug ? "opacity-60" : "opacity-0 group-hover:opacity-40"
                )}>
                  ({categoryCounts[cat.slug] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-700 delay-150 ease-out">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900">
            {activeCategory === "all" ? "All Products" : activeCategoryName}
          </h2>
          <span className="text-sm text-neutral-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p>No products found in this category.</p>
          </div>
        ) : (
        <div 
          key={activeCategory} 
          className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both"
        >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                shortDescription={product.shortDescription}
                fullSpecifications={product.fullSpecifications}
                images={product.images}
                pricingTiers={product.pricingTiers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
