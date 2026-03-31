"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Box, FileText, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      router.push("/login");
    } catch {
      // Force exit on client if network fails
      logout();
      router.push("/login");
    }
  };

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Items", href: "/dashboard/items", icon: Box },
    { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#080808] text-white selection:bg-white/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/[0.08] hidden md:flex flex-col bg-[#0a0a0a]">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
          <span className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity cursor-pointer">
            NanoBill
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            // Match exactly or startswith for active state tracking
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-white/[0.08] text-white" : "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.08]">
          <button 
             onClick={handleLogout}
             className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-neutral-400 hover:bg-white/[0.05] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Feature Content wrapper */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
         {/* Mobile Header (Hidden on Desktop) */}
         <header className="md:hidden h-16 border-b border-white/[0.08] flex items-center px-6 bg-[#0a0a0a]">
            <span className="text-xl font-bold tracking-tight">NanoBill</span>
         </header>

         <div className="flex-1 p-6 md:p-10">
            {children}
         </div>
      </main>
    </div>
  );
}
