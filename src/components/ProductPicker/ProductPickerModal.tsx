import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types/product";
import type { Variant } from "../../types/variant";
import { useProducts } from "../../context/useProducts";
import ModalHeader from "./ModalHeader";
import SearchInput from "./SearchInput";
import LoadingSpinner from "./LoadingSpinner";
import ProductList from "./ProductList";
import ModalFooter from "./ModalFooter";

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
  const { products: existingProducts } = useProducts();

  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<SelectState>({});
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const existingVariantIds = useMemo(() => {
    return new Set(
      existingProducts.flatMap((p) => p.variants.map((v) => v.id))
    );
  }, [existingProducts]);

  const fetchProducts = async (reset = false) => {
    if (loading) return;
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
    setLoading(false);
    setInitialLoading(false);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setSelected({});
        setItems([]);
        setPage(0);
        setInitialLoading(true);
        fetchProducts(true);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
    fetchProducts(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setPage((p) => p + 1);
      fetchProducts();
    }
  };

  const toggleProduct = (product: Product) => {
    const selectableVariants = product.variants.filter(
      (v) => !existingVariantIds.has(v.id)
    );
    if (selectableVariants.length === 0) return;

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
    if (existingVariantIds.has(variant.id)) return;

    setSelected((prev) => {
      const entry = prev[product.id] ?? {
        product,
        variants: {},
      };

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
      ({ product, variants }) => {
        const variantList = Object.values(variants);
        return {
          ...product,
          variants: variantList,
          isExpanded: variantList.length > 1 ? false : true,
          discountType: "PERCENT",
          discountValue: 0,
        };
      }
    );

    onConfirm(result);
  };

  const selectedCount = Object.keys(selected).length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-165 max-h-[80vh] mx-4 rounded shadow flex flex-col">
        <ModalHeader onClose={onClose} />

        <SearchInput value={search} onChange={handleSearchChange} />

        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <ProductList
            products={items}
            selected={selected}
            existingVariantIds={existingVariantIds}
            onToggleProduct={toggleProduct}
            onToggleVariant={toggleVariant}
            onScroll={handleScroll}
          />
        )}

        <ModalFooter
          selectedCount={selectedCount}
          onClose={onClose}
          onConfirm={confirmSelection}
        />
      </div>
    </div>
  );
};

export default ProductPickerModal;
