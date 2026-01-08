import { IoMdClose } from "react-icons/io";
import { useProducts } from "../../context/useProducts";
import type { Variant } from "../../types/variant";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

interface Props {
  variant: Variant;
  productIndex: number;
}

const VariantItem = ({ variant, productIndex }: Props) => {
  const { setProducts } = useProducts();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 my-4"
    >
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

      <div className="flex space-x-3 w-[70%]">
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
          onChange={(e) =>
            updateVariantDiscount("discountType", e.target.value)
          }
          className="py-2 px-2 w-25 text-sm rounded-full border bg-white border-neutral-400 shadow-sm focus:outline-none"
        >
          <option value="PERCENT">% Off</option>
          <option value="FLAT">Flat off</option>
        </select>
      </div>
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
