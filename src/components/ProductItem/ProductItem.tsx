import { IoMdClose } from "react-icons/io";
import type { Product } from "../../types/product";
import VariantItem from "../VariantItem/VariantItem";

interface Props {
  product: Product;
  index: number;
  total: number;
}

const ProductItem = ({ product }: Props) => {
  return (
    <div className="p-4 bg-white rounded mb-2">
      <div className="flex items-center gap-2">
        <input
          value={product.title}
          readOnly
          className="py-2 flex-1 text-sm px-4 border rounded shadow-sm"
        />

        <input type="number" className="py-2 px-4 w-20 border rounded" />

        <select className="py-2 px-4 border rounded">
          <option value="PERCENT">% Off</option>
          <option value="FLAT">Flat off</option>
        </select>

        <button>
          <IoMdClose size={20} />
        </button>
      </div>

      <div>
        {product.variants.map((variant) => (
          <VariantItem key={variant.id} variant={variant} />
        ))}
      </div>
    </div>
  );
};

export default ProductItem;
