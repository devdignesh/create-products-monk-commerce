import type { Product } from "../../types/product";
import type { Variant } from "../../types/variant";
import ProductItem from "./ProductItem";

interface SelectState {
  [productId: number]: {
    product: Product;
    variants: Record<number, Variant>;
  };
}

interface Props {
  products: Product[];
  selected: SelectState;
  existingVariantIds: Set<number>;
  onToggleProduct: (product: Product) => void;
  onToggleVariant: (product: Product, variant: Variant) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const ProductList = ({
  products,
  selected,
  existingVariantIds,
  onToggleProduct,
  onToggleVariant,
  onScroll,
}: Props) => {
  return (
    <div
      className="flex-1 overflow-auto border-y border-neutral-300"
      onScroll={onScroll}
    >
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          selected={selected}
          existingVariantIds={existingVariantIds}
          onToggleProduct={onToggleProduct}
          onToggleVariant={onToggleVariant}
        />
      ))}
    </div>
  );
};

export default ProductList;
