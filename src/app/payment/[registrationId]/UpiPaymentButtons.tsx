"use client";

import React, { useState } from "react";
import {
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface UpiPaymentButtonsProps {
  upiId: string;
  payeeName: string;
  amount: number;
  participantName: string;
}

export default function UpiPaymentButtons({
  upiId,
  payeeName,
  amount,
  participantName,
}: UpiPaymentButtonsProps) {
  const [copied, setCopied] = useState(false);

  const cleanNote = `Paryavaran Marathon - ${participantName}`.slice(0, 50);

  // Standard UPI URI specifications
  const universalUpiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
  const phonePeUrl = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
  const gPayUrl = `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
  const paytmUrl = `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;

  const handleCopyUpi = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = upiId;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy UPI ID:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile 1-Tap Header Badge */}
      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3.5 text-left shadow-lg">
        <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wide">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Pay from Mobile (1-Tap App Opener)</span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          Tap below to directly open your installed payment app with Payee (
          <strong className="text-white">{payeeName}</strong>) and Amount (
          <strong className="text-emerald-400">₹{amount}</strong>) pre-filled!
        </p>
      </div>

      {/* Primary 1-Tap Universal UPI Button */}
      <a
        href={universalUpiUrl}
        className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:opacity-95 active:scale-[0.98] transition-all border border-emerald-400/40 group text-center"
      >
        <Zap className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform fill-amber-300" />
        <span>Open Installed UPI App &amp; Pay ₹{amount}</span>
        <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>

      {/* App-Specific Quick Action Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-left">
          Or Open Your Preferred App Directly:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* PhonePe */}
          <a
            href={phonePeUrl}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#5f259f]/20 hover:bg-[#5f259f]/35 border border-[#5f259f]/50 text-white transition-all active:scale-95 group"
            title="Open PhonePe App"
          >
            <div className="w-7 h-7 rounded-lg bg-[#5f259f] flex items-center justify-center font-black text-xs text-white shadow-sm">
              पे
            </div>
            <span className="text-[11px] font-bold text-purple-200 mt-1.5">PhonePe</span>
            <span className="text-[9px] text-purple-300/70">1-Tap Open</span>
          </a>

          {/* Google Pay */}
          <a
            href={gPayUrl}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/50 text-white transition-all active:scale-95 group"
            title="Open Google Pay App"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
              G
            </div>
            <span className="text-[11px] font-bold text-blue-200 mt-1.5">Google Pay</span>
            <span className="text-[9px] text-blue-300/70">1-Tap Open</span>
          </a>

          {/* Paytm */}
          <a
            href={paytmUrl}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 border border-cyan-500/50 text-white transition-all active:scale-95 group"
            title="Open Paytm App"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
              Pay
            </div>
            <span className="text-[11px] font-bold text-cyan-200 mt-1.5">Paytm</span>
            <span className="text-[9px] text-cyan-300/70">1-Tap Open</span>
          </a>
        </div>
      </div>

      {/* Copy UPI ID Bar */}
      <div className="bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
        <div className="text-left overflow-hidden">
          <span className="text-[10px] text-slate-400 block font-medium">Official UPI ID:</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-orange-400 truncate block">
            {upiId}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyUpi}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-200"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
