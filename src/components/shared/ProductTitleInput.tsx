import { BiSolidPencil } from "react-icons/bi";

interface Props {
  value: string;
  placeholder?: string;
  onEdit: () => void;
}

const ProductTitleInput = ({
  value,
  placeholder = "Select Product",
  onEdit,
}: Props) => {
  return (
    <div className="py-1 w-full items-center flex justify-between text-sm px-2 sm:px-4 border border-neutral-300 shadow-sm bg-white">
      <input
        value={value}
        readOnly
        className="w-full focus:outline-none"
        placeholder={placeholder}
      />
      <button
        className="p-2 cursor-pointer hover:bg-neutral-200"
        onClick={onEdit}
      >
        <BiSolidPencil size={18} className="text-[#008060]" />
      </button>
    </div>
  );
};

export default ProductTitleInput;
