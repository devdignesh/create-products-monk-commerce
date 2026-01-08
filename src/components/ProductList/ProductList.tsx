import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useProducts } from "../../context/useProducts";
import ProductItem from "../ProductItem/ProductItem";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useState } from "react";
import type { Product } from "../../types/product";
import ProductPickerModal from "../ProductPicker/ProductPickerModal";

const ProductList = () => {
  const { products, setProducts } = useProducts();
  const [pickerOpen, setPickerOpen] = useState(false);

  const openPicker = () => {
    setPickerOpen(true);
  };

  const handleConfirm = (picked: Product[]) => {
    setProducts((prev) => {
      const updated = [...prev];

      picked.forEach((newProduct) => {
        const existingIndex = updated.findIndex((p) => p.id === newProduct.id);

        if (existingIndex === -1) {
          // New product
          updated.push(newProduct);
        } else {
          // Merge variants
          const existing = updated[existingIndex];
          const mergedVariants = [
            ...existing.variants,
            ...newProduct.variants.filter(
              (v) => !existing.variants.some((ev) => ev.id === v.id)
            ),
          ];

          updated[existingIndex] = {
            ...existing,
            variants: mergedVariants,
          };
        }
      });

      return updated;
    });

    setPickerOpen(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProducts((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {products.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              index={index}
              total={products.length}
              openPicker={openPicker}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button className="mt-4 w-40 px-4 text-sm py-2 border-2 text-[#008060]">
        Add Product
      </button>

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ProductList;
