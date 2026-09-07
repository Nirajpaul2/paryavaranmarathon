import React from "react";
import { Medal, Shirt, Ticket, Award, Coffee, Camera, Check } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Medal className="w-8 h-8 text-amber-400" />,
      title: "Finisher Medal",
      desc: "Custom die-cast metal medal engraved with 10 KM Finisher emblem and year ribbon.",
    },
    {
      icon: <Shirt className="w-8 h-8 text-orange-400" />,
      title: "Technical Race T-Shirt",
      desc: "Lightweight, moisture-wicking athletic running tee in your selected size (XS to XXL).",
    },
    {
      icon: <Ticket className="w-8 h-8 text-cyan-400" />,
      title: "Personalized Race Bib",
      desc: "Custom bib with your name, assigned bib number, and embedded precision RFID timing chip.",
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-400" />,
      title: "Timing E-Certificate",
      desc: "Instant digital timing certificate with gross time, net chip time, and overall ranking.",
    },
    {
      icon: <Coffee className="w-8 h-8 text-rose-400" />,
      title: "Post-Race Breakfast",
      desc: "Nutritious recovery meal, hot breakfast, fresh juices, bananas, and hydration boxes.",
    },
    {
      icon: <Camera className="w-8 h-8 text-purple-400" />,
      title: "Free High-Res Photos",
      desc: "Professional sports photographers capturing your action shots at the start, course, and finish.",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-[#090e1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Check className="w-3.5 h-3.5" />
            <span>Included With Every Registration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Participant Race Kit &amp; Benefits
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Every registered runner receives the complete official marathon kit and race-day perks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 hover:border-orange-500/50 hover:bg-slate-900 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
