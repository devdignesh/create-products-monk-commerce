import { MdDragIndicator } from "react-icons/md";

interface Props {
  attributes?: any;
  listeners?: any;
  size?: number;
}

const DragHandle = ({ attributes, listeners, size = 24 }: Props) => {
  return (
    <span {...listeners} {...attributes} className="cursor-grab text-gray-500">
      <MdDragIndicator size={size} />
    </span>
  );
};

export default DragHandle;
