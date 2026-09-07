import React from "react";
import { Navigation, Flag, Droplets, HeartPulse, CheckCircle2 } from "lucide-react";

export default function RouteSection() {
  const milestones = [
    {
      km: "0.0 KM",
      name: "Start Gantry — Central Stadium Arena",
      surface: "Wide Asphalt Road",
      desc: "Wide start chute with electronic chip timing mat. High energy crowd send-off and pace pacers (50m, 60m, 70m).",
      station: "Pacing Chutes & Warmup Zone",
    },
    {
      km: "2.5 KM",
      name: "Riverbank Promenade Straight",
      surface: "Flat Riverside Parkway",
      desc: "Fast, flat tree-lined boulevard along the riverbank. Ideal stretch to settle into your target race pace.",
      station: "Hydration Station 1 (Water & Fast&Up)",
    },
    {
      km: "5.0 KM",
      name: "Midway Split — Heritage Clock Tower",
      surface: "Gentle Incline",
      desc: "Official 5K split timing sensor. Crowd cheering zone, music DJ station, and medical first-aid patrol.",
      station: "Timing Mat + Medical Van + Orange Wedges",
    },
    {
      km: "7.5 KM",
      name: "Flyover Elevation Challenge",
      surface: "Elevation Gain: +18m",
      desc: "Gradual scenic overpass ramp that challenges endurance before the exhilarating downhill transition.",
      station: "Hydration Station 3 (Electrolytes + Wet Sponges)",
    },
    {
      km: "10.0 KM",
      name: "Finish Line Arena — Central Stadium Track",
      surface: "Synthetic Athletic Track",
      desc: "Enter the stadium gates for a grandstand 200m sprint to glory. Immediate medal handover and recovery refreshments.",
      station: "Finish Timing Mat • Medals • Breakfast Zone",
    },
  ];

  return (
    <section id="route" className="py-20 bg-[#090e1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>Certified 10 KM Course</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            The 10 KM Race Route
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Traffic-free, fully marshalled, and barricaded scenic circuit designed for your personal best.
          </p>
        </div>

        {/* Milestone Timeline */}
        <div className="max-w-4xl mx-auto space-y-6">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="relative pl-8 sm:pl-10 before:content-[''] before:absolute before:left-[15px] sm:before:left-[19px] before:top-8 before:bottom-0 before:w-0.5 before:bg-slate-800 last:before:hidden group"
            >
              {/* Bullet Node */}
              <div className="absolute left-0 top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center text-xs font-black text-white group-hover:scale-110 group-hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20">
                {idx + 1}
              </div>

              {/* Content Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                    {item.km}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.surface}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Support on site: {item.station}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
