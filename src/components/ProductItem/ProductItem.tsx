import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import { useProducts } from "../../context/useProducts";
import type { Product } from "../../types/product";
import type { DiscountType } from "../../types/variant";
import DragHandle from "../shared/DragHandle";
import ProductTitleInput from "../shared/ProductTitleInput";
import DiscountSection from "../shared/DiscountSection";
import VariantToggle from "../shared/VariantToggle";
import VariantList from "./VariantList";
import CloseButton from "../VariantItem/CloseButton";

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
    value: "PERCENT" | "FIXED" | DiscountType | number
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

  const onVariantDragEnd = (event: {
    active: { id: number };
    over: { id: number } | null;
  }) => {
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

  const canRemove = total > 1;

  return (
    <div ref={setNodeRef} style={style} className="m-2 my-4">
      <div className="flex flex-col sm:flex-row sm:flex w-full sm:items-center gap-2">
        <div className="flex w-full items-center gap-1 sm:gap-2">
          <DragHandle attributes={attributes} listeners={listeners} />

          <span className="text-sm text-neutral-600 pr-1 font-medium">
            {index + 1}.
          </span>

          <ProductTitleInput value={product.title} onEdit={openPicker} />

          <div className="w-7 items-center flex sm:hidden justify-center">
            {canRemove && <CloseButton onRemove={removeProduct} size={20} />}
          </div>
        </div>

        <div className="flex space-x-3 w-[50%] sm:w-[70%] ml-12 sm:ml-0">
          <DiscountSection
            showDiscount={showDiscount}
            discountValue={product.discountValue}
            discountType={product.discountType as DiscountType}
            onEnableDiscount={enableDiscount}
            onDiscountChange={updateProductDiscount}
          />

          <div className="w-7 items-center hidden sm:flex justify-center">
            {canRemove && <CloseButton onRemove={removeProduct} size={20} />}
          </div>
        </div>
      </div>

      {product.variants.length > 1 && (
        <VariantToggle
          isExpanded={product.isExpanded ?? false}
          onToggle={toggleVariants}
        />
      )}

      {(product.variants.length === 1 || product.isExpanded) && (
        <VariantList
          product={product}
          productIndex={index}
          onVariantDragEnd={onVariantDragEnd}
        />
      )}
    </div>
  );
};

export default ProductItem;
