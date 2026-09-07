import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Trophy, Users, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface HeroSectionProps {
  eventName: string;
  tagline: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  fee: number;
  capacity: number;
}

export default function HeroSection({
  eventName,
  tagline,
  eventDate,
  eventTime,
  venue,
  fee,
  capacity,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background athletic glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Official 10 KM Timed Road Challenge • Edition 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.08]">
            Run <span className="text-transparent bg-clip-text athletic-gradient">10 KM</span>.
            <br />
            Challenge Yourself.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Finish Strong.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {tagline || "Join us for an unforgettable 10 KM running experience."} Lace up your shoes,
            push your limits, and run alongside thousands of passionate athletes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl athletic-gradient text-white text-base font-extrabold shadow-xl shadow-orange-600/30 hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Register Now — ₹{fee}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-base font-bold transition-all hover:text-white"
            >
              Race Details
            </Link>
          </div>

          {/* Payment method trust note */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant PhonePe QR Payment • Verified by Race Officials • Official Bib</span>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Card 1: Distance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors">
            <div className="text-orange-400 font-extrabold text-2xl sm:text-3xl mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-6 h-6 text-orange-500" />
              10 KM
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Certified Distance
            </div>
          </div>

          {/* Card 2: Date & Time */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors">
            <div className="text-white font-extrabold text-lg sm:text-xl mb-1 flex items-center justify-center gap-1 truncate">
              <Calendar className="w-5 h-5 text-orange-400 shrink-0" />
              <span className="truncate">{eventDate.split(",")[0] || "Race Day"}</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Flag-off {eventTime}
            </div>
          </div>

          {/* Card 3: Venue */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors">
            <div className="text-white font-extrabold text-base sm:text-lg mb-1 flex items-center justify-center gap-1 truncate">
              <MapPin className="w-5 h-5 text-orange-400 shrink-0" />
              <span className="truncate">Central Stadium</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold truncate">
              {venue}
            </div>
          </div>

          {/* Card 4: Capacity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors">
            <div className="text-white font-extrabold text-2xl sm:text-3xl mb-1 flex items-center justify-center gap-1">
              <Users className="w-6 h-6 text-orange-400" />
              {capacity}
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Runner Slots
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
