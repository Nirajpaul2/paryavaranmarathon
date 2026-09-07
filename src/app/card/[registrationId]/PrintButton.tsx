"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl athletic-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
    >
      <Printer className="w-4 h-4" />
      <span>Print / Download PDF</span>
    </button>
  );
}
