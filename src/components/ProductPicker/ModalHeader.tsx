import CloseButton from "../VariantItem/CloseButton";

interface Props {
  onClose: () => void;
}

const ModalHeader = ({ onClose }: Props) => {
  return (
    <div className="p-4 px-5 border-b border-neutral-300 flex justify-between">
      <span className="font-semibold">Select Products</span>
      <CloseButton onRemove={onClose} />
    </div>
  );
};

export default ModalHeader;
