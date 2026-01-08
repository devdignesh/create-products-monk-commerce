import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import type { Product } from "../../types/product";
import type { Variant } from "../../types/variant";

interface SelectState {
  [productId: number]: {
    product: Product;
    variants: Record<number, Variant>;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (products: Product[]) => void;
}

const ProductPickerModal = ({ open, onClose, onConfirm }: Props) => {
  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<SelectState>({});
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const fetchProducts = async (reset = false) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}?search=${search}&page=${
        reset ? 0 : page
      }&limit=10`,
      {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      }
    );
    const data = await res.json();
    setItems((prev) => (reset ? data : [...prev, ...data]));
  };

  useEffect(() => {
    if (open) {
      setSelected({});
      setPage(0);
      fetchProducts(true);
    }
  }, [open]);

  const toggleProduct = (product: Product) => {
    setSelected((prev) => {
      if (prev[product.id]) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }

      return {
        ...prev,
        [product.id]: {
          product,
          variants: Object.fromEntries(product.variants.map((v) => [v.id, v])),
        },
      };
    });
  };

  const toggleVariant = (product: Product, variant: Variant) => {
    setSelected((prev) => {
      const entry = prev[product.id];

      if (!entry) {
        return {
          ...prev,
          [product.id]: {
            product,
            variants: { [variant.id]: variant },
          },
        };
      }

      const variants = { ...entry.variants };
      if (variants[variant.id]) delete variants[variant.id];
      else variants[variant.id] = variant;

      if (Object.keys(variants).length === 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }

      return {
        ...prev,
        [product.id]: { product, variants },
      };
    });
  };

  const confirmSelection = () => {
    const result: Product[] = Object.values(selected).map(
      ({ product, variants }) => ({
        ...product,
        variants: Object.values(variants),
        isExpanded: false,
        discountType: "PERCENT",
        discountValue: 0,
      })
    );

    onConfirm(result);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-165 max-h-[80vh] rounded shadow flex flex-col">
        <div className="p-4 px-5 border-b border-neutral-300  flex justify-between">
          <span className="font-semibold">Select Products</span>
          <button onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        <input
          className="m-4 mx-5 px-3 py-2 border text-[15px] border-neutral-300 focus:outline-none"
          placeholder="Search products"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
            fetchProducts(true);
          }}
        />

        <div
          className="flex-1 overflow-auto border-y py-2 border-neutral-300 "
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
              setPage((p) => p + 1);
              fetchProducts();
            }
          }}
        >
          {items.map((product) => {
            const selectedProduct = selected[product.id];
            const allVariantsSelected =
              selectedProduct &&
              Object.keys(selectedProduct.variants).length ===
                product.variants.length;

            return (
              <div key={product.id} className="">
                <div className="flex items-center gap-3 px-5">
                  <input
                    type="checkbox"
                    checked={!!selectedProduct && allVariantsSelected}
                    onChange={() => toggleProduct(product)}
                    className="h-4 w-4"
                  />

                  <img
                    src={product.image?.src || ""}
                    className="w-9 h-9 rounded overflow-hidden bg-gray-100 object-cover"
                  />

                  <span className="text-[15px]">{product.title}</span>
                </div>

                <div className="py-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center pl-12 gap-3 px-3 py-4 border-y border-neutral-300"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!!selectedProduct?.variants[variant.id]}
                        onChange={() => toggleVariant(product, variant)}
                      />
                      <span className="flex-1 pl-5 text-[15px]">
                        {variant.title}
                      </span>
                      <div className="flex gap-6">
                        {variant.inventory_quantity && (
                          <span className="flex-1">
                            {variant.inventory_quantity} available
                          </span>
                        )}
                        <span className="text-[15px]">${variant.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={confirmSelection}
            className="px-4 py-2 bg-[#008060] text-white rounded"
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPickerModal;
