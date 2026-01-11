import ProductList from "../components/ProductList/ProductList";

const ProductBuilder = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-0">
      <h3 className="font-semibold py-4 text-neutral-700">Add products</h3>
      <div className="items-center font-semibold text-neutral-700 justify-between mx-10 hidden sm:flex">
        <span>Product</span>
        <span className="w-[35%]">Discount</span>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductBuilder;
