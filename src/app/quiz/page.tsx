"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { useRequisition } from "@/context/RequisitionContext";
import { 
  Sparkles, 
  Palmtree, 
  Building2, 
  Key, 
  Hotel, 
  Building,
  Star,
  Coffee,
  Home,
  Users,
  KeyRound,
  DoorClosed,
  Landmark,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

type QuizStep = "PROPERTY_TYPE" | "ROOM_COUNT" | "STAR_RATING" | "RESULTS";

const PROPERTY_ICONS: Record<string, React.ReactNode> = {
  "Hotel": <Building2 className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "Serviced Apartment": <Home className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "Airbnb": <Key className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "Resort": <Palmtree className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
};

const ROOM_ICONS: Record<string, React.ReactNode> = {
  "1–10": <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "11–50": <DoorClosed className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "51–200": <Hotel className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
  "200+": <Building className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />,
};

const STAR_ICONS: Record<string, React.ReactNode> = {
  "Budget/3-star": (
    <div className="flex gap-1">
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
    </div>
  ),
  "Mid-range/4-star": (
    <div className="flex gap-1">
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
    </div>
  ),
  "Premium/5-star": (
    <div className="flex gap-1">
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
      <Star className="w-5 h-5 fill-current" />
    </div>
  ),
};

const getBundleData = (starRating: string | null) => {
  switch (starRating) {
    case "Budget/3-star":
      return {
        name: "Essential Hospitality Kit",
        productIds: [
          "aaaaaaaa-0000-0000-0000-000000000001", // Budget Kettle
          "bbbbbbbb-0000-0000-0000-000000000001", // Wall Hair Dryer
          "cccccccc-0000-0000-0000-000000000001", // Silent Fridge
          "dddddddd-0000-0000-0000-000000000001", // Standard Safe
        ],
      };
    case "Mid-range/4-star":
      return {
        name: "Business Classic Bundle",
        productIds: [
          "aaaaaaaa-0000-0000-0000-000000000002", // Premium Kettle
          "bbbbbbbb-0000-0000-0000-000000000003", // Folding Hair Dryer
          "cccccccc-0000-0000-0000-000000000002", // Glass Minibar
          "dddddddd-0000-0000-0000-000000000001", // Standard Safe
        ],
      };
    case "Premium/5-star":
      return {
        name: "Majestic Suite Collection",
        productIds: [
          "aaaaaaaa-0000-0000-0000-000000000003", // Gooseneck Kettle
          "bbbbbbbb-0000-0000-0000-000000000002", // Pro Hair Dryer
          "cccccccc-0000-0000-0000-000000000003", // Smart Minibar
          "dddddddd-0000-0000-0000-000000000002", // Biometric Safe
        ],
      };
    default:
      return { name: "Custom Collection", productIds: [] };
  }
};

const getRoomRangeLimits = (roomCount: string | null): [number, number] => {
  switch (roomCount) {
    case "1–10": return [1, 10];
    case "11–50": return [11, 50];
    case "51–200": return [51, 200];
    case "200+": return [200, 200];
    default: return [0, 0];
  }
};

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)"
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as any
    }
  })
};

