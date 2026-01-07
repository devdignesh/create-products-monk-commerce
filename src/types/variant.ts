export type DiscountType = "FLAT" | "PERCENT";

export interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  discountType?: DiscountType;
  discountValue?: number;
}
