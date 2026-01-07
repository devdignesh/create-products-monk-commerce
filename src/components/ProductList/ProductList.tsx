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
    </div>
  );
};

export default ProductList;
