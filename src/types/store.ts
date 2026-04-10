import type { LucideIcon } from "lucide-react";

export interface ProductVariant {
  id: number | string;
  product_id?: number;
  sku_code?: string;
  label: string;
  size?: string;
  price: number | string;
  original_price?: number | string | null;
  stock?: number;
  created_at?: string;
}

export interface ProductImage {
  id?: number;
  image_url: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ProductMetadata {
  category: string;
  key: string;
  value: string;
  icon_name?: string | null;
  display_order?: number;
}

export interface ProductFaq {
  question: string;
  answer: string;
  display_order?: number;
}

export interface ProductData {
  id: number;
  category_id?: number;
  name: string;
  slug: string;
  base_description?: string;
  is_active?: boolean;
  created_at?: string;
  base_price?: number | string;
  total_stock?: number;
  variants: ProductVariant[];
  images?: ProductImage[];
  metadata?: ProductMetadata[];
  faqs?: ProductFaq[];
}

export interface ReviewData {
  id?: number;
  name?: string;
  user_name?: string | null;
  location?: string;
  rating: number;
  text?: string;
  comment?: string | null;
  highlight: string;
  is_verified?: boolean;
}

export interface CouponValidationResult {
  coupon_id: number;
  code: string;
  discount_type: string;
  discount_amount: number;
  message?: string;
  valid?: boolean;
}

export interface HighlightPill {
  icon: LucideIcon;
  label: string;
}
