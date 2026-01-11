import { IoMdClose } from "react-icons/io";

const ColseButton = ({
  onRemove,
  size = 18,
}: {
  onRemove: () => void;
  size?: number;
}) => {
  return (
    <button onClick={onRemove} className="text-neutral-800 cursor-pointer">
      <IoMdClose size={size} />
    </button>
  );
};
export default ColseButton;
