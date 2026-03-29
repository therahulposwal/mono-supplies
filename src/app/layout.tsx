import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RequisitionProvider } from "@/context/RequisitionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mono Supplies | Premium Hospitality Procurement",
  description:
    "Curated hospitality essentials — kettles, hair dryers, mini bars, safes & more. Volume pricing for hotels worldwide. The Invisible Concierge.",
  keywords: [
    "hotel supplies",
    "hospitality procurement",
    "hotel kettles",
    "minibar fridges",
    "housekeeping trolleys",
    "B2B hotel equipment",
  ],
};

import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <RequisitionProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </RequisitionProvider>
      </body>
    </html>
  );
}
