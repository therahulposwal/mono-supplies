import { Navbar } from "@/components/Navbar";
import { CatalogueContent } from "@/components/CatalogueContent";
import { EditorialScene } from "@/components/EditorialScene";
import { PrestigeMarquee } from "@/components/PrestigeMarquee";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { Globe, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/lib/types";
import * as motion from "framer-motion/client";

export const revalidate = 60;

export default async function CataloguePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let connectionError = false;

  if (supabase) {
    try {
      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      
      if (!catError && catData) {
        categories = catData.map(c => ({
          id: String(c.id),
          name: String(c.name),
          slug: String(c.slug)
        }));
      }

      // 2. Fetch Products with joined Tiers
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*, categories(slug), pricing_tiers(id, min_qty, unit_price)");

      if (!prodError && prodData && prodData.length > 0) {
        products = prodData.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          name: String(d.name),
          shortDescription: String(d.short_description || ""),
          fullSpecifications: (d.full_specifications as Record<string, string>) || {},
          images: Array.isArray(d.images) ? d.images : [],
          categorySlug:
            d.categories && typeof d.categories === "object" && "slug" in (d.categories as Record<string, unknown>)
              ? String((d.categories as Record<string, string>).slug)
              : undefined,
          pricingTiers:
            Array.isArray(d.pricing_tiers)
              ? d.pricing_tiers
                  .map((tier: Record<string, unknown>) => ({
                    id: String(tier.id),
                    minQty: Number(tier.min_qty),
                    unitPrice: Number(tier.unit_price),
                  }))
                  .sort((a, b) => a.minQty - b.minQty)
              : [],
        }));
      } else if (prodError) {
        console.error("Supabase Query Error:", prodError.message);
        connectionError = true;
      }
    } catch (err) {
      console.error("Supabase Connection Exception:", err);
      connectionError = true;
    }
  } else {
    connectionError = true;
  }

  return (
    <div id="top" className="min-h-screen bg-[#f8f9fa] text-[#191c1d] selection:bg-black selection:text-white flex flex-col scroll-mt-24">
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-18 lg:pt-28 lg:pb-20">
        {/* HD Editorial Video Background */}
        <div 
          className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ filter: "brightness(0.7) contrast(1.05)" }}
          >
            <source src="/editorial/mono-supplies.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/40 to-transparent" />
        </div>

        <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-4 sm:mb-6 bg-white/10 text-white hover:bg-white/20 border-white/40 px-3 sm:px-5 py-1 sm:py-1.5 font-mono tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] uppercase backdrop-blur-[2px] h-auto rounded-full shadow-2xl leading-relaxed">
              B2B Procurement Excellence
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter text-white mb-6 sm:mb-6 flex flex-col sm:block gap-2 sm:gap-0"
          >
            <span>The Invisible</span>
            <span className="font-semibold italic font-serif">Concierge.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <p className="mx-auto max-w-fit text-sm sm:text-lg leading-relaxed text-neutral-100 font-light bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl sm:rounded-full px-6 sm:px-10 py-3 sm:py-3 shadow-2xl overflow-hidden">
              Curated hospitality essentials. <span className="text-white/60 italic ml-0 sm:ml-1 mt-1 sm:mt-0 block sm:inline">Silent, effortless, and impeccably polished.</span>
            </p>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 text-white/40"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* B2B Trust Marquee */}
      <PrestigeMarquee />

      {/* Editorial / Shop The Room */}
      <EditorialScene products={products} />

      {/* B2B Service Features */}
      <ServiceFeatures />

      {/* Main Content */}
      <main id="catalog" className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 py-12 sm:py-16 lg:px-12 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 scroll-mt-24">
        {connectionError && (
          <div className="mb-12 rounded-lg bg-red-50 p-6 text-sm text-red-800 border border-red-200 shadow-sm flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-red-100/50 rounded-full">
              <div className="h-6 w-6 border-2 border-red-800 rounded-full border-t-transparent animate-spin"/>
            </div>
            <div>
              <p className="font-semibold text-base mb-1">Database Connectivity Issue</p>
              <p className="text-red-700/80">Unable to establish a connection to Supabase. This could be due to missing Environment Variables.</p>
            </div>
          </div>
        )}

        {products.length === 0 && !connectionError ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-10 w-10 border-2 border-black/10 border-t-black rounded-full animate-spin" />
            <p className="text-neutral-500 font-light tracking-wide uppercase text-xs">Awaiting Collection Sync...</p>
          </div>
        ) : (
          <CatalogueContent products={products} categories={[{ id: "all", name: "All Collections", slug: "all" }, ...categories]} />
        )}
      </main>

    </div>
  );
}
