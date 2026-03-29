export interface PricingTier {
  id: string;
  minQty: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullSpecifications: Record<string, string>;
  images: string[];
  pricingTiers: PricingTier[];
  categorySlug?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
