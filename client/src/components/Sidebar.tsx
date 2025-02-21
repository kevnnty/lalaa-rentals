"use client";

import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { BookImageIcon, Calendar, House, LayoutDashboard, Settings, SidebarClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hostNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "My Properties", icon: Calendar },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
];

const renterNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Available Properties", icon: Calendar },
  { href: "/dashboard/my-bookings", label: "My bookings", icon: BookImageIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const navLinks = currentUser?.role === "HOST" ? hostNavLinks : renterNavLinks;

  return (
    <div className="w-[280px] h-screen sticky top-0 bg-slate-50 py-6 pl-6">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold flex items-center gap-1">
          <House className="text-blue-500" /> Prody
        </span>
      </div>

      <div className="space-y-2 mt-5">
        <span className="uppercase text-[15px] text-slate-400 font-medium">Menu</span>
        <div className="flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (pathname.startsWith(href + "/dashboard") && href !== "/dashboard");

            return (
              <Link key={href} href={href} aria-current={isActive ? "page" : undefined}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}>
                  <Icon size={18} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
