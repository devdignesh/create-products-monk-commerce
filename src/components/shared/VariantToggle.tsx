import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

const VariantToggle = ({ isExpanded, onToggle }: Props) => {
  return (
    <span
      onClick={onToggle}
      className="text-sm flex gap-1 items-center text-center justify-end mt-1 mr-9 cursor-pointer text-blue-600 underline"
    >
      {isExpanded ? (
        <>
          Hide variants <IoIosArrowUp size={15} className="mt-1" />
        </>
      ) : (
        <>
          Show variants <IoIosArrowDown size={15} className="mt-1" />
        </>
      )}
    </span>
  );
};

export default VariantToggle;
