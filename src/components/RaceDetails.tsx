import React from "react";
import { Timer, HeartPulse, Droplets, Medal, Flag, Sparkles, MapPin, Calendar } from "lucide-react";

interface RaceDetailsProps {
  eventDate: string;
  eventTime: string;
  reportingTime: string;
  venue: string;
  fee: number;
}

export default function RaceDetails({
  eventDate = "27 सितंबर 2026 (रविवार)",
  eventTime = "06:45 AM IST",
  reportingTime = "06:00 AM IST",
  venue = "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
  fee = 99,
}: RaceDetailsProps) {
  const raceFeatures = [
    {
      icon: <Medal className="w-6 h-6 text-amber-400" />,
      title: "साइकिल, शूज एवं जर्सी पुरस्कार",
      desc: "प्रथम पुरस्कार साइकिल 🚲, द्वितीय रनिंग शूज 👟, तृतीय रनिंग जर्सी 🎽, टॉप 10 तक विशेष उपहार एवं टॉप 30 तक मेडल!",
    },
    {
      icon: <Timer className="w-6 h-6 text-emerald-400" />,
      title: "5 KM पर्यावरण दौड़",
      desc: "प्राकृतिक एवं सुरक्षित हरियाली मार्ग पर 5 किलोमीटर की दौड़। सभी स्तर के धावकों के लिए उपयुक्त।",
    },
    {
      icon: <Droplets className="w-6 h-6 text-cyan-400" />,
      title: "पेयजल एवं रिफ्रेशमेंट",
      desc: "दौड़ मार्ग पर स्वच्छ पेयजल, ओआरएस एवं ऊर्जावर्धक रिफ्रेशमेंट की समुचित व्यवस्था।",
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-rose-400" />,
      title: "प्राथमिक चिकित्सा एवं सुरक्षा",
      desc: "दौड़ के दौरान किसी भी आपात स्थिति के लिए प्राथमिक चिकित्सा बूथ एवं स्वयंसेवक उपस्थित रहेंगे।",
    },
    {
      icon: <Flag className="w-6 h-6 text-emerald-400" />,
      title: "स्थान व प्रस्थान स्थल",
      desc: "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी परिसर से दौड़ प्रारंभ होकर वहीं समापन होगी।",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-lime-400" />,
      title: "पर्यावरण जागरूकता संकल्प",
      desc: "हर कदम प्रकृति के नाम — दौड़ के माध्यम से वृक्षारोपण एवं पर्यावरण सुरक्षा का संदेश फैलाना।",
    },
  ];

  return (
    <section id="details" className="py-20 bg-[#051c13] border-t border-b border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            दौड़ विवरण एवं समय सारणी
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Race Specifications &amp; Schedule
          </p>
          <p className="mt-4 text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            पर्यावरण मैराथन समस्तीपुर का मुख्य उद्देश्य युवाओं में स्वास्थ्य, खेल भावना तथा प्रकृति
            संरक्षण के प्रति जागरूकता उत्पन्न करना है।
          </p>
        </div>

        {/* Essential Schedule Card */}
        <div className="bg-[#082a1c] border border-emerald-800/90 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            महत्वपूर्ण कार्यक्रम विवरण (Event Logistics)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-emerald-800/80">
            <div className="pt-4 md:pt-0 md:pr-6 space-y-1">
              <span className="text-xs text-emerald-400 uppercase font-bold">रिपोर्टिंग समय</span>
              <div className="text-2xl font-black text-white">{reportingTime}</div>
              <p className="text-xs text-emerald-300/70">चेस्ट बिब वितरण एवं वार्म-अप सत्र</p>
            </div>
            <div className="pt-4 md:pt-0 md:px-6 space-y-1">
              <span className="text-xs text-amber-400 uppercase font-bold">दौड़ प्रारंभ (Flag-off)</span>
              <div className="text-2xl font-black text-amber-300">{eventTime}</div>
              <p className="text-xs text-emerald-300/70">5 KM दौड़ का मुख्य प्रस्थान</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
              <span className="text-xs text-emerald-400 uppercase font-bold">मुख्य स्थल (Venue)</span>
              <div className="text-base sm:text-lg font-bold text-white">{venue}</div>
              <p className="text-xs text-emerald-300/70">मालती, समस्तीपुर</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raceFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#08291b] border border-emerald-900/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-[#0a3322] transition-all group shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
