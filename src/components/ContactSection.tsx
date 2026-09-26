import React from "react";
import { Phone, MapPin, UserCheck, MessageSquare, Calendar } from "lucide-react";

interface ContactSectionProps {
  contactPhone?: string;
  venue?: string;
  organizerName?: string;
}

export default function ContactSection({
  contactPhone = "8340477782",
  venue = "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
  organizerName = "संस्थापक: नीरज स्टार",
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-[#051c13] border-t border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Event Helpline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            संपर्क एवं सहायता (Contact Us)
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            Contact for Registration &amp; Event Information
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Helpline Phone */}
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-3xl p-6 text-center space-y-3 shadow-lg hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">आधिकारिक हेल्पलाइन</h3>
            <p className="text-xs text-emerald-300/70">कॉल या व्हाट्सएप करें</p>
            <a
              href={`tel:${contactPhone}`}
              className="inline-block text-lg font-black text-amber-300 hover:text-white transition-colors"
            >
              {contactPhone}
            </a>
          </div>

          {/* Card 2: Founder / Organizer */}
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-3xl p-6 text-center space-y-3 shadow-lg hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mx-auto flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">आयोजन नेतृत्व</h3>
            <p className="text-xs text-emerald-300/70">मैराथन संस्थापक</p>
            <p className="text-sm font-black text-white">{organizerName}</p>
          </div>

          {/* Card 3: Venue & Location */}
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-3xl p-6 text-center space-y-3 shadow-lg hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">दौड़ स्थल (Venue)</h3>
            <p className="text-xs text-emerald-300/70">मालती, समस्तीपुर</p>
            <p className="text-xs font-bold text-white leading-relaxed">{venue}</p>
            <div className="pt-2">
              <a
                href="https://www.google.com/maps/place/Saurabh+super+store/@25.8315539,85.8138031,13.14z/data=!4m14!1m7!3m6!1s0x39ed910063c15091:0x2892b03bad3d7306!2sSaurabh+super+store!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv!3m5!1s0x39ed910063c15091:0x2892b03bad3d7306!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-amber-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Maps Location 📍</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
