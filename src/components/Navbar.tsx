"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Flame, Search, ShieldCheck } from "lucide-react";

interface NavbarProps {
  eventName?: string;
}

export default function Navbar({ eventName = "10K CITY MARATHON" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f19]/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl athletic-gradient flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                {eventName}
              </span>
              <span className="block text-[10px] tracking-widest font-semibold uppercase text-orange-400">
                Official Registration Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#about"
              className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
            >
              Race Details
            </Link>
            <Link
              href="/#route"
              className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
            >
              10 KM Route
            </Link>
            <Link
              href="/#benefits"
              className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
            >
              Benefits &amp; Kit
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/lookup"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-sm font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <Search className="w-4 h-4 text-orange-400" />
              Check Registration
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg athletic-gradient hover:opacity-95 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Register Now
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 pl-2"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/lookup"
              className="p-2 text-slate-400 hover:text-white"
              title="Check Registration"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1626] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-orange-400"
          >
            Race Details
          </Link>
          <Link
            href="/#route"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-orange-400"
          >
            10 KM Route
          </Link>
          <Link
            href="/#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-orange-400"
          >
            Benefits &amp; Kit
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-orange-400"
          >
            FAQs
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-orange-400"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <Link
              href="/lookup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-200"
            >
              <Search className="w-4 h-4 text-orange-400" />
              Check My Registration
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg athletic-gradient text-sm font-bold text-white shadow-lg shadow-orange-500/30"
            >
              Register Now (₹100)
            </Link>
            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Organizer / Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
