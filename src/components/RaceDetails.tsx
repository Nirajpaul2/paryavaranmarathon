import React from "react";
import { Timer, HeartPulse, Droplets, Medal, Flag, Sparkles } from "lucide-react";

interface RaceDetailsProps {
  eventDate: string;
  eventTime: string;
  reportingTime: string;
  venue: string;
  fee: number;
}

export default function RaceDetails({
  eventDate,
  eventTime,
  reportingTime,
  venue,
  fee,
}: RaceDetailsProps) {
  const raceFeatures = [
    {
      icon: <Timer className="w-6 h-6 text-orange-400" />,
      title: "100 Mins Cut-Off",
      desc: "Generous timing window suitable for both competitive racers and steady recreational runners.",
    },
    {
      icon: <Droplets className="w-6 h-6 text-cyan-400" />,
      title: "4 Hydration Zones",
      desc: "Electrolyte drinks, cold water, and fresh orange wedges stationed every 2.5 KM along the circuit.",
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-rose-400" />,
      title: "Medical & Ambulance Support",
      desc: "Mobile paramedic bikes and stationary first-aid booths at every 2 KM with emergency response.",
    },
    {
      icon: <Medal className="w-6 h-6 text-amber-400" />,
      title: "Official Finisher Medal",
      desc: "Custom heavyweight commemorative medal awarded to every runner crossing the official finish line.",
    },
    {
      icon: <Flag className="w-6 h-6 text-emerald-400" />,
      title: "Baggage & Rest Areas",
      desc: "Secure baggage counter, dedicated runner warm-up arena, clean restrooms, and recovery stretch zones.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "RFID Chip Timing",
      desc: "High-precision timing mats at start, 5 KM split, and finish line for instant digital certificates.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#0d1322] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">
            Race Specifications
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Everything You Need To Know
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            The 10 KM road race is designed for endurance, safety, and an electric race-day
            atmosphere. Fully barricaded roads with traffic management to give you a personal best
            experience.
          </p>
        </div>

        {/* Essential Schedule Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            Race Day Schedule &amp; Logistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0 md:pr-6 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Reporting &amp; Warm-up</span>
              <div className="text-2xl font-black text-white">{reportingTime}</div>
              <p className="text-xs text-slate-400">Bib scanning, baggage drop, and group warm-up session</p>
            </div>
            <div className="pt-4 md:pt-0 md:px-6 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Official Flag-off</span>
              <div className="text-2xl font-black text-orange-400">{eventTime}</div>
              <p className="text-xs text-slate-400">Wave 1 (Elite &amp; Open runners) flags off promptly</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Venue &amp; Assembly</span>
              <div className="text-lg font-bold text-white truncate">{venue}</div>
              <p className="text-xs text-slate-400">Parking available on stadium east grounds</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raceFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
