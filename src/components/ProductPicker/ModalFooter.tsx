interface Props {
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalFooter = ({ selectedCount, onClose, onConfirm }: Props) => {
  return (
    <div className="p-4 px-5 flex justify-between items-center">
      <span className="text-sm">{selectedCount} products selected</span>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 sm:text-base text-sm border cursor-pointer border-neutral-500 rounded"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-[#008060] sm:text-base text-sm text-white rounded cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;
