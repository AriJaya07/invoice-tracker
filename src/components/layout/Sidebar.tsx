"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  CreditCard, 
  TrendingUp,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: TrendingUp, label: "Income", href: "/dashboard/income" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/subscription" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, user } = useUser();

  return (
    <aside 
      className={`
        flex flex-col border-r bg-white transition-all duration-300 h-screen sticky top-0
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Invoice<span className="text-blue-600">Flow</span>
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                ${isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        {!isCollapsed && user && (
          <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {user.name?.[0] || user.email?.[0]?.toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</p>
               <p className="text-xs text-gray-500 truncate">{user.email}</p>
             </div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
