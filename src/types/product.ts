import type { Variant } from "./variant";

export interface Image {
  id: number;
  product_id: number;
  src: string;
}

export interface Product {
  id: number;
  title: string;
  image: Image;
  variants: Variant[];
  isExpanded?: boolean;
  discountType?: "PERCENT" | "FIXED";
  discountValue?: number;
}
