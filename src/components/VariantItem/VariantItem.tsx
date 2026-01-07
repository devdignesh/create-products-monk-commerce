import { IoMdClose } from "react-icons/io";
import { useProducts } from "../../context/useProducts";
import type { Variant } from "../../types/variant";

interface Props {
  variant: Variant;
  productIndex: number;
}

const VariantItem = ({ variant, productIndex }: Props) => {
  const { setProducts } = useProducts();

  const updateVariantDiscount = (
    field: "discountType" | "discountValue",
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((product, pIndex) => {
        if (pIndex !== productIndex) return product;

        return {
          ...product,
          variants: product.variants.map((v) =>
            v.id === variant.id
              ? {
                  ...v,
                  discountType: v.discountType ?? "PERCENT",
                  [field]: value,
                }
              : v
          ),
        };
      })
    );
  };

  const removeVariant = () => {
    setProducts((prev) =>
      prev.map((product, pIndex) => {
        if (pIndex !== productIndex) return product;

        if (product.variants.length === 1) return product;

        return {
          ...product,
          variants: product.variants.filter((v) => v.id !== variant.id),
        };
      })
    );
  };

  return (
    <div>
      <input
        value={variant.title}
        readOnly
        className="py-2 flex-1 text-sm px-4 border rounded shadow-sm"
      />

      <input
        type="number"
        value={variant.discountValue ?? ""}
        onChange={(e) =>
          updateVariantDiscount("discountValue", Number(e.target.value))
        }
        className="py-2 px-4 w-20 border rounded-3xl"
      />

      <select
        value={variant.discountType ?? "PERCENT"}
        onChange={(e) => updateVariantDiscount("discountType", e.target.value)}
        className="py-2 px-4 border rounded-3xl"
      >
        <option value="PERCENT">% Off</option>
        <option value="FLAT">Flat off</option>
      </select>

      <button
        onClick={removeVariant}
        className="text-neutral-800 cursor-pointer"
      >
        <IoMdClose size={18} />
      </button>
    </div>
  );
};

export default VariantItem;
