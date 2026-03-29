"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequisitionCart } from "@/components/RequisitionCart";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/#top", label: "Home" },
  { href: "/#catalog", label: "Catalogue" },
  { href: "/quiz", label: "Smart Bundle" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        setMobileMenuOpen(false);
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-2xl shadow-[0_1px_10px_rgb(0,0,0,0.02)]">
        <div className="mx-auto flex h-14 md:h-16 max-w-[1440px] w-full items-center justify-between px-4 md:px-6 lg:px-12 relative z-50 bg-transparent">
          <Link href="/#top" onClick={(e) => handleScroll(e, "/#top")} className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-black shrink-0" />
            <span className="text-[13px] md:text-lg font-bold tracking-tight text-black leading-none transform translate-y-[1px] whitespace-nowrap">
              MONO <span className="font-light text-neutral-500">SUPPLIES</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded relative group text-neutral-500 hover:text-black hover:bg-neutral-100 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-2" />
            </div>

            <RequisitionCart />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-8 w-8 ml-1 rounded text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col items-center"
          >
            <div className="flex flex-col items-center w-full gap-8 mt-12">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="block text-2xl font-light tracking-tight text-neutral-900 w-full hover:text-neutral-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                  <div className="h-[1px] w-8 mx-auto bg-black/10 mt-8" />
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-auto pb-12 text-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                The Invisible Concierge
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
