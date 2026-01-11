import { Logo } from "./Logo";
import ProductBuilder from "./pages/ProductBuilder";

function App() {
  return (
    <div className="bg-neutral-100 min-h-screen ">
      <div className="p-4 border-b border-neutral-300 flex items-center gap-2">
        <Logo size={30} />
        <span className="font-semibold text-neutral-700">
          Monk Upsell & Cross-sell
        </span>
      </div>
      <ProductBuilder />
    </div>
  );
}

export default App;
