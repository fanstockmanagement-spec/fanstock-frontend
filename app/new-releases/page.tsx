"use client";

import { BoxIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import ShoeCard from "../components/shoe-card";
import { NavigationBar } from "../components/navigation-bar";

export default function NewReleasesPage() {
  const [showModelBrands, setShowModelBrands] = useState(false);

  const modelBrandFilter = () => {
    setShowModelBrands(!showModelBrands);
  }
  const models = [
    {
      name: "Air Jordan 1",
      value: "air-jordan-1"
    },
    
    {
      name: "Air Jordan 2",
      value: "air-jordan-1"
    },
    
    
    {
      name: "Air Jordan 3",
      value: "air-jordan-1"
    },

    {
      name: "Nike Air Max 1",
      value: "air-jordan-1"
    },
    
    {
      name: "Nike Air Max 2",
      value: "air-jordan-1"
    },
    
    
    
  ]
  return (
    <main className="flex flex-col min-h-screen text-sm">
      <NavigationBar />
      <section className="flex flex-col items-center justify-center py-6 pt-32 pb-16">
        <h1 className="text-xl font-semibold uppercase">New Releases</h1>
        <p className="text-center w-full md:w-1/2 text-gray-400 mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis similique repudiandae nihil, minima aliquid nisi. Reiciendis soluta fugit debitis doloribus. Aperiam et pariatur nesciunt voluptas recusandae cupiditate, magnam aut facere.</p>

      </section>

      <section className="bg-[#F9F9F9] min-h-screen flex flex-col gap-4 p-4">
        <div className="flex items-center flex-row gap-10 flex-wrap">
          <h3 className="font-semibold uppercase">Filter By Category</h3>
          <h3>Resultrs: 200</h3>
        </div>

        <div className="flex flex-row gap-5 w-full mt-5">

          {/* filetrs */}
          <div className="w-1/5">
            <div>
              <h3 onClick={modelBrandFilter} className="flex items-center gap-2 justify-between w-full border border-gray-200 bg-white p-3 cursor-pointer">
                MODEL
                <CaretDownIcon className={`transition-all duration-150 ${showModelBrands ? 'rotate-180' : ''}`} />
              </h3>
              <span className={`flex flex-col gap-2 border-t-0 border border-gray-200 bg-white p-3 h-[150px] overflow-y-auto ${showModelBrands ? 'block ' : 'hidden'}`}>
                {models.map((model) => (
                  <h3 key={model.value} className="px-3 py-1 flex items-center gap-2 text-[12px] cursor-pointer hover:text-[#CA425A] transition-all duration-150">
                    <BoxIcon />
                    {model.name}
                  </h3>
                ))}
              </span>
            </div>
          </div>

          {/* shoes cards */}
          <div className="w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <ShoeCard />
          </div>
        </div>
      </section>
    </main>
  );
}