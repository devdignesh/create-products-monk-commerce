import type { Variant } from "../../types/variant";

const VariantItem = ({ variant }: { variant: Variant }) => {
  return (
    <div>
      <span>{variant.title}</span>
    </div>
  );
};

export default VariantItem;
