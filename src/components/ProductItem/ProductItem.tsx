import { IoMdClose } from "react-icons/io";
import type { Product } from "../../types/product";
import VariantItem from "../VariantItem/VariantItem";
import { useProducts } from "../../context/useProducts";
import { useState } from "react";

interface Props {
  product: Product;
  index: number;
  total: number;
}

const ProductItem = ({ product, index, total }: Props) => {
  const { products, setProducts } = useProducts();
  const [showDiscount, setShowDiscount] = useState(!!product.discountValue);

  const updateProductDiscount = (
    field: "discountType" | "discountValue",
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const toggleVariants = () => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, isExpanded: !p.isExpanded } : p
      )
    );
  };

  const removeProduct = () => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const enableDiscount = () => {
    setShowDiscount(true);
    updateProductDiscount("discountType", "PERCENT");
    updateProductDiscount("discountValue", 0);
  };

  const showToggle = product.variants.length > 1;

  return (
    <div className="p-4 bg-white rounded mb-2">
      <div className="flex items-center gap-2">
        <input
          value={product.title}
          readOnly
          className="py-2 flex-1 text-sm px-4 border rounded shadow-sm"
        />

        {!showDiscount ? (
          <button
            onClick={enableDiscount}
            className="text-sm px-4 py-2 border-2 rounded bg-[#008060] text-white"
          >
            Add Discount
          </button>
        ) : (
          <>
            <input
              type="number"
              placeholder="0"
              className="py-2 px-4 w-20 border rounded"
              onChange={(e) =>
                updateProductDiscount("discountValue", Number(e.target.value))
              }
              value={product.discountValue || ""}
            />

            <select
              className="py-2 px-4 border rounded"
              value={product.discountType ?? "PERCENT"}
              onChange={(e) =>
                updateProductDiscount("discountType", e.target.value)
              }
            >
              <option value="PERCENT">% Off</option>
              <option value="FLAT">Flat off</option>
            </select>

            {total > 1 && (
              <button onClick={removeProduct}>
                <IoMdClose size={20} />
              </button>
            )}
          </>
        )}
      </div>
      {showToggle && (
        <span
          onClick={toggleVariants}
          className="text-sm flex justify-end mt-2 cursor-pointer text-blue-600 underline"
        >
          {product.isExpanded ? "Hide variants" : "Show variants"}
        </span>
      )}

      {product.isExpanded && (
        <div>
          {product.variants.map((variant) => (
            <VariantItem
              key={variant.id}
              variant={variant}
              productIndex={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
