"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  CreditCard,
  FileSpreadsheet,
  Settings,
  History,
  LogOut,
  Flame,
  Menu,
  X,
  Shield,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminName?: string;
}

export default function AdminLayout({ children, adminName = "Race Director" }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/admin/payments", label: "Payment Verification", icon: <CreditCard className="w-4 h-4" /> },
    { href: "/admin/registrations", label: "Registrations", icon: <Users className="w-4 h-4" /> },
    { href: "/admin/audit-log", label: "Audit Log", icon: <History className="w-4 h-4" /> },
    { href: "/admin/settings", label: "Event Settings & QR", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (e) {
      console.error(e);
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0d1322] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg athletic-gradient flex items-center justify-center text-white">
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-black text-sm text-white">Paryavaran Marathon Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#0d1322] border-r border-slate-800 shrink-0 p-5 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Logo & Identity */}
          <div className="hidden md:flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-xl athletic-gradient flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base text-white block">Marathon Admin</span>
              <span className="text-[10px] font-semibold text-orange-400 tracking-wider uppercase">
                Race Operations
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? "athletic-gradient text-white shadow-md shadow-orange-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          <div className="px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Logged in as</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {adminName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
