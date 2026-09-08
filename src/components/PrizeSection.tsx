import React from "react";
import { Trophy, Award, Medal, Bike, Shirt, Footprints, Sparkles, Check } from "lucide-react";

export default function PrizeSection() {
  const podiumPrizes = [
    {
      rank: "1st Prize",
      rankHindi: "प्रथम पुरस्कार",
      item: "Cycle",
      itemHindi: "साइकिल 🚲",
      desc: "Brand new high-performance bicycle for the 1st place finisher.",
      badge: "🥇 Winner",
      color: "from-amber-400 to-yellow-600",
      borderColor: "border-amber-400/60",
      bgGlow: "shadow-amber-500/20",
      icon: <Bike className="w-12 h-12 text-amber-300" />,
    },
    {
      rank: "2nd Prize",
      rankHindi: "द्वितीय पुरस्कार",
      item: "Running Shoes",
      itemHindi: "रनिंग शूज 👟",
      desc: "Premium branded athletic distance running shoes for 2nd place.",
      badge: "🥈 Runner Up",
      color: "from-slate-200 to-slate-400",
      borderColor: "border-slate-300/60",
      bgGlow: "shadow-slate-400/20",
      icon: <Footprints className="w-12 h-12 text-slate-200" />,
    },
    {
      rank: "3rd Prize",
      rankHindi: "तृतीय पुरस्कार",
      item: "Running Jersey",
      itemHindi: "रनिंग जर्सी 🎽",
      desc: "Professional breathable marathon performance jersey for 3rd place.",
      badge: "🥉 2nd Runner Up",
      color: "from-amber-600 to-orange-700",
      borderColor: "border-amber-600/60",
      bgGlow: "shadow-amber-700/20",
      icon: <Shirt className="w-12 h-12 text-amber-500" />,
    },
  ];

  return (
    <section id="prizes" className="py-20 bg-[#072116] border-t border-b border-emerald-900/80 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Official Event Awards</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            आकर्षक पुरस्कार सूची
          </h2>
          <p className="text-base sm:text-lg text-emerald-200 font-semibold">
            Prizes &amp; Recognition for Top Finishers
          </p>
          <p className="text-xs sm:text-sm text-emerald-300/80 max-w-2xl mx-auto">
            पर्यावरण मैराथन (5 KM Run) के विजेताओं के लिए विशेष पुरस्कार एवं मेडल। हर कदम प्रकृति के नाम!
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-10">
          {podiumPrizes.map((prize, idx) => (
            <div
              key={idx}
              className={`bg-[#0a2b1c] border-2 ${prize.borderColor} rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl ${prize.bgGlow} hover:scale-[1.02] transition-transform relative group`}
            >
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/40 border border-white/20 text-white">
                {prize.badge}
              </div>

              <div className="w-20 h-20 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                {prize.icon}
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                  {prize.rankHindi} • {prize.rank}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {prize.itemHindi}
                </h3>
              </div>

              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {prize.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Top 10 & Top 30 Highlight Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Top 10 Card */}
          <div className="bg-[#0c3120] border-2 border-emerald-500/40 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                Top 10 Finishers
              </span>
              <h4 className="text-xl font-black text-white">
                Top 10 tak prize 🏆
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                विशेष आकर्षक उपहार सभी टॉप 10 धावकों के लिए
              </p>
            </div>
          </div>

          {/* Top 30 Card */}
          <div className="bg-[#0c3120] border-2 border-emerald-500/40 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Medal className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">
                Top 30 Finishers
              </span>
              <h4 className="text-xl font-black text-white">
                Top 30 tak Medal 🎖️
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                आधिकारिक पर्यावरण मैराथन मेडल सभी टॉप 30 धावकों के लिए
              </p>
            </div>
          </div>
        </div>

        {/* Bottom banner pledge */}
        <div className="mt-12 text-center max-w-2xl mx-auto bg-emerald-950/70 p-4 rounded-2xl border border-emerald-800 text-xs text-emerald-200">
          🌱 <strong>पर्यावरण संकल्प:</strong> &quot;आइए, पर्यावरण को सुरक्षित रखें और स्वस्थ जीवनशैली को अपनाएं !&quot;
        </div>
      </div>
    </section>
  );
}
