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
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const openPicker = (index: number) => {
    setReplaceIndex(index);
    setPickerOpen(true);
  };

  const handleConfirm = (picked: Product[]) => {
    if (replaceIndex === null) return;

    setProducts((prev) => {
      const copy = [...prev];
      copy.splice(replaceIndex, 1, ...picked);
      return copy;
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
