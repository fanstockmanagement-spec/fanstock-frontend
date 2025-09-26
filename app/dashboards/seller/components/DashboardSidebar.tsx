"use client";

import { ArchiveIcon, DashboardIcon, PaperPlaneIcon, SymbolIcon, TriangleLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
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
    // {
    //   href: "#",
    //   icon: <PaperPlaneIcon />,
    //   label: "Messages",
    // },
  ];
  return (
    <nav className="hidden md:flex flex-col justify-between w-66 h-screen pt-26 bg-white border-r border-gray-200 p-4 text-sm sticky top-0">
      <main className="w-full flex flex-col gap-4">
        {/* sidebar header */}
        <span className="flex flex-col justify-start items-center gap-2 p-2 border border-gray-200 w-full">
          <p className="font-semibold">SNEAKER NATION</p>
          <p className="bg-green-500/10 text-green-500 rounded-full px-4 py-1 flex items-center gap-2">
            <span className="bg-green-500 rounded-full w-2 h-2"></span>
            Active
          </p>
        </span>

        {/* sidebar links */}

        <div className="flex flex-col gap-2 mt-5">
          <h1 className="text-gray-500">Operations</h1>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-2 p-3 border transition-colors duration-150 ${
                  isActive 
                    ? 'bg-[#CA425A]/10 border-[#CA425A]/15 text-[#CA425A]' 
                    : 'bg-gray-50 border-white hover:border-gray-200'
                }`}
              >
                {link.icon}
                <p className="flex items-center gap-2">{link.label}</p>
              </Link>
            );
          })}
        </div>
      </main>
      {/* sidebar items */}
    <footer className="flex flex-col gap-5">
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
    </nav>
  );
}