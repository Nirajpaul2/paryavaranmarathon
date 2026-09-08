"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf, Search, ShieldCheck } from "lucide-react";

interface NavbarProps {
  eventName?: string;
}

export default function Navbar({
  eventName = "PARYAVARAN MARATHON",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#051a11]/95 border-b border-emerald-900/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform border border-emerald-400/30">
              <Leaf className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                {eventName}
              </span>
              <span className="block text-[11px] tracking-widest font-semibold text-emerald-400">
                पर्यावरण मैराथन • मालती, समस्तीपुर
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              href="/#prizes"
              className="text-sm font-semibold text-emerald-100 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span className="text-amber-400">🏆</span> पुरस्कार सूची
            </Link>
            <Link
              href="/#details"
              className="text-sm font-medium text-emerald-200 hover:text-emerald-400 transition-colors"
            >
              दौड़ विवरण
            </Link>
            <Link
              href="/#route"
              className="text-sm font-medium text-emerald-200 hover:text-emerald-400 transition-colors"
            >
              5 KM Route
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-emerald-200 hover:text-emerald-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-emerald-200 hover:text-emerald-400 transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-emerald-200 hover:text-emerald-400 transition-colors"
            >
              संपर्क
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/lookup"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-800/80 bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-bold text-emerald-200 hover:text-white transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Check Status
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg eco-gradient hover:opacity-95 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
            >
              <span>Register Now (₹99)</span>
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-emerald-600 hover:text-emerald-400 flex items-center gap-1 pl-2"
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
              className="p-2 text-emerald-300 hover:text-white"
              title="Check Registration"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#072418] border-b border-emerald-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#prizes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-amber-300 hover:text-amber-200"
          >
            🏆 आकर्षक पुरस्कार सूची (Cycle, Shoes, Jersey)
          </Link>
          <Link
            href="/#details"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-100 hover:text-emerald-300"
          >
            दौड़ विवरण (5 KM Run)
          </Link>
          <Link
            href="/#route"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-100 hover:text-emerald-300"
          >
            5 KM Route
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-100 hover:text-emerald-300"
          >
            About Event
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-100 hover:text-emerald-300"
          >
            FAQs
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-100 hover:text-emerald-300"
          >
            Contact (8340477782)
          </Link>
          <div className="pt-4 border-t border-emerald-900 space-y-3">
            <Link
              href="/lookup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-emerald-800 bg-emerald-950 text-sm font-semibold text-emerald-200"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Check My Registration Status
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg eco-gradient text-sm font-bold text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
            >
              Register Now (₹99)
            </Link>
            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-emerald-500 hover:text-emerald-300"
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
