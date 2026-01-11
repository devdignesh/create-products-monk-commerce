import type { ChangeEvent } from "react";
import { useProducts } from "../../context/useProducts";
import type { DiscountType, Variant } from "../../types/variant";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import CloseButton from "./CloseButton";

interface Props {
  variant: Variant;
  productIndex: number;
  hasProductDiscount: boolean;
}

const VariantItem = ({ variant, productIndex, hasProductDiscount }: Props) => {
  const { products, setProducts } = useProducts();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateVariantDiscount = (
    field: "discountType" | "discountValue",
    value: DiscountType | number
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

  const handleDiscountTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const discountType = event.target.value as DiscountType;
    updateVariantDiscount("discountType", discountType);
  };

  const canRemoveVariant = (products?.[productIndex]?.variants.length ?? 0) > 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center gap-2 my-4"
    >
      <div className="flex items-center gap-2 w-full">
        <span
          {...listeners}
          {...attributes}
          className="cursor-grab text-gray-500"
        >
          <MdDragIndicator size={23} />
        </span>

        <input
          value={variant.title}
          readOnly
          className="py-2 w-full rounded-full items-center flex justify-between text-sm px-4 border border-neutral-300 shadow-sm bg-white"
        />
        <div className="w-7 items-center justify-center flex sm:hidden">
          {canRemoveVariant && <CloseButton onRemove={removeVariant} />}
        </div>
      </div>

      <div className="flex space-x-3 sm:ml-0 ml-8">
        {hasProductDiscount && (
          <div className="flex space-x-3 w-full">
            <input
              type="number"
              placeholder="0"
              value={variant.discountValue ?? ""}
              onChange={(e) =>
                updateVariantDiscount("discountValue", Number(e.target.value))
              }
              className="py-2 px-4 w-25 text-sm border rounded-full bg-white border-neutral-400 shadow-sm focus:outline-none"
            />

            <select
              value={variant.discountType ?? "PERCENT"}
              onChange={handleDiscountTypeChange}
              className="py-2 px-2 w-25 text-sm rounded-full border bg-white border-neutral-400 shadow-sm focus:outline-none"
            >
              <option value="PERCENT">% Off</option>
              <option value="FLAT">Flat off</option>
            </select>
          </div>
        )}
        <div className="w-7 items-center justify-center hidden sm:flex">
          {canRemoveVariant && <CloseButton onRemove={removeVariant} />}
        </div>
      </div>
    </div>
  );
};

export default VariantItem;
