import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useProducts } from "../../context/useProducts";
import ProductItem from "../ProductItem/ProductItem";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";

const ProductList = () => {
  const { products, setProducts } = useProducts();

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
            />
          ))}
        </SortableContext>
      </DndContext>
      <button className="mt-4 w-40 px-4 text-sm py-2 border-2 text-[#008060]">
        Add Product
      </button>
    </div>
  );
};

export default ProductList;
