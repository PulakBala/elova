import type { ApiProduct, ApiProductVariant } from "@/lib/api";

export interface Product {
  id: string | number;
  slug?: string;
  title: string;
  badge?: {
    text: string;
    type: "discount" | "new" | "hot";
  } | null;
  image: string;
  rating?: number;
  reviewsCount?: string | number;
  reviews_count?: number;
  price: number;
  originalPrice?: number | null;
  original_price?: number | null;
  hasAddToCart?: boolean;
  has_add_to_cart?: boolean;
  category?: string | any;
  categorySlug?: string;
  subCategorySlug?: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  in_stock?: boolean;
  createdAt?: string;
  salesCount?: number;
  sales_count?: number;
  sku?: string;
  short_description?: string | null;
  description?: string | null;
  variants?: ApiProductVariant[] | any[];
  gallery?: string[];
}

