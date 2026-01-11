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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openPicker = (index: number | null = null) => {
    setEditingIndex(index);
    setPickerOpen(true);
  };

  const handleConfirm = (picked: Product[]) => {
    setProducts((prev) => {
      //  add new products
      if (editingIndex === null) {
        return [...prev, ...picked];
      }

      const editingProduct = prev[editingIndex];

      // If exactly one product picked and it's the SAME product -> merge variants
      if (picked.length === 1 && picked[0].id === editingProduct.id) {
        const existingVariantIds = new Set(
          editingProduct.variants.map((v) => v.id)
        );

        const mergedVariants = [
          ...editingProduct.variants,
          ...picked[0].variants.filter((v) => !existingVariantIds.has(v.id)),
        ];

        const updatedProduct: Product = {
          ...editingProduct,
          variants: mergedVariants,
        };

        return prev.map((p, i) => (i === editingIndex ? updatedProduct : p));
      }

      // Otherwise -> replace edited product
      const before = prev.slice(0, editingIndex);
      const after = prev.slice(editingIndex + 1);

      return [...before, ...picked, ...after];
    });

    setPickerOpen(false);
    setEditingIndex(null);
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

  const addEmptyProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: { id: 0, product_id: Date.now(), src: "" },
        title: "",
        variants: [],
      } as Product,
    ]);
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
              openPicker={() => openPicker(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="flex justify-end mx-10 pt-2">
        <button
          className="w-full sm:w-72 px-4 text-sm py-2 cursor-pointer border-2 border-[#008060] text-[#008060]"
          onClick={addEmptyProduct}
        >
          Add Product
        </button>
      </div>

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ProductList;
