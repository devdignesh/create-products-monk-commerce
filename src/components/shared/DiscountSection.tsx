import type { DiscountType } from "../../types/variant";

interface Props {
  showDiscount: boolean;
  discountValue?: number;
  discountType?: DiscountType;
  onEnableDiscount: () => void;
  onDiscountChange: (
    field: "discountType" | "discountValue",
    value: any
  ) => void;
}

const DiscountSection = ({
  showDiscount,
  discountValue,
  discountType = "PERCENT",
  onEnableDiscount,
  onDiscountChange,
}: Props) => {
  if (!showDiscount) {
    return (
      <button
        onClick={onEnableDiscount}
        className="text-sm w-full py-3 cursor-pointer rounded bg-[#008060] text-white"
      >
        Add Discount
      </button>
    );
  }

  return (
    <div className="flex gap-2 w-full">
      <input
        type="number"
        placeholder="0"
        className="py-2 px-2 w-full border border-neutral-400 shadow-sm focus:outline-none"
        onChange={(e) =>
          onDiscountChange("discountValue", Number(e.target.value))
        }
        value={discountValue || ""}
      />
      <select
        className="py-2 px-2 w-full text-sm border border-neutral-400 shadow-sm focus:outline-none"
        value={discountType}
        onChange={(e) => onDiscountChange("discountType", e.target.value)}
      >
        <option value="PERCENT">% Off</option>
        <option value="FLAT">Flat off</option>
      </select>
    </div>
  );
};

export default DiscountSection;
