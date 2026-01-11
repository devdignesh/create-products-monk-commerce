import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Product } from "../../types/product";
import VariantItem from "../VariantItem/VariantItem";

interface Props {
  product: Product;
  productIndex: number;
  onVariantDragEnd: (event: any) => void;
}

const VariantList = ({ product, productIndex, onVariantDragEnd }: Props) => {
  return (
    <div className="ml-14 sm:ml-16">
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
              productIndex={productIndex}
              hasProductDiscount={!!product.discountValue}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default VariantList;
