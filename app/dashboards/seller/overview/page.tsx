import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DashboardSummary from "../components/DashboardSummary";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <section className="flex  flex-wrap items-center gap-4 justify-between w-full">
        <span>
          <h1 className="text-xl font-semibold">Welcome to your dashboard!</h1>
          <p className="text-gray-400">Here you can manage your store and products</p>
        </span>
        <Link href="/dashboards/seller/create-shoes">
          <button className="flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 py-2 px-6 cursor-pointer rounded-md transition-colors duration-150">
            <PlusIcon />
            Add New Shoes
          </button>
        </Link>
      </section>
      <section className="flex flex-col gap-4 mt-10">
        <DashboardSummary />
      </section>
    </div>
  );
}