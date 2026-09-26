import React from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Store,
  Clock,
  Car,
  Compass,
} from "lucide-react";

interface VenueMapSectionProps {
  venue?: string;
  reportingTime?: string;
  eventTime?: string;
}

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Saurabh+super+store/@25.8315539,85.8138031,13.14z/data=!4m14!1m7!3m6!1s0x39ed910063c15091:0x2892b03bad3d7306!2sSaurabh+super+store!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv!3m5!1s0x39ed910063c15091:0x2892b03bad3d7306!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=25.8256946,85.8242428";

export default function VenueMapSection({
  venue = "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
  reportingTime = "05:15 AM IST",
  eventTime = "06:00 AM IST",
}: VenueMapSectionProps) {
  return (
    <section id="location" className="py-20 bg-[#04160e] border-t border-b border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Google Maps Location • आयोजन स्थल</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            गूगल मैप लोकेशन एवं स्थल (Event Location)
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            दौड़ स्थल पर सुगमता से पहुंचने के लिए नीचे दिए गए गूगल मैप एवं नेविगेशन का उपयोग करें।
          </p>
        </div>

        {/* Big Picture Map Card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-700/70 shadow-2xl bg-[#08291b] mb-10 group">
          {/* Top Info Bar inside Map Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#031c11] via-[#052b1b] to-[#031c11] border-b border-emerald-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                  Live Venue Pin (सटीक स्थान)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {venue}, मालती, समस्तीपुर
              </h3>
              <p className="text-xs text-emerald-300/80 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>लैंडमार्क: सौरभ सुपर स्टोर (Saurabh Super Store)</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Google Maps में खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 hover:text-white text-xs font-bold transition-all"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>रास्ता देखें (Directions)</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Big Picture Embed */}
          <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-[#0a2016]">
            <iframe
              src="https://maps.google.com/maps?q=25.8256946,85.8242428&hl=hi&z=16&output=embed"
              title="Paryavaran Marathon 2026 Venue - Saurabh Super Store, Malti, Samastipur"
              className="w-full h-full border-0 filter contrast-[1.05]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Quick Action Overlay Badge (Bottom Left) */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-950/90 backdrop-blur-md border border-emerald-700/60 p-4 rounded-2xl shadow-2xl text-xs space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Saurabh Super Store / विद्यालय परिसर
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/40">
                  25.8257° N, 85.8242° E
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                यह 5 KM पर्यावरण दौड़ का मुख्य स्टार्टिंग एवं फिनिशिंग पॉइंट है। आयोजन स्थल पर वाहन पार्किंग एवं हेल्पडेस्क उपलब्ध है।
              </p>
              <div className="flex items-center justify-between pt-1">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold underline inline-flex items-center gap-1"
                >
                  <span>बड़ा मैप देखें (View Full Map)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-400 text-[11px]">समस्तीपुर, बिहार</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Detail Info Cards Below Map */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-md hover:border-emerald-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase">मुख्य आयोजन स्थल</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              {venue}
            </p>
            <p className="text-[11px] text-emerald-400/80">ग्राम: मालती पूर्वी, समस्तीपुर</p>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-md hover:border-emerald-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase">प्रमुख लैंडमार्क</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              सौरभ सुपर स्टोर (Saurabh Super Store)
            </p>
            <p className="text-[11px] text-amber-400/80">मुख्य सड़क के ठीक सामने स्थित</p>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-md hover:border-emerald-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase">समय सारणी</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              रिपोर्टिंग: <strong>{reportingTime}</strong>
            </p>
            <p className="text-xs text-amber-300 font-bold">
              दौड़ प्रारंभ: {eventTime}
            </p>
          </div>

          <div className="bg-[#08291b] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-md hover:border-emerald-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase">पार्किंग एवं सहायता</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              धावकों एवं दर्शकों हेतु स्कूल प्रांगण के पास सुरक्षित पार्किंग व्यवस्था।
            </p>
            <p className="text-[11px] text-emerald-400/80">हेल्पलाइन: 8340477782</p>
          </div>
        </div>
      </div>
    </section>
  );
}
