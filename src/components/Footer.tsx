"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Mail, ArrowRight, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Collections",
      links: [
        { name: "Precision Kettles", href: "#" },
        { name: "Silent Minibars", href: "#" },
        { name: "Global Hairdryers", href: "#" },
        { name: "Professional Safes", href: "#" },
        { name: "Housekeeping Essentials", href: "#" },
      ],
    },
    {
      title: "Professional",
      links: [
        { name: "Sustainability Charter", href: "#" },
        { name: "Star-Rating Standards", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Global Logistics", href: "#" },
        { name: "Procurement Guide", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Our Narrative", href: "#" },
        { name: "Concierge Support", href: "#" },
        { name: "Press & Media", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Requisition", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-neutral-100 pt-20 pb-10 sm:pt-28 sm:pb-12 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Brand Narrarive Column */}
          <div className="lg:col-span-2 space-y-8 pr-0 lg:pr-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-4 w-4 rounded-full bg-black group-hover:scale-125 transition-transform duration-500" />
              <span className="text-lg font-bold tracking-tighter uppercase">Mono Supplies</span>
            </Link>
            
            <p className="text-neutral-500 font-light leading-relaxed max-w-sm text-sm sm:text-base text-justify">
              The Invisible Concierge. Curating the world&apos;s most silent, high-performance essentials for hospitality professionals. Engineered for 24/7 professional excellence since 2012.
            </p>

            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-black transition-colors duration-300 font-light flex items-center group/link"
                    >
                      {link.name}
                      <ArrowRight className="w-0 h-3 ml-1 opacity-0 group-hover/link:w-3 group-hover/link:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
            <span>© {currentYear} Mono Supplies Ltd.</span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-neutral-200" />
            <span className="italic font-serif normal-case tracking-normal font-medium text-neutral-500">The Invisible Concierge</span>
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <Link href="#" className="text-neutral-400 hover:text-black transition-colors">Global Trade</Link>
            <Link href="#" className="text-neutral-400 hover:text-black transition-colors">Digital Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
