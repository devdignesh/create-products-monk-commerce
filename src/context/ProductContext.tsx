import { useState } from "react";
import { ProductContext } from "./useProducts";
import { initialProduct } from "../data/initialProduct";
import type { Product } from "../types/product";

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>(initialProduct);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
