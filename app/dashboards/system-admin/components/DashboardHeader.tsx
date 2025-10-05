"use client";

import { DoubleArrowRightIcon, TriangleLeftIcon, PersonIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@radix-ui/themes";
import { useUsers } from "@/app/components/hooks/useUser";
import { LayoutDashboard, User, Users } from "lucide-react";

export default function DashboardHeader() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, isLoadingProfile, logout } = useUsers();

  const links = [
    {
      href: "/dashboards/system-admin",
      icon: <LayoutDashboard strokeWidth={1.5} size={16} />,
      label: "Overview",
    },
    {
      href: "/dashboards/system-admin/users",
      icon: <Users strokeWidth={1.5} size={16} />,
      label: "Users",
    },
    {
      href: "/dashboards/system-admin/profile",
      icon: <User strokeWidth={1.5} size={16} />,
      label: "Profile",
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
            className="md:hidden cursor-pointer border border-gray-100 bg-gray-100 hover:border-gray-200 p-2 rounded-full"
          >
            <DoubleArrowRightIcon />
          </button>
          <h1 className="text-xl font-semibold">FanStock</h1>
        </span>
        <span className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pr-5">
          <h1 className="bg-white rounded-full p-2 w-[35px] h-[35px] flex items-center justify-center border border-gray-300">{profile?.name?.charAt(0).toUpperCase()}</h1>
          <p className="text-sm font-medium">Hello, {profile?.name || 'Loading...'}</p>
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
        {/* Sidebar Header */}
        {/* <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <h1 className="font-semibold">MENU</h1>
          <button
            onClick={toggleMobileSidebar}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <Cross2Icon />
          </button>
        </div> */}

        <div className="flex flex-col justify-between h-full">
          <div className="p-6">
            {/* Navigation Links */}
            <div className="mt-8">
              <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                Operations
              </h2>
              <div className="space-y-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                    >
                      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {link.icon}
                      </div>
                      <span className="font-medium">{link.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {/* sidebar items */}
          <div className="p-6 space-y-4">
            {/* Logout Button */}
            <Link
              href="/"
              className="flex gap-2 px-4 py-2 border border-transparent rounded-md items-center justify-center bg-gray-100 hover:border hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
              onClick={logout}
            >
              <TriangleLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200 " />
              <span>Logout</span>
            </Link>

            {/* User Profile Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <PersonIcon />
                </div>
                <div className="flex-1 min-w-0">
                  {isLoadingProfile ? (
                    <div className="space-y-2">
                      <Skeleton />
                      <Skeleton />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-800 truncate">
                        {profile?.name || 'Loading...'}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {profile?.email || 'user@example.com'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}