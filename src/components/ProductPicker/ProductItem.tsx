import type { Product } from "../../types/product";
import type { Variant } from "../../types/variant";

interface SelectState {
  [productId: number]: {
    product: Product;
    variants: Record<number, Variant>;
  };
}

interface Props {
  product: Product;
  selected: SelectState;
  existingVariantIds: Set<number>;
  onToggleProduct: (product: Product) => void;
  onToggleVariant: (product: Product, variant: Variant) => void;
}

const ProductItem = ({
  product,
  selected,
  existingVariantIds,
  onToggleProduct,
  onToggleVariant,
}: Props) => {
  const selectedProduct = selected[product.id];
  const isProductSelected =
    !!selectedProduct && Object.keys(selectedProduct.variants).length > 0;

  return (
    <div>
      <div
        className="flex items-center py-3 gap-3 px-5 hover:bg-neutral-100 cursor-pointer border-b border-neutral-300"
        onClick={() => onToggleProduct(product)}
      >
        <input
          type="checkbox"
          checked={isProductSelected}
          readOnly
          className="h-4 w-4"
        />

        <img
          src={product.image?.src || ""}
          className="w-9 h-9 rounded overflow-hidden bg-gray-100 object-cover"
        />

        <span className="sm:text-[15px] text-sm">{product.title}</span>
      </div>

      <div className="sm:text-[15px] text-sm">
        {product.variants.map((variant) => {
          const disabled = existingVariantIds.has(variant.id);
          return (
            <div
              key={variant.id}
              className="flex items-center pl-14 gap-3 px-5 py-4 border-b border-neutral-300 hover:bg-neutral-100 cursor-pointer"
              onClick={() => onToggleVariant(product, variant)}
            >
              <input
                type="checkbox"
                className="h-4 w-4"
                disabled={disabled}
                checked={
                  disabled ? true : !!selectedProduct?.variants[variant.id]
                }
                readOnly
              />
              <span className="flex-1 pl-3 text-[15px]">{variant.title}</span>
              <div className="flex gap-6">
                {variant.inventory_quantity && (
                  <span className="flex-1">
                    {variant.inventory_quantity} available
                  </span>
                )}
                <span className="text-[15px]">${variant.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductItem;
