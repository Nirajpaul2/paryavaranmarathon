import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import PrintButton from "./PrintButton";
import { Flame, Trophy, Calendar, MapPin, CheckCircle2, QrCode, ArrowLeft } from "lucide-react";

interface CardPageProps {
  params: {
    registrationId: string;
  };
}

export default async function RegistrationCardPage({ params }: CardPageProps) {
  const { registrationId } = params;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      participant: true,
      payment: true,
    },
  });

  if (!registration || !registration.participant) {
    notFound();
  }

  const settings = await prisma.eventSetting.findFirst();
  const eventName = settings?.eventName || "10 KM City Marathon 2026";
  const eventDate = settings?.eventDate || "Sunday, October 18, 2026";
  const eventTime = settings?.eventTime || "05:30 AM IST";
  const reportingTime = settings?.reportingTime || "04:45 AM IST";
  const venue = settings?.venue || "Central Stadium Arena & Sports Complex";

  const isConfirmed = registration.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col text-slate-100">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Navigation & Print Action Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between mb-8">
          <Link
            href="/lookup"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Status Lookup</span>
          </Link>

          {isConfirmed && <PrintButton />}
        </div>

        {/* Status Warning if not confirmed */}
        {!isConfirmed && (
          <div className="no-print mb-8 bg-amber-500/10 border border-amber-500/40 rounded-2xl p-6 text-center space-y-3">
            <h2 className="text-xl font-bold text-amber-300 uppercase">
              Registration Under Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your registration card and Bib number will be officially activated once your PhonePe
              payment is verified by our race director.
            </p>
            <Link
              href={`/payment/${registration.id}`}
              className="inline-block mt-2 px-5 py-2.5 rounded-xl athletic-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
            >
              Check Payment Status
            </Link>
          </div>
        )}

        {/* Digital Registration Pass / Bib Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl print:border-black print:bg-white print:text-black">
          {/* Card Header Strip */}
          <div className="athletic-gradient p-6 sm:p-8 text-white relative overflow-hidden print:bg-black print:text-black">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                  Official Runner Pass
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-2">
                  {eventName}
                </h1>
                <p className="text-xs font-semibold text-orange-100">
                  Certified 10 KM Road Running Challenge
                </p>
              </div>

              <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between">
                <span className="text-3xl sm:text-4xl font-black">10 KM</span>
                <span className="text-xs uppercase tracking-wider font-bold text-orange-100">
                  Chip Timed Run
                </span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-10 space-y-8 print:p-6">
            {/* Center Bib Display */}
            <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-2 print:border-slate-400 print:bg-white">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 print:text-slate-600 block">
                Official Marathon Bib Number
              </span>
              <div className="text-5xl sm:text-7xl font-black text-orange-400 font-mono tracking-tight print:text-black">
                {registration.bibNumber || "PENDING"}
              </div>
              <span className="text-xs font-semibold text-slate-500 block">
                Registration Ref: <span className="font-mono text-slate-300 print:text-black">{registration.registrationNumber || registration.id.slice(0, 10).toUpperCase()}</span>
              </span>
            </div>

            {/* Participant Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs border-b border-slate-800 pb-8 print:border-slate-300">
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Participant Name
                </span>
                <span className="text-base sm:text-lg font-black text-white print:text-black">
                  {registration.participant.fullName}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Gender &amp; DOB
                </span>
                <span className="text-sm font-bold text-white print:text-black">
                  {registration.participant.gender} • {registration.participant.dob}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  T-Shirt &amp; Blood
                </span>
                <span className="text-sm font-bold text-white print:text-black">
                  Size {registration.participant.tshirtSize || "M"} • {registration.participant.bloodGroup || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Emergency Phone
                </span>
                <span className="text-sm font-bold text-white print:text-black">
                  +91 {registration.participant.emergencyMobile}
                </span>
              </div>
            </div>

            {/* Event Schedule & Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-500 font-semibold uppercase block text-[10px]">
                  Event Date
                </span>
                <span className="font-bold text-white print:text-black">{eventDate}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-500 font-semibold uppercase block text-[10px]">
                  Schedule
                </span>
                <span className="font-bold text-white print:text-black">
                  Reporting: {reportingTime} | Start: {eventTime}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-500 font-semibold uppercase block text-[10px]">
                  Venue
                </span>
                <span className="font-bold text-white print:text-black truncate block">
                  {venue}
                </span>
              </div>
            </div>

            {/* Verification Watermark & QR Pass */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase print:text-black">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Status: {registration.status} • Payment {registration.payment?.status || "PENDING"}
                  </span>
                </div>
                <p className="text-[11px]">
                  Present this card at the Bib Expo along with an original government photo ID.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl shadow-inner border border-slate-200 text-center">
                <div className="w-20 h-20 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-700 block mt-0.5">
                  VERIFIED-10K
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
