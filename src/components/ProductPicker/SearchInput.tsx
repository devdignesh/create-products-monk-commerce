import { IoSearchOutline } from "react-icons/io5";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: Props) => {
  return (
    <div className="shadow-sm">
      <div className="flex gap-2 items-center m-4 mx-5 px-3 py-2 border text-[15px] border-neutral-300 focus:outline-none">
        <IoSearchOutline size={20} className="text-neutral-400" />
        <input
          className="focus:outline-none w-full focus:border-none text-sm"
          placeholder="Search products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
