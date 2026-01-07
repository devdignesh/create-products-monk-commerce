import { useProducts } from "../../context/useProducts";
import ProductItem from "../ProductItem/ProductItem";

const ProductList = () => {
  const { products } = useProducts();

  return (
    <div>
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          index={index}
          total={products.length}
        />
      ))}

      <button className="mt-4 w-40 px-4 text-sm py-2 border-2 text-[#008060]">
        Add Product
      </button>
    </div>
  );
};

export default ProductList;
