"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRequisition } from "@/context/RequisitionContext";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export function RequisitionCart() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    itemCount, 
    totalAmount, 
    clearCart,
    setAllQuantities,
    resetQuantities,
    getItemPrice,
    getItemTierName
  } = useRequisition();

  const router = useRouter();

  const [rooms, setRooms] = React.useState(1);
  const [step, setStep] = React.useState<"cart" | "form" | "success">("cart");
  const [formData, setFormData] = React.useState({
    property: "",
    place: "",
    email: ""
  });

  // Reset rooms and step when items are cleared
  React.useEffect(() => {
    if (items.length === 0) {
      setRooms(1);
      setStep("cart");
    }
  }, [items.length]);

  const handleRoomsChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      setRooms(num);
      setAllQuantities(num);
    } else if (val === "") {
      setRooms(0);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small delay to allow exit animation
      setTimeout(() => {
        setStep("cart");
        setFormData({ property: "", place: "", email: "" });
      }, 300);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" className="relative p-1.5 hover:bg-neutral-100 rounded transition-colors flex items-center justify-center cursor-pointer">
            <ShoppingBag className="size-5 text-neutral-800" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                {itemCount >= 10 ? "10+" : itemCount}
              </span>
            )}
            <span className="sr-only">Open Requisition Cart</span>
          </Button>
        }
      />
      <DialogContent className="fixed top-0 right-0 left-auto translate-x-0 translate-y-0 h-full w-full sm:max-w-md rounded-none border-l border-neutral-200 bg-white p-0 shadow-2xl flex flex-col duration-300 data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              {step === "form" && (
                <button 
                  onClick={() => setStep("cart")}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-100 text-neutral-400 hover:text-black hover:border-neutral-200 transition-all cursor-pointer"
                  aria-label="Back to Requisition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <DialogTitle className="text-xl font-medium tracking-tight">
                {step === "cart" && "Your Requisition"}
                {step === "form" && "Request Quotation"}
                {step === "success" && "Submission Received"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {step === "cart" && (
              items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900">Your cart is empty</h3>
                    <p className="text-xs text-neutral-500 mt-1 text-justify">Add items to start your requisition.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative w-20 h-20 bg-neutral-50 rounded overflow-hidden border border-neutral-100 shrink-0 shadow-sm">
                        <Image
                          src={`${item.image}?v=2`}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-destructive transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs font-medium text-neutral-900">${getItemPrice(item).toFixed(2)} / unit</p>
                            {item.pricingTiers && item.pricingTiers.length > 0 && getItemPrice(item) < (item.pricingTiers[0]?.unitPrice || 0) && (
                              <span className="text-[9px] font-bold uppercase tracking-tight text-[#B8860B] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded border border-[#D4AF37]/20">
                                {getItemTierName(item)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-200 rounded overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 px-2 hover:bg-neutral-50 transition-colors text-neutral-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 px-2 hover:bg-neutral-50 transition-colors text-neutral-600 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-neutral-900">
                            ${(getItemPrice(item) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {step === "form" && (
              <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Property Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ritz-Carlton Geneva"
                      value={formData.property}
                      onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                      className="w-full h-12 px-4 rounded-md border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Place / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Geneva, Switzerland"
                      value={formData.place}
                      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      className="w-full h-12 px-4 rounded-md border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Professional Email</label>
                    <input
                      type="email"
                      placeholder="procurement@property.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-md border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 flex gap-4 items-start">
                  <div className="p-2 bg-neutral-200/50 rounded-full shrink-0">
                    <ShoppingBag className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-900">{items.length} Items Selected</p>
                    <p className="text-[10px] text-neutral-500">Subtotal: ${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in zoom-in-95 duration-700">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Requisition Sent Successfully</h3>
                  <p className="text-sm text-neutral-500 max-w-[240px] mx-auto leading-relaxed text-justify">
                    Our curation team will review your selection and contact you within 24 hours.
                  </p>
                </div>
                <DialogClose 
                  render={
                    <Button 
                      onClick={() => {
                        clearCart();
                        router.push("/");
                      }}
                      variant="outline"
                      className="rounded px-8 h-12 text-xs font-bold uppercase tracking-widest mt-4 cursor-pointer"
                    >
                      Return to Home
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {step !== "success" && items.length > 0 && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-6">
              {step === "cart" ? (
                <>
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Project Scale</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={rooms || ""}
                          onChange={(e) => handleRoomsChange(e.target.value)}
                          className="w-20 h-9 px-3 rounded-md border border-neutral-200 bg-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black transition-all"
                          placeholder="Rooms"
                        />
                        <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">Rooms</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        resetQuantities();
                        setRooms(1);
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors cursor-pointer"
                    >
                      Reset All to 1
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Subtotal</span>
                      <span className="font-medium text-neutral-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total Indicative Estimate</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-tight">
                      Final pricing may vary based on shipping & taxes.
                    </p>
                  </div>
                  <div className="grid gap-3 pt-2">
                    <Button 
                      onClick={() => setStep("form")}
                      className="w-full bg-black text-white hover:bg-neutral-800 rounded h-12 shadow-lg tracking-wide uppercase text-xs font-bold cursor-pointer"
                    >
                      Request Quotation
                    </Button>
                    <button 
                      onClick={clearCart}
                      className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors text-center cursor-pointer"
                    >
                      Clear Requisition
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid gap-3 pt-2">
                  <Button 
                    onClick={() => setStep("success")}
                    className="w-full bg-black text-white hover:bg-neutral-800 rounded h-12 shadow-lg tracking-wide uppercase text-xs font-bold cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Submit Request
                  </Button>
                  <p className="text-[10px] text-neutral-400 text-center uppercase tracking-tight">
                    By submitting, you agree to our B2B procurement terms.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
