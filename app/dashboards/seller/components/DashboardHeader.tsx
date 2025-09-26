"use client";

import { DoubleArrowRightIcon, Cross2Icon, ArchiveIcon, DashboardIcon, PaperPlaneIcon, SymbolIcon, TriangleLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboards/seller",
      icon: <DashboardIcon />,
      label: "Overview",
    },
    {
      href: "/dashboards/seller/inventory",
      icon: <ArchiveIcon />,
      label: "Inventory",
    },
    {
      href: "#",
      icon: <SymbolIcon />,
      label: "Orders",
    },
    {
      href: "#",
      icon: <PaperPlaneIcon />,
      label: "Messages",
    },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col text-sm">
      <header className="flex justify-between items-center p-4 w-full h-16 bg-white/80 backdrop-blur-[3px] border-b border-gray-200 fixed z-50">
        <span className="flex items-center gap-2">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden cursor-pointer border border-gray-100 bg-gray-100 hover:border-gray-200 p-2"
          >
            <DoubleArrowRightIcon />
          </button>
          <h1 className="text-xl font-semibold">250 Kicks</h1>
        </span>
        <span className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pr-5">
          <h1 className="bg-white rounded-full p-2 w-[40px] h-[40px] flex items-center justify-center border border-gray-300">A</h1>
          <p className="text-sm font-medium">Hello, Seller</p>
        </span>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/50 backdrop-blur-[1px] z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
            <h1 className="font-semibold">MENU</h1>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Cross2Icon />
            </button>
          </div>

          <div className="flex-1 flex-col px-4">
            <span className="flex flex-col justify-start items-center gap-2 p-2 border border-gray-200 w-full mt-16">
              <p className="font-semibold">SNEAKER NATION</p>
              <p className="bg-green-500/10 text-green-500 rounded-full px-4 py-1 flex items-center gap-2">
                <span className="bg-green-500 rounded-full w-2 h-2"></span>
                Active
              </p>
            </span>

            {/* Navigation Links */}
            <nav className="flex-1 mt-5">
              <div className="space-y-2">
                <h3 className="text-gray-500 text-sm font-medium mb-3">Operations</h3>
                {links.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={toggleMobileSidebar}
                      className={`flex items-center gap-3 p-3 transition-colors duration-150 ${isActive
                        ? 'bg-[#CA425A]/10 border border-[#CA425A]/15 text-[#CA425A]'
                        : 'bg-gray-50 border border-white hover:border-gray-200'
                        }`}
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* sidebar items */}
          <footer className="flex flex-col gap-5 p-4">
            <Link href="/" className="border flex items-center justify-center border-[#CA425A] text-[#CA425A] p-3 w-full cursor-pointer hover:bg-[#CA425A] hover:text-white transition-colors duration-150">
              <TriangleLeftIcon />
              Logout
            </Link>
            <hr className="border-gray-200" />
            <span className="p-2 bg-gray-50 w-full">
              <p className="font-medium">Kagibwami Nyawe</p>
              <p className="text-gray-500">seller@250kicks.com</p>
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}