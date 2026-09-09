"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Ticket,
  Printer,
  AlertTriangle,
  Loader2,
  Calendar,
  MapPin,
  Flame,
} from "lucide-react";

interface LookupResult {
  registrationId: string;
  registrationNumber: string | null;
  bibNumber: string | null;
  registrationStatus: string; // PENDING, CONFIRMED, REJECTED, CANCELLED
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  tshirtSize?: string;
  bloodGroup?: string;
  paymentStatus: string;
  paymentAmount: number;
  transactionId?: string | null;
  rejectionReason?: string | null;
  eventDate: string;
  eventTime: string;
  venue: string;
}

export default function LookupPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResult(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your Mobile number, Email, or Registration ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "No registration found. Please check your query.");
        return;
      }

      setResult(data.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error occurred while fetching your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Participant Status Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Check My Registration
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Enter your 10-digit registered Mobile Number, Email Address, or Registration Reference
            ID to look up your live status and access your Digital Registration Card.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Mobile, Email, or Bib / Reg No (e.g. 001)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-32 py-4 text-sm sm:text-base text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl athletic-gradient text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Private search: Participant records are protected and only shown to the registrant.
            </p>
          </form>

          {errorMessage && (
            <div className="mt-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  Participant Name
                </span>
                <h2 className="text-2xl font-black text-white">{result.fullName}</h2>
                <span className="text-xs text-slate-400">
                  {result.city}, {result.state} • Mobile: {result.mobile}
                </span>
              </div>

              {/* Status Badges */}
              <div className="flex flex-col sm:items-end gap-1.5">
                {result.registrationStatus === "CONFIRMED" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Registration Confirmed
                  </span>
                )}
                {result.registrationStatus === "PENDING" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    Pending Organizer Review
                  </span>
                )}
                {result.registrationStatus === "REJECTED" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                    <XCircle className="w-4 h-4" />
                    Registration Rejected
                  </span>
                )}

                <span className="text-[11px] text-slate-400">
                  Payment Status:{" "}
                  <strong
                    className={
                      result.paymentStatus === "VERIFIED"
                        ? "text-emerald-400"
                        : result.paymentStatus === "REJECTED"
                        ? "text-rose-400"
                        : "text-amber-400"
                    }
                  >
                    {result.paymentStatus}
                  </strong>
                </span>
              </div>
            </div>

            {/* Confirmed Details / Bib Highlight */}
            {result.registrationStatus === "CONFIRMED" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Bib Number
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                      {result.bibNumber || "ASSIGNED"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Registration No.
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white font-mono">
                      {result.registrationNumber}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Race Distance
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white">5 KM Timed</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>{result.eventDate} at {result.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{result.venue}</span>
                  </div>
                </div>

                {/* Direct CTA to Digital Card */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/card/${result.registrationId}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl athletic-gradient text-white text-sm font-bold shadow-lg shadow-orange-600/30 hover:opacity-95"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View &amp; Print Digital Registration Card</span>
                  </Link>
                </div>
              </div>
            ) : result.registrationStatus === "REJECTED" ? (
              /* Rejected Details */
              <div className="space-y-4 bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-rose-300 uppercase">
                  Payment Verification Unsuccessful
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reason provided by race director:{" "}
                  <strong className="text-rose-400">
                    {result.rejectionReason || "UTR number or proof could not be verified in the bank statement."}
                  </strong>
                </p>
                <div className="pt-2">
                  <Link
                    href={`/payment/${result.registrationId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl athletic-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    <span>Resubmit PhonePe UTR Reference</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Pending Details */
              <div className="space-y-4 bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-amber-300 uppercase">
                  Under Manual Review
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your registration information has been recorded and is currently in the verification queue.
                  {result.transactionId ? (
                    <>
                      {" "}
                      Submitted UTR reference:{" "}
                      <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {result.transactionId}
                      </code>
                    </>
                  ) : (
                    " You have not yet submitted your PhonePe Transaction/UTR reference."
                  )}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/payment/${result.registrationId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold"
                  >
                    <span>Open PhonePe Payment &amp; Submission Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
