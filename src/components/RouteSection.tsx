import React from "react";
import { Navigation, Flag, Droplets, CheckCircle2 } from "lucide-react";

export default function RouteSection() {
  const milestones = [
    {
      km: "0.0 KM",
      name: "प्रस्थान स्थल — राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
      surface: "स्कूल परिसर एवं मुख्य मार्ग",
      desc: "उद्घाटन, सामूहिक वार्म-अप, और 5 KM दौड़ का मुख्य फ्लैग-ऑफ।",
      station: "प्रस्थान द्वार • चेस्ट बिब काउंटर",
    },
    {
      km: "1.5 KM",
      name: "मालती पंचायत ग्रीन एवेन्यू",
      surface: "वृक्षारोपित ग्रामीण मार्ग",
      desc: "हरी-भरी सड़कों पर तेज और सीधा मार्ग। अपनी निरंतर गति (pace) बनाए रखने के लिए उपयुक्त।",
      station: "पेयजल केंद्र 1 (Water Station)",
    },
    {
      km: "2.5 KM",
      name: "मध्य टर्निंग लूप (Midway Turn Point)",
      surface: "समतल पक्की सड़क",
      desc: "दौड़ का आधा पड़ाव। यहां से धावक वापस विद्यालय परिसर की दिशा में मुड़ेंगे।",
      station: "चेकपॉइंट • ग्लूकोज / ओआरएस बूथ",
    },
    {
      km: "3.8 KM",
      name: "नहर मार्ग स्प्रिंट (Canal Road Stretch)",
      surface: "खुला प्राकृतिक मार्ग",
      desc: "अंतिम 1.2 किलोमीटर का स्प्रिंट जहाँ धावक अपने स्थान को बेहतर करने के लिए गति बढ़ाते हैं।",
      station: "पेयजल केंद्र 2 • प्राथमिक उपचार",
    },
    {
      km: "5.0 KM",
      name: "समापन स्थल — राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
      surface: "विद्यालय मुख्य प्रांगण",
      desc: "फिनिश लाइन को पार करें और आधिकारिक पुरस्कार व मेडल समारोह में भाग लें!",
      station: "फिनिश लाइन • साइकिल/शूज/जर्सी/मेडल वितरण",
    },
  ];

  return (
    <section id="route" className="py-20 bg-[#061e14] border-t border-b border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5" />
            <span>5 KM Race Route</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            पर्यावरण मैराथन (5 KM) दौड़ मार्ग
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी से प्रारंभ होकर मालती पंचायत के प्राकृतिक
            हरियाली भरे मार्ग से होते हुए 5 किलोमीटर की दौड़।
          </p>
        </div>

        {/* Milestone Timeline */}
        <div className="max-w-4xl mx-auto space-y-6">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="relative pl-8 sm:pl-10 before:content-[''] before:absolute before:left-[15px] sm:before:left-[19px] before:top-8 before:bottom-0 before:w-0.5 before:bg-emerald-800/80 last:before:hidden group"
            >
              {/* Bullet Node */}
              <div className="absolute left-0 top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0a2f1e] border-2 border-emerald-400 flex items-center justify-center text-xs font-black text-white group-hover:scale-110 group-hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/30">
                {idx + 1}
              </div>

              {/* Content Card */}
              <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 sm:p-6 hover:border-emerald-400/50 transition-all shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                    {item.km}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">{item.surface}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-2 rounded-lg border border-emerald-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>व्यवस्था: {item.station}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