export default function SmartBundleQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<QuizStep>("PROPERTY_TYPE");
  const [direction, setDirection] = useState(0);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState<string | null>(null);
  const [starRating, setStarRating] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(slug), pricing_tiers(id, min_qty, unit_price)");

        interface SupabaseTier {
          id: string;
          min_qty: number;
          unit_price: number;
        }

        interface SupabaseProduct {
          id: string;
          name: string;
          short_description: string;
          full_specifications: Record<string, string>;
          images: string[];
          categories: { slug: string } | null;
          pricing_tiers: SupabaseTier[];
        }

        if (!error && data) {
          const mapped: Product[] = (data as unknown as SupabaseProduct[]).map((d) => ({
            id: String(d.id),
            name: String(d.name),
            shortDescription: String(d.short_description || ""),
            fullSpecifications: d.full_specifications || {},
            images: Array.isArray(d.images) ? d.images : [],
            categorySlug: d.categories?.slug,
            pricingTiers: (d.pricing_tiers || [])
              .map((t) => ({
                id: t.id,
                minQty: t.min_qty,
                unitPrice: t.unit_price,
              }))
              .sort((a, b) => a.minQty - b.minQty),
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Quiz fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const steps: Record<QuizStep, number> = {
    PROPERTY_TYPE: 25,
    ROOM_COUNT: 50,
    STAR_RATING: 75,
    RESULTS: 100,
  };

  const currentProgress = steps[currentStep];

  const handleNext = () => {
    setDirection(1);
    if (currentStep === "PROPERTY_TYPE" && propertyType)
      setCurrentStep("ROOM_COUNT");
    if (currentStep === "ROOM_COUNT" && roomCount)
      setCurrentStep("STAR_RATING");
    if (currentStep === "STAR_RATING" && starRating)
      setCurrentStep("RESULTS");
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep === "ROOM_COUNT") setCurrentStep("PROPERTY_TYPE");
    if (currentStep === "STAR_RATING") setCurrentStep("ROOM_COUNT");
    if (currentStep === "RESULTS") setCurrentStep("STAR_RATING");
  };

  const bundleData = getBundleData(starRating);
  const recommendedProducts = bundleData.productIds
    .map((id: string) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const [roomMin, roomMax] = getRoomRangeLimits(roomCount);
  
  const getTierPriceForQty = (qty: number, item: Product) => {
    if (!item.pricingTiers || item.pricingTiers.length === 0) return 0;
    const sorted = [...item.pricingTiers].sort((a, b) => b.minQty - a.minQty);
    const tier = sorted.find((t) => qty >= t.minQty);
    return tier ? tier.unitPrice : item.pricingTiers[0].unitPrice;
  };

  const calculateTotalForQty = (qty: number) => {
    return recommendedProducts.reduce((sum, p) => sum + getTierPriceForQty(qty, p), 0) * qty;
  };

  const totalIndicativePriceMin = calculateTotalForQty(roomMin);
  const totalIndicativePriceMax = calculateTotalForQty(roomMax);
  
  const getOverallTierName = (qty: number) => {
    if (qty >= 200) return "BestPrice";
    if (qty >= 50) return "SmartPrice";
    return "BasicPrice";
  };
  
  const minTierName = getOverallTierName(roomMin);
  const maxTierName = getOverallTierName(roomMax);
  const { addItem } = useRequisition();

  const handleAddBundle = () => {
    recommendedProducts.forEach((product) => addItem(product));
  };

  return (
    <div className="min-h-screen bg-white text-[#191c1d] flex flex-col font-sans">
      <Navbar />
      <div className="w-full bg-neutral-100">
        <motion.div 
          className="h-[2px] bg-black origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentProgress / 100 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col ${
        currentStep === "RESULTS" ? "max-w-7xl" : "max-w-4xl justify-center"
      } relative overflow-hidden`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div 
              className="h-10 w-10 border-2 border-black/10 border-t-black rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-neutral-500 font-light tracking-widest uppercase text-[10px]">Syncing Collection...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {currentStep !== "RESULTS" ? (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <Badge
                      variant="outline"
                      className="px-4 py-1.5 bg-transparent border-neutral-200 text-neutral-500 tracking-[0.2em] text-[9px] uppercase font-bold rounded-full"
                    >
                      Step {Object.keys(steps).indexOf(currentStep) + 1} of 3
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 leading-[1.1] max-w-4xl mx-auto px-4 sm:px-0 text-center">
                      {currentStep === "PROPERTY_TYPE" &&
                        "What type of property are you equipping?"}
                      {currentStep === "ROOM_COUNT" &&
                        "How many rooms do you need to equip?"}
                      {currentStep === "STAR_RATING" &&
                        "What star rating or quality level are you targeting?"}
                    </h1>
                    <p className="text-neutral-500 text-sm sm:text-lg font-light max-w-xl mx-auto px-4 sm:px-0 text-center">
                      {currentStep === "PROPERTY_TYPE" &&
                        "Select the environment that best describes your project aesthetic."}
                      {currentStep === "ROOM_COUNT" &&
                        "Volume-based pricing is automatically applied based on room count."}
                      {currentStep === "STAR_RATING" &&
                        "This calibration adjusts the tier of appliance recommendations."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap justify-center gap-3 sm:gap-4 items-stretch max-w-2xl lg:max-w-none mx-auto w-full">
                    {currentStep === "PROPERTY_TYPE" &&
                      Object.keys(PROPERTY_ICONS).map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ y: -4, borderColor: "rgba(0,0,0,1)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPropertyType(opt)}
                          className={`p-4 sm:p-8 border transition-all duration-300 rounded-lg bg-white flex flex-col items-center justify-center gap-4 sm:gap-6 cursor-pointer text-center min-w-0 lg:w-48 xl:w-56 aspect-square ${
                            propertyType === opt
                              ? "border-black bg-[#fcfcfc] shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
                              : "border-neutral-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                          }`}
                        >
                          <div className={`p-3 sm:p-4 rounded-full transition-colors duration-500 ${propertyType === opt ? "bg-black text-white" : "bg-neutral-50 text-neutral-500"}`}>
                            {PROPERTY_ICONS[opt]}
                          </div>
                          <span className={`text-base tracking-widest uppercase text-[10px] font-bold leading-tight ${propertyType === opt ? "text-black" : "text-neutral-500"}`}>
                            {opt}
                          </span>
                        </motion.button>
                      ))}

                    {currentStep === "ROOM_COUNT" &&
                      Object.keys(ROOM_ICONS).map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ y: -4, borderColor: "rgba(0,0,0,1)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRoomCount(opt)}
                          className={`p-4 sm:p-8 border transition-all duration-300 rounded-lg bg-white flex flex-col items-center justify-center gap-4 sm:gap-6 cursor-pointer text-center min-w-0 lg:w-48 xl:w-56 aspect-square ${
                            roomCount === opt
                              ? "border-black bg-[#fcfcfc] shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
                              : "border-neutral-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                          }`}
                        >
                          <div className={`p-3 sm:p-4 rounded-full transition-colors duration-500 ${roomCount === opt ? "bg-black text-white" : "bg-neutral-50 text-neutral-500"}`}>
                            {ROOM_ICONS[opt]}
                          </div>
                          <span className={`text-base tracking-widest uppercase text-[10px] font-bold leading-tight ${roomCount === opt ? "text-black" : "text-neutral-500"}`}>
                            {opt} Rooms
                          </span>
                        </motion.button>
                      ))}

                    {currentStep === "STAR_RATING" &&
                      Object.keys(STAR_ICONS).map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ y: -4, borderColor: "rgba(0,0,0,1)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStarRating(opt)}
                          className={`p-4 sm:p-8 border transition-all duration-300 rounded-lg bg-white flex flex-col items-center justify-center gap-4 sm:gap-6 cursor-pointer text-center min-w-0 lg:w-48 xl:w-56 aspect-square ${
                            starRating === opt
                              ? "border-black bg-[#fcfcfc] shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
                              : "border-neutral-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                          }`}
                        >
                          <div className={`transition-transform duration-500 flex items-center justify-center ${starRating === opt ? "text-black fill-black" : "text-neutral-500 fill-none"}`}>
                            {STAR_ICONS[opt]}
                          </div>
                          <span className={`text-base tracking-widest uppercase text-[10px] font-bold leading-tight ${starRating === opt ? "text-black" : "text-neutral-500"}`}>
                            {opt}
                          </span>
                        </motion.button>
                      ))}
                  </div>

                  <div className="flex justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-100 px-2 sm:px-0">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      disabled={currentStep === "PROPERTY_TYPE"}
                      className="text-neutral-500 hover:text-black hover:bg-neutral-50 cursor-pointer text-xs uppercase tracking-[0.2em] px-0 disabled:opacity-0"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={
                        (currentStep === "PROPERTY_TYPE" && !propertyType) ||
                        (currentStep === "ROOM_COUNT" && !roomCount) ||
                        (currentStep === "STAR_RATING" && !starRating)
                      }
                      className="bg-black text-white hover:bg-neutral-800 px-10 py-6 rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all cursor-pointer text-xs uppercase tracking-[0.3em] font-medium"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 w-full max-w-7xl mx-auto">
                  {/* Hero Summary */}
                  <div className="flex flex-col items-center text-center space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-wrap items-center justify-center gap-3"
                    >
                      <Badge className="bg-neutral-100 text-neutral-500 border-none px-4 py-1 tracking-[0.2em] text-[9px] uppercase font-bold rounded-full">
                        {propertyType}
                      </Badge>
                      <Badge className="bg-neutral-100 text-neutral-500 border-none px-4 py-1 tracking-[0.2em] text-[9px] uppercase font-bold rounded-full">
                        {roomCount} Rooms
                      </Badge>
                      <Badge className="bg-[#B8860B]/10 text-[#B8860B] border-none px-4 py-1 tracking-[0.2em] text-[9px] uppercase font-bold rounded-full">
                        {starRating}
                      </Badge>
                      <div className="w-[1px] h-4 bg-neutral-200 mx-2 hidden sm:block" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPropertyType(null);
                          setRoomCount(null);
                          setStarRating(null);
                          setCurrentStep("PROPERTY_TYPE");
                        }}
                        className="h-8 px-3 text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-full cursor-pointer flex items-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </Button>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="space-y-4"
                    >
                      <h2 className="text-[32px] sm:text-6xl font-light tracking-tighter text-black leading-[1.1] max-w-3xl mx-auto font-sans">
                        {bundleData.name}
                      </h2>
                      <p className="text-[13px] sm:text-xl text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 mt-2">
                        A precision-calibrated collection of high-performance appliances, 
                        curated specifically for {propertyType} standards.
                      </p>
                    </motion.div>
                  </div>

                  {/* Procurement Dashboard */}
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.01)]"
                  >
                    <div className="p-6 sm:p-10 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50/20 flex flex-col justify-between space-y-6 sm:space-y-8">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">
                          Indicative Procurement Estimate
                        </span>
                        <div className="space-y-1">
                          <div className="text-3xl sm:text-5xl font-light tracking-tighter text-black flex items-baseline gap-2">
                            <span className="text-xl font-normal text-neutral-500">$</span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1, duration: 1 }}
                            >
                              {totalIndicativePriceMin.toLocaleString()}
                            </motion.span>
                            {totalIndicativePriceMin !== totalIndicativePriceMax && (
                              <>
                                <span className="text-xl font-light text-neutral-500 mx-2">—</span>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.2, duration: 1 }}
                                >
                                  {totalIndicativePriceMax.toLocaleString()}
                                </motion.span>
                              </>
                            )}
                          </div>
                           <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold tracking-[0.2em] uppercase">
                            Estimated for {roomCount} units
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-light leading-snug">
                          {minTierName === maxTierName ? (
                            <>Volume pricing tier <span className="text-black font-medium">{minTierName}</span> applied automatically.</>
                          ) : (
                            <>Volume pricing tiers <span className="text-black font-medium">{minTierName}</span> through <span className="text-black font-medium">{maxTierName}</span> applied automatically.</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black">Immediate Actions</h4>
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-light leading-relaxed">
                          Secure inventory levels and pricing tiers by adding this bundle to your procurement requisition.
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.01, backgroundColor: "#111" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleAddBundle}
                        className="w-full bg-black text-white rounded-lg h-14 shadow-lg tracking-[0.3em] uppercase text-[9px] font-bold cursor-pointer transition-colors"
                      >
                        Add to Requisition
                      </motion.button>
                      <p className="text-[8px] sm:text-[9px] text-center text-neutral-500 tracking-[0.1em] font-medium uppercase">
                        Requires official verification by MONO procurement team
                      </p>
                    </div>
                  </motion.div>

                  {/* Inventory Manifest */}
                  <div className="pt-8 sm:pt-14 space-y-8 sm:space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-6 text-neutral-900">
                      <div className="space-y-2 text-center md:text-left">
                        <span className="text-[7px] sm:text-[8px] font-bold text-[#B8860B] tracking-[0.4em] uppercase">
                          Detailed Inventory Specifications
                        </span>
                        <h3 className="text-xl sm:text-2xl font-light tracking-tight mt-1">
                          Inventory Manifest
                        </h3>
                      </div>
                      <div className="flex items-center justify-center md:justify-end gap-8 sm:gap-12">
                        <div className="text-center md:text-right">
                          <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Items</p>
                          <p className="text-sm sm:text-lg font-light">{recommendedProducts.length}</p>
                        </div>
                        <div className="w-[1px] h-6 sm:h-8 bg-neutral-100" />
                        <div className="text-center md:text-right">
                          <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Quality</p>
                          <p className="text-sm sm:text-lg font-light">Premium</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-12 gap-y-6 sm:gap-y-16">
                      {recommendedProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <div className="relative group">
                            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center text-[9px] font-bold text-neutral-500 group-hover:bg-black group-hover:text-white transition-colors duration-500 z-10 border border-white">
                              0{index + 1}
                            </div>
                            <ProductCard
                              id={product.id}
                              name={product.name}
                              shortDescription={product.shortDescription}
                              images={product.images}
                              fullSpecifications={product.fullSpecifications}
                              pricingTiers={product.pricingTiers}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center pt-14 border-t border-neutral-100">
                    <Button
                      variant="ghost"
                      className="px-10 py-6 text-neutral-500 hover:text-black cursor-pointer h-auto text-[9px] uppercase tracking-[0.3em] font-bold"
                      onClick={() => router.push("/")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-3" /> Return to Catalogue
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
