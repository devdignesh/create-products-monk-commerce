import { IoMdClose } from "react-icons/io";
import type { Product } from "../../types/product";
import VariantItem from "../VariantItem/VariantItem";
import { useProducts } from "../../context/useProducts";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { BiSolidPencil } from "react-icons/bi";

interface Props {
  product: Product;
  index: number;
  total: number;
  openPicker: () => void;
}

const ProductItem = ({ product, index, total, openPicker }: Props) => {
  const { products, setProducts } = useProducts();
  const [showDiscount, setShowDiscount] = useState(!!product.discountValue);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const onVariantDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProducts((prev) =>
      prev.map((p, pIndex) => {
        if (pIndex !== index) return p;

        const oldIndex = p.variants.findIndex((v) => v.id === active.id);
        const newIndex = p.variants.findIndex((v) => v.id === over.id);

        return {
          ...p,
          variants: arrayMove(p.variants, oldIndex, newIndex),
        };
      })
    );
  };

  const showToggle = product.variants.length > 1;

  return (
    <div ref={setNodeRef} style={style} className="m-2 my-3">
      <div className="flex w-full items-center gap-2">
        <span
          {...listeners}
          {...attributes}
          className="cursor-grab text-gray-500"
        >
          <MdDragIndicator size={23} />
        </span>

        <div className="py-1 w-full items-center flex justify-between text-sm px-4 border border-neutral-300 shadow-sm bg-white">
          <input
            value={product.title}
            readOnly
            className="w-full focus:outline-none"
            placeholder="Select Product"
          />
          <button
            className="p-2 cursor-pointer hover:bg-neutral-200"
            onClick={() => openPicker()}
          >
            <BiSolidPencil size={20} className="text-[#008060]" />
          </button>
        </div>

        <div className="flex space-x-3 w-[70%]">
          {!showDiscount ? (
            <button
              onClick={enableDiscount}
              className="text-sm w-full px-4 py-3 cursor-pointer border-2 rounded bg-[#008060] text-white"
            >
              Add Discount
            </button>
          ) : (
            <>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="0"
                  className="py-2 px-4 w-25 border border-neutral-400 shadow-sm focus:outline-none"
                  onChange={(e) =>
                    updateProductDiscount(
                      "discountValue",
                      Number(e.target.value)
                    )
                  }
                  value={product.discountValue || ""}
                />

                <select
                  className="py-2 px-2 w-25 text-sm border border-neutral-400 shadow-sm focus:outline-none"
                  value={product.discountType ?? "PERCENT"}
                  onChange={(e) =>
                    updateProductDiscount("discountType", e.target.value)
                  }
                >
                  <option value="PERCENT">% Off</option>
                  <option value="FLAT">Flat off</option>
                </select>
              </div>
            </>
          )}
          {total > 1 && (
            <button onClick={removeProduct} className="cursor-pointer">
              <IoMdClose size={20} />
            </button>
          )}
        </div>
      </div>
      {showToggle && (
        <span
          onClick={toggleVariants}
          className="text-sm flex justify-end mt-1 mr-9 cursor-pointer text-blue-600 underline"
        >
          {product.isExpanded ? "Hide variants" : "Show variants"}
        </span>
      )}

      {product.isExpanded && (
        <div className="ml-12">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={onVariantDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <SortableContext
              items={product.variants.map((v) => v.id)}
              strategy={verticalListSortingStrategy}
            >
              {product.variants.map((variant) => (
                <VariantItem
                  key={variant.id}
                  variant={variant}
                  productIndex={index}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
