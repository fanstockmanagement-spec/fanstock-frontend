"use client";

import { useUsers } from "@/app/components/hooks/useUser";
import { TriangleLeftIcon, PersonIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@radix-ui/themes";
import { LayoutDashboard, User, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
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
    {
      href: "/dashboards/system-admin/inquiries",
      icon: <MessageCircle strokeWidth={1.5} size={16} />,
      label: "Inquiries",
    },
  ];

  return (
    <nav className="hidden md:flex flex-col justify-between w-full md:w-66 pt-26 h-screen bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm sticky top-0 text-sm">
      {/* Header Section */}
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

      {/* Footer Section */}
      <div className="p-6 space-y-4">
        {/* Logout Button */}
        <Link
          href="/"
          onClick={logout}
          className="flex gap-2 px-4 py-2 border border-transparent rounded-md items-center justify-center bg-gray-100 hover:border hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
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
    </nav>
  );
}