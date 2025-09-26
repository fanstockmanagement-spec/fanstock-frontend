import { PlusIcon } from "@radix-ui/react-icons";
import OverviewCards from "../components/OverviewCards";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <section className="flex  flex-wrap items-center gap-4 justify-between w-full">
        <span>
          <h1 className="text-xl font-semibold">Welcome to dashboard</h1>
          <p className="text-gray-400">Here you can manage your store and products</p>
        </span>
        <button className="flex items-center gap-2 text-white bg-blue-500 p-3 cursor-pointer  hover:bg-blue-500/90 transition-colors duration-150">
          <PlusIcon />
          Add New Shoes
        </button>
      </section>
      <section className="flex flex-col gap-4 mt-10">
        <OverviewCards />
      </section>
    </div>
  );
}