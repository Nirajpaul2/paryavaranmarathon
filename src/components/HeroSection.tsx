import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Users,
  Phone,
  Sparkles,
} from "lucide-react";

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
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Botanical nature background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-lime-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Go Green & Perk Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                Go Green Initiative
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                5 KM Running Challenge
              </span>
              <a
                href="https://play.google.com/store/apps/details?id=com.aiwazir.sanatan.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Bonus: 1 Month Free Sanatan Dham App
              </a>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] uppercase">
                पर्यावरण मैराथन
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-wider mt-1">
                  PARYAVARAN MARATHON
                </span>
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 tracking-widest mt-1">
                  SAMASTIPUR • मालती
                </span>
              </h1>
            </div>

            {/* Main Slogan from Banner */}
            <div className="bg-[#0a2e1d]/80 border-l-4 border-emerald-500 p-4 rounded-r-2xl max-w-xl mx-auto lg:mx-0">
              <p className="text-xl sm:text-2xl font-black text-emerald-200 italic">
                “हर कदम प्रकृति के नाम”
              </p>
              <p className="text-xs sm:text-sm font-semibold text-emerald-300/90 mt-0.5">
                Fit For a Greener Tomorrow
              </p>
            </div>

            {/* Event Key Highlights Strip */}
            <div className="space-y-2 text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>दिनांक:</strong> 27 सितंबर 2026 (रविवार)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>स्थान:</strong> {venue || "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी, समस्तीपुर"}{" "}
                  <a
                    href="https://www.google.com/maps/place/Saurabh+super+store/@25.8315539,85.8138031,13.14z/data=!4m14!1m7!3m6!1s0x39ed910063c15091:0x2892b03bad3d7306!2sSaurabh+super+store!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv!3m5!1s0x39ed910063c15091:0x2892b03bad3d7306!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-semibold text-xs ml-1"
                  >
                    <span>(Google Maps 📍)</span>
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>हेल्पलाइन:</strong> 8340477782 (संस्थापक: नीरज स्टार)
                </span>
              </div>
            </div>

            {/* Registration Fee & Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl eco-gradient text-white text-base font-black shadow-xl shadow-emerald-700/40 hover:opacity-95 hover:scale-105 active:scale-95 transition-all border border-emerald-400/40"
              >
                <span>Register Now — ₹{fee}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#prizes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/70 text-emerald-200 text-sm font-bold transition-all hover:text-white"
              >
                <span>🏆 View Prizes (Cycle, Shoes, Jersey)</span>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-emerald-300/80 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct PhonePe QR Registration • Official Bib • ₹99 Entry</span>
            </div>
          </div>

          {/* Right Column: Official Banner Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-600/40 group hover:border-emerald-500 transition-all bg-[#092e1e]">
              <Image
                src="/images/paryavaran-banner.jpg"
                alt="पर्यावरण मैराथन समस्तीपुर - 5 KM दौड़ आधिकारिक पोस्टर"
                width={720}
                height={1080}
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                priority
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow">
                  Official Event Poster • मालती समस्तीपुर
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Quick Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors shadow-lg">
            <div className="text-emerald-400 font-extrabold text-2xl sm:text-3xl mb-1">
              5 KM
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-200/80 font-bold">
              पर्यावरण दौड़ (Run)
            </div>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors shadow-lg">
            <div className="text-white font-extrabold text-lg sm:text-xl mb-1">
              27 Sep 2026
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-200/80 font-bold">
              रविवार (Sunday)
            </div>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors shadow-lg">
            <div className="text-amber-400 font-extrabold text-2xl sm:text-3xl mb-1">
              ₹99/-
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-200/80 font-bold">
              रजिस्ट्रेशन शुल्क
            </div>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors shadow-lg">
            <div className="text-white font-extrabold text-lg sm:text-xl mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              Cycle, Shoes
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-200/80 font-bold">
              Top 30 Medals
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
